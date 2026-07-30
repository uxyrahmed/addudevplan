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
 */
export function StatCounter({ value, className = '' }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    const parsed = parse(value)
    if (!el || !parsed || !canAnimateRichly() || document.visibilityState === 'hidden') return

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
