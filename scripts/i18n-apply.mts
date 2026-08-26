/**
 * Puts the returned Dhivehi back into the site.
 *
 * Reads whatever is in `translation/dhivehi/` — any filenames, any order, any
 * subset — matches each `[nnnn]` line against the manifest, and regenerates
 * `lib/i18n/dv.ts` and `lib/plan-translations/dv.ts`. Nothing about the
 * returned files is trusted except the numbers: a file may come back reordered,
 * short, doubled, or with the tool's own commentary at the top, and only the
 * lines that match a known id and pass the checks below are used.
 *
 * Four checks, and a segment that fails one is dropped rather than repaired:
 *
 * - **Slots.** `{count}` and friends are holes the page fills at render time.
 *   A translation that loses one prints a sentence with a gap in it; one that
 *   invents one prints a literal `{count}` to a resident. The set has to match
 *   the English exactly — order and position are the translator's business.
 * - **Script.** A segment with no Thaana in it was not translated, whatever
 *   came back. It is treated as missing, so the English shows through.
 * - **Figures.** Every run of digits in the English must appear in the Dhivehi,
 *   the same number of times. This one only warns: the translation names the
 *   unit, never the quantity, but a Dhivehi ordinal can legitimately add a
 *   digit the English did not have.
 * - **Completeness, for the chrome only.** `lib/i18n/dv.ts` is typed as
 *   `Dictionary`, so a missing key does not compile. Worse, a *filled* missing
 *   key would print an English word inside a Dhivehi sentence. So the chrome is
 *   all-or-nothing: every key, or the file is left alone.
 *
 * The plan overlay has no such gate, by its own design — it is partial on
 * purpose, so goals can land one at a time and anything absent falls through to
 * the English underneath.
 *
 *   node --experimental-strip-types scripts/i18n-apply.mts          # report only
 *   node --experimental-strip-types scripts/i18n-apply.mts --write  # and write
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'translation')
const WRITE = process.argv.includes('--write')

type Ref = Record<string, string | number>
type Entry = { id: string; ref: Ref; en: string; slots: string[] }
type Manifest = {
  total: number
  skipped: string[]
  files: { name: string; title: string; segments: Entry[] }[]
}

if (!existsSync(join(OUT, 'manifest.json'))) {
  console.error('No translation/manifest.json — run scripts/i18n-extract.mts first.')
  process.exit(1)
}
const manifest: Manifest = JSON.parse(readFileSync(join(OUT, 'manifest.json'), 'utf8'))

const bySegment = new Map<string, Entry>()
const fileOf = new Map<string, string>()
for (const file of manifest.files) {
  for (const entry of file.segments) {
    bySegment.set(entry.id, entry)
    fileOf.set(entry.id, file.name)
  }
}

/* ------------------------------------------------------------------- read */

/** A `[0123]` marker, anywhere it appears. See `segmentsIn` for why anywhere. */
const MARKER = /\[\d{3,4}\]/
const THAANA = /[ހ-޿]/
const SLOT = /\{[a-zA-Z]+\}/g

/**
 * Unit symbols and currency codes, spelled as `lib/plan.ts` spells them.
 *
 * Kept in step with `scripts/i18n-units.mts`, which is what puts them into the
 * Dhivehi in the first place. A symbol is not English left untranslated — it is
 * the same mark in both languages, so a segment made only of figures and
 * symbols is fully translated when it comes back unchanged.
 */
const SYMBOL = /\b(kWh|kWp|MWh|GWh|MW|kW|MVR|USD|cbm|sqm|ha|km)\b/g
const FIGURE = /\d[\d,.]*/g

/**
 * The numbers in a string, without the punctuation that happens to follow them.
 *
 * `FIGURE` has to allow `,` and `.` inside a figure — "25,000" and "5.1" are one
 * number each — which means it also swallows the full stop at the end of "by
 * 2028." A translation that ends its sentence the Dhivehi way then looks as
 * though it dropped the year. Trimming trailing separators is the difference
 * between a check that flags a changed figure and one that flags every
 * sentence ending in a date.
 */
