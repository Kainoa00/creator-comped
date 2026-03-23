import { NextRequest, NextResponse } from 'next/server'
import { isDemoMode } from '@/lib/supabase'
import { createServerClient, dbErrorResponse } from '@/lib/supabase-server'
import { requireRestaurantSession } from '@/lib/api-auth'
import { DEMO_ORDERS } from '@/lib/demo-data'


export async function POST(req: NextRequest) {
  try {
    const auth = await requireRestaurantSession()
    if (auth instanceof NextResponse) return auth

    const { order_id, reason } = await req.json()
    if (!order_id) return NextResponse.json({ error: 'order_id required' }, { status: 400 })

    if (isDemoMode) {
      const order = DEMO_ORDERS.find((o) => o.id === order_id)
      if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      return NextResponse.json({
        order: { ...order, status: 'rejected', rejection_reason: reason ?? 'Rejected by staff' },
      })
    }

    const supabase = createServerClient()
    if (!supabase) return NextResponse.json({ error: 'Server error' }, { status: 500 })

    const { data, error } = await supabase
      .from('orders')
      .update({ status: 'rejected', rejection_reason: reason ?? 'Rejected by staff' })
      .eq('id', order_id)
      .eq('restaurant_id', auth.restaurantId)
      .select()
      .single()

    if (error) return dbErrorResponse(error, 'Order not found')
    return NextResponse.json({ order: data })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
