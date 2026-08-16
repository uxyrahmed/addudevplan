'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useFeedback } from './feedback-store'

/**
 * A compact record of how far through the plan you are, and the way into the
 * guide.
 *
 * It used to be a count in a pill: "3 responses · Review". That told a visitor
 * how many things they had answered and nothing about how many there were, so
 * the one persistent control on the site said nothing about the shape of the
 * task it belonged to. Twelve segments — one per goal, filled by how much of
 * that goal is answered, in that goal's own colour — say it at a glance and
 * hold it there while you read.
 *
 * The panel behind it needs the whole plan (to label every response) and is a
 * separate chunk fetched the first time it opens. This launcher takes only the
 * twelve id lists it needs to fill the segments, rendered from the server so
 * `lib/plan.ts` still never reaches the client.
 */
const FeedbackPanel = dynamic(() => import('./feedback-panel').then((m) => m.FeedbackPanel), {
  ssr: false,
})

export type GoalProgress = {
  number: number
  title: string
  color: string
  actionIds: string[]
}

/**
 * What the pill says about where the basket has got to. Two words at most: it
 * sits on a launcher, not in a status bar, and the panel behind it carries the
 * full sentence.
 */
const SENDING = { label: 'Sending', dot: 'rgba(255,255,255,0.75)' }
const STATE: Record<string, { label: string; dot: string }> = {
  idle: { label: 'Review', dot: 'rgba(255,255,255,0.45)' },
  pending: SENDING,
  saving: SENDING,
  saved: { label: 'Sent', dot: '#5BD3AC' },
  error: { label: 'Not sent', dot: '#FF9BC4' },
}

export function FeedbackBasket({ goals }: { goals: GoalProgress[] }) {
  const { count, countFor, ready, status } = useFeedback()
  const [open, setOpen] = useState(false)

  if (!ready || count === 0) return null

  const total = goals.reduce((n, goal) => n + goal.actionIds.length, 0)
  const started = goals.filter((goal) => countFor(goal.actionIds) > 0).length
  const state = STATE[status] ?? STATE.idle!

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Your feedback: ${count} of ${total} actions answered across ${started} of ${goals.length} goals — ${
          status === 'saved'
            ? 'sent to the council'
            : status === 'error'
              ? 'not sent yet'
              : 'sending'
        }. Open to review it.`}
        className="basket-launcher fixed bottom-4 left-1/2 z-[130] flex -translate-x-1/2 items-center gap-3.5 rounded-full bg-navy py-3 pr-4 pl-5 text-white shadow-[0_10px_40px_-8px_rgba(0,77,128,0.6)] transition-colors hover:bg-navy-deep sm:bottom-6"
      >
        {/* Twelve segments, in document order, each filled by its own goal's
            progress. `aria-hidden` because the button's own label already
            states the same thing in words — a screen reader should not have to
            hear twelve meters read out to learn one number. */}
        <span aria-hidden className="flex items-end gap-[3px]">
          {goals.map((goal) => {
            const done = countFor(goal.actionIds)
            const ratio = goal.actionIds.length ? done / goal.actionIds.length : 0
            return (
              <span
                key={goal.number}
                title={`Goal ${goal.number}: ${goal.title}`}
                className="relative block h-5 w-[5px] overflow-hidden rounded-full bg-white/25"
              >
                <span
                  className="absolute inset-x-0 bottom-0 rounded-full transition-[height] duration-700 ease-[var(--ease-out-expo)]"
                  style={{
                    height: `${Math.max(ratio * 100, ratio > 0 ? 18 : 0)}%`,
                    // The plate colour, not the darkened text variant: these
                    // sit on navy, where the darkened set goes muddy and three
                    // of the four stop being tellable apart.
                    background: goal.color,
                  }}
                />
              </span>
            )
          })}
        </span>

        <span className="text-small font-bold tabular-nums">
          {count}
          <span className="font-normal text-white/60"> / {total}</span>
        </span>

        {/* The state, not just the way in. A resident who never opens the panel
            should still be able to see that their answers have landed — that
            reassurance was the one thing the old "Send my feedback" button gave
            for free, and it has to survive the button going away.

            `aria-hidden`: the button's own label already says all of this in a
            sentence. */}
        <span
          aria-hidden
          className="flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-micro tracking-normal"
        >
          <span
            className={`block h-1.5 w-1.5 shrink-0 rounded-full ${
              status === 'saving' || status === 'pending' ? 'motion-safe:animate-pulse' : ''
            }`}
            style={{ background: state.dot }}
          />
          {state.label}
        </span>
      </button>

      {open ? <FeedbackPanel onClose={() => setOpen(false)} /> : null}
    </>
  )
}
