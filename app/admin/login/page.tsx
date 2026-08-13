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
      {/* Decorative: the heading below names the place. `self-start` because a
          column flex container stretches its children, and a stretched item
          resolves `w-auto` to the full column width — which squashes the bird. */}
      <Image
        src="/plan/brand/city-of-addu-bird.png"
        alt=""
        width={390}
        height={176}
        className="h-9 w-auto self-start"
        priority
      />

      <h1 className="mt-9 font-heading text-display-3 text-navy">Consultation results</h1>
      <p className="mt-3 text-body text-slate">
        Residents&rsquo; responses to the {PLAN.title} {PLAN.period}.
      </p>

      <LoginForm next={target} />
    </div>
  )
}
