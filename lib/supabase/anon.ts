import 'server-only'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { supabaseConfig } from './config'

/**
 * A client that carries no session at all, for filing residents' feedback.
 *
 * The submission path has nothing to do with who is signed in, and it should not
 * behave differently for a council member who happens to have an admin session in
 * the same browser. Deliberately not the cookie-reading server client: this way
 * the database always sees the `anon` role, which is the only role granted
 * `submit_feedback`, and one code path covers every visitor.
 */
export function createAnonClient() {
  const { url, key } = supabaseConfig()
  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
