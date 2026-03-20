import { NextRequest, NextResponse } from 'next/server'
import { isDemoMode } from '@/lib/supabase'
import { createServerClient } from '@/lib/supabase-server'
import { requireRestaurantSession } from '@/lib/api-auth'
import { DEMO_RESTAURANTS } from '@/lib/demo-data'


export async function GET(req: NextRequest) {
  const auth = await requireRestaurantSession()
  if (auth instanceof NextResponse) return auth

  const { searchParams } = new URL(req.url)
  const restaurant_id = searchParams.get('restaurant_id')

  if (isDemoMode) {
    const r = restaurant_id
      ? DEMO_RESTAURANTS.find((r) => r.id === restaurant_id) ?? DEMO_RESTAURANTS[0]
      : DEMO_RESTAURANTS[0]
    return NextResponse.json({ restaurant: r })
  }

  const supabase = createServerClient()
  if (!supabase) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', restaurant_id ?? '')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ restaurant: data })
}

export async function PATCH(req: NextRequest) {
  const auth = await requireRestaurantSession()
  if (auth instanceof NextResponse) return auth
  if (isDemoMode) {
    const body = await req.json()
    return NextResponse.json({ restaurant: { ...DEMO_RESTAURANTS[0], ...body }, message: 'Demo mode — not persisted' })
  }

  const supabase = createServerClient()
  if (!supabase) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  const { id, ...updates } = await req.json()
  const { data, error } = await supabase
    .from('restaurants')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ restaurant: data })
}
