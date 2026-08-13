import Link from 'next/link'
import Image from 'next/image'
import { GOALS, PLAN } from '@/lib/plan'

/**
 * Rebuilt as a directory with an imprint under it, rather than one column of
 * mixed identity, prose and links beside another of goal links.
 *
 * The old shape put four different kinds of thing in the left column — the
 * official lockup, the plan's title, a sentence about responding, and a link to
 * the evidence page — and gave the twelve goals, the only navigation down here,
 * the same weight as the sentence. Now the mark and title identify the
 * publication, the links sit together as links, and everything that is fine
 * print is fine print, on one rule-separated line at the bottom.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-shell">
      <div className="shell py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_2fr] lg:gap-20">
          <div>
            {/* The one place with room for the full lockup — bird, wordmark
                and tagline — so the official mark appears somewhere intact
                rather than only as the cropped bird in the header. Stacked
                above the plan title, because the council and the document it
                published are two different things. */}
            <Image
              src="/plan/brand/city-of-addu.png"
              alt="City of Addu"
              width={418}
              height={356}
              className="h-auto w-[124px]"
            />
            <div className="mt-6 leading-tight">
              <p className="font-heading text-title text-navy">{PLAN.title}</p>
              <p className="text-micro font-bold tracking-[0.12em] text-mist uppercase">
                {PLAN.period}
              </p>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-[2fr_1fr] sm:gap-12">
            <nav aria-label="All goals">
              <h2 className="text-small font-bold text-ink">Twelve goals</h2>
              <ul className="mt-3 grid gap-x-8 sm:grid-cols-2">
                {GOALS.map((goal) => (
                  <li key={goal.slug}>
                    <Link
                      href={`/goals/${goal.slug}`}
                      className="group flex items-baseline gap-2.5 py-2 text-small text-slate transition-colors hover:text-navy"
                    >
                      <span
                        className="text-micro font-bold tracking-normal tabular-nums"
                        style={{ color: goal.textColor }}
                      >
                        {String(goal.number).padStart(2, '0')}
                      </span>
                      <span className="group-hover:underline">{goal.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Its own column rather than a stray link under the imprint
                paragraph. /background is reachable from exactly one other place
                on the site — a button beside the population figures — and a
                page with one route in is a page nobody finds twice. */}
            <nav aria-label="Background">
              <h2 className="text-small font-bold text-ink">Behind the plan</h2>
              <ul className="mt-3">
                <li>
                  <Link
                    href="/background"
                    className="block py-2 text-small text-slate transition-colors hover:text-navy hover:underline"
                  >
                    Settlement and population
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Everything that is fine print, together and last. */}
        <div className="mt-14 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-hairline pt-6 text-small text-mist">
          <p>
            Published on {PLAN.date} by {PLAN.author}. Every action has its own place to respond.
          </p>
          <p>Open for consultation — figures and targets can change with your feedback.</p>
        </div>
      </div>
    </footer>
  )
}
