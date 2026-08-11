'use client'

import { useEffect, useRef } from 'react'
import { loadGsap } from '@/lib/gsap'
import { canAnimateRichly } from '@/lib/motion-prefs'
import { REVEAL_OBSERVER_INIT } from '@/lib/reveal-trigger'
import { ISLAND, LAGOON, LINK_ROAD, MARKERS, OCEAN_EDGE, REEF } from '@/lib/atoll-geometry'
import { LAND } from '@/lib/plan'

/**
 * Addu Atoll, from the council's own map artwork.
 *
 * The geometry lives in lib/atoll-geometry.ts; this decides how it reads. The
 * source numbers the four islands of the city 1–4 from the north, and those
 * numbers are kept — they are the council's own key — with the name set beside
 * each, so the map can be read without the legend.
 *
 * The one thing it argues: the Link Road. It runs the length of the western
 * chain and crosses open water on causeways, which is what makes Hithadhoo,
 * Maradhoo, Maradhoo-Feydhoo and Feydhoo one city. The road draws itself in on
 * scroll, on the same threshold as everything else that arrives on this page.
 */

/**
 * Names for the source's numbered markers, north to south.
 *
 * Taken from LAND.islands rather than repeated here, so the map and the list
 * beside it cannot disagree about what the city is made of.
 *
 * `anchor` places the name clear of the coast: the first island has open reef
 * to its west, the southern three have the lagoon to their east.
 */
const LABELS: { dx: number; dy: number; anchor: 'start' | 'end' }[] = [
  { dx: -22, dy: 6, anchor: 'end' },
  { dx: 24, dy: -6, anchor: 'start' },
  { dx: 24, dy: 5, anchor: 'start' },
  { dx: 24, dy: 16, anchor: 'start' },
]

export function AtollMap() {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !canAnimateRichly() || document.visibilityState === 'hidden') return

    let cancelled = false
    let cleanup: (() => void) | undefined

    loadGsap()
      .then(({ gsap }) => {
        if (cancelled) return
        let observer: IntersectionObserver | undefined

        const ctx = gsap.context(() => {
          const road = el.querySelector<SVGPathElement>('[data-road]')
          const stops = el.querySelectorAll('[data-stop]')
          if (!road) return

          // Set the dash only once we know we are animating. Doing it in the
          // markup would leave the road invisible for anyone this effect bails
          // out on — reduced motion, a low-core device, a hidden tab.
          const len = road.getTotalLength()
          gsap.set(road, { strokeDasharray: len, strokeDashoffset: len })
          gsap.set(stops, { opacity: 0, scale: 0, transformOrigin: 'center' })

          const play = () => {
            gsap.to(road, { strokeDashoffset: 0, duration: 2.1, ease: 'power2.inOut' })
            // The markers surface as the road reaches them, north to south.
            gsap.to(stops, {
              opacity: 1,
              scale: 1,
              duration: 0.45,
              ease: 'back.out(2)',
              stagger: 0.42,
              delay: 0.45,
            })
          }

          observer = new IntersectionObserver((entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return
            observer?.disconnect()
            play()
          }, REVEAL_OBSERVER_INIT)
          observer.observe(el)
        }, el)

        cleanup = () => {
          observer?.disconnect()
          ctx.kill(false)
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  return (
    <figure>
      <svg
        ref={ref}
        viewBox="58 24 1000 790"
        className="block h-auto w-full"
        role="img"
        aria-label={`Map of Addu Atoll. The four islands of the city — ${LAND.islands.join(', ')} — lie along the western side of the atoll, joined end to end by the Link Road, which crosses open water on causeways. The rest of the atoll rim is reef and uninhabited islands.`}
      >
        <g fill="var(--reef)">
          {REEF.map((d) => (
            <path key={d.slice(0, 24)} d={d} />
          ))}
        </g>

        <g fill="var(--lagoon)">
          {LAGOON.map((d) => (
            <path key={d.slice(0, 24)} d={d} />
          ))}
        </g>

        {/* The line where the flat drops away to open ocean. Hairline, because
            it is orientation rather than information. */}
        <g fill="none" stroke="var(--coast)" strokeWidth="1.5" strokeOpacity="0.5">
          {OCEAN_EDGE.map((d) => (
            <path key={d.slice(0, 24)} d={d} />
          ))}
        </g>

        <g fill="var(--land)" stroke="var(--coast)" strokeWidth="1.2" strokeLinejoin="round">
          {ISLAND.map((d) => (
            <path key={d.slice(0, 24)} d={d} />
          ))}
        </g>

        {/* A phone renders this ~335px wide, where a 5-unit stroke lands under
            two device pixels. The road is the whole point, so it thickens
            rather than thins out of legibility. */}
        <path
          data-road
          d={LINK_ROAD}
          fill="none"
          stroke="var(--color-navy)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="max-sm:[stroke-width:9]"
        />

        {MARKERS.map(([x, y], i) => (
          <g key={LAND.islands[i]} data-stop>
            <circle
              cx={x}
              cy={y}
              r="15"
              fill="var(--color-navy)"
              stroke="white"
              strokeWidth="3"
              className="max-sm:[r:22] max-sm:[stroke-width:5]"
            />
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="white"
              fontSize="19"
              fontWeight="700"
              className="font-heading max-sm:[font-size:28px]"
            >
              {i + 1}
            </text>
          </g>
        ))}

        {/* Names sized for the ~530px this renders at in the grid. Below `sm`
            the map is too small to carry them and they are dropped, which is
            why the numbered list beside it stays in the copy. */}
        <g className="hidden font-heading sm:block">
          {MARKERS.map(([x, y], i) => (
            <text
              key={LAND.islands[i]}
              x={x + LABELS[i].dx}
              y={y + LABELS[i].dy}
              textAnchor={LABELS[i].anchor}
              fill="var(--color-ink)"
              fontSize="25"
            >
              {LAND.islands[i]}
            </text>
          ))}
        </g>
      </svg>

      {/* Sand for land and blue for sea need no legend. The two marks that
          carry the argument do — and the sentence below carries it again in
          words, for the widths where the map drops its names. */}
      <figcaption className="mt-5 border-t border-hairline pt-4 text-small text-stone">
        <span className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-[3px] w-7 rounded-full bg-navy" />
            Link Road
          </span>
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden
              className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-navy text-[9px] font-bold text-white"
            >
              1
            </span>
            Island of the city
          </span>
        </span>
        <p className="mt-3">
          The Link Road joins the four islands of the city end to end, from Hithadhoo in the north
          down to Feydhoo, crossing open reef where the chain breaks. The rest of the atoll rim is
          reef and uninhabited islands.
        </p>
      </figcaption>
    </figure>
  )
}
