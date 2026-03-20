import { NextRequest, NextResponse } from 'next/server'
import { isDemoMode } from '@/lib/supabase'
import { createServerClient } from '@/lib/supabase-server'
import { requireRestaurantSession } from '@/lib/api-auth'
import { DEMO_ORDERS, DEMO_ANALYTICS_SNAPSHOTS, DEMO_CREATORS } from '@/lib/demo-data'


export async function GET(req: NextRequest) {
  const auth = await requireRestaurantSession()
  if (auth instanceof NextResponse) return auth

  const { searchParams } = new URL(req.url)
  const restaurant_id = searchParams.get('restaurant_id')

  if (isDemoMode) {
    const orders = restaurant_id
      ? DEMO_ORDERS.filter((o) => o.restaurant_id === restaurant_id)
      : DEMO_ORDERS

    const confirmed = orders.filter((o) =>
      ['confirmed', 'approved', 'proof_submitted'].includes(o.status)
    )
    const totalComps = confirmed.length
    const totalViews = DEMO_ANALYTICS_SNAPSHOTS.reduce((sum, s) => sum + s.views, 0)
    const totalLikes = DEMO_ANALYTICS_SNAPSHOTS.reduce((sum, s) => sum + s.likes, 0)

    // Top creators by order count
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

    // Platform split
    const igOrders = orders.filter((o) =>
      o.deliverable_requirement?.allowed_types === 'IG_REEL'
    ).length
    const ttOrders = orders.filter((o) =>
      o.deliverable_requirement?.allowed_types === 'TIKTOK'
    ).length

    return NextResponse.json({
      totalComps,
      totalViews,
      totalLikes,
      topCreators,
      platformSplit: { ig: igOrders, tiktok: ttOrders },
    })
  }

  return NextResponse.json({
    totalComps: 0,
    totalViews: 0,
    totalLikes: 0,
    topCreators: [],
    platformSplit: { ig: 0, tiktok: 0 },
  })
}
