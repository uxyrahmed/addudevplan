'use client'

import { useEffect, useRef } from 'react'
import AirplaneTakeOff01Icon from '@hugeicons/core-free-icons/AirplaneTakeOff01Icon'
import { Icon } from '@/components/ui/icon'
import { loadGsap } from '@/lib/gsap'
import { canAnimateRichly } from '@/lib/motion-prefs'
import { REVEAL_OBSERVER_INIT } from '@/lib/reveal-trigger'
import { LINK_ROAD, MARKERS } from '@/lib/atoll-geometry'
import { useLocale } from '@/components/i18n/locale-provider'
import { fill } from '@/lib/i18n/format'

/**
 * Addu Atoll, on the council's drone imagery.
 *
 * The photograph is the base; everything that carries meaning is drawn over it
 * in SVG, so the names stay translatable and the road can still draw itself in.
 * The marks keep the coordinates of the traced drawing in lib/atoll-geometry.ts:
 * that drawing's Link Road and the road in the council's GIS export are the same
 * 104 points, and fitting one to the other gives the affine transform the
 * photograph is placed with (worst point 0.6 drawing units off).
 *
 * The four islands of the city keep the council's 1–4 numbering from the north,
 * with the name set beside each. The Link Road is the one thing the map argues:
 * it runs the length of the western chain and crosses open water on causeways,
 * which is what makes Hithadhoo, Maradhoo, Maradhoo-Feydhoo and Feydhoo one city.
 *
 * On a photograph the road has to be found against turquoise lagoon, dark reef
 * edge and grey-green land at once, so it is a warm orange on a white casing —
 * the one colour none of those three share.
 */

/**
 * The drone imagery, stitched from the export's 497 strips and cropped to its
 * content. It is placed in the drawing's units by the inverse of the fitted
 * transform, at the imagery's own pixel size.
 */
const PHOTO = {
  href: '/darku-2000.webp',
  transform: 'matrix(0.045011 0.000073 -0.000002 0.044946 -37.14373 -8.814342)',
  x: 2397,
  y: 1199,
  width: 21452,
  height: 16650,
} as const

/**
 * Names for the numbered markers, north to south.
 *
 * `anchor` places the name clear of the coast: the first island has open reef
 * to its west, the southern three have the lagoon to their east.
 */
const LABELS: { dx: number; dy: number; anchor: 'start' | 'end' }[] = [
  { dx: -22, dy: 6, anchor: 'end' },
  { dx: 24, dy: -6, anchor: 'start' },
  { dx: 24, dy: 5, anchor: 'start' },
  { dx: 44, dy: 8, anchor: 'start' },
]

/** The two ends of the Link Road, the road's own first and last point. */
const ROAD_ENDS = [
  { id: 'north', x: 160, y: 146 },
  { id: 'south', x: 579, y: 689 },
] as const

/**
 * Gan's airport. The badge sits where the council's GIS export marks it, on the
 * runway; the name sits in the water east of the island.
 */
const AIRPORT = { x: 554, y: 704, r: 17, label: { x: 648, y: 686 } } as const

/** Bottom-left, in the one corner the imagery leaves empty. */
const NORTH_ARROW = { x: 92, top: 682, bottom: 776 } as const

/**
 * Keeps dark text readable where it crosses imagery: a white stroke painted
 * under the glyph fill.
 */
const HALO = {
  stroke: 'white',
  strokeWidth: 5,
  strokeLinejoin: 'round',
  paintOrder: 'stroke',
} as const

/**
 * `islands` comes down from the page rather than out of `lib/plan.ts`: the
 * names are translated, and reaching for the plan module from a client
 * component would put the whole of it in the home page's bundle.
 *
 * The order is the geography. The markers are numbered 1–4 from the north and
 * read their names out of this array by index.
 */
