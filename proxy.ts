import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from '@/lib/supabase/config'

/**
 * Keeps the council's session alive and turns anonymous visitors away from
 * /admin before anything renders.
 *
 * Next 16 renamed `middleware` to `proxy`; the function must be named `proxy`
 * (or be the default export) and runs on the Node runtime.
 *
 * This is the optimistic half of the check only. Authorisation — whether a
 * signed-in account is actually on the council allowlist — is done in
 * lib/admin/session.ts, next to the data it protects.
 */
export async function proxy(request: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    // Unconfigured checkout: let the request through so the public site still
    // runs, and let the admin pages explain what is missing.
    return NextResponse.next({ request })
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        // A refreshed token has to reach two places: the request, so the render
        // that follows sees it, and the response, so the browser replaces the
        // stale one. Dropping either logs people out at random.
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value)
        }
        response = NextResponse.next({ request })
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options)
        }
      },
    },
  })

  // Verifies the signature and refreshes the token when it has expired. Removing
  // this call is what makes sessions appear to drop at random.
  const { data } = await supabase.auth.getClaims()
  const signedIn = Boolean(data?.claims?.sub)

  const path = request.nextUrl.pathname
  const isLogin = path === '/admin/login'

  if (!signedIn && !isLogin) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.search = ''
    // Only ever a path inside /admin, so this cannot be turned into an open
    // redirect by way of the login form.
    if (path.startsWith('/admin/')) url.searchParams.set('next', path)
    return NextResponse.redirect(url)
  }

  if (signedIn && isLogin) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    url.search = ''
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  // Only the admin panel. The public consultation has no session to refresh, and
  // running an auth round trip on every page view would slow it down for nothing.
  matcher: ['/admin/:path*'],
}
