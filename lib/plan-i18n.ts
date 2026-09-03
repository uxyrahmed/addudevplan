import {
  GAN_ISLAND,
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
  type Goal,
  type Initiative,
  type Pillar,
  type Stat,
} from './plan'
import { dvPlan } from './plan-translations/dv'
import type { PlanTranslation } from './plan-translations/types'
import { LOCALES, LOCALE_META, type Locale } from './i18n/config'
import { isolateQuantities } from './i18n/bidi'

/**
 * One overlay per locale. English is empty by definition — `lib/plan.ts` *is*
 * the English plan, so there is nothing to overlay onto it.
 */
const TRANSLATIONS: Record<Locale, PlanTranslation> = {
  en: {},
  dv: dvPlan,
}

export type LocalizedPlan = {
  plan: { title: string; period: string; author: string; date: string; callout: string }
  vision: { headline: string; figure: string; name: string; kicker: string }
  turningPoint: { title: string; paragraphs: readonly string[] }
  headlineFacts: Stat[]
  islands: string[]
  gan: string
  timeline: { year: string; text: string }[]
  migration: {
    title: string
    subtitle: string
    years: readonly number[]
    series: readonly { name: string; color: string; values: readonly number[] }[]
  }
  pillarsIntro: { title: string; body: string }
  pillars: Pillar[]
  initiativesIntro: { title: string; body: string }
  initiatives: Initiative[]
  goals: Goal[]
}

/**
 * `translated ?? source`, then made safe to set in the reading direction it is
 * going into.
 *
 * Every piece of prose in the plan goes through here, which is why the
 * bidirectional pass lives here too rather than at each of the thirty-odd
 * places a string is assembled below. Ids, slugs, colours and numbers do not go
 * through it — they are carried across by the object spreads — and that
 * separation is load-bearing: a blind pass over the whole structure would find
 * the digits inside `#2FB2B5` and wrap a colour in invisible characters.
 */
type Pick = (translated: string | undefined, source: string) => string

const plainPick: Pick = (translated, source) => translated ?? source

const rtlPick: Pick = (translated, source) => isolateQuantities(translated ?? source)

/**
 * One goal, with whatever the overlay has for it.
 *
 * Ids, numbers, colours, the slug and the ordering all come from the source and
 * only from the source. A translation supplies text and nothing else, so a
 * response filed against `g1-s1-a1` means the same action in every language.
 */
function localizeGoalWith(goal: Goal, overlay: PlanTranslation, pick: Pick): Goal {
  const t = overlay.goals?.[goal.slug]

  return {
    ...goal,
    title: pick(t?.title, goal.title),
    tagline: pick(t?.tagline, goal.tagline),
    summary: pick(t?.summary, goal.summary),
    openNote: goal.openNote === undefined ? undefined : pick(t?.openNote, goal.openNote),
    // Mapped whether or not there is a translation for this goal: an
    // untranslated "3,000 cbm" still has to be set the right way round on a
    // right-to-left page.
    stats: goal.stats.map((stat) => {
      const s = t?.stats?.[stat.label]
      return { value: pick(s?.value, stat.value), label: pick(s?.label, stat.label) }
    }),
    targets: goal.targets.map((target) => ({
      ...target,
      text: pick(t?.targets?.[target.id], target.text),
    })),
    strategies: goal.strategies.map((strategy) => {
      const s = t?.strategies?.[strategy.id]
      return {
        ...strategy,
        title: pick(s?.title, strategy.title),
        actions: strategy.actions.map((action) => ({
          ...action,
          text: pick(s?.actions?.[action.id], action.text),
        })),
      }
    }),
  }
}

