import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || null
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null

/**
 * Supabase client for client-side usage.
 * Will be null when env vars are missing (demo mode).
 * IMPORTANT: Always check isDemoMode before calling supabase methods.
 */
export const supabase = url && key ? createClient(url, key) : null

/**
 * True when Supabase env vars are not configured.
 * The app falls back to demo-data.ts in this mode.
 */
export const isDemoMode = !url || !key

/**
 * Server-side Supabase client using service role key.
 * Use only in API routes / server actions — never expose to client.
 */
export function createServerClient() {
  const serverUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serverUrl || !serviceKey) return null
  return createClient(serverUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
