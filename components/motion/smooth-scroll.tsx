'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { loadGsap } from '@/lib/gsap'
import { canAnimateRichly } from '@/lib/motion-prefs'
import {
  consumeHistoryNavigation,
  markHistoryNavigation,
  noteNavigation,
  registerScroller,
  resetScroll,
} from '@/lib/route-state'

/**
 * Smooth scrolling, Locomotive-style, driven by Lenis — the engine Locomotive
 * Scroll v5 is built on.
 *
 * Deliberately narrow: pointer devices only, and only where the hardware can
 * hold 60fps. Hijacking momentum scroll on a phone makes a site feel worse,
 * and a scroll-linked rAF loop on a low-core device is the difference between
 * smooth and janky. Both Lenis and GSAP arrive in a deferred chunk, so a
 * device that skips this never downloads either.
 */
export function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    if (!canAnimateRichly()) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let cancelled = false
    let cleanup: (() => void) | undefined

    Promise.all([import('lenis'), loadGsap()])
      .then(([{ default: Lenis }, { gsap, ScrollTrigger }]) => {
        if (cancelled) return

        const lenis = new Lenis({
          duration: 1.05,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          syncTouch: false,
          autoRaf: false,
        })

        lenis.on('scroll', ScrollTrigger.update)
        const tick = (time: number) => lenis.raf(time * 1000)
        gsap.ticker.add(tick)
        registerScroller(lenis)

        // Capture phase, so this lands before the router starts a navigation.
        const onLinkClick = (event: MouseEvent) => {
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
            return
          const anchor = (event.target as HTMLElement | null)?.closest?.('a')
          if (!(anchor instanceof HTMLAnchorElement)) return
          const href = anchor.getAttribute('href')
          if (!href) return

          // Cancel any momentum still in flight before leaving the page.
          // Lenis animates towards an absolute offset, and it keeps going
          // across the navigation — but that offset was measured against the
          // page you just left. Goal pages are shorter than the home page, so
          // the stale target clamps to the maximum and drops you at the bottom
          // of a page you have not read yet. `stop()`/`start()` each reset the
          // animation to the real position, which is what clears the target.
          lenis.stop()
          lenis.start()

          // In-page anchors should ease too, not jump.
          if (href.startsWith('#') && href !== '#') {
            const target = document.querySelector(href)
            if (!target) return
            event.preventDefault()
            lenis.scrollTo(target as HTMLElement, { offset: -96 })
            // Taking over the jump means taking over the address bar with it,
            // so a section stays linkable. `replaceState`, not `pushState`:
            // reading down a page should not fill the back button with the
            // sections you passed through.
            history.replaceState(null, '', href)
          }
        }
        document.addEventListener('click', onLinkClick, true)

        cleanup = () => {
          document.removeEventListener('click', onLinkClick, true)
          gsap.ticker.remove(tick)
          registerScroller(null)
          lenis.destroy()
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  // Browser back/forward restores its own scroll position; anything else is a
  // fresh page and must start at the top.
  useEffect(() => {
    window.addEventListener('popstate', markHistoryNavigation)
    return () => window.removeEventListener('popstate', markHistoryNavigation)
  }, [])

  useEffect(() => {
    const navigated = noteNavigation(pathname)
    const restoring = consumeHistoryNavigation()

    // Only on a real forward navigation: the landing page is already where the
    // browser put it, back/forward restores its own position, and a link to an
    // in-page anchor manages its own destination.
    if (navigated && !restoring && !window.location.hash) resetScroll()

    // A new route also means new measurements — if GSAP is already loaded.
    if (canAnimateRichly()) {
      loadGsap()
        .then(({ ScrollTrigger }) => ScrollTrigger.refresh())
        .catch(() => {})
    }
  }, [pathname])

  return null
}
