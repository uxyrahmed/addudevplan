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

export type Reaction = 'support' | 'unsure' | 'concern'

export type Entry = {
  reaction?: Reaction
  comment?: string
  updatedAt: number
}

export type Feedback = Record<string, Entry>

const STORAGE_KEY = 'addu-plan-feedback:v1'

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
  markSubmitted: () => void
}

const FeedbackContext = createContext<Ctx | null>(null)

function isEmpty(entry: Entry | undefined) {
  return !entry || (!entry.reaction && !entry.comment?.trim())
}

/**
 * Holds the visitor's response to every strategy and action.
 *
 * MVP scope: this is the browser's copy only — nothing leaves the device. When
 * the backend lands, `markSubmitted` is where the POST goes; the payload is
 * already the shape a server would want (`{ [actionId]: { reaction, comment } }`).
 */
export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [feedback, setFeedback] = useState<Feedback>({})
  const [submitted, setSubmitted] = useState(false)
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
        setSubmitted(Boolean(parsed.submitted))
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
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ entries: feedback, submitted }))
    } catch {
      // Private browsing / quota — feedback simply won't persist.
    }
  }, [feedback, submitted, ready])

  const setReaction = useCallback((id: string, reaction: Reaction) => {
    setSubmitted(false)
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
  }, [])

  const setComment = useCallback((id: string, comment: string) => {
    setSubmitted(false)
    setFeedback((prev) => {
      const next = { ...prev }
      const entry: Entry = { ...next[id], comment, updatedAt: Date.now() }
      if (isEmpty(entry)) delete next[id]
      else next[id] = entry
      return next
    })
  }, [])

  const remove = useCallback((id: string) => {
    setFeedback((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  const clearAll = useCallback(() => {
    setFeedback({})
    setSubmitted(false)
  }, [])

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
      submitted,
      markSubmitted: () => setSubmitted(true),
    }
  }, [feedback, ready, setReaction, setComment, remove, clearAll, submitted])

  return <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext)
  if (!ctx) throw new Error('useFeedback must be used inside <FeedbackProvider>')
  return ctx
}

export const REACTIONS: { id: Reaction; label: string; short: string; color: string }[] = [
  { id: 'support', label: 'I support this', short: 'Support', color: '#178E6B' },
  { id: 'unsure', label: "I'm not sure", short: 'Not sure', color: '#EE8A12' },
  { id: 'concern', label: 'I have a concern', short: 'Concern', color: '#970E53' },
]
