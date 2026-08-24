/**
 * The shape a translation of the plan takes.
 *
 * Every field is optional, and that is the whole design. `lib/plan.ts` is the
 * source: it holds the structure, the ids, the colours and the figures,
 * transcribed from the council's English draft. A translation is an overlay of
 * *strings only*, keyed by the ids that already exist, and anything it does not
 * carry falls through to the English underneath.
 *
 * Two things follow from that, both wanted:
 *
 * - The plan can be translated a goal at a time. Goal 1 can be in Dhivehi
 *   while goals 2 to 12 are still in English, and the site does not break or
 *   need a placeholder. A consultation that had to wait for all 230 actions to
 *   be translated before publishing any of them would publish none of them.
 *
 * - A translation cannot change what the plan *says*. It has no ids, no
 *   numbers, no colours and no ordering — it cannot add a target, drop an
 *   action, or renumber a strategy. The feedback layer keys on those ids, so a
 *   translation that could touch them would be able to file a resident's answer
 *   against the wrong action.
 *
 * Keys are the stable ids wherever `lib/plan.ts` has one — goal slugs, target
 * ids, strategy ids, action ids, pillar ids. Where it does not (a `Stat` has no
 * id), the key is the English string being replaced. That is deliberate too:
 * if the English is revised, the translation stops matching and the reader gets
 * the new English rather than a translation of copy that no longer exists.
 */

export type StatTranslation = {
  /**
   * The figure itself, because some of them carry a word: "18.7 million" and
   * "35,351 MVR" both need the unit translated while the digits stay put.
   */
  value?: string
  label?: string
}

export type StrategyTranslation = {
  title?: string
  /** Keyed by action id. */
  actions?: Record<string, string>
}

export type GoalTranslation = {
  title?: string
  tagline?: string
  summary?: string
  openNote?: string
  /** Keyed by the English `label` of the stat it replaces. */
  stats?: Record<string, StatTranslation>
  /** Keyed by target id. The value is the target's `text`; `label` is a number. */
  targets?: Record<string, string>
  /** Keyed by strategy id. */
  strategies?: Record<string, StrategyTranslation>
}

export type PlanTranslation = {
  plan?: { title?: string; author?: string; date?: string; callout?: string }
  vision?: { headline?: string; figure?: string; name?: string; kicker?: string }
  turningPoint?: {
    title?: string
    /**
     * All four, or none. Positional rather than keyed, because these are the
     * source's own sentences in the source's own order — a partial overlay
     * would interleave two languages inside one passage.
     */
    paragraphs?: string[]
  }
  /** Keyed by the English label. Figures are never translated. */
  headlineFacts?: Record<string, string>
  /** Keyed by the English island name. */
  islands?: Record<string, string>
  /** Keyed by the year label, which is the timeline's own key. */
  timeline?: Record<string, string>
  migration?: {
    title?: string
    subtitle?: string
    /** Keyed by the English series name. */
    seriesNames?: Record<string, string>
  }
  pillarsIntro?: { title?: string; body?: string }
  /** Keyed by pillar id. */
  pillars?: Record<string, { name?: string; phrase?: string }>
  initiativesIntro?: { title?: string; body?: string }
  /** Keyed by the initiative's `number`. */
  initiatives?: Record<string, { title?: string; text?: string }>
  /** Keyed by goal slug. */
  goals?: Record<string, GoalTranslation>
}
