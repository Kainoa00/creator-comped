import { createClient } from '@supabase/supabase-js'

/**
 * Server-side Supabase client using service role key.
 * Use ONLY in API routes / server actions — never import in client components.
 * The service role key bypasses all RLS policies.
 */
export function createServerClient() {
  const serverUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serverUrl || !serviceKey) return null
  return createClient(serverUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