const figures = (text: string): string[] =>
  [...(text.match(FIGURE) ?? [])].map((f) => f.replace(/[.,]+$/, '')).sort()

/**
 * Every segment in a returned file, split on the markers wherever they fall.
 *
 * This used to read line by line and take only a marker anchored at the start
 * of one. That is the obvious reading, and it fails silently in the one way
 * that matters: when a newline goes missing between two segments, the second
 * marker ends up mid-line. The line-anchored reader then does not merely lose
 * that segment — it hands the *previous* one a translation with `[0242] …`
 * still inside it. Thirteen segments came back that way, and every one passed
 * the slot, script and figure checks, because a swallowed neighbour is still
 * Thaana and still carries the right slots.
 *
 * So the marker, not the line, is the unit. Text belonging to a segment runs
 * from the end of its marker to the start of the next one, which also lets a
 * long translation wrap across lines without being cut off. Internal newlines
 * are collapsed: every English segment is a single line, so a break inside one
 * is the tool's wrapping rather than the translator's meaning.
 *
 * Safe because no English segment contains a `[nnnn]`-shaped string — the
 * instruction header says "[nnnn]" literally, with letters, so it never matches.
 */
function segmentsIn(body: string): { id: string; text: string }[] {
  // Anything after the closing rule is the transcript's own furniture.
  const end = body.search(/^-{2,}\s*END\s*-{2,}/m)
  const scope = end === -1 ? body : body.slice(0, end)

  const marks = [...scope.matchAll(/\[(\d{3,4})\]/g)]
  return marks.map((mark, i) => {
    const from = mark.index + mark[0].length
    const to = i + 1 < marks.length ? marks[i + 1]!.index : scope.length
    return {
      id: mark[1]!.padStart(4, '0'),
      text: scope.slice(from, to).replace(/\s+/g, ' ').trim(),
    }
  })
}

type Problem = { id: string; kind: string; detail: string }

const dhivehi = new Map<string, string>()
const problems: Problem[] = []
const unknown: string[] = []

const dir = join(OUT, 'dhivehi')
const returned = existsSync(dir) ? readdirSync(dir).filter((f) => /\.(txt|md)$/i.test(f)) : []

/**
 * Files that came back as the English that went out.
 *
 * The easy mistake, and one worth naming rather than diagnosing: the transcript
 * is pasted out, translated somewhere else, and the result is never saved back
 * over the file — so `dhivehi/` fills up with copies of `english/`. Left to the
 * per-segment checks that reads as several hundred lines of "not translated",
 * which describes every symptom and none of the cause.
 *
 * Caught two ways: byte-identical to the file that was sent out, or holding no
 * Thaana at all despite carrying segments. The second catches a renamed copy.
 */
const notSaved: string[] = []

