'use client'

import type { gsap as GsapType } from 'gsap'
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger'
import type { SplitText as SplitTextType } from 'gsap/SplitText'

export type Gsap = typeof GsapType
export type ScrollTriggerCtor = typeof ScrollTriggerType
export type SplitTextCtor = typeof SplitTextType

type Bundle = { gsap: Gsap; ScrollTrigger: ScrollTriggerCtor; SplitText: SplitTextCtor }

let pending: Promise<Bundle> | null = null

/**
 * Loads GSAP on demand.
 *
 * Every animation on this site is a decorative enhancement over content that is
 * already rendered and readable, so none of it belongs in the first payload.
 * Importing here — inside an effect, after paint — keeps roughly 200 KB out of
 * the critical path and off the phones that would feel it most.
 *
 * The promise is cached, so ten components asking for GSAP fetch one chunk.
 */
export function loadGsap(): Promise<Bundle> {
  pending ??= (async () => {
    const [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('gsap/SplitText'),
    ])
    gsap.registerPlugin(ScrollTrigger, SplitText)
    gsap.defaults({ ease: 'power3.out', duration: 0.9 })
    // GSAP's lag smoothing fights a scroll-linked ticker; Lenis drives it here.
    gsap.ticker.lagSmoothing(0)
    return { gsap, ScrollTrigger, SplitText }
  })()
  return pending
}

export { prefersReducedMotion, canAnimateRichly } from './motion-prefs'
