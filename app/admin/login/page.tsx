import type { Metadata } from 'next'
import Image from 'next/image'
import { LoginForm } from '@/components/admin/login-form'
import { PLAN } from '@/lib/plan'

export const metadata: Metadata = {
  title: 'Council sign in',
  // Results are not public, so keep the door out of search results.
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>
}) {
  const { next } = await searchParams
  const target = Array.isArray(next) ? next[0] : next

  return (
    <div className="mx-auto flex min-h-dvh max-w-[27rem] flex-col justify-center px-6 py-16">
      {/* Decorative: the heading below names the place. */}
      <Image
        src="/plan/brand/city-of-addu-bird.png"
        alt=""
        width={390}
        height={176}
        className="h-9 w-auto"
        priority
      />

      <h1 className="mt-9 font-heading text-display-3 text-navy">Consultation results</h1>
      <p className="mt-3 text-body text-slate">
        Residents&rsquo; responses to the {PLAN.title} {PLAN.period}. For Addu City Council staff.
      </p>

      <LoginForm next={target} />

      <p className="mt-8 border-t border-hairline pt-5 text-small text-stone">
        Accounts are created by invitation. If you need access, ask the council&rsquo;s
        administrator to invite your address.
      </p>
    </div>
  )
}
