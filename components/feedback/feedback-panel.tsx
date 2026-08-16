'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Cancel01Icon from '@hugeicons/core-free-icons/Cancel01Icon'
import SentIcon from '@hugeicons/core-free-icons/SentIcon'
import Delete02Icon from '@hugeicons/core-free-icons/Delete02Icon'
import Download01Icon from '@hugeicons/core-free-icons/Download01Icon'
import CheckmarkCircle02Icon from '@hugeicons/core-free-icons/CheckmarkCircle02Icon'
import AlertCircleIcon from '@hugeicons/core-free-icons/AlertCircleIcon'
import Loading03Icon from '@hugeicons/core-free-icons/Loading03Icon'
import ArrowRight01Icon from '@hugeicons/core-free-icons/ArrowRight01Icon'
import ArrowDown01Icon from '@hugeicons/core-free-icons/ArrowDown01Icon'
import { Icon } from '@/components/ui/icon'
import { GOALS, TOTAL_ACTIONS } from '@/lib/plan'
import { REACTIONS, useFeedback } from './feedback-store'

/** action id -> where it sits, for labelling the review list. */
const INDEX = new Map(
  GOALS.flatMap((goal) =>
    goal.strategies.flatMap((strategy) =>
      strategy.actions.map((action) => [action.id, { goal, strategy, action }] as const),
    ),
  ),
)

const REACTION_BY_ID = new Map(REACTIONS.map((r) => [r.id, r]))

/** Time of day for "sent at", in the reader's own locale and clock. */
const TIME = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })

/**
 * Three plates for the send status: settled, in hand, and not landed. Tinted
 * from the same three colours the reactions use, so the panel's palette says
 * the same things the controls do.
 */
const TONE = {
  done: { tint: 'color-mix(in oklab, #178E6B 10%, white)', ink: '#0f6b51' },
  working: { tint: 'var(--color-shell)', ink: 'var(--color-stone)' },
  trouble: { tint: 'color-mix(in oklab, #970E53 9%, white)', ink: '#7c0b45' },
} as const

/** Every action in a goal, in plan order. Static, so it is built once. */
const GOAL_ACTION_IDS = new Map(
  GOALS.map((goal) => [
    goal.number,
    goal.strategies.flatMap((strategy) => strategy.actions.map((action) => action.id)),
  ]),
)

/**
 * The guide through the twelve goals, and the place a resident reads back what
 * they have already sent.
 *
 * It no longer gates the sending. Answers go on their own, so the footer states
 * where the basket has got to instead of asking for one more click that a
 * consultation filled in over several visits was always going to lose people
 * on.
 *
 * It used to be a flat list of whatever you had answered, which meant the one
 * screen that could show you the shape of the consultation showed you only the
 * part you had already done — twelve goals and 230 actions were never named,
 * and there was no way to tell "I have finished" from "I have started".
 *
 * All twelve are listed now, in plan order, whether or not you have touched
 * them. Each carries its own progress; the ones you have answered open to show
 * what you said; the ones you have not are a link into them. The same list is
 * both the record and the way onward, which is what stops a review panel from
 * being a dead end.
 */
