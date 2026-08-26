/**
 * Writes the whole site out in English, ready to be handed to a translator.
 *
 * The site's English lives in two places on purpose — `lib/i18n/en.ts` is the
 * chrome, `lib/plan.ts` is the council's plan — and a translator should not
 * have to know that. This walks both and emits one numbered transcript, split
 * into files small enough to paste into a web tool in one go, plus a manifest
 * that `i18n-apply.mts` reads to put the Dhivehi back exactly where each
 * segment came from.
 *
 * The numbering is the contract. A segment is `[0123]` here and `[0123]` when
 * it comes back; nothing else about the returned file is trusted — not its
 * order, not its length, not its filename.
 *
 *   node --experimental-strip-types scripts/i18n-extract.mts
 */
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { en } from '../lib/i18n/en.ts'
import {
  GOALS,
  HEADLINE_FACTS,
  INITIATIVES,
  INITIATIVES_INTRO,
  LAND,
  MIGRATION_SERIES,
  PILLARS,
  PILLARS_INTRO,
  PLAN,
  TIMELINE,
  TURNING_POINT,
  VISION,
} from '../lib/plan.ts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'translation')

/* ------------------------------------------------------------------ model */

/**
 * Where a segment came from, in enough detail to put it back.
 *
 * Deliberately structural rather than a dotted string: the plan overlay is
 * keyed by ids in five different shapes (goal slugs, target ids, strategy ids,
 * action ids, and — for stats — the English label itself), and flattening all
 * of those into one path format would mean parsing them apart again on the way
 * back in.
 */
type Ref =
  | { t: 'chrome'; path: string }
  | { t: 'planMeta'; field: 'title' | 'author' | 'date' | 'callout' }
  | { t: 'vision'; field: 'headline' | 'figure' | 'name' | 'kicker' }
  | { t: 'turningTitle' }
  | { t: 'turningPara'; index: number }
  | { t: 'fact'; label: string }
  | { t: 'island'; name: string }
  | { t: 'timeline'; year: string }
  | { t: 'migration'; field: 'title' | 'subtitle' }
  | { t: 'series'; name: string }
  | { t: 'pillarsIntro'; field: 'title' | 'body' }
  | { t: 'pillar'; id: string; field: 'name' | 'phrase' }
  | { t: 'initiativesIntro'; field: 'title' | 'body' }
  | { t: 'initiative'; number: string; field: 'title' | 'text' }
  | { t: 'goal'; slug: string; field: 'title' | 'tagline' | 'summary' | 'openNote' }
  | { t: 'goalStat'; slug: string; label: string; field: 'value' | 'label' }
  | { t: 'target'; slug: string; id: string }
  | { t: 'strategy'; slug: string; id: string }
  | { t: 'action'; slug: string; strategy: string; id: string }

type Segment = {
  id: string
  ref: Ref
  /** Exactly as it appears in source, whitespace and all. */
  en: string
  /** What a translator is shown: `en` trimmed, since padding is not language. */
  text: string
  /** `{name}` slots that must survive the round trip. */
  slots: string[]
}

type Group = {
  /** Filename stem, also the manifest's grouping key. */
  file: string
  title: string
  /** Pasted along with the text; the one thing that fixes register. */
  register: string
  segments: Segment[]
}

let counter = 0
const nextId = () => String(++counter).padStart(4, '0')

const SLOT = /\{[a-zA-Z]+\}/g

function seg(ref: Ref, en: string): Segment {
  return {
    id: nextId(),
    ref,
    en,
    text: en.trim(),
    slots: [...new Set(en.match(SLOT) ?? [])],
  }
}

/* ----------------------------------------------------------------- chrome */

/**
 * Every chrome string, flattened to `section.key`, in source order.
 *
 * Source order rather than sorted: `en.ts` is grouped by where the strings
 * appear on the page, and that grouping is the only context a translator gets
 * for a two-word label.
 */
function flattenChrome(): { path: string; value: string }[] {
  const out: { path: string; value: string }[] = []
  const walk = (node: unknown, prefix: string) => {
    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      const path = prefix ? prefix + '.' + key : key
      if (typeof value === 'string') out.push({ path, value })
      else walk(value, path)
    }
  }
  walk(en, '')
  return out
}

