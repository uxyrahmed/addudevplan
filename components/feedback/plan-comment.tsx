'use client'

import { useId, useRef } from 'react'
import SentIcon from '@hugeicons/core-free-icons/SentIcon'
import Delete02Icon from '@hugeicons/core-free-icons/Delete02Icon'
import Tick02Icon from '@hugeicons/core-free-icons/Tick02Icon'
import { Icon } from '@/components/ui/icon'
import { MAX_COMMENT_LENGTH } from '@/lib/feedback-limits'
import { OVERALL_ID } from '@/lib/feedback-scope'
import { useCommentDraft } from './use-comment-draft'
import { useLocale } from '@/components/i18n/locale-provider'

/** Show the count only once the limit is close enough to matter. */
const COUNTER_FROM = MAX_COMMENT_LENGTH - 400

/**
 * One box for the plan itself, rather than for any action in it.
 *
 * The site is built on the opposite idea — that a resident should answer a
 * specific action rather than a document — and that stands. But it left the
 * reader who wants to say something about the plan as a whole picking an action
 * to say it under, which files their point in the wrong place and makes the
 * council read 230 rows to find it. This gives that answer somewhere to go.
 *
 * No reactions. Three buttons on the whole document would produce a single
 * for-or-against number on the plan, which is a different exercise from the one
 * the council is running and not one this consultation was designed to hold.
 * Words only, which is what the reader who comes looking for this wants anyway.
 *
 * Open, not behind a chip: unlike the per-action control, this appears once on
 * the page and is the entire point of the block it sits in.
 */
export function PlanComment() {
  const { t } = useLocale()
  const fieldId = useId()
  const field = useRef<HTMLTextAreaElement>(null)
  const { value, posted, trimmed, setDraft, unposted, canPost, post, discard } =
    useCommentDraft(OVERALL_ID)

  return (
    <div className="rounded-3xl border border-hairline bg-white p-6 sm:p-7">
      {/* The heading names the field rather than a hidden `label` repeating it,
          so a screen reader hears the same words a reader sees.

          It stands alone. A paragraph under it explaining that not everything
          belongs to one action was saying what the heading and the placeholder
          already say between them, and paid three lines for it. */}
      <h3 id={`${fieldId}-title`} className="font-heading text-title text-ink">
        {t.planComment.title}
      </h3>

      <textarea
        ref={field}
        id={fieldId}
        rows={5}
        value={value}
        maxLength={MAX_COMMENT_LENGTH}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            post()
          }
        }}
        placeholder={t.planComment.placeholder}
        aria-labelledby={`${fieldId}-title`}
        aria-describedby={`${fieldId}-state`}
        className="mt-4 w-full resize-y rounded-2xl border border-hairline bg-shell px-4 py-3 text-small text-ink placeholder:text-mist focus:border-navy focus:bg-white focus:outline-none"
      />

      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        {/* Speaks only where the buttons cannot.

            A draft says nothing here: the Post button lighting up already says
            there is something unposted, and a line repeating it — with the
            keyboard shortcut after it — was a sentence charged for saying what
            the control beside it says for free. What is left is the one state
            no button shows: a box emptied while a comment is still filed. */}
        <p id={`${fieldId}-state`} className="text-micro tracking-normal text-mist">
          {unposted && !trimmed ? (
            t.control.clearedHereOnly
          ) : !unposted && posted ? (
            <span className="inline-flex items-center gap-1.5 text-stone">
              <Icon icon={Tick02Icon} size={14} />
              {t.control.postedWithFeedback}
            </span>
          ) : null}
          {value.length > COUNTER_FROM ? (
            <span className="tabular-nums">
              {' '}
              · {value.length}/{MAX_COMMENT_LENGTH}
            </span>
          ) : null}
        </p>

        <div className="flex shrink-0 items-center gap-1.5">
          {posted ? (
            <button
              type="button"
              onClick={() => {
                discard()
                field.current?.focus()
              }}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 py-1.5 text-small font-semibold text-stone transition-colors hover:text-plum"
            >
              <Icon icon={Delete02Icon} size={15} />
              {t.control.remove}
            </button>
          ) : null}

          <button
            type="button"
            onClick={post}
            disabled={!canPost}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-navy px-5 py-2 text-small font-bold text-white transition-colors hover:bg-navy-deep disabled:cursor-default disabled:bg-hairline disabled:text-mist"
          >
            <Icon icon={SentIcon} size={15} />
            {posted ? t.control.update : t.control.post}
          </button>
        </div>
      </div>
    </div>
  )
}
