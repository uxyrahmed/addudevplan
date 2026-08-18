import ArrowDown01Icon from '@hugeicons/core-free-icons/ArrowDown01Icon'
import { Icon } from '@/components/ui/icon'
import { ReactionBar } from '@/components/admin/reaction-bar'
import type { Tally } from '@/lib/admin/results'
import { REACTION_META, REACTION_VALUES } from '@/lib/reactions'
import { fmt, type Goal } from '@/lib/plan'

/**
 * An action nobody answered still gets a row. Which parts of the plan drew no
 * response at all is a finding in its own right, and dropping the empty ones
 * would quietly hide it.
 */
const NONE: Omit<Tally, 'actionId'> = {
  support: 0,
  unsure: 0,
  concern: 0,
  comments: 0,
  responses: 0,
}

/**
 * The goal's own actions, each with the reaction split residents gave it.
 *
 * A native `<details>` rather than a client component: the numbers are already
 * on the page — `getOverview` builds the per-action tallies to roll them up
 * into the goal — so opening one of these fetches nothing and needs no
 * JavaScript to work, print or be found with the browser's own text search.
 *
 * Grouped under strategy headings because that is how the plan reads; an
 * action's wording alone often does not say which part of the goal it serves.
 */
export function GoalActions({ goal, byAction }: { goal: Goal; byAction: Map<string, Tally> }) {
  const total = goal.strategies.reduce((n, s) => n + s.actions.length, 0)

  return (
    <details className="group mt-4 border-t border-hairline pt-3.5">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-small font-semibold text-navy transition-colors hover:text-plum [&::-webkit-details-marker]:hidden">
        <Icon
          icon={ArrowDown01Icon}
          size={16}
          className="shrink-0 transition-transform group-open:rotate-180"
        />
        {/* Names the goal, because a screen reader reaching this control out of
            context would otherwise hear twelve identical "Action by action". */}
        Action by action
        <span className="sr-only"> for Goal {goal.number}: {goal.title}</span>
        <span className="font-normal text-mist tabular-nums">({fmt(total)})</span>
      </summary>

      <div className="mt-4 space-y-5">
        {goal.strategies.map((strategy) => (
          <section key={strategy.id}>
            <h4 className="text-small font-bold text-stone">
              {strategy.number} {strategy.title}
            </h4>
            <ul className="mt-2.5 space-y-2">
              {strategy.actions.map((action) => {
                const tally = byAction.get(action.id) ?? NONE
                const reacted = tally.support + tally.unsure + tally.concern
                return (
                  <li key={action.id} className="rounded-xl bg-shell p-3.5">
                    <p className="text-small text-ink">{action.text}</p>

                    {reacted > 0 ? (
                      <div className="mt-2.5">
                        <ReactionBar
                          support={tally.support}
                          unsure={tally.unsure}
                          concern={tally.concern}
                          thin
                        />
                      </div>
                    ) : null}

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-small tabular-nums">
                      {reacted > 0 ? (
                        REACTION_VALUES.map((key) => (
                          <span key={key} className="text-stone">
                            <span style={{ color: REACTION_META[key].color }}>●</span>{' '}
                            {REACTION_META[key].short} {fmt(tally[key])}
                          </span>
                        ))
                      ) : (
                        <span className="text-mist">No reactions yet</span>
                      )}
                      {/* Deliberately not a link: the comments screen filters by
                          goal, not by action, so it could only send the reader
                          to the whole goal — which is the row they came from. */}
                      {tally.comments > 0 ? (
                        <span className="text-stone">
                          {fmt(tally.comments)}{' '}
                          {tally.comments === 1 ? 'comment' : 'comments'}
                        </span>
                      ) : null}
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </details>
  )
}
