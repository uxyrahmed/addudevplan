import Link from 'next/link'
import ArrowRight02Icon from '@hugeicons/core-free-icons/ArrowRight02Icon'
import Comment01Icon from '@hugeicons/core-free-icons/Comment01Icon'
import { Icon } from '@/components/ui/icon'
import { Hero } from '@/components/home/hero'
import { ReefDivider } from '@/components/home/reef-divider'
import { TimelineRail } from '@/components/home/timeline-rail'
import { StatCounter } from '@/components/home/stat-counter'
import { AtollMap } from '@/components/home/atoll-map'
import { MigrationChart } from '@/components/home/migration-chart'
import { PopulationLedger, PopulationGap } from '@/components/home/population-gap'
import { Vision } from '@/components/home/vision'
import { SplitHeading } from '@/components/motion/split-heading'
import { GoalGrid } from '@/components/plan/goal-grid'
import { ViewTransition } from '@/components/motion/view-transition'
import {
  GOALS,
  HEADLINE_FACTS,
  INITIATIVES,
  INITIATIVES_INTRO,
  LAND,
  RECLAIMED_PCT,
  TIMELINE,
  PILLARS,
  PILLARS_INTRO,
  TOTAL_ACTIONS,
  TURNING_POINT,
  fmt,
} from '@/lib/plan'

