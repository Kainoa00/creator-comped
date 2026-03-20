import { NextRequest, NextResponse } from 'next/server'
import { isDemoMode } from '@/lib/supabase'
import { createServerClient } from '@/lib/supabase-server'
import { requireRestaurantSession } from '@/lib/api-auth'
import { DEMO_MENU_ITEMS } from '@/lib/demo-data'


export async function GET(req: NextRequest) {
  const auth = await requireRestaurantSession()
  if (auth instanceof NextResponse) return auth

  const { searchParams } = new URL(req.url)
  const restaurant_id = searchParams.get('restaurant_id')

  if (isDemoMode) {
    const items = restaurant_id
      ? DEMO_MENU_ITEMS.filter((m) => m.restaurant_id === restaurant_id)
      : DEMO_MENU_ITEMS
    return NextResponse.json({ items })
  }

  const supabase = createServerClient()
  if (!supabase) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  let query = supabase.from('menu_items').select('*').order('created_at')
  if (restaurant_id) query = query.eq('restaurant_id', restaurant_id)

  const { data, error } = await query
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
  const { data, error } = await supabase.from('menu_items').insert(body).select().single()
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
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data })
}

export async function DELETE(req: NextRequest) {
  const auth = await requireRestaurantSession()
  if (auth instanceof NextResponse) return auth
  if (isDemoMode) return NextResponse.json({ success: true, message: 'Demo mode' })

  const supabase = createServerClient()
  if (!supabase) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  const { id } = await req.json()
  const { error } = await supabase.from('menu_items').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
