'use client'

import { useState } from 'react'
import { DarkStatCard } from '@/components/restaurant-ui/DarkStatCard'
import { DEMO_RESTAURANTS, DEMO_ORDERS, DEMO_ANALYTICS_SNAPSHOTS } from '@/lib/demo-data'
import { formatNumber, cn } from '@/lib/utils'
import { useSaveFlash } from '@/lib/hooks/useSaveFlash'
import { TimeRangeTrigger, timeRangeLabel } from '@/components/restaurant-ui/TimeRangeTrigger'
import { TimeRangeModal } from '@/components/restaurant-ui/TimeRangeModal'
import { GradientSlider } from '@/components/restaurant-ui/GradientSlider'
import type { TimeRange } from '@/lib/types'
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
} from 'lucide-react'

const restaurant = DEMO_RESTAURANTS[0]

const confirmedOrders = DEMO_ORDERS.filter((o) =>
  ['confirmed', 'proof_submitted', 'approved'].includes(o.status)
)
const pendingProofReviews = DEMO_ORDERS.filter((o) => o.status === 'proof_submitted').length
const totalViews = DEMO_ANALYTICS_SNAPSHOTS.reduce((sum, s) => sum + s.views, 0)
const monthlyBudget = 5000
const spent = 4892
const budgetPct = Math.round((spent / monthlyBudget) * 100)

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
  const [timeRange, setTimeRange] = useState<TimeRange>({ mode: 'month', month: now.getMonth(), year: now.getFullYear() })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [monthlyBudgetInput, setMonthlyBudgetInput] = useState(5000)
  const [cooldownDays, setCooldownDays] = useState(14)
  const [totalItemLimit, setTotalItemLimit] = useState(2)
  const { saved, flash: handleSave } = useSaveFlash()

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
          <DarkStatCard icon={Eye} label="Views" value={formatNumber(totalViews)} sub="est. reach" />
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

      {/* Settings Section */}
      <div className="mb-6">
        <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Quick Settings</p>
        <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.05]">
          {/* Monthly Budget */}
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <p className="text-sm font-medium text-white">Monthly Budget</p>
              <p className="text-xs text-white/40 mt-0.5">Total comp budget per month</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-white/40">$</span>
              <input
                type="number"
                min="100"
                max="50000"
                step="100"
                value={monthlyBudgetInput}
                onChange={(e) => setMonthlyBudgetInput(parseInt(e.target.value) || 100)}
                className="w-20 bg-white/[0.08] border border-white/[0.08] rounded-xl px-2 py-1.5 text-sm text-white text-center focus:outline-none focus:border-white/20"
              />
            </div>
          </div>

          {/* Creator Cooldown */}
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-white">Creator Cooldown</p>
                <p className="text-xs text-white/40 mt-0.5">Days before a creator can redeem again</p>
              </div>
              <span className="text-sm font-bold text-white">{cooldownDays}d</span>
            </div>
            <GradientSlider min={1} max={90} value={cooldownDays} onChange={setCooldownDays} />
            <div className="flex justify-between text-xs text-white/30 mt-1">
              <span>1 day</span>
              <span>90 days</span>
            </div>
          </div>

          {/* Total Item Limit */}
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-white">Total Item Limit</p>
                <p className="text-xs text-white/40 mt-0.5">Max items per comp order</p>
              </div>
              <span className="text-sm font-bold text-white">{totalItemLimit} items</span>
            </div>
            <GradientSlider min={1} max={10} value={totalItemLimit} onChange={setTotalItemLimit} />
            <div className="flex justify-between text-xs text-white/30 mt-1">
              <span>1 item</span>
              <span>10 items</span>
            </div>
          </div>
        </div>
      </div>

      <TimeRangeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={setTimeRange}
        initialRange={timeRange}
      />

      {/* Save Settings */}
      <button
        type="button"
        onClick={handleSave}
        className={cn(
          'w-full py-4 rounded-2xl text-white font-bold text-sm transition-all',
          saved ? 'bg-emerald-500' : ''
        )}
        style={saved ? {} : { background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
      >
        {saved ? 'Saved!' : 'Save Settings'}
      </button>
    </div>
  )
}
