'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Instagram,
  Music2,
  CheckCircle2,
  XCircle,
  ChevronRight,
  LogOut,
  Settings,
  Trophy,
  BarChart3,
  BadgeCheck,
} from 'lucide-react'
import { OrderStatusBadge } from '@/components/ui/badge'
import { cn, formatDate, formatNumber, currentMonthKey, relativeTime } from '@/lib/utils'
import {
  DEMO_ACTIVE_CREATOR,
  DEMO_CONTEST_ENTRIES,
  getOrdersForCreator,
  getLeaderboard,
} from '@/lib/demo-data'

// ── Stat block ─────────────────────────────────────────────────

function Stat({
  label,
  value,
  border = false,
}: {
  label: string
  value: string | number
  border?: boolean
}) {
  const isEmpty = value === '—' || value === null || value === undefined
  return (
    <div className={cn('flex flex-col items-center gap-1 flex-1 py-6', border && 'border-l border-slate-200')}>
      <span className={cn('text-3xl font-black leading-none', isEmpty ? 'text-slate-300' : 'text-slate-900')}>
        {value}
      </span>
      <span className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-semibold mt-0.5">
        {label}
      </span>
    </div>
  )
}

// ── Leaderboard rank card ──────────────────────────────────────

function LeaderboardCard({
  platform,
  entries,
  creatorId,
}: {
  platform: 'IG_REEL' | 'TIKTOK'
  entries: typeof DEMO_CONTEST_ENTRIES
  creatorId: string
}) {
  const filtered = entries.filter((e) => e.platform === platform)
  const ranked = filtered.sort((a, b) => b.score - a.score)
  const myEntry = ranked.find((e) => e.creator_id === creatorId)
  const myRank = myEntry ? ranked.indexOf(myEntry) + 1 : null

  const isIG = platform === 'IG_REEL'

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200">
        <div className="flex items-center gap-2">
          {isIG ? (
            <Instagram className="h-4 w-4 text-slate-400" />
          ) : (
            <Music2 className="h-4 w-4 text-slate-400" />
          )}
          <span className="text-sm font-semibold text-slate-900">
            {isIG ? 'Instagram' : 'TikTok'}
          </span>
        </div>
        {myRank && (
          <span className="text-xs font-semibold text-cc-accent border border-cc-accent/30 rounded-md px-2.5 py-0.5">
            #{myRank}
          </span>
        )}
      </div>

      {/* Leaderboard rows */}
      <ul className="divide-y divide-slate-100">
        {ranked.slice(0, 3).map((entry, i) => {
          const isMe = entry.creator_id === creatorId
          const medals = ['🥇', '🥈', '🥉']
          return (
            <li
              key={entry.id}
              className={cn(
                'flex items-center gap-3 px-4 py-3 transition-colors',
                isMe && 'bg-slate-50'
              )}
            >
              <span className="text-base w-6 text-center leading-none">{medals[i]}</span>
              <img
                src={entry.creator_photo ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.creator_id}`}
                alt={entry.creator_name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
              />
              <span
                className={cn(
                  'text-sm flex-1 truncate',
                  isMe ? 'font-semibold text-cc-accent' : 'text-slate-700'
                )}
              >
                {entry.creator_name}
                {isMe && (
                  <span className="ml-1.5 text-[10px] border border-cc-accent/30 text-cc-accent rounded-md px-1.5 py-0.5 font-medium align-middle">
                    you
                  </span>
                )}
              </span>
              <span className="text-xs font-black text-slate-500 tabular-nums">
                {formatNumber(entry.score)}
              </span>
            </li>
          )
        })}
      </ul>

      {!myEntry && (
        <p className="text-xs text-slate-400 text-center py-3 font-semibold">
          Submit an approved post to enter
        </p>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter()
  const creator = DEMO_ACTIVE_CREATOR
  const orders = useMemo(() => getOrdersForCreator(creator.id), [creator.id])
  const recentOrders = orders.slice(0, 10)

  const month = currentMonthKey()
  const leaderboard = getLeaderboard(month)

  const totalComps = orders.filter((o) =>
    ['confirmed', 'proof_submitted', 'approved'].includes(o.status)
  ).length
  const approvedPosts = orders.filter((o) => o.status === 'approved').length

  const myEntries = leaderboard.filter((e) => e.creator_id === creator.id)
  const avgScore =
    myEntries.length > 0
      ? Math.round(myEntries.reduce((sum, e) => sum + e.score, 0) / myEntries.length)
      : null

  return (
    <div className="min-h-screen bg-white max-w-sm mx-auto md:max-w-3xl">
      {/* Sticky header */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between h-14 px-4">
          <h1 className="text-base font-bold text-slate-900">Profile</h1>
        </div>
      </header>

      <div className="pb-24">
        {/* ── Avatar + identity card ── */}
        <section className="bg-white px-5 pb-6 pt-6">
          {/* Avatar */}
          <div className="relative shrink-0 w-fit mb-5">
            <img
              src={creator.photo_url ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.id}`}
              alt={creator.name}
              className="w-20 h-20 rounded-full object-cover border border-slate-200"
            />
            {creator.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-cc-accent flex items-center justify-center border-2 border-white">
                <BadgeCheck className="h-3.5 w-3.5 text-white" />
              </div>
            )}
          </div>

          {/* Name + verified badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-black text-slate-900 leading-tight">{creator.name}</h2>
            {creator.verified && (
              <span className="inline-flex items-center gap-1 border border-cc-accent/30 text-cc-accent text-[10px] font-semibold px-2 py-0.5 rounded-md">
                <CheckCircle2 className="h-2.5 w-2.5" />
                Verified
              </span>
            )}
          </div>

          {/* Social handles */}
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            {creator.ig_handle && (
              <div className="flex items-center gap-1.5">
                <Instagram className="h-3.5 w-3.5 text-pink-500" />
                <span className="text-sm text-slate-500 font-semibold">{creator.ig_handle}</span>
              </div>
            )}
            {creator.tiktok_handle && (
              <div className="flex items-center gap-1.5">
                <Music2 className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-sm text-slate-500 font-semibold">{creator.tiktok_handle}</span>
              </div>
            )}
          </div>

          {/* Ban state */}
          {creator.ban_state !== 'none' && (
            <div className="mt-4 flex items-center gap-2 border border-red-200 rounded-lg px-3 py-2.5">
              <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
              <p className="text-xs text-red-500">
                {creator.ban_state === 'permanent'
                  ? 'Permanently banned'
                  : `Temporarily banned${creator.ban_until ? ` until ${formatDate(creator.ban_until)}` : ''}`}
              </p>
            </div>
          )}

          {/* Strike indicator */}
          {creator.strike_count > 0 && (
            <div className="mt-3 border border-red-200 rounded-lg p-3 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      'w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold',
                      i < creator.strike_count
                        ? 'border-red-300 text-red-400'
                        : 'border-slate-200 text-slate-300'
                    )}
                  >
                    {i < creator.strike_count ? '✕' : '○'}
                  </div>
                ))}
              </div>
              <span className="text-xs text-red-400">
                {creator.strike_count}/3 strikes
              </span>
            </div>
          )}
        </section>

        {/* ── Stats row ── */}
        <section className="bg-white border-t border-b border-slate-200 mx-0 mt-3">
          <div className="flex items-stretch">
            <Stat label="Total Comps" value={totalComps} />
            <Stat label="Approved" value={approvedPosts} border />
            <Stat label="Avg Score" value={avgScore ? formatNumber(avgScore) : '—'} border />
          </div>
        </section>

        {/* ── Leaderboard ── */}
        <section className="px-4 pt-6 pb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-900">This Month&apos;s Standings</h2>
            </div>
            <span className="text-xs text-slate-400">{month}</span>
          </div>
          <div className="space-y-4">
            <LeaderboardCard
              platform="IG_REEL"
              entries={leaderboard}
              creatorId={creator.id}
            />
            <LeaderboardCard
              platform="TIKTOK"
              entries={leaderboard}
              creatorId={creator.id}
            />
          </div>
        </section>

        {/* ── Comp History ── */}
        <section className="px-4 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900">Comp History</h2>
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center border border-slate-200 rounded-lg">
              <BarChart3 className="h-6 w-6 text-slate-300" />
              <div>
                <p className="text-sm font-medium text-slate-900">No history yet</p>
                <p className="text-xs text-slate-400 mt-0.5">Your completed comps will appear here</p>
              </div>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <ul className="divide-y divide-slate-50">
                {recentOrders.map((order) => (
                  <li key={order.id} className="flex items-center gap-3 py-4 px-4">
                    {/* Status dot */}
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full shrink-0',
                        order.status === 'approved'
                          ? 'bg-emerald-400'
                          : order.status === 'proof_submitted'
                          ? 'bg-amber-400'
                          : order.status === 'confirmed'
                          ? 'bg-cc-accent'
                          : 'bg-slate-300'
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-900 truncate">
                        {order.restaurant_name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {relativeTime(order.created_at)} ·{' '}
                        <span className="text-slate-500">
                          {order.items.map((i) => i.menu_item_name).join(', ')}
                        </span>
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* ── Settings ── */}
        <section className="px-4 pb-6">
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 transition-colors"
              onClick={() => {}}
            >
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-700">Edit Profile</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </button>
            <div className="h-px bg-slate-200" />
            <button
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors"
              onClick={() => router.push('/')}
            >
              <LogOut className="h-4 w-4 text-red-400" />
              <span className="text-sm text-red-500">Sign Out</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
