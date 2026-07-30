'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Menu02Icon from '@hugeicons/core-free-icons/Menu02Icon'
import Cancel01Icon from '@hugeicons/core-free-icons/Cancel01Icon'
import ArrowRight01Icon from '@hugeicons/core-free-icons/ArrowRight01Icon'
import { Icon } from '@/components/ui/icon'
import { PLAN } from '@/lib/plan'

/** Section links. The id is both the anchor and the scrollspy target. */
const NAV = [
  { id: 'turning-point', label: 'The plan' },
  { id: 'goals', label: 'Fifteen goals' },
  { id: 'initiatives', label: 'Initiatives' },
] as const

/**
 * Held out of `NAV` deliberately. Reading the plan and responding to it are not
 * peers — the whole site exists for the second one, so it gets the only filled
 * control in the bar rather than a fourth identical link.
 */
const CTA = { id: 'feedback', label: 'Have your say' } as const

export function SiteHeader({ goalNav }: { goalNav?: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [lifted, setLifted] = useState(false)
  /** True while the bar overlaps a full-bleed dark hero. */
  const [overDark, setOverDark] = useState(false)
  /** Which section the reader is currently inside, for the nav's active state. */
  const [current, setCurrent] = useState<string | null>(null)

  // Close the menu when the route changes. Adjusting during render rather than
  // in an effect — React re-runs this component before committing, so the menu
  // never paints open on the new page and there is no second render pass.
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setOpen(false)
    // The old page's sections are gone; drop the highlight with them rather
    // than letting the new page briefly inherit it.
    setCurrent(null)
  }

  // Any section can opt into the light treatment with `data-dark-hero`, so the
  // header stays legible without the layout needing to know about each page.
  //
  // The overlap test is an IntersectionObserver rather than a rect read on
  // every scroll event: measuring geometry inside a scroll handler forces
  // synchronous layout on each frame, which is exactly the wrong thing to do
  // on the one interaction that has to stay smooth. The remaining handler
  // reads `scrollY` only, and is coalesced onto an animation frame.
  useEffect(() => {
    let frame = 0
    const apply = () => {
      frame = 0
      setLifted(window.scrollY > 24)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply)
    }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })

    // Watch the hero against a viewport inset by the header's own height:
    // while any of it still intersects that band, the bar sits on dark pixels.
    // The observer fires once immediately on observe, so it establishes the
    // initial value itself — no separate setState needed here.
    const hero = document.querySelector('[data-dark-hero]')
    const observer = hero
      ? new IntersectionObserver(([entry]) => setOverDark(entry.isIntersecting), {
          rootMargin: '-80px 0px 0px 0px',
          threshold: 0,
        })
      : null
    observer?.observe(hero!)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      observer?.disconnect()
    }
  }, [pathname])

  // Scrollspy. On one long page the most useful thing a nav can say is where
  // you already are, so each section reports itself as it crosses a band just
  // under the bar. An observer rather than a scroll handler: no measuring on
  // the frames that have to stay smooth.
  useEffect(() => {
    if (pathname !== '/') return
    const ids = [...NAV.map((n) => n.id), CTA.id] as string[]
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (!sections.length) return

    const inBand = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target.id)
          else inBand.delete(entry.target.id)
        }
        // Earliest section in document order wins. When the band sits over a
        // stretch no nav item points at — the migration charts, the pillars —
        // nothing is cleared, so the last heading you passed stays lit rather
        // than the bar going blank mid-page.
        const next = ids.find((id) => inBand.has(id))
        if (next) setCurrent(next)
        else if (window.scrollY < 200) setCurrent(null)
      },
      { rootMargin: '-88px 0px -55% 0px', threshold: 0 },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [pathname])

  const light = overDark && !open
  const solid = !light && (lifted || open)
  // A goal page is still "the goals" as far as the bar is concerned.
  const activeId = pathname.startsWith('/goals/') ? 'goals' : current

  // On the home page link to the bare anchor: the smooth scroller intercepts
  // those and eases to the section instead of jumping. Anywhere else it has to
  // be a real route change first.
  const to = (id: string) => (pathname === '/' ? `#${id}` : `/#${id}`)

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  /**
   * Releases the scroll lock in the same tick as the click, not on the effect
   * that follows it. A menu link is an in-page anchor: the jump to the section
   * runs immediately after this handler, and it cannot move a document that is
   * still locked. Setting the style directly is safe — the effect above sets
   * the same property to the same value a moment later.
   */
  const closeMenu = () => {
    document.documentElement.style.overflow = ''
    setOpen(false)
  }

  return (
    <header
      // Named so the header stays anchored while page content slides beneath it.
      style={{ viewTransitionName: 'site-header' }}
      data-light={light ? '' : undefined}
      // Opaque rather than translucent-and-blurred: a backdrop-filter on a
      // fixed bar is re-filtered on every scroll frame, and at 90% white it was
      // buying almost no visible difference for that cost.
      className={`fixed inset-x-0 top-0 z-[110] transition-[background-color,box-shadow] duration-300 ${
        solid ? 'bg-paper shadow-[0_1px_0_0_var(--color-hairline)]' : 'bg-transparent'
      }`}
    >
      {/* Scrim so white header content stays readable over a bright sky. */}
      {light ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-ink/45 to-transparent"
        />
      ) : null}
      <div className="shell-wide flex h-16 items-center gap-4 sm:h-20">
        <Link
          href="/"
          className="-my-2 flex min-w-0 items-center gap-3 py-2"
          aria-label={`${PLAN.title} home`}
        >
          {/* The bird alone, not the full lockup: at header size the
              "CITY OF ADDU" wordmark under it would be five pixels tall, and
              the plan's own title is already sitting next to it.

              Both versions render and cross-fade rather than swapping `src`.
              Over the hero the mark sits on photography, where the dark purple
              of the wing disappears, so that state needs the reversed artwork —
              but switching the source there would blank the logo while the
              second file downloaded, mid-scroll. Decorative: the link is
              labelled. */}
          <span className="relative block h-6 w-[53px] shrink-0 sm:h-8 sm:w-[71px]">
            <Image
              src="/plan/brand/city-of-addu-bird.png"
              alt=""
              width={390}
              height={176}
              className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
                light ? 'opacity-0' : 'opacity-100'
              }`}
              priority
            />
            <Image
              src="/plan/brand/city-of-addu-bird-white.png"
              alt=""
              width={390}
              height={176}
              className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
                light ? 'opacity-100' : 'opacity-0'
              }`}
              priority
            />
          </span>
          <span className="min-w-0 leading-tight">
            <span
              className={`block truncate font-heading text-[0.95rem] sm:text-[1.05rem] ${
                light ? 'text-white' : 'text-navy'
              }`}
            >
              Addu Development Plan
            </span>
            <span
              className={`block text-micro font-bold tracking-[0.12em] uppercase ${
                light ? 'text-white/70' : 'text-mist'
              }`}
            >
              {PLAN.period}
            </span>
          </span>
        </Link>

        {/* Pushed to the right edge as one group, so the links and the call to
            action read as a single cluster rather than drifting apart. */}
        <nav className="ml-auto hidden shrink-0 items-center gap-0.5 md:flex lg:gap-1" aria-label="Main">
          {NAV.map((item) => {
            const active = activeId === item.id
            return (
              <Link
                key={item.id}
                href={to(item.id)}
                aria-current={active ? 'true' : undefined}
                // `whitespace-nowrap`: as flex items these labels will happily
                // shrink and wrap "The plan" onto two lines rather than admit
                // the bar is out of room. Better that it stays one line and the
                // wordmark, which can truncate, absorbs the pressure.
                className={`relative shrink-0 rounded-full px-2 py-3 text-small font-semibold whitespace-nowrap transition-colors lg:px-4 ${
                  light
                    ? active
                      ? 'text-white'
                      : 'text-white/75 hover:text-white'
                    : active
                      ? 'text-navy'
                      : 'text-slate hover:text-navy'
                }`}
              >
                {item.label}
                {/* A dot, not a filled pill. The active item changes as you
                    scroll, and a block of navy sliding between three labels is
                    a lot of movement for a fact you only glance at. */}
                <span
                  aria-hidden
                  className={`absolute bottom-1.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full transition-opacity duration-300 ${
                    light ? 'bg-white' : 'bg-navy'
                  } ${active ? 'opacity-100' : 'opacity-0'}`}
                />
              </Link>
            )
          })}

          <Link
            href={to(CTA.id)}
            className={`ml-1.5 inline-flex shrink-0 items-center rounded-full px-3.5 py-2.5 text-small font-semibold whitespace-nowrap transition-colors lg:ml-2 lg:px-4 ${
              light
                ? 'bg-white text-navy hover:bg-white/90'
                : 'bg-navy text-white hover:bg-navy-deep'
            }`}
          >
            {CTA.label}
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className={`-mr-2 ml-auto rounded-full p-2.5 transition-colors md:hidden ${
            light ? 'text-white hover:bg-white/15' : 'text-navy hover:bg-shell'
          }`}
        >
          <Icon icon={open ? Cancel01Icon : Menu02Icon} size={24} />
        </button>
      </div>

      {/* CSS disclosure rather than a mounted animation component — this bar is
          on every page, and the menu animates only when someone opens it. */}
      <div
        className="collapse-row border-hairline bg-white data-[open]:border-t md:hidden"
        data-open={open ? '' : undefined}
        inert={open ? undefined : true}
      >
        <div className="max-h-[calc(100dvh-4rem)] min-h-0 overflow-y-auto">
          <nav className="shell py-5" aria-label="Main">
            <ul className="space-y-1">
              {NAV.map((item) => (
                <li key={item.id}>
                  <Link
                    href={to(item.id)}
                    onClick={closeMenu}
                    aria-current={activeId === item.id ? 'true' : undefined}
                    className="flex items-center justify-between rounded-2xl px-3 py-3.5 font-heading text-title text-navy hover:bg-shell aria-[current]:bg-shell"
                  >
                    {item.label}
                    <Icon icon={ArrowRight01Icon} size={20} />
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href={to(CTA.id)}
              onClick={closeMenu}
              className="mt-4 flex items-center justify-between rounded-2xl bg-navy px-5 py-4 font-heading text-title text-white transition-colors hover:bg-navy-deep"
            >
              {CTA.label}
              <Icon icon={ArrowRight01Icon} size={20} />
            </Link>

            {goalNav}
          </nav>
        </div>
      </div>
    </header>
  )
}
