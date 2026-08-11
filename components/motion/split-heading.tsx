'use client'

import { useEffect, useRef, type ElementType } from 'react'
import { loadGsap } from '@/lib/gsap'
import { canAnimateRichly } from '@/lib/motion-prefs'
import { REVEAL_OBSERVER_INIT } from '@/lib/reveal-trigger'

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
 *
 * It rises on the same threshold as the CSS reveals — see
 * [`REVEAL_OBSERVER_INIT`](../../lib/reveal-trigger.ts) — so a headline and the
 * block around it arrive together rather than a beat apart.
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

    // Once the heading has been shown at rest, it has been read. Anything that
    // parks and animates it afterwards is an entrance for text the visitor is
    // already looking at, so `settled` makes giving up terminal.
    let settled = false
    const settle = () => {
      settled = true
      show()
    }
    // If GSAP is slow or fails, the heading must not stay hidden.
    const watchdog = window.setTimeout(settle, 2000)

    loadGsap()
      .then(({ gsap, SplitText }) => {
        if (cancelled || settled || !ref.current) return settle()
        // GSAP is driving from here; letting the watchdog still fire would only
        // re-assert a state the animation already owns.
        window.clearTimeout(watchdog)

        let split: InstanceType<typeof SplitText> | undefined
        let observer: IntersectionObserver | undefined

        const ctx = gsap.context(() => {
          // Armed once the heading reaches the fold; played once it has run, so
          // a later re-split renders at rest instead of performing again.
          let armed = immediate
          let played = false
          let queued: gsap.core.Tween | undefined

          split = SplitText.create(el, {
            type: 'lines',
            // GSAP names the mask wrapper `<linesClass>-mask`, so this is also
            // the hook for `.split-line-mask` in globals.css — which is what
            // stops the mask clipping the descenders off g, p, q and y.
            linesClass: 'split-line',
            mask: 'lines',
            autoSplit: true,
            // Runs for the first split and again for every re-split — and
            // `autoSplit` re-splits when the webfonts land, which is the whole
            // reason this work belongs here. Setting up outside the callback
            // parked the *original* lines; the re-split then replaced them with
            // fresh ones sitting at rest, so the text appeared, and the tween
            // was left holding elements no longer in the document.
            onSplit: (self) => {
              show()
              if (played) return

              // Park the lines, then unhide, then animate — never visible at
              // rest. 130% rather than 112% because the mask extends below the
              // line box; a shorter offset would leave the line peeking into
              // that strip.
              gsap.set(self.lines, { yPercent: 130 })
              queued = gsap.to(self.lines, {
                yPercent: 0,
                duration: 1.15,
                ease: 'expo.out',
                stagger: 0.085,
                delay,
                paused: !armed,
              })
              // Returned so GSAP kills it if it re-splits mid-flight.
              return queued
            },
          })

          if (!immediate) {
            observer = new IntersectionObserver((entries) => {
              if (!entries.some((entry) => entry.isIntersecting)) return
              observer?.disconnect()
              armed = true
              played = true
              queued?.play()
            }, REVEAL_OBSERVER_INIT)
            observer.observe(el)
          }
        }, el)

        cleanup = () => {
          observer?.disconnect()
          // kill(false): reverting would re-hide a heading that already ran.
          ctx.kill(false)
          split?.revert()
        }
      })
      .catch(settle)

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
