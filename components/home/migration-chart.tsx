'use client'

import { useEffect, useRef } from 'react'
import { loadGsap } from '@/lib/gsap'
import { canAnimateRichly } from '@/lib/motion-prefs'
import { useLocale } from '@/components/i18n/locale-provider'
import { fill } from '@/lib/i18n/format'
import type { LocalizedPlan } from '@/lib/plan-i18n'

const W = 720
/**
 * Tall enough to fill the row it shares with the ledger.
 *
 * It used to be 340 — "shorter than it is wide by design" — which was right
 * when the chart sat under a standfirst on the home page. Beside a nine-row
 * ledger it left the drawing floating in the middle of its column with a
 * couple of hundred pixels of nothing above and below. Nothing about the data
 * demanded the flat aspect, and the vertical run is where this chart's whole
 * argument is: two lines starting level in 1958 and ending 35 points apart.
 *
 * The type does not stretch with it — text is sized in viewBox units and the
 * box scales on width alone — so this only spreads the gridlines.
 */
const H = 560
const PAD = { top: 24, right: 34, bottom: 48, left: 46 }
const MAX = 45

/**
 * Takes the number of years rather than reading it off a module-level series.
 * The chart is handed its data now — the series names are translated — so the
 * count is not known until render.
 */
const x = (i: number, n: number) =>
  PAD.left + (i / (n - 1)) * (W - PAD.left - PAD.right)
const y = (v: number) => H - PAD.bottom - (v / MAX) * (H - PAD.top - PAD.bottom)

const path = (values: readonly number[], n: number) =>
  values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i, n).toFixed(1)},${y(v).toFixed(1)}`).join(' ')

/**
 * Addu's share of the national population against Male''s — the out-migration
 * story the plan opens with. Lines draw themselves in on scroll.
 */
/**
 * `data` arrives with its two series names already in the reader's language.
 * The years and the values are the same figures either way, and are what the
 * geometry above is drawn against.
 */
export function MigrationChart({ data }: { data: LocalizedPlan['migration'] }) {
  const { t } = useLocale()
  const DATA = data
  const n = DATA.years.length
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
    // Fills the height its column is given. The ledger beside it is nine rows
    // tall and this is one fixed-ratio drawing, so the chart column used to
    // stop 226px above the ledger's last row and the pair stopped looking like
    // a pair. The drawing cannot grow to take the slack — its aspect is locked
    // — so the slack is split above and below it instead of left as one hole,
    // the same way the atoll map handles the same problem.
    <figure className="flex h-full flex-col">
      {/* Mirrors the ledger's header row exactly, so the two columns start on
          the same line and read as one pair rather than two loose objects. */}
      <figcaption className="flex items-baseline justify-between border-b border-hairline pb-2.5">
        {/* "Share of the Maldives" left the reader to supply the noun, and the
            two candidates — land and people — are not the same chart. */}
        <span className="font-body text-micro tracking-[0.1em] text-mist uppercase">
          {t.chart.nationalShare}
        </span>
        <span className="font-body text-micro tracking-[0.1em] text-mist uppercase">
          {t.chart.nationalShareYears}
        </span>
      </figcaption>

      {/* No min-width and no horizontal scroll: in a half-width column the old
          576px floor forced a scrollbar and clipped the final year label. The
          chart scales instead, and the viewBox carries enough right padding for
          the last label to sit inside it. */}
      <div className="flex flex-1 items-center py-6">
        <svg
          ref={ref}
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full"
          role="img"
          aria-label={fill(t.chart.chartAria, { subtitle: DATA.subtitle })}
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
                x={x(i, n)}
                y={H - PAD.bottom + 20}
                textAnchor="middle"
                className="fill-stone text-[14px]"
              >
                {year}
              </text>
            ) : null,
          )}

          {DATA.series.map((s, si) => (
            <g key={si}>
              <path
                data-line
                d={path(s.values, n)}
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
                  cx={x(i, n)}
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

      <div className="mt-3.5 flex flex-wrap items-center gap-x-6 gap-y-2 text-small text-stone">
        {DATA.series.map((s, si) => (
          <span key={si} className="inline-flex items-center gap-2">
            <span className="h-0.5 w-6 rounded-full" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>

      {/* Reads off the two lines and stops. It used to close on "the same story
          as the bars", which pointed at a graphic with no name on the page and
          asserted that the two charts mean the same thing — a reading, not a
          measurement. */}
      <p className="mt-3.5 text-small text-stone">{t.chart.reading}</p>
    </figure>
  )
}
