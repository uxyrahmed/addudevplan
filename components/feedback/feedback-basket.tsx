'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import Comment01Icon from '@hugeicons/core-free-icons/Comment01Icon'
import { Icon } from '@/components/ui/icon'
import { useFeedback } from './feedback-store'

/**
 * The review panel needs the whole plan (to label every response) and an
 * animation library. Neither is worth downloading for a visitor who has not
 * responded to anything yet, so the panel is a separate chunk fetched the
 * first time it is opened. The launcher below is a button and a count.
 */
const FeedbackPanel = dynamic(() => import('./feedback-panel').then((m) => m.FeedbackPanel), {
  ssr: false,
})

export function FeedbackBasket() {
  const { count, ready } = useFeedback()
  const [open, setOpen] = useState(false)

  if (!ready || count === 0) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="basket-launcher fixed bottom-4 left-1/2 z-[130] flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-navy px-5 py-3.5 text-small font-bold text-white shadow-[0_10px_40px_-8px_rgba(0,77,128,0.6)] transition-colors hover:bg-navy-deep sm:bottom-6"
      >
        <Icon icon={Comment01Icon} size={17} />
        <span>
          {count} {count === 1 ? 'response' : 'responses'}
        </span>
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-micro tracking-normal">
          Review
        </span>
      </button>

      {open ? <FeedbackPanel onClose={() => setOpen(false)} /> : null}
    </>
  )
}
