import Link from 'next/link'
import ArrowRight02Icon from '@hugeicons/core-free-icons/ArrowRight02Icon'
import Comment01Icon from '@hugeicons/core-free-icons/Comment01Icon'
import { Icon } from '@/components/ui/icon'
import { Hero } from '@/components/home/hero'
import { ReefDivider } from '@/components/home/reef-divider'
import { StatCounter } from '@/components/home/stat-counter'
import { AtollMap } from '@/components/home/atoll-map'
import { PopulationGap, PopulationSources } from '@/components/home/population-gap'
import { Vision } from '@/components/home/vision'
import { SplitHeading } from '@/components/motion/split-heading'
import { GoalGrid } from '@/components/plan/goal-grid'
import { ViewTransition } from '@/components/motion/view-transition'
import { PILLAR_GLYPHS } from '@/lib/pillar-glyphs'
import {
  GOALS,
  HEADLINE_FACTS,
  INITIATIVES,
  INITIATIVES_INTRO,
  LAND,
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
              {TURNING_POINT.title}
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
              {TURNING_POINT.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>

            <dl
              className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-hairline pt-10 lg:grid-cols-4 2xl:col-start-1 2xl:row-start-2 2xl:mt-12 2xl:grid-cols-2 2xl:self-end"
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
              {/* "Communities" left the reader counting a different thing to
                  the list underneath, which names islands. One noun, used
                  everywhere: the headline facts say "islands in the city" too. */}
              <SplitHeading className="font-display text-display-3 font-bold">
                One atoll, four islands, one city
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

            {/* Capped, and centred in what is left. The drawing's island names
                are sized for the ~530px the comment in atoll-map.tsx assumes;
                given the full half-shell it renders at 675 and everything on it
                — labels, markers, road — comes up a fifth larger than drawn
                for, which is most of why the section shouted. At its intended
                size it also stops towering over the copy beside it. */}
            <div data-reveal="fade" className="mx-auto w-full max-w-[34rem]">
              <AtollMap />
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
            {/* No heading. The figure below opens with 9,710 set at display
                size and finishes the sentence in words — it is already the
                clearest statement of the section, and a small grey line above
                it was only saying the same thing quietly first. */}

            {/* Claim on the left, everything that qualifies it on the right —
                the earlier comparison, the two figures the sum comes from, and
                the year the register runs ahead of. The qualifiers used to sit
                under the number while the right-hand column held two lines and
                230px of nothing; split this way the columns come out level. */}
            <div className="grid gap-x-20 gap-y-8 lg:grid-cols-2 lg:items-start">
              <PopulationGap />
              <div className="max-w-[46ch]">
                {/* States the target, and stops there. It used to add that
                    closing the gap "is what the whole plan is for", which is a
                    claim about the plan that this section's figures do not
                    make. */}
                <p className="text-lead text-slate">
                  In 1977 the gap was 705 people. The plan sets a target of 35,000 people living in
                  Addu by 2030.
                </p>
                <PopulationSources />

                {/* A control, not a text link. This is the only route to the
                    evidence from the home page and it was competing with two
                    lines of grey source notes directly above it; given a border
                    and a target it reads as somewhere to go. It names what is
                    on the other end rather than saying "read more", so the
                    reader knows whether the trip is worth making. */}
                <Link
                  href="/background"
                  transitionTypes={['page-forward']}
                  className="group mt-6 inline-flex items-center gap-3 rounded-full border border-hairline bg-white px-5 py-3 text-small font-semibold text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white"
                >
                  Settlement history and the counts year by year
                  <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1">
                    <Icon icon={ArrowRight02Icon} size={16} />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Vision />

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
              {PILLARS_INTRO.title}
            </SplitHeading>
            <p className="mt-8 max-w-[68ch] text-lead text-slate 2xl:mt-2.5">{PILLARS_INTRO.body}</p>
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
                // Numeral and heading as one block at the top, rather than
                // pushed to opposite ends. It frees the whole bottom of the
                // tile for the glyph, which is the only arrangement where the
                // drawing can sit bottom-right at full strength and still be
                // nowhere near the white type.
                className="relative isolate flex min-h-44 flex-col gap-3 overflow-hidden p-6 text-white sm:min-h-[13rem]"
                // The accessible variant, not the plate colour. White on three
                // of the four printed colours measures 2.7–3.3:1, which fails
                // for a tile that carries its own label. Same hue, legible.
                style={{ background: pillar.textColor }}
              >
                {/* Faded once, as a whole drawing.

                    `opacity` on this span, not `text-white/25` on the glyph.
                    The colour form puts the alpha on `currentColor`, so every
                    path is stroked at 25% and paints over the ones already
                    down — so wherever two strokes crossed, the crossing came
                    out brighter than the lines forming it and each icon read as
                    a set of seams rather than one drawing. `opacity` flattens
                    the subtree first and fades the result once, so a crossing
                    is the same value as the stroke.

                    Sitting on the tile's bottom edge, and allowed to run under
                    the heading. Treated as ground rather than as a mark that
                    has to keep out of the way.

                    Worth knowing what that costs: white over a plate lifts it,
                    and these headings are white. Infrastructure's orange
                    measures 4.84:1 against white and drops to about 3.2 where a
                    stroke passes behind a letter, which is under the 4.5:1 that
                    size of type wants. It is a few pixels of thin stroke rather
                    than a solid ground, and only on the lightest of the five
                    plates — but if that ever needs to go, the fix is the
                    opacity here, not the position. */}
                <span
                  aria-hidden
                  // `-bottom-2.5`, not `bottom-0`. A Hugeicons glyph is drawn
                  // inside its 24-unit box with room to spare, so aligning the
                  // box to the card's edge leaves the drawing floating 6px
                  // above it. The offset is that padding, measured.
                  className="pointer-events-none absolute right-3 -bottom-2.5 -z-10 text-white opacity-25"
                >
                  <Icon
                    icon={PILLAR_GLYPHS[pillar.id]}
                    weight={1.25}
                    className="h-[92px] w-[92px] sm:h-[124px] sm:w-[124px]"
                  />
                </span>

                {/* Ornamental: it numbers the five for the eye, and the
                    heading below is what actually gets read out.

                    Full white, not a translucent one. At `white/60` the five
                    numerals measured 2.7:1 on Infrastructure's orange against
                    6.4:1 on People's purple — the plates are nowhere near a
                    common luminance, so one alpha cannot hold one contrast,
                    and the row read as four numerals and a smudge. No alpha
                    fixes it either: the orange still misses 4.5:1 at 90%.
                    Recession comes from size and tracking instead, which is
                    how `eyebrow` already does it. */}
                <span aria-hidden className="font-heading text-micro text-white tabular-nums">
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
          <div className="2xl:grid 2xl:grid-cols-[0.53fr_1fr] 2xl:items-start 2xl:gap-x-16">
            <SplitHeading className="font-display text-display-2">Twelve goals</SplitHeading>
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
            <p className="mt-5 max-w-[68ch] text-lead text-slate 2xl:mt-2.5">
              Twelve goals carry the vision of a resilient, inclusive, sustainable Addu. Open any
              goal to read its targets and comment on each action.
            </p>
          </div>

          <GoalGrid />
        </div>
      </section>

      {/* -------------------------------------------------------- Initiatives */}
      <section id="initiatives" className="scroll-mt-24 py-20 sm:py-32">
        <div className="shell">
          <div className="2xl:grid 2xl:grid-cols-[0.53fr_1fr] 2xl:items-start 2xl:gap-x-16">
            <SplitHeading className="max-w-[16ch] font-display text-display-2 font-bold">
              {INITIATIVES_INTRO.title}
            </SplitHeading>
            <p className="mt-6 max-w-[68ch] text-lead text-slate 2xl:mt-2.5">
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
          {/* One column, and three sentences.

              This used to be a lede beside a numbered 01/02/03 list — read a
              goal, react to each action, review and send. Every line of it
              described something the reader is about to be shown: the goal page
              names its own sections, the three reaction buttons are labelled,
              and the review panel opens itself the moment anything is in it. A
              set of instructions for an interface that explains itself is a
              section-worth of scrolling spent on nothing, immediately before the
              one button that matters. The steps are gone and the paragraph
              keeps only what the reader cannot see from here: that the count is
              large, that a comment is optional, and that nothing is sent until
              they say so. */}
          <div className="max-w-[54ch]">
            <SplitHeading className="max-w-[18ch] font-display text-display-2 font-bold">
              Tell us what to change.
            </SplitHeading>
            <p className="mt-7 text-lead text-slate">
              Every one of the {TOTAL_ACTIONS} actions in this plan takes a response — support it,
              say you are unsure, or raise a concern, and add a comment if you want to explain.
              Nothing is sent until you have reviewed them.
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
        </div>
      </section>
    </ViewTransition>
  )
}
