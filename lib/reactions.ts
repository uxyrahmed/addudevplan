/**
 * The three reactions, and nothing else.
 *
 * Its own module so the feedback store — which every public page loads — can
 * import the colours without dragging in lib/plan.ts, the way it would if these
 * lived beside the payload validation.
 *
 * Must stay in step with the `public.reaction` enum in the database.
 */
export const REACTION_VALUES = ['support', 'unsure', 'concern'] as const

export type WireReaction = (typeof REACTION_VALUES)[number]

/** How each reaction is named and coloured, shared by the controls and the admin tallies. */
export const REACTION_META: Record<WireReaction, { label: string; short: string; color: string }> = {
  support: { label: 'I support this', short: 'Support', color: '#178E6B' },
  unsure: { label: "I'm not sure", short: 'Not sure', color: '#EE8A12' },
  concern: { label: 'I have a concern', short: 'Concern', color: '#970E53' },
}