/**
 * Strings that are punctuation, not prose.
 *
 * `common.listSeparator` is the comma between island names. Dhivehi wants the
 * Arabic comma, which is a fact about the script rather than a translation
 * decision, and handing ", " to a translator asks a question with no sensible
 * answer. Set by hand in `i18n-apply.mts` and named in the README so it is not
 * silently missing.
 */
const NOT_PROSE = new Set(['common.listSeparator'])

/**
 * Which transcript file a chrome string belongs in.
 *
 * The split is by *register*, not by page, and that is the whole point of it.
 * The first Dhivehi pass read as a government gazette because every string —
 * button, heading, error, screen-reader description — was translated in one
 * undifferentiated run. A file of nothing but buttons, headed by an instruction
 * that says "these are buttons, keep them short", is the fix.
 */
function chromeGroup(path: string, value: string): string {
  if (/Aria$|ImageAlt$|imageAlt$|Sr$/.test(path)) return 'screen-reader'
  if (['map.aria', 'header.navLabel', 'panel.dialogLabel'].includes(path)) return 'screen-reader'
  if (path.startsWith('metadata.')) return 'share-and-search'
  if (path.startsWith('errors.')) return 'feedback-and-status'
  if (/^(control|planComment|basket|panel|strategies)\./.test(path)) return 'feedback-and-status'
  // Everything left is either a short control or a piece of page copy. A
  // sentence-ending mark, or more than eight words, means it is prose.
  const words = value.trim().split(/\s+/).length
  return words > 8 || /[.!?]/.test(value.trim()) ? 'page-copy' : 'interface-labels'
}

/* ------------------------------------------------------------------ build */

const groups = new Map<string, Group>()

function group(file: string, title: string, register: string): Group {
  const existing = groups.get(file)
  if (existing) return existing
  const made: Group = { file, title, register, segments: [] }
  groups.set(file, made)
  return made
}

const REGISTER = {
  labels:
    'Short interface labels, buttons and links a resident taps. Use plain, everyday ' +
    'Dhivehi — the way a person actually speaks — not newspaper or gazette Dhivehi. ' +
    'Keep them short: if the English is two words, the Dhivehi should not be eight.',
  copy:
    'Headings and body text on the public pages, addressed directly to a resident of ' +
    'Addu. Clear, ordinary written Dhivehi. It should read as though it was written ' +
    'in Dhivehi, not translated into it.',
  status:
    'Messages the site shows a resident about their own feedback — what has been ' +
    'saved, what has been sent, what went wrong. Calm and direct, speaking to one ' +
    'person. No apology and no officialese.',
  a11y:
    'Descriptions read aloud by screen readers to blind residents. These are never ' +
    'seen on screen, so they can be longer than a label: write a full, plain sentence ' +
    'that describes what is there.',
  meta:
    'One or two sentences that appear in search results and on social media when ' +
    'someone shares the site. Plain and inviting.',
  plan:
    'The council’s own plan text. Clear, concrete written Dhivehi. Where the English ' +
    'uses a technical term Dhivehi has no word for, use the term Maldivian technical ' +
    'and government writing actually uses, rather than inventing one. Do not soften, ' +
    'strengthen or explain what the plan says — say the same thing in Dhivehi.',
} as const

const CHROME_TITLES: Record<string, string> = {
  'interface-labels': 'Interface labels and buttons',
  'page-copy': 'Page headings and body copy',
  'feedback-and-status': 'Feedback controls and status messages',
  'screen-reader': 'Screen-reader descriptions',
  'share-and-search': 'Search and share descriptions',
}
const CHROME_REGISTERS: Record<string, string> = {
  'interface-labels': REGISTER.labels,
  'page-copy': REGISTER.copy,
  'feedback-and-status': REGISTER.status,
  'screen-reader': REGISTER.a11y,
  'share-and-search': REGISTER.meta,
}

