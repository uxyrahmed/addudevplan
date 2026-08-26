/**
 * Puts the unit symbols back, where the English uses one.
 *
 * The translation spelled every unit out in Thaana — "ކިލޯވޮޓް-އަވަރ" for kWh,
 * "ދިވެހި ރުފިޔާ" for MVR, "ކިއުބިކް މީޓަރު" for cbm. Read as prose that is
 * correct; read as a figure rail it is not, because the English beside it says
 * "16.2 kWh" and a unit is a symbol rather than a word. The rule applied here is
 * narrow and checkable: **where the English writes a symbol, the Dhivehi writes
 * the same symbol.** Where the English spells a unit out — "1,268 hectares of
 * land" — nothing changes, and "million" stays "މިލިއަން" because it is a word
 * and not a unit.
 *
 * The awkward part is that Dhivehi inflects the noun it is replacing. Three
 * endings show up, and only one of them can simply be left where it is:
 *
 * - `…މީޓަރުގެ`  the genitive `ގެ` is already a whole word — "cbm ގެ".
 * - `…މީޓަރަށް`  the dative is written onto the noun's last consonant, so
 *   cutting the noun out strands a bare vowel sign. It has to be rebuilt as the
 *   free-standing "cbm އަށް", with alifu carrying the vowel.
 * - `…މީޓަރެއް`  the indefinite, same problem, rebuilt as "cbm އެއް".
 *
 * That is why the table below is written out longhand, longest form first,
 * rather than being a stem substitution with a suffix rule bolted on.
 *
 * Run once, against `translation/dhivehi/`, then `i18n-apply.mts` as usual —
 * this edits the transcripts, which are the source, never the generated files.
 *
 *   node --experimental-strip-types scripts/i18n-units.mts          # report
 *   node --experimental-strip-types scripts/i18n-units.mts --write  # and edit
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'translation')
const WRITE = process.argv.includes('--write')

/**
 * Thaana spelling to symbol. Order is significant: every inflected form must
 * come before the bare noun it is built on, or the bare form matches first and
 * leaves the ending stranded.
 */
const UNITS: [string, string][] = [
  ['ކިއުބިކް މީޓަރަށް', 'cbm އަށް'],
  ['ކިއުބިކް މީޓަރެއް', 'cbm އެއް'],
  ['ކިއުބިކް މީޓަރުގެ', 'cbm ގެ'],
  ['ކިއުބިކް މީޓަރު', 'cbm'],
  ['ކިލޯވޮޓް-އަވަރގެ', 'kWh ގެ'],
  ['ކިލޯވޮޓް-އަވަރ', 'kWh'],
  ['ކިލޯވޮޓް އަވަރގެ', 'kWh ގެ'],
  ['ކިލޯވޮޓް އަވަރ', 'kWh'],
  ['ކިލޯވޮޓް ޕީކްގެ', 'kWp ގެ'],
  ['ކިލޯވޮޓް ޕީކް', 'kWp'],
  ['މެގަވޮޓް އަވަރގެ', 'MWh ގެ'],
  ['މެގަވޮޓް އަވަރ', 'MWh'],
  ['މެގަވޮޓްގެ', 'MW ގެ'],
  ['މެގަވޮޓް', 'MW'],
  ['ކިލޯމީޓަރުގެ', 'km ގެ'],
  ['ކިލޯމީޓަރު', 'km'],
  ['ދިވެހި ރުފިޔާ', 'MVR'],
  ['ޔޫއެސް ޑޮލަރުގެ', 'USD ގެ'],
  ['ޔޫއެސް ޑޮލަރު', 'USD'],
]

/** The symbols as `lib/plan.ts` writes them — the casing is the English's. */
const SYMBOL = /\b(kWh|kWp|MWh|GWh|MW|kW|MVR|USD|cbm|sqm|ha|km)\b/g

const manifest = JSON.parse(readFileSync(join(OUT, 'manifest.json'), 'utf8')) as {
  files: { name: string; segments: { id: string; en: string }[] }[]
}

/**
 * Which segments are in scope: those whose *English* carries a symbol.
 *
 * Scoped this way rather than swept over the whole transcript, because the same
 * Thaana words are correct elsewhere. "1,268 hectares of land" spells its unit
 * out in English too, and translating that back to "ha" would be this script
 * inventing a convention the source does not use.
 */
const inScope = new Map<string, string[]>()
for (const file of manifest.files) {
  for (const s of file.segments) {
    const symbols = [...new Set(s.en.match(SYMBOL) ?? [])]
    if (symbols.length) inScope.set(s.id, symbols)
  }
}

const MARKER = /\[(\d{3,4})\]/g
let changed = 0
const report: string[] = []

const dir = join(OUT, 'dhivehi')
if (!existsSync(dir)) {
  console.error('No translation/dhivehi/ to work on.')
  process.exit(1)
}

for (const name of readdirSync(dir).filter((f) => /\.txt$/i.test(f))) {
  const path = join(dir, name)
  const body = readFileSync(path, 'utf8')
  const marks = [...body.matchAll(MARKER)]
  if (!marks.length) continue

  let out = ''
  let cursor = 0

  marks.forEach((mark, i) => {
    const id = mark[1]!.padStart(4, '0')
    const from = mark.index + mark[0].length
    const to = i + 1 < marks.length ? marks[i + 1]!.index : body.length

    // Everything up to the end of this marker is carried across untouched.
    out += body.slice(cursor, from)
    cursor = to

    const slice = body.slice(from, to)
    if (!inScope.has(id)) {
      out += slice
      return
    }

    let edited = slice
    for (const [thaana, symbol] of UNITS) edited = edited.split(thaana).join(symbol)
    // A symbol butting straight against Thaana needs the space the noun used to
    // provide: "kWhގެ" is not a word, "kWh ގެ" is a symbol and a particle.
    edited = edited.replace(/([A-Za-z])(?=[ހ-޿])/g, '$1 ').replace(/ {2,}/g, ' ')

    if (edited !== slice) {
      changed++
      report.push(
        `[${id}] ${name}  (${inScope.get(id)!.join(' ')})\n` +
          `   was: ${slice.replace(/\s+/g, ' ').trim().slice(0, 110)}\n` +
          `   now: ${edited.replace(/\s+/g, ' ').trim().slice(0, 110)}`,
      )
    }
    out += edited
  })
  out += body.slice(cursor)

  if (WRITE && out !== body) writeFileSync(path, out, 'utf8')
}

console.log(report.join('\n'))
console.log(`\n${changed} segments changed, of ${inScope.size} carrying a symbol in English.`)
if (!WRITE) console.log('Report only. Re-run with --write, then npm run i18n:apply -- --write.')
