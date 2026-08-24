import Link from 'next/link'
import Image from 'next/image'
import { localizePlan } from '@/lib/plan-i18n'
import { localePath, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { fill } from '@/lib/i18n/format'

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
export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const { goals, plan } = localizePlan(locale)
  const href = (path: string) => localePath(locale, path)

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
              alt={plan.author}
              width={418}
              height={356}
              className="h-auto w-[124px]"
            />
            <div className="mt-6 leading-tight">
              <p className="font-heading text-title text-navy">{plan.title}</p>
              <p className="text-micro font-bold tracking-[0.12em] text-mist uppercase">
                {plan.period}
              </p>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-[2fr_1fr] sm:gap-12">
            <nav aria-label={t.footer.allGoalsLabel}>
              <h2 className="text-small font-bold text-ink">{t.footer.twelveGoals}</h2>
              <ul className="mt-3 grid gap-x-8 sm:grid-cols-2">
                {goals.map((goal) => (
                  <li key={goal.slug}>
                    <Link
                      href={href(`/goals/${goal.slug}`)}
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
            <nav aria-label={t.footer.behindThePlan}>
              <h2 className="text-small font-bold text-ink">{t.footer.behindThePlan}</h2>
              <ul className="mt-3">
                <li>
                  <Link
                    href={href('/background')}
                    className="block py-2 text-small text-slate transition-colors hover:text-navy hover:underline"
                  >
                    {t.footer.settlementAndPopulation}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Everything that is fine print, together and last. */}
        <div className="mt-14 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-hairline pt-6 text-small text-mist">
          <p>{fill(t.footer.imprint, { date: plan.date, author: plan.author })}</p>
          <p>{t.footer.openForConsultation}</p>
        </div>
      </div>
    </footer>
  )
}
