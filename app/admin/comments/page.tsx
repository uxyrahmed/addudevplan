import Link from 'next/link'
import { AdminShell } from '@/components/admin/admin-shell'
import { CommentFilters } from '@/components/admin/comment-filters'
import { ReactionSwatch } from '@/components/admin/reaction-figures'
import { requireCouncilViewer } from '@/lib/admin/session'
import { ACTIONS_PER_PAGE, OVERALL_SCOPE, describeAction, getComments } from '@/lib/admin/results'
import { OVERALL_ID, OVERALL_LABEL } from '@/lib/feedback-scope'
import { REACTION_META, REACTION_VALUES, type WireReaction } from '@/lib/reactions'
import { GOALS, fmt } from '@/lib/plan'

export const metadata = { title: 'Comments' }

export const dynamic = 'force-dynamic'

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function isReaction(value: string | undefined): value is WireReaction {
  return REACTION_VALUES.includes(value as WireReaction)
}

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    goal?: string | string[]
    reaction?: string | string[]
    page?: string | string[]
  }>
}) {
  const viewer = await requireCouncilViewer()
  const params = await searchParams

  const requested = one(params.goal)
  const goal = requested ? GOALS.find((g) => g.slug === requested) : undefined
  // A real goal wins over the reserved word, and anything else is treated as no
  // filter rather than as an error page.
  const onThePlan = !goal && requested === OVERALL_SCOPE
  const activeSlug = goal?.slug ?? (onThePlan ? OVERALL_SCOPE : undefined)

  const requestedReaction = one(params.reaction)
  const reaction = isReaction(requestedReaction) ? requestedReaction : undefined

  const page = Math.max(0, Number.parseInt(one(params.page) ?? '0', 10) || 0)
  const { threads, total, totalActions } = await getComments({
    page,
    scope: activeSlug,
    reaction,
  })

  const lastPage = Math.max(0, Math.ceil(totalActions / ACTIONS_PER_PAGE) - 1)

  // Changing a filter always returns to the first page. Keeping the page number
  // would land a reader on "page 4 of 2" and an empty screen that looks like
  // the filter found nothing.
  const link = (next: { goal?: string; reaction?: WireReaction; page?: number }) => {
    const q = new URLSearchParams()
    const slug = 'goal' in next ? next.goal : activeSlug
    const react = 'reaction' in next ? next.reaction : reaction
    if (slug) q.set('goal', slug)
    if (react) q.set('reaction', react)
    if (next.page) q.set('page', String(next.page))
    const query = q.toString()
    return query ? `/admin/comments?${query}` : '/admin/comments'
  }

  return (
    <AdminShell viewer={viewer} current="/admin/comments">
      <h1 className="font-heading text-display-3 text-navy">
        {goal
          ? `What residents wrote on Goal ${goal.number}`
          : onThePlan
            ? 'What residents wrote about the plan as a whole'
            : 'What residents wrote'}
      </h1>
      <p className="mt-2 text-body text-slate">
        {total === 0
          ? 'Nothing here yet.'
          : `${fmt(total)} ${total === 1 ? 'comment' : 'comments'} on ${fmt(totalActions)} ${
              totalActions === 1 ? 'action' : 'actions'
            }, in the plan's order.`}
      </p>

      <div className="mt-6">
        <CommentFilters
          goal={activeSlug ?? ''}
          reaction={reaction ?? ''}
          goalGroups={[
            {
              label: '',
              options: [
                { value: '', label: 'Everything' },
                // Its own entry, ahead of the twelve: what a resident says
                // about the plan itself answers a different question from
                // what they say about action 7.3.
                { value: OVERALL_SCOPE, label: OVERALL_LABEL },
              ],
            },
            {
              label: 'Goals',
              options: GOALS.map((g) => ({ value: g.slug, label: `${g.number}. ${g.title}` })),
            },
          ]}
          reactionOptions={[
            { value: '', label: 'Any reaction' },
            ...REACTION_VALUES.map((key) => ({ value: key, label: REACTION_META[key].short })),
          ]}
        />
      </div>

      {/* One card per action, not per comment: the goal, the strategy and the
          action's wording are said once at the top of the thread rather than
          above every entry, and the space goes to what was written. */}
      <ul className="mt-7 space-y-3">
        {threads.map((thread) => {
          const place = describeAction(thread.actionId)
          const shown = thread.comments.length
          return (
            <li
              key={thread.actionId}
              className="overflow-hidden rounded-2xl border border-hairline bg-white"
            >
              <div className="border-b border-hairline bg-shell px-5 py-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  {place ? (
                    <Link
                      href={`/goals/${place.goal.slug}`}
                      // Padded past its own ink, so the line is a target a
                      // thumb can land on rather than 24 pixels of text.
                      className="-my-1.5 py-1.5 text-small font-bold underline-offset-2 hover:underline"
                      style={{ color: place.goal.textColor }}
                    >
                      Goal {place.goal.number} · {place.goal.title}
                    </Link>
                  ) : thread.actionId === OVERALL_ID ? (
                    // Not an action, and not a fault either. Named plainly, or
                    // it would fall through to the warning below and read as
                    // damage.
                    <span className="text-small font-bold text-navy">{OVERALL_LABEL}</span>
                  ) : (
                    // An id the plan no longer has. Kept visible rather than
                    // hidden: it is a signal that lib/plan.ts was renumbered.
                    <span className="text-small font-bold text-mist">
                      Unknown action ({thread.actionId})
                    </span>
                  )}
                  {place ? (
                    <span className="text-small text-stone">
                      {place.strategy.number} {place.strategy.title}
                    </span>
                  ) : null}

                  {/* Says how much of the thread this is whenever a page edge
                      or a reaction filter is holding the rest back. */}
                  <span className="ml-auto text-small text-stone tabular-nums">
                    {shown < thread.totalComments
                      ? `${fmt(shown)} of ${fmt(thread.totalComments)} comments`
                      : `${fmt(shown)} ${shown === 1 ? 'comment' : 'comments'}`}
                  </span>
                </div>

                {place ? (
                  <p className="mt-2 font-heading text-body leading-snug text-ink">{place.text}</p>
                ) : null}
              </div>

              <ol className="divide-y divide-hairline">
                {thread.comments.map((row) => {
                  const meta = row.reaction ? REACTION_META[row.reaction] : null
                  return (
                    <li key={row.id} className="px-5 py-4">
                      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-small">
                        {meta ? (
                          <>
                            <ReactionSwatch color={meta.color} />
                            <span className="font-semibold" style={{ color: meta.ink }}>
                              {meta.short}
                            </span>
                          </>
                        ) : (
                          <span className="text-mist">No reaction</span>
                        )}
                        <span className="ml-auto text-mist tabular-nums">
                          {new Date(row.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </p>

                      {/* Residents' own words. `whitespace-pre-line` keeps the
                          line breaks they typed; React escapes the content. */}
                      <p className="mt-1.5 text-body whitespace-pre-line text-ink">{row.comment}</p>
                    </li>
                  )
                })}
              </ol>
            </li>
          )
        })}
      </ul>

      {lastPage > 0 ? (
        <nav aria-label="Pages" className="mt-8 flex items-center justify-between gap-4">
          {page > 0 ? (
            <Link
              href={link({ page: page - 1 })}
              className="rounded-full border border-hairline bg-white px-4 py-2.5 text-small font-semibold text-navy transition-colors hover:border-navy"
            >
              ← Previous
            </Link>
          ) : (
            <span />
          )}
          <span className="text-small text-stone tabular-nums">
            Page {page + 1} of {lastPage + 1}
          </span>
          {page < lastPage ? (
            <Link
              href={link({ page: page + 1 })}
              className="rounded-full border border-hairline bg-white px-4 py-2.5 text-small font-semibold text-navy transition-colors hover:border-navy"
            >
              Next →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </AdminShell>
  )
}
