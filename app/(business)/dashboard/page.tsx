'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { DarkStatCard } from '@/components/restaurant-ui/DarkStatCard'
import { DEMO_RESTAURANTS, DEMO_ORDERS, DEMO_ANALYTICS_SNAPSHOTS, DEMO_CREATORS } from '@/lib/demo-data'
import { formatNumber, cn } from '@/lib/utils'
import { DemoBadge } from '@/lib/business-ui'
import { supabase, isDemoMode } from '@/lib/supabase'
import { useAuth } from '@/lib/hooks/useAuth'
import { TimeRangeTrigger, timeRangeLabel } from '@/components/restaurant-ui/TimeRangeTrigger'
import { TimeRangeModal } from '@/components/restaurant-ui/TimeRangeModal'
import type { TimeRange, RestaurantProfile, Order } from '@/lib/types'
import { TextGenerateEffect } from '@/components/effects/TextGenerateEffect'
import { StaggeredList, StaggerItem } from '@/components/effects/StaggeredList'
import { AuroraBackground } from '@/components/effects/AuroraBackground'
import { GlowCard } from '@/components/effects/GlowCard'
import {
  Receipt,
  DollarSign,
  BarChart3,
  UtensilsCrossed,
  FileText,
  Megaphone,
  Scissors,
  Eye,
  CheckCircle2,
  Clock,
  QrCode,
} from 'lucide-react'

