import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { isDemoMode } from './supabase'
import { createServerClient as createServiceClient } from './supabase-server'

export interface AuthResult {
  userId: string
  restaurantId: string
}

/**
 * Verifies the incoming request has a valid restaurant session.
 * Returns { userId, restaurantId } on success, or a NextResponse 401/403/500 on failure.
 * In demo mode, always succeeds with demo credentials.
 */
export async function requireRestaurantSession(): Promise<AuthResult | NextResponse> {
  if (isDemoMode) {
    return { userId: 'demo-user', restaurantId: 'restaurant-001' }
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

  const { data: ru } = await admin
    .from('restaurant_users')
    .select('restaurant_id')
    .eq('auth_user_id', user.id)
    .single()

  if (!ru) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return { userId: user.id, restaurantId: ru.restaurant_id as string }
}
