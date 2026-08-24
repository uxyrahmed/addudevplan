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
import { GOALS } from '@/lib/plan'
import { getLocalizedGoal, localizedGoalNeighbours } from '@/lib/plan-i18n'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { fill } from '@/lib/i18n/format'
import { isLocale, localePath, LOCALES } from '@/lib/i18n/config'
import { alternatesFor } from '@/lib/i18n/metadata'
import { statGlyph } from '@/lib/stat-glyphs'

/**
 * Twelve goals in each language. The slug is the plan's own, and the same in
 * both — it is in published URLs and in the badge's view-transition name, and a
 * translated slug would be a second address for one goal.
 */
export function generateStaticParams() {
  return LOCALES.flatMap((lang) => GOALS.map((goal) => ({ lang, slug: goal.slug })))
}

export async function generateMetadata(
  props: PageProps<'/[lang]/goals/[slug]'>,
): Promise<Metadata> {
  const { lang, slug } = await props.params
  if (!isLocale(lang)) return {}

  const goal = getLocalizedGoal(slug, lang)
  if (!goal) return {}

  const t = getDictionary(lang)
  return {
    title: fill(t.goal.metaTitle, { number: goal.number, title: goal.title }),
    description: goal.tagline,
    alternates: alternatesFor(lang, `/goals/${goal.slug}`),
  }
}

export default async function GoalPage(props: PageProps<'/[lang]/goals/[slug]'>) {
  const { lang, slug } = await props.params
  if (!isLocale(lang)) notFound()

  const goal = getLocalizedGoal(slug, lang)
  if (!goal) notFound()

  const t = getDictionary(lang)
  const neighbours = localizedGoalNeighbours(slug, lang)

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
              href={localePath(lang, `/#goal-${goal.slug}`)}
              transitionTypes={['page-back']}
              // Negative margin then padding: the text stays optically on the
              // same line as the eyebrow opposite it, but the tap target grows
              // from 24px to 44px for a thumb.
              className="group -my-2.5 inline-flex items-center gap-2 py-2.5 text-small font-semibold text-stone transition-colors hover:text-navy"
            >
              <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-x-1 rtl:group-hover:translate-x-1">
                <Icon icon={ArrowLeft01Icon} size={17} directional />
              </span>
              {t.goal.backToGoals}
            </Link>
            <p className="eyebrow" style={{ color: goal.textColor }}>
              {fill(t.goal.counter, { number: goal.number, total: GOALS.length })}
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
            <h2 className="font-heading text-title text-ink">{t.goal.whyThisMatters}</h2>
            <p className="mt-5 max-w-[68ch] text-lead text-slate">{goal.summary}</p>
          </div>

          {goal.stats.length ? (
            <div className="lg:border-s lg:border-hairline lg:ps-10">
              <h2 className="font-heading text-title text-ink">{t.goal.whereWeAreToday}</h2>
              <dl className="mt-6 space-y-6" data-reveal-stagger="0.08">
                {goal.stats.map((stat) => {
                  const glyph = statGlyph(goal.number, stat.label)
                  return (
                    <div key={`${stat.value}-${stat.label}`} data-reveal="up">
                      <dt className="sr-only">{stat.label}</dt>
                      {/* The glyph lives inside the `dd`, not beside it: a
                          `dl > div` may only hold `dt` and `dd`, so hanging the
                          plate off the wrapper would be invalid markup. It is
                          decorative — the label names the figure in text, and
                          `Icon` leaves it `aria-hidden` with no `label` prop. */}
                      <dd className="flex items-start gap-4">
                        {glyph ? (
                          <span
                            // Half a step down: the plate centres on the
                            // figure's cap height rather than its line box, so
                            // the column of glyphs reads level with the numbers.
                            className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full"
                            // 8%, against the 10% the Targets heading uses. That
                            // plate appears once a page; this one repeats down a
                            // rail, and at 10% the column of tints started
                            // competing with the figures it labels.
                            style={{ background: `${goal.color}14`, color: goal.textColor }}
                          >
                            <Icon icon={glyph} size={18} />
                          </span>
                        ) : null}
                        <span className="min-w-0">
                          <StatCounter
                            value={stat.value}
                            className="block font-heading text-[clamp(1.5rem,3vw,2.1rem)] leading-tight tabular-nums"
                          />
                          <span className="mt-1 block text-small text-stone">{stat.label}</span>
                        </span>
                      </dd>
                    </div>
                  )
                })}
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
              <h2 className="font-display text-display-3 font-bold">{t.goal.targets}</h2>
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
                    {fill(t.goal.targetLabel, { label: target.label })}
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
          <h2 className="font-display text-display-3 font-bold">{t.goal.strategiesAndActions}</h2>
          <p className="mt-4 text-lead text-slate">{t.goal.strategiesBody}</p>
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
              <strong className="font-bold text-ink">{t.goal.stillOpen}</strong>
              {goal.openNote}
            </span>
          </p>
        ) : null}
      </section>

      {/* ----------------------------------------------------------- prev / next */}
      {neighbours && (neighbours.prev || neighbours.next) ? (
        <nav
          aria-label={t.goal.otherGoalsLabel}
          className="border-t border-hairline bg-shell py-12 sm:py-16"
        >
          <div className="shell grid gap-4 sm:grid-cols-2">
            {(
              [
                { goal: neighbours.prev, dir: 'prev' as const },
                { goal: neighbours.next, dir: 'next' as const },
              ] satisfies { goal: typeof goal | null; dir: 'prev' | 'next' }[]
            )
              // Goal 1 has no previous and goal 12 has no next, so one end of
              // the plan renders a single card.
              .filter((item): item is { goal: typeof goal; dir: 'prev' | 'next' } => item.goal !== null)
              .map(({ goal: other, dir }) => (
              <Link
                key={dir}
                href={localePath(lang, `/goals/${other.slug}`)}
                transitionTypes={[dir === 'next' ? 'page-forward' : 'page-back']}
                // Placed by column rather than by document order: with only one
                // card left, "next" still has to sit on the side it points to,
                // or the arrow reads as pointing out of the page at nothing.
                className={`group flex items-center gap-4 rounded-3xl border border-hairline bg-white p-5 transition-[border-color,transform] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-mist/60 ${
                  dir === 'next'
                    ? 'sm:col-start-2 sm:flex-row-reverse sm:text-end'
                    : 'sm:col-start-1'
                }`}
              >
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
                  style={{ background: `${other.color}1A`, color: other.color }}
                >
                  <Icon
                    icon={dir === 'next' ? ArrowRight01Icon : ArrowLeft01Icon}
                    size={18}
                    directional
                  />
                </span>
                <span className="min-w-0">
                  <span className="eyebrow block">
                    {dir === 'next' ? t.goal.nextGoal : t.goal.previousGoal}
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
