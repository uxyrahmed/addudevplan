'use client'

import { useEffect, useRef } from 'react'
import { loadGsap } from '@/lib/gsap'
import { canAnimateRichly } from '@/lib/motion-prefs'

/**
 * Addu Atoll, drawn rather than screenshotted.
 *
 * The geometry is traced from the council's own atoll map: the reef flat and
 * every island were contour-traced off the deck's artwork and simplified, so
 * the coastline is the plan's, not an approximation. Vector because the two
 * raster maps this replaces carried the deck's own type and palette into a page
 * that has neither, and because a 2218px PNG cannot label itself.
 *
 * The one thing the map argues: the Link Road. It runs the length of the
 * western arm and crosses two channels on causeways, which is why Hithadhoo,
 * Maradhoo, Feydhoo and Gan are one city and Villingili, Hulhudhoo and Meedhoo
 * are not. The road draws itself in on scroll; the islands it never reaches
 * stay unmarked. That contrast is the data.
 */

/* The atoll platform: the rim closed across its channels and the lagoon filled,
   so the ring reads as something that encloses water. Drawn palest, underneath
   everything. */
const PLATFORM =
  'M706.0,74.6L740.3,76.1L792.5,91.0L867.2,89.6L882.1,104.5L880.6,125.4L862.7,165.7L816.4,226.9L820.9,337.3L798.5,416.4L791.0,471.6L774.6,507.5L737.3,526.9L683.6,528.4L682.1,565.7L661.2,604.5L603.0,664.2L567.2,664.2L565.7,692.5L520.9,707.5L519.4,728.4L438.8,728.4L438.8,709.0L368.7,662.7L297.0,586.6L273.1,558.2L235.8,489.6L213.4,426.9L198.5,406.0L189.6,362.7L152.2,322.4L106.0,220.9L95.5,210.4L88.1,176.1L56.7,149.3L47.8,122.4L92.5,107.5L131.3,79.1L149.3,79.1L170.1,150.7L255.2,234.3L282.1,247.8L388.1,252.2L401.5,240.3L444.8,237.3L517.9,188.1L619.4,146.3L647.8,125.4L670.1,92.5Z'

