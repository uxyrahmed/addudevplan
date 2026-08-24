import ArrowDown01Icon from '@hugeicons/core-free-icons/ArrowDown01Icon'
import { Icon } from '@/components/ui/icon'
import { COLS, COL_NAME, COL_WIDE } from '@/components/admin/columns'
import { ReactionBar } from '@/components/admin/reaction-bar'
import { ReactionFigures } from '@/components/admin/reaction-figures'
import type { Tally } from '@/lib/admin/results'
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
 *
 * Set on the same column template as the goal rows above, so opening a goal
 * extends the table rather than replacing it with a different one: an action's
 * Concern figure lands directly under its goal's. The actions used to be drawn
 * as small tinted cards inside the goal's own card, which put a container
 * inside a container inside a container and made the numbers harder to compare,
 * not easier.
 */
export function GoalActions({ goal, byAction }: { goal: Goal; byAction: Map<string, Tally> }) {
  const total = goal.strategies.reduce((n, s) => n + s.actions.length, 0)

  return (
    <details className="group">
      <summary className="flex list-none items-center gap-2 px-5 pb-4 text-small font-semibold text-navy transition-colors hover:text-plum [&::-webkit-details-marker]:hidden">
        <Icon
          icon={ArrowDown01Icon}
          size={16}
          className="shrink-0 transition-transform group-open:rotate-180"
        />
        {/* Names the goal, because a screen reader reaching this control out of
            context would otherwise hear twelve identical "Action by action". */}
        Action by action
        <span className="sr-only">
          {' '}
          for Goal {goal.number}: {goal.title}
        </span>
        <span className="font-normal text-mist tabular-nums">({fmt(total)})</span>
      </summary>

      <div className="border-t border-hairline bg-shell pb-2">
        {goal.strategies.map((strategy) => (
          <section key={strategy.id}>
            <h4 className="px-5 pt-4 pb-1.5 text-small leading-snug font-bold text-stone">
              {strategy.number} {strategy.title}
            </h4>
            <ul>
              {strategy.actions.map((action) => {
                const tally = byAction.get(action.id) ?? NONE
                return (
                  <li key={action.id} className={`grid ${COLS} px-5 py-2.5`}>
                    <p className={`${COL_NAME} text-small leading-snug text-ink`}>
                      {action.text}
                    </p>

                    <div className={COL_WIDE}>
                      <ReactionBar
                        support={tally.support}
                        unsure={tally.unsure}
                        concern={tally.concern}
                        thin
                      />
                    </div>

                    <ReactionFigures tally={tally} />

                    {/* Deliberately not a link: the comments screen filters by
                        goal, not by action, so it could only send the reader to
                        the whole goal — which is the row they came from. */}
                    <div className={`${COL_WIDE} text-small leading-tight tabular-nums xl:text-right`}>
                      <span aria-hidden className="text-stone xl:hidden">
                        Comments{' '}
                      </span>
                      <span className="sr-only">Comments: </span>
                      <span className={tally.comments > 0 ? 'text-ink' : 'text-mist'}>
                        {fmt(tally.comments)}
                      </span>
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
