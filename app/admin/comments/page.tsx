import Link from 'next/link'
import { AdminShell } from '@/components/admin/admin-shell'
import { requireCouncilViewer } from '@/lib/admin/session'
import { COMMENTS_PER_PAGE, OVERALL_SCOPE, describeAction, getComments } from '@/lib/admin/results'
import { OVERALL_ID, OVERALL_LABEL } from '@/lib/feedback-scope'
import { REACTION_META } from '@/lib/reactions'
import { GOALS, fmt } from '@/lib/plan'

export const metadata = { title: 'Comments' }

export const dynamic = 'force-dynamic'

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ goal?: string | string[]; page?: string | string[] }>
}) {
  const viewer = await requireCouncilViewer()
  const params = await searchParams

  const requested = one(params.goal)
  const goal = requested ? GOALS.find((g) => g.slug === requested) : undefined
  // A real goal wins over the reserved word, and anything else is treated as no
  // filter rather than as an error page.
  const onThePlan = !goal && requested === OVERALL_SCOPE
  const activeSlug = goal?.slug ?? (onThePlan ? OVERALL_SCOPE : undefined)

  const page = Math.max(0, Number.parseInt(one(params.page) ?? '0', 10) || 0)
  const { rows, total } = await getComments({ page, scope: activeSlug })

  const lastPage = Math.max(0, Math.ceil(total / COMMENTS_PER_PAGE) - 1)
  const from = total === 0 ? 0 : page * COMMENTS_PER_PAGE + 1
  const to = Math.min(total, (page + 1) * COMMENTS_PER_PAGE)

  const link = (next: { goal?: string; page?: number }) => {
    const q = new URLSearchParams()
    const slug = 'goal' in next ? next.goal : activeSlug
    if (slug) q.set('goal', slug)
    if (next.page) q.set('page', String(next.page))
    const query = q.toString()
    return query ? `/admin/comments?${query}` : '/admin/comments'
  }

  return (
    <AdminShell viewer={viewer} current="/admin/comments">
      <p className="eyebrow text-plum">Comments</p>
      <h1 className="mt-2 font-heading text-display-3 text-navy">
        {goal
          ? `What residents wrote on Goal ${goal.number}`
          : onThePlan
            ? 'What residents wrote about the plan as a whole'
            : 'What residents wrote'}
      </h1>
      <p className="mt-3 text-body text-slate">
        {total === 0
          ? 'No comments yet.'
          : `${fmt(from)}–${fmt(to)} of ${fmt(total)}, newest first.`}
      </p>

      {/* Filter. Plain links rather than a control, so a filtered view can be
          bookmarked and sent to a colleague. */}
      <nav aria-label="Filter comments" className="mt-6 flex flex-wrap gap-1.5">
        <Link
          href={link({ goal: undefined })}
          aria-current={activeSlug ? undefined : 'page'}
          className={`rounded-full px-3.5 py-1.5 text-small font-semibold transition-colors ${
            activeSlug ? 'bg-white text-stone hover:text-navy' : 'bg-navy text-white'
          }`}
        >
          Everything
        </Link>
        {/* Its own chip, ahead of the twelve. What a resident says about the
            plan itself answers a different question from what they say about
            action 7.3, and reading the two mixed together buries it. */}
        <Link
          href={link({ goal: OVERALL_SCOPE })}
          aria-current={onThePlan ? 'page' : undefined}
          className={`rounded-full px-3.5 py-1.5 text-small font-semibold transition-colors ${
            onThePlan ? 'bg-navy text-white' : 'bg-white text-stone hover:text-navy'
          }`}
        >
          {OVERALL_LABEL}
        </Link>
        {GOALS.map((g) => {
          const active = g.slug === activeSlug
          return (
            <Link
              key={g.slug}
              href={link({ goal: g.slug })}
              aria-current={active ? 'page' : undefined}
              // Visibly a numbered chip; a screen reader would otherwise hear
              // twelve links called "1" through "12" with nothing to tell them
              // apart. The title serves the same purpose for a pointer.
              aria-label={`Goal ${g.number}: ${g.title}`}
              title={`Goal ${g.number}: ${g.title}`}
              className={`rounded-full px-3.5 py-1.5 text-small font-semibold transition-colors ${
                active ? 'text-white' : 'bg-white text-stone hover:text-navy'
              }`}
              style={active ? { background: g.textColor } : undefined}
            >
              {g.number}
            </Link>
          )
        })}
      </nav>

      <ul className="mt-7 space-y-3">
        {rows.map((row) => {
          const place = describeAction(row.actionId)
          const meta = row.reaction ? REACTION_META[row.reaction] : null
          return (
            <li key={row.id} className="rounded-2xl bg-white p-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {place ? (
                  <Link
                    href={`/goals/${place.goal.slug}`}
                    className="text-small font-bold hover:underline"
                    style={{ color: place.goal.textColor }}
                  >
                    Goal {place.goal.number} · {place.goal.title}
                  </Link>
                ) : row.actionId === OVERALL_ID ? (
                  // Not an action, and not a fault either. Named plainly, or it
                  // would fall through to the warning below and read as damage.
                  <span className="text-small font-bold text-navy">{OVERALL_LABEL}</span>
                ) : (
                  // An id the plan no longer has. Kept visible rather than
                  // hidden: it is a signal that lib/plan.ts was renumbered.
                  <span className="text-small font-bold text-mist">
                    Unknown action ({row.actionId})
                  </span>
                )}
                {meta ? (
                  <span
                    className="rounded-full px-2 py-0.5 text-micro font-bold tracking-wide"
                    style={{
                      background: `color-mix(in oklab, ${meta.color} 14%, white)`,
                      color: meta.color,
                    }}
                  >
                    {meta.short}
                  </span>
                ) : null}
                <span className="ml-auto text-small text-mist tabular-nums">
                  {new Date(row.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>

              {place ? (
                <p className="mt-2 text-small text-stone">
                  {place.strategy.number} {place.strategy.title} — {place.text}
                </p>
              ) : null}

              {/* Residents' own words. `whitespace-pre-line` keeps the line
                  breaks they typed; React escapes the content. */}
              <p className="mt-3 border-l-2 border-hairline pl-4 text-body whitespace-pre-line text-ink">
                {row.comment}
              </p>
            </li>
          )
        })}
      </ul>

      {total > COMMENTS_PER_PAGE ? (
        <nav aria-label="Pages" className="mt-8 flex items-center justify-between gap-4">
          {page > 0 ? (
            <Link
              href={link({ page: page - 1 })}
              className="rounded-full border border-hairline bg-white px-4 py-2.5 text-small font-semibold text-navy hover:border-navy"
            >
              ← Newer
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
              className="rounded-full border border-hairline bg-white px-4 py-2.5 text-small font-semibold text-navy hover:border-navy"
            >
              Older →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </AdminShell>
  )
}