/* Reef flat proper — three arcs, because the rim really is cut by channels. */
const REEF = [
  'M138.8,77.6L149.3,79.1L153.7,85.1L156.7,114.9L170.1,150.7L255.2,234.3L282.1,247.8L373.1,255.2L371.6,307.5L380.6,329.9L344.8,325.4L334.3,349.3L298.5,346.3L298.5,338.8L304.5,343.3L334.3,340.3L340.3,334.3L340.3,310.4L335.8,307.5L343.3,306.0L343.3,295.5L335.8,286.6L303.0,283.6L298.5,286.6L303.0,309.0L274.6,311.9L274.6,320.9L265.7,322.4L265.7,332.8L252.2,355.2L252.2,365.7L259.7,374.6L277.6,425.4L289.6,441.8L288.1,461.2L298.5,470.1L300.0,480.6L325.4,523.9L340.3,535.8L353.7,556.7L371.6,571.6L422.4,597.0L422.4,601.5L434.3,609.0L456.7,617.9L486.6,622.4L497.0,619.4L503.0,626.9L538.8,637.3L562.7,676.1L565.7,692.5L552.2,701.5L523.9,706.0L486.6,719.4L462.7,717.9L422.4,701.5L385.1,674.6L376.1,662.7L368.7,662.7L368.7,656.7L355.2,649.3L310.4,604.5L307.5,595.5L295.5,594.0L295.5,585.1L273.1,558.2L258.2,525.4L247.8,522.4L246.3,516.4L237.3,516.4L246.3,514.9L246.3,506.0L225.4,464.2L195.5,459.7L217.9,456.7L219.4,443.3L198.5,406.0L191.0,365.7L167.2,344.8L153.7,322.4L141.8,322.4L147.8,319.4L147.8,310.4L134.3,291.0L125.4,264.2L113.4,249.3L106.0,220.9L95.5,210.4L88.1,176.1L56.7,149.3L47.8,131.3L49.3,120.9L92.5,107.5L125.4,82.1Z',
  'M706.0,74.6L740.3,76.1L792.5,91.0L867.2,89.6L876.1,94.0L882.1,104.5L879.1,122.4L888.1,123.9L879.1,126.9L864.2,161.2L864.2,170.1L870.1,171.6L856.7,173.1L831.3,200.0L814.9,231.3L820.9,337.3L807.5,398.5L798.5,416.4L791.0,471.6L774.6,507.5L759.7,519.4L729.9,528.4L711.9,528.4L652.2,488.1L653.7,480.6L661.2,477.6L668.7,482.1L673.1,497.0L694.0,494.0L719.4,462.7L732.8,462.7L737.3,458.2L746.3,444.8L746.3,435.8L737.3,423.9L740.3,398.5L752.2,383.6L758.2,364.2L767.2,347.8L767.2,314.9L773.1,307.5L771.6,276.1L762.7,246.3L750.7,229.9L726.9,226.9L717.9,213.4L703.0,203.0L703.0,182.1L694.0,176.1L692.5,162.7L686.6,156.7L667.2,156.7L650.7,168.7L585.1,186.6L576.1,195.5L564.2,195.5L540.3,210.4L511.9,220.9L477.6,243.3L476.1,253.7L468.7,256.7L467.2,271.6L453.7,262.7L444.8,262.7L429.9,279.1L401.5,283.6L386.6,297.0L389.6,249.3L394.0,243.3L423.9,237.3L444.8,240.3L447.8,231.3L455.2,231.3L465.7,219.4L517.9,188.1L556.7,176.1L583.6,158.2L619.4,146.3L647.8,125.4L670.1,92.5Z',
  'M622.4,504.5L628.4,504.5L629.9,522.4L656.7,531.3L680.6,555.2L682.1,565.7L665.7,597.0L668.7,607.5L658.2,607.5L614.9,652.2L603.0,664.2L597.0,662.7L585.1,638.8L585.1,622.4L611.9,585.1L614.9,570.1L629.9,556.7L629.9,547.8L611.9,520.9L620.9,514.9Z',
]

/* Every island the source draws above roughly two hectares, largest first: the
   Hithadhoo chain, Gan, Meedhoo, Maradhoo, Hulhudhoo, Feydhoo, Villingili,
   Hankede and Herethera. The one omission is the sand spit that separates
   Hithadhoo's inner wetland from the lagoon — real, but two units wide here,
   where it reads as a scratch on the drawing rather than as coastline. */
