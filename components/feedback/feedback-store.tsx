'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { OVERALL_ID } from '@/lib/feedback-scope'
import { REACTION_META, REACTION_VALUES, type WireReaction } from '@/lib/reactions'

export type Reaction = WireReaction

export type Entry = {
  reaction?: Reaction
  comment?: string
  updatedAt: number
}

export type Feedback = Record<string, Entry>

const STORAGE_KEY = 'addu-plan-feedback:v1'

/**
 * How long the basket waits for the answering to stop before it sends.
 *
 * Long enough that working down a strategy — tap Support, tap Support, tap
 * Concern — is one request rather than three, short enough that a resident who
 * answers one action and closes the tab has almost certainly already been
 * filed. Every send carries the whole basket and replaces the last one, so a
 * coalesced burst loses nothing.
 */
const QUIET_MS = 1200

/** Backoff between retries of a send that failed for a reason that may pass. */
const RETRY_MS = [3000, 8000, 20000, 60000]

/** After this many consecutive failures, wait for an edit or a manual retry. */
const MAX_ATTEMPTS = 6

export type SaveStatus =
  /** Nothing answered yet, so there is nothing to send. */
  | 'idle'
  /** Edits are waiting out the quiet window. */
  | 'pending'
  /** A request is in flight. */
  | 'saving'
  /** Everything on this device is with the council. */
  | 'saved'
  /** The last attempt failed; the basket is still safe on this device. */
  | 'error'

type Ctx = {
  ready: boolean
  feedback: Feedback
  /** Toggling the same reaction clears it. */
  setReaction: (id: string, reaction: Reaction) => void
  setComment: (id: string, comment: string) => void
  remove: (id: string) => void
  /** Withdraws the basket from the council and clears this device. */
  clearAll: () => Promise<void>
  /**
   * Actions answered. The comment on the plan as a whole is not one of them —
   * counting it would print "1 of 230 actions" for someone who has answered no
   * action at all.
   */
  count: number
  /** What has been posted about the plan as a whole, or an empty string. */
  overall: string
  countFor: (ids: string[]) => number
  status: SaveStatus
  /** Why the last send failed, in words a resident can act on. */
  error: string | null
  /** True when the last send replaced a basket this browser had already filed. */
  revised: boolean
  /** When the council last received this basket. */
  savedAt: number | null
  /** Sends now rather than waiting out the quiet window, or after a failure. */
  saveNow: () => void
}

const FeedbackContext = createContext<Ctx | null>(null)

function isEmpty(entry: Entry | undefined) {
  return !entry || (!entry.reaction && !entry.comment?.trim())
}

/**
 * The basket as the endpoint wants it: only entries that say something, in a
 * fixed order so two identical baskets serialise identically and an unchanged
 * basket can be recognised without being sent again.
 */
function toResponses(feedback: Feedback) {
  return Object.entries(feedback)
    .filter(([, entry]) => !isEmpty(entry))
    .map(([actionId, entry]) => ({
      actionId,
      reaction: entry.reaction ?? null,
      comment: entry.comment?.trim() || null,
    }))
    .sort((a, b) => (a.actionId < b.actionId ? -1 : a.actionId > b.actionId ? 1 : 0))
}

const OFFLINE_MESSAGE =
  'Your feedback has not reached us yet — the connection dropped. Your answers are saved on this device and we will keep trying.'

/**
 * Holds the visitor's response to every strategy and action, and keeps the
 * council's copy in step with it.
 *
 * The browser's copy is the working draft: it survives a reload, a closed tab
 * and a return visit. It is also sent as it is made — every edit starts a short
 * quiet window, and when the answering stops the whole basket goes. There is no
 * final step to miss, which is what a consultation that people fill in over
 * several visits needs; the review panel now reads back what has already been
 * filed rather than gating it.
 *
 * Every send carries the entire basket and the endpoint replaces the last one,
 * so a send is idempotent: a coalesced burst, a retry and a resend after a
 * dropped connection all leave the same rows. The database's flood control
 * excludes a submitter's own revisions, so answering 230 actions costs a
 * resident nothing against it.
 *
 * `/api/feedback` rather than the database directly — the server holds the
 * write secret and does the de-duplication.
 */
