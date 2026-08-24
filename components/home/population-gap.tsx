import {
  LATEST_POPULATION,
  POPULATION,
  POPULATION_SCALE_MAX,
  fmt,
  gapOf,
  isMeasured,
} from '@/lib/plan'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { fill, fillNodes } from '@/lib/i18n/format'
import type { Locale } from '@/lib/i18n/config'

const pct = (n: number) => `${((n / POPULATION_SCALE_MAX) * 100).toFixed(2)}%`

/**
 * The gap, stated as a sentence that happens to start with the number.
 *
 * An earlier version set this as a subtraction with a rule under it. It was
 * accurate and unpleasant — a consultation page should not open by putting a
 * sum in a resident's face. The figure still leads, but it is now the subject
 * of a plain sentence, and the two inputs sit underneath for anyone checking.
 *
 * Both inputs are read off the same year. The 12 August draft carries a newer
 * register count than it has a resident count for, and subtracting across the
 * two would overstate the gap by every arrival since — so the newer register
 * gets its own line rather than being folded into the sum.
 */
export function PopulationGap({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const gap = gapOf(LATEST_POPULATION)

  return (
    // Number over sentence, not a number set inline at the head of one. Inline,
    // the balancer broke it as "9,710 people are registered in / Addu but living
    // elsewhere." — a line ending on a preposition, and the figure reading as
    // the first word of a paragraph rather than as the thing being reported.
    // The vision section already stacks a figure over its unit this way.
    <p>
      <span className="block font-display text-display-1 leading-[1.02] text-navy tabular-nums">
        {fmt(gap)}
      </span>
      <span className="mt-3 block max-w-[24ch] text-lead text-ink">{t.home.gapSentence}</span>
    </p>
  )
}

/**
 * The two figures the number above is the difference of.
 *
 * Split out of `PopulationGap` so the page can set it beside the figure rather
 * than beneath it: as a fourth and fifth line under the number it left the
 * column alongside holding two lines of text and a void.
 *
 * A second line used to note that the register had run on to 35,334 by 2025
 * with no resident count published against it. True, and worth publishing —
 * but it is a caveat about a year this figure is not drawn from, and it was
 * the last thing read before the link out. The ledger on /background carries
 * the same fact where it belongs: 2025 is a row there, with an empty bar and
 * "Not yet counted" against it.
 */
export function PopulationSources({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const latest = LATEST_POPULATION

  return (
    <div className="mt-6 border-t border-hairline pt-4">
      {/* The year used to trail the two figures as a third dot-separated item,
          where it read as another quantity rather than as the date they were
          taken on. It leads the sentence instead. */}
      <p className="text-small text-stone tabular-nums">
        {fill(t.home.sourcesLine, { year: latest.year, registered: fmt(latest.registered) })}
        <span aria-hidden className="mx-2 text-mist">
          ·
        </span>
        {fill(t.home.sourcesResident, { resident: fmt(latest.resident) })}
      </p>
    </div>
  )
}

/**
 * Every year drawn against one scale that starts at zero.
 *
 * The outline runs to the registered count and the fill stops at the resident
 * count, so the gap is literal empty space. Read down the column and the void
 * widens from 1977 to 2006, then narrows in 2014 and again in 2022 — the arc is
 * the argument, and it only exists because the rows share a scale.
 *
 * 2025 draws an outline and no fill, which is the honest shape for a year the
 * draft counts the register in but not the residents.
 */
export function PopulationLedger({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)

  return (
    <div>
      <div className="flex items-baseline justify-between border-b border-hairline pb-2.5">
        <span className="font-body text-micro tracking-[0.1em] text-mist uppercase">
          {t.background.ledgerYear}
        </span>
        {/* "Not resident" named the category; the rows underneath said "away".
            One phrase for one thing, and the phrase is the one the sentence
            above the ledger already uses. */}
        <span className="font-body text-micro tracking-[0.1em] text-mist uppercase">
          {t.background.ledgerLivingElsewhere}
        </span>
      </div>

      <ol className="border-b border-hairline">
        {POPULATION.map((row) => {
          const measured = isMeasured(row)
          return (
            <li key={row.year} className="border-t border-hairline py-2.5" data-reveal="up">
              {/* Three real columns rather than `justify-between`, which left a
                  hole in the middle of every row and crowded the numbers
                  against the right edge. */}
              <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-1 sm:grid-cols-[auto_1fr_auto] sm:gap-x-10">
                <p className="font-heading text-title text-navy tabular-nums">{row.year}</p>
                {measured ? (
                  <>
                    <p className="text-small text-stone tabular-nums">
                      {fillNodes(t.background.ledgerOf, {
                        resident: <span className="text-ink">{fmt(row.resident)}</span>,
                        registered: fmt(row.registered),
                      })}
                    </p>
                    {/* The word is the column header's job. Printed on all nine
                        rows it was nine repetitions of a label the reader
                        already has, in the one column that should be nothing
                        but figures. Kept for a screen reader, which meets these
                        rows one at a time and never sees the header beside
                        them. */}
                    <p className="col-start-2 text-small text-plum tabular-nums sm:col-start-3 sm:text-end">
                      {fmt(gapOf(row))}
                      <span className="sr-only">{t.background.ledgerLivingElsewhereSr}</span>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-small text-stone tabular-nums">
                      {fill(t.background.ledgerRegistered, { registered: fmt(row.registered) })}
                    </p>
                    <p className="col-start-2 text-small text-mist sm:col-start-3 sm:text-end">
                      {t.background.ledgerNotCounted}
                    </p>
                  </>
                )}
              </div>

              {/* Outline to registered, fill to resident. The remainder is the
                  gap, left empty on purpose — as is the whole bar for a year
                  with no resident count. */}
              <div
                aria-hidden
                className="relative mt-2.5 h-2"
                style={{ ['--w' as string]: pct(row.registered) }}
              >
                <span
                  className="absolute inset-y-0 start-0 rounded-[2px] border border-navy/35"
                  style={{ width: 'var(--w)' }}
                />
                {measured ? (
                  <span
                    // No `origin-*` here: the fill's `transform-origin` belongs
                    // to `[data-reveal="measure"]` in globals.css, which flips
                    // it to the right edge when the page runs right to left. A
                    // utility class would pin it to one side in both.
                    className="absolute inset-y-0 start-0 rounded-[2px] bg-navy"
                    style={{ width: pct(row.resident) }}
                    data-reveal="measure"
                  />
                ) : null}
              </div>
            </li>
          )
        })}
      </ol>

      {/* A legend against the marks themselves rather than a sentence
          describing them: the swatches are the same outline and fill the rows
          use, so the mapping is read off the graphic instead of remembered. */}
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-small text-stone">
        <span className="inline-flex items-center gap-2.5">
          <span aria-hidden className="h-2.5 w-7 rounded-[2px] bg-navy" />
          {t.background.legendLivingHere}
        </span>
        <span className="inline-flex items-center gap-2.5">
          <span aria-hidden className="h-2.5 w-7 rounded-[2px] border border-navy/35" />
          {t.background.legendOnRegister}
        </span>
        {/* The scale note is gone. The page's own standfirst already says the
            years are drawn to one scale from zero, and a legend that has to
            explain how to read a bar chart is a bar chart that has failed. */}
      </div>
    </div>
  )
}
