'use client'

import { useEffect, useId, useRef, useState } from 'react'
import ThumbsUpIcon from '@hugeicons/core-free-icons/ThumbsUpIcon'
import HelpCircleIcon from '@hugeicons/core-free-icons/HelpCircleIcon'
import Flag02Icon from '@hugeicons/core-free-icons/Flag02Icon'
import Comment01Icon from '@hugeicons/core-free-icons/Comment01Icon'
import Tick02Icon from '@hugeicons/core-free-icons/Tick02Icon'
import { Icon, type IconData } from '@/components/ui/icon'
import { REACTIONS, useFeedback, type Reaction } from './feedback-store'

const REACTION_ICON: Record<Reaction, IconData> = {
  support: ThumbsUpIcon,
  unsure: HelpCircleIcon,
  concern: Flag02Icon,
}

type Props = {
  /** Stable id from lib/plan.ts — this is the feedback key. */
  id: string
  /** What the visitor is responding to, used for the accessible names. */
  subject: string
  accent: string
}

/**
 * The site's one job, repeated: let someone react to a single action and say
 * why. Compact by default, expands only when there is something to say.
 */
export function FeedbackControl({ id, subject, accent }: Props) {
  const { feedback, setReaction, setComment, ready } = useFeedback()
  const entry = feedback[id]
  const [open, setOpen] = useState(false)
  const fieldId = useId()
  const field = useRef<HTMLTextAreaElement>(null)
  const filled = useRef(false)

  // One write, on the transition from "storage not read yet" to "read". Guarded
  // by a ref rather than a dependency list because the saved comment must not
  // be re-applied on later renders — that would overwrite what the visitor is
  // in the middle of typing.
  useEffect(() => {
    if (!ready || filled.current) return
    filled.current = true
    const el = field.current
    const saved = entry?.comment ?? ''
    if (el && saved && el.value !== saved) el.value = saved
  }, [ready, entry])

  const hasComment = Boolean(entry?.comment?.trim())
  const showComment = open || hasComment

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {REACTIONS.map((r) => {
          const active = entry?.reaction === r.id
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setReaction(id, r.id)}
              aria-pressed={active}
              aria-label={`${r.label}: ${subject}`}
              className="group relative inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2 text-small font-semibold transition-colors duration-200"
              style={{
                borderColor: active ? r.color : 'var(--color-hairline)',
                background: active ? r.color : 'transparent',
                color: active ? '#fff' : 'var(--color-stone)',
              }}
            >
              <Icon icon={REACTION_ICON[r.id]} size={15} />
              <span>{r.short}</span>
            </button>
          )
        })}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={showComment}
          aria-controls={fieldId}
          aria-label={`${hasComment ? 'Edit your comment on' : 'Add a comment on'}: ${subject}`}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-hairline px-4 py-2 text-small font-semibold text-stone transition-colors hover:border-navy hover:text-navy"
        >
          <Icon icon={Comment01Icon} size={15} />
          <span>{hasComment ? 'Comment added' : 'Comment'}</span>
          {hasComment ? <Icon icon={Tick02Icon} size={14} style={{ color: accent }} /> : null}
        </button>
      </div>

      {/* A CSS grid row that eases from 0fr to 1fr. A goal page renders up to
          48 of these, so the disclosure is plain CSS rather than 48 mounted
          animation components. */}
      <div className="collapse-row" data-open={showComment ? '' : undefined}>
        <div className="min-h-0 overflow-hidden">
          <label htmlFor={fieldId} className="sr-only">
            Your comment on: {subject}
          </label>
          {/* Filled by ref on the hydration flip, not remounted through a
              changing `key`.

              `defaultValue` is only read on mount, so the old fix keyed the
              field on `ready` to force a fresh mount once the basket had been
              restored. On a goal with twenty-four actions that tore down and
              rebuilt twenty-four textareas in the same commit that hydration
              landed in — the largest single piece of work on the page, done
              once per visit, for a value that a two-line effect can write
              directly. */}
          <textarea
            ref={field}
            id={fieldId}
            rows={3}
            defaultValue=""
            onChange={(e) => setComment(id, e.target.value)}
            placeholder="What would you change, add, or worry about?"
            tabIndex={showComment ? undefined : -1}
            aria-hidden={showComment ? undefined : true}
            className="mt-2.5 w-full resize-y rounded-2xl border border-hairline bg-shell px-4 py-3 text-small text-ink placeholder:text-mist focus:border-navy focus:bg-white focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}
