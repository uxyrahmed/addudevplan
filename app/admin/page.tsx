import Link from 'next/link'
import Download01Icon from '@hugeicons/core-free-icons/Download01Icon'
import { Icon } from '@/components/ui/icon'
import { AdminShell } from '@/components/admin/admin-shell'
import { ReactionBar } from '@/components/admin/reaction-bar'
import { requireCouncilViewer } from '@/lib/admin/session'
import { OVERALL_SCOPE, getOverview } from '@/lib/admin/results'
import { OVERALL_LABEL } from '@/lib/feedback-scope'
import { REACTION_META, REACTION_VALUES } from '@/lib/reactions'
import { fmt } from '@/lib/plan'

export const metadata = { title: 'Overview' }

/**
 * Results are read at request time, never cached: a council member refreshing
 * this page is checking whether anything new has come in.
 */
export const dynamic = 'force-dynamic'

/** Absent only before the first submission, where the tile says so instead. */
function when(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-2xl bg-white p-5">
      <p className="text-small text-stone">{label}</p>
      <p className="mt-1.5 font-heading text-display-3 text-navy tabular-nums">{value}</p>
      {note ? <p className="mt-1 text-small text-mist">{note}</p> : null}
    </div>
  )
}

export default async function AdminOverviewPage() {
  const viewer = await requireCouncilViewer()
  const overview = await getOverview()

  const reacted = overview.support + overview.unsure + overview.concern

  return (
    <AdminShell viewer={viewer} current="/admin">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-plum">Overview</p>
          <h1 className="mt-2 font-heading text-display-3 text-navy">What residents have said</h1>
        </div>
        <a
          href="/api/admin/export?format=csv"
          className="inline-flex items-center gap-2 rounded-full border border-hairline bg-white px-4 py-2.5 text-small font-semibold text-navy transition-colors hover:border-navy"
        >
          <Icon icon={Download01Icon} size={16} />
          Download CSV
        </a>
      </div>

      {overview.submissions === 0 ? (
        <p className="mt-8 rounded-2xl bg-white p-6 text-body text-slate">
          No submissions yet. Responses appear here as soon as residents send them.
        </p>
      ) : null}

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* "Last: nothing yet" read as a broken template. The empty case gets
            its own words, and "Last:" — a label with no noun — gets a verb. */}
        <Stat
          label="Submissions"
          value={fmt(overview.submissions)}
          note={
            overview.latest ? `Most recent ${when(overview.latest)}` : 'None received yet'
          }
        />
        <Stat
          label="Responses"
          value={fmt(overview.responses)}
          note="Reactions and comments together"
        />
        <Stat
          label="Written comments"
          value={fmt(overview.comments)}
          note="Responses that carry written text"
        />
        <Stat
          label="Actions answered"
          value={`${fmt(overview.answeredActions)} / ${fmt(overview.totalActions)}`}
          note="Actions with at least one response"
        />
      </div>

      {reacted > 0 ? (
        <section className="mt-10 rounded-2xl bg-white p-6">
          <h2 className="font-heading text-title text-ink">Overall reaction</h2>
          <p className="mt-1.5 text-small text-stone">
            Across {fmt(reacted)} {reacted === 1 ? 'reaction' : 'reactions'}. Comments without a
            reaction are not counted here.
          </p>
          <div className="mt-5">
            <ReactionBar
              support={overview.support}
              unsure={overview.unsure}
              concern={overview.concern}
            />
          </div>
          <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            {REACTION_VALUES.map((key) => (
              <div key={key} className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: REACTION_META[key].color }}
                />
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
        </section>
      ) : null}

      {/* Its own card, above the twelve. These answer the plan rather than any
          action in it, so they sit in no goal's row and would otherwise be
          reachable only by scrolling the whole comment list looking for them. */}
      {overview.overallComments > 0 ? (
        <section className="mt-10 rounded-2xl bg-white p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="font-heading text-title text-ink">{OVERALL_LABEL}</h2>
            <span className="text-small text-stone tabular-nums">
              {fmt(overview.overallComments)}{' '}
              {overview.overallComments === 1 ? 'comment' : 'comments'}
            </span>
          </div>
          <p className="mt-1.5 text-small text-stone">
            Written about the plan itself rather than about one of its actions. Counted in the
            totals above, and in no goal below.
          </p>
          <Link
            href={`/admin/comments?goal=${OVERALL_SCOPE}`}
            className="mt-3 inline-block text-small font-semibold text-navy hover:underline"
          >
            Read them
          </Link>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="font-heading text-title text-ink">By goal</h2>
        <ul className="mt-4 space-y-2.5">
          {overview.byGoal.map((row) => {
            const rowReacted = row.support + row.unsure + row.concern
            return (
              <li key={row.goal.number} className="rounded-2xl bg-white p-5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span
                    className="font-heading text-small tabular-nums"
                    style={{ color: row.goal.textColor }}
                  >
                    Goal {row.goal.number}
                  </span>
                  <h3 className="font-heading text-body text-ink">{row.goal.title}</h3>
                  <span className="ml-auto text-small text-stone tabular-nums">
                    {fmt(row.responses)} {row.responses === 1 ? 'response' : 'responses'}
                    <span className="text-mist">
                      {' · '}
                      {row.answeredActions}/{row.totalActions} actions
                    </span>
                  </span>
                </div>

                <div className="mt-3.5">
                  <ReactionBar
                    support={row.support}
                    unsure={row.unsure}
                    concern={row.concern}
                    thin
                  />
                </div>

                <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1 text-small text-stone tabular-nums">
                  {rowReacted > 0 ? (
                    REACTION_VALUES.map((key) => (
                      <span key={key}>
                        <span style={{ color: REACTION_META[key].color }}>●</span>{' '}
                        {REACTION_META[key].short} {fmt(row[key])}
                      </span>
                    ))
                  ) : (
                    <span className="text-mist">No reactions yet</span>
                  )}
                  {row.comments > 0 ? (
                    <Link
                      href={`/admin/comments?goal=${row.goal.slug}`}
                      className="font-semibold text-navy hover:underline"
                    >
                      {fmt(row.comments)} {row.comments === 1 ? 'comment' : 'comments'}
                    </Link>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </AdminShell>
  )
}
