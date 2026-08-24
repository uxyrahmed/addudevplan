import Link from 'next/link'
import Download01Icon from '@hugeicons/core-free-icons/Download01Icon'
import { Icon } from '@/components/ui/icon'
import { AdminShell } from '@/components/admin/admin-shell'
import { ReactionBar } from '@/components/admin/reaction-bar'
import { ReactionSwatch } from '@/components/admin/reaction-figures'
import { GoalTable } from '@/components/admin/goal-table'
import { requireCouncilViewer } from '@/lib/admin/session'
import { OVERALL_SCOPE, getOverview, isGoalSort, sortGoals } from '@/lib/admin/results'
import { OVERALL_LABEL } from '@/lib/feedback-scope'
import { REACTION_META, REACTION_VALUES } from '@/lib/reactions'
import { fmt } from '@/lib/plan'

export const metadata = { title: 'Overview' }

/**
 * Results are read at request time, never cached: a council member refreshing
 * this page is checking whether anything new has come in.
 */
export const dynamic = 'force-dynamic'

/** Absent only before the first submission, where the figure says so instead. */
function when(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * One headline figure, set a step below the page heading rather than level with
 * it — four figures at display size and nothing on the screen leads.
 *
 * The note is for a second figure the label cannot hold, never for a gloss on
 * the first: "Written comments" does not need telling that it counts comments.
 */
function Figure({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="bg-white px-5 py-4 sm:px-6 sm:py-5">
      <p className="text-small leading-none text-stone">{label}</p>
      <p className="mt-2 font-heading text-title leading-none text-navy tabular-nums">{value}</p>
      {note ? <p className="mt-2 text-small leading-snug text-mist">{note}</p> : null}
    </div>
  )
}

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function AdminOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string | string[] }>
}) {
  const viewer = await requireCouncilViewer()
  const [overview, params] = await Promise.all([getOverview(), searchParams])

  // Anything unrecognised falls back to plan order rather than erroring: a
  // mistyped link a colleague was sent should still open the page.
  const requested = one(params.sort)
  const sort = isGoalSort(requested) ? requested : 'plan'

  const reacted = overview.support + overview.unsure + overview.concern

  return (
    <AdminShell viewer={viewer} current="/admin">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <h1 className="font-heading text-display-3 text-navy">What residents have said</h1>
        <a
          href="/api/admin/export?format=csv"
          className="inline-flex items-center gap-2 rounded-full border border-hairline bg-white px-4 py-2.5 text-small font-semibold text-navy transition-colors hover:border-navy"
        >
          <Icon icon={Download01Icon} size={16} />
          Download CSV
        </a>
      </div>

      {/* One object: what came in, and how it landed. */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-hairline bg-white">
        {/* Rules drawn as gaps in a hairline ground. `divide-x`/`divide-y`
            reads the four as one flat sequence and rules the card's own edge at
            the two-column width; a gap can only ever fall between two cells. */}
        <div className="grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          <Figure
            label="Submissions"
            value={fmt(overview.submissions)}
            note={overview.latest ? `Most recent ${when(overview.latest)}` : 'None received yet'}
          />
          <Figure label="Responses" value={fmt(overview.responses)} note="Reactions and comments" />
          <Figure label="Written comments" value={fmt(overview.comments)} />
          <Figure
            label="Actions answered"
            value={fmt(overview.answeredActions)}
            note={`of ${fmt(overview.totalActions)}`}
          />
        </div>

        {reacted > 0 ? (
          <div className="border-t border-hairline p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 className="font-heading text-title text-ink">Overall reaction</h2>
              <p className="text-small text-stone tabular-nums">
                {fmt(reacted)} {reacted === 1 ? 'reaction' : 'reactions'}
              </p>
            </div>

            <div className="mt-4">
              <ReactionBar
                support={overview.support}
                unsure={overview.unsure}
                concern={overview.concern}
              />
            </div>

            <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
              {REACTION_VALUES.map((key) => (
                <div key={key} className="flex items-baseline gap-2">
                  <ReactionSwatch color={REACTION_META[key].color} />
                  <dt className="text-small text-stone">{REACTION_META[key].short}</dt>
                  <dd className="text-small font-bold text-ink tabular-nums">
                    {fmt(overview[key])}
                    <span className="ml-1.5 font-normal text-mist">
                      {Math.round((overview[key] / reacted) * 100)}%
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ) : (
          <div className="border-t border-hairline p-5 text-body text-slate sm:p-6">
            {overview.submissions === 0 ? 'Nothing received yet.' : 'No reactions yet.'}
          </div>
        )}
      </section>

      {/* Its own strip, above the twelve: these answer the plan rather than any
          action in it, so they sit in no goal's row below. */}
      {overview.overallComments > 0 ? (
        <section className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-hairline bg-white px-5 py-4">
          <h2 className="font-heading text-body text-ink">{OVERALL_LABEL}</h2>
          <p className="text-small text-stone tabular-nums">
            {fmt(overview.overallComments)}{' '}
            {overview.overallComments === 1 ? 'comment' : 'comments'}
          </p>
          <Link
            href={`/admin/comments?goal=${OVERALL_SCOPE}`}
            className="-my-2 ml-auto py-2 text-small font-semibold text-navy underline-offset-2 hover:underline"
          >
            Read them
          </Link>
        </section>
      ) : null}

      <GoalTable rows={sortGoals(overview.byGoal, sort)} byAction={overview.byAction} sort={sort} />
    </AdminShell>
  )
}