const ISLANDS = [
  'M144.8,92.5L150.7,92.5L144.8,98.5L143.3,95.5L138.8,95.5L125.4,103.0L125.4,106.0L134.3,117.9L137.3,128.4L135.8,135.8L126.9,126.9L120.9,123.9L116.4,123.9L109.0,129.9L109.0,135.8L111.9,138.8L117.9,138.8L107.5,149.3L109.0,159.7L111.9,162.7L119.4,164.2L117.9,165.7L119.4,182.1L116.4,192.5L119.4,197.0L123.9,197.0L135.8,203.0L149.3,219.4L168.7,231.3L182.1,249.3L191.0,265.7L194.0,277.6L192.5,307.5L194.0,309.0L195.5,332.8L204.5,361.2L211.9,376.1L220.9,385.1L223.9,391.0L226.9,404.5L226.9,414.9L231.3,431.3L240.3,444.8L234.3,438.8L228.4,420.9L222.4,411.9L219.4,395.5L204.5,368.7L203.0,355.2L197.0,343.3L168.7,313.4L161.2,298.5L147.8,280.6L134.3,252.2L131.3,241.8L123.9,229.9L119.4,216.4L103.0,188.1L100.0,174.6L85.1,150.7L85.1,138.8L83.6,137.3L86.6,117.9L111.9,107.5L126.9,97.0Z',
  'M417.9,607.5L435.8,617.9L477.6,629.9L489.6,629.9L514.9,640.3L523.9,647.8L523.9,652.2L517.9,667.2L507.5,674.6L480.6,676.1L471.6,673.1L464.2,673.1L458.2,677.6L438.8,670.1L422.4,650.7L422.4,647.8L416.4,641.8L414.9,637.3L411.9,635.8Z',
  'M847.8,97.0L865.7,97.0L870.1,101.5L870.1,111.9L861.2,134.3L841.8,162.7L817.9,185.1L811.9,183.6L800.0,188.1L803.0,183.6L809.0,179.1L807.5,177.6L809.0,156.7L806.0,150.7L806.0,138.8L797.0,116.4L795.5,106.0L806.0,101.5L822.4,101.5Z',
  'M270.1,480.6L286.6,495.5L294.0,510.4L304.5,511.9L307.5,519.4L325.4,543.3L332.8,550.7L338.8,553.7L340.3,561.2L337.3,564.2L335.8,565.7L331.3,564.2L317.9,549.3L307.5,541.8L303.0,532.8L294.0,522.4L285.1,519.4L277.6,506.0L277.6,501.5L268.7,486.6Z',
  'M795.5,192.5L798.5,192.5L806.0,203.0L804.5,279.1L810.4,298.5L809.0,313.4L800.0,344.8L806.0,307.5L803.0,289.6L803.0,271.6L800.0,262.7L800.0,241.8L798.5,240.3L800.0,231.3L797.0,217.9L798.5,207.5Z',
  'M349.3,565.7L365.7,580.6L382.1,588.1L386.6,592.5L401.5,598.5L400.0,601.5L389.6,601.5L373.1,601.5L371.6,600.0L370.1,601.5L355.2,597.0L352.2,592.5L352.2,588.1L346.3,579.1L349.3,571.6Z',
  'M643.3,543.3L662.7,546.3L667.2,550.7L664.2,568.7L661.2,574.6L653.7,580.6L646.3,589.6L649.3,583.6L650.7,573.1L650.7,555.2L647.8,547.8Z',
  'M206.0,313.4L210.4,313.4L210.4,323.9L213.4,337.3L213.4,341.8L207.5,341.8L203.0,341.8L198.5,329.9L198.5,314.9Z',
  'M770.1,100.0L780.6,113.4L788.1,114.9L792.5,113.4L792.5,116.4L795.5,119.4L795.5,125.4L791.0,125.4L785.1,126.9L788.1,125.4L788.1,120.9L779.1,119.4L770.1,104.5Z',
]

/* Sampled down the middle of the western arm, so the road sits on the islands
   it serves and runs straight where it crosses open water. */
const ROAD =
  'M104,140L103,155L111,170L117,187L135,200L143,215L149,235L158,250L168,266L172,283L178,301L182,313L196,328L204,340L205,357L211,376L220,391L225,409L231,431L240,445L250,458L262,472L272,485L281,499L291,510L297,525L311,534L322,547L331,556L345,568L357,578L367,588L378,598L398,606L420,614L430,624L430,636L440,651L459,657L484,660'

/** On the road. Label sits west of the arm, clear of the land. */
const LINKED = [
  { name: 'Hithadhoo', x: 149, y: 235, lx: 74, ly: 241 },
  { name: 'Maradhoo', x: 297, y: 525, lx: 252, ly: 519 },
  { name: 'Feydhoo', x: 367, y: 588, lx: 330, ly: 584 },
  { name: 'Gan', x: 459, y: 657, lx: 408, ly: 668 },
]

