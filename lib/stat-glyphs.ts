/**
 * The glyph beside each figure in a goal's "Where we are today" rail.
 *
 * Unlike [[GOAL_GLYPHS]], this is not a transcription. The deck's figure rails
 * are set as bare number-and-label pairs, so nothing here is read off a slide —
 * each glyph is chosen to name the thing its figure counts, from the same
 * Hugeicons family the rest of the site draws from. The rule followed was
 * literal over clever: the icon says what the noun in the label says, and where
 * the free set has no icon for that noun the nearest unambiguous one stands in
 * rather than a symbol the reader has to decode.
 *
 * Two of those stand-ins are worth knowing about, because both are a compromise
 * and neither should be read as a considered preference:
 *
 * - Nurses take a syringe. The free set has no nurse. A hospital bed was the
 *   other candidate and was rejected: beside a figure reading "147" it would be
 *   misread as counting beds, and misnaming a quantity is worse than an oblique
 *   glyph.
 * - Wetlands take a lake, which is the closest the set comes to the kilhi the
 *   figure actually counts.
 *
 * Keyed on the stat's own label rather than its position in the array. Position
 * would be shorter, but a rail that gains or loses a figure would then silently
 * shift every glyph below it onto the wrong number — which is exactly the kind
 * of error nobody catches by eye. Keyed on the label, an edited or reordered
 * rail loses a glyph and keeps every other one correct, and a missing glyph is
 * visible. Goal 3's rail was rebuilt in the 16 August draft; assume it will
 * happen again.
 *
 * Labels below must match `lib/plan.ts` exactly, punctuation and em dashes
 * included.
 */
import AccessibilityIcon from '@hugeicons/core-free-icons/AccessibilityIcon'
import AirplaneLanding01Icon from '@hugeicons/core-free-icons/AirplaneLanding01Icon'
import AirportIcon from '@hugeicons/core-free-icons/AirportIcon'
import ApartmentIcon from '@hugeicons/core-free-icons/ApartmentIcon'
import Apple01Icon from '@hugeicons/core-free-icons/Apple01Icon'
import BeachIcon from '@hugeicons/core-free-icons/BeachIcon'
import BedDoubleIcon from '@hugeicons/core-free-icons/BedDoubleIcon'
import BedSingle01Icon from '@hugeicons/core-free-icons/BedSingle01Icon'
import Briefcase01Icon from '@hugeicons/core-free-icons/Briefcase01Icon'
import Building02Icon from '@hugeicons/core-free-icons/Building02Icon'
import Bus01Icon from '@hugeicons/core-free-icons/Bus01Icon'
import Car01Icon from '@hugeicons/core-free-icons/Car01Icon'
import CargoShipIcon from '@hugeicons/core-free-icons/CargoShipIcon'
import CarrotIcon from '@hugeicons/core-free-icons/CarrotIcon'
import CharityIcon from '@hugeicons/core-free-icons/CharityIcon'
import Coins01Icon from '@hugeicons/core-free-icons/Coins01Icon'
import CraneIcon from '@hugeicons/core-free-icons/CraneIcon'
import Doctor01Icon from '@hugeicons/core-free-icons/Doctor01Icon'
import DropletIcon from '@hugeicons/core-free-icons/DropletIcon'
import Dumbbell01Icon from '@hugeicons/core-free-icons/Dumbbell01Icon'
import EarthIcon from '@hugeicons/core-free-icons/EarthIcon'
import EggsIcon from '@hugeicons/core-free-icons/EggsIcon'
import EnergyIcon from '@hugeicons/core-free-icons/EnergyIcon'
import FishIcon from '@hugeicons/core-free-icons/FishIcon'
import FlashIcon from '@hugeicons/core-free-icons/FlashIcon'
import GlassWaterIcon from '@hugeicons/core-free-icons/GlassWaterIcon'
import HandshakeIcon from '@hugeicons/core-free-icons/HandshakeIcon'
import Home01Icon from '@hugeicons/core-free-icons/Home01Icon'
import Hospital01Icon from '@hugeicons/core-free-icons/Hospital01Icon'
import Hotel01Icon from '@hugeicons/core-free-icons/Hotel01Icon'
import InjectionIcon from '@hugeicons/core-free-icons/InjectionIcon'
import Invoice01Icon from '@hugeicons/core-free-icons/Invoice01Icon'
import LakeIcon from '@hugeicons/core-free-icons/LakeIcon'
import Leaf01Icon from '@hugeicons/core-free-icons/Leaf01Icon'
import LibraryIcon from '@hugeicons/core-free-icons/LibraryIcon'
import Luggage01Icon from '@hugeicons/core-free-icons/Luggage01Icon'
import MapsLocation01Icon from '@hugeicons/core-free-icons/MapsLocation01Icon'
import MapsSquare01Icon from '@hugeicons/core-free-icons/MapsSquare01Icon'
import Medicine01Icon from '@hugeicons/core-free-icons/Medicine01Icon'
import Money01Icon from '@hugeicons/core-free-icons/Money01Icon'
import Mortarboard01Icon from '@hugeicons/core-free-icons/Mortarboard01Icon'
import Mosque01Icon from '@hugeicons/core-free-icons/Mosque01Icon'
import Motorbike01Icon from '@hugeicons/core-free-icons/Motorbike01Icon'
import OilBarrelIcon from '@hugeicons/core-free-icons/OilBarrelIcon'
import PencilRulerIcon from '@hugeicons/core-free-icons/PencilRulerIcon'
import RealEstate01Icon from '@hugeicons/core-free-icons/RealEstate01Icon'
import Restaurant01Icon from '@hugeicons/core-free-icons/Restaurant01Icon'
import School01Icon from '@hugeicons/core-free-icons/School01Icon'
import StethoscopeIcon from '@hugeicons/core-free-icons/StethoscopeIcon'
import Store01Icon from '@hugeicons/core-free-icons/Store01Icon'
import StudentsIcon from '@hugeicons/core-free-icons/StudentsIcon'
import TeacherIcon from '@hugeicons/core-free-icons/TeacherIcon'
import UserGroupIcon from '@hugeicons/core-free-icons/UserGroupIcon'
import WaterEnergyIcon from '@hugeicons/core-free-icons/WaterEnergyIcon'
import WheatIcon from '@hugeicons/core-free-icons/WheatIcon'
import type { IconData } from '@/components/ui/icon'

