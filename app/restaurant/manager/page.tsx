'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PINGate } from '@/components/restaurant-ui/PINGate'
import { DarkStatCard } from '@/components/restaurant-ui/DarkStatCard'
import { DarkCard } from '@/components/restaurant-ui/DarkCard'
import { DEMO_RESTAURANTS, DEMO_ORDERS } from '@/lib/demo-data'
import { cn } from '@/lib/utils'
import {
  Utensils,
  Settings,
  ClipboardList,
  BarChart3,
  Lock,
  ShoppingBag,
  FileVideo,
  TrendingUp,
  ChevronRight,
} from 'lucide-react'

const restaurant = DEMO_RESTAURANTS[0]
const DEMO_PIN = restaurant.manager_pin

const todayOrders = DEMO_ORDERS.filter((o) =>
  o.restaurant_id === restaurant.id &&
  ['confirmed', 'approved', 'proof_submitted'].includes(o.status)
)
const videosDue = DEMO_ORDERS.filter((o) => o.status === 'proof_submitted').length
const weekOrders = DEMO_ORDERS.filter((o) =>
  o.restaurant_id === restaurant.id && !['rejected', 'expired'].includes(o.status)
).length

const NAV_CARDS = [
  { label: 'Comp Menu', description: 'Add and manage comped items', icon: Utensils, href: '/restaurant/manager/menu' },
  { label: 'Settings', description: 'Hours, caps, cooldowns', icon: Settings, href: '/restaurant/manager/settings' },
  { label: 'History', description: 'Full redemption log', icon: ClipboardList, href: '/restaurant/manager/history' },
  { label: 'Analytics', description: 'Performance metrics', icon: BarChart3, href: '/restaurant/manager/analytics' },
]

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

export default function ManagerPage() {
  const router = useRouter()
  const [unlocked, setUnlocked] = useState(false)
  const [showLockConfirm, setShowLockConfirm] = useState(false)

  if (!unlocked) {
    return (
      <PINGate
        correctPin={DEMO_PIN}
        onUnlock={() => setUnlocked(true)}
        backHref="/restaurant"
        demoPin={DEMO_PIN}
      />
    )
  }

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Manager Mode</p>
          <h1 className="text-xl font-bold text-white">
            Good {getTimeOfDay()}!
          </h1>
          <p className="text-sm text-white/40 mt-0.5">{restaurant.name}</p>
        </div>
        <button
          onClick={() => setShowLockConfirm(true)}
          className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-white/50 hover:text-white text-xs font-medium transition-colors"
        >
          <Lock className="h-3.5 w-3.5" />
          Lock
        </button>
      </div>

      {/* Pause warning */}
      {restaurant.settings.pause_comps && (
        <div className="mb-5 flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-3">
          <p className="text-sm text-amber-300">All comps are paused. Go to Settings to resume.</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <DarkStatCard icon={ShoppingBag} label="Today" value={`${todayOrders.length}/${restaurant.settings.daily_comp_cap ?? '∞'}`} />
        <DarkStatCard icon={FileVideo} label="Videos Due" value={videosDue} accent />
        <DarkStatCard icon={TrendingUp} label="This Week" value={weekOrders} />
      </div>

      {/* Nav Cards */}
      <div className="flex flex-col gap-3">
        {NAV_CARDS.map((card) => {
          const Icon = card.icon
          return (
            <DarkCard key={card.href} onClick={() => router.push(card.href)}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-white/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{card.label}</p>
                  <p className="text-xs text-white/40 mt-0.5">{card.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-white/20 shrink-0" />
              </div>
            </DarkCard>
          )
        })}
      </div>

      {/* Lock Confirm Sheet */}
      {showLockConfirm && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLockConfirm(false)} />
          <div className="relative bg-[#111] rounded-t-3xl border-t border-white/[0.08] p-6 pb-10">
            <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />
            <h3 className="text-lg font-bold text-white mb-2">Lock Manager Mode?</h3>
            <p className="text-sm text-white/50 mb-6">Staff will need the PIN to access manager settings again.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLockConfirm(false)}
                className="flex-1 py-4 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-white/60 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => { setUnlocked(false); setShowLockConfirm(false) }}
                className="flex-1 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-bold flex items-center justify-center gap-2"
              >
                <Lock className="h-4 w-4" />
                Lock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
