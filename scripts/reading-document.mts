/**
 * The plan in Dhivehi, as a document someone can read.
 *
 * `translation/english/` and `translation/dhivehi/` are transcripts: 683
 * numbered segments, right for a translation tool and wrong for a person. A
 * councillor asked to read the Dhivehi as a *plan* needs the cover, the
 * vision, the turning-point passage, the timeline, the pillars, the eleven
 * initiatives and then each goal with its targets, strategies and actions —
 * in the order the site puts them in, with no `[nnnn]` markers in sight.
 *
 * So this walks the plan the way a reader walks it, and composes paragraphs.
 * Two things make that walk load-bearing rather than decorative:
 *
 * - **Every paragraph records what it is made of.** A `part` is either a
 *   literal this file generated (a bullet, a year, a chrome label with a
 *   number substituted into it) or a field of a block that came from a
 *   segment. `i18n-docx-apply.mts` splits a revised paragraph along exactly
 *   those parts, which is what lets an edit made in Word land on one line of
 *   `translation/dhivehi/` rather than being guessed at.
 * - **Every field carries the `ref` of its segment**, in the shape
 *   `translation/manifest.json` uses. Where no segment owns a field — a figure
 *   out of `lib/plan.ts`, a chrome label with a `{slot}` filled in — the ref is
 *   `null`, and an edit there is reported instead of written.
 *
 * The document is deterministic: same repo state, same bytes. That is what
 * makes a revision diffable against the file the reviewer was sent.
 *
 * Two things the site does that Word does not:
 *
 * - **Isolates.** `lib/i18n/bidi.ts` holds a quantity together with U+2066 and
 *   U+2069. Word does not implement them — it draws them as visible LRI and
 *   PDI boxes and reorders the text anyway, so "16.2 kWh" comes out "kWh 16.2".
 *   Each isolated run is rebuilt here out of U+200E marks, which Word honours:
 *   one around the run and one either side of every neutral inside it, so the
 *   space in "16.2 kWh" and the dash in "2026–2031" cannot take the
 *   paragraph's direction.
 * - **Fonts.** The Thaana runs ask for MV Boli, which ships with Windows. The
 *   site's own faces (MV Faseyha, MV Aammu) are not installed on most machines
 *   a document gets mailed to, and Word has no font fallback list.
 */
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
import { dv } from '../lib/i18n/dv.ts'
import { isolateQuantities } from '../lib/i18n/bidi.ts'
import { dvPlan } from '../lib/plan-translations/dv.ts'
import { escapeXml, stripMarks, zip } from './docx.mts'

/* ------------------------------------------------------------------ model */

export type Ref = Record<string, string | number> | null

export type Block = {
  k: string
  text?: string
  label?: string
  value?: string
  ref: Ref
  labelRef?: Ref
  valueRef?: Ref
}

export type Field = 'text' | 'label' | 'value'
export type Part = { lit: string } | { field: Field }

/** One paragraph of the document, and the pieces it was composed from. */
export type Composition = { block: number | null; parts: Part[] }

/**
 * Which Thaana face the document asks Word for.
 *
 * MV Boli by default, because it ships with Windows and the file is written to
 * be opened on someone's laptop, where a face the machine does not have is a
 * page of boxes. CI overrides it: the workflow installs the edition's own faces
 * out of `app/fonts/` and renders the PDF in MV Faseyha, which embeds, so the
 * published file carries the site's own type wherever it is opened.
 */
const FONT = process.env.READING_DOCX_FONT ?? 'MV Boli'

const blocks: Block[] = []

const iso = (value?: string) => (value === undefined ? undefined : isolateQuantities(value))

const push = (k: string, text: string | undefined, extra: Partial<Block> = {}) => {
  blocks.push({
    k,
    ...(text === undefined ? {} : { text: iso(text)! }),
    ...(extra.label === undefined ? {} : { label: iso(extra.label)! }),
    ...(extra.value === undefined ? {} : { value: iso(extra.value)! }),
    ref: extra.ref ?? null,
    ...(extra.labelRef === undefined ? {} : { labelRef: extra.labelRef }),
    ...(extra.valueRef === undefined ? {} : { valueRef: extra.valueRef }),
  })
  return blocks.length - 1
}