const skipped: string[] = []
for (const { path, value } of flattenChrome()) {
  if (NOT_PROSE.has(path)) {
    skipped.push(path)
    continue
  }
  const file = chromeGroup(path, value)
  group(file, CHROME_TITLES[file]!, CHROME_REGISTERS[file]!).segments.push(
    seg({ t: 'chrome', path }, value),
  )
}

/* the plan's front matter */
const front = group('plan-opening', 'The plan: cover, vision and background', REGISTER.plan)
front.segments.push(
  seg({ t: 'planMeta', field: 'title' }, PLAN.title),
  seg({ t: 'planMeta', field: 'author' }, PLAN.author),
  seg({ t: 'planMeta', field: 'date' }, PLAN.date),
  seg({ t: 'planMeta', field: 'callout' }, PLAN.callout),
  seg({ t: 'vision', field: 'kicker' }, VISION.kicker),
  seg({ t: 'vision', field: 'name' }, VISION.name),
  seg({ t: 'vision', field: 'headline' }, VISION.headline),
  seg({ t: 'vision', field: 'figure' }, VISION.figure),
  seg({ t: 'turningTitle' }, TURNING_POINT.title),
  ...TURNING_POINT.paragraphs.map((p, i) => seg({ t: 'turningPara', index: i }, p)),
  ...HEADLINE_FACTS.map((f) => seg({ t: 'fact', label: f.label }, f.label)),
  ...LAND.islands.map((name) => seg({ t: 'island', name }, name)),
  ...TIMELINE.map((e) => seg({ t: 'timeline', year: e.year }, e.text)),
  seg({ t: 'migration', field: 'title' }, MIGRATION_SERIES.title),
  seg({ t: 'migration', field: 'subtitle' }, MIGRATION_SERIES.subtitle),
  ...MIGRATION_SERIES.series.map((s) => seg({ t: 'series', name: s.name }, s.name)),
  seg({ t: 'pillarsIntro', field: 'title' }, PILLARS_INTRO.title),
  seg({ t: 'pillarsIntro', field: 'body' }, PILLARS_INTRO.body),
  ...PILLARS.flatMap((p) => [
    seg({ t: 'pillar', id: p.id, field: 'name' }, p.name),
    seg({ t: 'pillar', id: p.id, field: 'phrase' }, p.phrase),
  ]),
)

/* the ten flagship initiatives */
const inits = group('plan-initiatives', 'The plan: flagship initiatives', REGISTER.plan)
inits.segments.push(
  seg({ t: 'initiativesIntro', field: 'title' }, INITIATIVES_INTRO.title),
  seg({ t: 'initiativesIntro', field: 'body' }, INITIATIVES_INTRO.body),
  ...INITIATIVES.flatMap((i) => [
    seg({ t: 'initiative', number: i.number, field: 'title' }, i.title),
    seg({ t: 'initiative', number: i.number, field: 'text' }, i.text),
  ]),
)

/* one file per goal — a goal is what a resident reads in one sitting */
for (const goal of GOALS) {
  const file = 'goal-' + String(goal.number).padStart(2, '0') + '-' + goal.slug
  const g = group(file, 'Goal ' + goal.number + ': ' + goal.title, REGISTER.plan)
  g.segments.push(
    seg({ t: 'goal', slug: goal.slug, field: 'title' }, goal.title),
    seg({ t: 'goal', slug: goal.slug, field: 'tagline' }, goal.tagline),
    seg({ t: 'goal', slug: goal.slug, field: 'summary' }, goal.summary),
  )
  if (goal.openNote) {
    g.segments.push(seg({ t: 'goal', slug: goal.slug, field: 'openNote' }, goal.openNote))
  }
  for (const stat of goal.stats) {
    g.segments.push(
      seg({ t: 'goalStat', slug: goal.slug, label: stat.label, field: 'label' }, stat.label),
    )
    // Only where the figure carries a word — "18.7 million", "35,351 MVR". A
    // bare number has nothing in it to translate, and sending one out invites
    // it to come back changed.
    if (/[A-Za-z]/.test(stat.value)) {
      g.segments.push(
        seg({ t: 'goalStat', slug: goal.slug, label: stat.label, field: 'value' }, stat.value),
      )
    }
  }
  for (const target of goal.targets) {
    g.segments.push(seg({ t: 'target', slug: goal.slug, id: target.id }, target.text))
  }
  for (const strategy of goal.strategies) {
    g.segments.push(seg({ t: 'strategy', slug: goal.slug, id: strategy.id }, strategy.title))
    for (const action of strategy.actions) {
      g.segments.push(
        seg({ t: 'action', slug: goal.slug, strategy: strategy.id, id: action.id }, action.text),
      )
    }
  }
}

