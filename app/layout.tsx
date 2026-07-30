import type { Metadata, Viewport } from 'next'
import { Google_Sans, Merriweather, Questrial } from 'next/font/google'
import './globals.css'
import { PLAN } from '@/lib/plan'
import { SmoothScroll } from '@/components/motion/smooth-scroll'
import { ScrollProgress } from '@/components/motion/scroll-progress'
import { Reveals } from '@/components/motion/reveals'
import { SiteHeader } from '@/components/site/site-header'
import { HeaderGoalLinks } from '@/components/site/header-goal-links'
import { SiteFooter } from '@/components/site/site-footer'
import { FeedbackProvider } from '@/components/feedback/feedback-store'
import { FeedbackBasket } from '@/components/feedback/feedback-basket'

/**
 * Display: a variable soft serif. Google Sans is already a geometric-humanist
 * sans, so a second geometric sans would read as "the body text, but bigger" —
 * the headings need their own voice.
 *
 * `opsz` lets the letterforms adapt to size instead of one drawing scaled up,
 * and a touch of SOFT rounds the terminals so the serif reads warm rather than
 * institutional — the plan is addressed to residents, not to a ministry.
 */
const display = Merriweather({
  variable: '--font-display-face',
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
})

/**
 * Small headers: card titles, strategy names, labels, buttons, figures.
 *
 * Questrial ships one weight — 400, no bold. Asking for 700 would make the
 * browser smear the outlines into a fake bold, which shows badly at the 12–18px
 * this face mostly runs at. So nothing in this family asks for weight:
 * `font-synthesis-weight: none` in globals.css makes that a hard guarantee, and
 * the hierarchy is carried by size, letter-spacing, case and colour instead.
 */
const heading = Questrial({
  variable: '--font-heading-face',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
})

/**
 * Body: Google's own humanist sans — even colour and a generous x-height.
 *
 * It reached Google Fonts too recently for Next to hold fallback metrics, so
 * the automatic metric-matched fallback is off and a hand-picked stack of
 * similar-proportioned system faces stands in while it loads.
 */
const body = Google_Sans({
  variable: '--font-body-face',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
})

export const metadata: Metadata = {
  title: {
    default: `${PLAN.title} ${PLAN.period}`,
    template: `%s — ${PLAN.title}`,
  },
  description:
    'Fifteen goals to make Addu a sustainable, resilient and inclusive city of 35,000 people by 2030. Read the plan and tell the council what you think of every strategy.',
  applicationName: PLAN.title,
  authors: [{ name: PLAN.author }],
  openGraph: {
    title: `${PLAN.title} ${PLAN.period}`,
    description:
      'Fifteen goals for a sustainable Addu. Read the plan and share your feedback on every strategy.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#004d80',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${heading.variable} ${body.variable} antialiased`}
      // Lets Next.js manage scroll restoration around our smooth scrolling.
      data-scroll-behavior="smooth"
      // Opts the document into the scroll-reveal "from" states. Rendered on the
      // server as well as the client so hydration sees identical markup.
      data-anim=""
    >
      <body>
        {/* Scripting off means nothing will ever reveal these, so show them. */}
        <noscript>
          <style>{`html[data-anim] [data-reveal],html[data-anim] [data-enter]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
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
      </body>
    </html>
  )
}
