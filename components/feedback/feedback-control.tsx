'use client'

import { useId, useRef, useState } from 'react'
import ThumbsUpIcon from '@hugeicons/core-free-icons/ThumbsUpIcon'
import ThumbsDownIcon from '@hugeicons/core-free-icons/ThumbsDownIcon'
import Comment01Icon from '@hugeicons/core-free-icons/Comment01Icon'
import Tick02Icon from '@hugeicons/core-free-icons/Tick02Icon'
import SentIcon from '@hugeicons/core-free-icons/SentIcon'
import Delete02Icon from '@hugeicons/core-free-icons/Delete02Icon'
import { Icon, type IconData } from '@/components/ui/icon'
import { MAX_COMMENT_LENGTH } from '@/lib/feedback-limits'
import { OFFERED_REACTIONS, REACTION_META, type OfferedReaction } from '@/lib/reactions'
import { useFeedback } from './feedback-store'
import { useCommentDraft } from './use-comment-draft'
import { useLocale } from '@/components/i18n/locale-provider'
import { fill } from '@/lib/i18n/format'
import { reactionWords } from '@/lib/i18n/reactions'

/**
 * The glyph is the whole button. A thumb up and a thumb down need no caption
 * beside them, so the word each one stands for is carried by the accessible
 * name alone and never printed.
 */
const REACTION_ICON: Record<OfferedReaction, IconData> = {
  support: ThumbsUpIcon,
  concern: ThumbsDownIcon,
}

/** Show the count only once the limit is close enough to matter. */
const COUNTER_FROM = MAX_COMMENT_LENGTH - 400

type Props = {
  /** Stable id from lib/plan.ts — this is the feedback key. */
  id: string
  /** What the visitor is responding to, used for the accessible names. */
  subject: string
  accent: string
}

/**
 * The site's one job, repeated: let someone react to a single action and say
 * why. Compact by default, expands only when there is something to say.
 *
 * A reaction is a single click and goes on its own — the basket sends itself
 * shortly after. A comment does not: half a sentence is not a comment, and a
 * field that filed every keystroke would put a resident's unfinished thinking
 * in front of the council. So the comment is posted deliberately, with a button
 * and with ⌘/Ctrl+Enter, and until it is posted the field says so.
 */
