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

/**
 * Actions per page, not comments per page.
 *
 * The unit of this screen is an action and everything said about it, so a page
 * is a run of actions — which also means a thread can never be cut in half by a
 * page edge. Twenty is chosen against the plan's own shape: goal 4 has the most
 * actions at twenty-four, so a goal is one or two pages.
 */
export const ACTIONS_PER_PAGE = 20

/**
 * Every id that can carry a comment, in the order the site presents them: the
 * plan itself, then goal 1's actions, then goal 2's, and so on.
 *
 * `PLACE` is built by walking GOALS in order and a Map keeps what it was given,
 * so its keys are already the plan's own sequence.
 */
const PLAN_ORDER: string[] = [OVERALL_ID, ...PLACE.keys()]

/** The ids in scope, still in plan order. An unknown slug matches nothing. */
function scopedIds(scope?: string): string[] {
  if (!scope) return PLAN_ORDER
  if (scope === OVERALL_SCOPE) return [OVERALL_ID]
  const goal = GOALS.find((g) => g.slug === scope)
  if (!goal) return []
  return goal.strategies.flatMap((s) => s.actions.map((a) => a.id))
}

/**
 * What residents wrote, in the plan's own order.
 *
 * Deliberately not newest first. The council reads this beside the document, so
 * the screen walks the document: action 1.1, then 1.2, then 1.3. Sorting by
 * arrival scattered one goal's replies through every page and made "what did
 * people say about this action" a search rather than a place.
 *
 * Paged over actions rather than over comments, in three bounded queries:
 *
 * 1. `response_tallies` — the same grouped view the overview counts from — says
 *    which actions carry comments at all. One row per action, a few hundred at
 *    most however many residents respond.
 * 2. That list, intersected with the scope and cut to this page, is at most
 *    twenty ids; the comments themselves are fetched for those alone.
 * 3. A count, for the total the heading reports.
 *
 * The raw `responses` table is never scanned whole — it is the one table that
 * grows without limit.
 *
 * `reaction` narrows which comments show, not which actions do. A comment can
 * be sent with no reaction at all, so the three never add up to the unfiltered
 * total; that is why "Any reaction" is its own choice rather than three
 * checkboxes. A thread whose comments are all held back by it is dropped.
 */