export default function HomePage() {
  return (
    <ViewTransition
      enter={{ 'page-forward': 'page-forward', 'page-back': 'page-back', default: 'none' }}
      exit={{ 'page-forward': 'page-forward', 'page-back': 'page-back', default: 'none' }}
      default="none"
    >
      <Hero />
      <ReefDivider />

      {/* ---------------------------------------- Addu is at a turning point */}
      <section id="turning-point" className="scroll-mt-24 py-20 sm:py-32">
        <div className="shell">
          <SplitHeading className="max-w-[16ch] font-display text-display-2 font-bold">
            {TURNING_POINT.title}
          </SplitHeading>
          <p className="mt-8 max-w-[68ch] text-lead text-slate">
            {TURNING_POINT.body}
          </p>

          <dl
            className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-hairline pt-10 lg:grid-cols-4"
            data-reveal-stagger="0.09"
          >
            {HEADLINE_FACTS.map((fact) => (
              <div key={fact.label} data-reveal="up">
                <dt className="sr-only">{fact.label}</dt>
                <dd>
                  <StatCounter
                    value={fact.value}
                    className="block font-display text-display-3 font-bold text-navy tabular-nums"
                  />
                  <span className="mt-1.5 block text-small text-stone">{fact.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ------------------------------------------------ Geography & growth */}
      <section className="bg-shell py-20 sm:py-28">
        <div className="shell">
          {/* Stretch, not `items-start`: the map column is shorter than the
              copy beside it, and letting it fill the row lets its legend sit on
              the same baseline as the island list rather than floating above
              it. */}
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <SplitHeading className="font-display text-display-3 font-bold">
                One atoll, four connected communities
              </SplitHeading>
              <p className="mt-6 max-w-[62ch] text-lead text-slate">
                The Link Road runs the length of the western chain, from Hithadhoo through
                Maradhoo and Maradhoo-Feydhoo to Feydhoo, so one investment reaches every
                community — and reclamation has added{' '}
                <strong className="text-navy">{fmt(LAND.reclaimedHa)} hectares</strong> to a city
                that now covers <strong className="text-navy">{fmt(LAND.totalHa)} hectares</strong>.
              </p>

              <dl className="mt-7 flex flex-wrap gap-x-12 gap-y-5 border-t border-hairline pt-5">
                <div>
                  <dt className="text-small text-stone">Total land area</dt>
                  <dd className="font-heading text-display-3 text-navy tabular-nums">
                    {fmt(LAND.totalHa)}
                    <span className="ml-1.5 text-title text-stone">ha</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-small text-stone">Of which reclaimed</dt>
                  <dd className="font-heading text-display-3 text-navy tabular-nums">
                    {fmt(LAND.reclaimedHa)}
                    <span className="ml-1.5 text-title text-stone">ha</span>
                  </dd>
                </div>
              </dl>

              {/* The two figures above state the amount; this states the share,
                  which is the part worth noticing. Split from the derived
                  percentage so a revised figure moves the bar. */}
              <div className="mt-6 border-b border-hairline pb-6">
                <div
                  data-reveal="measure"
                  className="flex h-2.5 overflow-hidden rounded-full"
                  aria-hidden
                >
                  <div className="bg-navy" style={{ width: `${100 - RECLAIMED_PCT}%` }} />
                  <div className="bg-sky" style={{ width: `${RECLAIMED_PCT}%` }} />
                </div>
                <p className="mt-3.5 flex items-center gap-2.5 text-small text-stone">
                  <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full bg-sky" />
                  One in every five hectares of the city is reclaimed land.
                </p>
              </div>

              {/* Two columns, so four islands are two rows. Numbered to match
                  the map beside it, which is what carries the key at the widths
                  where the map drops its own names. */}
              <div className="mt-6">
                <p className="text-small text-ink">Islands of the city</p>
                <ul className="mt-2.5 grid grid-cols-2 gap-x-8">
                  {LAND.islands.map((island, i) => (
                    <li
                      key={island}
                      className="flex items-center gap-2.5 border-t border-hairline py-1.5 text-small text-stone"
                    >
                      <span
                        aria-hidden
                        className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-navy text-[9px] font-bold text-white"
                      >
                        {i + 1}
                      </span>
                      {island}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div data-reveal="fade">
              <AtollMap />
            </div>
          </div>

          {/* Settlement history */}
          <div className="mt-20 border-t border-hairline pt-16">
            <SplitHeading className="max-w-[20ch] font-display text-display-3">
              A city moved, emptied and rebuilt
            </SplitHeading>
            <p className="mt-5 max-w-[62ch] text-lead text-slate">
              Addu&rsquo;s people have been relocated island to island for most of a century.
            </p>

            {/* Nine entries never fit legibly across a page, so they keep a
                readable column width and the row scrolls — dragged, or moved
                with the arrows, which disable at each end. */}
            <TimelineRail label="Settlement history, 1620 to 1976">
              <ol className="timeline-track" data-reveal-stagger="0.05">
                {TIMELINE.map((event) => (
                  <li key={event.year} data-reveal="up" className="timeline-item">
                    <span aria-hidden className="timeline-dot" />
                    <p className="font-heading text-title text-navy tabular-nums">{event.year}</p>
                    <p className="mt-2 text-small text-stone">{event.text}</p>
                  </li>
                ))}
              </ol>
            </TimelineRail>
          </div>

          {/* Out-migration. One stacked column, not a table beside a chart:
              the arithmetic states the gap, the ledger shows it opening and
              starting to close, and the chart puts it in national context. */}
          <div
            id="out-migration"
            className="mt-16 scroll-mt-24 border-t border-hairline pt-12"
          >
            {/* Quiet on purpose — the sum below is the statement, not this. */}
            <h2 className="font-heading text-title font-normal text-slate">
              High out-migration since 1976
            </h2>

            {/* Lede across the full width: the statement and the sentence that
                qualifies it belong together. Keeping the standfirst out of the
                chart column is what removed the dead space under it. */}
            <div className="mt-8 grid gap-x-20 gap-y-8 lg:grid-cols-2 lg:items-start">
              <PopulationGap />
              <p className="max-w-[46ch] text-lead text-slate">
                In 1977 that gap was 705 people. Closing it — 35,000 residents by 2030 — is what
                the whole plan is for.
              </p>
            </div>

            {/* Evidence, as a matched pair: both columns open with the same
                header rule so their tops align, and neither is sticky — a
                sticky chart beside a scrolling ledger is what made the two
                look unrelated. */}
            <div className="mt-12 grid gap-12 border-t border-hairline pt-10 lg:grid-cols-2 lg:items-start lg:gap-20">
              <PopulationLedger />
              <div data-reveal="fade">
                <MigrationChart />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Vision />

      {/* ------------------------------------------------------------ Pillars */}
      <section id="pillars" className="scroll-mt-24 py-20 sm:py-32">
        <div className="shell">
          <SplitHeading className="max-w-[18ch] font-display text-display-2 font-bold">
            {PILLARS_INTRO.title}
          </SplitHeading>
          <p className="mt-8 max-w-[68ch] text-lead text-slate">{PILLARS_INTRO.body}</p>

          <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-hairline sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {PILLARS.map((pillar) => (
              <li
                key={pillar.id}
                className="flex min-h-40 flex-col justify-end p-6 text-white"
                // The accessible variant, not the plate colour. White on three
                // of the four printed colours measures 2.7–3.3:1, which fails
                // for a tile that carries its own label. Same hue, legible.
                style={{ background: pillar.textColor }}
              >
                <h3 className="max-w-[14ch] font-heading text-title !text-white">
                  {pillar.name}
                </h3>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* -------------------------------------------------------------- Goals */}
      <section id="goals" className="scroll-mt-24 bg-shell py-20 sm:py-32">
        {/* `shell`, like every other section. This was the one `shell-wide` on
            the page, so the goal grid ran 320px past the headings above and
            below it and the column of the page visibly stepped out here. */}
        <div className="shell">
          <SplitHeading className="font-display text-display-2">Twelve goals</SplitHeading>
          <p className="mt-5 max-w-[62ch] text-lead text-slate">
            Twelve goals aligned with five sustainability pillars will be pursued to achieve the
            vision of Sustainable Addu City. Open any goal to read its targets and comment on each
            action.
          </p>

          <GoalGrid />
        </div>
      </section>

      {/* -------------------------------------------------------- Initiatives */}
      <section id="initiatives" className="scroll-mt-24 py-20 sm:py-32">
        <div className="shell">
          <SplitHeading className="max-w-[16ch] font-display text-display-2 font-bold">
            {INITIATIVES_INTRO.title}
          </SplitHeading>
          <p className="mt-6 max-w-[62ch] text-lead text-slate">{INITIATIVES_INTRO.body}</p>

          <ol className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2" data-reveal-stagger="0.06">
            {INITIATIVES.map((item) => (
              <li key={item.number} data-reveal="up" className="border-t border-hairline pt-6">
                <div className="flex items-baseline gap-4">
 <span className="font-heading text-title text-navy tabular-nums">
                    {item.number}
                  </span>
 <h3 className="font-heading text-title text-ink">{item.title}</h3>
                </div>
                <p className="mt-3 text-small text-stone">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ----------------------------------------------------------- Feedback */}
      <section id="feedback" className="scroll-mt-24 bg-sand py-20 sm:py-32">
        <div className="shell">
          <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <div>
              <SplitHeading className="max-w-[18ch] font-display text-display-2 font-bold">
                Tell us what to change.
              </SplitHeading>
              <p className="mt-7 max-w-[62ch] text-lead text-slate">
                Every one of the {TOTAL_ACTIONS} actions in this plan has a place to say whether
                you support it, whether you are unsure, or whether you have a concern — and room
                to explain why. Your responses collect in one place so you can review them before
                sending.
              </p>
              <Link
                href={`/goals/${GOALS[0].slug}`}
                transitionTypes={['page-forward']}
 className="group mt-9 inline-flex items-center gap-2.5 rounded-full bg-navy px-6 py-3.5 font-heading text-small text-white transition-colors hover:bg-navy-deep"
              >
                <Icon icon={Comment01Icon} size={17} />
                Start with goal 1
                <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1">
                  <Icon icon={ArrowRight02Icon} size={17} />
                </span>
              </Link>
            </div>

            <ol className="divide-y divide-hairline border-y border-hairline" data-reveal-stagger="0.1">
              {[
                {
                  n: '01',
                  t: 'Read a goal',
                  d: 'Each goal page carries the plan’s own wording: why it matters, the baseline figures, the targets and every strategy.',
                },
                {
                  n: '02',
                  t: 'React to each action',
                  d: 'Support, not sure, or concern — one tap per action. Add a comment where you have something specific to say.',
                },
                {
                  n: '03',
                  t: 'Review and send',
                  d: 'Your responses gather in a single panel. Check them over, download a copy, then send them to the council.',
                },
              ].map((step) => (
                <li key={step.n} data-reveal="up" className="flex gap-5 py-6">
 <span className="font-heading text-title text-mist tabular-nums">
                    {step.n}
                  </span>
                  <div>
 <h3 className="font-heading text-title text-ink">{step.t}</h3>
                    <p className="mt-2 max-w-[58ch] text-small text-stone">{step.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </ViewTransition>
  )
}
