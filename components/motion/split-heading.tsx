'use client'

import { useEffect, useRef, type ElementType } from 'react'
import { loadGsap } from '@/lib/gsap'
import { canAnimateRichly } from '@/lib/motion-prefs'

type Props = {
  children: string
  as?: ElementType
  className?: string
  /** Seconds to wait before the first line rises. */
  delay?: number
  /** Animate on mount rather than on scroll — for above-the-fold headlines. */
  immediate?: boolean
}

/**
 * Display headline whose lines rise out of their own mask.
 *
 * GSAP arrives lazily, so the heading is server-rendered text that costs
 * nothing until the animation layer loads. It is hidden by CSS (`data-enter`)
 * until the split is measured and the lines are parked out of frame, which is
 * what stops it flashing in its resting position first.
 */
export function SplitHeading({
  children,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  immediate = false,
}: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const show = () => el.setAttribute('data-entered', '')
    if (!canAnimateRichly() || document.visibilityState === 'hidden') {
      show()
      return
    }

    let cancelled = false
    let cleanup: (() => void) | undefined
    // If GSAP is slow or fails, the heading must not stay hidden.
    const watchdog = window.setTimeout(show, 2000)

    loadGsap()
      .then(({ gsap, SplitText }) => {
        if (cancelled || !ref.current) return show()

        let split: InstanceType<typeof SplitText> | undefined
        const ctx = gsap.context(() => {
          split = SplitText.create(el, {
            type: 'lines',
            // GSAP names the mask wrapper `<linesClass>-mask`, so this is also
            // the hook for `.split-line-mask` in globals.css — which is what
            // stops the mask clipping the descenders off g, p, q and y.
            linesClass: 'split-line',
            mask: 'lines',
            autoSplit: true,
          })
          // Park the lines, then unhide, then animate — never visible at rest.
          // 130% rather than 112% because the mask now extends below the line
          // box; a shorter offset would leave the line peeking into that strip.
          gsap.set(split.lines, { yPercent: 130 })
          show()
          gsap.to(split.lines, {
            yPercent: 0,
            duration: 1.15,
            ease: 'expo.out',
            stagger: 0.085,
            delay,
            ...(immediate ? {} : { scrollTrigger: { trigger: el, start: 'top 88%', once: true } }),
          })
        }, el)

        cleanup = () => {
          // kill(false): reverting would re-hide a heading that already ran.
          ctx.kill(false)
          split?.revert()
        }
      })
      .catch(show)

    return () => {
      cancelled = true
      window.clearTimeout(watchdog)
      cleanup?.()
    }
  }, [children, delay, immediate])

  return (
    <Tag ref={ref} className={className} data-enter="">
      {children}
    </Tag>
  )
}
