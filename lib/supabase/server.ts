import 'server-only'

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { supabaseConfig } from './config'

/**
 * Server-side client for Server Components, Server Actions and Route Handlers.
 *
 * Created per request, never hoisted to a module-level singleton: the client
 * carries the caller's auth cookies, so one shared instance would hand one
 * council member's session to the next request.
 */
export async function createClient() {
  const { url, key } = supabaseConfig()
  const cookieStore = await cookies()

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // Server Components are not allowed to write cookies. Refreshed
          // tokens are persisted by proxy.ts instead, which runs before render,
          // so losing the write here costs nothing.
        }
      },
    },
  })
}
