import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { isDemoMode } from './supabase'
import { createServerClient as createServiceClient } from './supabase-server'
import type { AppRole } from './auth'

export interface AuthResult {
  userId: string
  restaurantId: string | null
  creatorId: string | null
  role: AppRole
}

/**
 * Generic auth check — verifies the incoming request has a valid Supabase session
 * and returns the user's role from user_profiles.
 */
export async function requireAuth(
  allowedRoles?: AppRole[]
): Promise<AuthResult | NextResponse> {
  if (isDemoMode) {
    return { userId: 'demo-user', restaurantId: 'restaurant-001', creatorId: 'creator-001', role: 'business' }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(url, anon, {
    cookies: { getAll: () => cookieStore.getAll() },
  })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createServiceClient()
  if (!admin) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  // Look up role
  const { data: profile } = await admin
    .from('user_profiles')
    .select('role, creator_id, restaurant_user_id')
    .eq('auth_user_id', user.id)
    .single()

  let role: AppRole = 'influencer'
  let restaurantId: string | null = null
  let creatorId: string | null = null

  if (profile) {
    role = profile.role as AppRole
    creatorId = profile.creator_id ?? null

    if (profile.restaurant_user_id) {
      const { data: ru } = await admin
        .from('restaurant_users')
        .select('restaurant_id')
        .eq('id', profile.restaurant_user_id)
        .single()
      restaurantId = ru?.restaurant_id ?? null
    }
  } else {
    // Legacy fallback: check restaurant_users directly
    const { data: ru } = await admin
      .from('restaurant_users')
      .select('restaurant_id')
      .eq('auth_user_id', user.id)
      .single()

    if (ru) {
      role = 'business'
      restaurantId = ru.restaurant_id
    } else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return { userId: user.id, restaurantId, creatorId, role }
}

/**
 * Verifies the incoming request has a valid restaurant/business session.
 * Kept for backwards compatibility with existing API routes.
 */
export async function requireRestaurantSession(): Promise<{ userId: string; restaurantId: string } | NextResponse> {
  const result = await requireAuth(['business', 'admin'])
  if (result instanceof NextResponse) return result
  if (!result.restaurantId) {
    return NextResponse.json({ error: 'No restaurant associated' }, { status: 403 })
  }
  return { userId: result.userId, restaurantId: result.restaurantId }
}

/**
 * Verifies admin-only access.
 */
export async function requireAdminSession(): Promise<{ userId: string } | NextResponse> {
  const result = await requireAuth(['admin'])
  if (result instanceof NextResponse) return result
  return { userId: result.userId }
}
