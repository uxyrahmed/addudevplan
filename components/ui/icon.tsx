import { createElement, type SVGProps } from 'react'

/**
 * Shape of a Hugeicons icon: an array of [tag, attributes] pairs on a 24px
 * grid, stroked with `currentColor`. Same icon family the plan's slide deck
 * uses, so the UI furniture matches the goal artwork.
 */
export type IconData = readonly (readonly [string, Readonly<Record<string, string | number>>])[]

type Props = Omit<SVGProps<SVGSVGElement>, 'children'> & {
  icon: IconData
  size?: number | string
  /** Override the 1.5 stroke the set ships with. */
  weight?: number
  /** Give the icon an accessible name; omit for decorative icons. */
  label?: string
  /** Defaults to the 24px Hugeicons grid; the plan's goal glyphs use 100. */
  viewBox?: string
  /**
   * The glyph points somewhere — an arrow, a chevron — so it has to turn round
   * in the Dhivehi edition. "Back" is a leftward arrow on a page that runs left
   * to right and a rightward one on a page that runs the other way; an arrow
   * that keeps pointing left in Thaana is pointing at the next page, not the
   * previous one.
   *
   * A class rather than a transform written here, so the flip lives in one rule
   * in `globals.css` next to the other direction-dependent transforms — and so
   * it never collides with a `translate-x` hover nudge, which is always set on
   * the wrapper rather than on the glyph itself.
   *
   * Only for glyphs whose meaning is a direction. An icon that merely happens
   * to be asymmetric — a magnifier, a flag — reads as mirrored and wrong.
   */
  directional?: boolean
}

export function Icon({
  icon,
  size = 20,
  weight,
  label,
  viewBox = '0 0 24 24',
  directional = false,
  className,
  ...rest
}: Props) {
  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={size}
      fill="none"
      role={label ? 'img' : undefined}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={
        directional ? `icon-directional${className ? ` ${className}` : ''}` : className
      }
      {...rest}
    >
      {icon.map(([tag, attrs], i) =>
        createElement(tag, {
          key: i,
          ...attrs,
          ...(weight != null && attrs.strokeWidth != null ? { strokeWidth: weight } : null),
        }),
      )}
    </svg>
  )
}