/** A chrome string by dotted path, with any `{slots}` filled in. */
const c = (path: string, slots: Record<string, string> = {}) => {
  const raw = path.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown>)?.[k], dv)
  const text = typeof raw === 'string' ? raw : path
  return Object.entries(slots).reduce((acc, [k, v]) => acc.split(`{${k}}`).join(v), text)
}

const chrome = (path: string): Ref => ({ t: 'chrome', path })

const t = <T,>(translated: T | undefined, english: T) =>
  translated === undefined || translated === '' ? english : translated

/* ------------------------------------------------------------------- walk */

push('cover-title', t(dvPlan.plan?.title, PLAN.title), { ref: { t: 'planMeta', field: 'title' } })
push('cover-period', PLAN.period)
push('cover-author', t(dvPlan.plan?.author, PLAN.author), { ref: { t: 'planMeta', field: 'author' } })
push('cover-date', t(dvPlan.plan?.date, PLAN.date), { ref: { t: 'planMeta', field: 'date' } })
push('cover-callout', t(dvPlan.plan?.callout, PLAN.callout), {
  ref: { t: 'planMeta', field: 'callout' },
})

push('kicker', t(dvPlan.vision?.kicker, VISION.kicker), { ref: { t: 'vision', field: 'kicker' } })
push('h1', t(dvPlan.vision?.name, VISION.name), { ref: { t: 'vision', field: 'name' } })
push('lede', t(dvPlan.vision?.headline, VISION.headline), { ref: { t: 'vision', field: 'headline' } })
push('figure-line', t(dvPlan.vision?.figure, VISION.figure), { ref: { t: 'vision', field: 'figure' } })

push('h1', t(dvPlan.turningPoint?.title, TURNING_POINT.title), { ref: { t: 'turningTitle' } })
const turning = dvPlan.turningPoint?.paragraphs?.length
  ? dvPlan.turningPoint.paragraphs
  : TURNING_POINT.paragraphs
turning.forEach((paragraph, index) => push('p', paragraph, { ref: { t: 'turningPara', index } }))

for (const fact of HEADLINE_FACTS) {
  push('stat', undefined, {
    value: fact.value,
    label: t(dvPlan.headlineFacts?.[fact.label], fact.label),
    labelRef: { t: 'fact', label: fact.label },
  })
}

push('h2', c('home.islandsLabel'), { ref: chrome('home.islandsLabel') })
for (const name of LAND.islands) {
  push('li', t(dvPlan.islands?.[name], name), { ref: { t: 'island', name } })
}

push('h1', c('background.settlementTitle'), { ref: chrome('background.settlementTitle') })
push('p', c('background.settlementBody'), { ref: chrome('background.settlementBody') })
for (const row of TIMELINE) {
  push('timeline', t(dvPlan.timeline?.[row.year], row.text), {
    label: row.year,
    ref: { t: 'timeline', year: row.year },
  })
}

push('h2', t(dvPlan.migration?.title, MIGRATION_SERIES.title), {
  ref: { t: 'migration', field: 'title' },
})
push('caption', t(dvPlan.migration?.subtitle, MIGRATION_SERIES.subtitle), {
  ref: { t: 'migration', field: 'subtitle' },
})
push('p', c('chart.reading'), { ref: chrome('chart.reading') })

push('h1', t(dvPlan.pillarsIntro?.title, PILLARS_INTRO.title), {
  ref: { t: 'pillarsIntro', field: 'title' },
})
push('p', t(dvPlan.pillarsIntro?.body, PILLARS_INTRO.body), {
  ref: { t: 'pillarsIntro', field: 'body' },
})
for (const pillar of PILLARS) {
  push('pillar', t(dvPlan.pillars?.[pillar.id]?.phrase, pillar.phrase), {
    label: t(dvPlan.pillars?.[pillar.id]?.name, pillar.name),
    ref: { t: 'pillar', id: pillar.id, field: 'phrase' },
    labelRef: { t: 'pillar', id: pillar.id, field: 'name' },
  })
}

