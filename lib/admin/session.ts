import 'server-only'

import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type CouncilViewer = {
  id: string
  email: string
  name: string | null
}

/**
 * Signed out, signed in but not allowlisted, or allowed.
 *
 * The middle case has to be its own answer rather than folding into "signed
 * out": sending that account back to the login form would land it straight back
 * here — it has a perfectly valid session — and the two redirects would chase
 * each other.
 */
export type ViewerCheck =
  | { status: 'anonymous' }
  | { status: 'not-allowed'; email: string | null }
  | { status: 'ok'; viewer: CouncilViewer }

/**
 * Who is asking, and whether they may read the consultation results.
 *
 * Two separate questions, answered in order:
 *
 * 1. `getClaims` verifies the token's signature against the project's published
 *    keys, so the identity is trustworthy. `getSession` is used nowhere in server
 *    code — it reads the cookie without revalidating it, which is precisely what
 *    a forged cookie would rely on.
 * 2. A verified identity proves nothing about authorisation, so the allowlist is
 *    checked in the database. The `admin_viewers` policy returns rows only to a
 *    viewer, so an account that is not on the list reads back nothing — the query
 *    and the permission check are the same operation.
 *
 * Wrapped in `cache` so the several components that need the viewer during one
 * render share a single round trip.
 */
export const checkCouncilViewer = cache(async (): Promise<ViewerCheck> => {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getClaims()
  const claims = data?.claims
  if (error || !claims?.sub) return { status: 'anonymous' }

  const { data: row } = await supabase
    .from('admin_viewers')
    .select('user_id, email, name')
    .eq('user_id', claims.sub)
    .maybeSingle()

  if (!row) {
    return { status: 'not-allowed', email: typeof claims.email === 'string' ? claims.email : null }
  }

  return { status: 'ok', viewer: { id: row.user_id, email: row.email, name: row.name } }
})

/**
 * The gate every admin page, action and route handler calls first.
 *
 * proxy.ts turns anonymous visitors away before render, but that is a
 * convenience, not the boundary: a Server Action posts to the route it is
 * defined on, and a matcher change could quietly stop covering it. So the check
 * lives next to the data and is called again at every entry point.
 */
export async function requireCouncilViewer(): Promise<CouncilViewer> {
  const check = await checkCouncilViewer()
  if (check.status === 'anonymous') redirect('/admin/login')
  if (check.status === 'not-allowed') redirect('/admin/no-access')
  return check.viewer
}
