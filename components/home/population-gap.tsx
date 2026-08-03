import {
  LATEST_POPULATION,
  POPULATION,
  POPULATION_SCALE_MAX,
  fmt,
  gapOf,
} from '@/lib/plan'

const pct = (n: number) => `${((n / POPULATION_SCALE_MAX) * 100).toFixed(2)}%`

/**
 * The gap, stated as a sentence that happens to start with the number.
 *
 * An earlier version set this as a subtraction with a rule under it. It was
 * accurate and unpleasant — a consultation page should not open by putting a
 * sum in a resident's face. The figure still leads, but it is now the subject
 * of a plain sentence, and the two inputs sit underneath for anyone checking.
 */
export function PopulationGap() {
  const latest = LATEST_POPULATION
  const gap = gapOf(latest)

  return (
    <div>
      <p className="max-w-[30ch] text-balance">
        <span className="font-display text-display-1 leading-[1.02] text-navy tabular-nums">
          {fmt(gap)}
        </span>{' '}
        <span className="text-lead text-ink">
          people are registered in Addu but living somewhere else.
        </span>
      </p>

      <p className="mt-7 text-small text-stone tabular-nums">
        {fmt(latest.registered)} on the register
        <span aria-hidden className="mx-2 text-mist">
          ·
        </span>
        {fmt(latest.resident)} living here
      </p>
    </div>
  )
}

/**
 * Every year drawn against one scale that starts at zero.
 *
 * The outline runs to the registered count and the fill stops at the resident
 * count, so the gap is literal empty space. Read down the column and the void
 * widens from 1977 to 2022, then narrows for the first time in 2025 — the arc
 * is the argument, and it only exists because the rows share a scale.
 */
export function PopulationLedger() {
  return (
    <div>
      <div className="flex items-baseline justify-between border-b border-hairline pb-2.5">
        <span className="font-body text-micro tracking-[0.1em] text-mist uppercase">Year</span>
        <span className="font-body text-micro tracking-[0.1em] text-mist uppercase">
          Not resident
        </span>
      </div>

      <ol className="border-b border-hairline">
        {POPULATION.map((row) => {
          const gap = gapOf(row)
          return (
            <li key={row.year} className="border-t border-hairline py-2.5" data-reveal="up">
              {/* Three real columns rather than `justify-between`, which left a
                  hole in the middle of every row and crowded the numbers
                  against the right edge. */}
              <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-1 sm:grid-cols-[auto_1fr_auto] sm:gap-x-10">
                <p className="font-heading text-title text-navy tabular-nums">{row.year}</p>
                <p className="text-small text-stone tabular-nums">
                  <span className="text-ink">{fmt(row.resident)}</span> of {fmt(row.registered)}{' '}
                  registered
                </p>
                <p className="col-start-2 text-small text-plum tabular-nums sm:col-start-3 sm:text-right">
                  {fmt(gap)} away
                </p>
              </div>

              {/* Outline to registered, fill to resident. The remainder is the
                  gap, left empty on purpose. */}
              <div
                aria-hidden
                className="relative mt-2.5 h-2"
                style={{ ['--w' as string]: pct(row.registered) }}
              >
                <span
                  className="absolute inset-y-0 left-0 rounded-[2px] border border-navy/35"
                  style={{ width: 'var(--w)' }}
                />
                <span
                  className="absolute inset-y-0 left-0 origin-left rounded-[2px] bg-navy"
                  style={{ width: pct(row.resident) }}
                  data-reveal="measure"
                />
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
          Living here
        </span>
        <span className="inline-flex items-center gap-2.5">
          <span aria-hidden className="h-2.5 w-7 rounded-[2px] border border-navy/35" />
          On the register
        </span>
        <span className="text-mist">Same scale, from zero</span>
      </div>
    </div>
  )
}
