'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import ArrowDown01Icon from '@hugeicons/core-free-icons/ArrowDown01Icon'
import ArrowRight02Icon from '@hugeicons/core-free-icons/ArrowRight02Icon'
import { Icon } from '@/components/ui/icon'
import { SplitHeading } from '@/components/motion/split-heading'
import { loadGsap } from '@/lib/gsap'
import { canAnimateRichly } from '@/lib/motion-prefs'
import { useLocale } from '@/components/i18n/locale-provider'

/**
 * Opening slide. The White Tern — endemic to Addu and the plan's own cover
 * animal — drifts on a slow parallax while the title lines rise.
 */
export function Hero() {
  const { t, plan, href } = useLocale()
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return

    const staged = () => Array.from(el.querySelectorAll<HTMLElement>('[data-enter]'))
    const show = () => staged().forEach((n) => n.setAttribute('data-entered', ''))

    if (!canAnimateRichly() || document.visibilityState === 'hidden') {
      show()
      return
    }

    let cancelled = false
    let cleanup: (() => void) | undefined
    const watchdog = window.setTimeout(show, 2000)

    loadGsap()
      .then(({ gsap }) => {
        if (cancelled) return show()

        const ctx = gsap.context(() => {
          gsap.to('[data-hero-image]', {
            yPercent: 14,
            scale: 1.08,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
          })

          // Seed the start state, unhide, then animate — the panel is never
          // painted at rest first. Inline opacity from gsap.set outranks the
          // CSS `data-entered` rule, so unhiding alone does not reveal it.
          gsap.set('[data-hero-meta], [data-hero-cta]', { y: 18, opacity: 0 })
          show()
          gsap.to('[data-hero-meta]', { y: 0, opacity: 1, delay: 0.85, duration: 1 })
          gsap.to('[data-hero-cta]', { y: 0, opacity: 1, delay: 1, duration: 1, stagger: 0.08 })
        }, el)

        cleanup = () => ctx.kill(false)
      })
      .catch(show)

    return () => {
      cancelled = true
      window.clearTimeout(watchdog)
      cleanup?.()
    }
  }, [])

  return (
    <section ref={root} data-dark-hero className="relative isolate overflow-hidden bg-navy">
      <div className="absolute inset-0 -z-10">
        <div data-hero-image className="absolute inset-0 will-change-transform">
          <Image
            src="/plan/hero/white-tern.jpg"
            alt={t.hero.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/72 via-navy/45 to-navy/92" />
      </div>

      {/* The reef divider occupies the last 5rem of this section, so the
          content stops short of it rather than colliding with the swell. */}
      <div className="shell flex min-h-[92svh] flex-col justify-end pt-28 pb-32 sm:min-h-[96svh] sm:pb-36">
        <SplitHeading
          as="h1"
          immediate
          delay={0.15}
          className="max-w-[22ch] font-display text-display-1 !text-white"
        >
          {plan.title}
        </SplitHeading>

        <p
          data-hero-meta
          data-enter=""
          className="mt-4 font-heading text-[clamp(2rem,5vw,3.5rem)] leading-none text-white/90"
        >
          {plan.period}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-4">
          <Link
            data-hero-cta
            data-enter=""
            href={href('/#goals')}
            className="group inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 font-heading text-small text-navy transition-colors hover:bg-sky hover:text-white"
          >
            {t.hero.exploreGoals}
            <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
              <Icon icon={ArrowRight02Icon} size={18} directional />
            </span>
          </Link>

          <a
            href="#turning-point"
            data-hero-cta
            data-enter=""
            className="inline-flex items-center gap-2.5 rounded-full px-4 py-3.5 text-small text-white/75 transition-colors hover:text-white"
          >
            <span className="grid h-8 w-8 animate-bounce place-items-center rounded-full border border-white/35 motion-reduce:animate-none">
              <Icon icon={ArrowDown01Icon} size={16} />
            </span>
            {t.hero.startReading}
          </a>
        </div>
      </div>
    </section>
  )
}
