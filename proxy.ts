import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from '@/lib/supabase/config'
import { DEFAULT_LOCALE, localePath, splitLocale } from '@/lib/i18n/config'

/**
 * Two jobs, on two disjoint sets of paths.
 *
 * Under `/admin`: keep the council's session alive and turn anonymous visitors
 * away before anything renders. Everywhere else: make sure the request carries
 * a language, because every public page now lives under `/[lang]`.
 *
 * Next 16 renamed `middleware` to `proxy`; the function must be named `proxy`
 * (or be the default export) and runs on the Node runtime.
 */
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (!path.startsWith('/admin')) return localeRedirect(request)

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

/**
 * Sends a request with no language in it to the default edition.
 *
 * A redirect rather than an internal rewrite, and that is the point of putting
 * the locale in the path at all: the reader ends up at an address that names
 * the language they are reading, so the link they send to someone else opens in
 * the language they meant. A rewrite would leave every reader on `/` and the
 * Dhivehi edition would have no address to share.
 *
 * It does **not** negotiate on `Accept-Language`, and that is deliberate while
 * the Dhivehi edition is unlisted. The translation is complete but has not been
 * read by a native speaker, so it is reachable by typing or sharing a `/dv`
 * URL and by nothing else — no switcher in the chrome, and no browser
 * preference that would walk a Dhivehi-speaking resident into an unreviewed
 * edition they never asked for. `matchLocale` in `lib/i18n/config.ts` is the
 * negotiation, kept and tested; restoring it is one call.
 *
 * There is no cookie here either. A visitor who follows a `/dv/…` link gets
 * Dhivehi because the URL says so, not because of something this site
 * remembered about them.
 */
function localeRedirect(request: NextRequest) {
  const { locale } = splitLocale(request.nextUrl.pathname)
  if (locale) return NextResponse.next({ request })

  const url = request.nextUrl.clone()
  url.pathname = localePath(DEFAULT_LOCALE, request.nextUrl.pathname)
  return NextResponse.redirect(url)
}

export const config = {
  /**
   * Everything except the framework's own assets, the API routes and anything
   * in `public/` — matched as "has a file extension", which is what the images,
   * the brand artwork and `favicon.ico` all have and no page on this site does.
   *
   * The public consultation is now in the matcher, where it used not to be. It
   * costs one string comparison per request: `proxy` splits on `/admin` before
   * any Supabase client is constructed, so a page view still makes no auth
   * round trip.
   */
  matcher: ['/((?!_next|api/|.*\\.[\\w]+$).*)'],
}
