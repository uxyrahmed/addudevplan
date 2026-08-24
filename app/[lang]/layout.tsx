import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { Google_Sans, Merriweather, Questrial } from 'next/font/google'
import localFont from 'next/font/local'
import '../globals.css'
import { localizePlan } from '@/lib/plan-i18n'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { alternatesFor, siteUrl } from '@/lib/i18n/metadata'
import { isLocale, LOCALES, LOCALE_META } from '@/lib/i18n/config'

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

/* ---------------------------------------------------------------- Thaana

   The range the two faces below are allowed to claim.

   This is what keeps the editions from bleeding into each other. Both faces
   ship Latin glyphs, and without a `unicode-range` they would win every
   English word on a Dhivehi page — setting the untranslated goal titles and
   the turning-point passage in a Thaana face, and the plan's figures with
   them. Bounded to the script they are for, they draw Thaana and hand
   everything else back to the Latin faces above, so English on the Dhivehi
   site looks exactly as it does on the English site.

   Three Arabic-block marks come along because Dhivehi punctuates with them and
   the Latin faces do not carry them: the comma `،`, the semicolon `؛` and the
   question mark `؟`. Digits are deliberately *not* in the range — 0–9 are the
   same numerals in both editions, and taking them from Google Sans keeps every
   figure in the plan on one skeleton and keeps `tabular-nums` working.

   Practical consequence worth knowing: a `unicode-range` means the browser
   downloads the file only if the page actually sets a character inside it. An
   English page never fetches either of these, whatever the stylesheet says.

   The range is written out twice below rather than shared through a constant.
   The font loaders are read at build time by the compiler, not executed, so
   every option has to be a literal it can see — a `const` here fails the build
   with "Font loader values must be explicitly written literals". Keep the two
   in step by hand. */

/**
 * Everything that is a title, for the Dhivehi edition — the big statements and
 * the small headers alike: the hero, the section openers, the goal titles, and
 * then card titles, strategy names, labels, buttons and figures.
 *
 * One face across both roles, where English runs two. Merriweather and
 * Questrial are told apart by being a serif and a grotesque, and there is no
 * such pairing to hand here — so rather than reach for a second Thaana family
 * for the sake of symmetry, the display and label roles share this one and are
 * told apart the way they already are on the page: by size and colour.
 *
 * Not by weight, because there is only one. The file is named Regular and
 * reports `usWeightClass: 400` while its own subfamily record says Bold; it is
 * declared here as 400, which is what that class means and what the site asks
 * for by default. With `font-synthesis-weight: none` a `font-bold` in the
 * markup is therefore ignored on Thaana titles rather than faked — the Latin
 * runs beside them still get Merriweather's real bold.
 *
 * `adjustFontFallback: false`: Next's metric-matched fallback is derived from
 * Latin faces, and there is no Latin here to match. `preload: false` because
 * this is declared in a layout both editions share, and an English reader
 * should not spend a request on a script their page has no glyph in.
 */
const thaanaDisplay = localFont({
  src: '../fonts/MVAammuFK-Regular.ttf',
  variable: '--font-thaana-display-face',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'U+060C, U+061B, U+061F, U+0780-07BF' }],
})

/**
 * Small headers for the Dhivehi edition — strategy titles and the actions under
 * them, card titles, labels, buttons and figures — and, for now, the body copy
 * as well: `globals.css` points `--font-body` here too.
 *
 * MV Typewriter is the one face in the Dhivehi set with three real weights, so
 * it is the only one that can carry a role where the site asks for bold and
 * expects to get it. That is true of the labels, and it is true of a `<strong>`
 * inside a paragraph — which is why it can hold both roles without the body
 * copy losing its emphasis.
 */
const thaanaHeading = localFont({
  src: [
    { path: '../fonts/MV_Typewriter_Regular.ttf', weight: '400', style: 'normal' },
    { path: '../fonts/MV_Typewriter_SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../fonts/MV_Typewriter_Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-thaana-heading-face',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'U+060C, U+061B, U+061F, U+0780-07BF' }],
})

/**
 * Body, for the Dhivehi edition: everything that gets read in sentences — goal
 * summaries, targets, the passage a resident is asked to respond to.
 *
 * MV Faseyha, and it is a full family rather than a single cut: Regular and a
 * real Bold. That matters more in the body role than anywhere else on the site,
 * because this is where emphasis lands inside running prose, and
 * `font-synthesis-weight: none` means a face without a drawn bold simply does
 * not get one.
 *
 * Two other faces sit in `app/fonts/` unreferenced, kept as candidates for this
 * role rather than deleted: AK Rasmee (ރަސްމީ, "official") and Sangu Suruhee
 * (ސުރުހީ, "headline", tried for display). Neither costs anything while nothing
 * points at it — they are not loaded here, so no `@font-face` is emitted and no
 * file is fetched.
 */
const thaanaBody = localFont({
  src: [
    { path: '../fonts/MV_Faseyha_Regular.ttf', weight: '400', style: 'normal' },
    { path: '../fonts/MV_Faseyha_Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-thaana-body-face',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'U+060C, U+061B, U+061F, U+0780-07BF' }],
})

/**
 * Both editions are built at build time. Twelve goals × two languages is 24
 * static pages, which is small enough that nothing here needs to be rendered on
 * demand.
 */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await props.params
  if (!isLocale(lang)) return {}

  const t = getDictionary(lang)
  const { plan } = localizePlan(lang)

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${plan.title} ${plan.period}`,
      template: `%s — ${plan.title}`,
    },
    description: t.metadata.description,
    applicationName: plan.title,
    authors: [{ name: plan.author }],
    alternates: alternatesFor(lang, '/'),
    openGraph: {
      title: `${plan.title} ${plan.period}`,
      description: t.metadata.ogDescription,
      type: 'website',
      locale: lang,
      // Declared rather than left to the file convention. `opengraph-image.png`
      // lives at the app root, because a metadata image inside `app/[lang]`
      // fails the production build — Next cannot match the prerendered route
      // back to a source route under a dynamic segment. From the root the file
      // is still served, but it is no longer attached to these pages on its
      // own, so the card is named here. `metadataBase` makes the path absolute,
      // which is what a crawler needs.
      images: [
        {
          url: '/opengraph-image.png',
          width: 2400,
          height: 1350,
          alt: t.metadata.ogImageAlt,
        },
      ],
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#004d80',
  width: 'device-width',
  initialScale: 1,
}

/**
 * The document shell, and the only place the reader's language is written down
 * as a fact about the page.
 *
 * A root layout under a dynamic segment, which is what lets `lang` and `dir`
 * reach the `<html>` element at all — the two attributes that decide which way
 * the page runs and which font a browser picks for a Thaana letter. `/admin`
 * has a root layout of its own for the same reason: it is the council's panel,
 * not part of the consultation, and it stays in English at one address.
 */
export default async function LocaleLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  // A path like /fr/goals/energy-security is not a language this site has —
  // 404 rather than quietly serving English under a French URL.
  if (!isLocale(lang)) notFound()

  const meta = LOCALE_META[lang]

  return (
    <html
      lang={meta.tag}
      dir={meta.dir}
      className={`${display.variable} ${heading.variable} ${body.variable} ${thaanaDisplay.variable} ${thaanaHeading.variable} ${thaanaBody.variable} antialiased`}
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
            footer, feedback basket, scroll layer — lives in app/[lang]/(site). */}
        {children}
      </body>
    </html>
  )
}
