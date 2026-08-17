import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { OVERALL_ID } from '@/lib/feedback-scope'
import { GOALS, type Goal, type Strategy } from '@/lib/plan'
import type { WireReaction } from '@/lib/reactions'

export type Tally = {
  actionId: string
  support: number
  unsure: number
  concern: number
  comments: number
  responses: number
}

const EMPTY: Omit<Tally, 'actionId'> = {
  support: 0,
  unsure: 0,
  concern: 0,
  comments: 0,
  responses: 0,
}

/**
 * Where each action sits in the plan, so a bare `action_id` from the database can
 * be shown as something a reader recognises.
 *
 * Built from lib/plan.ts, which is the only place that knows the wording.
 */
const PLACE = new Map<string, { goal: Goal; strategy: Strategy; text: string }>(
  GOALS.flatMap((goal) =>
    goal.strategies.flatMap((strategy) =>
      strategy.actions.map((action) => [action.id, { goal, strategy, text: action.text }] as const),
    ),
  ),
)

export function describeAction(actionId: string) {
  return PLACE.get(actionId) ?? null
}

/**
 * The `?goal=` value that means "what was said about the plan itself".
 *
 * A reserved word beside the twelve slugs rather than a second parameter, so a
 * filtered view is still one bookmarkable link. It cannot shadow a goal — no
 * goal is called this — and the page resolves a real slug first regardless.
 */
export const OVERALL_SCOPE = 'plan'

export type GoalRollup = {
  goal: Goal
  support: number
  unsure: number
  concern: number
  comments: number
  responses: number
  /** Actions in this goal that at least one resident answered. */
  answeredActions: number
  totalActions: number
}

export type Overview = {
  submissions: number
  responses: number
  comments: number
  support: number
  unsure: number
  concern: number
  answeredActions: number
  totalActions: number
  latest: string | null
  byGoal: GoalRollup[]
  byAction: Map<string, Tally>
  /**
   * What came in about the plan rather than about an action. Counted in the
   * totals above — it is feedback like any other — but kept out of `byGoal` and
   * `answeredActions`, which are about the twelve goals and the actions in
   * them.
   */
  overallComments: number
}

/**
 * Everything the overview screen needs, in two queries.
 *
 * The tallies come from a grouped view rather than raw rows: one row per action
 * is a few hundred at most however many residents respond, where the responses
 * themselves grow without limit.
 */
export async function getOverview(): Promise<Overview> {
  const supabase = await createClient()

  const [tallyResult, submissionResult] = await Promise.all([
    supabase.from('response_tallies').select('action_id, support, unsure, concern, comments, responses'),
    supabase
      .from('submissions')
      .select('created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(1),
  ])

  if (tallyResult.error) throw new Error(`Could not read tallies: ${tallyResult.error.message}`)
  if (submissionResult.error) {
    throw new Error(`Could not count submissions: ${submissionResult.error.message}`)
  }

  const byAction = new Map<string, Tally>()
  for (const row of tallyResult.data ?? []) {
    byAction.set(row.action_id, {
      actionId: row.action_id,
      support: row.support ?? 0,
      unsure: row.unsure ?? 0,
      concern: row.concern ?? 0,
      comments: row.comments ?? 0,
      responses: row.responses ?? 0,
    })
  }

  const byGoal: GoalRollup[] = GOALS.map((goal) => {
    const actions = goal.strategies.flatMap((s) => s.actions)
    const rollup: GoalRollup = {
      goal,
      ...EMPTY,
      answeredActions: 0,
      totalActions: actions.length,
    }
    for (const action of actions) {
      const tally = byAction.get(action.id)
      if (!tally) continue
      rollup.support += tally.support
      rollup.unsure += tally.unsure
      rollup.concern += tally.concern
      rollup.comments += tally.comments
      rollup.responses += tally.responses
      rollup.answeredActions += 1
    }
    return rollup
  })

  const totals = byGoal.reduce(
    (acc, g) => ({
      responses: acc.responses + g.responses,
      comments: acc.comments + g.comments,
      support: acc.support + g.support,
      unsure: acc.unsure + g.unsure,
      concern: acc.concern + g.concern,
      answeredActions: acc.answeredActions + g.answeredActions,
      totalActions: acc.totalActions + g.totalActions,
    }),
    { responses: 0, comments: 0, support: 0, unsure: 0, concern: 0, answeredActions: 0, totalActions: 0 },
  )

  // Added after the goal rollup rather than inside it. These are responses and
  // they are written comments, so the two headline figures have to include them
  // or the council is told it received less than it did — but they belong to no
  // goal and to no action, so nothing else moves.
  const overallTally = byAction.get(OVERALL_ID)
  const overallComments = overallTally?.comments ?? 0

  return {
    submissions: submissionResult.count ?? 0,
    latest: submissionResult.data?.[0]?.created_at ?? null,
    byGoal,
    byAction,
    overallComments,
    ...totals,
    responses: totals.responses + (overallTally?.responses ?? 0),
    comments: totals.comments + overallComments,
  }
}

export type CommentRow = {
  id: number
  actionId: string
  reaction: WireReaction | null
  comment: string
  createdAt: string
}

export const COMMENTS_PER_PAGE = 50

/**
 * What residents actually wrote, newest first.
 *
 * Paged rather than fetched whole: this is the one table that grows with every
 * response, and a consultation that goes well would otherwise render thousands
 * of rows into a single page.
 *
 * `scope` narrows it: a goal's slug, or `'plan'` for what was said about the
 * plan as a whole. Unfiltered means everything, both kinds together.
 */
export async function getComments({
  page = 0,
  scope,
}: { page?: number; scope?: string } = {}): Promise<{ rows: CommentRow[]; total: number }> {
  const supabase = await createClient()

  let query = supabase
    .from('responses')
    .select('id, action_id, reaction, comment, created_at', { count: 'exact' })
    .not('comment', 'is', null)

  if (scope === OVERALL_SCOPE) {
    query = query.eq('action_id', OVERALL_ID)
  } else if (scope) {
    // Filtering by goal means filtering by that goal's action ids, since the
    // goal itself exists only in the repo.
    const goal = GOALS.find((g) => g.slug === scope)
    const ids = goal?.strategies.flatMap((s) => s.actions.map((a) => a.id)) ?? []
    // An unknown slug must return nothing rather than everything.
    query = query.in('action_id', ids.length ? ids : ['__none__'])
  }

  const from = page * COMMENTS_PER_PAGE
  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, from + COMMENTS_PER_PAGE - 1)

  if (error) throw new Error(`Could not read comments: ${error.message}`)

  return {
    rows: (data ?? []).map((row) => ({
      id: row.id,
      actionId: row.action_id,
      reaction: row.reaction,
      comment: row.comment as string,
      createdAt: row.created_at,
    })),
    total: count ?? 0,
  }
}
