// ============================================================
// HIVE — Auth utilities
// Unified auth: single signIn → role-based routing
// ============================================================

import { supabase, isDemoMode } from './supabase'

export type AppRole = 'influencer' | 'business' | 'admin'

export interface AuthSession {
  userId: string
  email: string
  role: AppRole
  restaurantId: string | null
  creatorId: string | null
}

/** Sign in with email/password — detects role from user_profiles table */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ session: AuthSession | null; error: string | null }> {
  if (isDemoMode) {
    if (email && password) {
      // Demo: detect role from email pattern
      const role: AppRole = email.includes('admin')
        ? 'admin'
        : email.includes('biz') || email.includes('restaurant')
        ? 'business'
        : 'influencer'
      return {
        session: {
          userId: 'demo-user',
          email,
          role,
          restaurantId: role === 'business' ? 'restaurant-001' : null,
          creatorId: role === 'influencer' ? 'creator-001' : null,
        },
        error: null,
      }
    }
    return { session: null, error: 'Email and password required' }
  }

  const { data, error } = await supabase!.auth.signInWithPassword({ email, password })
  if (error) return { session: null, error: error.message }
  if (!data.user) return { session: null, error: 'No user returned' }

  // Look up role from user_profiles
  const { data: profile, error: profileError } = await supabase!
    .from('user_profiles')
    .select('role, creator_id, restaurant_user_id')
    .eq('auth_user_id', data.user.id)
    .single()

  if (profileError || !profile) {
    // Fall back to legacy restaurant_users lookup for existing accounts
    const { data: ru } = await supabase!
      .from('restaurant_users')
      .select('restaurant_id, role')
      .eq('auth_user_id', data.user.id)
      .single()

    if (ru) {
      return {
        session: {
          userId: data.user.id,
          email: data.user.email ?? email,
          role: 'business',
          restaurantId: ru.restaurant_id,
          creatorId: null,
        },
        error: null,
      }
    }

    await supabase!.auth.signOut()
    return {
      session: null,
      error: 'Your account is not set up. Contact support@hive.app.',
    }
  }

  // Resolve restaurantId for business users
  let restaurantId: string | null = null
  if (profile.role === 'business' && profile.restaurant_user_id) {
    const { data: ru } = await supabase!
      .from('restaurant_users')
      .select('restaurant_id')
      .eq('id', profile.restaurant_user_id)
      .single()
    restaurantId = ru?.restaurant_id ?? null
  }

  return {
    session: {
      userId: data.user.id,
      email: data.user.email ?? email,
      role: profile.role as AppRole,
      restaurantId,
      creatorId: profile.creator_id ?? null,
    },
    error: null,
  }
}

/** Sign up a new influencer account */
export async function signUpInfluencer(
  email: string,
  password: string,
  name: string
): Promise<{ session: AuthSession | null; error: string | null }> {
  if (isDemoMode) {
    return {
      session: {
        userId: 'demo-user',
        email,
        role: 'influencer',
        restaurantId: null,
        creatorId: 'creator-001',
      },
      error: null,
    }
  }

  const { data, error } = await supabase!.auth.signUp({ email, password })
  if (error) return { session: null, error: error.message }
  if (!data.user) return { session: null, error: 'Sign up failed' }

  // Create creators row
  const { data: creator, error: creatorError } = await supabase!
    .from('creators')
    .insert({
      auth_user_id: data.user.id,
      name,
      email,
    })
    .select('id')
    .single()

  if (creatorError) {
    return { session: null, error: 'Failed to create creator profile' }
  }

  // Create user_profiles row
  await supabase!.from('user_profiles').insert({
    auth_user_id: data.user.id,
    role: 'influencer',
    creator_id: creator.id,
  })

  return {
    session: {
      userId: data.user.id,
      email: data.user.email ?? email,
      role: 'influencer',
      restaurantId: null,
      creatorId: creator.id,
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
    sessionStorage.removeItem('hive_session')
  }
}

/** Get current session from Supabase or session storage (demo) */
export async function getSession(): Promise<AuthSession | null> {
  if (isDemoMode) {
    if (typeof window === 'undefined') return null
    const raw = sessionStorage.getItem('hive_session')
    if (!raw) return null
    try { return JSON.parse(raw) } catch { return null }
  }

  const { data } = await supabase!.auth.getSession()
  if (!data.session?.user) return null

  // Re-fetch role on session restore
  const { data: profile } = await supabase!
    .from('user_profiles')
    .select('role, creator_id, restaurant_user_id')
    .eq('auth_user_id', data.session.user.id)
    .single()

  if (!profile) {
    // Legacy fallback for restaurant_users
    const { data: ru } = await supabase!
      .from('restaurant_users')
      .select('restaurant_id')
      .eq('auth_user_id', data.session.user.id)
      .single()

    if (!ru) {
      // No profile and no legacy restaurant_users row — orphaned session
      return null
    }

    return {
      userId: data.session.user.id,
      email: data.session.user.email ?? '',
      role: 'business',
      restaurantId: ru.restaurant_id,
      creatorId: null,
    }
  }

  let restaurantId: string | null = null
  if (profile.role === 'business' && profile.restaurant_user_id) {
    const { data: ru } = await supabase!
      .from('restaurant_users')
      .select('restaurant_id')
      .eq('id', profile.restaurant_user_id)
      .single()
    restaurantId = ru?.restaurant_id ?? null
  }

  return {
    userId: data.session.user.id,
    email: data.session.user.email ?? '',
    role: profile.role as AppRole,
    restaurantId,
    creatorId: profile.creator_id ?? null,
  }
}

/** Persist demo session to sessionStorage */
export function persistDemoSession(session: AuthSession): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('hive_session', JSON.stringify(session))
  }
}

/** Get the redirect path for a given role */
export function roleRedirectPath(role: AppRole): string {
  switch (role) {
    case 'influencer': return '/discover'
    case 'business': return '/dashboard'
    case 'admin': return '/admin'
  }
}
