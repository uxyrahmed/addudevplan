import Link from 'next/link'
import { GOALS } from '@/lib/plan'

/**
 * The "jump to a goal" list inside the mobile menu.
 *
 * A server component on purpose: the header itself is interactive and must run
 * on the client, but the plan data is 18 KB gzipped and nothing on the client
 * needs it. Rendering this here and passing it down as `children` keeps the
 * markup without shipping the module.
 */
export function HeaderGoalLinks() {
  return (
    <>
      <p className="eyebrow mt-6 mb-3 px-3">Jump to a goal</p>
      <ul className="grid grid-cols-1 gap-1 pb-2 sm:grid-cols-2">
        {GOALS.map((goal) => (
          <li key={goal.slug}>
            <Link
              href={`/goals/${goal.slug}`}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-small text-slate hover:bg-shell"
            >
              <span
                className="grid h-6 w-6 shrink-0 place-items-center rounded-[7px] text-micro font-bold tracking-normal text-white"
                style={{ background: goal.textColor }}
              >
                {goal.number}
              </span>
              {goal.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
