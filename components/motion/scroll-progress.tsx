'use client'

import { useEffect } from 'react'

/**
 * A hairline reading-progress rail across the top of the page. Doubles as the
 * "cleaner scrollbar UI" — the native bar stays thin and quiet (see
 * globals.css) while this carries the sense of position.
 *
 * Where the browser supports scroll-driven animations this is pure CSS and
 * costs nothing at runtime: the compositor drives it, off the main thread.
 * Older browsers get a passive scroll listener that writes one custom property
 * on an animation frame — no spring, no persistent rAF loop.
 */
export function ScrollProgress() {
  useEffect(() => {
    if (CSS.supports('animation-timeline: scroll()')) return

    const root = document.documentElement
    let frame = 0
    const update = () => {
      frame = 0
      const max = root.scrollHeight - root.clientHeight
      root.style.setProperty('--scroll-progress', max > 0 ? String(root.scrollTop / max) : '0')
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return <div aria-hidden className="scroll-rail" />
}
