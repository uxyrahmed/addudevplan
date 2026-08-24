import { REACTION_META, REACTION_VALUES } from '@/lib/reactions'
import { fmt } from '@/lib/plan'

/**
 * A drawn swatch, not a text bullet.
 *
 * The results screens used to set a `●` character in the reaction's colour,
 * which inherits the body face's own idea of how big a bullet is and rides off
 * the baseline of the number beside it. A span with a background is the same
 * mark at a size this file decides.
 */
export function ReactionSwatch({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="inline-block h-2 w-2 shrink-0 rounded-full align-middle"
      style={{ background: color }}
    />
  )
}

/**
 * The three column headings, which are also the only legend the table needs.
 *
 * A fragment of three cells rather than a row of its own, so the heading and
 * the twelve rows below it are placed by the same grid and cannot drift apart.
 * Purely visual — the figures carry their own names for a screen reader, which
 * reads them one row at a time and never sees this strip.
 */
export function ReactionColumnHeads() {
  return (
    <>
      {REACTION_VALUES.map((key) => (
        <div
          key={key}
          className="flex items-center justify-end gap-1.5 text-small leading-none text-stone"
        >
          <ReactionSwatch color={REACTION_META[key].color} />
          {REACTION_META[key].short}
        </div>
      ))}
    </>
  )
}

/**
 * The three counts as three sibling grid cells.
 *
 * A fragment rather than a wrapper, so the cells land in the caller's own grid
 * and every row's Support column starts at the same x. That is the whole point
 * of the table: twelve figures under one heading compare down the column
 * without reading a word, which twelve wrapping "Support 12 · Not sure 3"
 * sentences cannot.
 *
 * Below the width where the column heading fits, each figure carries its own
 * name again — there is no heading left to inherit it from.
 *
 * Zero is set in `--color-mist` rather than dropped. Which parts of the plan
 * drew nothing is a finding in its own right, and a blank cell reads as missing
 * data instead of as none.
 */
export function ReactionFigures({
  tally,
}: {
  tally: { support: number; unsure: number; concern: number }
}) {
  return (
    <>
      {REACTION_VALUES.map((key) => (
        <div key={key} className="text-small leading-tight tabular-nums xl:text-right">
          <span aria-hidden className="block text-stone xl:hidden">
            <ReactionSwatch color={REACTION_META[key].color} /> {REACTION_META[key].short}
          </span>
          <span className="sr-only">{REACTION_META[key].short}: </span>
          <span className={tally[key] > 0 ? 'font-semibold text-ink' : 'text-mist'}>
            {fmt(tally[key])}
          </span>
        </div>
      ))}
    </>
  )
}
