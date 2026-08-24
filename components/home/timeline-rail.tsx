'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import ArrowLeft01Icon from '@hugeicons/core-free-icons/ArrowLeft01Icon'
import ArrowRight01Icon from '@hugeicons/core-free-icons/ArrowRight01Icon'
import { Icon } from '@/components/ui/icon'
import { prefersReducedMotion } from '@/lib/motion-prefs'
import { useLocale } from '@/components/i18n/locale-provider'

/**
 * Horizontal rail for the settlement timeline.
 *
 * The native scrollbar is hidden and replaced with drag-to-scroll plus a pair
 * of arrows that disable at each end, so the control is explicit rather than a
 * grey bar the reader has to notice. The element stays a real scroll container,
 * so trackpad swipes, touch and keyboard arrows all keep working — this only
 * adds affordances, it does not replace scrolling with JavaScript.
 *
 * Children are passed in from the server component so the timeline data never
 * reaches the client bundle.
 */
export function TimelineRail({ children, label }: { children: ReactNode; label: string }) {
  const { t, dir } = useLocale()
  const rtl = dir === 'rtl'
  const rail = useRef<HTMLDivElement>(null)
  /** Whether there is anything left to reach in each reading direction. */
  const [canBack, setCanBack] = useState(false)
  const [canForward, setCanForward] = useState(false)

  const measure = useCallback(() => {
    const el = rail.current
    if (!el) return
    // `scrollLeft` counts away from the *start* edge, and in a right-to-left
    // container that edge is the right one — so it runs negative. Taking the
    // magnitude turns it into "how far along the rail are we", which is the
    // same question in both directions and is what the arrows are asking.
    const travelled = Math.abs(el.scrollLeft)
    const total = el.scrollWidth - el.clientWidth
    // A pixel of slack: sub-pixel layout means the scroll offset rarely hits
    // the exact maximum, which would otherwise leave the forward arrow enabled
    // forever.
    setCanBack(travelled > 1)
    setCanForward(travelled < total - 1)
  }, [])

  useEffect(() => {
    const el = rail.current
    if (!el) return
    // Measured directly rather than on an animation frame: rAF is suspended in
    // a background tab, which would leave the arrows stuck in whatever state
    // they had when the tab lost focus. Reading scroll metrics in a passive
    // listener is cheap — nothing is written back before the next paint.
    measure()
    el.addEventListener('scroll', measure, { passive: true })
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', measure)
      ro.disconnect()
    }
  }, [measure])

  // Drag to scroll. Pointer capture keeps the gesture alive if the cursor
  // leaves the rail mid-drag.
  useEffect(() => {
    const el = rail.current
    if (!el) return

    let dragging = false
    let startX = 0
    let startLeft = 0
    let moved = 0

    const down = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return // native touch scrolling is better
      if ((e.target as HTMLElement).closest('a,button')) return
      dragging = true
      moved = 0
      startX = e.clientX
      startLeft = el.scrollLeft
      el.setPointerCapture(e.pointerId)
      el.dataset.dragging = ''
    }
    const move = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - startX
      moved = Math.max(moved, Math.abs(dx))
      el.scrollLeft = startLeft - dx
    }
    const up = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      delete el.dataset.dragging
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
    }
    // A drag that ends on a link must not also follow it.
    const click = (e: MouseEvent) => {
      if (moved > 6) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    el.addEventListener('click', click, true)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      el.removeEventListener('click', click, true)
    }
  }, [])

  const page = (step: -1 | 1) => {
    const el = rail.current
    if (!el) return
    // A hidden document has no frames, so a smooth scroll there would never
    // advance — jump instead.
    const instant = prefersReducedMotion() || document.visibilityState === 'hidden'
    el.scrollBy({
      // `scrollBy` is in physical pixels, and the rail runs the other way in
      // Dhivehi — so "forward" has to become a leftward move there.
      left: (rtl ? -step : step) * Math.max(240, el.clientWidth * 0.8),
      behavior: instant ? 'auto' : 'smooth',
    })
    // Re-measure from the button's own action rather than trusting the scroll
    // event alone: a smooth scroll settles over several hundred milliseconds,
    // and a dropped or throttled event would otherwise leave an arrow enabled
    // at the end of the rail.
    measure()
    window.setTimeout(measure, instant ? 0 : 480)
  }

  const button =
    'grid h-10 w-10 place-items-center rounded-full border border-hairline text-navy transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white disabled:cursor-default disabled:border-hairline disabled:bg-transparent disabled:text-mist/50 disabled:hover:bg-transparent'

  return (
    <div className="mt-10">
      <div className="mb-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => page(-1)}
          disabled={!canBack}
          aria-label={t.timeline.scrollBack}
          className={button}
        >
          <Icon icon={ArrowLeft01Icon} size={18} directional />
        </button>
        <button
          type="button"
          onClick={() => page(1)}
          disabled={!canForward}
          aria-label={t.timeline.scrollForward}
          className={button}
        >
          <Icon icon={ArrowRight01Icon} size={18} directional />
        </button>
      </div>

      <div
        ref={rail}
        className="timeline-rail"
        tabIndex={0}
        role="group"
        aria-label={label}
      >
        {children}
      </div>
    </div>
  )
}