export function AtollMap({ islands, gan }: { islands: string[]; gan: string }) {
  const { t } = useLocale()
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
          // The road and its casing, drawn in together.
          const roads = el.querySelectorAll<SVGPathElement>('[data-road]')
          const stops = el.querySelectorAll('[data-stop]')
          const ends = el.querySelectorAll('[data-end]')
          if (!roads.length) return

          // Set the dash only once we know we are animating, so the road is
          // never left invisible for anyone this effect bails out on.
          const len = roads[0].getTotalLength()
          // Negative: the source path runs south to north, and the map is read
          // from the north.
          gsap.set(roads, { strokeDasharray: len, strokeDashoffset: -len })
          gsap.set(stops, { opacity: 0, scale: 0, transformOrigin: 'center' })
          gsap.set(ends, { opacity: 0 })

          const play = () => {
            gsap.to(roads, { strokeDashoffset: 0, duration: 2.1, ease: 'power2.inOut' })
            gsap.to(stops, {
              opacity: 1,
              scale: 1,
              duration: 0.45,
              ease: 'back.out(2)',
              stagger: 0.42,
              delay: 0.45,
            })
            gsap.to(el.querySelectorAll('[data-end="north"]'), { opacity: 1, duration: 0.4 })
            gsap.to(el.querySelectorAll('[data-end="south"]'), {
              opacity: 1,
              duration: 0.4,
              delay: 1.85,
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
    // Fills the height its column is given, so the legend lands on the same
    // baseline as the copy beside it; the slack is split above and below.
    <figure className="flex h-full flex-col gap-5">
      <div className="flex flex-1 items-center">
        <svg
          ref={ref}
          viewBox="58 24 1000 790"
          className="block h-auto w-full"
          role="img"
          aria-label={fill(t.map.aria, { islands: islands.join('، ') })}
        >
          <image
            href={PHOTO.href}
            transform={PHOTO.transform}
            x={PHOTO.x}
            y={PHOTO.y}
            width={PHOTO.width}
            height={PHOTO.height}
            preserveAspectRatio="none"
          />

          {/* Thicker below `sm`: a phone renders this ~335px wide. */}
          <path
            data-road
            d={LINK_ROAD}
            fill="none"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="max-sm:[stroke-width:13]"
          />
          <path
            data-road
            d={LINK_ROAD}
            fill="none"
            stroke="var(--road)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="max-sm:[stroke-width:8]"
          />

          {/* Hollow, where the island markers are solid: this is where the road
              stops, not a place. */}
          {ROAD_ENDS.map((end) => (
            <circle
              key={end.id}
              data-end={end.id}
              cx={end.x}
              cy={end.y}
              r="7"
              fill="white"
              stroke="var(--color-navy)"
              strokeWidth="3"
              className="max-sm:[r:10] max-sm:[stroke-width:4]"
            />
          ))}

          <g>
            <circle
              cx={AIRPORT.x}
              cy={AIRPORT.y}
              r={AIRPORT.r}
              fill="var(--color-navy)"
              stroke="white"
              strokeWidth="3"
              className="max-sm:[r:24] max-sm:[stroke-width:5]"
            />
            <Icon
              icon={AirplaneTakeOff01Icon}
              x={AIRPORT.x - 12}
              y={AIRPORT.y - 12}
              size={24}
              weight={1.8}
              className="text-white"
            />
            <text
              x={AIRPORT.label.x}
              y={AIRPORT.label.y}
              dominantBaseline="central"
              fill="var(--color-ink)"
              fontSize="25"
              className="hidden font-heading sm:block"
              {...HALO}
            >
              {gan}
            </text>
          </g>

          {/* North and south, at the size the council asked for: "very small". */}
          <g
            aria-hidden
            className="font-heading"
            fill="var(--color-stone)"
            stroke="var(--color-stone)"
          >
            <text
              x={NORTH_ARROW.x}
              y={NORTH_ARROW.top}
              textAnchor="middle"
              fontSize="13"
              stroke="none"
            >
              N
            </text>
            <polygon
              points={`${NORTH_ARROW.x},${NORTH_ARROW.top + 10} ${NORTH_ARROW.x - 4},${NORTH_ARROW.top + 20} ${NORTH_ARROW.x + 4},${NORTH_ARROW.top + 20}`}
              strokeWidth="0"
            />
            <line
              x1={NORTH_ARROW.x}
              y1={NORTH_ARROW.top + 20}
              x2={NORTH_ARROW.x}
              y2={NORTH_ARROW.bottom - 14}
              strokeWidth="1.5"
            />
            <text
              x={NORTH_ARROW.x}
              y={NORTH_ARROW.bottom}
              textAnchor="middle"
              dominantBaseline="hanging"
              fontSize="13"
              stroke="none"
            >
              S
            </text>
          </g>

          {MARKERS.map(([x, y], i) => (
            <g key={islands[i]} data-stop>
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
              the map is too small to carry them, which is why the numbered list
              beside it stays in the copy. */}
          <g className="hidden font-heading sm:block">
            {MARKERS.map(([x, y], i) => (
              <text
                key={islands[i]}
                x={x + LABELS[i].dx}
                y={y + LABELS[i].dy}
                textAnchor={LABELS[i].anchor}
                fill="var(--color-ink)"
                fontSize="25"
                {...HALO}
              >
                {islands[i]}
              </text>
            ))}
          </g>
        </svg>
      </div>

      <figcaption className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-hairline pt-4 text-small text-stone">
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="h-[5px] w-7 rounded-full bg-[var(--road)] ring-1 ring-white"
          />
          {t.map.linkRoad}
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[10px] font-bold text-white"
          >
            1
          </span>
          {t.map.islandOfCity}
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-navy text-white"
          >
            <Icon icon={AirplaneTakeOff01Icon} size={13} weight={1.8} />
          </span>
          {t.map.airport}
        </span>
      </figcaption>
    </figure>
  )
}
