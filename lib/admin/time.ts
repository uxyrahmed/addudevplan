/**
 * The council reads the results in Maldives time.
 *
 * The panel is rendered on the server, and the server is not in the Maldives —
 * Vercel runs it in UTC — so a time formatted without a zone comes out five
 * hours behind the clock on the reader's wall. Every time on these screens
 * names this zone instead of inheriting the machine's.
 *
 * Maldives time is UTC+5 all year, with no daylight saving, which is what lets
 * `maldivesIso` below add a fixed offset rather than consult a calendar.
 */
export const COUNCIL_TIME_ZONE = 'Indian/Maldives'

const OFFSET_MS = 5 * 60 * 60 * 1000

/**
 * An instant as Maldives wall-clock time with its offset written out —
 * `2026-09-28T08:27:52+05:00` — for the export, where a spreadsheet reader
 * should see the local time and still be able to tell which zone it is in.
 */
export function maldivesIso(instant: string | number | Date) {
  const shifted = new Date(new Date(instant).getTime() + OFFSET_MS)
  return `${shifted.toISOString().slice(0, 19)}+05:00`
}
