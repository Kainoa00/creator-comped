// ============================================================
// CreatorComped — Auth utilities
// Supabase Auth for admin login; device sessions for staff
// ============================================================

import { supabase, isDemoMode } from './supabase'

export interface AuthSession {
  userId: string
  email: string
  role: 'admin' | 'restaurant_admin'
  restaurantId: string | null
}

/** Sign in with email/password (restaurant-admin portal) */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ session: AuthSession | null; error: string | null }> {
  if (isDemoMode) {
    if (email && password) {
      return {
        session: { userId: 'demo-user', email, role: 'restaurant_admin', restaurantId: 'restaurant-001' },
        error: null,
      }
    }
    return { session: null, error: 'Email and password required' }
  }

  const { data, error } = await supabase!.auth.signInWithPassword({ email, password })
  if (error) return { session: null, error: error.message }
  if (!data.user) return { session: null, error: 'No user returned' }

  // Look up role + restaurant from restaurant_users
  const { data: ru, error: ruError } = await supabase!
    .from('restaurant_users')
    .select('restaurant_id, role')
    .eq('auth_user_id', data.user.id)
    .single()

  if (ruError || !ru) {
    // User authenticated but has no restaurant_users record
    await supabase!.auth.signOut()
    return {
      session: null,
      error: 'Your account is not linked to a restaurant. Contact support@creatorcomped.com.',
    }
  }

  return {
    session: {
      userId: data.user.id,
      email: data.user.email ?? email,
      role: ru.role as 'admin' | 'restaurant_admin',
      restaurantId: ru.restaurant_id,
    },
    error: null,
  }
}

/** Sign out */
export async function signOut(): Promise<void> {
  if (!isDemoMode && supabase) {
    await supabase.auth.signOut()
  }
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('cc_admin_session')
  }
}

/** Get current session from Supabase or session storage */
export async function getSession(): Promise<AuthSession | null> {
  if (isDemoMode) {
    if (typeof window === 'undefined') return null
    const raw = sessionStorage.getItem('cc_admin_session')
    if (!raw) return null
    try { return JSON.parse(raw) } catch { return null }
  }

  const { data } = await supabase!.auth.getSession()
  if (!data.session?.user) return null

  // Re-fetch role + restaurantId on session restore
  const { data: ru } = await supabase!
    .from('restaurant_users')
    .select('restaurant_id, role')
    .eq('auth_user_id', data.session.user.id)
    .single()

  return {
    userId: data.session.user.id,
    email: data.session.user.email ?? '',
    role: (ru?.role ?? 'restaurant_admin') as 'admin' | 'restaurant_admin',
    restaurantId: ru?.restaurant_id ?? null,
  }
}

/** Persist demo session */
export function persistDemoSession(session: AuthSession): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('cc_admin_session', JSON.stringify(session))
  }
}
