/**
 * Keeping a quantity together, and the right way round, in right-to-left text.
 *
 * Thaana runs right to left; a figure and a Latin unit run left to right. Where
 * they meet, the bidirectional algorithm resolves the boundary on its own — and
 * for a quantity it resolves it wrongly. Measured on the page, "75%" came out
 * with the per-cent sign 14px to the *left* of the 7, reading as "%75", and
 * "16.2 kWh" came out as "kWh 16.2". The unit had jumped the number.
 *
 * That is not a font problem and not a mistake in the translation; it is what
 * the algorithm is specified to do with a neutral or Latin run sitting between
 * two right-to-left ones. The fix is to tell it that the quantity is a single
 * left-to-right thing: U+2066 LEFT-TO-RIGHT ISOLATE opens it, U+2069 POP
 * DIRECTIONAL ISOLATE closes it, and everything between is laid out on its own
 * and placed as one unit in the surrounding text.
 *
 * Isolates rather than the older embedding or override characters, and rather
 * than `<bdi>` markup: these are plain characters, so one string works in a text
 * node, in an `aria-label`, in a `title`, and in the JSON a resident downloads —
 * all of which carry the same figures and none of which can hold an element.
 */

/**
 * A number, and the Latin unit or per-cent sign attached to it.
 *
 * Deliberately does *not* match a number followed by a Thaana word. "18.7
 * މިލިއަން" already reads correctly — the figure comes first in reading order
 * and the unit follows it — and isolating that pair would flip it into reading
 * backwards. The problem is only ever a run that the algorithm treats as
 * left-to-right or neutral: `%`, `kWh`, `MW`, `cbm`, and the English words in
 * the passages still awaiting translation.
 */
const QUANTITY = /\d[\d.,]*(?:\s*(?:%|[A-Za-z][A-Za-z./]*))/g

const LRI = '⁦'
const PDI = '⁩'

/**
 * Wraps every number-and-unit in `text` in a left-to-right isolate.
 *
 * Idempotent in practice — a string that already carries isolates is not
 * re-matched across them, because the isolate characters are not in the pattern
 * and a second pass would produce the same boundaries.
 */
export function isolateQuantities(text: string): string {
  if (!text) return text
  return text.replace(QUANTITY, (match) => {
    // A bare number needs nothing: digits inside right-to-left text already
    // resolve as one left-to-right run, and wrapping them adds two invisible
    // characters to every year and count in the plan for no gain.
    if (!/[%A-Za-z]/.test(match)) return match
    return `${LRI}${match}${PDI}`
  })
}

/**
 * The same, for a value assembled at runtime rather than written in a
 * dictionary — a percentage counted off the reader's own answers, say.
 */
export function isolate(value: string | number): string {
  return `${LRI}${value}${PDI}`
}
