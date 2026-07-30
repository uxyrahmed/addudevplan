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
}

export function Icon({ icon, size = 20, weight, label, viewBox = '0 0 24 24', ...rest }: Props) {
  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={size}
      fill="none"
      role={label ? 'img' : undefined}
      aria-hidden={label ? undefined : true}
      aria-label={label}
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
