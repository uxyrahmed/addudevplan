/**
 * The languages this consultation is published in.
 *
 * Dhivehi is the language of the people being consulted, and English is the
 * language the council drafted in. Both are first-class: the locale is a path
 * segment rather than a cookie, so a Dhivehi reader can send someone a Dhivehi
 * link and have it open in Dhivehi.
 */
export const LOCALES = ['en', 'dv'] as const

export type Locale = (typeof LOCALES)[number]

/**
 * English, not Dhivehi.
 *
 * Not a statement about the audience — it is where the source text lives.
 * `lib/plan.ts` is transcribed from the council's own English draft, and every
 * Dhivehi string is an override on top of it. A visitor with no stated
 * preference is matched on `Accept-Language` before this is ever reached; this
 * is only the answer when nothing at all is known.
 */
export const DEFAULT_LOCALE: Locale = 'en'

export type LocaleMeta = {
  /** BCP 47 tag for the document's `lang`. */
  tag: string
  dir: 'ltr' | 'rtl'
  /**
   * The language's name in itself. A switcher offering a language a reader
   * cannot currently read has to name it in the language being offered —
   * "Dhivehi" is no use to someone who is looking for ދިވެހި.
   */
  endonym: string
  /** The same name in English, for `hreflang` titles and the council's panel. */
  english: string
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: { tag: 'en', dir: 'ltr', endonym: 'English', english: 'English' },
  dv: { tag: 'dv', dir: 'rtl', endonym: 'ދިވެހި', english: 'Dhivehi' },
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

/**
 * A site path, prefixed with the locale it should open in.
 *
 * Every internal link on the public site goes through this. The prefix is
 * unconditional — including for English — so there is exactly one shape of URL
 * to reason about, and no page that answers on two addresses.
 *
 * Fragments and query strings survive: `/#goals` becomes `/dv#goals`, not
 * `/dv/#goals`, which would be a second URL for the home page.
 */
export function localePath(locale: Locale, path: string): string {
  if (!path.startsWith('/')) return path
  const cut = path.search(/[?#]/)
  const route = cut === -1 ? path : path.slice(0, cut)
  const tail = cut === -1 ? '' : path.slice(cut)
  const trimmed = route === '/' ? '' : route
  return `/${locale}${trimmed}${tail}`
}

/**
 * The inverse: pull the locale off a pathname and hand back what is left.
 *
 * `rest` always starts with `/`, so it can be fed straight back to
 * `localePath` — which is exactly what the language switcher does to stay on
 * the page the reader is already on.
 */
export function splitLocale(pathname: string): { locale: Locale | null; rest: string } {
  const [, first = '', ...others] = pathname.split('/')
  if (!isLocale(first)) return { locale: null, rest: pathname }
  const rest = `/${others.join('/')}`
  return { locale: first, rest: rest === '/' && others.length === 0 ? '/' : rest }
}

/**
 * Best supported locale for an `Accept-Language` header.
 *
 * Not currently called. `proxy.ts` sends every unprefixed path to the default
 * edition while the Dhivehi one is unlisted — see the note there. This is kept
 * rather than deleted because unlisting is a temporary state, and turning
 * negotiation back on is meant to be one call rather than a rewrite.
 *
 *
 * Hand-rolled rather than pulled from `@formatjs/intl-localematcher`: with two
 * locales, neither of which has a regional variant, the whole of the matching
 * problem is "does this reader ask for Dhivehi before they ask for English".
 * Quality values are honoured, because a browser set to `en;q=0.8,dv;q=0.9`
 * means it.
 */
export function matchLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE

  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag = '', ...params] = part.trim().split(';')
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith('q='))
        ?.slice(2)
      const quality = q === undefined ? 1 : Number.parseFloat(q)
      return {
        // Only the primary subtag matters here — `dv-MV` and `dv` are the same
        // language as far as this site is concerned.
        base: tag.trim().toLowerCase().split('-')[0] ?? '',
        quality: Number.isFinite(quality) ? quality : 0,
      }
    })
    .filter((entry) => entry.quality > 0)
    .sort((a, b) => b.quality - a.quality)

  for (const { base } of ranked) {
    if (isLocale(base)) return base
  }
  return DEFAULT_LOCALE
}
