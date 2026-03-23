import { NextRequest, NextResponse } from 'next/server'
import { isDemoMode } from '@/lib/supabase'
import { createServerClient } from '@/lib/supabase-server'
import { requireRestaurantSession } from '@/lib/api-auth'
import { DEMO_ORDERS } from '@/lib/demo-data'


export async function GET(req: NextRequest) {
  const auth = await requireRestaurantSession()
  if (auth instanceof NextResponse) return auth

  const { searchParams } = new URL(req.url)
  const restaurant_id = auth.restaurantId
  const status = searchParams.get('status')
  const search = searchParams.get('search')
  const date = searchParams.get('date') // 'today' | 'week' | 'month' | 'all'

  if (isDemoMode) {
    let orders = DEMO_ORDERS.filter((o) => o.restaurant_id === restaurant_id)

    if (status) orders = orders.filter((o) => o.status === status)

    if (search) {
      const q = search.toLowerCase()
      orders = orders.filter(
        (o) =>
          o.redemption_code.includes(q) ||
          o.items.some((i) => i.menu_item_name.toLowerCase().includes(q))
      )
    }

    if (date === 'today') {
      const today = new Date().toDateString()
      orders = orders.filter((o) => new Date(o.created_at).toDateString() === today)
    } else if (date === 'week') {
      const weekAgo = Date.now() - 7 * 24 * 3600 * 1000
      orders = orders.filter((o) => new Date(o.created_at).getTime() > weekAgo)
    } else if (date === 'month') {
      const monthAgo = Date.now() - 30 * 24 * 3600 * 1000
      orders = orders.filter((o) => new Date(o.created_at).getTime() > monthAgo)
    }

    return NextResponse.json({ orders })
  }

  const supabase = createServerClient()
  if (!supabase) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  let query = supabase
    .from('orders')
    .select('*')
    .eq('restaurant_id', restaurant_id)
    .order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ orders: data ?? [] })
}
