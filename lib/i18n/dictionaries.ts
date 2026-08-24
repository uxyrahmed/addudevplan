import { en, type Dictionary } from './en'
import { dv } from './dv'
import { LOCALE_META, type Locale } from './config'
import { isolateQuantities } from './bidi'

/**
 * Every string in a dictionary, put through the bidirectional pass.
 *
 * Safe to walk blind here in a way it is not in `lib/plan-i18n.ts`: a dictionary
 * holds nothing but prose. There are no ids, no slugs and no colours in it, so
 * there is nothing whose digits could be mistaken for a quantity.
 */
function forRtl<T>(value: T): T {
  if (typeof value === 'string') return isolateQuantities(value) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, inner]) => [key, forRtl(inner)]),
    ) as T
  }
  return value
}

/**
 * Both dictionaries, by locale.
 *
 * Held in one object rather than behind dynamic imports. The documented
 * pattern loads each locale's JSON on demand to keep the others out of the
 * bundle, which matters when there are twenty of them; there are two here, and
 * they are the site's chrome rather than its content — the plan itself, which
 * is an order of magnitude larger, is translated separately in
 * `lib/plan-translations/`.
 *
 * Synchronous, and so usable from `generateMetadata`, a layout, or a page
 * without threading a promise through any of them.
 */
export const DICTIONARIES: Record<Locale, Dictionary> = {
  en,
  dv: LOCALE_META.dv.dir === 'rtl' ? forRtl(dv) : dv,
}

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale]
}

export type { Dictionary }
