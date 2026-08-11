/**
 * The one moment the site considers something "arrived".
 *
 * Shared rather than repeated because two layers animate on it — the CSS
 * reveals in components/motion/reveals.tsx and the split headlines in
 * components/motion/split-heading.tsx. They used to carry their own thresholds
 * (an observer margin here, a ScrollTrigger `top 88%` there). Nominally the
 * same line, but two systems measuring it independently drift, and a heading
 * whose lines rise a beat after the block around it has faded in reads as a
 * glitch rather than a sequence.
 *
 * Fires a little before the element's top edge reaches the fold.
 */
export const REVEAL_OBSERVER_INIT: IntersectionObserverInit = {
  rootMargin: '0px 0px -12% 0px',
  threshold: 0,
}
