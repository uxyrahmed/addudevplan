import { createBrowserClient } from '@supabase/ssr'
import { supabaseConfig } from './config'

/**
 * Browser-side client, used only by the council's sign-in form.
 *
 * `createBrowserClient` is itself a singleton, so calling this per render is
 * cheap and does not stack up connections.
 */
export function createClient() {
  const { url, key } = supabaseConfig()
  return createBrowserClient(url, key)
}
