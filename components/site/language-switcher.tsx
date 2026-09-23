'use client'

import { Fragment } from 'react'
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
 * EN | DV — the two editions by the two letters their addresses open with, the
 * one being read in full ink and bold.
 *
 * Codes rather than names so the pair takes the room of one short word beside
 * the call to action, at every width. Each carries its language's name, written
 * in itself, as a `title`: hovering DV shows ދިވެހި.
 *
 * Real links to real addresses, not a preference. Each one points at the page
 * currently being read, in that language, so switching mid-plan lands on the
 * same goal rather than back at the top of the site — and the URL that results
 * is the one to share. `hrefLang` says so, which is the one case the attribute
 * is for.
 *
 * The codes themselves are marked English in both editions. They are Latin
 * letters, so that is the voice a screen reader should spell them in — and it
 * keeps them out of the Dhivehi edition's rule for small type, which drops case
 * and tracking for Thaana's sake (see `app/globals.css`).
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
      className="ms-1 flex shrink-0 items-center lg:ms-2"
    >
      {LOCALES.map((locale, index) => {
        const meta = LOCALE_META[locale]
        const active = locale === current
        return (
          <Fragment key={locale}>
            {index > 0 ? (
              <span
                aria-hidden
                className={`mx-1 h-3.5 w-px shrink-0 ${light ? 'bg-white/45' : 'bg-mist-plate'}`}
              />
            ) : null}
            <Link
              href={localePath(locale, route)}
              hrefLang={meta.tag}
              title={meta.endonym}
              // The active one is a link to the page you are on, which is
              // exactly what `aria-current` is for — and it stays a link so the
              // pair reads as one switch rather than a button and a label.
              aria-current={active ? 'true' : undefined}
              // On hover rather than on sight. The bar is on screen on every
              // page and most readers never change edition, so prefetching on
              // arrival would fetch the other language's copy of every page
              // for nobody.
              prefetch={false}
              // Weight as well as colour marks the edition being read, so the
              // difference survives for a reader who cannot tell navy from grey.
              //
              // The pill is drawn at 32px so a focus ring sits close around two
              // letters, and clear of the rule; the `after` block takes the
              // touch target to 44px and across the gap to the rule.
              className={`relative inline-flex h-8 items-center rounded-full px-1.5 transition-colors after:absolute after:-inset-x-1 after:-inset-y-1.5 focus-visible:outline-offset-1 ${
                active
                  ? `font-bold ${light ? 'text-white' : 'text-navy'}`
                  : `font-normal ${light ? 'text-white/75 hover:text-white' : 'text-mist hover:text-navy'}`
              }`}
            >
              {/* Tracking is added after the last letter too; pulling it back
                  keeps the two codes optically even about the rule. */}
              <span lang="en" className="-mr-[0.14em] text-micro">
                {locale.toUpperCase()}
              </span>
            </Link>
          </Fragment>
        )
      })}
    </div>
  )
}
