'use client'

import { useEffect, useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'
import { prefersReducedMotion } from '@/lib/motion-prefs'

/** Module scope on purpose: a route change unmounts the page, so component
 *  state cannot remember where the visitor came from. */
let lastPath: string | null = null

/** The restore has to land before the browser paints, or the cards flash at
 *  `opacity: 0` for a frame. There is nothing to restore during SSR. */
const useBeforePaint = typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * Scroll reveals for the whole document.
 *
 * The animation lives in CSS (see `[data-reveal]` in globals.css); this only
 * decides *when* by adding `data-revealed`. Three consequences worth keeping:
 *
 * - Nothing here writes `opacity` or `transform`. Those elements often carry a
 *   React-managed `style` prop too, and a tween library and React both writing
 *   the same attribute is what makes a card flicker on an unrelated re-render.
 * - IntersectionObserver needs no layout measurement, so there is no refresh
 *   race with webfonts or images, and no dependence on animation frames.
 * - The hidden state is CSS-only and one-way. An element can go from hidden to
 *   revealed, never back, so a re-render can never re-hide finished content.
 *
 * `data-reveal-stagger` on a parent sequences its children through a per-child
 * `--reveal-delay`; the whole group reveals when the parent comes into view.
 */
export function Reveals() {
  const pathname = usePathname()

  // Coming back to the home page from a goal is a *return*, not an arrival.
  // The page has already made its entrance, and the visitor lands mid-page on
  // the very card they opened — replaying the reveal there fights the badge
  // morph and reads as a glitch. So restore the finished state instead, with
  // transitions off so nothing animates into a position it never left.
  useBeforePaint(() => {
    const cameFrom = lastPath
    lastPath = pathname
    if (pathname !== '/' || !cameFrom?.startsWith('/goals/')) return
    document
      .querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])')
      .forEach((el) => {
        el.setAttribute('data-reveal-instant', '')
        el.setAttribute('data-revealed', '')
      })
  }, [pathname])

  useEffect(() => {
    const pending = () =>
      Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])'))

    const reveal = (els: Element[]) => els.forEach((el) => el.setAttribute('data-revealed', ''))

    if (prefersReducedMotion()) {
      reveal(pending())
      return
    }

    // While the tab is in the background, reveal without transitioning; a
    // transition begun there would sit frozen at opacity 0.
    const root = document.documentElement
    const syncInstant = () => {
      if (document.visibilityState === 'hidden') root.setAttribute('data-anim-instant', '')
      else root.removeAttribute('data-anim-instant')
    }
    syncInstant()
    document.addEventListener('visibilitychange', syncInstant)

    // Stagger groups reveal together, offset by a CSS delay per child. Setting
    // a custom property is safe alongside React's style prop: React only
    // removes keys it previously set, and it never sets this one.
    const grouped = new Set<HTMLElement>()
    document.querySelectorAll<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
      const step = Number(group.dataset.revealStagger) || 0.075
      group.querySelectorAll<HTMLElement>('[data-reveal]').forEach((child, i) => {
        child.style.setProperty('--reveal-delay', `${(i * step).toFixed(3)}s`)
        grouped.add(child)
      })
    })

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const target = entry.target as HTMLElement
          observer.unobserve(target)
          reveal(
            target.hasAttribute('data-reveal-stagger')
              ? Array.from(target.querySelectorAll('[data-reveal]'))
              : [target],
          )
        }
      },
      // Fire a little before the element's top edge reaches the fold.
      { rootMargin: '0px 0px -12% 0px', threshold: 0 },
    )

    document.querySelectorAll<HTMLElement>('[data-reveal-stagger]').forEach((g) => observer.observe(g))
    pending()
      .filter((el) => !grouped.has(el))
      .forEach((el) => observer.observe(el))

    // Last resort: never let a reader lose content to a broken observer.
    const watchdog = window.setTimeout(() => reveal(pending()), 3000)

    return () => {
      window.clearTimeout(watchdog)
      document.removeEventListener('visibilitychange', syncInstant)
      observer.disconnect()
    }
  }, [pathname])

  return null
}
