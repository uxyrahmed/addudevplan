import {
  LATEST_POPULATION,
  LATEST_REGISTER,
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
 * The register, stated as a sentence that happens to start with the number.
 *
 * This block used to lead on the gap between the two counts — the register
 * minus the residents, 9,710 people registered here and living elsewhere. The
 * council replaced both the figure and the sentence beside it in review, and
 * what is left is the plainer fact: how many people the city's register holds.
 *
 * The register, not the census. `LATEST_REGISTER` is the last row of the table
 * whether or not a resident count was ever published against it, which is the
 * one the council named — 2025, a year `LATEST_POPULATION` skips because it
 * carries no residents to measure.
 *
 * The gap has not been suppressed, only moved: `/background` still draws it on
 * every row of the ledger, where the two counts sit side by side.
 */
export function PopulationRegister({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)

  return (
    // Number over sentence, not a number set inline at the head of one. Inline,
    // the balancer broke the old wording as "9,710 people are registered in /
    // Addu but living elsewhere." — a line ending on a preposition, and the
    // figure reading as the first word of a paragraph rather than as the thing
    // being reported. The vision section stacks a figure over its unit the same
    // way.
    <p>
      <span className="block font-display text-display-1 leading-[1.02] text-navy tabular-nums">
        {fmt(LATEST_REGISTER.registered)}
      </span>
      <span className="mt-3 block max-w-[24ch] text-lead text-ink">{t.home.registerSentence}</span>
    </p>
  )
}

/**
 * The last year counted on both sides, under the sentences that cite it.
 *
 * It used to be provenance for a subtraction — the register and the resident
 * count the gap above was the difference of. With the gap gone from this page
 * it is provenance for the target sentence instead, which names 25,062 as
 * where Addu had got to by 2022 and 35,000 as where the plan means to be by
 * 2030. This line is where a reader checks the first of those, and sees what
 * the register said in the same year.
 *
 * Split out so the page can set it beside the figure rather than beneath it:
 * as a fourth and fifth line under the number it left the column alongside
 * holding two lines of text and a void.
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
        {/* No scale note. A legend that has to explain how to read a bar chart
            is a bar chart that has failed — and the marks carry the reading on
            their own: every row starts at the same left edge and runs against
            the same maximum, so the lengths are comparable by looking at them.

            It used to lean on the standfirst above, which said the years were
            drawn to one scale from zero. The council replaced that sentence in
            review; the reasoning here never depended on it. */}
      </div>
    </div>
  )
}
