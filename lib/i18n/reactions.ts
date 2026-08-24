import type { WireReaction } from '../reactions'
import type { Dictionary } from './en'

/**
 * The reader's words for a reaction.
 *
 * `lib/reactions.ts` stays the source of the three ids, their colours and their
 * English — the council's results screens read from it, and it has to stay in
 * step with the `public.reaction` enum in the database. What it cannot hold is
 * a translation, because it is imported by the feedback store on every public
 * page and pulling both dictionaries in there would ship the whole of one
 * language to readers of the other.
 *
 * So the wire value and the word are separated: the id is what travels and what
 * is stored, and this is what a resident sees. A `switch` rather than a lookup
 * table keyed by id, so adding a fourth reaction is a compile error here rather
 * than a control that renders blank.
 */
export function reactionWords(
  t: Dictionary,
  id: WireReaction,
): { label: string; short: string } {
  switch (id) {
    case 'support':
      return { label: t.reactions.supportLabel, short: t.reactions.supportShort }
    case 'unsure':
      return { label: t.reactions.unsureLabel, short: t.reactions.unsureShort }
    case 'concern':
      return { label: t.reactions.concernLabel, short: t.reactions.concernShort }
  }
}
