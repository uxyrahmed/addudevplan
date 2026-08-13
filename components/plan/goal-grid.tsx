import { GoalCard } from './goal-card'
import { GOALS } from '@/lib/plan'

/**
 * All twelve goals.
 *
 * A server component: with the search gone there is no state here, so the plan
 * data — the largest module in the project — has no reason to be shipped to the
 * browser at all. The cards render to HTML and nothing about this grid costs
 * anything at runtime.
 */
export function GoalGrid() {
  return (
    <ul
      // Four columns at the top end: twelve goals make three full rows of four,
      // and the whole set lands on one screen rather than asking the reader to
      // scroll a wall of cards to see what the plan covers. Three at `lg` and
      // two at `sm`, because a quarter-width card in the standard `shell` is
      // only 288px — narrower than the same card gets on a phone.
      className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      data-reveal-stagger="0.035"
    >
      {GOALS.map((goal) => (
        // `contents` so the card itself is the grid item and the cards in a row
        // stretch to a common height.
        <li key={goal.slug} className="contents">
          <GoalCard goal={goal} />
        </li>
      ))}
    </ul>
  )
}
