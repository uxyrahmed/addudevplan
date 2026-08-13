import { Icon } from '@/components/ui/icon'
import { ViewTransition } from '@/components/motion/view-transition'
import { GOAL_GLYPHS } from '@/lib/goal-glyphs'
import type { Goal } from '@/lib/plan'

/**
 * Share of the plate the glyph occupies.
 *
 * The deck's own glyphs drew their artwork inside the middle half of a 100-unit
 * box, so they could be rendered edge to edge and still sit in from the corners.
 * A Hugeicons icon uses its whole 24-unit box, so the inset has to be stated:
 * at 100% the glyph touches the rounded corners and the badge stops reading as
 * a plate.
 */
const GLYPH_SCALE = '56%'

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
  className?: string
}

/**
 * A goal's rounded-square badge: a Hugeicons glyph on the deck's own colour.
 *
 * All twelve are vector and all twelve come from one icon family, so the set
 * reads as a system at every size it is drawn at — the grid, the goal hero, and
 * the morph between them.
 *
 * The badge carries the view-transition identity: tap a goal in the grid and
 * this square flies into the goal page's hero.
 */
export function GoalBadge({ goal, size = 96, hero = false, morph = true, className = '' }: Props) {
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
      <Icon icon={glyph} size={GLYPH_SCALE} aria-hidden />
    </span>
  )

  if (!morph) return badge

  return (
    <ViewTransition name={`goal-badge-${goal.slug}`} share="badge-morph" default="none">
      {badge}
    </ViewTransition>
  )
}