export async function getComments({
  page = 0,
  scope,
  reaction,
}: { page?: number; scope?: string; reaction?: WireReaction } = {}): Promise<{
  threads: CommentThread[]
  /** Comments matching the filters, across every page. */
  total: number
  /** Actions carrying at least one comment, across every page. */
  totalActions: number
}> {
  const supabase = await createClient()
  const ids = scopedIds(scope)
  if (ids.length === 0) return { threads: [], total: 0, totalActions: 0 }

  const { data: tallies, error: talliesError } = await supabase
    .from('response_tallies')
    .select('action_id, comments')
    .gt('comments', 0)

  if (talliesError) throw new Error(`Could not read comment counts: ${talliesError.message}`)

  const totals = new Map<string, number>(
    (tallies ?? []).map((row) => [row.action_id, row.comments ?? 0]),
  )

  // Which of those actions the filter actually leaves standing, and how many
  // comments survive it.
  //
  // Unfiltered, the tally view answers both without another query. A reaction
  // filter it cannot answer — it counts an action's comments, not its comments
  // with a given reaction — so that case reads the matching `action_id`s and
  // counts them here. One short column, only for the narrower of the two cases,
  // and never the comment text: the raw table is still not scanned whole.
  //
  // Getting this from the tallies regardless would have the heading claim "46
  // comments on 77 actions" when twenty-three of the seventy-seven carry a
  // concern, and page over the other fifty-four for nothing.
  let withComments: string[]
  let total: number

  if (reaction) {
    // The scope is asked for by name only when it is a goal — a dozen or two
    // ids. Unscoped it is every id in the plan, and naming two hundred and
    // thirty-one of them builds a URL worth avoiding, so it is filtered here.
    const scan = supabase
      .from('responses')
      .select('action_id')
      .not('comment', 'is', null)
      .eq('reaction', reaction)
    const { data: matches, error: scanError } = await (scope ? scan.in('action_id', ids) : scan)

    if (scanError) throw new Error(`Could not count comments: ${scanError.message}`)

    const inScope = new Set(ids)
    const matched = new Set<string>()
    total = 0
    for (const row of matches ?? []) {
      if (!inScope.has(row.action_id)) continue
      matched.add(row.action_id)
      total += 1
    }
    withComments = ids.filter((id) => matched.has(id))
  } else {
    withComments = ids.filter((id) => totals.has(id))
    total = withComments.reduce((n, id) => n + (totals.get(id) ?? 0), 0)
  }

  const pageIds = withComments.slice(page * ACTIONS_PER_PAGE, (page + 1) * ACTIONS_PER_PAGE)

  const reading = supabase
    .from('responses')
    .select('id, action_id, reaction, comment, created_at')
    .not('comment', 'is', null)
    .in('action_id', pageIds.length ? pageIds : ['__none__'])
    // Oldest first inside a thread, so it reads as the discussion it is.
    .order('created_at', { ascending: true })

  const { data, error } = await (reaction ? reading.eq('reaction', reaction) : reading)

  if (error) throw new Error(`Could not read comments: ${error.message}`)

  const byId = new Map<string, CommentRow[]>()
  for (const row of data ?? []) {
    const comment: CommentRow = {
      id: row.id,
      actionId: row.action_id,
      reaction: row.reaction,
      comment: row.comment as string,
      createdAt: row.created_at,
    }
    const existing = byId.get(comment.actionId)
    if (existing) existing.push(comment)
    else byId.set(comment.actionId, [comment])
  }

  const threads: CommentThread[] = pageIds
    .filter((id) => byId.has(id))
    .map((actionId) => {
      const comments = byId.get(actionId) ?? []
      return {
        actionId,
        comments,
        // Never below what is on screen. The view is a moment behind the rows
        // if a resident sends something between the two queries, and a thread
        // reading "5 of 4" would look like a bug rather than a race.
        totalComments: Math.max(totals.get(actionId) ?? 0, comments.length),
      }
    })

  return { threads, total, totalActions: withComments.length }
}

export type CommentThread = {
  actionId: string
  comments: CommentRow[]
  /**
   * How many comments that action has received in total, against the
   * `comments.length` shown here.
   *
   * The two differ only when a reaction filter is holding part of the thread
   * back — a page never splits one. Stating both is the difference between
   * "four people raised this" and "four of the nineteen who did", and a thread
   * quietly showing four of nineteen would be the screen hiding feedback the
   * council actually holds.
   */
  totalComments: number
}

/**
 * The orders the goal table can be read in.
 *
 * Plan order is the default because that is the document the council knows, but
 * it is the worst order for the question the screen is actually opened with —
 * "where is this going badly?" — which is a scan for outliers across twelve
 * rows. So the other three sort by the three things that make a goal worth
 * looking at first: unease, attention, and silence.
 *
 * `quiet` sorts on the share of a goal's actions that nobody answered rather
 * than on the raw count, or the goals with the most actions would always win.
 *
 * Every comparator falls back to plan order, so the twelve never shuffle
 * unpredictably between two goals that tie — which, early in a consultation
 * when most rows are zero, is most of them.
 */
export const GOAL_SORTS = {
  plan: { label: 'Plan order', of: () => 0 },
  concern: { label: 'Most concern', of: (g: GoalRollup) => g.concern },
  responses: { label: 'Most responses', of: (g: GoalRollup) => g.responses },
  quiet: {
    label: 'Least answered',
    of: (g: GoalRollup) =>
      g.totalActions === 0 ? 0 : 1 - g.answeredActions / g.totalActions,
  },
} as const

export type GoalSort = keyof typeof GOAL_SORTS

export function isGoalSort(value: string | undefined): value is GoalSort {
  return value !== undefined && value in GOAL_SORTS
}

/** A new array; the caller's rollup order is left alone. */
export function sortGoals(rows: GoalRollup[], sort: GoalSort): GoalRollup[] {
  if (sort === 'plan') return rows
  const of = GOAL_SORTS[sort].of
  return [...rows].sort((a, b) => of(b) - of(a) || a.goal.number - b.goal.number)
}
