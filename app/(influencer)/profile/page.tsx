'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Instagram, Music2, ChevronRight, BarChart3, Clock, Trophy, Settings,
  Bell, HelpCircle, FileText, UserPen, BadgeCheck, QrCode, LogOut,
} from 'lucide-react'
import { formatNumber, formatDate, getInitials, relativeTime, secondsRemaining } from '@/lib/utils'
import { useCreatorData } from '@/lib/hooks/useCreatorData'
import { useOrderStore } from '@/lib/stores/order-store'
import { signOut } from '@/lib/auth'

function StatBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1 py-5">
      <span className="text-2xl font-bold text-white leading-none">{value}</span>
      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold text-center">{label}</span>
    </div>
  )
}

const NAV_ITEMS = [
  { icon: BarChart3, label: 'Analytics', path: '/profile/analytics' },
  { icon: Clock, label: 'History', path: '/profile/history' },
  { icon: Trophy, label: 'Leaderboard', path: '/profile/leaderboard' },
  { icon: UserPen, label: 'Edit Profile', path: '/profile/edit' },
  { icon: Settings, label: 'Settings', path: '/profile/settings' },
  { icon: Bell, label: 'Notifications', path: '/profile/notifications' },
  { icon: HelpCircle, label: 'Support', path: '/profile/support' },
  { icon: FileText, label: 'Rules', path: '/rules' },
]

export default function ProfilePage() {
  const router = useRouter()
  const { creator, orders, loading } = useCreatorData()
  const { activeRedemption } = useOrderStore()

  const totalComps = useMemo(
    () => orders.filter((o) => ['confirmed', 'proof_submitted', 'approved'].includes(o.status)).length,
    [orders]
  )
  const totalSaved = useMemo(
    () => orders.filter((o) => o.status === 'approved').length,
    [orders]
  )
  const rank = 1

  const recentOrders = orders.slice(0, 5)

  const initials = creator ? getInitials(creator.name) : '?'

  if (loading || !creator) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    )
  }

  const statusColor = (status: string) => {
    if (status === 'approved') return 'bg-green-500/20 text-green-400'
    if (status === 'proof_submitted') return 'bg-yellow-500/20 text-yellow-400'
    if (status === 'confirmed') return 'bg-blue-500/20 text-blue-400'
    return 'bg-white/10 text-gray-400'
  }

  const statusLabel = (status: string) => {
    if (status === 'approved') return 'Approved'
    if (status === 'proof_submitted') return 'In Review'
    if (status === 'confirmed') return 'Confirmed'
    if (status === 'rejected') return 'Rejected'
    return status
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white max-w-[430px] mx-auto">
      <div className="pb-28">
        {/* Profile header */}
        <section className="px-4 pt-14 pb-6">
          {/* Avatar */}
          <div className="flex items-start justify-between mb-4">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #4A90E2 100%)' }}
              >
                {initials}
              </div>
              {creator.verified && (
                <div
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-[#0B0B0D]"
                  style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
                >
                  <BadgeCheck className="h-3.5 w-3.5 text-white" />
                </div>
              )}
            </div>
            <button
              onClick={() => router.push('/profile/edit')}
              className="text-xs font-semibold bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-2 text-gray-300 hover:border-white/20 transition-colors"
            >
              Edit
            </button>
          </div>

          {/* Name + tier */}
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-white">{creator.name}</h1>
            {creator.verified && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
              >
                VERIFIED
              </span>
            )}
          </div>

          {/* Handles */}
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            {creator.ig_handle && (
              <div className="flex items-center gap-1.5">
                <Instagram className="h-3.5 w-3.5 text-pink-400" />
                <span className="text-sm text-gray-400">{creator.ig_handle}</span>
                <span className="text-[10px] text-green-400 font-semibold">✓</span>
              </div>
            )}
            {creator.tiktok_handle && (
              <div className="flex items-center gap-1.5">
                <Music2 className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-sm text-gray-400">{creator.tiktok_handle}</span>
                <span className="text-[10px] text-green-400 font-semibold">✓</span>
              </div>
            )}
          </div>

          {/* Location */}
          <p className="text-xs text-gray-600 mt-1.5 capitalize">{creator.geo_market.replace('_', ' ')}</p>
        </section>

        {/* Stats */}
        <section className="border-t border-b border-[#2a2a2a] mx-4">
          <div className="flex items-stretch divide-x divide-[#2a2a2a]">
            <StatBlock label="Comps" value={totalComps} />
            <StatBlock label="Approved" value={totalSaved} />
            <StatBlock label="Rank" value={`#${rank}`} />
          </div>
        </section>

        {/* Active Comp banner */}
        {activeRedemption && secondsRemaining(activeRedemption.expiresAt) > 0 && (
          <section className="px-4 pt-6">
            <button
              onClick={() => router.push('/redeem')}
              className="w-full rounded-2xl p-4 flex items-center gap-3 border border-green-500/30"
              style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.12) 0%, rgba(74,144,226,0.12) 100%)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
              >
                <QrCode className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-bold text-white">Active Comp</p>
                <p className="text-xs text-gray-400 truncate">{activeRedemption.restaurantName}</p>
              </div>
              <span className="text-[10px] font-semibold bg-green-500/20 text-green-400 px-2.5 py-1 rounded-full shrink-0">
                Active
              </span>
              <ChevronRight className="h-4 w-4 text-gray-500 shrink-0" />
            </button>
          </section>
        )}

        {/* Nav list */}
        <section className="px-4 pt-6 space-y-2">
          {NAV_ITEMS.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => router.push(path)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl flex items-center px-4 py-4 gap-3 hover:border-white/20 transition-colors"
            >
              <Icon className="h-4 w-4 text-gray-500 shrink-0" />
              <span className="flex-1 text-sm font-semibold text-white text-left">{label}</span>
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          ))}
        </section>

        {/* Recent orders */}
        {recentOrders.length > 0 && (
          <section className="px-4 pt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-bold">Recent Orders</h2>
              <button onClick={() => router.push('/profile/history')} className="text-xs text-gray-500 hover:text-white transition-colors">See all</button>
            </div>
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => router.push(`/profile/order/${order.id}`)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-3 flex items-center gap-3 hover:border-white/20 active:bg-[#252525] transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{order.restaurant_name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{relativeTime(order.created_at)}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor(order.status)}`}>
                    {statusLabel(order.status)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-600 shrink-0" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Sign Out */}
        <section className="px-4 pt-6 pb-8">
          <button
            onClick={async () => {
              await signOut()
              router.replace('/login')
            }}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl flex items-center justify-center gap-2 px-4 py-4 hover:border-white/20 active:bg-[#252525] transition-colors"
          >
            <LogOut className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-400">Sign Out</span>
          </button>
        </section>
      </div>
    </div>
  )
}
