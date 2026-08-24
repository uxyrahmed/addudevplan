import type { Metadata } from 'next'
import { Google_Sans, Questrial } from 'next/font/google'
import '../globals.css'

/**
 * The council's panel keeps the body and label faces and drops the display
 * serif: nothing in here is set at display size, and a face loaded for no
 * glyph is a request spent on nothing. No Thaana either — this section is the
 * council's own working view of the responses, in one language, at one address.
 */
const heading = Questrial({
  variable: '--font-heading-face',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
})

const body = Google_Sans({
  variable: '--font-body-face',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
})

export const metadata: Metadata = {
  title: { default: 'Consultation results', template: '%s — Consultation results' },
  // Residents' responses are not public. Even behind a login, keep the whole
  // section out of search indexes.
  robots: { index: false, follow: false },
}

/**
 * A root layout of its own.
 *
 * The public consultation's root layout sits under `app/[lang]`, so that it can
 * put the reader's language and reading direction on `<html>`. That leaves
 * `/admin` outside it, and a route with no root layout above it is a root
 * layout itself — which is what this now is. It is also why `/admin` is
 * unprefixed: the panel is not part of the consultation and does not follow the
 * reader's language.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${heading.variable} ${body.variable} antialiased`}>
      <body>{children}</body>
    </html>
  )
}
