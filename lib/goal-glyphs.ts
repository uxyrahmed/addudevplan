/**
 * The glyph on each goal's badge — the deck's own icon for that goal.
 *
 * The 12 August draft draws its twelve-goals slide with Hugeicons, the same
 * family the rest of this site's UI uses, so the badges no longer carry traced
 * artwork. Each icon below was identified by matching the vector geometry on
 * that slide against every icon in `@hugeicons/core-free-icons`: eleven of the
 * twelve matched a free icon exactly, which is what makes this a transcription
 * rather than a set of lookalikes chosen by eye.
 *
 * Goal 7 is the exception — its glyph is a Hugeicons drawing that is not in the
 * free package, so the closest relative in the same family stands in. It is the
 * one icon here that is a substitution, and it should be replaced if the Pro set
 * is ever licensed.
 *
 * Re-run the match if the deck redraws: this is a record of what the slide
 * draws, not a design decision to revisit independently.
 */
import AirplaneTakeOff01Icon from '@hugeicons/core-free-icons/AirplaneTakeOff01Icon'
import CarTaxiFrontIcon from '@hugeicons/core-free-icons/CarTaxiFrontIcon'
import CrabIcon from '@hugeicons/core-free-icons/CrabIcon'
import DropletsIcon from '@hugeicons/core-free-icons/DropletsIcon'
import GreenHouseIcon from '@hugeicons/core-free-icons/GreenHouseIcon'
import HeartPulseIcon from '@hugeicons/core-free-icons/HeartPulseIcon'
import House01Icon from '@hugeicons/core-free-icons/House01Icon'
import Mortarboard02Icon from '@hugeicons/core-free-icons/Mortarboard02Icon'
import Plant03Icon from '@hugeicons/core-free-icons/Plant03Icon'
import RiceBowl01Icon from '@hugeicons/core-free-icons/RiceBowl01Icon'
import SolarPanel05Icon from '@hugeicons/core-free-icons/SolarPanel05Icon'
import UserGroup03Icon from '@hugeicons/core-free-icons/UserGroup03Icon'
import type { IconData } from '@/components/ui/icon'

export const GOAL_GLYPHS: Record<number, IconData> = {
  1: SolarPanel05Icon, // Ensure energy security
  2: DropletsIcon, // Safe diverse water sources
  3: RiceBowl01Icon, // Ensure food security
  4: CarTaxiFrontIcon, // Future ready transport
  5: AirplaneTakeOff01Icon, // Connect the South
  6: House01Icon, // Diverse quality housing
  7: UserGroup03Icon, // Connect community and culture — nearest free match
  8: HeartPulseIcon, // Health and well-being
  9: Mortarboard02Icon, // Education excellence
  10: Plant03Icon, // Inclusive prosperity
  11: CrabIcon, // Wildlife and wellness tourism
  12: GreenHouseIcon, // Environment protection
}
