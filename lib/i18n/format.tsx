import type { ReactNode } from 'react'

/**
 * `{name}` placeholders, filled in.
 *
 * Every string in the dictionaries is a plain string — no functions — because
 * a dictionary crosses the server/client boundary and a function cannot. So
 * interpolation is a placeholder and this helper rather than a template
 * literal at the call site.
 *
 * The placeholder is load-bearing for translation, not just for tidiness. It
 * lets a sentence put its figures where the language wants them: Dhivehi puts
 * the count after the noun where English puts it before, and a sentence
 * assembled by concatenating fragments in the call site's order cannot do that.
 */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  )
}

const PLACEHOLDER = /\{(\w+)\}/g

/**
 * The same, for sentences whose figures are rendered as elements — a coloured
 * count, a `tabular-nums` span — rather than as text.
 *
 * Returns the pieces in the order the *template* puts them, which is the whole
 * point: "You have responded to 3 of 12 actions" and its Dhivehi counterpart
 * do not agree on where the numbers fall, and neither should have to.
 */
export function fillNodes(template: string, vars: Record<string, ReactNode>): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null

  PLACEHOLDER.lastIndex = 0
  while ((match = PLACEHOLDER.exec(template)) !== null) {
    const key = match[1] as string
    if (!(key in vars)) continue
    if (match.index > last) out.push(template.slice(last, match.index))
    // Keyed by position, not by name: a template may use the same placeholder
    // twice, and React wants the two occurrences told apart.
    out.push(<span key={`${key}-${match.index}`}>{vars[key]}</span>)
    last = match.index + match[0].length
  }
  if (last < template.length) out.push(template.slice(last))
  return out
}

/**
 * Picks the `one` or `other` wording for a count.
 *
 * Two forms because that is what both of this site's languages need: English
 * distinguishes one from the rest, and Dhivehi's plural is not marked on the
 * noun at all, so `one` and `other` are simply written the same. A locale that
 * needed more forms would need `Intl.PluralRules` here instead.
 */
export function plural(count: number, forms: { one: string; other: string }): string {
  return count === 1 ? forms.one : forms.other
}
