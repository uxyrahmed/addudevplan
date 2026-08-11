import Image from 'next/image'
import { Icon } from '@/components/ui/icon'
import { ViewTransition } from '@/components/motion/view-transition'
import { GLYPH_VIEWBOX, GOAL_GLYPHS } from '@/lib/goal-glyphs'
import type { Goal } from '@/lib/plan'

type Props = {
  goal: Goal
  size?: number
  /**
   * Hero sizing: a square scaled to sit level with a goal title and its
   * tagline, rather than the small fixed badge used in lists.
   *
   * Deliberately a fixed size per breakpoint, not a stretch-to-fit. Stretching
   * a square inside a flex row is circular — `aspect-ratio` derives width from
   * height while flex derives height from the row — and the box runs away. A
   * fixed size also keeps all twelve heroes identical, instead of the badge
   * growing on the goals with longer titles.
   */
  hero?: boolean
  /** Opt out of the shared-element morph (e.g. in a dense list). */
  morph?: boolean
  priority?: boolean
  className?: string
}

/**
 * A goal's rounded-square badge: the deck's own glyph on the deck's own colour.
 *
 * The glyph is vector for ten of the twelve goals — those paths came
 * straight out of the deck goals slide. The remaining two are raster in
 * the source deck, so they render as an alpha-masked PNG tinted white. Both
 * paths land on an identical CSS plate, so the set reads as one system.
 *
 * The badge carries the view-transition identity: tap a goal in the grid and
 * this square flies into the goal page's hero.
 */
export function GoalBadge({
  goal,
  size = 96,
  hero = false,
  morph = true,
  priority = false,
  className = '',
}: Props) {
  const glyph = GOAL_GLYPHS[goal.number]

  const badge = (
    <span
      // In hero mode the size lives in classes so it can step per breakpoint;
      // an inline width/height would outrank them.
      className={`grid shrink-0 place-items-center text-white ${
        hero ? 'h-24 w-24 sm:h-32 sm:w-32' : ''
      } ${className}`}
      style={{
        width: hero ? undefined : size,
        height: hero ? undefined : size,
        background: goal.color,
        borderRadius: 'var(--radius-badge)',
      }}
    >
      {glyph ? (
        <Icon icon={glyph} viewBox={GLYPH_VIEWBOX} size={hero ? '100%' : size} aria-hidden />
      ) : (
        <Image
          src={`/plan/goals/goal-${String(goal.number).padStart(2, '0')}-glyph.png`}
          alt=""
          width={size}
          height={size}
          priority={priority}
          sizes={`${size}px`}
          className="block h-full w-full"
        />
      )}
    </span>
  )

  if (!morph) return badge

  return (
    <ViewTransition name={`goal-badge-${goal.slug}`} share="badge-morph" default="none">
      {badge}
    </ViewTransition>
  )
}
