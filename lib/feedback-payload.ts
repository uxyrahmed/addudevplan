import { MAX_COMMENT_LENGTH } from './feedback-limits'
import { OVERALL_ID } from './feedback-scope'
import { GOALS } from './plan'
import { REACTION_VALUES, type WireReaction } from './reactions'

export type WireResponse = {
  actionId: string
  reaction: WireReaction | null
  comment: string | null
}

/**
 * Every action id the plan actually contains.
 *
 * The consultation is keyed on these, so an id the plan does not have is either
 * a stale basket from an older deployment or someone poking the endpoint. Either
 * way it is dropped rather than stored: a response to an action that no longer
 * exists would sit in the results with nothing to label it.
 */
export const ACTION_IDS: ReadonlySet<string> = new Set(
  GOALS.flatMap((goal) => goal.strategies.flatMap((s) => s.actions.map((a) => a.id))),
)

/**
 * Every key a basket may carry: the plan's actions, plus the one response that
 * is about the plan rather than about an action.
 */
const ACCEPTED_IDS: ReadonlySet<string> = new Set([...ACTION_IDS, OVERALL_ID])

export { MAX_COMMENT_LENGTH }

const REACTIONS = new Set<string>(REACTION_VALUES)

export type Validated =
  | { ok: true; responses: WireResponse[]; unknownIds: string[] }
  | { ok: false; error: string }

/**
 * Turns whatever arrived on the wire into rows worth storing.
 *
 * Deliberately forgiving about shape and strict about content: a visitor should
 * never lose a basket because one entry was malformed, but nothing empty,
 * over-long or unrecognised reaches the council's totals.
 */
export function validateSubmission(body: unknown): Validated {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, error: 'Expected an object.' }
  }

  const raw = (body as { responses?: unknown }).responses
  if (!Array.isArray(raw)) {
    return { ok: false, error: 'Expected a `responses` array.' }
  }
  if (raw.length > ACCEPTED_IDS.size) {
    return { ok: false, error: 'More responses than the plan has places to respond.' }
  }

  const byId = new Map<string, WireResponse>()
  const unknownIds: string[] = []

  for (const item of raw) {
    if (typeof item !== 'object' || item === null) continue

    const { actionId, reaction, comment } = item as Record<string, unknown>
    if (typeof actionId !== 'string') continue

    const id = actionId.trim()
    if (!id) continue
    if (!ACCEPTED_IDS.has(id)) {
      unknownIds.push(id)
      continue
    }

    // The plan as a whole takes words, not a verdict. Three buttons on the
    // whole document would turn a consultation into a referendum on it, and
    // would put a number in the results that the council never asked for — so
    // the rule is enforced here rather than only in the interface that omits
    // them, and the stored row is comment-only whatever arrives on the wire.
    const cleanReaction =
      id !== OVERALL_ID && typeof reaction === 'string' && REACTIONS.has(reaction)
        ? (reaction as WireReaction)
        : null

    const cleanComment =
      typeof comment === 'string' && comment.trim() ? comment.trim().slice(0, MAX_COMMENT_LENGTH) : null

    // An entry with neither is the visitor having cleared it; storing it would
    // inflate the response count with rows that say nothing.
    if (!cleanReaction && !cleanComment) continue

    // Last one wins, so a duplicated id cannot violate the (submission, action)
    // uniqueness constraint downstream.
    byId.set(id, { actionId: id, reaction: cleanReaction, comment: cleanComment })
  }

  if (byId.size === 0) {
    return { ok: false, error: 'Nothing to submit.' }
  }

  return { ok: true, responses: [...byId.values()], unknownIds }
}
