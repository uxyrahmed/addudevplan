import { SmoothScroll } from '@/components/motion/smooth-scroll'
import { ScrollProgress } from '@/components/motion/scroll-progress'
import { Reveals } from '@/components/motion/reveals'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { FeedbackProvider } from '@/components/feedback/feedback-store'
import { FeedbackBasket } from '@/components/feedback/feedback-basket'
import { GOALS } from '@/lib/plan'

/**
 * Just enough of the plan for the launcher's twelve segments: a number, a
 * title for the tooltip, the plate colour, and the action ids to count
 * against. Built here, in a server component, so `lib/plan.ts` — the largest
 * module in the project — still never reaches the browser.
 */
const GOAL_PROGRESS = GOALS.map((goal) => ({
  number: goal.number,
  title: goal.title,
  color: goal.color,
  actionIds: goal.strategies.flatMap((strategy) => strategy.actions.map((action) => action.id)),
}))

/**
 * Everything the public consultation needs: the plan's chrome, the scroll and
 * reveal layer, and the feedback basket that follows a visitor around.
 *
 * This sits below the root layout rather than in it so `/admin` — which wants
 * none of it, and no smooth scrolling over a table of results — can render its
 * own shell. The `(site)` group is naming only; `/` and `/goals/[slug]` keep
 * the URLs they had.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <FeedbackProvider>
      <SmoothScroll />
      <Reveals />
      <ScrollProgress />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-full focus:bg-navy focus:px-5 focus:py-3 focus:text-small focus:font-bold focus:text-white"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <FeedbackBasket goals={GOAL_PROGRESS} />
    </FeedbackProvider>
  )
}
