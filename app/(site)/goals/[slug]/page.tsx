import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ArrowLeft01Icon from '@hugeicons/core-free-icons/ArrowLeft01Icon'
import ArrowRight01Icon from '@hugeicons/core-free-icons/ArrowRight01Icon'
import Target02Icon from '@hugeicons/core-free-icons/Target02Icon'
import Idea01Icon from '@hugeicons/core-free-icons/Idea01Icon'
import { Icon } from '@/components/ui/icon'
import { GoalBadge } from '@/components/plan/goal-badge'
import { StrategyList } from '@/components/plan/strategy-list'
import { StatCounter } from '@/components/home/stat-counter'
import { SplitHeading } from '@/components/motion/split-heading'
import { ViewTransition } from '@/components/motion/view-transition'
import { GOALS, getGoal, goalNeighbours } from '@/lib/plan'

export function generateStaticParams() {
  return GOALS.map((goal) => ({ slug: goal.slug }))
}

export async function generateMetadata(props: PageProps<'/goals/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params
  const goal = getGoal(slug)
  if (!goal) return {}
  return {
    title: `Goal ${goal.number}: ${goal.title}`,
    description: goal.tagline,
  }
}

export default async function GoalPage(props: PageProps<'/goals/[slug]'>) {
  const { slug } = await props.params
  const goal = getGoal(slug)
  if (!goal) notFound()

  const neighbours = goalNeighbours(slug)

  return (
    <ViewTransition
      enter={{ 'page-forward': 'page-forward', 'page-back': 'page-back', default: 'none' }}
      exit={{ 'page-forward': 'page-forward', 'page-back': 'page-back', default: 'none' }}
      default="none"
    >
      {/* ------------------------------------------------------------- hero */}
      <header
        className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24"
        style={{ background: `linear-gradient(168deg, ${goal.color}14, transparent 62%)` }}
      >
        <div className="shell">
          {/* Page meta sits with the back link, not inside the title block —
              the badge can then square off against the title and tagline. */}
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            {/* A plain link, not `router.back()`. `history.back()` is
                asynchronous, so it lands outside the React transition and the
                `page-back` type never attaches — which killed both the slide
                and the badge morph. Linking to the card's own id gives a real
                typed navigation, and returns you to the card you opened. */}
            <Link
              href={`/#goal-${goal.slug}`}
              transitionTypes={['page-back']}
              // Negative margin then padding: the text stays optically on the
              // same line as the eyebrow opposite it, but the tap target grows
              // from 24px to 44px for a thumb.
              className="group -my-2.5 inline-flex items-center gap-2 py-2.5 text-small font-semibold text-stone transition-colors hover:text-navy"
            >
              <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-x-1">
                <Icon icon={ArrowLeft01Icon} size={17} />
              </span>
              Back to the goals
            </Link>
            <p className="eyebrow" style={{ color: goal.textColor }}>
              Goal {goal.number} of {GOALS.length}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            <GoalBadge goal={goal} hero />

            <div className="min-w-0">
              <SplitHeading as="h1" immediate delay={0.08} className="font-display text-display-2">
                {goal.title}
              </SplitHeading>
              <p className="mt-3 text-lead" style={{ color: goal.textColor }}>
                {goal.tagline}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------ why it matters */}
      <section className="shell py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
          <div>
 <h2 className="font-heading text-title text-ink">Why this matters</h2>
            <p className="mt-5 max-w-[68ch] text-lead text-slate">{goal.summary}</p>
          </div>

          {goal.stats.length ? (
            <div className="lg:border-l lg:border-hairline lg:pl-10">
 <h2 className="font-heading text-title text-ink">Where we are today</h2>
              <dl className="mt-6 space-y-6" data-reveal-stagger="0.08">
                {goal.stats.map((stat) => (
                  <div key={`${stat.value}-${stat.label}`} data-reveal="up">
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <StatCounter
                        value={stat.value}
 className="block font-heading text-[clamp(1.5rem,3vw,2.1rem)] leading-tight tabular-nums"
                      />
                      <span className="mt-1 block text-small text-stone">{stat.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>
      </section>

      {/* -------------------------------------------------------------- targets */}
      {goal.targets.length ? (
        <section className="bg-shell py-16 sm:py-24">
          <div className="shell">
            <div className="flex items-center gap-3">
              <span
                className="grid h-10 w-10 place-items-center rounded-full"
                style={{ background: `${goal.color}1A`, color: goal.textColor }}
              >
                <Icon icon={Target02Icon} size={20} />
              </span>
              <h2 className="font-display text-display-3 font-bold">Targets</h2>
            </div>

            <ol
              className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
              data-reveal-stagger="0.08"
            >
              {goal.targets.map((target) => (
                <li
                  key={target.id}
                  data-reveal="up"
                  className="rounded-3xl border border-hairline bg-white p-6"
                >
                  <p
 className="font-heading text-small tracking-wide tabular-nums"
                    style={{ color: goal.textColor }}
                  >
                    Target {target.label}
                  </p>
                  <p className="mt-2 max-w-[52ch] text-body text-slate">{target.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* --------------------------------------------------- strategies + feedback */}
      <section className="shell py-16 sm:py-24">
        <div className="max-w-[62ch]">
          <h2 className="font-display text-display-3 font-bold">Strategies and actions</h2>
          <p className="mt-4 text-lead text-slate">
            Tell us what you think of each action below. One tap to react, and a comment box if you
            want to explain why.
          </p>
        </div>

        <div className="mt-12">
          <StrategyList goal={goal} />
        </div>

        {goal.openNote ? (
          <p
            className="mt-12 flex max-w-3xl items-start gap-3 rounded-2xl bg-sand p-5 text-small text-slate"
            data-reveal="fade"
          >
            <span className="mt-0.5 shrink-0 text-mist">
              <Icon icon={Idea01Icon} size={18} />
            </span>
            <span>
              <strong className="font-bold text-ink">Still open: </strong>
              {goal.openNote}
            </span>
          </p>
        ) : null}
      </section>

      {/* ----------------------------------------------------------- prev / next */}
      {neighbours ? (
        <nav
          aria-label="Other goals"
          className="border-t border-hairline bg-shell py-12 sm:py-16"
        >
          <div className="shell grid gap-4 sm:grid-cols-2">
            {(
              [
                { goal: neighbours.prev, dir: 'prev' as const },
                { goal: neighbours.next, dir: 'next' as const },
              ] satisfies { goal: typeof goal; dir: 'prev' | 'next' }[]
            ).map(({ goal: other, dir }) => (
              <Link
                key={dir}
                href={`/goals/${other.slug}`}
                transitionTypes={[dir === 'next' ? 'page-forward' : 'page-back']}
                className={`group flex items-center gap-4 rounded-3xl border border-hairline bg-white p-5 transition-[border-color,transform] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-mist/60 ${
                  dir === 'next' ? 'sm:flex-row-reverse sm:text-right' : ''
                }`}
              >
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
                  style={{ background: `${other.color}1A`, color: other.color }}
                >
                  <Icon icon={dir === 'next' ? ArrowRight01Icon : ArrowLeft01Icon} size={18} />
                </span>
                <span className="min-w-0">
                  <span className="eyebrow block">
                    {dir === 'next' ? 'Next goal' : 'Previous goal'}
                  </span>
 <span className="mt-1 block font-heading text-title text-ink group-hover:text-navy">
                    {other.number}. {other.title}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </ViewTransition>
  )
}
