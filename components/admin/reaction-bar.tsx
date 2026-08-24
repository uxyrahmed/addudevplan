import { REACTION_META, REACTION_VALUES } from '@/lib/reactions'

type Props = {
  support: number
  unsure: number
  concern: number
  /** The goal and action rows want a thinner bar than the page-level one. */
  thin?: boolean
}

/**
 * The support / not sure / concern split as one bar.
 *
 * Proportional to the reactions given, not to the number of actions: a goal
 * where two people answered should not read as overwhelming support, so the
 * counts are always shown beside it rather than the bar standing alone.
 *
 * Segments carry a floor width. A single concern among four hundred reactions
 * is 0.25% of the bar, which rounds to nothing on screen — and a lone dissent
 * is exactly the thing a council reader is scanning for, so it is given a
 * sliver it can actually see. The remaining segments give up the difference in
 * proportion to their own size, so the bar still totals its width.
 */
export function ReactionBar({ support, unsure, concern, thin }: Props) {
  const total = support + unsure + concern
  const height = thin ? 'h-1.5' : 'h-2.5'

  if (total === 0) {
    return <div className={`${height} w-full rounded-full bg-hairline`} aria-hidden />
  }

  const parts = REACTION_VALUES.map((key) => ({
    key,
    value: { support, unsure, concern }[key],
  })).filter((p) => p.value > 0)

  const FLOOR = 3 // percent
  const raw = parts.map((p) => (p.value / total) * 100)
  const owed = raw.reduce((n, share) => n + Math.max(0, FLOOR - share), 0)
  const spare = raw.reduce((n, share) => n + Math.max(0, share - FLOOR), 0)
  const widths = raw.map((share) =>
    share < FLOOR ? FLOOR : spare > 0 ? share - (share - FLOOR) * (owed / spare) : share,
  )

  return (
    <div
      className={`flex ${height} w-full overflow-hidden rounded-full bg-hairline`}
      role="img"
      aria-label={parts.map((p) => `${REACTION_META[p.key].short}: ${p.value}`).join(', ')}
    >
      {parts.map((p, i) => (
        <span
          key={p.key}
          style={{ width: `${widths[i]}%`, background: REACTION_META[p.key].color }}
        />
      ))}
    </div>
  )
}
