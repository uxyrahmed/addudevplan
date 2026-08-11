/**
 * The two values the browser is allowed to know.
 *
 * Written as literal property accesses rather than read through a helper:
 * Next inlines `NEXT_PUBLIC_*` at build time only where it can *see* the
 * access, so `process.env[name]` resolves to undefined in the client bundle.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
export const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

/**
 * Fail at the call site with the name of the missing variable rather than
 * letting `undefined` reach the Supabase client, which reports it as an opaque
 * network error much later.
 */
export function supabaseConfig() {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY — copy .env.example to .env.local.',
    )
  }
  return { url: SUPABASE_URL, key: SUPABASE_PUBLISHABLE_KEY }
}
