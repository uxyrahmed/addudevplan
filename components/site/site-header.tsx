'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { PLAN } from '@/lib/plan'

/** Section links. The id is both the anchor and the scrollspy target. */
const NAV = [
  { id: 'turning-point', label: 'The plan' },
  { id: 'goals', label: 'Twelve goals' },
  { id: 'initiatives', label: 'Initiatives' },
] as const

/**
 * Held out of `NAV` deliberately. Reading the plan and responding to it are not
 * peers — the whole site exists for the second one, so it gets the only filled
 * control in the bar rather than a fourth identical link.
 *
 * Aimed at the goals, not at `#feedback`. That section explains how responding
 * works and then offers a link to goal 1; a visitor who has pressed a button
 * labelled "Have your say" has already decided, and was being handed an
 * explanation and a second click instead of a response control. The goal grid
 * is where every action carries one.
 */
const CTA = { id: 'goals', label: 'Have your say' } as const

/**
 * No mobile menu.
 *
 * The bar used to carry a hamburger opening a sheet with the three section
 * links and a jump-to-a-goal list. Every one of those was a duplicate: the
 * section links are anchors on the home page a reader is already scrolling
 * through, and all twelve goals are listed in the footer of every page. That
 * left a disclosure whose only unique content was a second route to things
 * already on screen — and it was the one piece of chrome that had to lock the
 * document, unlock it again inside a click handler, and hold a focus trap.
 *
 * What a phone needs from this bar is the way in, so the call to action came
 * out of the collapsed menu and into the bar itself at every width.
 */
export function SiteHeader() {
  const pathname = usePathname()
  const [lifted, setLifted] = useState(false)
  /** True while the bar overlaps a full-bleed dark hero. */
  const [overDark, setOverDark] = useState(false)
  /** Which section the reader is currently inside, for the nav's active state. */
  const [current, setCurrent] = useState<string | null>(null)

  // The old page's sections go with the route change, so the highlight goes
  // with them rather than the new page briefly inheriting it. Adjusted during
  // render rather than in an effect — React re-runs this component before
  // committing, so there is no second render pass.
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
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

  const light = overDark
  const solid = !light && lifted
  // A goal page is still "the goals" as far as the bar is concerned.
  const activeId = pathname.startsWith('/goals/') ? 'goals' : current

  // On the home page link to the bare anchor: the smooth scroller intercepts
  // those and eases to the section instead of jumping. Anywhere else it has to
  // be a real route change first.
  const to = (id: string) => (pathname === '/' ? `#${id}` : `/#${id}`)

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
      <div className="shell flex h-16 items-center gap-4 sm:h-20">
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
            action read as a single cluster rather than drifting apart. The
            section links drop below `md`; the call to action does not. */}
        <nav className="ml-auto flex shrink-0 items-center gap-0.5 lg:gap-1" aria-label="Main">
          <span className="hidden items-center gap-0.5 md:flex lg:gap-1">
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
          </span>

          <Link
            href={to(CTA.id)}
            className={`inline-flex shrink-0 items-center rounded-full px-3.5 py-2.5 text-small font-semibold whitespace-nowrap transition-colors md:ml-1.5 lg:ml-2 lg:px-4 ${
              light
                ? 'bg-white text-navy hover:bg-white/90'
                : 'bg-navy text-white hover:bg-navy-deep'
            }`}
          >
            {CTA.label}
          </Link>
        </nav>
      </div>
    </header>
  )
}