push('h1', t(dvPlan.initiativesIntro?.title, INITIATIVES_INTRO.title), {
  ref: { t: 'initiativesIntro', field: 'title' },
})
push('p', t(dvPlan.initiativesIntro?.body, INITIATIVES_INTRO.body), {
  ref: { t: 'initiativesIntro', field: 'body' },
})
for (const initiative of INITIATIVES) {
  push('h3', t(dvPlan.initiatives?.[initiative.number]?.title, initiative.title), {
    label: initiative.number,
    ref: { t: 'initiative', number: initiative.number, field: 'title' },
  })
  push('p', t(dvPlan.initiatives?.[initiative.number]?.text, initiative.text), {
    ref: { t: 'initiative', number: initiative.number, field: 'text' },
  })
}

push('h1', c('home.goalsTitle'), { ref: chrome('home.goalsTitle') })
push('p', c('home.goalsBody'), { ref: chrome('home.goalsBody') })

for (const goal of GOALS) {
  const overlay = dvPlan.goals?.[goal.slug]

  push('goal', t(overlay?.title, goal.title), {
    label: c('goalCard.goalNumber', { number: String(goal.number) }),
    ref: { t: 'goal', slug: goal.slug, field: 'title' },
  })
  push('tagline', t(overlay?.tagline, goal.tagline), {
    ref: { t: 'goal', slug: goal.slug, field: 'tagline' },
  })

  push('h2', c('goal.whyThisMatters'), { ref: chrome('goal.whyThisMatters') })
  push('p', t(overlay?.summary, goal.summary), { ref: { t: 'goal', slug: goal.slug, field: 'summary' } })

  if (goal.stats.length) {
    push('h2', c('goal.whereWeAreToday'), { ref: chrome('goal.whereWeAreToday') })
    for (const stat of goal.stats) {
      push('stat', undefined, {
        value: t(overlay?.stats?.[stat.label]?.value, stat.value),
        label: t(overlay?.stats?.[stat.label]?.label, stat.label),
        valueRef: { t: 'goalStat', slug: goal.slug, label: stat.label, field: 'value' },
        labelRef: { t: 'goalStat', slug: goal.slug, label: stat.label, field: 'label' },
      })
    }
  }

  if (goal.targets.length) {
    push('h2', c('goal.targets'), { ref: chrome('goal.targets') })
    for (const target of goal.targets) {
      push('target', t(overlay?.targets?.[target.id], target.text), {
        label: c('goal.targetLabel', { label: target.label }),
        ref: { t: 'target', slug: goal.slug, id: target.id },
      })
    }
  }

  if (goal.strategies.length) {
    push('h2', c('goal.strategiesAndActions'), { ref: chrome('goal.strategiesAndActions') })
    for (const strategy of goal.strategies) {
      const strategyOverlay = overlay?.strategies?.[strategy.id]
      push('strategy', t(strategyOverlay?.title, strategy.title), {
        label: c('strategies.strategyPrefix', { number: strategy.number }),
        ref: { t: 'strategy', slug: goal.slug, id: strategy.id },
      })
      for (const action of strategy.actions) {
        push('action', t(strategyOverlay?.actions?.[action.id], action.text), {
          ref: { t: 'action', slug: goal.slug, strategy: strategy.id, id: action.id },
        })
      }
    }
  } else {
    push('p', c('strategies.notPublished'), { ref: chrome('strategies.notPublished') })
  }

  if (goal.openNote) {
    push('note', t(overlay?.openNote, goal.openNote), {
      label: c('goal.stillOpen'),
      ref: { t: 'goal', slug: goal.slug, field: 'openNote' },
    })
  }
}

/* ----------------------------------------------------------------- render */

const LRM = '‎'
const ISOLATED = /⁦([\s\S]*?)⁩/g

/** An isolated quantity, rebuilt out of the marks Word actually implements. */
const wordBidi = (text: string) =>
  text.replace(ISOLATED, (_, inner: string) => {
    const spaced = inner.replace(/([\s–—])/g, `${LRM}$1${LRM}`)
    return `${LRM}${spaced}${LRM}`
  })

