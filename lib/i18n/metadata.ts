import type { Metadata } from 'next'
import { DEFAULT_LOCALE, localePath, LOCALES, LOCALE_META, type Locale } from './config'

/**
 * Where the share card's image is served from.
 *
 * `opengraph-image.png` beside the locale layout is picked up by Next's file
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
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

/**
 * The canonical URL for this page in this language, and the same page in every
 * other one.
 *
 * Worth stating rather than leaving to a crawler to guess: the two editions
 * carry the same figures under different words, and without `hreflang` a search
 * engine reading both is entitled to treat one as a duplicate of the other and
 * drop it. A resident searching in Dhivehi should find the Dhivehi page.
 *
 * `path` is the route *inside* the locale — `/`, `/background`,
 * `/goals/energy-security` — never one that already carries a prefix.
 */
export function alternatesFor(locale: Locale, path: string): Metadata['alternates'] {
  const languages: Record<string, string> = {}
  for (const other of LOCALES) {
    languages[LOCALE_META[other].tag] = localePath(other, path)
  }
  // Which edition a reader with no stated preference is sent to, and the same
  // answer the proxy gives when `Accept-Language` names neither language.
  languages['x-default'] = localePath(DEFAULT_LOCALE, path)

  return { canonical: localePath(locale, path), languages }
}
