'use client'

import { useActionState } from 'react'
import AlertCircleIcon from '@hugeicons/core-free-icons/AlertCircleIcon'
import { Icon } from '@/components/ui/icon'
import { signIn, type LoginState } from '@/app/admin/actions'

const FIELD =
  'mt-1.5 w-full rounded-2xl border border-hairline bg-shell px-4 py-3 text-body text-ink placeholder:text-mist focus:border-navy focus:bg-white focus:outline-none'

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, undefined)

  return (
    <form action={action} className="mt-8">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <div>
        <label htmlFor="email" className="text-small font-semibold text-ink">
          Council email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={FIELD}
        />
      </div>

      <div className="mt-5">
        <label htmlFor="password" className="text-small font-semibold text-ink">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={FIELD}
        />
      </div>

      {state?.error ? (
        <p
          role="alert"
          className="mt-5 flex items-start gap-2.5 rounded-2xl p-3.5 text-small"
          style={{ background: 'color-mix(in oklab, #970E53 9%, white)', color: '#7c0b45' }}
        >
          <Icon icon={AlertCircleIcon} size={18} />
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="mt-7 w-full rounded-full bg-navy px-5 py-3.5 text-small font-bold text-white transition-colors hover:bg-navy-deep disabled:cursor-default disabled:bg-stone"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
