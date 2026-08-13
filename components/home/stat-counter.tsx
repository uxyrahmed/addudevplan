'use client'

import { useEffect, useRef } from 'react'
import { loadGsap } from '@/lib/gsap'
import { canAnimateRichly } from '@/lib/motion-prefs'

/** Splits "1,268 ha" into ["", 1268, " ha"] so only the number animates. */
function parse(value: string) {
  const m = value.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/)
  if (!m) return null
  const [, prefix, digits, suffix] = m
  const decimals = digits.includes('.') ? digits.split('.')[1].length : 0
  const grouped = digits.includes(',')
  const n = Number(digits.replace(/,/g, ''))
  if (!Number.isFinite(n)) return null
  return { prefix, n, suffix, decimals, grouped }
}

/**
 * A figure that counts up when it scrolls into view. Renders its final value
 * server-side, so a non-numeric value, a reduced-motion visitor or a device we
 * chose not to animate on simply reads the number.
 *
 * KNOWN BUG — the "Where we are today" figures on a goal page still flash on
 * entry, and the guard below did not fix it.
 *
 * What is established: the final value is server-rendered, and the tween starts
 * from `{ v: 0 }` and writes each step into the element, so anything already on
 * screen when the trigger fires shows the real number, snaps toward zero, then
 * climbs back. A screenshot of goal 1 caught "35,102 MVR" against the deck's
 * 35,351, which is that tween mid-flight. On the home page the same code reads
 * as an intended count-up because those figures sit below the fold.
 *
 * What is not established: why the in-band guard below does not stop it. It was
 * never observed working — the browser pane used to test this reports
 * `visibilityState: "hidden"` with requestAnimationFrame suspended (0 frames in
 * 500ms), which makes this component bail at the `visibilityState` check above
 * and never install a tween at all. So the guard is unverified rather than
 * disproven, and the real cause may be elsewhere in the section entirely — the
 * `data-reveal-stagger` group on the same `dl`, or the view transition, are
 * both untested candidates.
 *
 * Next step: reproduce in a real browser with the pane visible, and record what
 * actually changes — the text content, the opacity, or the position.
 */
export function StatCounter({ value, className = '' }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    const parsed = parse(value)
    if (!el || !parsed || !canAnimateRichly() || document.visibilityState === 'hidden') return

    // Never count up a figure the reader is already looking at.
    //
    // The final value is server-rendered, and the tween starts from zero and
    // writes each step into the element — so for anything already on screen the
    // sequence was: the real number paints, snaps back to 0, then climbs to the
    // real number again. Below the fold that is a count-up. Above it, it is the
    // number appearing to be wrong.
    //
    // The threshold matches the ScrollTrigger start below, so the two agree on
    // what counts as "in view": the goal pages put "Where we are today" inside
    // that band on load, which is where this showed up.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return

    let cancelled = false
    let cleanup: (() => void) | undefined

    loadGsap()
      .then(({ gsap }) => {
        if (cancelled) return

        const { prefix, n, suffix, decimals, grouped } = parsed
        const counter = { v: 0 }
        const format = (x: number) => {
          const fixed = x.toFixed(decimals)
          const out = grouped
            ? Number(fixed).toLocaleString('en-US', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
              })
            : fixed
          return `${prefix}${out}${suffix}`
        }

        const ctx = gsap.context(() => {
          gsap.to(counter, {
            v: n,
            duration: 1.6,
            ease: 'expo.out',
            onUpdate: () => {
              el.textContent = format(counter.v)
            },
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          })
        }, el)

        cleanup = () => {
          ctx.kill(false)
          el.textContent = value
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [value])

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  )
}
