import Image from 'next/image'
import Link from 'next/link'
import { signOut } from '@/app/admin/actions'
import type { CouncilViewer } from '@/lib/admin/session'
import { PLAN } from '@/lib/plan'

const NAV = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/comments', label: 'Comments' },
]

/**
 * Chrome for the signed-in admin screens.
 *
 * Deliberately not the public site's header: no goal navigation, no smooth
 * scrolling, no feedback basket — this is a reading tool for staff, and the
 * consultation's furniture would only get in the way of a long table.
 *
 * Two bands rather than one. The three things in this header answer three
 * different questions — where am I, what can I read, who am I signed in as —
 * and on one line they wrapped into each other at every width between a phone
 * and a laptop, which put "Sign out" directly beside "Comments". Identity sits
 * above; the tabs sit below on their own baseline, where the underline marking
 * the open one has somewhere to go.
 */
export function AdminShell({
  viewer,
  current,
  children,
}: {
  viewer: CouncilViewer
  current: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh bg-shell">
      <header className="border-b border-hairline bg-white">
        <div className="mx-auto flex max-w-[76rem] flex-wrap items-center gap-x-6 gap-y-2 px-6 pt-4">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/plan/brand/city-of-addu-bird.png"
              alt=""
              width={390}
              height={176}
              className="h-7 w-auto"
            />
            <span className="font-heading text-small leading-snug text-navy">
              {PLAN.title} <span className="text-mist">— consultation results</span>
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-4 text-small">
            <span className="text-stone">{viewer.name ?? viewer.email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-hairline px-3.5 py-1.5 font-semibold text-stone transition-colors hover:border-plum hover:text-plum"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        <nav aria-label="Results" className="mx-auto max-w-[76rem] px-6">
          <ul className="-mb-px flex items-center gap-6">
            {NAV.map((item) => {
              const active = item.href === current
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`inline-block border-b-2 py-3 text-small font-semibold transition-colors ${
                      active
                        ? 'border-navy text-navy'
                        : 'border-transparent text-stone hover:border-hairline hover:text-navy'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-[76rem] px-6 py-10">{children}</main>
    </div>
  )
}
