import { SplitHeading } from '@/components/motion/split-heading'
import { LATEST_POPULATION, TARGET_RESIDENTS, VISION, fmt } from '@/lib/plan'

/**
 * The hinge of the page: the moment the plan turns from diagnosis to intent.
 *
 * The plan's own wording is already one sentence that ends in the figure
 * ("…for young professionals with" → "35,000 residents by 2030"), so it is set
 * as a sentence that lands on the number rather than four centred blocks.
 *
 * An earlier version carried a measure bar from today's population to the 2030
 * target. It was removed: with nothing filled to the left of the marker it read
 * as a progress bar running the wrong way, and the same gap is already made
 * properly — and at length — in the out-migration section above. A graphic that
 * needs a caption to stop it misleading is not worth its height.
 *
 * The background is flat navy, not a gradient — a variable ground would make
 * every contrast ratio in the section a range instead of a number.
 */
export function Vision() {
  return (
    <section id="vision" className="scroll-mt-24 bg-navy py-20 text-white sm:py-28">
      <div className="shell">
        {/* A rule instead of the tracked uppercase eyebrow used elsewhere —
            this is the one section marked as a chapter break. */}
        <div className="flex items-center gap-5">
          <span className="font-heading text-small whitespace-nowrap text-white/70">
            {VISION.kicker}
          </span>
          <span aria-hidden data-reveal="draw" className="h-px flex-1 bg-white/25" />
        </div>

        <div className="mt-10 grid gap-y-8 lg:mt-14 lg:grid-cols-12 lg:items-baseline lg:gap-x-10">
          <h2 className="font-display text-display-3 !text-white lg:col-span-4">{VISION.name}</h2>

          <div className="lg:col-span-7 lg:col-start-6">
            {/* `as="p"` keeps the name as the section's only heading, so the
                split reveal here does not rhyme with every section opener. */}
            <SplitHeading
              as="p"
              delay={0.12}
              className="max-w-[30ch] font-display text-title leading-[1.34] text-white/75"
            >
              {VISION.headline}
            </SplitHeading>

            {/* Two lines rather than one flow: at these sizes a single space
                between a 76px numeral and a 42px word all but disappears. */}
            <p className="mt-6 font-heading" data-reveal="up">
              <span className="block text-display-1 leading-[0.95] tracking-[-0.03em] tabular-nums !text-white">
                {fmt(TARGET_RESIDENTS)}
              </span>
              <span className="mt-1 block text-display-3 text-white/75">residents by 2030</span>
            </p>

            <p className="mt-7 max-w-[38ch] text-small text-white/70">
              {fmt(LATEST_POPULATION.registered)} people are already registered in Addu — the
              target is the city filling back up to its own register, not invented growth.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
