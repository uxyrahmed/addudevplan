/**
 * The results table's column template, in one place.
 *
 * Read by the heading strip, by the twelve goal rows and by the action rows
 * that open beneath them, so a figure always sits under the word that names it
 * — and an action's Concern count sits directly under its goal's. Three hand-
 * kept class lists would drift the first time a column moved.
 *
 * Three layouts, because the row carries three kinds of thing — a name, a bar
 * and five figures — and they do not all fit on one line until there is real
 * width:
 *
 * - **Phone:** three columns. The name and the bar take the full width; the
 *   three counts share the line below, so they can still be read against each
 *   other even though the columns down the page are gone.
 * - **Tablet up:** the name takes its own line and everything measured shares
 *   the one below it, in fixed columns. The counts stop drifting between rows.
 * - **`xl` up:** the name moves onto that line too and the whole row becomes a
 *   single band of columns, which is when the heading strip appears.
 *
 * `xl` rather than `lg` for that last step. At 1024 the seven columns fit, but
 * only by squeezing the goal's name to 240px — three of the twelve titles then
 * wrapped to a second line and those rows stood 22px taller than the rest,
 * which is exactly the ragged edge the table exists to remove.
 */
export const COLS = [
  'grid-cols-3 gap-x-4 gap-y-3',
  'sm:grid-cols-[minmax(0,1fr)_4.75rem_4.75rem_4.75rem_5.5rem_6rem] sm:items-center',
  'xl:grid-cols-[minmax(0,1fr)_11rem_4.75rem_4.75rem_4.75rem_5.5rem_6rem] xl:gap-y-0',
].join(' ')

/** The name cell: its own line until the row is wide enough to hold everything. */
export const COL_NAME = 'col-span-3 sm:col-span-6 xl:col-span-1'

/** The bar, and the two figures that are not one of the three reactions. */
export const COL_WIDE = 'col-span-3 sm:col-span-1'

/** Pairs with the cell beside it on a phone rather than taking a line of its own. */
export const COL_PAIR = 'col-span-2 sm:col-span-1'
