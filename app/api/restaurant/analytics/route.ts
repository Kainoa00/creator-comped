import { NextResponse } from 'next/server'
import { isDemoMode } from '@/lib/supabase'
import { createServerClient } from '@/lib/supabase-server'
import { requireRestaurantSession } from '@/lib/api-auth'
import { DEMO_ORDERS, DEMO_ANALYTICS_SNAPSHOTS, DEMO_CREATORS } from '@/lib/demo-data'
import type { OrderStatus } from '@/lib/types'

const COMPLETED_STATUSES: OrderStatus[] = ['confirmed', 'approved', 'proof_submitted']

export async function GET() {
  const auth = await requireRestaurantSession()
  if (auth instanceof NextResponse) return auth

  const restaurant_id = auth.restaurantId

  if (isDemoMode) {
    const orders = DEMO_ORDERS.filter((o) => o.restaurant_id === restaurant_id)
    const confirmed = orders.filter((o) => COMPLETED_STATUSES.includes(o.status as OrderStatus))

    const totalViews = DEMO_ANALYTICS_SNAPSHOTS.reduce((sum, s) => sum + s.views, 0)
    const totalLikes = DEMO_ANALYTICS_SNAPSHOTS.reduce((sum, s) => sum + s.likes, 0)

    const creatorCounts: Record<string, number> = {}
    confirmed.forEach((o) => {
      creatorCounts[o.creator_id] = (creatorCounts[o.creator_id] ?? 0) + 1
    })
    const topCreators = Object.entries(creatorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id, count]) => {
        const creator = DEMO_CREATORS.find((c) => c.id === id)
        return { id, name: creator?.name ?? 'Unknown', count }
      })

    const igOrders = orders.filter(
      (o) => o.deliverable_requirement?.allowed_types === 'IG_REEL'
    ).length
    const ttOrders = orders.filter(
      (o) => o.deliverable_requirement?.allowed_types === 'TIKTOK'
    ).length

    return NextResponse.json({
      totalComps: confirmed.length,
      totalViews,
      totalLikes,
      topCreators,
      platformSplit: { ig: igOrders, tiktok: ttOrders },
    })
  }

  const supabase = createServerClient()
  if (!supabase) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  // Fetch confirmed orders + snapshot totals concurrently
  const ordersResult = await supabase
    .from('orders')
    .select('id, creator_id')
    .eq('restaurant_id', restaurant_id)
    .in('status', COMPLETED_STATUSES)

  const orders = ordersResult.data ?? []
  const orderIds = orders.map((o) => o.id)

  // Proofs and creator names can be fetched in parallel once we have orderIds
  const [proofsResult, creatorsResult] = await Promise.all([
    orderIds.length
      ? supabase.from('proof_submissions').select('id').in('order_id', orderIds)
      : Promise.resolve({ data: [] as { id: string }[] }),
    orders.length
      ? supabase
          .from('creators')
          .select('id, name')
          .in('id', [...new Set(orders.map((o) => o.creator_id))])
      : Promise.resolve({ data: [] as { id: string; name: string }[] }),
  ])

  const proofIds = (proofsResult.data ?? []).map((p) => p.id)
  const creatorMap = Object.fromEntries(
    (creatorsResult.data ?? []).map((c) => [c.id, c.name])
  )

  const snapshotsResult = proofIds.length
    ? await supabase
        .from('analytics_snapshots')
        .select('views, likes')
        .in('proof_id', proofIds)
    : { data: [] as { views: number; likes: number }[] }

  const snapshots = snapshotsResult.data ?? []
  const totalViews = snapshots.reduce((sum, s) => sum + (s.views ?? 0), 0)
  const totalLikes = snapshots.reduce((sum, s) => sum + (s.likes ?? 0), 0)

  const creatorCounts: Record<string, number> = {}
  orders.forEach((o) => {
    creatorCounts[o.creator_id] = (creatorCounts[o.creator_id] ?? 0) + 1
  })
  const topCreators = Object.entries(creatorCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id, count]) => ({ id, name: creatorMap[id] ?? 'Unknown', count }))

  return NextResponse.json({
    totalComps: orders.length,
    totalViews,
    totalLikes,
    topCreators,
    platformSplit: { ig: 0, tiktok: 0 },
  })
}
