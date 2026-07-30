import Link from 'next/link'
import ArrowRight02Icon from '@hugeicons/core-free-icons/ArrowRight02Icon'
import { Icon } from '@/components/ui/icon'
import { GoalBadge } from './goal-badge'
import type { Goal } from '@/lib/plan'

/**
 * One goal in the grid. The whole card is the link — a 44px-plus target on a
 * phone — and the coloured badge is what carries over to the goal page.
 */
export function GoalCard({ goal, index = 0 }: { goal: Goal; index?: number }) {
  const actions = goal.strategies.reduce((n, s) => n + s.actions.length, 0)

  return (
    <Link
      // The goal page links back to this id, so returning lands on the card you
      // opened — which is also what lets the badge morph find its counterpart.
      id={`goal-${goal.slug}`}
      href={`/goals/${goal.slug}`}
      transitionTypes={['page-forward']}
      data-reveal="up"
      className="goal-card group relative flex scroll-mt-28 flex-col gap-5 rounded-3xl border border-hairline bg-white p-5 sm:p-6"
      style={{ ['--goal' as string]: goal.color, ['--goal-ink' as string]: goal.textColor }}
    >

      <div className="flex items-start justify-between gap-4">
        <span className="goal-card__badge">
          <GoalBadge goal={goal} size={72} priority={index < 6} />
        </span>
        <span
          className="goal-card__number font-heading text-[2.6rem] leading-none tabular-nums"
          style={{ color: goal.textColor }}
        >
          {String(goal.number).padStart(2, '0')}
        </span>
      </div>

      <div className="relative">
        <p className="eyebrow" style={{ color: goal.textColor }}>
          Goal {goal.number}
        </p>
        <h3 className="goal-card__title mt-2 font-heading text-title text-ink">{goal.title}</h3>
        <p className="mt-2.5 text-small text-stone">{goal.tagline}</p>
      </div>

      <div className="relative mt-auto flex items-center justify-between gap-3 border-t border-hairline pt-4 text-small">
        <span className="text-mist">
          {goal.strategies.length
            ? `${goal.strategies.length} strategies · ${actions} actions`
            : 'Open for your input'}
        </span>
        <span
          className="goal-card__arrow grid h-9 w-9 place-items-center rounded-full"
          style={{ background: `${goal.color}14`, color: goal.textColor }}
        >
          <Icon icon={ArrowRight02Icon} size={17} />
        </span>
      </div>
    </Link>
  )
}
