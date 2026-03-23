import { NextRequest, NextResponse } from 'next/server'
import { isDemoMode } from '@/lib/supabase'
import { createServerClient } from '@/lib/supabase-server'
import { requireRestaurantSession } from '@/lib/api-auth'
import { DEMO_ORDERS, DEMO_CREATORS } from '@/lib/demo-data'


export async function POST(req: NextRequest) {
  try {
    const auth = await requireRestaurantSession()
    if (auth instanceof NextResponse) return auth

    const { code, qr_token } = await req.json()
    const restaurant_id = auth.restaurantId

    if (!code && !qr_token) {
      return NextResponse.json({ error: 'code or qr_token required' }, { status: 400 })
    }

    if (isDemoMode) {
      const order = qr_token
        ? DEMO_ORDERS.find((o) => o.qr_token === qr_token)
        : DEMO_ORDERS.find((o) => o.redemption_code === code)

      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      const creator = DEMO_CREATORS.find((c) => c.id === order.creator_id)

      return NextResponse.json({ order, creator })
    }

    const supabase = createServerClient()
    if (!supabase) return NextResponse.json({ error: 'Server error' }, { status: 500 })

    let query = supabase.from('orders').select('*')
    if (qr_token) {
      query = query.eq('qr_token', qr_token)
    } else {
      query = query.eq('redemption_code', code)
    }
    query = query.eq('restaurant_id', restaurant_id)

    const { data: orders, error } = await query.limit(1)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!orders?.length) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    const order = orders[0]

    // Fetch creator
    const { data: creator } = await supabase
      .from('creators')
      .select('*')
      .eq('id', order.creator_id)
      .single()

    return NextResponse.json({ order, creator })
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
