/**
 * The seam between the hero and the plan itself.
 *
 * Three offset swells drifting at different speeds — a parallax reef line,
 * which is the one motif an atoll city earns. Entirely CSS: two transforms on
 * three paths, no JavaScript, no scroll listener, and nothing to load. It
 * settles to a static wave under `prefers-reduced-motion`.
 */
export function ReefDivider() {
  return (
    <div aria-hidden className="reef" role="presentation">
      <svg viewBox="0 0 1440 96" preserveAspectRatio="none" className="reef-svg">
        <defs>
          {/* One path, reused at three depths — the tile repeats every 720 units
              so the drift can loop seamlessly. */}
          <path
            id="reef-swell"
            d="M0,52 C120,20 240,20 360,52 C480,84 600,84 720,52 C840,20 960,20 1080,52 C1200,84 1320,84 1440,52 C1560,20 1680,20 1800,52 C1920,84 2040,84 2160,52 L2160,96 L0,96 Z"
          />
        </defs>
        <use href="#reef-swell" className="reef-layer reef-back" />
        <use href="#reef-swell" className="reef-layer reef-mid" />
        <use href="#reef-swell" className="reef-layer reef-front" />
      </svg>
    </div>
  )
}
