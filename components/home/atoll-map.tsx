'use client'

import { useEffect, useRef } from 'react'
import AirplaneTakeOff01Icon from '@hugeicons/core-free-icons/AirplaneTakeOff01Icon'
import { Icon } from '@/components/ui/icon'
import { loadGsap } from '@/lib/gsap'
import { canAnimateRichly } from '@/lib/motion-prefs'
import { REVEAL_OBSERVER_INIT } from '@/lib/reveal-trigger'
import { ISLAND, LAGOON, LINK_ROAD, MARKERS, OCEAN_EDGE, REEF } from '@/lib/atoll-geometry'
import { useLocale } from '@/components/i18n/locale-provider'
import { fill } from '@/lib/i18n/format'

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
 *
 * It argues it more quietly than it used to. The council asked for a thinner,
 * less prominent line in review — the road was the heaviest mark on a drawing
 * that also has to carry five islands, a runway and a coastline — so the
 * stroke, the rings that cap it and the legend rule beside it all came down
 * together. The phone override stays: at the ~335px this renders at there,
 * a hairline road disappears.
 */

/**
 * Names for the source's numbered markers, north to south.
 *
 * Passed in from the page rather than repeated here, so the map and the list
 * beside it cannot disagree about what the city is made of — and so the names
 * arrive in whichever language the page is being read in.
 *
 * `anchor` places the name clear of the coast: the first island has open reef
 * to its west, the southern three have the lagoon to their east.
 */
const LABELS: { dx: number; dy: number; anchor: 'start' | 'end' }[] = [
  { dx: -22, dy: 6, anchor: 'end' },
  { dx: 24, dy: -6, anchor: 'start' },
  { dx: 24, dy: 5, anchor: 'start' },
  // Feydhoo sits further out than the rest, and higher: the island south of it
  // reaches up to about y 644 and east to about x 490, so a nearer or lower
  // label put the word on the sand while the two above it sat in clear water.
  { dx: 44, dy: 8, anchor: 'start' },
]

/**
 * The two ends of the Link Road, taken from the road's own first and last
 * point so they cannot drift from the line they cap.
 *
 * A stroke that simply stops mid-lagoon reads as an unfinished drawing; a ring
 * at each end says the road ends *there*.
 *
 * The rings used to carry "North" and "South" set beside them. That was the
 * map making a third time a point already made twice — by the markers running
 * 1–4 down the chain, and by the caption underneath that names the direction
 * outright. The rings stay; the words go.
 */
const ROAD_ENDS = [
  { id: 'north', x: 160, y: 146 },
  { id: 'south', x: 579, y: 689 },
] as const

/**
 * Gan, and the runway on it.
 *
 * Gan is not one of the four islands of the city, so it carries no numbered
 * marker — but the road ends on it, the plan's own lede now says it holds the
 * international airport, and the council asked in review for the runway, an
 * airport sign and the name. An unlabelled island at the end of the road was
 * the one place the drawing left a reader guessing.
 *
 * The runway line is drawn along the island's long axis rather than surveyed:
 * every point on it was checked to fall inside Gan's traced outline, which
 * makes it an honest indication of *where on the island* the runway runs and
 * not a measurement of its bearing or length. Dashed, so it reads as a strip
 * rather than as another road — the Link Road beside it is a solid line of
 * nearly the same weight.
 *
 * The name sits in open water east of the island, the way the four island
 * labels sit clear of their coasts.
 */
const GAN = {
  runway: { x1: 465, y1: 696, x2: 598, y2: 704 },
  glyph: { x: 610, y: 668, size: 30 },
  label: { x: 648, y: 686 },
} as const

/**
 * Which way is north.
 *
 * Down the left edge, in open water outside the reef — the drawing's own
 * westernmost land starts at x 117 and the reef at x 78. Small, as asked: the
 * letters are half the size of an island name and the arrow is a hairline, so
 * it reads as the marginal note it is rather than as a compass rose.
 */
const NORTH_ARROW = { x: 74, top: 52, bottom: 146 } as const

