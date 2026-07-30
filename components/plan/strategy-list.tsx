'use client'

import { useMemo } from 'react'
import { FeedbackControl } from '@/components/feedback/feedback-control'
import { useFeedback } from '@/components/feedback/feedback-store'
import type { Goal } from '@/lib/plan'

/**
 * Strategies and actions for one goal, each action carrying its own feedback
 * control. A quiet progress line at the top tells the visitor how far through
 * this goal they are, which is what makes 15 goals feel finishable.
 */
export function StrategyList({ goal }: { goal: Goal }) {
  const { countFor, ready } = useFeedback()

  const ids = useMemo(
    () => goal.strategies.flatMap((s) => s.actions.map((a) => a.id)),
    [goal],
  )
  const answered = ready ? countFor(ids) : 0
  const pct = ids.length ? Math.round((answered / ids.length) * 100) : 0

  if (!goal.strategies.length) {
    return (
      <p className="rounded-3xl border border-dashed border-hairline p-8 text-lead text-stone">
        Strategies and actions for this goal are still to come. Tell us what they should include.
      </p>
    )
  }

  return (
    <>
      <div className="mb-12 rounded-2xl border border-hairline bg-white p-5" data-reveal="fade">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-small font-semibold text-ink">
            You have responded to{' '}
            <span className="tabular-nums" style={{ color: goal.textColor }}>
              {answered}
            </span>{' '}
            of {ids.length} actions
          </p>
          <p className="text-small tabular-nums text-mist">{pct}%</p>
        </div>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-hairline"
          role="progressbar"
          aria-valuenow={answered}
          aria-valuemin={0}
          aria-valuemax={ids.length}
          aria-label={`Actions you have responded to in goal ${goal.number}`}
        >
          <div
            className="h-full rounded-full transition-[width] duration-500 ease-[var(--ease-out-expo)]"
            style={{ width: `%`, background: goal.textColor }}
          />
        </div>
      </div>

      <ol className="space-y-14">
        {goal.strategies.map((strategy) => (
          <li key={strategy.id} data-reveal="up">
            <div className="flex items-start gap-4 sm:gap-5">
              <span
 className="grid h-12 w-12 shrink-0 place-items-center rounded-full font-heading text-small text-white tabular-nums sm:h-14 sm:w-14 sm:text-body"
                style={{ background: goal.textColor }}
                aria-hidden
              >
                {strategy.number}
              </span>
 <h3 className="pt-2 font-heading text-title " style={{ color: goal.textColor }}>
                <span className="sr-only">Strategy {strategy.number}: </span>
                {strategy.title}
              </h3>
            </div>

            <ul className="mt-6 space-y-4 sm:ml-[4.25rem]">
              {strategy.actions.map((action) => (
                <li
                  key={action.id}
                  className="rounded-3xl border border-hairline bg-white p-5 transition-colors hover:border-mist/60 sm:p-6"
                >
 <p className="font-heading text-body text-ink sm:text-lead">
                    {action.text}
                  </p>
                  <FeedbackControl id={action.id} subject={action.text} accent={goal.textColor} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </>
  )
}
