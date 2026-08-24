'use client'

import { useRef } from 'react'
import ArrowDown01Icon from '@hugeicons/core-free-icons/ArrowDown01Icon'
import { Icon } from '@/components/ui/icon'

export type FilterOption = { value: string; label: string }
export type FilterGroup = { label: string; options: FilterOption[] }

/**
 * The two questions this screen filters on, as menus.
 *
 * They were fourteen chips and then four more, wrapping to four rows — the
 * loudest thing on a page whose subject is what residents wrote, and a control
 * that answers "which goal?" by showing all twelve answers at once. A menu
 * shows the one that is chosen and keeps the other thirteen a click away.
 *
 * A real `GET` form, so the result is still an ordinary link: the browser
 * builds `?goal=…&reaction=…` itself, the view stays bookmarkable and sendable
 * to a colleague, and the page it lands on is server-rendered as before.
 * Choosing submits; without JavaScript the `<noscript>` button does it instead.
 *
 * `page` is deliberately not a field. Any change of filter starts again at the
 * first page, rather than landing on "page 4 of 2" and an empty screen that
 * looks like the filter found nothing.
 */
export function CommentFilters({
  goal,
  reaction,
  goalGroups,
  reactionOptions,
}: {
  goal: string
  reaction: string
  goalGroups: FilterGroup[]
  reactionOptions: FilterOption[]
}) {
  const form = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={form}
      method="GET"
      action="/admin/comments"
      className="flex flex-wrap items-end gap-3"
    >
      <Field
        name="goal"
        label="Part of the plan"
        value={goal}
        onPick={() => form.current?.requestSubmit()}
        className="min-w-56 flex-1 sm:max-w-80"
      >
        {goalGroups.map((group) =>
          group.label ? (
            <optgroup key={group.label} label={group.label}>
              {group.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </optgroup>
          ) : (
            group.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))
          ),
        )}
      </Field>

      <Field
        name="reaction"
        label="Reaction"
        value={reaction}
        onPick={() => form.current?.requestSubmit()}
        className="min-w-40"
      >
        {reactionOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Field>

      <noscript>
        <button
          type="submit"
          className="rounded-full border border-hairline bg-white px-4 py-2.5 text-small font-semibold text-navy"
        >
          Show
        </button>
      </noscript>
    </form>
  )
}

/**
 * A native `<select>` wearing the site's own clothes.
 *
 * `appearance-none` takes the platform's control away and the border, radius
 * and type come back from the palette — but it is still a `<select>`, so the
 * keyboard, the type-ahead and the phone's own picker all work without being
 * rebuilt. A hand-made listbox would have to earn all three back.
 */
function Field({
  name,
  label,
  value,
  onPick,
  className = '',
  children,
}: {
  name: string
  label: string
  value: string
  onPick: () => void
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-small leading-none text-stone">{label}</span>
      <span className="relative mt-1.5 block">
        <select
          name={name}
          defaultValue={value}
          onChange={onPick}
          className="w-full appearance-none rounded-xl border border-hairline bg-white py-2.5 pr-10 pl-3.5 text-small font-semibold text-ink transition-colors hover:border-navy focus-visible:border-navy"
        >
          {children}
        </select>
        <Icon
          icon={ArrowDown01Icon}
          size={16}
          // Over the control, never in front of it: a click on the chevron has
          // to reach the select underneath and open it.
          className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-stone"
        />
      </span>
    </label>
  )
}
