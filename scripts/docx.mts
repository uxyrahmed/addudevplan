/**
 * The smallest amount of .docx a round trip needs: a zip, and the text inside
 * one part of it.
 *
 * A .docx is a zip of XML parts. Writing one needs no library — deflate is in
 * `node:zlib` and the container is four fixed-shape records — and reading one
 * back needs only the part that holds the prose, `word/document.xml`. That is
 * the whole reason this file exists rather than a dependency: the repo has no
 * build step for scripts, and a document format we only write and read back
 * ourselves does not justify one.
 *
 * What is deliberately *not* here: styles, numbering, images, revision marks.
 * `reading-document.mts` writes the few parts it needs by hand, and the reader
 * below pulls plain paragraph text out of whatever Word saved, which is all
 * `i18n-docx-apply.mts` compares.
 */
import { deflateRawSync, inflateRawSync } from 'node:zlib'

export type ZipEntry = { name: string; body: string | Buffer }

/* -------------------------------------------------------------------- zip */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[i] = c >>> 0
  }
  return table
})()

const crc32 = (bytes: Buffer) => {
  let c = 0xffffffff
  for (const byte of bytes) c = CRC_TABLE[(c ^ byte) & 0xff]! ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

/**
 * Packs entries into a zip.
 *
 * Every entry is deflated and every timestamp is zero. A fixed timestamp is
 * wanted rather than tolerated: the same content should produce the same
 * bytes, so a regenerated document can be compared against the one a reviewer
 * was sent without the clock making every byte differ.
 */
export function zip(entries: ZipEntry[]): Buffer {
  const locals: Buffer[] = []
  const central: Buffer[] = []
  let offset = 0

  for (const entry of entries) {
    const name = Buffer.from(entry.name, 'utf8')
    const body = typeof entry.body === 'string' ? Buffer.from(entry.body, 'utf8') : entry.body
    const deflated = deflateRawSync(body, { level: 9 })
    const crc = crc32(body)

    const local = Buffer.alloc(30 + name.length)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(20, 4) // version needed
    local.writeUInt16LE(0, 6) // flags
    local.writeUInt16LE(8, 8) // deflate
    local.writeUInt32LE(0, 10) // time and date
    local.writeUInt32LE(crc, 14)
    local.writeUInt32LE(deflated.length, 18)
    local.writeUInt32LE(body.length, 22)
    local.writeUInt16LE(name.length, 26)
    local.writeUInt16LE(0, 28) // extra
    name.copy(local, 30)
    locals.push(local, deflated)

    const dir = Buffer.alloc(46 + name.length)
    dir.writeUInt32LE(0x02014b50, 0)
    dir.writeUInt16LE(20, 4) // version made by
    dir.writeUInt16LE(20, 6) // version needed
    dir.writeUInt16LE(0, 8)
    dir.writeUInt16LE(8, 10)
    dir.writeUInt32LE(0, 12)
    dir.writeUInt32LE(crc, 16)
    dir.writeUInt32LE(deflated.length, 20)
    dir.writeUInt32LE(body.length, 24)
    dir.writeUInt16LE(name.length, 28)
    dir.writeUInt32LE(0, 38) // external attributes
    dir.writeUInt32LE(offset, 42)
    name.copy(dir, 46)
    central.push(dir)

    offset += local.length + deflated.length
  }

  const directory = Buffer.concat(central)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(entries.length, 8)
  end.writeUInt16LE(entries.length, 10)
  end.writeUInt32LE(directory.length, 12)
  end.writeUInt32LE(offset, 16)

  return Buffer.concat([...locals, directory, end])
}

/**
 * Pulls one entry out of a zip, by name.
 *
 * Sizes are read from the central directory rather than the local header on
 * purpose: a writer that sets the data-descriptor flag leaves zeroes in the
 * local header, and Word is entitled to be one.
 */
export function unzip(archive: Buffer, wanted: string): Buffer {
  let eocd = -1
  for (let i = archive.length - 22; i >= 0; i--) {
    if (archive.readUInt32LE(i) === 0x06054b50) {
      eocd = i
      break
    }
  }
  if (eocd === -1) throw new Error('not a zip: no end-of-central-directory record')

  const count = archive.readUInt16LE(eocd + 10)
  let at = archive.readUInt32LE(eocd + 16)

  for (let i = 0; i < count; i++) {
    if (archive.readUInt32LE(at) !== 0x02014b50) throw new Error('zip central directory is damaged')
    const method = archive.readUInt16LE(at + 10)
    const compressed = archive.readUInt32LE(at + 20)
    const nameLength = archive.readUInt16LE(at + 28)
    const extraLength = archive.readUInt16LE(at + 30)
    const commentLength = archive.readUInt16LE(at + 32)
    const localAt = archive.readUInt32LE(at + 42)
    const name = archive.toString('utf8', at + 46, at + 46 + nameLength)

    if (name === wanted) {
      const localNameLength = archive.readUInt16LE(localAt + 26)
      const localExtraLength = archive.readUInt16LE(localAt + 28)
      const from = localAt + 30 + localNameLength + localExtraLength
      const data = archive.subarray(from, from + compressed)
      return method === 0 ? Buffer.from(data) : inflateRawSync(data)
    }

    at += 46 + nameLength + extraLength + commentLength
  }

  throw new Error(`no ${wanted} in this file — is it a .docx?`)
}

/* -------------------------------------------------------------------- xml */

export const escapeXml = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const unescapeXml = (text: string) =>
  text
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')

/**
 * Directional marks: presentation, never content.
 *
 * The site holds a quantity together with U+2066 isolates and the Word build
 * rewrites those as U+200E marks, because Word does not implement isolates.
 * Neither belongs in a comparison or in a transcript, so both are stripped on
 * the way in and added again on the way out.
 */
export const MARKS = /[‎‏⁦-⁩‪-‮]/g

export const stripMarks = (text: string) => text.replace(MARKS, '')

const PARAGRAPH = /<w:p(?:\s[^>]*)?>([\s\S]*?)<\/w:p>|<w:p(?:\s[^>]*)?\/>/g
const PIECE = /<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>|<w:tab\s*\/>|<w:br\s*\/>|<w:cr\s*\/>/g

/**
 * Every paragraph of a `word/document.xml`, in document order, as plain text.
 *
 * Only `<w:t>` is read. That is what makes a document with tracked changes
 * come back as its *final* text: an insertion's text sits in a `<w:t>` like
 * any other, and a deletion's sits in `<w:delText>`, which this never matches.
 */
export function paragraphTexts(documentXml: string): string[] {
  const out: string[] = []
  for (const paragraph of documentXml.matchAll(PARAGRAPH)) {
    const body = paragraph[1] ?? ''
    let text = ''
    for (const piece of body.matchAll(PIECE)) {
      if (piece[0].startsWith('<w:t')) text += unescapeXml(piece[1] ?? '')
      else if (piece[0].startsWith('<w:tab')) text += '\t'
      else text += '\n'
    }
    out.push(stripMarks(text).trim())
  }
  return out
}

/** The paragraphs of a .docx file's main body. */
export const docxParagraphs = (archive: Buffer) =>
  paragraphTexts(unzip(archive, 'word/document.xml').toString('utf8'))