function build(locale: Locale): LocalizedPlan {
  const overlay = TRANSLATIONS[locale]
  const pick: Pick = LOCALE_META[locale].dir === 'rtl' ? rtlPick : plainPick

  return {
    plan: {
      title: pick(overlay.plan?.title, PLAN.title),
      // Never translated — a span of years is written the same in both — but it
      // still goes through `pick`, because being written the same is not the
      // same as being *laid out* the same. The dash between the years is a
      // neutral, so on a right-to-left page the pair resolves backwards and the
      // plan announces itself as running 2031–2026. `rtlPick` isolates it.
      period: pick(undefined, PLAN.period),
      author: pick(overlay.plan?.author, PLAN.author),
      date: pick(overlay.plan?.date, PLAN.date),
      callout: pick(overlay.plan?.callout, PLAN.callout),
    },
    vision: {
      headline: pick(overlay.vision?.headline, VISION.headline),
      figure: pick(overlay.vision?.figure, VISION.figure),
      name: pick(overlay.vision?.name, VISION.name),
      kicker: pick(overlay.vision?.kicker, VISION.kicker),
    },
    turningPoint: {
      title: pick(overlay.turningPoint?.title, TURNING_POINT.title),
      // All four or none — see the note on `paragraphs` in the overlay type.
      paragraphs: (overlay.turningPoint?.paragraphs?.length === TURNING_POINT.paragraphs.length
        ? overlay.turningPoint.paragraphs
        : TURNING_POINT.paragraphs
      ).map((paragraph) => pick(undefined, paragraph)),
    },
    headlineFacts: HEADLINE_FACTS.map((fact) => ({
      value: fact.value,
      label: pick(overlay.headlineFacts?.[fact.label], fact.label),
    })),
    // The order is the geography and the atoll map reads its markers out of it
    // by index, so this maps in place rather than rebuilding the list.
    islands: LAND.islands.map((island) => pick(overlay.islands?.[island], island)),
    // Same overlay as the four, keyed the same way — Gan is an island name
    // like the others, it is just not one of the city's.
    gan: pick(overlay.islands?.[GAN_ISLAND], GAN_ISLAND),
    timeline: TIMELINE.map((event) => ({
      // Same as `period` above: "1620–1648" is a range, and a range needs
      // isolating even though it is identical in both languages. The overlay is
      // still keyed on the untouched `event.year`, so the lookup is unaffected.
      year: pick(undefined, event.year),
      text: pick(overlay.timeline?.[event.year], event.text),
    })),
    migration: {
      title: pick(overlay.migration?.title, MIGRATION_SERIES.title),
      subtitle: pick(overlay.migration?.subtitle, MIGRATION_SERIES.subtitle),
      years: MIGRATION_SERIES.years,
      series: MIGRATION_SERIES.series.map((s) => ({
        name: pick(overlay.migration?.seriesNames?.[s.name], s.name),
        color: s.color,
        values: s.values,
      })),
    },
    pillarsIntro: {
      title: pick(overlay.pillarsIntro?.title, PILLARS_INTRO.title),
      body: pick(overlay.pillarsIntro?.body, PILLARS_INTRO.body),
    },
    pillars: PILLARS.map((pillar) => ({
      ...pillar,
      name: pick(overlay.pillars?.[pillar.id]?.name, pillar.name),
      phrase: pick(overlay.pillars?.[pillar.id]?.phrase, pillar.phrase),
    })),
    initiativesIntro: {
      title: pick(overlay.initiativesIntro?.title, INITIATIVES_INTRO.title),
      body: pick(overlay.initiativesIntro?.body, INITIATIVES_INTRO.body),
    },
    initiatives: INITIATIVES.map((item) => ({
      ...item,
      title: pick(overlay.initiatives?.[item.number]?.title, item.title),
      text: pick(overlay.initiatives?.[item.number]?.text, item.text),
    })),
    goals: GOALS.map((goal) => localizeGoalWith(goal, overlay, pick)),
  }
}

/**
 * Built once per locale, at module load.
 *
 * The merge walks 12 goals, 55 targets and 230 actions. Doing that per render
 * would be work repeated on every page of the site for a result that cannot
 * change — both the source and the overlays are static modules.
 */
const CACHE: Record<Locale, LocalizedPlan> = Object.fromEntries(
  LOCALES.map((locale) => [locale, build(locale)]),
) as Record<Locale, LocalizedPlan>

export function localizePlan(locale: Locale): LocalizedPlan {
  return CACHE[locale]
}

export function localizedGoals(locale: Locale): Goal[] {
  return CACHE[locale].goals
}

export function getLocalizedGoal(slug: string, locale: Locale): Goal | undefined {
  return CACHE[locale].goals.find((goal) => goal.slug === slug)
}

/**
 * The goal either side of this one — and nothing at the ends.
 *
 * This used to wrap, so goal 1 offered goal 12 as its "previous" and goal 12
 * offered goal 1 as its "next". The plan is an ordered document, not a
 * carousel: the twelve goals run 1 to 12, and a control at the top of that list
 * pointing backwards to the bottom of it misstates the shape of the thing being
 * consulted on. Either end simply has one neighbour.
 */
export function localizedGoalNeighbours(
  slug: string,
  locale: Locale,
): { prev: Goal | null; next: Goal | null } | null {
  const goals = CACHE[locale].goals
  const i = goals.findIndex((goal) => goal.slug === slug)
  if (i === -1 || goals.length < 2) return null
  return {
    prev: i > 0 ? goals[i - 1]! : null,
    next: i < goals.length - 1 ? goals[i + 1]! : null,
  }
}
