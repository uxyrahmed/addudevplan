import { checkCouncilViewer } from '@/lib/admin/session'
import { signOut } from '@/app/admin/actions'
import { redirect } from 'next/navigation'

export const metadata = { title: 'No access' }

/**
 * Signed in, but not on the council allowlist.
 *
 * Its own page rather than a redirect back to the login form: the visitor has a
 * perfectly valid session, so the form would send them straight back here and the
 * two would chase each other.
 */
export default async function NoAccessPage() {
  const check = await checkCouncilViewer()
  if (check.status === 'anonymous') redirect('/admin/login')
  if (check.status === 'ok') redirect('/admin')

  return (
    <div className="mx-auto flex min-h-dvh max-w-[30rem] flex-col justify-center px-6 py-16">
      <p className="eyebrow text-plum">Not authorised</p>
      <h1 className="mt-3 font-heading text-display-3 text-navy">
        This account cannot read the results
      </h1>
      <p className="mt-4 text-body text-slate">
        {check.email ? (
          <>
            <strong className="text-ink">{check.email}</strong> is signed in, but it has not been
            given access to residents&rsquo; responses.
          </>
        ) : (
          <>This account has not been given access to residents&rsquo; responses.</>
        )}{' '}
        Ask the council&rsquo;s administrator to add it.
      </p>

      <form action={signOut} className="mt-8">
        <button
          type="submit"
          className="rounded-full bg-navy px-5 py-3 text-small font-bold text-white transition-colors hover:bg-navy-deep"
        >
          Sign out
        </button>
      </form>
    </div>
  )
}