type RunOptions = {
  size?: number
  bold?: boolean
  italic?: boolean
  color?: string
  rtl?: boolean
}

const runProps = ({ size = 24, bold, italic, color, rtl = true }: RunOptions) =>
  [
    `<w:rFonts w:cs="${FONT}" w:ascii="${FONT}" w:hAnsi="${FONT}"/>`,
    bold ? '<w:b/><w:bCs/>' : '',
    italic ? '<w:i/><w:iCs/>' : '',
    color ? `<w:color w:val="${color}"/>` : '',
    `<w:sz w:val="${size}"/><w:szCs w:val="${size + 2}"/>`,
    rtl ? '<w:rtl/>' : '',
  ].join('')

const run = (text: string, options: RunOptions = {}) => {
  const props = runProps(options)
  return {
    props,
    xml: `<w:r><w:rPr>${props}</w:rPr><w:t xml:space="preserve">${escapeXml(wordBidi(text))}</w:t></w:r>`,
  }
}

type ParagraphOptions = {
  align?: string
  before?: number
  after?: number
  line?: number
  indentEnd?: number
  pageBreak?: boolean
  keepNext?: boolean
  rtl?: boolean
  props?: string
}

const paragraph = (runs: string[], options: ParagraphOptions = {}) => {
  const { align, before = 0, after = 140, line = 320, indentEnd = 0, rtl = true } = options
  const pPr = [
    options.pageBreak ? '<w:pageBreakBefore/>' : '',
    options.keepNext ? '<w:keepNext/>' : '',
    rtl ? '<w:bidi/>' : '',
    `<w:jc w:val="${align ?? (rtl ? 'right' : 'left')}"/>`,
    indentEnd ? `<w:ind w:${rtl ? 'right' : 'left'}="${indentEnd}"/>` : '',
    `<w:spacing w:before="${before}" w:after="${after}" w:line="${line}" w:lineRule="auto"/>`,
    options.props ? `<w:rPr>${options.props}</w:rPr>` : '',
  ].join('')
  return `<w:p><w:pPr>${pPr}</w:pPr>${runs.join('')}</w:p>`
}

const rule =
  '<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="6" ' +
  'w:color="D8D8D8"/></w:pBdr><w:spacing w:after="200"/></w:pPr></w:p>'

const body: string[] = []
const compositions: Composition[] = []

const emit = (xml: string, block: number | null = null, parts: Part[] = []) => {
  body.push(xml)
  compositions.push({ block, parts })
}

const TEXT: Part[] = [{ field: 'text' }]

const simple = (text: string, run_: RunOptions, para: ParagraphOptions = {}) => {
  const r = run(text, run_)
  return paragraph([r.xml], { ...para, props: r.props, rtl: run_.rtl })
}

let firstH1 = true

