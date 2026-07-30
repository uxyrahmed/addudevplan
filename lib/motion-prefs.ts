/**
 * Motion capability checks. Deliberately free of any animation-library import
 * so that asking "should we animate?" never costs a byte of GSAP.
 */

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Whether this device should run the optional, decorative animation layer —
 * parallax, split headlines, smooth scrolling.
 *
 * The content and all functional motion work everywhere; this gate only skips
 * the expensive extras on low-core or low-memory hardware, where a scroll-
 * linked rAF loop is the difference between smooth and janky.
 */
export function canAnimateRichly() {
  if (typeof window === 'undefined') return false
  if (prefersReducedMotion()) return false

  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  if (nav.connection?.saveData) return false
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory > 0 && nav.deviceMemory < 4) return false
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency > 0 && nav.hardwareConcurrency < 4) {
    return false
  }
  return true
}