export function FeedbackPanel({ onClose }: { onClose: () => void }) {
  const { feedback, count, countFor, clearAll, remove, status, error, revised, savedAt, saveNow } =
    useFeedback()
  const closeRef = useRef<HTMLButtonElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const [openGoal, setOpenGoal] = useState<number | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [clearing, setClearing] = useState(false)

  // Opened by choice, so move focus into it and let Escape close it.
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      // Escape belongs to the innermost thing that is open. Without this it
      // would close the panel out from under the confirmation, which reads as
      // the deletion having gone ahead.
      if (confirming) setConfirming(false)
      else onClose()
    }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [onClose, confirming])

  // Focus lands on Cancel, not on the destructive button: a confirmation that
  // arms the dangerous option is not a confirmation.
  useEffect(() => {
    if (confirming) cancelRef.current?.focus()
  }, [confirming])

  async function confirmClear() {
    setClearing(true)
    await clearAll()
    setClearing(false)
    setConfirming(false)
  }

  /** Your answers, grouped by goal and kept in plan order within each. */
  const answersByGoal = useMemo(() => {
    const byGoal = new Map<number, { id: string; label: string; strategy: string }[]>()
    for (const id of Object.keys(feedback)) {
      const hit = INDEX.get(id)
      if (!hit) continue
      const list = byGoal.get(hit.goal.number) ?? []
      list.push({ id, label: hit.action.text, strategy: hit.strategy.title })
      byGoal.set(hit.goal.number, list)
    }
    return byGoal
  }, [feedback])

  const goalsStarted = GOALS.filter(
    (goal) => countFor(GOAL_ACTION_IDS.get(goal.number) ?? []) > 0,
  ).length

  // Short on purpose. This is a status line, not an explanation: a resident
  // reads it to find out whether their answers landed, and every extra clause
  // is one more thing between them and that.
  const state = useMemo(() => {
    switch (status) {
      case 'saving':
        return { ...TONE.working, icon: Loading03Icon, message: 'Sending…' }
      case 'pending':
        return { ...TONE.working, icon: SentIcon, message: 'Sending shortly' }
      case 'error':
        return {
          ...TONE.trouble,
          icon: AlertCircleIcon,
          message: error ?? 'Not sent yet. Your answers are saved on this device.',
        }
      case 'saved':
        return {
          ...TONE.done,
          icon: CheckmarkCircle02Icon,
          message: savedAt
            ? `${revised ? 'Updated' : 'Sent'} at ${TIME.format(savedAt)}`
            : revised
              ? 'Updated'
              : 'Sent',
        }
      default:
        return { ...TONE.working, icon: SentIcon, message: 'Your answers send themselves' }
    }
  }, [status, error, revised, savedAt])

  function download() {
    const payload = {
      plan: 'Addu Development Plan 2026–2031',
      exportedAt: new Date().toISOString(),
      responses: GOALS.flatMap((goal) =>
        (answersByGoal.get(goal.number) ?? []).map((item) => ({
          goal: `${goal.number}. ${goal.title}`,
          strategy: item.strategy,
          action: item.label,
          reaction: feedback[item.id]?.reaction ?? null,
          comment: feedback[item.id]?.comment?.trim() || null,
        })),
      ),
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'addu-plan-feedback.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div onClick={onClose} className="panel-scrim fixed inset-0 z-[140] bg-ink/45" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your feedback on the plan"
        className="panel-sheet fixed inset-x-0 bottom-0 z-[150] flex max-h-[88dvh] flex-col rounded-t-[28px] bg-white sm:inset-y-0 sm:right-0 sm:left-auto sm:max-h-none sm:w-[min(31rem,100vw)] sm:rounded-t-none sm:rounded-l-[28px]"
      >
        <header className="border-b border-hairline px-6 pt-6 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-title">Your feedback</h2>
              <p className="mt-1 text-small text-stone tabular-nums">
                {count} of {TOTAL_ACTIONS} actions · {goalsStarted} of {GOALS.length} goals started
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-1 rounded-full p-2 text-stone transition-colors hover:bg-shell hover:text-ink"
            >
              <Icon icon={Cancel01Icon} size={20} />
            </button>
          </div>
        </header>

        {/* `data-lenis-prevent`, or this list does not scroll at all on a
            pointer device.

            Lenis takes wheel and touch events at the document and drives the
            page from its own rAF loop, which means it swallows the event before
            a nested `overflow-y: auto` container ever sees it. The attribute is
            Lenis's own opt-out: events inside this element are left to the
            browser. It went unnoticed while the panel only listed what you had
            already answered — that list was rarely long enough to overflow.
            Listing all twelve goals it always is. */}
        <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <ol className="divide-y divide-hairline border-y border-hairline">
            {GOALS.map((goal) => {
              const ids = GOAL_ACTION_IDS.get(goal.number) ?? []
              const answers = answersByGoal.get(goal.number) ?? []
              const done = countFor(ids)
              const isOpen = openGoal === goal.number
              const started = done > 0

              return (
                <li key={goal.slug}>
                  <div className="flex items-center gap-3 py-3">
                    {/* A meter per goal, in the goal's own accessible colour.
                        Untouched goals still draw their track, so twelve rows
                        read as twelve things to do rather than a list that
                        happens to be short. */}
                    <span
                      aria-hidden
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] font-heading text-small text-white tabular-nums"
                      style={{ background: started ? goal.textColor : 'var(--color-mist)' }}
                    >
                      {goal.number}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-small font-semibold text-ink">
                        {goal.title}
                      </span>
                      <span className="mt-1 flex items-center gap-2">
                        <span
                          aria-hidden
                          className="block h-1 flex-1 overflow-hidden rounded-full bg-hairline"
                        >
                          <span
                            className="block h-full rounded-full transition-[width] duration-700 ease-[var(--ease-out-expo)]"
                            style={{
                              width: ids.length ? `${(done / ids.length) * 100}%` : '0%',
                              background: goal.textColor,
                            }}
                          />
                        </span>
                        <span className="shrink-0 text-micro tracking-normal text-mist tabular-nums">
                          {done}/{ids.length}
                        </span>
                      </span>
                    </span>

                    {started ? (
                      <button
                        type="button"
                        onClick={() => setOpenGoal(isOpen ? null : goal.number)}
                        aria-expanded={isOpen}
                        aria-label={`${isOpen ? 'Hide' : 'Show'} your ${answers.length} ${
                          answers.length === 1 ? 'answer' : 'answers'
                        } on goal ${goal.number}`}
                        className="shrink-0 rounded-full p-1.5 text-stone transition-colors hover:bg-shell hover:text-ink"
                      >
                        <span
                          className={`block transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        >
                          <Icon icon={ArrowDown01Icon} size={18} />
                        </span>
                      </button>
                    ) : (
                      <Link
                        href={`/goals/${goal.slug}`}
                        onClick={onClose}
                        aria-label={`Start goal ${goal.number}: ${goal.title}`}
                        className="shrink-0 rounded-full p-1.5 text-mist transition-colors hover:bg-shell hover:text-navy"
                      >
                        <Icon icon={ArrowRight01Icon} size={18} />
                      </Link>
                    )}
                  </div>

                  {/* Only where there is something to disclose. An untouched
                      goal has no toggle, so rendering its collapsed panel put
                      an unreachable link in the markup — read out by a screen
                      reader in some modes, and never openable by anyone.

                      Plain CSS disclosure otherwise, matching the comment
                      field on the goal pages, so these cost nothing to mount. */}
                  <div
                    className={started ? 'collapse-row' : 'hidden'}
                    data-open={isOpen ? '' : undefined}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <ul className="space-y-2.5 border-l border-hairline pb-4 pl-4">
                        {answers.map((item) => {
                          const entry = feedback[item.id]
                          const r = entry?.reaction ? REACTION_BY_ID.get(entry.reaction) : undefined
                          return (
                            <li key={item.id} className="text-small">
                              <div className="flex items-start justify-between gap-3">
                                <p className="text-ink">{item.label}</p>
                                <button
                                  type="button"
                                  onClick={() => remove(item.id)}
                                  aria-label={`Remove your feedback on: ${item.label}`}
                                  className="mt-0.5 shrink-0 rounded-md p-1 text-mist transition-colors hover:text-plum"
                                >
                                  <Icon icon={Delete02Icon} size={15} />
                                </button>
                              </div>
                              <div className="mt-1 flex flex-wrap items-center gap-2">
                                {r ? (
                                  <span
                                    className="rounded-full px-2 py-0.5 text-micro font-bold tracking-wide"
                                    style={{
                                      background: `color-mix(in oklab, ${r.color} 14%, white)`,
                                      color: r.color,
                                    }}
                                  >
                                    {r.short}
                                  </span>
                                ) : null}
                                {entry?.comment?.trim() ? (
                                  <span className="text-stone italic">“{entry.comment.trim()}”</span>
                                ) : null}
                              </div>
                            </li>
                          )
                        })}
                        <li>
                          <Link
                            href={`/goals/${goal.slug}`}
                            onClick={onClose}
                            className="inline-flex items-center gap-1.5 text-small font-semibold text-navy hover:underline"
                          >
                            {done < ids.length
                              ? `Answer the remaining ${ids.length - done}`
                              : 'Open this goal'}
                            <Icon icon={ArrowRight01Icon} size={15} />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        <footer className="border-t border-hairline px-6 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          {/* Where "Send my feedback" used to be.

              Nothing here is a step any more — answers go as they are made — so
              this states what has happened rather than asking for an action.
              It keeps the button's position because that is where a visitor
              looks to find out whether their feedback counted. */}
          <div
            className="flex items-start gap-3 rounded-2xl p-4 text-small"
            style={{ background: state.tint, color: state.ink }}
          >
            <span className={status === 'saving' ? 'motion-safe:animate-spin' : undefined}>
              <Icon icon={state.icon} size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p aria-live="polite">{state.message}</p>
              {status === 'error' || status === 'pending' ? (
                <button
                  type="button"
                  onClick={saveNow}
                  className="mt-1.5 font-bold underline underline-offset-2"
                >
                  {status === 'error' ? 'Try again now' : 'Send now'}
                </button>
              ) : null}
            </div>
          </div>

          {/* Said once, next to the thing that does it, rather than in a
              privacy page nobody opens. */}
          <p className="mt-2.5 text-center text-micro tracking-normal text-mist">
            Sent anonymously
          </p>
          <div className="mt-3 flex items-center justify-between gap-3 text-small">
            <button
              type="button"
              onClick={download}
              className="inline-flex items-center gap-1.5 font-semibold text-navy hover:underline"
            >
              <Icon icon={Download01Icon} size={15} />
              Download a copy
            </button>
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="font-semibold text-stone hover:text-plum"
            >
              Delete my feedback
            </button>
          </div>
        </footer>

        {/* Kept inside the sheet rather than floating over the page: the thing
            being deleted is listed right behind it, and a resident should be
            able to see what they are about to lose while they decide.

            An `alertdialog` because it interrupts — a screen reader announces
            the whole thing on open rather than waiting to be explored. */}
        {confirming ? (
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="clear-title"
            aria-describedby="clear-body"
            className="absolute inset-0 z-10 flex items-end bg-ink/45 sm:items-center sm:justify-center sm:p-6"
          >
            <div className="w-full rounded-t-[24px] bg-white p-6 sm:rounded-[24px]">
              <h3 id="clear-title" className="text-title">
                Delete your feedback?
              </h3>
              <p id="clear-body" className="mt-2 text-small text-stone">
                This withdraws all {count} {count === 1 ? 'response' : 'responses'} from the
                consultation and clears them from this device. The council will no longer have
                them, and this cannot be undone.
              </p>

              <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  ref={cancelRef}
                  type="button"
                  onClick={() => setConfirming(false)}
                  disabled={clearing}
                  className="rounded-full border border-hairline px-5 py-3 text-small font-bold text-ink transition-colors hover:bg-shell disabled:opacity-50"
                >
                  Keep my feedback
                </button>
                <button
                  type="button"
                  onClick={confirmClear}
                  disabled={clearing}
                  aria-busy={clearing}
                  className="flex items-center justify-center gap-2 rounded-full px-5 py-3 text-small font-bold text-white transition-colors disabled:opacity-70"
                  style={{ background: 'var(--color-plum)' }}
                >
                  <span className={clearing ? 'motion-safe:animate-spin' : undefined}>
                    <Icon icon={clearing ? Loading03Icon : Delete02Icon} size={16} />
                  </span>
                  {clearing ? 'Deleting…' : 'Delete everything'}
                </button>
              </div>

              {/* A withdrawal that failed leaves the council's copy in place,
                  so it has to be said here rather than only in the status line
                  the sheet is covering. */}
              {status === 'error' && error ? (
                <p role="alert" className="mt-3 text-small" style={{ color: '#7c0b45' }}>
                  {error}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </aside>
    </>
  )
}
