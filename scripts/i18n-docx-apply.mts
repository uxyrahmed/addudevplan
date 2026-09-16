/**
 * Takes a marked-up Word file back into `translation/dhivehi/`.
 *
 * `i18n-docx.mts` writes the plan as a document a person can read. It comes
 * back edited, and with no `[nnnn]` markers in it — that was the point — so
 * nothing in the file says which segment a rewritten sentence belongs to.
 *
 * The mapping is recovered rather than stored. The document is deterministic,
 * so the "before" is regenerated from the repo and the revision is aligned
 * against it paragraph by paragraph. A paragraph that matches exactly is
 * untouched; one that differs is split along the parts the builder recorded —
 * the literals it generated on one side, the segment's own text on the other —
 * and the segment's `ref` resolves to one line of one transcript.
 *
 * What it will not do is guess:
 *
 * - **Paragraphs added, deleted or reordered.** Alignment is ambiguous in that
 *   stretch, so it is reported for a person to decide. A reviewer who writes a
 *   new paragraph rather than editing the old one is usually replacing it, but
 *   "usually" is not good enough to write a file on.
 * - **Edits to something no segment owns** — a figure out of `lib/plan.ts`, a
 *   chrome label with a number substituted into it, a bullet.
 * - **A changed figure.** Every number on this site is something the council
 *   measured; a translation names the unit and never the quantity. Changed
 *   digits are reported loudly and still written, because a Dhivehi ordinal can
 *   legitimately spell a number the English wrote as digits — it is a list to
 *   read, not a rule.
 *
 * Nothing here touches the generated files. It edits the transcripts, which are
 * the source; `i18n-apply.mts` is still what writes `lib/i18n/dv.ts` and
 * `lib/plan-translations/dv.ts`, with all of its own checks.
 *
 *   node --experimental-strip-types scripts/i18n-docx-apply.mts revised.docx
 *   node --experimental-strip-types scripts/i18n-docx-apply.mts revised.docx --write
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { docxParagraphs, stripMarks } from './docx.mts'
import { blocks, compositions, paragraphs as baseline, type Field, type Ref } from './reading-document.mts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const TRANSLATION = join(ROOT, 'translation')

const args = process.argv.slice(2)
const WRITE = args.includes('--write')
const revision = args.find((a) => !a.startsWith('--'))

if (!revision) {
  console.error('usage: i18n-docx-apply.mts <revised.docx> [--write]')
  process.exit(1)
}

/* --------------------------------------------------------------- the maps */

type Segment = { id: string; file: string; en: string; slots: string[] }

const manifest = JSON.parse(readFileSync(join(TRANSLATION, 'manifest.json'), 'utf8')) as {
  files: { name: string; segments: { id: string; ref: Record<string, unknown>; en: string; slots: string[] }[] }[]
}

/** A ref is a shape, not a string; key it in a way that compares by value. */
const keyOf = (ref: Ref) =>
  ref === null
    ? ''
    : JSON.stringify(
        Object.fromEntries(Object.entries(ref).sort(([a], [b]) => (a < b ? -1 : 1))),
      )

const segments = new Map<string, Segment>()
for (const file of manifest.files) {
  for (const segment of file.segments) {
    segments.set(keyOf(segment.ref as Ref), {
      id: segment.id,
      file: file.name,
      en: segment.en,
      slots: segment.slots,
    })
  }
}

const LINE = /^(\s*\[)(\d{4})(\]\s*)(.*?)(\s*)$/
const transcript = new Map<string, string>()
for (const name of readdirSync(join(TRANSLATION, 'dhivehi')).sort()) {
  if (!name.endsWith('.txt')) continue
  for (const line of readFileSync(join(TRANSLATION, 'dhivehi', name), 'utf8').split(/\r?\n/)) {
    const match = LINE.exec(line)
    if (match) transcript.set(match[2]!, match[4]!)
  }
}

/* ------------------------------------------------------------------ align */

type Op = { tag: 'equal' | 'replace' | 'insert' | 'delete'; i1: number; i2: number; j1: number; j2: number }

/**
 * Longest common subsequence, then the runs between the matches.
 *
 * Six hundred paragraphs against six hundred is a table small enough to fill
 * outright, and an exact alignment is worth more here than a fast one: every
 * paragraph it fails to pair is a segment a person has to look at by hand.
 */
