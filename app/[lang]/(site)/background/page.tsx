import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ArrowLeft01Icon from '@hugeicons/core-free-icons/ArrowLeft01Icon'
import ArrowRight02Icon from '@hugeicons/core-free-icons/ArrowRight02Icon'
import Comment01Icon from '@hugeicons/core-free-icons/Comment01Icon'
import { Icon } from '@/components/ui/icon'
import { TimelineRail } from '@/components/home/timeline-rail'
import { MigrationChart } from '@/components/home/migration-chart'
import { PopulationLedger } from '@/components/home/population-gap'
import { SplitHeading } from '@/components/motion/split-heading'
import { ViewTransition } from '@/components/motion/view-transition'
import { localizePlan } from '@/lib/plan-i18n'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { isLocale, localePath } from '@/lib/i18n/config'
import { alternatesFor } from '@/lib/i18n/metadata'

export async function generateMetadata(props: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await props.params
  if (!isLocale(lang)) return {}

  const t = getDictionary(lang)
  return {
    title: t.background.metaTitle,
    description: t.background.metaDescription,
    alternates: alternatesFor(lang, '/background'),
  }
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
export default async function BackgroundPage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()

  const t = getDictionary(lang)
  const { goals, migration, timeline } = localizePlan(lang)

  return (
    <ViewTransition
      enter={{ 'page-forward': 'page-forward', 'page-back': 'page-back', default: 'none' }}
      exit={{ 'page-forward': 'page-forward', 'page-back': 'page-back', default: 'none' }}
      default="none"
    >
      <header className="bg-shell pt-28 pb-14 sm:pt-36 sm:pb-20">
        <div className="shell">
          <Link
            href={localePath(lang, '/#out-migration')}
            transitionTypes={['page-back']}
            // Negative margin then padding: optically on the same line as the
            // heading block below, but a 44px target for a thumb.
            className="group -my-2.5 inline-flex items-center gap-2 py-2.5 text-small font-semibold text-stone transition-colors hover:text-navy"
          >
            <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-x-1 rtl:group-hover:translate-x-1">
              <Icon icon={ArrowLeft01Icon} size={17} directional />
            </span>
            {t.background.backToPlan}
          </Link>

          <div className="mt-8 2xl:grid 2xl:grid-cols-[0.53fr_1fr] 2xl:items-baseline 2xl:gap-x-16">
            <SplitHeading
              as="h1"
              immediate
              delay={0.08}
              className="max-w-[14ch] font-display text-display-2 font-bold"
            >
              {t.background.title}
            </SplitHeading>
            {/* Says what is on the page. It does not tell the reader what the
                figures mean — that reading is not this page's to make. */}
            <p className="mt-6 max-w-[62ch] text-lead text-slate 2xl:mt-2.5">{t.background.lede}</p>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------- settlement history */}
      <section className="shell py-16 sm:py-24">
        <h2 className="font-display text-display-3 font-bold">{t.background.settlementTitle}</h2>
        <p className="mt-5 max-w-[62ch] text-lead text-slate">{t.background.settlementBody}</p>

        {/* Nine entries never fit legibly across a page, so they keep a
            readable column width and the row scrolls — dragged, or moved with
            the arrows, which disable at each end. */}
        <TimelineRail label={t.background.settlementRailLabel}>
          <ol className="timeline-track" data-reveal-stagger="0.05">
            {timeline.map((event) => (
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
          <h2 className="font-display text-display-3 font-bold">{t.background.ledgerTitle}</h2>
          <p className="mt-5 max-w-[62ch] text-lead text-slate">{t.background.ledgerBody}</p>

          {/* The matched pair the home page used to carry: both columns open on
              the same header rule, and the chart stretches so the two end on
              the same line rather than missing each other by 200-odd pixels. */}
          <div className="mt-12 grid gap-12 border-t border-hairline pt-10 lg:grid-cols-2 lg:gap-20">
            <PopulationLedger locale={lang} />
            <div data-reveal="fade">
              <MigrationChart data={migration} />
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
          <h2 className="max-w-[30ch] font-heading text-title text-ink">{t.background.closing}</h2>
          <Link
            href={localePath(lang, `/goals/${goals[0]!.slug}`)}
            transitionTypes={['page-forward']}
            className="group mt-6 inline-flex items-center gap-2.5 rounded-full bg-navy px-6 py-3.5 font-heading text-small text-white transition-colors hover:bg-navy-deep"
          >
            <Icon icon={Comment01Icon} size={17} />
            {t.home.startWithGoalOne}
            <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
              <Icon icon={ArrowRight02Icon} size={17} directional />
            </span>
          </Link>
        </div>
      </section>
    </ViewTransition>
  )
}
