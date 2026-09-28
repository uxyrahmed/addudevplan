import type { Place } from '@/lib/admin/results'
import { fmt } from '@/lib/plan'

/**
 * Where the baskets came from, one bar per place.
 *
 * Counted in baskets — one per browser — rather than in responses, so a
 * resident who answered two hundred actions weighs the same as one who answered
 * two. A single series, so one colour and no legend: the heading names it and
 * every bar carries its own count.
 */
export function SentFrom({ places, total }: { places: Place[]; total: number }) {
  if (total === 0) return null

  return (
    <section className="mt-4 rounded-2xl border border-hairline bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-heading text-title text-ink">Where it was sent from</h2>
        <p className="text-small text-stone tabular-nums">
          {fmt(total)} {total === 1 ? 'submission' : 'submissions'}
        </p>
      </div>
      <p className="mt-2 max-w-prose text-small leading-snug text-stone">
        The place each connection reports, not where the resident lives. Maldivian networks
        often show as Malé whichever island a phone is on, so this tells the Maldives from
        abroad more reliably than one island from another.
      </p>

      <ul className="mt-4 space-y-3">
        {places.map((place) => {
          const share = (place.submissions / total) * 100
          return (
            <li
              key={place.label}
              title={`${place.label}: ${fmt(place.submissions)} (${Math.round(share)}%)`}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_5.5rem]"
            >
              <span className={`text-small ${place.recorded ? 'text-ink' : 'text-mist'}`}>
                {place.label}
              </span>
              <span className="text-small tabular-nums sm:order-last sm:text-right">
                <span className="font-bold text-ink">{fmt(place.submissions)}</span>
                <span className="ml-1.5 text-mist">{Math.round(share)}%</span>
              </span>
              {/* Navy for a place, the plate grey for no place at all: the
                  one row that is an absence should not read as a region. */}
              <span
                aria-hidden
                className="col-span-2 h-1.5 overflow-hidden rounded-full bg-hairline sm:col-span-1"
              >
                <span
                  className="block h-full rounded-full"
                  style={{
                    width: `${Math.max(share, 1)}%`,
                    background: place.recorded ? 'var(--color-navy)' : 'var(--color-mist-plate)',
                  }}
                />
              </span>
            </li>
          )
        })}
      </ul>

      {places.some((place) => !place.recorded) ? (
        <p className="mt-4 text-small leading-snug text-mist">
          Not recorded: last sent before places were kept, or over a connection that named
          none.
        </p>
      ) : null}
    </section>
  )
}