blocks.forEach((b, i) => {
  const text = b.text ?? ''
  const label = b.label ?? ''

  switch (b.k) {
    case 'cover-title':
      emit(simple(text, { size: 56, bold: true, color: '12352A' }, { after: 60, line: 280 }), i, TEXT)
      break
    case 'cover-period':
      emit(
        simple(text, { size: 28, color: '5A6B63', rtl: false }, { align: 'right', after: 320, rtl: false }),
        i,
        TEXT,
      )
      break
    case 'cover-author':
      emit(simple(text, { size: 28, color: '2B3A33' }, { after: 40 }), i, TEXT)
      break
    case 'cover-date':
      emit(simple(text, { size: 24, color: '6A7873' }, { after: 60 }), i, TEXT)
      break
    case 'cover-callout':
      emit(simple(text, { size: 22, italic: true, color: '6A7873' }, { after: 200 }), i, TEXT)
      emit(rule)
      break

    case 'kicker':
      emit(simple(text, { size: 20, bold: true, color: '6A7873' }, { after: 60 }), i, TEXT)
      break
    case 'lede':
      emit(simple(text, { size: 28, color: '2B3A33' }, { after: 60, line: 340 }), i, TEXT)
      break
    case 'figure-line':
      emit(simple(text, { size: 32, bold: true, color: '12352A' }, { after: 260 }), i, TEXT)
      break
    case 'caption':
      emit(simple(text, { size: 20, italic: true, color: '6A7873' }, { after: 160 }), i, TEXT)
      break

    case 'h1':
      emit(
        simple(
          text,
          { size: 34, bold: true, color: '12352A' },
          { before: firstH1 ? 0 : 320, after: 180, line: 300, pageBreak: !firstH1, keepNext: true },
        ),
        i,
        TEXT,
      )
      firstH1 = false
      break
    case 'h2':
      emit(
        simple(text, { size: 26, bold: true, color: '1A4D3A' }, { before: 280, after: 120, keepNext: true }),
        i,
        TEXT,
      )
      break
    case 'h3': {
      const number = run(`${label}   `, { size: 22, bold: true, color: '8A9691' })
      const title = run(text, { size: 26, bold: true, color: '12352A' })
      emit(
        paragraph([number.xml, title.xml], { props: title.props, before: 240, after: 100, keepNext: true }),
        i,
        [{ lit: `${label}   ` }, ...TEXT],
      )
      break
    }

    case 'goal':
      emit(
        simple(
          label,
          { size: 20, bold: true, color: '6A7873' },
          { after: 40, pageBreak: true, keepNext: true },
        ),
        i,
        [{ lit: label }],
      )
      emit(
        simple(text, { size: 38, bold: true, color: '12352A' }, { after: 80, line: 300, keepNext: true }),
        i,
        TEXT,
      )
      firstH1 = false
      break
    case 'tagline':
      emit(simple(text, { size: 26, italic: true, color: '3C4A44' }, { after: 60 }), i, TEXT)
      emit(rule)
      break

    case 'p':
      emit(simple(text, { size: 24, color: '1F2A25' }, { after: 160, line: 340 }), i, TEXT)
      break

    case 'stat': {
      const value = run(b.value ?? '', { size: 30, bold: true, color: '12352A' })
      emit(paragraph([value.xml], { props: value.props, after: 0, line: 260 }), i, [{ field: 'value' }])
      const statLabel = run(label, { size: 21, color: '5A6B63' })
      emit(paragraph([statLabel.xml], { props: statLabel.props, after: 160, line: 260 }), i, [
        { field: 'label' },
      ])
      break
    }

    case 'timeline': {
      const year = run(label, { size: 24, bold: true, color: '1A4D3A', rtl: false })
      const entry = run(`   ${text}`, { size: 24, color: '1F2A25' })
      emit(paragraph([year.xml, entry.xml], { props: entry.props, after: 100, line: 320 }), i, [
        { lit: `${label}   ` },
        ...TEXT,
      ])
      break
    }

    case 'pillar': {
      const name = run(`${label} — `, { size: 24, bold: true, color: '12352A' })
      const phrase = run(text, { size: 24, color: '1F2A25' })
      emit(paragraph([name.xml, phrase.xml], { props: phrase.props, after: 100, line: 320 }), i, [
        { field: 'label' },
        { lit: ' — ' },
        { field: 'text' },
      ])
      break
    }

    case 'li': {
      const item = run(`•  ${text}`, { size: 24, color: '1F2A25' })
      emit(paragraph([item.xml], { props: item.props, after: 60, indentEnd: 280, line: 320 }), i, [
        { lit: '•  ' },
        ...TEXT,
      ])
      break
    }

    case 'target': {
      const marker = run(`${label} — `, { size: 22, bold: true, color: '1A4D3A' })
      const entry = run(text, { size: 24, color: '1F2A25' })
      emit(paragraph([marker.xml, entry.xml], { props: entry.props, after: 120, line: 330 }), i, [
        { lit: `${label} — ` },
        ...TEXT,
      ])
      break
    }

    case 'strategy': {
      const prefix = run(label, { size: 24, bold: true, color: '8A9691' })
      const title = run(text, { size: 25, bold: true, color: '12352A' })
      emit(
        paragraph([prefix.xml, title.xml], { props: title.props, before: 240, after: 100, keepNext: true }),
        i,
        [{ lit: label }, ...TEXT],
      )
      break
    }

    case 'note': {
      const note = run(label + text, { size: 21, italic: true, color: '5A6B63' })
      emit(paragraph([note.xml], { props: note.props, before: 240, after: 120, line: 300 }), i, [
        { lit: label },
        ...TEXT,
      ])
      break
    }

    case 'action': {
      const item = run(`•  ${text}`, { size: 23, color: '1F2A25' })
      emit(paragraph([item.xml], { props: item.props, after: 70, indentEnd: 280, line: 320 }), i, [
        { lit: '•  ' },
        ...TEXT,
      ])
      break
    }
  }
})

