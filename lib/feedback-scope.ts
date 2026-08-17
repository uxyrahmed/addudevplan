/**
 * The one response that is not about an action.
 *
 * Everything else on this site is keyed on an action, which is the whole point
 * of it — but it left a resident with something to say about the plan itself
 * with 230 boxes and none of them the right one. This is the right one.
 *
 * It rides in the same basket as every other response: the same quiet window,
 * the same replace-on-resend, the same withdrawal, the same anonymity. Nothing
 * in the database had to change either — `responses.action_id` is free text, so
 * this is stored as an ordinary row.
 *
 * Its own module, like `lib/reactions.ts` and `lib/feedback-limits.ts`, so the
 * client can name the key without importing `lib/plan.ts` to do it.
 *
 * **Namespaced away from the plan's own keys.** Every action id is
 * `g{goal}-s{strategy}-a{action}`, so this can never collide with one — and, as
 * with those, it must never be renamed: feedback already filed is keyed on it.
 */
export const OVERALL_ID = 'plan-overall'

/**
 * What the results panel and the export call it, so a council reader and a
 * spreadsheet see the same words.
 */
export const OVERALL_LABEL = 'The plan as a whole'