/**
 * Keyed on `slug`, not on `number` — see the note on [[GOAL_GLYPHS]]. The
 * council renumbered six goals in the 1 September review, and a rail keyed on
 * position would have drawn the water goal's droplets against the transport
 * goal's motorcycles.
 */
const STAT_GLYPHS: Record<string, Record<string, IconData>> = {
  'energy-security': {
    'per day average household consumption': EnergyIcon,
    'litres of diesel per year': OilBarrelIcon,
    // Notes, coins, a bill: three money glyphs in one rail, so they are read
    // apart by form. The last is the household's own bill, which is what makes
    // the invoice the right one of the three.
    'MVR to buy diesel per year': Money01Icon,
    'MVR subsidy per year': Coins01Icon,
    'per year for each household': Invoice01Icon,
  },
  'water-security': {
    residents: UserGroupIcon,
    'of water per person per day': DropletIcon,
    'of potable water per day': GlassWaterIcon,
    'to produce a cbm of desalinated water': WaterEnergyIcon,
    'needed per day to produce water': FlashIcon,
  },
  'food-security': {
    // The total is the one row that is not a food category, and its glyph says
    // so — the bill arrives by sea, which is the whole point of the goal.
    'national food imports in 2025': CargoShipIcon,
    'meat, seafood and fish': FishIcon,
    'vegetables and root crops': CarrotIcon,
    'fruits, nuts and seeds': Apple01Icon,
    staples: WheatIcon,
    eggs: EggsIcon,
  },
  'future-ready-transport': {
    'motorcycles — 81% of households own one': Motorbike01Icon,
    'cars — 54% of households own one': Car01Icon,
    '05 for 50 passengers and 08 for 30 passengers': Bus01Icon,
    'passengers use buses daily': UserGroupIcon,
  },
  'connect-the-south': {
    residents: UserGroupIcon,
    '04 in Huvadhoo, 01 in Fuvahmulah': AirportIcon,
    'inhabited islands in four atolls': MapsLocation01Icon,
    'with 2,865 beds': Hotel01Icon,
    'with 978 beds': Home01Icon,
  },
  'diverse-quality-housing': {
    'existing houses': Home01Icon,
    'flats and row houses': ApartmentIcon,
    'land plots released for housing': RealEstate01Icon,
    'housing units under construction': CraneIcon,
    'planned housing units': PencilRulerIcon,
  },
  'connect-community-and-culture': {
    mosques: Mosque01Icon,
    'gyms (08) and indoor sports halls (06)': Dumbbell01Icon,
    'library and art gallery': LibraryIcon,
    'retail and wholesale shops': Store01Icon,
    'cafés and restaurants': Restaurant01Icon,
  },
  'health-and-well-being': {
    'operational health facilities': Hospital01Icon,
    'specialist doctors': Doctor01Icon,
    'medical officers': StethoscopeIcon,
    nurses: InjectionIcon,
    'registered pharmacies': Medicine01Icon,
  },
  'education-excellence': {
    schools: School01Icon,
    'school students': StudentsIcon,
    teachers: TeacherIcon,
    'universities and colleges': Mortarboard01Icon,
  },
  'inclusive-prosperity': {
    'persons living below poverty': CharityIcon,
    'persons with special needs': AccessibilityIcon,
    'registered companies': Building02Icon,
    'registered sole proprietorships': Briefcase01Icon,
    partnerships: HandshakeIcon,
  },
  'wildlife-and-wellness-tourism': {
    // A double bed for the resorts, a single for the guesthouses — the two
    // rows count the same noun, and the figures alone do not separate them.
    'beds in 03 registered resorts in Addu': BedDoubleIcon,
    'beds in 20 guesthouses and 01 hotel': BedSingle01Icon,
    'tourist arrivals to Addu in 2025': AirplaneLanding01Icon,
    'tourists to Huvadhoo and Fuvahmulah in 2025': Luggage01Icon,
    'arrivals from Gan International Airport': AirportIcon,
  },
  'environment-protection': {
    'protected areas': Leaf01Icon,
    'UNESCO biosphere reserve': EarthIcon,
    'hectares of protected areas': MapsSquare01Icon,
    'hectares of beach area': BeachIcon,
    'wetlands, covering 81.7 hectares': LakeIcon,
  },
}

/**
 * The glyph for one figure, or `undefined` if the label has no entry — the rail
 * renders the figure without a glyph rather than breaking.
 */
export function statGlyph(goalSlug: string, label: string): IconData | undefined {
  return STAT_GLYPHS[goalSlug]?.[label]
}
