import Link from 'next/link'
import ArrowRight02Icon from '@hugeicons/core-free-icons/ArrowRight02Icon'
import { Icon } from '@/components/ui/icon'
import { GoalBadge } from './goal-badge'
import type { Goal } from '@/lib/plan'
import { localePath, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { fill } from '@/lib/i18n/format'

/**
 * One goal in the grid. The whole card is the link — a 44px-plus target on a
 * phone — and the coloured badge is what carries over to the goal page.
 *
 * Rebuilt around what the card is actually for. It used to say "GOAL 1" in an
 * eyebrow and "01" in a 42px ghost numeral directly above it: the same fact,
 * twice, occupying the two most prominent positions on the card, while the
 * goal's own one-line description — the sentence that tells a reader whether
 * this is the goal about their water or their school — was not on it at all.
 *
 * So the eyebrow is gone, the number is set once as a small figure paired with
 * the badge, and the tagline takes the space they were using. What is left
 * reads top to bottom as identity, name, promise, size.
 */
export function GoalCard({ goal, locale }: { goal: Goal; locale: Locale }) {
  const t = getDictionary(locale)
  const actions = goal.strategies.reduce((n, s) => n + s.actions.length, 0)

  return (
    <Link
      // The goal page links back to this id, so returning lands on the card you
      // opened — which is also what lets the badge morph find its counterpart.
      id={`goal-${goal.slug}`}
      href={localePath(locale, `/goals/${goal.slug}`)}
      transitionTypes={['page-forward']}
      data-reveal="up"
      className="goal-card group relative flex scroll-mt-28 flex-col gap-4 rounded-3xl border border-hairline bg-white p-5 sm:p-6"
      style={{ ['--goal' as string]: goal.color, ['--goal-ink' as string]: goal.textColor }}
    >
      {/* Badge and number on one line, the number sized as a label rather than
          as a graphic. At 42px and 14% opacity it was a watermark competing
          with the badge for the top of the card; at label size in the goal's
          own accessible colour it is legible, which a number identifying one
          of twelve pages ought to be.

          The badge runs at 64px on the council's own note that the goals should
          carry more of this page than the pillars above them. It is the only
          thing on the card that says which goal this is before the title is
          read, so growing it is what makes the grid scannable — and the number
          beside it stays at label size, which is what keeps the two from
          competing again. */}
      <div className="flex items-center gap-3">
        <span className="goal-card__badge">
          <GoalBadge goal={goal} size={64} />
        </span>
        <span
          className="font-heading text-small tabular-nums"
          style={{ color: goal.textColor }}
        >
          {fill(t.goalCard.goalNumber, { number: goal.number })}
        </span>
      </div>

      {/* Title only. The goal's tagline sat under it for a while; it is the
          deck's own one-line description, but on a card that already carries a
          badge, a number, a name and a count it was a fifth thing to read
          before deciding whether to open. `goal.tagline` still runs on the goal
          page's own hero, where there is room for it. */}
      <h3 className="goal-card__title font-heading text-title font-bold text-ink">{goal.title}</h3>

      <div className="relative mt-auto flex items-center justify-between gap-3 border-t border-hairline pt-4 text-small">
        {/* "Open for your input" promised the opposite of what the card opens
            onto: a goal with no strategies has no actions, and no action means
            nothing on that page to respond to. */}
        <span className="text-mist">
          {goal.strategies.length
            ? fill(t.goalCard.counts, { strategies: goal.strategies.length, actions })
            : t.goalCard.noStrategies}
        </span>
        <span
          className="goal-card__arrow grid h-9 w-9 place-items-center rounded-full"
          style={{ background: `${goal.color}14`, color: goal.textColor }}
        >
          <Icon icon={ArrowRight02Icon} size={17} directional />
        </span>
      </div>
    </Link>
  )
}