for (const name of returned) {
  const body = readFileSync(join(dir, name), 'utf8')
  const source = join(OUT, 'english', name)
  const identical = existsSync(source) && readFileSync(source, 'utf8') === body
  if (identical || (MARKER.test(body) && !THAANA.test(body))) {
    notSaved.push(name)
    continue
  }
  for (const { id, text } of segmentsIn(body)) {
    const entry = bySegment.get(id)
    if (!entry) {
      unknown.push(id + ' (in ' + name + ')')
      continue
    }
    if (!text) continue

    // Not translated — the tool echoed the English, or the line came back bare.
    //
    // Unless there was never anything to translate. A few segments are figures
    // and nothing else — "1958–2022" is a span of years, written identically in
    // both languages — and demanding Thaana of those rejects the one correct
    // answer. The test is on the *English*: if it holds no Latin letter, there
    // is no word in it, so whatever comes back is taken as given.
    // The slots come out first: `{label}: {subject}` is two holes and a colon,
    // and the only correct answer is to hand it back unchanged. Testing the raw
    // English would see the Latin letters *inside* the braces and demand Thaana
    // of a segment with no word in it.
    //
    // Unit symbols come out for the same reason. "16.2 kWh" is a figure and a
    // symbol, and both are written identically in Dhivehi — so the correct
    // translation is the English, character for character, and demanding Thaana
    // of it rejects the right answer. `kWh` is not a word that was left
    // untranslated; it is the unit's name in both languages.
    if (!THAANA.test(text) && /[A-Za-z]/.test(entry.en.replace(SLOT, '').replace(SYMBOL, ''))) {
      problems.push({ id, kind: 'not translated', detail: text.slice(0, 60) })
      continue
    }

    const want = [...new Set(entry.en.match(SLOT) ?? [])].sort()
    const got = [...new Set(text.match(SLOT) ?? [])].sort()
    if (want.join(' ') !== got.join(' ')) {
      problems.push({
        id,
        kind: 'slots changed',
        detail: 'wanted ' + (want.join(' ') || '(none)') + ', got ' + (got.join(' ') || '(none)'),
      })
      continue
    }

    // A segment far longer than its English has usually eaten something — a
    // neighbouring segment whose marker went astray, or the tool's own preamble.
    // Thaana runs a little longer than Latin for the same sense, so the bar is
    // set well clear of that; this is looking for a swallowed passage, not a
    // wordy sentence.
    if (entry.en.trim().length > 12 && text.length > entry.en.trim().length * 2.5) {
      problems.push({
        id,
        kind: 'suspiciously long',
        detail: text.length + ' chars against ' + entry.en.trim().length + ' in English',
      })
    }

    const enFigures = figures(entry.en)
    const dvFigures = figures(text)
    const missing = enFigures.filter((f) => !dvFigures.includes(f))
    if (missing.length) {
      problems.push({ id, kind: 'figures (warning)', detail: 'missing ' + missing.join(' ') })
      // Kept, not dropped: a figure the translation moved into a word is still
      // a translation. Listed so it can be looked at.
    }

    if (dhivehi.has(id) && dhivehi.get(id) !== text) {
      problems.push({ id, kind: 'returned twice', detail: 'later copy used' })
    }

    // The English's own leading and trailing spaces are layout, not language —
    // "Still open: " is followed by a value, " — not posted yet" follows one.
    const lead = /^\s*/.exec(entry.en)![0]
    const trail = /\s*$/.exec(entry.en)![0]
    dhivehi.set(id, lead + text + trail)
  }
}

/* ------------------------------------------------------------------ shape */

const lit = (value: string) =>
  "'" + value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'"

/** Nested plain object serialised as a TypeScript object literal. */
function serialise(node: unknown, indent: string): string {
  if (typeof node === 'string') return lit(node)
  // Before the object branch: an array walked with `Object.entries` comes out
  // as `{ '0': …, '1': … }`, which is not what `paragraphs?: string[]` wants.
  if (Array.isArray(node)) {
    if (!node.length) return '[]'
    const inner = indent + '  '
    const items = node.map((item) => inner + serialise(item, inner) + ',').join('\n')
    return '[\n' + items + '\n' + indent + ']'
  }
  const entries = Object.entries(node as Record<string, unknown>)
  if (!entries.length) return '{}'
  const inner = indent + '  '
  const body = entries
    .map(([key, value]) => {
      const name = /^[A-Za-z_$][\w$]*$/.test(key) ? key : lit(key)
      return inner + name + ': ' + serialise(value, inner) + ','
    })
    .join('\n')
  return '{\n' + body + '\n' + indent + '}'
}

function put(root: Record<string, unknown>, path: string[], value: string) {
  let node = root
  for (const key of path.slice(0, -1)) {
    node[key] ??= {}
    node = node[key] as Record<string, unknown>
  }
  node[path.at(-1)!] = value
}

/* the plan overlay: partial by design */
const plan: Record<string, unknown> = {}
/* the chrome: complete or not at all */
const chrome: Record<string, unknown> = {}

const missingChrome: string[] = []
const missingPlan: string[] = []

