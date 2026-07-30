import Link from 'next/link'
import Image from 'next/image'
import { GOALS, PLAN } from '@/lib/plan'

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-shell">
      <div className="shell-wide py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1.4fr]">
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
            <p className="mt-5 max-w-sm text-small text-stone">
              Published by {PLAN.author} on {PLAN.date}, open for comments and feedback. Every
              strategy on this site can be commented on.
            </p>
          </div>

          <nav aria-label="All goals">
            <p className="eyebrow mb-4">Fifteen goals</p>
            <ul className="grid gap-x-8 sm:grid-cols-2">
              {GOALS.map((goal) => (
                <li key={goal.slug}>
                  <Link
                    href={`/goals/${goal.slug}`}
                    className="group flex items-baseline gap-2.5 py-2.5 text-small text-slate transition-colors hover:text-navy"
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
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-hairline pt-6 text-small text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {PLAN.author}. Open for consultation — figures and targets can change with your
            feedback.
          </p>
          <p>Feedback is stored on your device until a submission service is connected.</p>
        </div>
      </div>
    </footer>
  )
}