/* ------------------------------------------------------------------ write */

const ordered = [...groups.values()]

/** Soft-wrap a paragraph to 76 columns, so a pasted block does not run off. */
function wrap(text: string): string {
  const out: string[] = []
  let line = ''
  for (const word of text.split(/\s+/)) {
    if (line && line.length + word.length + 1 > 76) {
      out.push(line)
      line = word
    } else {
      line = line ? line + ' ' + word : word
    }
  }
  if (line) out.push(line)
  return out.join('\n')
}

function transcript(g: Group, index: number): string {
  const slots = [...new Set(g.segments.flatMap((s) => s.slots))]
  return [
    '=== ADDU DEVELOPMENT PLAN — ENGLISH TO DHIVEHI ===',
    'File ' + (index + 1) + ' of ' + ordered.length + ' · ' + g.title,
    g.segments.length + ' segments',
    '',
    'Translate every numbered segment below into Dhivehi (Thaana).',
    '',
    'RULES',
    '1. Keep every [nnnn] marker exactly as written, at the start of its own line.',
    '2. Return the same segments, in the same order. Never merge two or split one.',
    '3. Translate the text only. Add no notes, no explanations, no English.',
    slots.length
      ? '4. Keep every {slot} exactly as written, in Latin letters: ' +
        slots.join(' ') +
        '\n   Each is a hole a number or a name is dropped into when the page is' +
        '\n   built. Put it where Dhivehi wants it in the sentence — but do not' +
        '\n   translate, rename, remove or duplicate one.'
      : '4. (No {slots} in this file.)',
    '5. Keep every digit in Latin numerals (0 1 2 3 4 5 6 7 8 9), and change no',
    '   figure. Dhivehi is written with the same digits, and every number here is',
    '   a measurement the council made: name the unit, never the quantity.',
    '',
    'REGISTER',
    wrap(g.register),
    '',
    '--- BEGIN ---',
    '',
    ...g.segments.map((s) => '[' + s.id + '] ' + s.text),
    '',
    '--- END ---',
    '',
  ].join('\n')
}

rmSync(join(OUT, 'english'), { recursive: true, force: true })
mkdirSync(join(OUT, 'english'), { recursive: true })
mkdirSync(join(OUT, 'dhivehi'), { recursive: true })

const names = ordered.map((g, i) => String(i + 1).padStart(2, '0') + '-' + g.file + '.txt')

ordered.forEach((g, i) => {
  writeFileSync(join(OUT, 'english', names[i]!), transcript(g, i), 'utf8')
})

writeFileSync(
  join(OUT, 'manifest.json'),
  JSON.stringify(
    {
      generatedBy: 'scripts/i18n-extract.mts',
      total: counter,
      skipped,
      files: ordered.map((g, i) => ({
        name: names[i],
        title: g.title,
        segments: g.segments.map((s) => ({ id: s.id, ref: s.ref, en: s.en, slots: s.slots })),
      })),
    },
    null,
    2,
  ),
  'utf8',
)

const words = ordered.reduce(
  (a, g) => a + g.segments.reduce((b, s) => b + s.text.split(/\s+/).length, 0),
  0,
)
console.log(counter + ' segments, ' + words + ' words, ' + ordered.length + ' files')
ordered.forEach((g, i) => {
  console.log('  ' + names[i]!.padEnd(44) + String(g.segments.length).padStart(4) + ' segments')
})
if (skipped.length) console.log('set by hand, not sent: ' + skipped.join(', '))
