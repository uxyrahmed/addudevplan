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
  TIMELINE,
  PILLARS,
  PILLARS_INTRO,
  TOTAL_ACTIONS,
  TURNING_POINT,
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
          {/* Heading beside the lede once there is width for it, rather than
              above it. Stacked, the pair sat in the left two-thirds of a
              1,472px container and left 554px of nothing down the right — worst
              here, where the lede runs 544px tall. Every section opener on the
              page splits the same way, so the rhythm holds down the page.

              Below `xl` it stays stacked: putting a 1,445-character lede in a
              400px column costs more than the space it reclaims. */}
          <div className="xl:grid xl:grid-cols-[0.8fr_1.2fr] xl:items-baseline xl:gap-x-16">
            <SplitHeading className="max-w-[16ch] font-display text-display-2 font-bold">
              {TURNING_POINT.title}
            </SplitHeading>
            <p className="mt-8 max-w-[68ch] text-lead text-slate xl:mt-0">
              {TURNING_POINT.body}
            </p>
          </div>

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
          {/* `items-start`, not stretch. The copy used to be the taller column
              and the map filled the row so its legend landed on the same
              baseline as the island list. Cutting the reclamation figure
              reversed that: the map is now the taller of the two, and
              stretching would only open a gap beneath the list. Both columns
              take their own height instead. */}
          <div className="grid gap-14 lg:grid-cols-2 lg:items-start lg:gap-20">
            <div>
              <SplitHeading className="font-display text-display-3 font-bold">
                One atoll, four connected communities
              </SplitHeading>
              {/* The four islands are named on the map and again in the list
                  below it, so this does not name them a third time. What is
                  left is the only thing the section is actually arguing. */}
              <p className="mt-6 max-w-[62ch] text-lead text-slate">
                The Link Road runs the length of the western chain, joining four islands end to
                end. That is what makes Addu one city rather than four.
              </p>

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
          <div className="xl:grid xl:grid-cols-[0.8fr_1.2fr] xl:items-baseline xl:gap-x-16">
            <SplitHeading className="max-w-[18ch] font-display text-display-2 font-bold">
              {PILLARS_INTRO.title}
            </SplitHeading>
            <p className="mt-8 max-w-[68ch] text-lead text-slate xl:mt-0">{PILLARS_INTRO.body}</p>
          </div>

          {/* Numbered, and carrying the deck's own phrase rather than a single
              noun. At one column these tiles are 335px of flat colour, and
              "People" left almost all of it empty: the numeral gives the tile a
              top edge to hang from, and the phrase gives it something to say
              that the heading above has not already said. */}
          <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-hairline sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {PILLARS.map((pillar, i) => (
              <li
                key={pillar.id}
                className="flex min-h-40 flex-col justify-between gap-8 p-6 text-white sm:min-h-48"
                // The accessible variant, not the plate colour. White on three
                // of the four printed colours measures 2.7–3.3:1, which fails
                // for a tile that carries its own label. Same hue, legible.
                style={{ background: pillar.textColor }}
              >
                {/* Ornamental: it numbers the five for the eye, and the
                    heading below is what actually gets read out. */}
                <span aria-hidden className="font-heading text-micro text-white/60 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="max-w-[15ch] font-heading text-title !text-white">
                  {pillar.phrase}
                </h3>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* -------------------------------------------------------------- Goals */}
      <section id="goals" className="scroll-mt-24 bg-shell py-20 sm:py-32">
        <div className="shell">
          <div className="xl:grid xl:grid-cols-[0.8fr_1.2fr] xl:items-baseline xl:gap-x-16">
            <SplitHeading className="font-display text-display-2">Twelve goals</SplitHeading>
            {/* The draft's own sentence names a count of pillars — "four" — that
                its pillars slide, two sections up, contradicts with five. The
                clause is dropped rather than arbitrated: the site should not pick
                a side on a number the council is still settling. */}
            <p className="mt-5 max-w-[62ch] text-lead text-slate xl:mt-0">
              Twelve goals will be pursued to achieve the vision of Sustainable Addu City. Open any
              goal to read its targets and comment on each action.
            </p>
          </div>

          <GoalGrid />
        </div>
      </section>

      {/* -------------------------------------------------------- Initiatives */}
      <section id="initiatives" className="scroll-mt-24 py-20 sm:py-32">
        <div className="shell">
          <div className="xl:grid xl:grid-cols-[0.8fr_1.2fr] xl:items-baseline xl:gap-x-16">
            <SplitHeading className="max-w-[16ch] font-display text-display-2 font-bold">
              {INITIATIVES_INTRO.title}
            </SplitHeading>
            <p className="mt-6 max-w-[62ch] text-lead text-slate xl:mt-0">
              {INITIATIVES_INTRO.body}
            </p>
          </div>

          {/* Three across once the container has the width for it. At two, a
              wide viewport gave each initiative a 712px line for a 139px block
              of text — a strip rather than a card. */}
          <ol
            className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2 xl:grid-cols-3"
            data-reveal-stagger="0.06"
          >
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