export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [feedback, setFeedback] = useState<Feedback>({})
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [revised, setRevised] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [ready, setReady] = useState(false)

  // The send loop reads the basket through a ref rather than closing over it,
  // so a keystroke does not have to tear down and rebuild the pending timer.
  const latest = useRef<Feedback>({})
  /** The serialised basket the council last acknowledged. */
  const sent = useRef<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inFlight = useRef(false)
  const attempts = useRef(0)
  const send = useRef<() => void>(() => {})

  useEffect(() => {
    latest.current = feedback
  }, [feedback])

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  const schedule = useCallback(
    (delay: number) => {
      clearTimer()
      timer.current = setTimeout(() => {
        timer.current = null
        send.current()
      }, delay)
    },
    [clearTimer],
  )

  // Hydrate after mount so server and client markup agree.
  //
  // Reading localStorage during render would make the client's markup disagree
  // with the server's — the server cannot see saved responses — and break
  // hydration. Deferring to an effect is the deliberate trade: one extra render
  // on first load in exchange for markup that matches.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as {
          entries?: Feedback
          sent?: string
          savedAt?: number
        }
        const entries = parsed.entries ?? {}
        latest.current = entries
        setFeedback(entries)

        if (parsed.sent) {
          sent.current = parsed.sent
          setSavedAt(parsed.savedAt ?? null)
        }

        // Anything this device holds that the council has not acknowledged goes
        // now: a visit that ended offline, or a last edit whose send never
        // landed, catches up on return rather than waiting for another answer.
        const responses = toResponses(entries)
        if (responses.length) {
          const unsent = JSON.stringify(responses) !== sent.current
          setStatus(unsent ? 'pending' : 'saved')
          if (unsent) schedule(QUIET_MS)
        }
      }
    } catch {
      // Corrupt or blocked storage: start clean rather than break the page.
    }
    setReady(true)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [schedule])

  useEffect(() => {
    if (!ready) return
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ entries: feedback, sent: sent.current, savedAt }),
      )
    } catch {
      // Private browsing / quota — feedback simply won't persist.
    }
  }, [feedback, savedAt, ready])

  /**
   * Takes the basket back out of the consultation.
   *
   * Resolves true only when the council's copy is actually gone, because every
   * caller uses that to decide whether it may clear the device: a device that
   * clears itself first would leave a resident who thinks they have deleted
   * everything with a basket still in the results and no token left to reach
   * it.
   */
  const withdraw = useCallback(async () => {
    inFlight.current = true
    setStatus('saving')
    try {
      const res = await fetch('/api/feedback', { method: 'DELETE' })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setStatus('error')
        setError(
          data.error ??
            'Your feedback could not be withdrawn. Nothing has been changed — please try again.',
        )
        return false
      }
      return true
    } catch {
      setStatus('error')
      setError(
        'Your feedback could not be withdrawn — the connection dropped. Nothing has been changed, so you can try again.',
      )
      return false
    } finally {
      inFlight.current = false
    }
  }, [])

  const doSend = useCallback(() => {
    // Never two at once. The submitter cookie is only set on the way back from
    // the first successful write, so two sends racing before it exists would
    // each mint their own token and file two baskets for one resident. Asked
    // for again rather than dropped, so "Send now" is never a click that does
    // nothing.
    if (inFlight.current) {
      schedule(QUIET_MS)
      return
    }

    const responses = toResponses(latest.current)
    const print = JSON.stringify(responses)

    // Answering nothing is an answer too. Removing responses one at a time down
    // to none used to stop short of the last one — the endpoint has nothing to
    // file, so the council kept whatever was sent before it — which left the
    // device and the results disagreeing in the one case a resident is most
    // likely to care about. An emptied basket withdraws instead.
    if (!responses.length) {
      if (sent.current === null) {
        setStatus('idle')
        return
      }
      void withdraw().then((gone) => {
        if (!gone) return
        sent.current = null
        setRevised(false)
        setSavedAt(null)
        setError(null)
        setStatus('idle')
      })
      return
    }
    if (print === sent.current) {
      setStatus('saved')
      return
    }

    inFlight.current = true
    setStatus('saving')

    const fail = (message: string, retriable: boolean) => {
      attempts.current += 1
      setStatus('error')
      setError(message)
      if (retriable && attempts.current < MAX_ATTEMPTS) {
        schedule(RETRY_MS[Math.min(attempts.current - 1, RETRY_MS.length - 1)]!)
      }
    }

    void (async () => {
      try {
        const res = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ responses }),
        })
        const data = (await res.json().catch(() => ({}))) as { error?: string; revised?: boolean }

        if (!res.ok) {
          fail(
            data.error ??
              'Your feedback could not be sent. Your answers are still on this device — please try again.',
            // A rejected payload will be rejected again; a full queue or a
            // service that is down may not be.
            res.status === 429 || res.status >= 500,
          )
          return
        }

        attempts.current = 0
        sent.current = print
        setRevised(Boolean(data.revised))
        setError(null)
        setSavedAt(Date.now())

        // Edits made while this was in flight are not covered by what it
        // carried, so the basket goes again rather than claiming to be sent.
        const stillDirty = JSON.stringify(toResponses(latest.current)) !== print
        setStatus(stillDirty ? 'pending' : 'saved')
        if (stillDirty) schedule(QUIET_MS)
      } catch {
        // Offline, or the request never reached the server. The basket is still
        // in localStorage, so nothing the visitor typed is lost.
        fail(OFFLINE_MESSAGE, true)
      } finally {
        inFlight.current = false
      }
    })()
  }, [schedule, withdraw])

  // Reached through a ref so `schedule` — which every edit calls — does not
  // have to be rebuilt each time the sender is.
  useEffect(() => {
    send.current = doSend
  }, [doSend])

  /** An edit: restart the quiet window and drop any backoff. */
  const touch = useCallback(() => {
    attempts.current = 0
    setError(null)
    setStatus('pending')
    schedule(QUIET_MS)
  }, [schedule])

  const setReaction = useCallback(
    (id: string, reaction: Reaction) => {
      touch()
      setFeedback((prev) => {
        const next = { ...prev }
        const current = next[id]
        const cleared = current?.reaction === reaction
        const entry: Entry = {
          ...current,
          reaction: cleared ? undefined : reaction,
          updatedAt: Date.now(),
        }
        if (isEmpty(entry)) delete next[id]
        else next[id] = entry
        return next
      })
    },
    [touch],
  )

  const setComment = useCallback(
    (id: string, comment: string) => {
      touch()
      setFeedback((prev) => {
        const next = { ...prev }
        const entry: Entry = { ...next[id], comment, updatedAt: Date.now() }
        if (isEmpty(entry)) delete next[id]
        else next[id] = entry
        return next
      })
    },
    [touch],
  )

  const remove = useCallback(
    (id: string) => {
      touch()
      setFeedback((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    },
    [touch],
  )

  /** The council's copy goes first; the device only follows if that succeeded. */
  const clearAll = useCallback(async () => {
    clearTimer()
    if (!(await withdraw())) return

    attempts.current = 0
    sent.current = null
    setFeedback({})
    setStatus('idle')
    setError(null)
    setRevised(false)
    setSavedAt(null)
  }, [clearTimer, withdraw])

  const saveNow = useCallback(() => {
    attempts.current = 0
    clearTimer()
    send.current()
  }, [clearTimer])

  // A page being hidden is the last moment anything can be sent from it, and on
  // mobile it is usually the only "closing" signal there is. `sendBeacon`
  // survives the teardown that would abort a fetch; its answer is unreadable,
  // so the basket stays marked unsent and simply resends on the next visit if
  // this did not land.
  useEffect(() => {
    const flush = () => {
      // Not while a fetch is in flight: without the submitter cookie yet, the
      // two would file two baskets. Whatever is left over resends on return.
      if (inFlight.current) return
      const responses = toResponses(latest.current)
      if (!responses.length) return
      if (JSON.stringify(responses) === sent.current) return

      clearTimer()
      navigator.sendBeacon?.(
        '/api/feedback',
        new Blob([JSON.stringify({ responses })], { type: 'application/json' }),
      )
    }

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush()
    }

    const onOnline = () => {
      if (!inFlight.current) schedule(0)
    }

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', flush)
    window.addEventListener('online', onOnline)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', flush)
      window.removeEventListener('online', onOnline)
    }
  }, [clearTimer, schedule])

  useEffect(() => clearTimer, [clearTimer])

  const value = useMemo<Ctx>(() => {
    const ids = Object.keys(feedback)
    return {
      ready,
      feedback,
      setReaction,
      setComment,
      remove,
      clearAll,
      count: ids.filter((id) => id !== OVERALL_ID).length,
      overall: feedback[OVERALL_ID]?.comment?.trim() ?? '',
      countFor: (subset) => subset.filter((id) => !isEmpty(feedback[id])).length,
      status,
      error,
      revised,
      savedAt,
      saveNow,
    }
  }, [
    feedback,
    ready,
    setReaction,
    setComment,
    remove,
    clearAll,
    status,
    error,
    revised,
    savedAt,
    saveNow,
  ])

  return <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext)
  if (!ctx) throw new Error('useFeedback must be used inside <FeedbackProvider>')
  return ctx
}

/**
 * The three reactions in the order they are offered, with their wording and
 * colour. Built from the shared metadata so the admin panel's tallies and these
 * buttons can never disagree about what green means.
 */
export const REACTIONS: { id: Reaction; label: string; short: string; color: string }[] =
  REACTION_VALUES.map((id) => ({ id, ...REACTION_META[id] }))
