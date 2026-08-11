import { SmoothScroll } from '@/components/motion/smooth-scroll'
import { ScrollProgress } from '@/components/motion/scroll-progress'
import { Reveals } from '@/components/motion/reveals'
import { SiteHeader } from '@/components/site/site-header'
import { HeaderGoalLinks } from '@/components/site/header-goal-links'
import { SiteFooter } from '@/components/site/site-footer'
import { FeedbackProvider } from '@/components/feedback/feedback-store'
import { FeedbackBasket } from '@/components/feedback/feedback-basket'

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
      <SiteHeader goalNav={<HeaderGoalLinks />} />
      <main id="main">{children}</main>
      <SiteFooter />
      <FeedbackBasket />
    </FeedbackProvider>
  )
}
