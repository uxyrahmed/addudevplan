/**
 * The two reactions a resident can give — a thumb up and a thumb down — in the
 * order the buttons run.
 *
 * Its own module so the feedback store — which every public page loads — can
 * import the colours without dragging in lib/plan.ts, the way it would if these
 * lived beside the payload validation.
 *
 * The `public.reaction` enum in the database still holds a third value,
 * `unsure`. "Not sure" was offered until 10 September 2026 and its answers were
 * kept while there were any, but the pre-release answers went in the wipe of 23
 * September and nothing has been able to give one since. So the site no longer
 * accepts it on the wire or shows it anywhere; the enum keeps the value only
 * because Postgres cannot drop one without rebuilding the type.
 */
export const REACTION_VALUES = ['support', 'concern'] as const

export type WireReaction = (typeof REACTION_VALUES)[number]

/**
 * How each reaction is named and coloured, shared by the controls and the admin
 * tallies.
 *
 * Two colours each, for the same reason the goal plates carry two: `color` is
 * the fill, and `ink` is that hue at a depth that clears 4.5:1 on the palest
 * ground the site sets type on (`--color-sand`), which is where a figure or a
 * label may use it.
 *
 * The fills are chosen for colour-blind readers first. Red against green is the
 * pair the commonest colour blindness confuses, so hue alone cannot carry the
 * difference: the green is set light and the red dark, and the two differ in
 * lightness as well — which every kind of colour vision sees. Simulated for
 * deuteranopia they sit 19.6 apart (ΔE, OKLab ×100; 8 is the usual floor for
 * telling two marks apart), where the teal and plum used before sat at 12.2.
 *
 * The green stays dark enough to carry the white thumb on the filled support
 * button (3.3:1), but not to be set as text, so its ink is a deeper step of the
 * same hue. Concern's fill passes at 7.6:1 on sand and is its own ink.
 */
export const REACTION_META: Record<
  WireReaction,
  { label: string; short: string; color: string; ink: string }
> = {
  support: { label: 'I support this', short: 'Support', color: '#04A177', ink: '#147A5C' },
  concern: { label: 'I have a concern', short: 'Concern', color: '#94180D', ink: '#94180D' },
}