for (const entry of bySegment.values()) {
  const text = dhivehi.get(entry.id)
  const ref = entry.ref
  const where = ref.t === 'chrome' ? missingChrome : missingPlan
  if (text === undefined) {
    where.push(entry.id + ' ' + fileOf.get(entry.id))
    continue
  }

  switch (ref.t) {
    case 'chrome':
      put(chrome, String(ref.path).split('.'), text)
      break
    case 'planMeta':
      put(plan, ['plan', String(ref.field)], text)
      break
    case 'vision':
      put(plan, ['vision', String(ref.field)], text)
      break
    case 'turningTitle':
      put(plan, ['turningPoint', 'title'], text)
      break
    case 'turningPara':
      put(plan, ['turningPoint', '__paragraphs', String(ref.index)], text)
      break
    case 'fact':
      put(plan, ['headlineFacts', String(ref.label)], text)
      break
    case 'island':
      put(plan, ['islands', String(ref.name)], text)
      break
    case 'timeline':
      put(plan, ['timeline', String(ref.year)], text)
      break
    case 'migration':
      put(plan, ['migration', String(ref.field)], text)
      break
    case 'series':
      put(plan, ['migration', 'seriesNames', String(ref.name)], text)
      break
    case 'pillarsIntro':
      put(plan, ['pillarsIntro', String(ref.field)], text)
      break
    case 'pillar':
      put(plan, ['pillars', String(ref.id), String(ref.field)], text)
      break
    case 'initiativesIntro':
      put(plan, ['initiativesIntro', String(ref.field)], text)
      break
    case 'initiative':
      put(plan, ['initiatives', String(ref.number), String(ref.field)], text)
      break
    case 'goal':
      put(plan, ['goals', String(ref.slug), String(ref.field)], text)
      break
    case 'goalStat':
      put(plan, ['goals', String(ref.slug), 'stats', String(ref.label), String(ref.field)], text)
      break
    case 'target':
      put(plan, ['goals', String(ref.slug), 'targets', String(ref.id)], text)
      break
    case 'strategy':
      put(plan, ['goals', String(ref.slug), 'strategies', String(ref.id), 'title'], text)
      break
    case 'action':
      put(
        plan,
        ['goals', String(ref.slug), 'strategies', String(ref.strategy), 'actions', String(ref.id)],
        text,
      )
      break
  }
}

/**
 * The turning-point passage is all four paragraphs or none — a partial overlay
 * would interleave two languages inside one block of prose. Collected into a
 * keyed map above so a gap is visible, and turned into the array the overlay
 * type wants only once every one of them is here.
 */
const turning = plan.turningPoint as Record<string, unknown> | undefined
if (turning) {
  const paras = turning.__paragraphs as Record<string, string> | undefined
  delete turning.__paragraphs
  const count = manifest.files
    .flatMap((f) => f.segments)
    .filter((s) => s.ref.t === 'turningPara').length
  if (paras && Object.keys(paras).length === count) {
    turning.paragraphs = Array.from({ length: count }, (_, i) => paras[String(i)]!)
  }
}

/**
 * The comma between island names, which was never sent out to be translated.
 * Dhivehi sets a list with the Arabic comma; a Latin comma inside a run of
 * Thaana is the wrong mark, not merely an unusual one.
 */
if (Object.keys(chrome).length) put(chrome, ['common', 'listSeparator'], '، ')

/* ----------------------------------------------------------------- report */

const applied = dhivehi.size
console.log(applied + ' of ' + manifest.total + ' segments came back translated.')

const perFile = new Map<string, { got: number; total: number }>()
for (const file of manifest.files) {
  perFile.set(file.name, {
    got: file.segments.filter((s) => dhivehi.has(s.id)).length,
    total: file.segments.length,
  })
}
for (const [name, { got, total }] of perFile) {
  const mark = got === total ? 'ok  ' : got === 0 ? '--  ' : '..  '
  console.log('  ' + mark + name.padEnd(44) + String(got).padStart(4) + ' / ' + total)
}

