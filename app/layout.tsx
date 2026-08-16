import type { Metadata, Viewport } from 'next'
import { Google_Sans, Merriweather, Questrial } from 'next/font/google'
import './globals.css'
import { PLAN } from '@/lib/plan'

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

/**
 * Where the share card's image is served from.
 *
 * `opengraph-image.png` beside this file is picked up by Next's file
 * convention, but a crawler is handed a URL, not a path, so it has to be
 * absolute — without a base, a local build resolves it against localhost and
 * the card comes back blank everywhere it is pasted.
 *
 * `VERCEL_PROJECT_PRODUCTION_URL` is the project's stable production domain.
 * The obvious `VERCEL_URL` is deliberately not used: it names the individual
 * deployment, so every push would mint a new image URL and none of the scrapes
 * would share a cache. `NEXT_PUBLIC_SITE_URL` overrides both, for when the
 * council puts this on a domain of its own.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${PLAN.title} ${PLAN.period}`,
    template: `%s — ${PLAN.title}`,
  },
  description:
    'Twelve goals to make Addu a sustainable, resilient and inclusive city of 35,000 people by 2030. Read the plan and tell us what you think of every action.',
  applicationName: PLAN.title,
  authors: [{ name: PLAN.author }],
  openGraph: {
    title: `${PLAN.title} ${PLAN.period}`,
    description:
      'Twelve goals for a sustainable Addu. Read the plan and share your feedback on every strategy.',
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
        {/* Scripting off means nothing will ever reveal these, so show them.
            `visibility` is listed because the reveal now hides with it too —
            without this line the whole plan would be blank, not just static. */}
        <noscript>
          <style>{`html[data-anim] [data-reveal],html[data-anim] [data-enter]{opacity:1!important;visibility:visible!important;transform:none!important}`}</style>
        </noscript>
        {/* The document shell only. The consultation's own chrome — header,
            footer, feedback basket, scroll layer — lives in app/(site), so the
            admin panel can render a different shell inside the same fonts. */}
        {children}
      </body>
    </html>
  )
}
