'use client'

import Link from 'next/link'
import { DarkStatCard } from '@/components/restaurant-ui/DarkStatCard'
import { DarkCard } from '@/components/restaurant-ui/DarkCard'
import { DEMO_RESTAURANTS, DEMO_ORDERS, DEMO_ANALYTICS_SNAPSHOTS } from '@/lib/demo-data'
import { formatNumber } from '@/lib/utils'
import {
  Receipt,
  DollarSign,
  BarChart3,
  UtensilsCrossed,
  FileText,
  User,
  Settings,
  HelpCircle,
  Eye,
  ChevronRight,
} from 'lucide-react'

const restaurant = DEMO_RESTAURANTS[0]

const confirmedOrders = DEMO_ORDERS.filter((o) =>
  ['confirmed', 'proof_submitted', 'approved'].includes(o.status)
)
const totalViews = DEMO_ANALYTICS_SNAPSHOTS.reduce((sum, s) => sum + s.views, 0)
const monthlyBudget = 5000
const spent = 4892
const budgetPct = Math.round((spent / monthlyBudget) * 100)

const QUICK_TILES = [
  { href: '/restaurant-admin/comps', icon: Receipt, label: 'Comps', description: 'View all redemptions' },
  { href: '/restaurant-admin/spend', icon: DollarSign, label: 'Spend', description: 'Budget & spending' },
  { href: '/restaurant-admin/analytics', icon: BarChart3, label: 'Analytics', description: 'Performance metrics' },
  { href: '/restaurant-admin/menu', icon: UtensilsCrossed, label: 'Edit Menu', description: 'Manage comp items' },
  { href: '/restaurant-admin/deliverables', icon: FileText, label: 'Deliverables', description: 'Content requirements' },
  { href: '/restaurant-admin/profile', icon: User, label: 'Profile', description: 'Restaurant info' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function AdminDashboardPage() {
  return (
    <div className="px-4 pt-6 pb-4">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Admin Dashboard</p>
        <h1 className="text-xl font-bold text-white">{getGreeting()}!</h1>
        <p className="text-sm text-white/50 mt-0.5">{restaurant.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <DarkStatCard icon={Receipt} label="Comps" value={confirmedOrders.length} sub="this month" accent />
        <DarkStatCard icon={DollarSign} label="Spent" value={`$${spent.toLocaleString()}`} sub="of $5k" />
        <DarkStatCard icon={Eye} label="Views" value={formatNumber(totalViews)} sub="est. reach" />
      </div>

      {/* Budget Progress */}
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white">Monthly Budget</p>
          <p className="text-sm text-white/50">${spent.toLocaleString()} / ${monthlyBudget.toLocaleString()}</p>
        </div>
        <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600 transition-all"
            style={{ width: `${Math.min(budgetPct, 100)}%` }}
          />
        </div>
        <p className="text-xs text-white/30 mt-2">
          {budgetPct >= 100 ? 'Budget exhausted' : `$${(monthlyBudget - spent).toLocaleString()} remaining`}
        </p>
      </div>

      {/* Nav Tiles Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {QUICK_TILES.map((tile) => {
          const Icon = tile.icon
          return (
            <Link
              key={tile.href}
              href={tile.href}
              className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 hover:bg-white/[0.08] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center mb-3">
                <Icon className="h-5 w-5 text-white/60" />
              </div>
              <p className="text-sm font-semibold text-white">{tile.label}</p>
              <p className="text-xs text-white/40 mt-0.5">{tile.description}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
