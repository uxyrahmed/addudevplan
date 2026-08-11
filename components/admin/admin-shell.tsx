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
        <div className="mx-auto flex max-w-[76rem] flex-wrap items-center gap-x-6 gap-y-3 px-6 py-4">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/plan/brand/city-of-addu-bird.png"
              alt=""
              width={390}
              height={176}
              className="h-7 w-auto"
            />
            <span className="font-heading text-small text-navy">
              {PLAN.title} — consultation results
            </span>
          </Link>

          <nav aria-label="Results" className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = item.href === current
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-full px-3.5 py-1.5 text-small font-semibold transition-colors ${
                    active ? 'bg-navy text-white' : 'text-stone hover:bg-shell hover:text-navy'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

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
      </header>

      <main className="mx-auto max-w-[76rem] px-6 py-10">{children}</main>
    </div>
  )
}
