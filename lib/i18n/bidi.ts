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

/**
 * A span of years, joined by a dash.
 *
 * The other half of the same problem, and the one that is invisible until
 * someone reads the page: "2026–2031" came out as "2031–2026". An en dash is a
 * neutral, so between two numbers in a right-to-left paragraph it resolves to
 * the paragraph direction and the two years are placed right to left — each one
 * still spelled correctly, the pair in the wrong order. A reader sees a plan
 * that runs backwards.
 *
 * `QUANTITY` cannot catch this. It matches a number followed by a *unit*, and
 * deliberately leaves a bare number alone; here there are two bare numbers, and
 * neither is wrong on its own. It is the pair that has to be one run.
 *
 * A hyphen-minus is not included, and must not be: U+002D is a European Number
 * Separator, which the algorithm already keeps with the digits either side of
 * it, so "(3-4 floor)" reads correctly with no help. Only the true dashes —
 * U+2013 and U+2014 — are neutrals.
 */
const RANGE = /\d[\d,.]*\s*[–—]\s*\d[\d,.]*/g

const LRI = '⁦'
const PDI = '⁩'

/**
 * Wraps every number-and-unit in `text` in a left-to-right isolate.
 *
 * Idempotent, and by construction rather than by luck. An earlier note here
 * claimed a second pass could not re-match "because the isolate characters are
 * not in the pattern" — but that is the reason it *does* re-match: the pattern
 * skips straight over them and matches the same digits again, nesting a second
 * pair around the first. Nested isolates render identically, so nothing looked
 * wrong; the string just grew two invisible characters each time.
 *
 * `wrap` closes it properly by looking at the character immediately before the
 * match. If an isolate opens there, this run is already inside one.
 */
export function isolateQuantities(text: string): string {
  if (!text) return text
  const wrap = (match: string, offset: number, whole: string) =>
    whole[offset - 1] === LRI ? match : `${LRI}${match}${PDI}`

  // Ranges first. A wrapped range is not re-matched by `QUANTITY` afterwards:
  // that pattern needs a unit directly after the digits, and what follows the
  // closing year here is the isolate character.
  return text.replace(RANGE, wrap).replace(QUANTITY, (match, offset: number, whole: string) => {
    // A bare number needs nothing: digits inside right-to-left text already
    // resolve as one left-to-right run, and wrapping them adds two invisible
    // characters to every year and count in the plan for no gain.
    if (!/[%A-Za-z]/.test(match)) return match
    return wrap(match, offset, whole)
  })
}

/**
 * The same, for a value assembled at runtime rather than written in a
 * dictionary — a percentage counted off the reader's own answers, say.
 */
export function isolate(value: string | number): string {
  return `${LRI}${value}${PDI}`
}