function align(a: string[], b: string[]): Op[] {
  const n = a.length
  const m = b.length
  const lcs = new Uint32Array((n + 1) * (m + 1))
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i * (m + 1) + j] =
        a[i] === b[j]
          ? lcs[(i + 1) * (m + 1) + j + 1]! + 1
          : Math.max(lcs[(i + 1) * (m + 1) + j]!, lcs[i * (m + 1) + j + 1]!)
    }
  }

  const ops: Op[] = []
  let i = 0
  let j = 0
  const flush = (i2: number, j2: number) => {
    if (i2 === i && j2 === j) return
    const tag = i2 > i && j2 > j ? 'replace' : i2 > i ? 'delete' : 'insert'
    ops.push({ tag, i1: i, i2, j1: j, j2 })
  }

  while (i < n && j < m) {
    if (a[i] === b[j]) {
      const i1 = i
      const j1 = j
      while (i < n && j < m && a[i] === b[j]) {
        i++
        j++
      }
      ops.push({ tag: 'equal', i1, i2: i, j1, j2: j })
      continue
    }
    // Walk the unmatched run until the table says a match resumes.
    const i1 = i
    const j1 = j
    while (i < n && j < m && a[i] !== b[j]) {
      if (lcs[(i + 1) * (m + 1) + j]! >= lcs[i * (m + 1) + j + 1]!) i++
      else j++
    }
    ops.push({ tag: i > i1 && j > j1 ? 'replace' : i > i1 ? 'delete' : 'insert', i1, i2: i, j1, j2: j })
  }
  i = n
  j = m
  flush(n, m)
  return ops
}

/* ------------------------------------------------------------------ split */

const escapeRe = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Separators the builder puts between a label and the text beside it.
 *
 * A reviewer rewriting the sentence sometimes takes the dash with it, which
 * says nothing about the segment. A second, looser pass lets it be missing
 * rather than sending an otherwise clean edit to a person.
 */
const SEPARATORS = new Set(['—', '–', '-', ':'])

function splitter(parts: readonly { lit?: string; field?: Field }[], loose: boolean) {
  const fields: Field[] = []
  const total = parts.filter((p) => 'field' in p && p.field).length
  let pattern = '^\\s*'

  for (const part of parts) {
    if ('lit' in part && part.lit !== undefined) {
      const words = stripMarks(part.lit)
        .trim()
        .split(/\s+/)
        .filter((word) => word && !(loose && SEPARATORS.has(word)))
      if (!words.length) {
        pattern += loose ? '[\\s—–:-]*' : '\\s*'
        continue
      }
      pattern += `\\s*${words.map(escapeRe).join('\\s+')}${loose ? '[\\s—–:-]*' : '\\s*'}`
    } else if (part.field) {
      fields.push(part.field)
      pattern += fields.length < total ? '([\\s\\S]+?)' : '([\\s\\S]+)'
    }
  }

  return { rx: new RegExp(`${pattern}\\s*$`), fields }
}

/* ----------------------------------------------------------------- resolve */

type Edit = {
  id: string
  file: string
  ref: Ref
  en: string
  old: string
  fresh: string
  flags: string[]
}

const DIGITS = /[0-9][0-9.,]*/g
const THAANA = /[ހ-޿]/
const SLOT = /\{(\w+)\}/g

const REF_OF: Record<Field, keyof (typeof blocks)[number]> = {
  text: 'ref',
  label: 'labelRef',
  value: 'valueRef',
}

const edits: Edit[] = []
const problems: { what: string; was: string; now: string; at: number }[] = []

const revised = docxParagraphs(readFileSync(revision))

