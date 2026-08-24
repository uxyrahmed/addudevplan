import { notFound } from 'next/navigation'
import { SmoothScroll } from '@/components/motion/smooth-scroll'
import { ScrollProgress } from '@/components/motion/scroll-progress'
import { Reveals } from '@/components/motion/reveals'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { FeedbackProvider } from '@/components/feedback/feedback-store'
import { FeedbackBasket } from '@/components/feedback/feedback-basket'
import { LocaleProvider } from '@/components/i18n/locale-provider'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { isLocale } from '@/lib/i18n/config'
import { localizePlan } from '@/lib/plan-i18n'

/**
 * Everything the public consultation needs: the plan's chrome, the scroll and
 * reveal layer, and the feedback basket that follows a visitor around.
 *
 * This sits below the locale layout rather than in it so `/admin` — which wants
 * none of it, and no smooth scrolling over a table of results — can render its
 * own shell. The `(site)` group is naming only; `/[lang]` and
 * `/[lang]/goals/[slug]` keep the URLs they had, one segment deeper.
 */
export default async function SiteLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()

  const t = getDictionary(lang)
  const { goals, plan } = localizePlan(lang)

  /**
   * Just enough of the plan for the launcher's twelve segments: a number, a
   * title for the tooltip, the plate colour, and the action ids to count
   * against. Built here, in a server component, so `lib/plan.ts` — the largest
   * module in the project — still never reaches the browser.
   */
  const goalProgress = goals.map((goal) => ({
    number: goal.number,
    title: goal.title,
    color: goal.color,
    actionIds: goal.strategies.flatMap((strategy) => strategy.actions.map((action) => action.id)),
  }))

  return (
    <LocaleProvider locale={lang} dictionary={t} plan={plan}>
      <FeedbackProvider>
        <SmoothScroll />
        <Reveals />
        <ScrollProgress />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[200] focus:rounded-full focus:bg-navy focus:px-5 focus:py-3 focus:text-small focus:font-bold focus:text-white"
        >
          {t.common.skipToContent}
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter locale={lang} />
        <FeedbackBasket goals={goalProgress} />
      </FeedbackProvider>
    </LocaleProvider>
  )
}
