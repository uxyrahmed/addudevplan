import type { Metadata } from 'next'
import Link from 'next/link'
import ArrowLeft01Icon from '@hugeicons/core-free-icons/ArrowLeft01Icon'
import ArrowRight02Icon from '@hugeicons/core-free-icons/ArrowRight02Icon'
import Comment01Icon from '@hugeicons/core-free-icons/Comment01Icon'
import { Icon } from '@/components/ui/icon'
import { TimelineRail } from '@/components/home/timeline-rail'
import { MigrationChart } from '@/components/home/migration-chart'
import { PopulationLedger } from '@/components/home/population-gap'
import { SplitHeading } from '@/components/motion/split-heading'
import { ViewTransition } from '@/components/motion/view-transition'
import { GOALS, TIMELINE } from '@/lib/plan'

export const metadata: Metadata = {
  title: 'Settlement and population',
  description:
    'The record behind the plan: where Addu’s people have been settled since 1620, and the registered and resident population counts from 1977 to 2025.',
}

/**
 * The evidence behind the plan, on its own page.
 *
 * All three of these — the settlement timeline, the population ledger and the
 * national share chart — used to sit in the middle of the home page, between a
 * resident and the goals they came to respond to. Together they ran about a
 * quarter of that page's height, and roughly seven screens on a phone, which is
 * a long way to travel past a consultation to reach the consultation.
 *
 * They are not cut, because they are the case the plan rests on. They are moved
 * behind a link, so the reader who wants the record can have all of it and the
 * reader who wants to respond is not made to scroll through it first.
 */
export default function BackgroundPage() {
  return (
    <ViewTransition
      enter={{ 'page-forward': 'page-forward', 'page-back': 'page-back', default: 'none' }}
      exit={{ 'page-forward': 'page-forward', 'page-back': 'page-back', default: 'none' }}
      default="none"
    >
      <header className="bg-shell pt-28 pb-14 sm:pt-36 sm:pb-20">
        <div className="shell">
          <Link
            href="/#out-migration"
            transitionTypes={['page-back']}
            // Negative margin then padding: optically on the same line as the
            // heading block below, but a 44px target for a thumb.
            className="group -my-2.5 inline-flex items-center gap-2 py-2.5 text-small font-semibold text-stone transition-colors hover:text-navy"
          >
            <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-x-1">
              <Icon icon={ArrowLeft01Icon} size={17} />
            </span>
            Back to the plan
          </Link>

          <div className="mt-8 2xl:grid 2xl:grid-cols-[0.53fr_1fr] 2xl:items-baseline 2xl:gap-x-16">
            <SplitHeading
              as="h1"
              immediate
              delay={0.08}
              className="max-w-[14ch] font-display text-display-2 font-bold"
            >
              Settlement and population
            </SplitHeading>
            {/* Says what is on the page. It does not tell the reader what the
                figures mean — that reading is not this page's to make. */}
            <p className="mt-6 max-w-[62ch] text-lead text-slate 2xl:mt-2.5">
              The record the plan is built on: where Addu&rsquo;s people have been settled since
              1620, and how the number registered here compares with the number living here from
              1977 onwards.
            </p>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------- settlement history */}
      <section className="shell py-16 sm:py-24">
        <h2 className="font-display text-display-3 font-bold">A city moved, emptied and rebuilt</h2>
        <p className="mt-5 max-w-[62ch] text-lead text-slate">
          Addu&rsquo;s people have been relocated island to island for most of a century.
        </p>

        {/* Nine entries never fit legibly across a page, so they keep a
            readable column width and the row scrolls — dragged, or moved with
            the arrows, which disable at each end. */}
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
      </section>

      {/* ----------------------------------------------- registered vs resident */}
      <section className="bg-shell py-16 sm:py-24">
        <div className="shell">
          <h2 className="font-display text-display-3 font-bold">Registered here, living elsewhere</h2>
          <p className="mt-5 max-w-[62ch] text-lead text-slate">
            Every year we have counted, drawn to one scale that starts at zero.
          </p>

          {/* The matched pair the home page used to carry: both columns open on
              the same header rule, and the chart stretches so the two end on
              the same line rather than missing each other by 200-odd pixels. */}
          <div className="mt-12 grid gap-12 border-t border-hairline pt-10 lg:grid-cols-2 lg:gap-20">
            <PopulationLedger />
            <div data-reveal="fade">
              <MigrationChart />
            </div>
          </div>
        </div>
      </section>

      {/* The page a resident is here to answer is never more than one control
          away, including from the bottom of the longest read on the site. */}
      <section className="shell py-16 sm:py-20">
        <div className="border-t border-hairline pt-10">
          {/* First person. The site is published by the council, so writing
              about "what the council proposes" made the publisher sound like a
              third party being reported on. */}
          <h2 className="max-w-[30ch] font-heading text-title text-ink">
            The plan sets out what we intend to do about this — and every action in it takes your
            response.
          </h2>
          <Link
            href={`/goals/${GOALS[0].slug}`}
            transitionTypes={['page-forward']}
            className="group mt-6 inline-flex items-center gap-2.5 rounded-full bg-navy px-6 py-3.5 font-heading text-small text-white transition-colors hover:bg-navy-deep"
          >
            <Icon icon={Comment01Icon} size={17} />
            Start with goal 1
            <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1">
              <Icon icon={ArrowRight02Icon} size={17} />
            </span>
          </Link>
        </div>
      </section>
    </ViewTransition>
  )
}
