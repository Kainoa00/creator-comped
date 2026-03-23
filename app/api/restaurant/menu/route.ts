import { NextRequest, NextResponse } from 'next/server'
import { isDemoMode } from '@/lib/supabase'
import { createServerClient, dbErrorResponse } from '@/lib/supabase-server'
import { requireRestaurantSession } from '@/lib/api-auth'
import { DEMO_MENU_ITEMS } from '@/lib/demo-data'


export async function GET(req: NextRequest) {
  const auth = await requireRestaurantSession()
  if (auth instanceof NextResponse) return auth

  if (isDemoMode) {
    const items = DEMO_MENU_ITEMS.filter((m) => m.restaurant_id === auth.restaurantId)
    return NextResponse.json({ items })
  }

  const supabase = createServerClient()
  if (!supabase) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', auth.restaurantId)
    .order('created_at')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data ?? [] })
}

export async function POST(req: NextRequest) {
  const auth = await requireRestaurantSession()
  if (auth instanceof NextResponse) return auth
  if (isDemoMode) return NextResponse.json({ item: null, message: 'Demo mode' })

  const supabase = createServerClient()
  if (!supabase) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  const body = await req.json()
  const { data, error } = await supabase
    .from('menu_items')
    .insert({ ...body, restaurant_id: auth.restaurantId })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data })
}

export async function PATCH(req: NextRequest) {
  const auth = await requireRestaurantSession()
  if (auth instanceof NextResponse) return auth
  if (isDemoMode) return NextResponse.json({ item: null, message: 'Demo mode' })

  const supabase = createServerClient()
  if (!supabase) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  const { id, ...updates } = await req.json()
  const { data, error } = await supabase
    .from('menu_items')
    .update(updates)
    .eq('id', id)
    .eq('restaurant_id', auth.restaurantId)
    .select()
    .single()
  if (error) return dbErrorResponse(error, 'Menu item not found')
  return NextResponse.json({ item: data })
}

export async function DELETE(req: NextRequest) {
  const auth = await requireRestaurantSession()
  if (auth instanceof NextResponse) return auth
  if (isDemoMode) return NextResponse.json({ success: true, message: 'Demo mode' })

  const supabase = createServerClient()
  if (!supabase) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  const { id } = await req.json()
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id)
    .eq('restaurant_id', auth.restaurantId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
