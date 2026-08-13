/**
 * A glyph per pillar, drawn large and faint behind each tile.
 *
 * Unlike `goal-glyphs.ts`, this is not a transcription: the deck draws its five
 * pillars as plain coloured hexagons with no artwork inside them, so there is no
 * source icon to match against. These are chosen — from the same Hugeicons
 * family the rest of the site uses, so the set still reads as one system — and
 * they are decoration. Each tile's heading carries the meaning; the glyph is
 * `aria-hidden` and nothing is lost if it fails to load.
 *
 * `UserGroupIcon` rather than the `UserGroup03Icon` on goal 7's badge: the two
 * appear within a screen of each other and the same drawing in both places
 * would suggest a link between the pillar and that goal, which the draft has
 * not yet stated.
 */
import ChartUpIcon from '@hugeicons/core-free-icons/ChartUpIcon'
import City03Icon from '@hugeicons/core-free-icons/City03Icon'
import JusticeScale01Icon from '@hugeicons/core-free-icons/JusticeScale01Icon'
import Leaf01Icon from '@hugeicons/core-free-icons/Leaf01Icon'
import UserGroupIcon from '@hugeicons/core-free-icons/UserGroupIcon'
import type { IconData } from '@/components/ui/icon'

export const PILLAR_GLYPHS: Record<string, IconData> = {
  infrastructure: City03Icon,
  people: UserGroupIcon,
  economy: ChartUpIcon,
  environment: Leaf01Icon,
  governance: JusticeScale01Icon,
}
