'use client'

import Link from 'next/link'
import { localePath, LOCALES, LOCALE_META, type Locale } from '@/lib/i18n/config'

type Props = {
  current: Locale
  /** The path without its language, so each link lands on the page being read. */
  route: string
  /** True while the bar sits over the dark hero. */
  light: boolean
  label: string
}

/**
 * Two links, both always visible.
 *
 * Not a dropdown, and not a globe icon. With two languages a menu hides one
 * behind a click and puts a symbol where a word could go — and the reader who
 * most needs this control is the one who cannot read the page it is on, so the
 * thing that has to be on screen is the *other* script, written in itself.
 * ދިވެހި is recognisable to a Dhivehi reader at a glance in a way that a globe,
 * or the word "Dhivehi", is not.
 *
 * Real links to real addresses, not a preference. Each one points at the page
 * currently being read, in the other language, so switching mid-plan lands on
 * the same goal rather than back at the top of the site — and the URL that
 * results is the one to share.
 *
 * `hrefLang` is on them because that is exactly what these are: the same
 * document in another language, which is the one case the attribute is for.
 */
export function LanguageSwitcher({ current, route, light, label }: Props) {
  return (
    <div
      // A group label rather than a `nav`: this is not a set of destinations,
      // it is one control offering the page it is already on in another
      // language, and a second navigation landmark in the bar would be read out
      // as one on every page.
      role="group"
      aria-label={label}
      className={`ms-1.5 flex shrink-0 items-center rounded-full p-0.5 lg:ms-2 ${
        light ? 'bg-white/15' : 'bg-shell'
      }`}
    >
      {LOCALES.map((locale) => {
        const meta = LOCALE_META[locale]
        const active = locale === current
        return (
          <Link
            key={locale}
            href={localePath(locale, route)}
            lang={meta.tag}
            hrefLang={meta.tag}
            // The active one is a link to the page you are on, which is
            // exactly what `aria-current` is for — and it stays a link so the
            // pair reads as one switch rather than a button and a label.
            aria-current={active ? 'true' : undefined}
            className={`rounded-full px-2.5 py-1.5 text-small font-semibold whitespace-nowrap transition-colors ${
              active
                ? light
                  ? 'bg-white text-navy'
                  : 'bg-navy text-white'
                : light
                  ? 'text-white/75 hover:text-white'
                  : 'text-slate hover:text-navy'
            }`}
          >
            {/* The endonym, and nothing else. "EN"/"DV" would be shorter and
                would name neither language to the person looking for it. */}
            {meta.endonym}
          </Link>
        )
      })}
    </div>
  )
}
