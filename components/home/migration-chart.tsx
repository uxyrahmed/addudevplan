'use client'

import { useEffect, useRef } from 'react'
import { loadGsap } from '@/lib/gsap'
import { canAnimateRichly } from '@/lib/motion-prefs'
import { MIGRATION_SERIES as DATA } from '@/lib/plan'

const W = 720
const H = 400
const PAD = { top: 20, right: 34, bottom: 42, left: 46 }
const MAX = 45

const x = (i: number) =>
  PAD.left + (i / (DATA.years.length - 1)) * (W - PAD.left - PAD.right)
const y = (v: number) => H - PAD.bottom - (v / MAX) * (H - PAD.top - PAD.bottom)

const path = (values: readonly number[]) =>
  values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')

/**
 * Addu's share of the national population against Male''s — the out-migration
 * story the plan opens with. Lines draw themselves in on scroll.
 */
export function MigrationChart() {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !canAnimateRichly() || document.visibilityState === 'hidden') return

    let cancelled = false
    let cleanup: (() => void) | undefined

    loadGsap()
      .then(({ gsap }) => {
        if (cancelled) return
        const ctx = gsap.context(() => {
          const lines = el.querySelectorAll<SVGPathElement>('[data-line]')
          lines.forEach((line) => {
            const len = line.getTotalLength()
            gsap.set(line, { strokeDasharray: len, strokeDashoffset: len })
          })
          gsap.to(lines, {
            strokeDashoffset: 0,
            duration: 1.8,
            ease: 'power2.inOut',
            stagger: 0.15,
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          })
          gsap.set(el.querySelectorAll('[data-dot]'), { opacity: 0, scale: 0, transformOrigin: 'center' })
          gsap.to(el.querySelectorAll('[data-dot]'), {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.03,
            delay: 0.6,
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          })
        }, el)
        cleanup = () => ctx.kill(false)
      })
      .catch(() => {})

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  return (
    <figure>
      {/* Mirrors the ledger's header row exactly, so the two columns start on
          the same line and read as one pair rather than two loose objects. */}
      <figcaption className="flex items-baseline justify-between border-b border-hairline pb-2.5">
        <span className="font-body text-micro tracking-[0.1em] text-mist uppercase">
          Share of the Maldives
        </span>
        <span className="font-body text-micro tracking-[0.1em] text-mist uppercase">1958–2022</span>
      </figcaption>

      {/* No min-width and no horizontal scroll: in a half-width column the old
          576px floor forced a scrollbar and clipped the final year label. The
          chart scales instead, and the viewBox carries enough right padding for
          the last label to sit inside it. */}
      <div className="mt-8">
        <svg
          ref={ref}
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full"
          role="img"
          aria-label={`${DATA.subtitle}. Addu falls from 9% in 1958 to 5.1% in 2022, while Male' rises from 11% to 40%.`}
        >
          {[0, 10, 20, 30, 40].map((tick) => (
            <g key={tick}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y(tick)}
                y2={y(tick)}
                stroke="var(--color-hairline)"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 10}
                y={y(tick) + 4}
                textAnchor="end"
                className="fill-stone text-[14px]"
              >
                {tick}%
              </text>
            </g>
          ))}

          {DATA.years.map((year, i) =>
            i % 2 === 0 || i === DATA.years.length - 1 ? (
              <text
                key={year}
                x={x(i)}
                y={H - PAD.bottom + 20}
                textAnchor="middle"
                className="fill-stone text-[14px]"
              >
                {year}
              </text>
            ) : null,
          )}

          {DATA.series.map((s) => (
            <g key={s.name}>
              <path
                data-line
                d={path(s.values)}
                fill="none"
                stroke={s.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {s.values.map((v, i) => (
                <circle
                  key={i}
                  data-dot
                  cx={x(i)}
                  cy={y(v)}
                  r="3.5"
                  fill="white"
                  stroke={s.color}
                  strokeWidth="2"
                />
              ))}
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-small text-stone">
        {DATA.series.map((s) => (
          <span key={s.name} className="inline-flex items-center gap-2">
            <span className="h-0.5 w-6 rounded-full" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>

      <p className="mt-4 text-small text-stone">
        Addu&rsquo;s share of the Maldivian population fell from 9% to 5.1%, while Male&rsquo;s
        rose from 11% to 40% — the same story as the bars, seen nationally.
      </p>
    </figure>
  )
}
