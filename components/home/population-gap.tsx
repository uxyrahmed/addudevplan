import {
  LATEST_REGISTER,
  MEASURED_POPULATION,
  POPULATION_SCALE_MAX,
  fmt,
} from '@/lib/plan'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { fill } from '@/lib/i18n/format'
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
      {/* The year the count was taken, over the count. It reads off
          `LATEST_REGISTER` rather than naming 2025, so the stamp follows the
          table the next time the council adds a row to it. `text-micro` carries
          its own tracking and uppercasing, both of which globals.css drops for
          Thaana — neither does anything to a joined script but prise it apart. */}
      <span className="mb-3 block font-body text-micro text-stone uppercase tabular-nums">
        {fill(t.home.registerYear, { year: LATEST_REGISTER.year })}
      </span>
      <span className="block font-display text-display-1 leading-[1.02] text-navy tabular-nums">
        {fmt(LATEST_REGISTER.registered)}
      </span>
      <span className="mt-3 block max-w-[24ch] text-lead text-ink">{t.home.registerSentence}</span>
    </p>
  )
}

/**
 * Every year the council has counted, drawn against one scale that starts at
 * zero.
 *
 * It used to draw two marks on every row — an outline to the register and a
 * fill to the resident count, with the gap between them left as literal empty
 * space. The council replaced the table in review with a single series, 1958
 * to 2022, so there is no second figure to leave a void against and the row is
 * one bar. The register has not been dropped from the site: the home page
 * leads on it, set at display size above the target sentence.
 *
 * Four of the thirteen rows are older than the register itself. 1958 to 1974
 * carry a resident count and nothing else, which is why the ledger reads
 * `MEASURED_POPULATION` rather than `POPULATION` — and why 2025, a register
 * with no residents counted against it, is not a row here. That is the range
 * the council asked for: 1958 to 2022.
 *
 * The arc is the argument, and it only exists because the rows share a scale:
 * read down the column and the bar climbs to 1974, flattens across the decade
 * either side of the British withdrawal, and only passes 20,000 in 2014.
 */
export function PopulationLedger({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)

  return (
    <div>
      <div className="flex items-baseline justify-between border-b border-hairline pb-2.5">
        <span className="font-body text-micro tracking-[0.1em] text-mist uppercase">
          {t.background.ledgerYear}
        </span>
        <span className="font-body text-micro tracking-[0.1em] text-mist uppercase">
          {t.background.ledgerLivingHere}
        </span>
      </div>

      <ol className="border-b border-hairline">
        {MEASURED_POPULATION.map((row) => (
          <li key={row.year} className="border-t border-hairline py-2.5" data-reveal="up">
            {/* Two real columns rather than `justify-between`, which left a
                hole in the middle of every row and crowded the number against
                the right edge. */}
            <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-6">
              <p className="font-heading text-title text-navy tabular-nums">{row.year}</p>
              <p className="text-small text-ink tabular-nums sm:text-end">{fmt(row.resident)}</p>
            </div>

            <div
              aria-hidden
              className="relative mt-2.5 h-2"
              style={{ ['--w' as string]: pct(row.resident) }}
            >
              <span
                // No `origin-*` here: the bar's `transform-origin` belongs to
                // `[data-reveal="measure"]` in globals.css, which flips it to
                // the right edge when the page runs right to left. A utility
                // class would pin it to one side in both.
                className="absolute inset-y-0 start-0 rounded-[2px] bg-navy"
                style={{ width: 'var(--w)' }}
                data-reveal="measure"
              />
            </div>
          </li>
        ))}
      </ol>

      {/* No legend, and no scale note. One mark means there is nothing to tell
          apart, and a legend that has to explain how to read a bar chart is a
          bar chart that has failed. The reading is in the marks: every row
          starts at the same edge and runs against the same maximum. */}
    </div>
  )
}
