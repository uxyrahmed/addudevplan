'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type LoginState = { error: string } | undefined

/** Only ever somewhere inside the admin panel, so the `next` parameter cannot
 *  be used to bounce a signed-in council member off to another site. */
function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === 'string' ? value : ''
  return next.startsWith('/admin') && !next.startsWith('/admin/login') ? next : '/admin'
}

export async function signIn(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Enter your email and password.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    // Deliberately the same message whether the address is unknown or the
    // password is wrong: telling them apart tells an outsider which council
    // addresses exist.
    return { error: 'Those details were not recognised.' }
  }

  // Outside the error branch on purpose — redirect works by throwing, so it must
  // not sit inside a try/catch that would swallow it.
  redirect(safeNext(formData.get('next')))
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