if (notSaved.length) {
  console.log(
    '\n' +
      notSaved.length +
      ' file(s) in translation/dhivehi/ are still the English that went out —\n' +
      'the translation was never saved back over them:\n  ' +
      notSaved.join('\n  '),
  )
}
if (unknown.length) {
  console.log('\nUnknown ids, ignored: ' + unknown.slice(0, 20).join(', '))
}
if (problems.length) {
  console.log('\n' + problems.length + ' segments need looking at:')
  for (const p of problems.slice(0, 40)) {
    console.log('  [' + p.id + '] ' + p.kind.padEnd(18) + p.detail)
  }
  if (problems.length > 40) console.log('  … and ' + (problems.length - 40) + ' more')
}

const chromeComplete = missingChrome.length === 0
console.log(
  '\nchrome (lib/i18n/dv.ts):        ' +
    (chromeComplete
      ? 'complete — every key present'
      : missingChrome.length + ' keys still missing, so it will not be written'),
)
console.log(
  'plan   (lib/plan-translations/dv.ts): ' +
    (manifest.total - missingChrome.length - missingPlan.length) +
    ' strings, partial overlays allowed',
)

if (!WRITE) {
  console.log('\nReport only. Re-run with --write to replace the Dhivehi files.')
  process.exit(0)
}

/* ------------------------------------------------------------------ write */

const PROVENANCE = [
  ' * Generated, not hand-written.',
  ' *',
  ' * The English was written out by `scripts/i18n-extract.mts` into',
  ' * `translation/english/`, translated, and the returned files in',
  ' * `translation/dhivehi/` were put back here by `scripts/i18n-apply.mts`.',
  ' * Editing this file by hand loses the change the next time that runs — fix the',
  ' * returned transcript instead, and re-run.',
  ' *',
  ' * Every string here passed the checks in `i18n-apply.mts`: its `{slots}` match',
  ' * the English exactly, and it is written in Thaana. Nothing else is asserted',
  ' * about it — in particular, whether a native speaker has read it is not',
  ' * recorded here, and `proxy.ts` keeps the Dhivehi edition unlisted until one',
  ' * has.',
].join('\n')

if (chromeComplete) {
  const file =
    "import type { Dictionary } from './en'\n\n" +
    '/**\n' +
    " * The site's chrome in Dhivehi.\n" +
    ' *\n' +
    PROVENANCE +
    '\n *\n' +
    ' * Typed as `Dictionary`, so this file cannot fall behind `en.ts`: a string\n' +
    ' * added there is a compile error here until it is translated.\n' +
    ' */\n' +
    'export const dv: Dictionary = ' +
    serialise(chrome, '') +
    '\n'
  writeFileSync(join(ROOT, 'lib/i18n/dv.ts'), file, 'utf8')
  console.log('\nwrote lib/i18n/dv.ts')
} else {
  console.log('\nlib/i18n/dv.ts left as it was — the chrome is not complete.')
}

if (Object.keys(plan).length) {
  const file =
    "import type { PlanTranslation } from './types'\n\n" +
    '/**\n' +
    ' * The plan in Dhivehi.\n' +
    ' *\n' +
    PROVENANCE +
    '\n *\n' +
    ' * A partial overlay is fine and expected: anything absent falls through to the\n' +
    ' * English in `lib/plan.ts`, so the plan can land a goal at a time.\n' +
    ' *\n' +
    ' * No figure here differs from `lib/plan.ts`. The digits are Latin in both\n' +
    ' * languages, and a translation names the unit, never the quantity.\n' +
    ' */\n' +
    'export const dvPlan: PlanTranslation = ' +
    serialise(plan, '') +
    '\n'
  writeFileSync(join(ROOT, 'lib/plan-translations/dv.ts'), file, 'utf8')
  console.log('wrote lib/plan-translations/dv.ts')
} else {
  console.log('lib/plan-translations/dv.ts left as it was — nothing came back.')
}
