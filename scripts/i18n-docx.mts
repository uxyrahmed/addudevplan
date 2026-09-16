/**
 * Writes the plan in Dhivehi as a Word file, for someone to read on paper.
 *
 * The transcripts in `translation/dhivehi/` are the source and they are not
 * readable: 683 numbered lines in transcript order. This is the same text
 * composed as the plan — cover, vision, turning point, settlement history,
 * pillars, initiatives, then the twelve goals with their targets, strategies
 * and actions — which is what a councillor can actually mark up.
 *
 * The file is generated, never edited in place. What comes back from review
 * goes to `i18n-docx-apply.mts`, which resolves each changed paragraph to the
 * segment that owns it. Regenerating here and diffing there is the whole trick:
 * the document is deterministic, so the "before" is always recoverable from the
 * repo rather than having to be kept alongside the revision.
 *
 *   node --experimental-strip-types scripts/i18n-docx.mts [path.docx]
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { docx, blocks, paragraphs } from './reading-document.mts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = process.argv[2] ?? join(ROOT, 'translation', 'addu-plan-dhivehi.docx')

const file = docx()
writeFileSync(out, file)

const segments = blocks.filter((b) => b.ref || b.labelRef || b.valueRef).length
console.log(`${paragraphs.length} paragraphs from ${blocks.length} blocks (${segments} carry a segment)`)
console.log(`wrote ${out} — ${(file.length / 1024).toFixed(0)} KB`)
console.log()
console.log('Thaana is set in MV Boli, which ships with Windows. The site’s own')
console.log('faces are not installed on most machines, and Word has no fallback list.')