const QUICK_TILES = [
  { href: '/dashboard/comps', icon: Receipt, label: 'Comps', description: 'View all redemptions' },
  { href: '/dashboard/spend', icon: DollarSign, label: 'Spend', description: 'Budget & spending' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics', description: 'Performance metrics' },
  { href: '/dashboard/menu', icon: UtensilsCrossed, label: 'Edit Menu', description: 'Manage comp items' },
  { href: '/dashboard/services', icon: Scissors, label: 'Services', description: 'Beauty & wellness' },
  { href: '/dashboard/deliverables', icon: FileText, label: 'Deliverables', description: 'Content requirements' },
  { href: '/dashboard/campaign', icon: Megaphone, label: 'Campaign', description: 'Campaign settings' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function BusinessDashboardPage() {
  const now = new Date()
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState<TimeRange>({ mode: 'month', month: now.getMonth(), year: now.getFullYear() })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [restaurant, setRestaurant] = useState<RestaurantProfile>(DEMO_RESTAURANTS[0] as RestaurantProfile)
  const [orders, setOrders] = useState<Order[]>(DEMO_ORDERS)
  const [analyticsViews, setAnalyticsViews] = useState(DEMO_ANALYTICS_SNAPSHOTS.reduce((sum, s) => sum + s.views, 0))

  useEffect(() => {
    async function loadData() {
      if (isDemoMode || !supabase || !user?.restaurantId) return

      try {
        // Fetch restaurant
        const { data: r } = await supabase.from('restaurants').select('*').eq('id', user.restaurantId).single()
        if (r) setRestaurant(r as RestaurantProfile)

        // Fetch orders
        const { data: o } = await supabase.from('orders').select('*').eq('restaurant_id', user.restaurantId).order('created_at', { ascending: false }).limit(100)
        if (o?.length) setOrders(o as Order[])

        // Fetch analytics views
        const { data: a } = await supabase.from('analytics_snapshots').select('views').limit(500)
        if (a?.length) setAnalyticsViews(a.reduce((sum: number, s: { views: number }) => sum + s.views, 0))
      } catch { /* fall back to demo data */ }
    }
    loadData()
  }, [user?.restaurantId])

  const confirmedOrders = useMemo(() => orders.filter((o) =>
    ['confirmed', 'proof_submitted', 'approved'].includes(o.status)
  ), [orders])
  const pendingProofReviews = useMemo(() => orders.filter((o) => o.status === 'proof_submitted').length, [orders])
  const monthlyBudget = restaurant.monthly_budget ?? 5000
  const spent = useMemo(() => {
    // Estimate spend from confirmed orders' item count * avg COGS
    return confirmedOrders.length * 18 // Approximation — will refine with actual COGS data
  }, [confirmedOrders])
  const budgetPct = monthlyBudget > 0 ? Math.round((spent / monthlyBudget) * 100) : 0

  return (
    <div className="px-4 pt-6 pb-8 max-w-2xl mx-auto w-full">
      {/* Header with AuroraBackground */}
      <div className="relative overflow-hidden rounded-2xl mb-6 -mx-2 px-2 pt-4 pb-2">
        <AuroraBackground />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Business Dashboard</p>
            <h1 className="text-xl font-bold text-white">
              <TextGenerateEffect text={`${getGreeting()}!`} />
            </h1>
            <p className="text-sm text-white/50 mt-0.5">{restaurant.name}</p>
          </div>
          <TimeRangeTrigger range={timeRange} onClick={() => setIsModalOpen(true)} />
        </div>
        <DemoBadge />
      </div>

      {/* Stats */}
      <StaggeredList className="grid grid-cols-3 gap-3 mb-6">
        <StaggerItem>
          <DarkStatCard icon={Receipt} label="Comps" value={confirmedOrders.length} sub={timeRangeLabel(timeRange)} accent badge={pendingProofReviews > 0 ? pendingProofReviews : undefined} />
        </StaggerItem>
        <StaggerItem>
          <DarkStatCard icon={DollarSign} label="Spent" value={`$${spent.toLocaleString()}`} sub="of $5k" badge={budgetPct >= 90 ? '!' : undefined} />
        </StaggerItem>
        <StaggerItem>
          <DarkStatCard icon={Eye} label="Views" value={formatNumber(analyticsViews)} sub="est. reach" />
        </StaggerItem>
      </StaggeredList>

      {/* Budget Progress */}
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white">Monthly Budget</p>
          <p className="text-sm text-white/50">${spent.toLocaleString()} / ${monthlyBudget.toLocaleString()}</p>
        </div>
        <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.min(budgetPct, 100)}%`,
              background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)',
            }}
          />
        </div>
        <p className="text-xs text-white/30 mt-2">
          {budgetPct >= 100 ? 'Budget exhausted' : `$${(monthlyBudget - spent).toLocaleString()} remaining`}
        </p>
      </div>

      {/* Nav Tiles Grid */}
      <StaggeredList className="grid grid-cols-2 gap-3 mb-8">
        {QUICK_TILES.map((tile) => {
          const Icon = tile.icon
          return (
            <StaggerItem key={tile.href}>
              <GlowCard href={tile.href}>
                <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 hover:bg-white/[0.08] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-white/60" />
                  </div>
                  <p className="text-sm font-semibold text-white">{tile.label}</p>
                  <p className="text-xs text-white/40 mt-0.5">{tile.description}</p>
                </div>
              </GlowCard>
            </StaggerItem>
          )
        })}
      </StaggeredList>

      {/* Scan CTA */}
      <Link
        href="/dashboard/scanner"
        className="flex items-center gap-4 bg-gradient-to-r from-[#FF6B35]/20 to-[#4A90E2]/20 border border-white/[0.1] rounded-2xl px-5 py-4 mb-8 hover:from-[#FF6B35]/30 hover:to-[#4A90E2]/30 transition-all active:scale-[0.98]"
      >
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#4A90E2] flex items-center justify-center shrink-0">
          <QrCode className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-white">Scan Creator Code</p>
          <p className="text-xs text-white/50 mt-0.5">Tap to open scanner</p>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      </Link>

      {/* Recent Comps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-white/30 uppercase tracking-widest font-medium">Recent Comps</p>
          <Link href="/dashboard/comps" className="text-xs text-white/40 hover:text-white/70 transition-colors">
            View all →
          </Link>
        </div>
        <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.05]">
          {orders.slice(0, 4).map((order) => (
            <div key={order.id} className="flex items-center gap-3 px-4 py-3.5">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                order.status === 'confirmed' ? 'bg-green-500/20' :
                order.status === 'scanned' ? 'bg-blue-500/20' : 'bg-white/10'
              )}>
                {order.status === 'confirmed'
                  ? <CheckCircle2 className="h-4 w-4 text-green-400" />
                  : <Clock className="h-4 w-4 text-blue-400" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {DEMO_CREATORS.find((c) => c.id === order.creator_id)?.name ?? 'Creator'}
                </p>
                <p className="text-xs text-white/40 truncate mt-0.5">
                  #{order.redemption_code} · {order.restaurant_name}
                </p>
              </div>
              <span className={cn(
                'text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0',
                order.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                order.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                'bg-blue-500/20 text-blue-400'
              )}>
                {order.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <TimeRangeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={setTimeRange}
        initialRange={timeRange}
      />
    </div>
  )
}
