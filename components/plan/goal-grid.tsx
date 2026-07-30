import { GoalCard } from './goal-card'
import { GOALS } from '@/lib/plan'

/**
 * All fifteen goals.
 *
 * A server component: with the search gone there is no state here, so the plan
 * data — the largest module in the project — has no reason to be shipped to the
 * browser at all. The cards render to HTML and nothing about this grid costs
 * anything at runtime.
 */
export function GoalGrid() {
  return (
    <ul
      // Three columns at the top end, not four. Fifteen divides evenly by
      // three, so the grid ends on a full row instead of a ragged one — and in
      // the standard `shell` a quarter-width card is only 288px, which is
      // narrower than the same card on a phone.
      className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      data-reveal-stagger="0.045"
    >
      {GOALS.map((goal, i) => (
        // `contents` so the card itself is the grid item and the cards in a row
        // stretch to a common height.
        <li key={goal.slug} className="contents">
          <GoalCard goal={goal} index={i} />
        </li>
      ))}
    </ul>
  )
}
