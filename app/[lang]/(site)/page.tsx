import Link from 'next/link'
import { notFound } from 'next/navigation'
import ArrowRight02Icon from '@hugeicons/core-free-icons/ArrowRight02Icon'
import Comment01Icon from '@hugeicons/core-free-icons/Comment01Icon'
import { Icon } from '@/components/ui/icon'
import { Hero } from '@/components/home/hero'
import { ReefDivider } from '@/components/home/reef-divider'
import { StatCounter } from '@/components/home/stat-counter'
import { AtollMap } from '@/components/home/atoll-map'
import { PopulationRegister, PopulationSources } from '@/components/home/population-gap'
import { Vision } from '@/components/home/vision'
import { PlanComment } from '@/components/feedback/plan-comment'
import { SplitHeading } from '@/components/motion/split-heading'
import { GoalGrid } from '@/components/plan/goal-grid'
import { ViewTransition } from '@/components/motion/view-transition'
import { PILLAR_GLYPHS } from '@/lib/pillar-glyphs'
import { TOTAL_ACTIONS } from '@/lib/plan'
import { localizePlan } from '@/lib/plan-i18n'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { fill } from '@/lib/i18n/format'
import { isLocale, localePath } from '@/lib/i18n/config'

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()

  const t = getDictionary(lang)
  const {
    gan,
    goals,
    headlineFacts,
    initiatives,
    initiativesIntro,
    islands,
    pillars,
    pillarsIntro,
    turningPoint,
  } = localizePlan(lang)

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

              Two numbers set the breakpoint and the ratio, and neither is a
              round one. At the old `xl` + `0.8fr_1.2fr` the lede ran 58ch at
              1280 and 61ch at 1600: the column, not the `max-w-[68ch]`, was
              setting the measure, and setting it under the 65ch a paragraph
              this long wants.

              The heading column cannot simply be squeezed to pay for it.
              "interconnected" measures 429px at the 62px this face resolves
              to, and a column narrower than that overflows — which is what
              rules `xl` out entirely: 1280px leaves 1088px between the
              gutters, and no split of it gives the lede 65ch and the heading
              its 429px at once.

              So the split waits for `2xl`, where 1318px of usable width
              divides into 862px of lede (65ch) and 457px of heading, and the
              ratio is 0.53/1 rather than 0.8/1.2 to put the slack where the
              reading happens. Below `2xl` the pair stacks and the lede takes
              its full 68ch. The white space that leaves down the right at
              1440 is ordinary editorial margin, and cheaper than a short
              measure on the longest paragraphs on the page.

              The facts moved into that column rather than sitting in a
              full-width row beneath it. Two lines of heading against four
              paragraphs left 450px of nothing down the left, and a void that
              size stops reading as margin. Explicit placement, so the DOM order
              stays heading → prose → facts and the stacked layout below `2xl`
              is unchanged; `self-end` lands the facts on the same baseline as
              the last line of the prose, which is what closes the hole. */}
          {/* Both tracks sized to what they hold, and the slack put in the
              gutter rather than inside a column.

              An even split gave the left track 688px to carry a heading capped
              at 16ch and two columns of short stat labels — width doing
              nothing. It cannot simply be handed to the prose either: 17px type
              at a readable measure stops at about 683px, so past that the right
              track only grows a ragged edge. So the left track takes the 32rem
              its stat pairs actually need, the right takes its 72ch, and the
              200-odd pixels left over become the gutter — which keeps both
              outer edges flush with the shell, as every other section is. */}
          <div className="2xl:grid 2xl:grid-cols-[minmax(0,32rem)_minmax(0,72ch)] 2xl:grid-rows-[auto_1fr] 2xl:justify-between 2xl:gap-x-16">
            <SplitHeading className="max-w-[16ch] font-display text-display-2 font-bold 2xl:col-start-1 2xl:row-start-1">
              {turningPoint.title}
            </SplitHeading>

            {/* `text-body`, not `text-lead`. Four paragraphs at 21px was a lot
                of large type to ask anyone through, and lead size is for a
                standfirst — this is the longest read on the page.

                The column split moves with it. At 17px a 65ch measure is 620px
                wide, so the old 0.53/1 ratio would have left 250px of nothing
                at the end of every line; an even split gives the prose 703px,
                which it fills at 72ch, and hands the slack to the facts below
                the heading, where it becomes room rather than a ragged edge. */}
            <div className="mt-8 max-w-[72ch] space-y-5 text-body text-slate 2xl:col-start-2 2xl:row-span-2 2xl:row-start-1 2xl:mt-0">
              {turningPoint.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>

            <dl
              className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-hairline pt-10 lg:grid-cols-4 2xl:col-start-1 2xl:row-start-2 2xl:mt-12 2xl:grid-cols-2 2xl:self-end"
              data-reveal-stagger="0.09"
            >
              {headlineFacts.map((fact) => (
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
        </div>
      </section>

      {/* ------------------------------------------------ Geography & growth */}
      <section className="bg-shell py-20 sm:py-28">
        <div className="shell">
          {/* `items-center`, not start or stretch. The map is much the taller
              column — it is a fixed-ratio drawing filling half the shell — and
              anchoring the copy to its top left 400px of nothing under the
              island list, which is a hole rather than margin. Stretching is no
              better: it would only push the same gap inside the copy column.
              Centred, the short column sits against the middle of the tall one
              and the whitespace splits evenly above and below it. */}
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div>
              <SplitHeading className="font-display text-display-3 font-bold">
                {t.home.geographyTitle}
              </SplitHeading>
              {/* The four islands are named on the map and again in the list
                  below it, so this does not name them a third time. What is
                  left is the only thing the section is actually arguing. */}
              <p className="mt-6 max-w-[62ch] text-lead text-slate">{t.home.geographyBody}</p>

              {/* Two columns, so four islands are two rows. Numbered to match
                  the map beside it, which is what carries the key at the widths
                  where the map drops its own names. */}
              <div className="mt-6">
                <p className="text-small text-ink">{t.home.islandsLabel}</p>
                <ul className="mt-2.5 grid grid-cols-2 gap-x-8">
                  {islands.map((island, i) => (
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

            {/* Capped, and centred in what is left. The drawing's island names
                are sized for the ~530px the comment in atoll-map.tsx assumes;
                given the full half-shell it renders at 675 and everything on it
                — labels, markers, road — comes up a fifth larger than drawn
                for, which is most of why the section shouted. At its intended
                size it also stops towering over the copy beside it. */}
            <div data-reveal="fade" className="mx-auto w-full max-w-[34rem]">
              <AtollMap islands={islands} gan={gan} />
            </div>
          </div>

          {/* Out-migration. The figure and the two counts it is drawn from —
              the settlement timeline, the year-by-year ledger and the national
              share chart now live on /background.

              They were about a quarter of this page's height, and roughly seven
              screens on a phone, sitting between a resident and the goals they
              came to answer. Nothing is cut: the case is worth reading in full,
              which is exactly why it deserves a page rather than the middle of
              this one. */}
          <div
            id="out-migration"
            className="mt-16 scroll-mt-24 border-t border-hairline pt-12"
          >
            {/* No heading. The figure below opens with the register set at
                display size and finishes the sentence in words — it is already
                the clearest statement of the section, and a small grey line
                above it was only saying the same thing quietly first. */}

            {/* Figure on the left, everything that qualifies it on the right —
                where the resident count has got to, where the plan means it to
                get, and the year both are read off. The qualifiers used to sit
                under the number while the right-hand column held two lines and
                230px of nothing; split this way the columns come out level. */}
            <div className="grid gap-x-20 gap-y-8 lg:grid-cols-2 lg:items-start">
              <PopulationRegister locale={lang} />
              <div className="max-w-[46ch]">
                {/* States where the count has got to and where the plan means
                    it to get, and stops there. It used to add that closing the
                    register-to-resident gap "is what the whole plan is for",
                    which is a claim about the plan that this section's figures
                    do not make. */}
                <p className="text-lead text-slate">{t.home.registerTarget}</p>
                <PopulationSources locale={lang} />

                {/* A control, not a text link. This is the only route to the
                    evidence from the home page and it was competing with two
                    lines of grey source notes directly above it; given a border
                    and a target it reads as somewhere to go. It names what is
                    on the other end rather than saying "read more", so the
                    reader knows whether the trip is worth making. */}
                <Link
                  href={localePath(lang, '/background')}
                  transitionTypes={['page-forward']}
                  className="group mt-6 inline-flex items-center gap-3 rounded-full border border-hairline bg-white px-5 py-3 text-small font-semibold text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white"
                >
                  {t.home.backgroundLink}
                  <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                    <Icon icon={ArrowRight02Icon} size={16} directional />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Vision locale={lang} />

      {/* ------------------------------------------------------------ Pillars */}
      <section id="pillars" className="scroll-mt-24 py-20 sm:py-32">
        <div className="shell">
          {/* `items-start`, not `items-baseline`. Baseline-aligning a 62px
              display heading against 17px prose drops the paragraph's first
              line to the heading's first baseline — some 40px below the top of
              the heading — so the two columns visibly failed to start together.
              Tops align now, and the paragraph takes a small nudge down to sit
              on the heading's cap rather than its line box. */}
          <div className="2xl:grid 2xl:grid-cols-[0.53fr_1fr] 2xl:items-start 2xl:gap-x-16">
            <SplitHeading className="max-w-[18ch] font-display text-display-2 font-bold">
              {pillarsIntro.title}
            </SplitHeading>
            <p className="mt-8 max-w-[68ch] text-lead text-slate 2xl:mt-2.5">{pillarsIntro.body}</p>
          </div>

          {/* Five quiet entries on a rule, not five colour plates.

              They used to be full-bleed grounds in the pillar colours, white
              type, a 124px glyph on each — the loudest block on the page, and
              sitting directly above the twelve goals they are meant to
              introduce. The council's note in review was that the goals should
              carry this page and the pillars should not compete with them, so
              the plates are gone and the goal cards grew instead.

              What survives is what the plates were carrying: the numeral, the
              deck's own phrase, and the glyph. The colour moves off the ground
              and onto the mark and the numeral, which is enough to keep the
              five told apart and costs nothing in prominence. Every
              `textColor` clears 4.5:1 on white, so the contrast note the old
              treatment needed — white over a plate, lifted where a stroke ran
              behind a letter — no longer applies to anything here.

              The border-and-rule pattern is the initiatives list further down
              the page, which is the other supporting row on this page. */}
          <ul
            className="mt-12 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
            data-reveal-stagger="0.05"
          >
            {pillars.map((pillar, i) => (
              <li key={pillar.id} data-reveal="up" className="border-t border-hairline pt-5">
                <div className="flex items-center gap-2.5" style={{ color: pillar.textColor }}>
                  <Icon icon={PILLAR_GLYPHS[pillar.id]} size={22} weight={1.5} />
                  {/* Ornamental: it numbers the five for the eye, and the
                      heading below is what actually gets read out. */}
                  <span aria-hidden className="font-heading text-micro tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-2.5 max-w-[15ch] font-heading text-small text-ink">
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
          <div className="2xl:grid 2xl:grid-cols-[0.53fr_1fr] 2xl:items-start 2xl:gap-x-16">
            <SplitHeading className="font-display text-display-2">{t.home.goalsTitle}</SplitHeading>
            {/* The draft's own sentence used to name a count of pillars —
                "four" — that its pillars slide, two sections up, contradicted
                with five. The clause was dropped rather than arbitrated: the
                site should not pick a side on a number the council is still
                settling. The 16 August draft has settled it, and reads "aligned
                with five sustainability pillars"; the clause could be restored
                now, but the deck still does not say which goals sit under which
                pillar, so restoring it would put a count on the page that
                nothing below it can show.

                The vision is named as the vision section names it, not as
                "Sustainable Addu City". The draft's sentence still has not
                caught up with its own rename, so carrying it verbatim would
                have the page calling the same thing two names within one
                scroll. */}
            <p className="mt-5 max-w-[68ch] text-lead text-slate 2xl:mt-2.5">{t.home.goalsBody}</p>
          </div>

          <GoalGrid locale={lang} />
        </div>
      </section>

      {/* -------------------------------------------------------- Initiatives */}
      <section id="initiatives" className="scroll-mt-24 py-20 sm:py-32">
        <div className="shell">
          <div className="2xl:grid 2xl:grid-cols-[0.53fr_1fr] 2xl:items-start 2xl:gap-x-16">
            <SplitHeading className="max-w-[16ch] font-display text-display-2 font-bold">
              {initiativesIntro.title}
            </SplitHeading>
            <p className="mt-6 max-w-[68ch] text-lead text-slate 2xl:mt-2.5">
              {initiativesIntro.body}
            </p>
          </div>

          {/* Three across once the container has the width for it. At two, a
              wide viewport gave each initiative a 712px line for a 139px block
              of text — a strip rather than a card. */}
          <ol
            className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2 xl:grid-cols-3"
            data-reveal-stagger="0.06"
          >
            {initiatives.map((item) => (
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
          {/* Two ways in, side by side once there is width for them.

              The left column is the plan's own invitation — read a goal, answer
              its actions — and it used to be the only one. That suited the site
              exactly as far as a reader who wanted to answer an action; a reader
              who wanted to answer the plan had to pick an action to say it
              under. The box on the right is for them, and it belongs here rather
              than in a thirteenth goal page: this is the block a reader who has
              finished the page arrives at with something to say.

              It sits beside the invitation, not below it, so neither reads as
              the afterthought. The left column keeps its 54ch measure; the
              slack goes to the box.

              The lede here used to end "Nothing is sent until you have reviewed
              them", which stopped being true when the basket started sending
              itself — and it would have been read as covering this box too. */}
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
            <div className="max-w-[54ch]">
              <SplitHeading className="max-w-[18ch] font-display text-display-2 font-bold">
                {t.home.feedbackTitle}
              </SplitHeading>
              <p className="mt-7 text-lead text-slate">
                {fill(t.home.feedbackBody, { count: TOTAL_ACTIONS })}
              </p>
              <Link
                href={localePath(lang, `/goals/${goals[0]!.slug}`)}
                transitionTypes={['page-forward']}
                className="group mt-9 inline-flex items-center gap-2.5 rounded-full bg-navy px-6 py-3.5 font-heading text-small text-white transition-colors hover:bg-navy-deep"
              >
                <Icon icon={Comment01Icon} size={17} />
                {t.home.startWithGoalOne}
                <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                  <Icon icon={ArrowRight02Icon} size={17} directional />
                </span>
              </Link>
            </div>

            <PlanComment />
          </div>
        </div>
      </section>
    </ViewTransition>
  )
}
