'use client'

import { useState } from 'react'

import { useFeedback } from './feedback-store'

/**
 * A comment field's two states: what has been posted, and what is being typed.
 *
 * A reaction is one click and goes on its own. A comment does not — half a
 * sentence is not a comment, and a field that filed every keystroke would put a
 * resident's unfinished thinking in front of the council. So typing is a draft
 * that lives nowhere but this component, and posting is the deliberate act that
 * puts it in the basket.
 *
 * Shared by the per-action control and the box for the plan as a whole. Both
 * obey the same rule and the rule has enough edges — see `draft` below — that
 * two copies of it would not stay the same rule for long.
 */
export function useCommentDraft(id: string) {
  const { feedback, setComment, ready } = useFeedback()

  /** What is actually in the basket. Empty until the basket has been restored. */
  const posted = (ready && feedback[id]?.comment?.trim()) || ''

  // `null` means untouched, so the field shows whatever has been posted —
  // including the moment hydration restores it, with no effect to write it in
  // and no remount to make it stick. Typing takes over; posting hands it back.
  const [draft, setDraft] = useState<string | null>(null)
  const value = draft ?? posted

  const trimmed = value.trim()
  const unposted = trimmed !== posted
  const canPost = unposted && trimmed.length > 0

  return {
    /** What the textarea shows. */
    value,
    /** What the council holds. */
    posted,
    /** The box's contents, less the whitespace. */
    trimmed,
    setDraft,
    /** The box says something the council has not been told yet. */
    unposted,
    canPost,
    post() {
      if (!canPost) return
      setComment(id, trimmed)
      setDraft(null)
    },
    /** Takes the posted comment out of the basket, and empties the box. */
    discard() {
      setComment(id, '')
      setDraft(null)
    },
  }
}
