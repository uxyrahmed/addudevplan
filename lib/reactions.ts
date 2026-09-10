/**
 * The three reactions the database can hold, and nothing else.
 *
 * Its own module so the feedback store — which every public page loads — can
 * import the colours without dragging in lib/plan.ts, the way it would if these
 * lived beside the payload validation.
 *
 * Must stay in step with the `public.reaction` enum in the database.
 */
export const REACTION_VALUES = ['support', 'unsure', 'concern'] as const

export type WireReaction = (typeof REACTION_VALUES)[number]

/**
 * The reactions a resident is offered today, in the order the buttons run: a
 * thumb up and a thumb down.
 *
 * `unsure` is deliberately not here and deliberately still in
 * `REACTION_VALUES`. The council asked for the middle option to go, but it had
 * already been answered over a hundred times before it went, and those answers
 * are the council's to keep. So the button is gone from the page while the
 * value stays legal on the wire, in the store, and on every results screen —
 * which is what lets a basket saved before the change still show, and still
 * send, exactly what the resident chose.
 */
export const OFFERED_REACTIONS = ['support', 'concern'] as const satisfies readonly WireReaction[]

export type OfferedReaction = (typeof OFFERED_REACTIONS)[number]

/**
 * How each reaction is named and coloured, shared by the controls and the admin
 * tallies.
 *
 * Two colours each, for the same reason the goal plates carry two: `color` is
 * the fill, chosen to separate three bands of a bar at a glance, and `ink` is
 * that hue darkened until it clears 4.5:1 on the palest ground the site sets
 * type on (`--color-sand`), which is where a figure or a label may use it.
 *
 * The split is load-bearing rather than tidy. Measured on white, the fills come
 * out at 4.10 for support and 2.54 for "not sure" — both fail as text, and the
 * results screens were setting counts and a status pill in exactly those two.
 * Only concern passes, and it is unchanged here because it already did.
 */
export const REACTION_META: Record<
  WireReaction,
  { label: string; short: string; color: string; ink: string }
> = {
  support: { label: 'I support this', short: 'Support', color: '#178E6B', ink: '#147A5C' },
  unsure: { label: "I'm not sure", short: 'Not sure', color: '#EE8A12', ink: '#9E5B0B' },
  concern: { label: 'I have a concern', short: 'Concern', color: '#970E53', ink: '#970E53' },
}
