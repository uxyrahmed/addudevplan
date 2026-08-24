'use client'

import { createContext, useContext, useMemo } from 'react'
import { localePath, LOCALE_META, type Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/en'
import type { LocalizedPlan } from '@/lib/plan-i18n'

/**
 * The publication's own name, period, publisher and date.
 *
 * Carried through the tree rather than imported where it is needed, because the
 * places that need it — the header on every page, the hero — run in the
 * browser, and `lib/plan-i18n.ts` reaches the whole plan and every translation
 * of it. Five strings in the payload cost less than 12 goals and 230 actions in
 * a bundle.
 */
export type PlanIdentity = LocalizedPlan['plan']

type LocaleValue = {
  locale: Locale
  dir: 'ltr' | 'rtl'
  /** The chrome, already in the reader's language. */
  t: Dictionary
  plan: PlanIdentity
  /** A site path, prefixed with the current locale. */
  href: (path: string) => string
}

const LocaleContext = createContext<LocaleValue | null>(null)

/**
 * Carries the reader's language to the parts of the site that run in the
 * browser.
 *
 * The dictionary is handed down rather than imported. A client component that
 * imported `lib/i18n/dictionaries.ts` would pull *both* languages into the
 * bundle and then throw one away — and the server already knows which one this
 * request is for, so it sends that one and only that one.
 *
 * `href` is here for the same reason the dictionary is: every link on the
 * public site has to keep the reader in the language they are reading, and a
 * client component cannot read the `[lang]` segment from props the way a page
 * can.
 */
export function LocaleProvider({
  locale,
  dictionary,
  plan,
  children,
}: {
  locale: Locale
  dictionary: Dictionary
  plan: PlanIdentity
  children: React.ReactNode
}) {
  const value = useMemo<LocaleValue>(
    () => ({
      locale,
      dir: LOCALE_META[locale].dir,
      t: dictionary,
      plan,
      href: (path: string) => localePath(locale, path),
    }),
    [locale, dictionary, plan],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleValue {
  const value = useContext(LocaleContext)
  if (!value) {
    // Loud rather than silently English: a control rendered outside the
    // provider would otherwise ship the wrong language to a reader who has
    // asked for the other one, which is the one failure this layer exists to
    // prevent.
    throw new Error('useLocale must be used inside <LocaleProvider>')
  }
  return value
}
