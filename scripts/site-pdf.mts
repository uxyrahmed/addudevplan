/**
 * The site, printed.
 *
 * The plan goes out as a PDF, and the PDF is this site — the same routes a
 * resident reads, put through a headless browser's print path — rather than a
 * document rebuilt to resemble it. One pipeline, so the paper cannot drift away
 * from the page. `@media print` in `app/globals.css` is the half of this that
 * decides what paper gets: the reveals uncovered, the fixed chrome and the
 * consultation device gone, the colour kept.
 *
 * The routes are the plan's own order: the home page, the settlement history
 * behind it, then the twelve goals as `lib/plan.ts` numbers them. Each is
 * printed on its own, which is also what gives every goal a fresh page, and the
 * pieces are bound into one file at the end.
 *
 * Two waits that are not optional. `networkidle` lets the hero image and the
 * fonts arrive — Thaana set in a fallback face is a different document — and
 * `document.fonts.ready` is what actually says the faces are usable, because a
 * quiet network only means nothing more is coming, not that what came is ready.
 *
 *   node --experimental-strip-types scripts/site-pdf.mts [baseUrl] [out.pdf]
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium } from 'playwright'
import { PDFDocument } from 'pdf-lib'

import { GOALS } from '../lib/plan.ts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

const base = (process.argv[2] ?? 'http://localhost:3000').replace(/\/$/, '')
const out = process.argv[3] ?? join(ROOT, 'public', 'plan', 'addu-plan-dhivehi.pdf')
const locale = process.env.PDF_LOCALE ?? 'dv'

const routes = [
  `/${locale}`,
  `/${locale}/background`,
  ...GOALS.map((goal) => `/${locale}/goals/${goal.slug}`),
]

const browser = await chromium.launch()
const context = await browser.newContext({
  // The reveal layer stands down under reduced motion, which is exactly what a
  // printer wants: no half-played transitions caught mid-flight.
  reducedMotion: 'reduce',
  viewport: { width: 1280, height: 1600 },
})

const pages: Uint8Array[] = []

for (const route of routes) {
  const page = await context.newPage()
  const url = `${base}${route}`
  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })

  if (!response || !response.ok()) {
    throw new Error(`${url} answered ${response ? response.status() : 'nothing'}`)
  }

  await page.emulateMedia({ media: 'print' })
  await page.evaluate(() => document.fonts.ready)

  // Nothing that is in the document should be missing from a copy of it. The
  // print rules uncover the reveals; this is the check that they did.
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll('[data-reveal], [data-enter]')].filter((element) => {
      const style = getComputedStyle(element)
      return style.visibility === 'hidden' || style.opacity === '0'
    }).length,
  )
  if (hidden > 0) throw new Error(`${route}: ${hidden} revealed blocks are still hidden in print`)

  pages.push(
    await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
    }),
  )

  console.log(`  printed ${route}`)
  await page.close()
}

await browser.close()

/* ------------------------------------------------------------------- bind */

const bound = await PDFDocument.create()
bound.setTitle('Addu Development Plan')
bound.setLanguage(locale)

for (const part of pages) {
  const source = await PDFDocument.load(part)
  const copied = await bound.copyPages(source, source.getPageIndices())
  for (const page of copied) bound.addPage(page)
}

mkdirSync(dirname(out), { recursive: true })
const bytes = await bound.save()
writeFileSync(out, bytes)

console.log(
  `${routes.length} routes, ${bound.getPageCount()} pages -> ${out} (${(bytes.length / 1024).toFixed(0)} KB)`,
)
