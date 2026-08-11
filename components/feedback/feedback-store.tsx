'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { REACTION_META, REACTION_VALUES, type WireReaction } from '@/lib/reactions'

export type Reaction = WireReaction

export type Entry = {
  reaction?: Reaction
  comment?: string
  updatedAt: number
}

export type Feedback = Record<string, Entry>

const STORAGE_KEY = 'addu-plan-feedback:v1'

export type SubmitStatus = 'idle' | 'sending' | 'sent' | 'error'

type Ctx = {
  ready: boolean
  feedback: Feedback
  /** Toggling the same reaction clears it. */
  setReaction: (id: string, reaction: Reaction) => void
  setComment: (id: string, comment: string) => void
  remove: (id: string) => void
  clearAll: () => void
  count: number
  countFor: (ids: string[]) => number
  submitted: boolean
  status: SubmitStatus
  /** Why the last send failed, in words a resident can act on. */
  error: string | null
  /** True when the send replaced a basket this browser had already filed. */
  revised: boolean
  /** Sends the basket to the council. Resolves once it has succeeded or failed. */
  submit: () => Promise<void>
}

const FeedbackContext = createContext<Ctx | null>(null)

function isEmpty(entry: Entry | undefined) {
  return !entry || (!entry.reaction && !entry.comment?.trim())
}

/**
 * Holds the visitor's response to every strategy and action.
 *
 * The browser's copy is the working draft: it survives a reload, a closed tab
 * and a return visit, and nothing is sent until the visitor asks for it in the
 * review panel. `submit` is the only thing that leaves the device, and it posts
 * to /api/feedback rather than talking to the database directly — the server
 * holds the write secret and does the de-duplication.
 */
export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [feedback, setFeedback] = useState<Feedback>({})
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [revised, setRevised] = useState(false)
  const [ready, setReady] = useState(false)

  // Hydrate after mount so server and client markup agree.
  //
  // Reading localStorage during render would make the client's markup disagree
  // with the server's — the server cannot see saved responses — and break
  // hydration. Deferring to an effect is the deliberate trade: one extra render
  // on first load in exchange for markup that matches. React batches the calls
  // below into that single render, and it happens once, not per interaction.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as { entries?: Feedback; submitted?: boolean }
        setFeedback(parsed.entries ?? {})
        if (parsed.submitted) setStatus('sent')
      }
    } catch {
      // Corrupt or blocked storage: start clean rather than break the page.
    }
    setReady(true)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ entries: feedback, submitted: status === 'sent' }),
      )
    } catch {
      // Private browsing / quota — feedback simply won't persist.
    }
  }, [feedback, status, ready])

  // Any edit after a send means the sent copy is no longer what the visitor
  // thinks it is, so the panel drops back to offering to send again.
  const reopen = useCallback(() => {
    setStatus((prev) => (prev === 'idle' ? prev : 'idle'))
    setError(null)
  }, [])

  const setReaction = useCallback((id: string, reaction: Reaction) => {
    reopen()
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
  }, [reopen])

  const setComment = useCallback(
    (id: string, comment: string) => {
      reopen()
      setFeedback((prev) => {
        const next = { ...prev }
        const entry: Entry = { ...next[id], comment, updatedAt: Date.now() }
        if (isEmpty(entry)) delete next[id]
        else next[id] = entry
        return next
      })
    },
    [reopen],
  )

  const remove = useCallback(
    (id: string) => {
      reopen()
      setFeedback((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    },
    [reopen],
  )

  const clearAll = useCallback(() => {
    setFeedback({})
    setStatus('idle')
    setError(null)
    setRevised(false)
  }, [])

  const submit = useCallback(async () => {
    const responses = Object.entries(feedback)
      .filter(([, entry]) => !isEmpty(entry))
      .map(([actionId, entry]) => ({
        actionId,
        reaction: entry.reaction ?? null,
        comment: entry.comment?.trim() || null,
      }))

    if (!responses.length) return

    setStatus('sending')
    setError(null)

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string; revised?: boolean }

      if (!res.ok) {
        setStatus('error')
        setError(data.error ?? 'Could not send your feedback. Please try again.')
        return
      }

      setRevised(Boolean(data.revised))
      setStatus('sent')
    } catch {
      // Offline, or the request never reached the server. The basket is still
      // in localStorage, so nothing the visitor typed is lost.
      setStatus('error')
      setError('No connection. Your feedback is saved on this device — try sending again.')
    }
  }, [feedback])

  const value = useMemo<Ctx>(() => {
    const ids = Object.keys(feedback)
    return {
      ready,
      feedback,
      setReaction,
      setComment,
      remove,
      clearAll,
      count: ids.length,
      countFor: (subset) => subset.filter((id) => !isEmpty(feedback[id])).length,
      submitted: status === 'sent',
      status,
      error,
      revised,
      submit,
    }
  }, [feedback, ready, setReaction, setComment, remove, clearAll, status, error, revised, submit])

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
