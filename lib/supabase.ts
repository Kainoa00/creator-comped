import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || null
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null

/**
 * Supabase client for client-side usage.
 * Will be null when env vars are missing (demo mode).
 * IMPORTANT: Always check isDemoMode before calling supabase methods.
 */
export const supabase = url && key
  ? createClient(url, key, {
      auth: {
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false, // Critical: prevents Capacitor URL parsing issues
      },
    })
  : null

/**
 * True when Supabase env vars are not configured.
 * The app falls back to demo-data.ts in this mode.
 */
export const isDemoMode = !url || !key

// Redirect to login on forced sign-out (e.g. token refresh failure)
if (supabase && typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
      // Only redirect if currently on a protected route
      const path = window.location.pathname
      if (path.startsWith('/dashboard') || path.startsWith('/discover') ||
          path.startsWith('/profile') || path.startsWith('/cart') ||
          path.startsWith('/redeem') || path.startsWith('/proof') ||
          path.startsWith('/admin')) {
        window.location.href = '/login'
      }
    }
  })
}
