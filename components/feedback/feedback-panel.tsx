'use client'

import { useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import Cancel01Icon from '@hugeicons/core-free-icons/Cancel01Icon'
import SentIcon from '@hugeicons/core-free-icons/SentIcon'
import Delete02Icon from '@hugeicons/core-free-icons/Delete02Icon'
import Download01Icon from '@hugeicons/core-free-icons/Download01Icon'
import CheckmarkCircle02Icon from '@hugeicons/core-free-icons/CheckmarkCircle02Icon'
import AlertCircleIcon from '@hugeicons/core-free-icons/AlertCircleIcon'
import Loading03Icon from '@hugeicons/core-free-icons/Loading03Icon'
import { Icon } from '@/components/ui/icon'
import { GOALS, TOTAL_ACTIONS } from '@/lib/plan'
import { REACTIONS, useFeedback } from './feedback-store'

/** action id -> { goal, strategy, action } for labelling the review list. */
const INDEX = new Map(
  GOALS.flatMap((goal) =>
    goal.strategies.flatMap((strategy) =>
      strategy.actions.map((action) => [action.id, { goal, strategy, action }] as const),
    ),
  ),
)

const REACTION_BY_ID = new Map(REACTIONS.map((r) => [r.id, r]))

export function FeedbackPanel({ onClose }: { onClose: () => void }) {
  const { feedback, count, clearAll, remove, submitted, status, error, revised, submit } =
    useFeedback()
  const closeRef = useRef<HTMLButtonElement>(null)

  // Opened by choice, so move focus into it and let Escape close it.
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [onClose])

  const grouped = useMemo(() => {
    const byGoal = new Map<
      number,
      {
        goalNumber: number
        title: string
        slug: string
        color: string
        items: { id: string; label: string; strategy: string }[]
      }
    >()
    for (const id of Object.keys(feedback)) {
      const hit = INDEX.get(id)
      if (!hit) continue
      const g = byGoal.get(hit.goal.number) ?? {
        goalNumber: hit.goal.number,
        title: hit.goal.title,
        slug: hit.goal.slug,
        color: hit.goal.textColor,
        items: [],
      }
      g.items.push({ id, label: hit.action.text, strategy: hit.strategy.title })
      byGoal.set(hit.goal.number, g)
    }
    return [...byGoal.values()].sort((a, b) => a.goalNumber - b.goalNumber)
  }, [feedback])

  function download() {
    const payload = {
      plan: 'Addu Development Plan 2026–2031',
      exportedAt: new Date().toISOString(),
      responses: grouped.flatMap((g) =>
        g.items.map((item) => ({
          goal: `${g.goalNumber}. ${g.title}`,
          strategy: item.strategy,
          action: item.label,
          reaction: feedback[item.id]?.reaction ?? null,
          comment: feedback[item.id]?.comment?.trim() || null,
        })),
      ),
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'addu-plan-feedback.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div onClick={onClose} className="panel-scrim fixed inset-0 z-[140] bg-ink/45" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Review your feedback"
        className="panel-sheet fixed inset-x-0 bottom-0 z-[150] flex max-h-[88dvh] flex-col rounded-t-[28px] bg-white sm:inset-y-0 sm:right-0 sm:left-auto sm:max-h-none sm:w-[min(30rem,100vw)] sm:rounded-t-none sm:rounded-l-[28px]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-hairline px-6 pt-6 pb-5">
          <div>
            <p className="eyebrow">Your feedback</p>
            <h2 className="mt-1.5 text-title">
              {count} of {TOTAL_ACTIONS} actions
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close feedback panel"
            className="-mr-1 rounded-full p-2 text-stone transition-colors hover:bg-shell hover:text-ink"
          >
            <Icon icon={Cancel01Icon} size={20} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {submitted ? (
            <div
              className="mb-5 flex items-start gap-3 rounded-2xl p-4 text-small"
              style={{ background: 'color-mix(in oklab, #178E6B 10%, white)', color: '#0f6b51' }}
            >
              <Icon icon={CheckmarkCircle02Icon} size={20} />
              <p>
                {revised
                  ? 'Thank you — your feedback has been updated. It replaces what you sent before.'
                  : 'Thank you — your feedback has reached Addu City Council.'}{' '}
                Change anything above and you can send it again.
              </p>
            </div>
          ) : null}

          {status === 'error' && error ? (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-2xl p-4 text-small"
              style={{ background: 'color-mix(in oklab, #970E53 9%, white)', color: '#7c0b45' }}
            >
              <Icon icon={AlertCircleIcon} size={20} />
              <p>{error}</p>
            </div>
          ) : null}

          <ul className="space-y-6">
            {grouped.map((g) => (
              <li key={g.goalNumber}>
                <Link href={`/goals/${g.slug}`} onClick={onClose} className="group flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: g.color }} />
                  <span className="text-small font-bold text-ink group-hover:text-navy">
                    Goal {g.goalNumber} · {g.title}
                  </span>
                </Link>
                <ul className="mt-2.5 space-y-2.5 border-l border-hairline pl-4">
                  {g.items.map((item) => {
                    const entry = feedback[item.id]
                    const r = entry?.reaction ? REACTION_BY_ID.get(entry.reaction) : undefined
                    return (
                      <li key={item.id} className="text-small">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-ink">{item.label}</p>
                          <button
                            type="button"
                            onClick={() => remove(item.id)}
                            aria-label={`Remove your feedback on: ${item.label}`}
                            className="mt-0.5 shrink-0 rounded-md p-1 text-mist transition-colors hover:text-plum"
                          >
                            <Icon icon={Delete02Icon} size={15} />
                          </button>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          {r ? (
                            <span
                              className="rounded-full px-2 py-0.5 text-micro font-bold tracking-wide"
                              style={{
                                background: `color-mix(in oklab, ${r.color} 14%, white)`,
                                color: r.color,
                              }}
                            >
                              {r.short}
                            </span>
                          ) : null}
                          {entry?.comment?.trim() ? (
                            <span className="text-stone italic">“{entry.comment.trim()}”</span>
                          ) : null}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        <footer className="border-t border-hairline px-6 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={submit}
            disabled={status === 'sending' || submitted}
            aria-busy={status === 'sending'}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-navy px-5 py-3.5 text-small font-bold text-white transition-colors hover:bg-navy-deep disabled:cursor-default disabled:bg-stone"
          >
            <Icon icon={status === 'sending' ? Loading03Icon : SentIcon} size={17} />
            {status === 'sending' ? 'Sending…' : submitted ? 'Sent' : 'Send to Addu City Council'}
          </button>
          {/* Said once, next to the button that does it, rather than in a
              privacy page nobody opens. */}
          {submitted ? null : (
            <p className="mt-2.5 text-center text-micro tracking-normal text-mist">
              Sent anonymously. Your name is not asked for or recorded.
            </p>
          )}
          <div className="mt-3 flex items-center justify-between gap-3 text-small">
            <button
              type="button"
              onClick={download}
              className="inline-flex items-center gap-1.5 font-semibold text-navy hover:underline"
            >
              <Icon icon={Download01Icon} size={15} />
              Download a copy
            </button>
            <button type="button" onClick={clearAll} className="font-semibold text-stone hover:text-plum">
              Clear all
            </button>
          </div>
        </footer>
      </aside>
    </>
  )
}
