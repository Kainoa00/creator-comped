import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

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

/** PostgREST error code for "no rows returned by .single()" */
export const PGRST_NOT_FOUND = 'PGRST116'

/**
 * Maps a Supabase/PostgREST error to the appropriate JSON response.
 * PGRST116 ("no rows") → 404, everything else → 500.
 */
export function dbErrorResponse(
  error: { code?: string },
  notFoundMsg = 'Not found'
): NextResponse {
  const is404 = error.code === PGRST_NOT_FOUND
  return NextResponse.json(
    { error: is404 ? notFoundMsg : 'Server error' },
    { status: is404 ? 404 : 500 }
  )
}
