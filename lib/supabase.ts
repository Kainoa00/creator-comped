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