for (const op of align(baseline, revised)) {
  if (op.tag === 'equal') continue

  if (op.tag !== 'replace' || op.i2 - op.i1 !== op.j2 - op.j1) {
    problems.push({
      what: `paragraphs ${op.tag} (${op.i2 - op.i1} in the document, ${op.j2 - op.j1} in the revision)`,
      was: baseline.slice(op.i1, op.i2).join('\n'),
      now: revised.slice(op.j1, op.j2).join('\n'),
      at: op.i1,
    })
    continue
  }

  for (let step = 0; step < op.i2 - op.i1; step++) {
    const at = op.i1 + step
    const composition = compositions[at]!
    const now = revised[op.j1 + step]!

    if (composition.block === null) {
      problems.push({ what: 'a paragraph with no content in it changed', was: baseline[at]!, now, at })
      continue
    }

    let { rx, fields } = splitter(composition.parts, false)
    let match = rx.exec(now)
    let recovered = false
    if (!match) {
      ;({ rx, fields } = splitter(composition.parts, true))
      match = rx.exec(now)
      recovered = Boolean(match)
    }
    if (!match) {
      problems.push({ what: 'the line no longer matches the label the document generated', was: baseline[at]!, now, at })
      continue
    }

    const block = blocks[composition.block]!
    fields.forEach((field, index) => {
      const old = stripMarks(block[field] ?? '').trim()
      const fresh = (match![index + 1] ?? '').trim()
      if (old === fresh) return

      const ref = block[REF_OF[field]] as Ref
      const segment = ref ? segments.get(keyOf(ref)) : undefined
      if (!segment) {
        problems.push({
          what: 'an edit to something no segment owns — a figure, or a label with a number in it',
          was: old,
          now: fresh,
          at,
        })
        return
      }

      const flags: string[] = []
      const slots = [...fresh.matchAll(SLOT)].map((m) => m[1]!).sort()
      if (slots.join() !== [...segment.slots].sort().join()) {
        flags.push(`slots changed: {${segment.slots.join('} {')}} became {${slots.join('} {')}}`)
      }
      if (!THAANA.test(fresh)) flags.push('no Thaana in it')
      const before = old.match(DIGITS)?.join() ?? ''
      const after = fresh.match(DIGITS)?.join() ?? ''
      if (before !== after) flags.push(`figures: ${before || '(none)'} became ${after || '(none)'}`)
      if (recovered) flags.push('the separator after the generated label was deleted')
      if (stripMarks(transcript.get(segment.id) ?? '').trim() !== old) {
        flags.push('the transcript has moved on since this document was written')
      }

      edits.push({ id: segment.id, file: segment.file, ref, en: segment.en, old, fresh, flags })
    })
  }
}

/* ------------------------------------------------------------------ report */

const byFile = new Map<string, number>()
for (const edit of edits) byFile.set(edit.file, (byFile.get(edit.file) ?? 0) + 1)

console.log(`${edits.length} edits, in ${byFile.size} transcripts`)
for (const name of [...byFile.keys()].sort()) {
  console.log(`  ${name.padEnd(46)} ${byFile.get(name)}`)
}

const flagged = edits.filter((edit) => edit.flags.length)
if (flagged.length) {
  console.log()
  console.log(`${flagged.length} to look at:`)
  for (const edit of flagged) {
    console.log(`  [${edit.id}] ${edit.flags.join('; ')}`)
    console.log(`     en : ${edit.en.slice(0, 90)}`)
    console.log(`     was: ${edit.old.slice(0, 90)}`)
    console.log(`     now: ${edit.fresh.slice(0, 90)}`)
  }
}

if (problems.length) {
  console.log()
  console.log(`${problems.length} need a person — nothing is written for these:`)
  for (const problem of problems) {
    console.log(`  ${problem.what} (paragraph ${problem.at})`)
    console.log(`     was: ${problem.was.slice(0, 200)}`)
    console.log(`     now: ${problem.now.slice(0, 200)}`)
  }
}

/* ------------------------------------------------------------------- write */

if (!WRITE) {
  console.log()
  console.log('Report only. Re-run with --write to edit the transcripts, then i18n-apply.mts.')
  process.exit(0)
}

const wanted = new Map(edits.map((edit) => [edit.id, edit]))
let written = 0

for (const name of readdirSync(join(TRANSLATION, 'dhivehi')).sort()) {
  if (!name.endsWith('.txt')) continue
  const path = join(TRANSLATION, 'dhivehi', name)
  const body = readFileSync(path, 'utf8')
  const eol = body.includes('\r\n') ? '\r\n' : '\n'
  let touched = false

  const lines = body.split(/\r?\n/).map((line) => {
    const match = LINE.exec(line)
    if (!match) return line
    const edit = wanted.get(match[2]!)
    if (!edit) return line
    if (stripMarks(match[4]!).trim() !== edit.old) {
      console.log(`!! [${edit.id}] in ${name} no longer reads as the document did — left alone`)
      return line
    }
    touched = true
    written++
    return `${match[1]}${match[2]}${match[3]}${edit.fresh}`
  })

  if (touched) writeFileSync(path, lines.join(eol), 'utf8')
}

console.log()
console.log(`wrote ${written} of ${edits.length} segments`)
console.log('Now: npm run i18n:apply -- --write')