/** Reached by boat. No dot, quieter label — the absence is the point. */
const UNLINKED = [
  { name: 'Meedhoo', lx: 884, ly: 112 },
  { name: 'Hulhudhoo', lx: 822, ly: 258 },
  { name: 'Villingili', lx: 680, ly: 574 },
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
        const ctx = gsap.context(() => {
          const road = el.querySelector<SVGPathElement>('[data-road]')
          const stops = el.querySelectorAll('[data-stop]')
          if (!road) return

          // Set the dash only once we know we are animating. Doing it in the
          // markup would leave the road invisible for anyone this effect
          // bails out on — reduced motion, a low-core device, a hidden tab.
          const len = road.getTotalLength()
          gsap.set(road, { strokeDasharray: len, strokeDashoffset: len })
          gsap.set(stops, { opacity: 0, scale: 0, transformOrigin: 'center' })

          const trigger = { trigger: el, start: 'top 80%', once: true } as const

          gsap.to(road, { strokeDashoffset: 0, duration: 2.1, ease: 'power2.inOut', scrollTrigger: trigger })
          // The stops surface as the road reaches them, north to south.
          gsap.to(stops, {
            opacity: 1,
            scale: 1,
            duration: 0.45,
            ease: 'back.out(2)',
            stagger: 0.42,
            delay: 0.45,
            scrollTrigger: trigger,
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
      <svg
        ref={ref}
        viewBox="-60 60 1080 690"
        className="block h-auto w-full"
        role="img"
        aria-label="Map of Addu Atoll. A chain of islands runs down the western side of the atoll — Hithadhoo at the north, then Maradhoo, Feydhoo and Gan at the south — joined end to end by the Link Road, which crosses open water twice on causeways. Meedhoo and Hulhudhoo lie on the north-eastern rim and Villingili in the south-east; none of the three is on the road."
      >
        <path d={PLATFORM} fill="var(--lagoon)" />

        <g fill="var(--reef)">
          {REEF.map((d) => (
            <path key={d.slice(0, 24)} d={d} />
          ))}
        </g>

        <g fill="var(--land)" stroke="var(--coast)" strokeWidth="1.4" strokeLinejoin="round">
          {ISLANDS.map((d) => (
            <path key={d.slice(0, 24)} d={d} />
          ))}
        </g>

        {/* A phone renders this ~335px wide, where a 5-unit stroke lands under
            two device pixels. The road is the whole point, so it thickens
            rather than thins out of legibility. */}
        <path
          data-road
          d={ROAD}
          fill="none"
          stroke="var(--color-navy)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="max-sm:[stroke-width:10]"
        />

        {LINKED.map((s) => (
          <circle
            key={s.name}
            data-stop
            cx={s.x}
            cy={s.y}
            r="8"
            fill="var(--color-navy)"
            stroke="white"
            strokeWidth="3"
            className="max-sm:[r:14] max-sm:[stroke-width:5]"
          />
        ))}

        {/* Labels are sized for the ~530px this renders at in the grid; below
            `sm` the map is too small to carry them and they are dropped, which
            is why the island list beside it stays in the copy. */}
        <g className="hidden font-heading sm:block">
          {LINKED.map((s) => (
            <text key={s.name} x={s.lx} y={s.ly} textAnchor="end" fill="var(--color-ink)" fontSize="23">
              {s.name}
            </text>
          ))}
          {UNLINKED.map((s) => (
            <text key={s.name} x={s.lx} y={s.ly} fill="var(--color-mist)" fontSize="20">
              {s.name}
            </text>
          ))}
        </g>
      </svg>

      {/* Sand for land and blue for sea need no legend. The two marks that
          carry the argument do — and the sentence below carries it again in
          words, for the widths where the map drops its labels. */}
      <figcaption className="mt-5 border-t border-hairline pt-4 text-small text-stone">
        <span className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-[3px] w-7 rounded-full bg-navy" />
            Link Road
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-3 w-3 rounded-full border-[3px] border-navy bg-white" />
            Connected community
          </span>
        </span>
        <p className="mt-3">
          The road joins four of the city&rsquo;s nine islands end to end, crossing open reef
          where the chain breaks. Villingili, Hulhudhoo and Meedhoo sit on the far rim and are
          reached by boat.
        </p>
      </figcaption>
    </figure>
  )
}