/* ------------------------------------------------------------- the parcel */

const documentXml =
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
  '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" ' +
  'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
  `<w:body>${body.join('')}` +
  '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/>' +
  '<w:pgMar w:top="1418" w:right="1418" w:bottom="1418" w:left="1418" ' +
  'w:header="709" w:footer="709" w:gutter="0"/><w:bidi/>' +
  '<w:footerReference w:type="default" r:id="rIdFtr"/></w:sectPr>' +
  '</w:body></w:document>'

const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
 <w:docDefaults><w:rPrDefault><w:rPr>
  <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="${FONT}"/>
  <w:sz w:val="24"/><w:szCs w:val="26"/></w:rPr></w:rPrDefault>
  <w:pPrDefault><w:pPr><w:spacing w:after="120"/></w:pPr></w:pPrDefault>
 </w:docDefaults>
 <w:style w:type="paragraph" w:styleId="Normal" w:default="1"><w:name w:val="Normal"/></w:style>
</w:styles>`

const footerXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
 <w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="120" w:after="0"/>
  <w:rPr><w:color w:val="9AA5A0"/><w:sz w:val="18"/></w:rPr></w:pPr>
  <w:r><w:rPr><w:color w:val="9AA5A0"/><w:sz w:val="18"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r>
  <w:r><w:rPr><w:color w:val="9AA5A0"/><w:sz w:val="18"/></w:rPr>
   <w:instrText xml:space="preserve"> PAGE </w:instrText></w:r>
  <w:r><w:rPr><w:color w:val="9AA5A0"/><w:sz w:val="18"/></w:rPr><w:fldChar w:fldCharType="separate"/></w:r>
  <w:r><w:rPr><w:color w:val="9AA5A0"/><w:sz w:val="18"/></w:rPr><w:t>1</w:t></w:r>
  <w:r><w:rPr><w:color w:val="9AA5A0"/><w:sz w:val="18"/></w:rPr><w:fldChar w:fldCharType="end"/></w:r>
 </w:p>
</w:ftr>`

const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
 <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
 <Default Extension="xml" ContentType="application/xml"/>
 <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
 <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
 <Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>
 <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
</Types>`

const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
 <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
 <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
</Relationships>`

const documentRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
 <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
 <Relationship Id="rIdFtr" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>
</Relationships>`

const core = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
 xmlns:dc="http://purl.org/dc/elements/1.1/">
 <dc:title>${escapeXml(PLAN.title)} — Dhivehi</dc:title>
 <dc:language>dv</dc:language>
</cp:coreProperties>`

/** The document's paragraphs as plain text, in order — what a revision is compared against. */
export const paragraphs: string[] = compositions.map(({ block, parts }) => {
  if (block === null) return ''
  const b = blocks[block]!
  return stripMarks(
    parts
      .map((part) => ('lit' in part ? part.lit : (b[part.field] ?? '')))
      .join(''),
  ).trim()
})

export { blocks, compositions }

export const docx = () =>
  zip([
    { name: '[Content_Types].xml', body: contentTypes },
    { name: '_rels/.rels', body: rels },
    { name: 'docProps/core.xml', body: core },
    { name: 'word/_rels/document.xml.rels', body: documentRels },
    { name: 'word/document.xml', body: documentXml },
    { name: 'word/styles.xml', body: stylesXml },
    { name: 'word/footer1.xml', body: footerXml },
  ])
