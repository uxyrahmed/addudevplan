import Link from 'next/link'
import { GoalBadge } from '@/components/plan/goal-badge'
import { ReactionBar } from '@/components/admin/reaction-bar'
import { ReactionColumnHeads, ReactionFigures } from '@/components/admin/reaction-figures'
import { GoalActions } from '@/components/admin/goal-actions'
import { COLS, COL_NAME, COL_PAIR, COL_WIDE } from '@/components/admin/columns'
import { GOAL_SORTS, type GoalRollup, type GoalSort, type Tally } from '@/lib/admin/results'
import { fmt } from '@/lib/plan'

/**
 * The twelve goals as one table rather than as twelve cards.
 *
 * This screen is opened with a comparison in mind — which goals drew unease,
 * which drew nothing at all — and a comparison needs a column. The previous
 * layout gave each goal its own white card and set its figures as a wrapping
 * sentence, so "Concern" landed at a different place on every row and the only
 * way to find the worst goal was to read all twelve and remember.
 *
 * One card, twelve divided rows, one heading strip. Every figure is now under
 * the word that names it and above the same figure for the next goal.
 */
export function GoalTable({
  rows,
  byAction,
  sort,
}: {
  rows: GoalRollup[]
  byAction: Map<string, Tally>
  sort: GoalSort
}) {
  return (
    <section className="mt-14">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
        <h2 className="font-heading text-title text-ink">The twelve goals</h2>

        {/* Plain links, like the comment filters: an order worth looking at is
            worth sending to a colleague, and a <select> could not be. */}
        <nav aria-label="Order" className="flex flex-wrap items-center gap-1.5">
          {(Object.keys(GOAL_SORTS) as GoalSort[]).map((key) => {
            const active = key === sort
            return (
              <Link
                key={key}
                href={key === 'plan' ? '/admin' : `/admin?sort=${key}`}
                aria-current={active ? 'true' : undefined}
                className={`rounded-full px-3 py-1.5 text-small font-semibold transition-colors ${
                  active
                    ? 'bg-navy text-white'
                    : 'border border-hairline bg-white text-stone hover:border-navy hover:text-navy'
                }`}
              >
                {GOAL_SORTS[key].label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* No `overflow-hidden` on the card: it would make this box the nearest
          scroll container and the heading below would stick to it rather than
          to the window — which, on a box that does not scroll, means not
          sticking at all. The rounding it was doing is done by the two children
          that actually touch the corners, one radius in from the border. */}
      <div className="mt-5 rounded-2xl border border-hairline bg-white">
        {/* Visual only. A screen reader gets each figure named on the row it
            belongs to, and would otherwise hear the headings once at the top
            and then eighty-four bare numbers.

            Sticky, because the whole point of the columns is knowing which
            figure is which, and twelve rows with every goal opened runs well
            past a screen — at which point the reader is looking at four columns
            of bare numbers with the words that name them scrolled away. */}
        <div
          aria-hidden
          className={`hidden ${COLS} sticky top-0 z-10 rounded-t-[0.9375rem] border-b border-hairline bg-shell px-5 py-2.5 text-small leading-none text-stone xl:grid`}
        >
          <span>Goal</span>
          <span>Reaction split</span>
          <ReactionColumnHeads />
          <span className="text-right">Comments</span>
          <span className="text-right">Answered</span>
        </div>

        <ul className="divide-y divide-hairline overflow-hidden rounded-b-[0.9375rem]">
          {rows.map((row) => (
            <li key={row.goal.number}>
              <div className={`grid ${COLS} px-5 py-4`}>
                <div className={COL_NAME}>
                  {/* Badge, number and name are one link rather than a link
                      with two labels beside it. The title alone was a 21px
                      target on a phone, and read out of context it announced a
                      goal without saying which of the twelve it was. */}
                  <Link
                    href={`/goals/${row.goal.slug}`}
                    className="group/goal -my-1 flex items-center gap-3 py-1"
                  >
                    {/* No morph: there is no counterpart on an admin screen for
                        the badge to fly to, and twelve live view-transition
                        names on one page is a collision waiting to happen. */}
                    <GoalBadge goal={row.goal} size={34} morph={false} />
                    <span className="min-w-0">
                      <span
                        className="block font-heading text-small leading-none tabular-nums"
                        style={{ color: row.goal.textColor }}
                      >
                        Goal {row.goal.number}
                      </span>
                      <span className="mt-1 block font-heading text-body leading-tight text-ink transition-colors group-hover/goal:text-navy">
                        {row.goal.title}
                      </span>
                    </span>
                  </Link>
                </div>

                <div className={COL_WIDE}>
                  <ReactionBar
                    support={row.support}
                    unsure={row.unsure}
                    concern={row.concern}
                    thin
                  />
                </div>

                <ReactionFigures tally={row} />

                <div className={`${COL_PAIR} text-small leading-tight tabular-nums xl:text-right`}>
                  <span aria-hidden className="block text-stone xl:hidden">
                    Comments
                  </span>
                  {row.comments > 0 ? (
                    <Link
                      href={`/admin/comments?goal=${row.goal.slug}`}
                      // The visible text is a bare number, which is nothing to
                      // go on in a list of links read out of context.
                      aria-label={`Read ${row.comments} ${
                        row.comments === 1 ? 'comment' : 'comments'
                      } on Goal ${row.goal.number}: ${row.goal.title}`}
                      // Padded past its own ink, so a two-character link is
                      // still something a thumb can hit.
                      className="-my-2 inline-block py-2 font-semibold text-navy underline-offset-2 hover:underline xl:-mr-2 xl:pr-2"
                    >
                      {fmt(row.comments)}
                    </Link>
                  ) : (
                    <span className="text-mist">
                      <span className="sr-only">Comments: </span>0
                    </span>
                  )}
                </div>

                <div className="text-small leading-tight tabular-nums xl:text-right">
                  <span aria-hidden className="block text-stone xl:hidden">
                    Answered
                  </span>
                  <span className="sr-only">Actions answered: </span>
                  <span className={row.answeredActions > 0 ? 'text-ink' : 'text-mist'}>
                    {fmt(row.answeredActions)}
                  </span>
                  <span className="text-mist">/{fmt(row.totalActions)}</span>
                </div>
              </div>

              <GoalActions goal={row.goal} byAction={byAction} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
