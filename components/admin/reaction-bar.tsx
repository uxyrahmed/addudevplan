import { REACTION_META } from '@/lib/reactions'

type Props = {
  support: number
  unsure: number
  concern: number
  /** Height in Tailwind spacing units; the goal rows want a thinner bar. */
  thin?: boolean
}

/**
 * The support / not sure / concern split as one bar.
 *
 * Proportional to the reactions given, not to the number of actions: a goal
 * where two people answered should not read as overwhelming support, so the
 * counts are always shown beside it rather than the bar standing alone.
 */
export function ReactionBar({ support, unsure, concern, thin }: Props) {
  const total = support + unsure + concern

  if (total === 0) {
    return (
      <div
        className={`${thin ? 'h-1.5' : 'h-2.5'} w-full rounded-full bg-hairline`}
        aria-hidden
      />
    )
  }

  const parts = [
    { key: 'support' as const, value: support },
    { key: 'unsure' as const, value: unsure },
    { key: 'concern' as const, value: concern },
  ].filter((p) => p.value > 0)

  return (
    <div
      className={`flex ${thin ? 'h-1.5' : 'h-2.5'} w-full overflow-hidden rounded-full`}
      role="img"
      aria-label={parts
        .map((p) => `${REACTION_META[p.key].short}: ${p.value}`)
        .join(', ')}
    >
      {parts.map((p) => (
        <span
          key={p.key}
          style={{
            width: `${(p.value / total) * 100}%`,
            background: REACTION_META[p.key].color,
          }}
        />
      ))}
    </div>
  )
}
