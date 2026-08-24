'use client'

import { useMemo } from 'react'
import { FeedbackControl } from '@/components/feedback/feedback-control'
import { useFeedback } from '@/components/feedback/feedback-store'
import { useLocale } from '@/components/i18n/locale-provider'
import { fill, fillNodes } from '@/lib/i18n/format'
import { isolate } from '@/lib/i18n/bidi'
import type { Goal } from '@/lib/plan'

/**
 * Strategies and actions for one goal, each action carrying its own feedback
 * control. A quiet progress line at the top tells the visitor how far through
 * this goal they are, which is what makes twelve goals feel finishable.
 */
export function StrategyList({ goal }: { goal: Goal }) {
  const { t, dir } = useLocale()
  const { countFor, ready } = useFeedback()

  const ids = useMemo(
    () => goal.strategies.flatMap((s) => s.actions.map((a) => a.id)),
    [goal],
  )
  const answered = ready ? countFor(ids) : 0
  const pct = ids.length ? Math.round((answered / ids.length) * 100) : 0

  if (!goal.strategies.length) {
    return (
      // "Tell us what they should include" invited a reply on a screen that has
      // nowhere to type one — every response control on this site belongs to an
      // action, and this goal has none yet. The state is named instead.
      <p className="rounded-3xl border border-dashed border-hairline p-8 text-lead text-stone">
        {t.strategies.notPublished}
      </p>
    )
  }

  return (
    <>
      {/* The counts hold their place but stay blank until the basket has been
          read off localStorage.

          `ready` is false for the first client render — the server cannot see
          saved responses, so reading storage during render would break
          hydration and it has to happen in an effect. Rendering `0` in the
          meantime meant every arrival on a goal you had already answered
          printed "responded to 0 of 12 · 0%", then flipped to the real figures
          a commit later, with the bar animating up from empty. The layout is
          identical either way, so nothing moves; only the numbers arrive. */}
      <div className="mb-12 rounded-2xl border border-hairline bg-white p-5" data-reveal="fade">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-small font-semibold text-ink" aria-busy={!ready}>
            {fillNodes(t.strategies.responded, {
              answered: (
                <span className="tabular-nums" style={{ color: goal.textColor }}>
                  {ready ? answered : '—'}
                </span>
              ),
              total: ids.length,
            })}
          </p>
          {/* Composed here rather than read from a dictionary, so it needs the
              same bidirectional isolate the dictionary strings get — otherwise
              the per-cent sign lands to the left of the figure. */}
          <p className="text-small tabular-nums text-mist">
            {ready ? (dir === 'rtl' ? isolate(`${pct}%`) : `${pct}%`) : ''}
          </p>
        </div>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-hairline"
          role="progressbar"
          aria-valuenow={answered}
          aria-valuemin={0}
          aria-valuemax={ids.length}
          aria-label={fill(t.strategies.progressAria, { number: goal.number })}
        >
          {/* The transition arrives with the data. Before that the bar's real
              width is unknown, and animating from a placeholder zero to the
              truth is the fill running once for every page view rather than
              once per answer. */}
          <div
            className={`h-full rounded-full ${
              ready ? 'transition-[width] duration-500 ease-[var(--ease-out-expo)]' : ''
            }`}
            style={{ width: `${pct}%`, background: goal.textColor }}
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
                <span className="sr-only">
                  {fill(t.strategies.strategyPrefix, { number: strategy.number })}
                </span>
                {strategy.title}
              </h3>
            </div>

            <ul className="mt-6 space-y-4 sm:ms-[4.25rem]">
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