/**
 * `islands` comes down from the page rather than out of `lib/plan.ts`: the
 * names are translated, and reaching for the plan module from a client
 * component would put the whole of it — and every translation of it — in the
 * home page's bundle to read four strings out of it.
 *
 * The order is the geography. The markers are numbered 1–4 from the north and
 * read their names out of this array by index, so the page passes it in the
 * order the plan holds it.
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
          const road = el.querySelector<SVGPathElement>('[data-road]')
          const stops = el.querySelectorAll('[data-stop]')
          const ends = el.querySelectorAll('[data-end]')
          if (!road) return

          // Set the dash only once we know we are animating. Doing it in the
          // markup would leave the road invisible for anyone this effect bails
          // out on — reduced motion, a low-core device, a hidden tab.
          const len = road.getTotalLength()
          // Negative, not positive. The source path is drawn south to north, so
          // a positive offset would reveal it from the southern end — against
          // the way the map is read and against the order the markers surface
          // in. Offsetting the other way draws it from the north instead,
          // without reversing 104 points of path data.
          gsap.set(road, { strokeDasharray: len, strokeDashoffset: -len })
          gsap.set(stops, { opacity: 0, scale: 0, transformOrigin: 'center' })
          gsap.set(ends, { opacity: 0 })

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
            // Each end appears as the road gets there: the north one as it sets
            // off, the south one as it arrives.
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
    // baseline as the copy beside it instead of floating above it.
    //
    // The map is as wide as the column and its aspect ratio is fixed, so it
    // cannot grow to take up the slack — the space has to go somewhere. It is
    // split above and below the drawing rather than left as one hole under it,
    // which would read as a gap rather than as margin.
    <figure className="flex h-full flex-col gap-5">
      <div className="flex flex-1 items-center">
        <svg
          ref={ref}
          viewBox="58 24 1000 790"
          className="block h-auto w-full"
          role="img"
          aria-label={fill(t.map.aria, { islands: islands.join('، ') })}
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

          {/* A phone renders this ~335px wide, where a 3-unit stroke lands under
              one device pixel. The road still has to be followable there, so it
              thickens rather than thins out of legibility. */}
          <path
            data-road
            d={LINK_ROAD}
            fill="none"
            stroke="var(--color-navy)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="max-sm:[stroke-width:6]"
          />

          {/* Hollow, where the island markers are solid: this is where the road
              stops, not a place. */}
          {ROAD_ENDS.map((end) => (
            <circle
              key={end.id}
              data-end={end.id}
              cx={end.x}
              cy={end.y}
              r="6"
              fill="white"
              stroke="var(--color-navy)"
              strokeWidth="2.5"
              className="max-sm:[r:9] max-sm:[stroke-width:4]"
            />
          ))}

          {/* Gan: the runway on the island, the sign, and the name in the water
              beside it. Not animated with the road — the road's stagger is
              about the four islands it joins, and Gan is the place it arrives
              at. */}
          <g>
            <line
              x1={GAN.runway.x1}
              y1={GAN.runway.y1}
              x2={GAN.runway.x2}
              y2={GAN.runway.y2}
              stroke="var(--color-navy)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="1 7"
              className="max-sm:[stroke-width:5]"
            />
            <Icon
              icon={AirplaneTakeOff01Icon}
              x={GAN.glyph.x}
              y={GAN.glyph.y}
              size={GAN.glyph.size}
              weight={1.6}
              className="text-navy"
            />
            <text
              x={GAN.label.x}
              y={GAN.label.y}
              dominantBaseline="central"
              fill="var(--color-ink)"
              fontSize="25"
              className="hidden font-heading sm:block"
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
            <polygon points="74,62 70,72 78,72" strokeWidth="0" />
            <line
              x1={NORTH_ARROW.x}
              y1="72"
              x2={NORTH_ARROW.x}
              y2="132"
              strokeWidth="1.5"
            />
            <text
              x={NORTH_ARROW.x}
              y={NORTH_ARROW.bottom}
              textAnchor="middle"
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
              the map is too small to carry them and they are dropped, which is
              why the numbered list beside it stays in the copy. */}
          <g className="hidden font-heading sm:block">
            {MARKERS.map(([x, y], i) => (
              <text
                key={islands[i]}
                x={x + LABELS[i].dx}
                y={y + LABELS[i].dy}
                textAnchor={LABELS[i].anchor}
                fill="var(--color-ink)"
                fontSize="25"
              >
                {islands[i]}
              </text>
            ))}
          </g>
        </svg>
      </div>

      {/* Sand for land and blue for sea need no legend. The two marks that
          carry the argument do.

          A sentence used to sit under these marks restating the Link Road in
          words. It was the lede from the column alongside, near enough verbatim
          — the same claim printed twice, a gutter apart. The legend keeps the
          job the graphic cannot do for itself; the argument is made once, in
          the copy. */}
      <figcaption className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-hairline pt-4 text-small text-stone">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="h-[2px] w-7 rounded-full bg-navy" />
          {t.map.linkRoad}
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-navy text-[9px] font-bold text-white"
          >
            1
          </span>
          {t.map.islandOfCity}
        </span>
      </figcaption>
    </figure>
  )
}