export function FeedbackControl({ id, subject, accent }: Props) {
  const { t } = useLocale()
  const { feedback, setReaction } = useFeedback()
  const entry = feedback[id]
  const fieldId = useId()
  const field = useRef<HTMLTextAreaElement>(null)

  // Typing, posting and removing follow the same rule here as in the box for
  // the plan as a whole, so the rule lives in one place.
  const { value, posted, trimmed, setDraft, unposted, canPost, post, discard } = useCommentDraft(id)

  // `null` until the chip is used, so the field opens by itself for an action
  // that already carries a comment and the toggle still works either way. The
  // old `open || hasComment` made the chip inert the moment a comment existed:
  // it could be opened and never closed again.
  const [open, setOpen] = useState<boolean | null>(null)
  const showComment = open ?? Boolean(posted)

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {OFFERED_REACTIONS.map((r) => {
          const active = entry?.reaction === r
          const { color } = REACTION_META[r]
          return (
            <button
              key={r}
              type="button"
              onClick={() => setReaction(id, r)}
              aria-pressed={active}
              aria-label={fill(t.control.reactionAria, {
                label: reactionWords(t, r).label,
                subject,
              })}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-200"
              style={{
                borderColor: active ? color : 'var(--color-hairline)',
                background: active ? color : 'transparent',
                color: active ? '#fff' : 'var(--color-stone)',
              }}
            >
              <Icon icon={REACTION_ICON[r]} size={18} />
            </button>
          )
        })}

        <button
          type="button"
          onClick={() => {
            setOpen(!showComment)
            if (!showComment) requestAnimationFrame(() => field.current?.focus())
          }}
          aria-expanded={showComment}
          aria-controls={fieldId}
          // The dot's meaning belongs in here, not in an `sr-only` span beside
          // it: an `aria-label` replaces the element's contents outright, so
          // nothing written inside this button is ever announced.
          aria-label={`${fill(posted ? t.control.editCommentAria : t.control.addCommentAria, {
            subject,
          })}${unposted ? t.control.notPostedSuffix : ''}`}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-hairline px-4 py-2 text-small font-semibold text-stone transition-colors hover:border-navy hover:text-navy"
        >
          <Icon icon={Comment01Icon} size={15} />
          <span>{posted ? t.control.commentAdded : t.control.comment}</span>
          {unposted ? (
            /* A draft that has not been posted, so it is still visible once the
               field is collapsed. Amber, the palette's own unfinished colour;
               the button's label carries the same thing in words. */
            <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-[#EE8A12]" />
          ) : posted ? (
            <Icon icon={Tick02Icon} size={14} style={{ color: accent }} />
          ) : null}
        </button>
      </div>

      {/* A CSS grid row that eases from 0fr to 1fr. A goal page renders up to
          48 of these, so the disclosure is plain CSS rather than 48 mounted
          animation components. */}
      <div className="collapse-row" data-open={showComment ? '' : undefined}>
        <div className="min-h-0 overflow-hidden">
          <label htmlFor={fieldId} className="sr-only">
            {fill(t.control.yourCommentOn, { subject })}
          </label>
          <textarea
            ref={field}
            id={fieldId}
            rows={3}
            value={value}
            maxLength={MAX_COMMENT_LENGTH}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                post()
              }
            }}
            placeholder={t.control.placeholder}
            tabIndex={showComment ? undefined : -1}
            aria-hidden={showComment ? undefined : true}
            aria-describedby={`${fieldId}-state`}
            className="mt-2.5 w-full resize-y rounded-2xl border border-hairline bg-shell px-4 py-3 text-small text-ink placeholder:text-mist focus:border-navy focus:bg-white focus:outline-none"
          />

          <div className="mt-2 mb-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            {/* Speaks only where the buttons cannot.

                A draft says nothing here. The Post button lighting up, and the
                amber dot on the chip that survives the field being collapsed,
                already say there is something unposted — a line repeating it in
                words, with the keyboard shortcut trailing after, was paying for
                what the controls beside it say for free. The chip's own
                `aria-label` still carries "not posted yet" for a reader who
                cannot see the dot. */}
            <p id={`${fieldId}-state`} className="text-micro tracking-normal text-mist">
              {unposted && !trimmed ? (
                // Emptied the box, but the posted comment is still in the
                // basket — the one state no control on the row shows.
                t.control.clearedHereOnly
              ) : !unposted && posted ? (
                t.control.postedWithFeedback
              ) : null}
              {value.length > COUNTER_FROM ? (
                <span className="tabular-nums">
                  {' '}
                  · {value.length}/{MAX_COMMENT_LENGTH}
                </span>
              ) : null}
            </p>

            {/* Out of reach while the field is collapsed, the same way the
                field itself is: these sit inside a `0fr` grid row, which hides
                them visually but leaves them tabbable. */}
            <div
              className="flex shrink-0 items-center gap-1.5"
              aria-hidden={showComment ? undefined : true}
            >
              {posted ? (
                <button
                  type="button"
                  onClick={() => {
                    discard()
                    field.current?.focus()
                  }}
                  tabIndex={showComment ? undefined : -1}
                  aria-label={fill(t.control.removeCommentAria, { subject })}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 py-1.5 text-small font-semibold text-stone transition-colors hover:text-plum"
                >
                  <Icon icon={Delete02Icon} size={14} />
                  {t.control.remove}
                </button>
              ) : null}

              <button
                type="button"
                onClick={post}
                disabled={!canPost}
                tabIndex={showComment ? undefined : -1}
                aria-label={fill(
                  posted ? t.control.updateCommentAria : t.control.postCommentAria,
                  { subject },
                )}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-navy px-4 py-1.5 text-small font-bold text-white transition-colors hover:bg-navy-deep disabled:cursor-default disabled:bg-hairline disabled:text-mist"
              >
                <Icon icon={SentIcon} size={14} />
                {posted ? t.control.update : t.control.post}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
