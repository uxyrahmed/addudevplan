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
 *
 * Keyed on `slug`, not on `number`. The council renumbered six goals in the
 * 1 September review; a map keyed on the number would have kept pointing at
 * whatever goal now sits in that position and quietly handed the transport
 * goal a water droplet. The slug is the one identifier that stays with a goal.
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

export const GOAL_GLYPHS: Record<string, IconData> = {
  'energy-security': SolarPanel05Icon,
  'water-security': DropletsIcon,
  'food-security': RiceBowl01Icon,
  'future-ready-transport': CarTaxiFrontIcon,
  'connect-the-south': AirplaneTakeOff01Icon,
  'diverse-quality-housing': House01Icon,
  // Nearest free match: the deck's own glyph is not in the free package.
  'connect-community-and-culture': UserGroup03Icon,
  'health-and-well-being': HeartPulseIcon,
  'education-excellence': Mortarboard02Icon,
  'inclusive-prosperity': Plant03Icon,
  'wildlife-and-wellness-tourism': CrabIcon,
  'environment-protection': GreenHouseIcon,
}
