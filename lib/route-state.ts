'use client'

/**
 * Cross-component route bookkeeping that has to live outside React state.
 *
 * Used by the scroll controller, which must reach the live Lenis instance from
 * a route-change effect and know whether a navigation was a history pop.
 */

type Scroller = { scrollTo: (target: number, options?: Record<string, unknown>) => void }

let scroller: Scroller | null = null
let cameFromHistory = false

export function registerScroller(instance: Scroller | null) {
  scroller = instance
}

/**
 * Jump to the top without easing.
 *
 * Lenis keeps its own target scroll position and reapplies it on the next
 * frame, so Next's own reset-to-top on navigation gets silently undone — you
 * land on a new page already scrolled to wherever you were. Telling Lenis
 * directly is the only thing it will not argue with.
 */
export function resetScroll() {
  if (scroller) scroller.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo(0, 0)
}

/** Back/forward navigations restore their own position; leave those alone. */
export function markHistoryNavigation() {
  cameFromHistory = true
}

export function consumeHistoryNavigation() {
  const was = cameFromHistory
  cameFromHistory = false
  return was
}

let lastPath: string | null = null

/**
 * Records a route change and reports whether it was a real in-app navigation.
 *
 * The first call is the page the visitor landed on, which is not a navigation —
 * counting it would make a cold landing look like it had somewhere to go back
 * to. Repeat calls for the same path are ignored, so React re-running the
 * effect (as it does in development) cannot inflate the count either.
 */
export function noteNavigation(path: string) {
  if (lastPath === null) {
    lastPath = path
    return false
  }
  if (path === lastPath) return false
  lastPath = path
  return true
}
