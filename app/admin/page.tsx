'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge, ProofStatusBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import {
  DEMO_CREATORS,
  DEMO_RESTAURANTS,
  DEMO_PROOF_SUBMISSIONS,
  DEMO_ORDERS,
  DEMO_STRIKES,
  DEMO_CONTEST_ENTRIES,
} from '@/lib/demo-data'
import { relativeTime, formatNumber, currentMonthKey } from '@/lib/utils'
import {
  Users,
  BadgeCheck,
  Clock,
  Store,
  Gift,
  Film,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
  Trophy,
  ArrowRight,
  Activity,
  TrendingUp,
} from 'lucide-react'

// Demo aggregate stats
const STATS = [
  {
    label: 'Total Creators',
    value: 48,
    icon: <Users className="h-5 w-5" />,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    highlight: false,
    bottomBorder: 'border-b-2 border-b-blue-400',
  },
  {
    label: 'Verified',
    value: 41,
    icon: <BadgeCheck className="h-5 w-5" />,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    highlight: false,
    bottomBorder: 'border-b-2 border-b-emerald-400',
  },
  {
    label: 'Pending Vetting',
    value: 3,
    icon: <Clock className="h-5 w-5" />,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    highlight: false,
    bottomBorder: 'border-b-2 border-b-amber-400',
  },
  {
    label: 'Active Restaurants',
    value: DEMO_RESTAURANTS.filter((r) => r.active).length,
    icon: <Store className="h-5 w-5" />,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-500',
    highlight: false,
    bottomBorder: 'border-b-2 border-b-violet-400',
  },
  {
    label: 'Comps This Month',
    value: 127,
    icon: <Gift className="h-5 w-5" />,
    iconBg: 'bg-blue-50',
    iconColor: 'text-cc-accent',
    highlight: true,
    bottomBorder: 'border-b-2 border-b-cc-accent',
  },
  {
    label: 'Proofs Pending',
    value: DEMO_PROOF_SUBMISSIONS.filter((p) => p.review_status === 'pending').length,
    icon: <Film className="h-5 w-5" />,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    highlight: false,
    bottomBorder: 'border-b-2 border-b-red-400',
  },
]

// Demo activity log
const ACTIVITY_LOG = [
  {
    id: 1,
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    iconBg: 'bg-emerald-50',
    text: "Proof approved for Mia Tanaka (TikTok @ Cubby's)",
    time: '2 hours ago',
  },
  {
    id: 2,
    icon: <Film className="h-4 w-4 text-amber-500" />,
    iconBg: 'bg-amber-50',
    text: 'New proof submitted by Mia Tanaka (IG Reel @ Brick Oven)',
    time: '5 hours ago',
  },
  {
    id: 3,
    icon: <BadgeCheck className="h-4 w-4 text-emerald-500" />,
    iconBg: 'bg-emerald-50',
    text: 'Creator Jordan Reyes approved after DM verification',
    time: '1 day ago',
  },
  {
    id: 4,
    icon: <Zap className="h-4 w-4 text-red-500" />,
    iconBg: 'bg-red-50',
    text: 'Strike issued to Jordan Reyes (account_private)',
    time: '3 weeks ago',
  },
  {
    id: 5,
    icon: <Gift className="h-4 w-4 text-cc-accent" />,
    iconBg: 'bg-cc-accent-subtle',
    text: "Comp confirmed: Mia Tanaka @ Cubby's Chicago Dogs",
    time: '3 weeks ago',
  },
  {
    id: 6,
    icon: <XCircle className="h-4 w-4 text-red-500" />,
    iconBg: 'bg-red-50',
    text: 'Creator application rejected (incomplete profile)',
    time: '1 month ago',
  },
  {
    id: 7,
    icon: <Store className="h-4 w-4 text-blue-500" />,
    iconBg: 'bg-blue-50',
    text: "Restaurant \"Cubby's Chicago Dogs\" added to network",
    time: '5 months ago',
  },
  {
    id: 8,
    icon: <Trophy className="h-4 w-4 text-amber-400" />,
    iconBg: 'bg-amber-50',
    text: 'January 2026 contest locked — winner: @miaeatsutah',
    time: '1 month ago',
  },
]

// Demo vetting queue (pending creators)
const PENDING_CREATORS = [
  {
    id: 'app-001',
    name: 'Aaliyah Okonkwo',
    email: 'aaliyah@example.com',
    ig_handle: '@aaliyah.bites',
    tiktok_handle: '@aaliyahbites',
    submitted_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'app-002',
    name: 'Brett Sullivan',
    email: 'brett.s@example.com',
    ig_handle: '@brett_eatsslc',
    tiktok_handle: null,
    submitted_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
  },
  {
    id: 'app-003',
    name: 'Sofia Mendez',
    email: 'sofia.m@example.com',
    ig_handle: '@sofiafoodie',
    tiktok_handle: '@sofiamendezfood',
    submitted_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  },
]

// Demo leaderboard top 3 per platform
const MONTH_KEY = currentMonthKey()
const TOP_IG = DEMO_CONTEST_ENTRIES
  .filter((e) => e.platform === 'IG_REEL')
  .sort((a, b) => b.score - a.score)
  .slice(0, 3)
const TOP_TT = DEMO_CONTEST_ENTRIES
  .filter((e) => e.platform === 'TIKTOK')
  .sort((a, b) => b.score - a.score)
  .slice(0, 3)

const TROPHY_ICONS = ['🥇', '🥈', '🥉']

// Max score for progress bar calculation
const MAX_SCORE = Math.max(
  ...TOP_IG.map((e) => e.score),
  ...TOP_TT.map((e) => e.score),
  1
)

export default function AdminDashboardPage() {
  const router = useRouter()

  const pendingProofs = DEMO_PROOF_SUBMISSIONS.filter((p) => p.review_status === 'pending').slice(0, 5)

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-100 pb-5 -mx-8 px-8 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4">
            {/* Accent bar */}
            <div className="w-1 self-stretch rounded-full bg-cc-accent shrink-0" />
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard</h1>
              <p className="text-sm font-semibold text-slate-400 mt-0.5">{today}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full font-medium">
              Demo Mode
            </span>
            <Badge variant="success" dot>System Healthy</Badge>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-5">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className={`bg-white border rounded-2xl p-6 shadow-sm ${stat.bottomBorder} ${
              stat.highlight
                ? 'border-cc-accent/30 bg-blue-50/30'
                : 'border-slate-100'
            }`}
          >
            <div className={`inline-flex items-center justify-center h-12 w-12 rounded-2xl ${stat.iconBg} ${stat.iconColor} mb-4`}>
              {stat.icon}
            </div>
            <div className="text-4xl font-black text-slate-900 leading-none mb-1">{stat.value}</div>
            <div className="text-sm text-slate-500 font-medium mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-12 gap-5">
        {/* Proof Review Queue */}
        <div className="col-span-7 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                <Film className="h-3.5 w-3.5 text-amber-500" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Pending Proof Review</h2>
              {pendingProofs.length > 0 && (
                <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                  {pendingProofs.length}
                </span>
              )}
            </div>
            <Link href="/admin/proof" className="flex items-center gap-1 text-cc-accent text-sm font-medium hover:underline">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {pendingProofs.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="h-16 w-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <p className="font-semibold text-slate-900">Queue is clear</p>
              <p className="text-sm text-slate-400 mt-0.5">No proofs pending review.</p>
            </div>
          ) : (
            <ul>
              {pendingProofs.map((proof) => {
                const order = DEMO_ORDERS.find((o) => o.id === proof.order_id)
                const creator = DEMO_CREATORS.find((c) => c.id === proof.creator_id)
                return (
                  <li key={proof.id} className="flex items-center gap-4 px-6 py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                    <Avatar
                      src={creator?.photo_url ?? null}
                      name={creator?.name ?? 'Unknown'}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {creator?.name ?? 'Unknown Creator'}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {order?.restaurant_name ?? '—'} · {relativeTime(proof.submitted_at)}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                      proof.platform === 'IG_REEL'
                        ? 'bg-pink-50 text-pink-700 border-pink-200'
                        : 'bg-slate-900 text-white border-slate-900'
                    }`}>
                      {proof.platform === 'IG_REEL' ? 'IG Reel' : 'TikTok'}
                    </span>
                    <button
                      onClick={() => router.push(`/admin/proof/${proof.id}`)}
                      className="bg-cc-accent text-white rounded-xl px-4 py-2 text-sm font-bold hover:bg-cc-accent-dark transition-colors shrink-0"
                    >
                      Review
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Vetting Queue */}
        <div className="col-span-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <Users className="h-3.5 w-3.5 text-cc-accent" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Pending Vetting</h2>
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                {PENDING_CREATORS.length}
              </span>
            </div>
            <Link href="/admin/vetting" className="flex items-center gap-1 text-cc-accent text-sm font-medium hover:underline">
              All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <ul>
            {PENDING_CREATORS.map((c) => (
              <li key={c.id} className="flex items-center gap-3 px-6 py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                <Avatar src={null} name={c.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{c.name}</p>
                  <p className="text-xs text-slate-400 truncate">
                    {c.ig_handle ?? c.tiktok_handle ?? '—'} · {relativeTime(c.submitted_at)}
                  </p>
                </div>
                <button
                  onClick={() => router.push(`/admin/vetting/${c.id}`)}
                  className="bg-cc-accent text-white rounded-xl px-3 py-1.5 text-xs font-bold hover:bg-cc-accent-dark transition-colors shrink-0"
                >
                  Review
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-12 gap-5">
        {/* Activity Log */}
        <div className="col-span-7 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
            <div className="h-7 w-7 rounded-lg bg-cc-accent-subtle flex items-center justify-center shrink-0">
              <Activity className="h-3.5 w-3.5 text-cc-accent" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
          </div>
          <ul>
            {ACTIVITY_LOG.map((event) => (
              <li key={event.id} className="flex items-start gap-3 px-6 py-3 border-b border-slate-50 last:border-0">
                <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full ${event.iconBg} flex items-center justify-center`}>
                  {event.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 leading-snug">{event.text}</p>
                </div>
                <span className="shrink-0 text-xs text-slate-400 whitespace-nowrap mt-0.5">{event.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Monthly Contest Status */}
        <div className="col-span-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
            <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
              <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold text-slate-900">February Leaderboard</h2>
              <p className="text-xs text-slate-400">Feb 2026 · 2 days remaining</p>
            </div>
            <Link href="/admin/leaderboard" className="flex items-center gap-1 text-cc-accent text-sm font-medium hover:underline">
              Manage <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="px-6 py-4 space-y-4">
            {/* IG Top 3 */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                IG Reel
              </p>
              <div className="space-y-2.5">
                {TOP_IG.length === 0 ? (
                  <p className="text-xs text-slate-400">No entries yet</p>
                ) : (
                  TOP_IG.map((entry, i) => (
                    <div key={entry.id} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm shrink-0">{TROPHY_ICONS[i]}</span>
                        <span className="flex-1 text-sm text-slate-900 truncate font-medium">{entry.creator_name}</span>
                        <span className="text-sm font-black text-cc-accent">{formatNumber(entry.score)}</span>
                      </div>
                      <div className="ml-6 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cc-accent/60 rounded-full"
                          style={{ width: `${Math.round((entry.score / MAX_SCORE) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* TikTok Top 3 */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                TikTok
              </p>
              <div className="space-y-2.5">
                {TOP_TT.length === 0 ? (
                  <p className="text-xs text-slate-400">No entries yet</p>
                ) : (
                  TOP_TT.map((entry, i) => (
                    <div key={entry.id} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm shrink-0">{TROPHY_ICONS[i]}</span>
                        <span className="flex-1 text-sm text-slate-900 truncate font-medium">{entry.creator_name}</span>
                        <span className="text-sm font-black text-cc-accent">{formatNumber(entry.score)}</span>
                      </div>
                      <div className="ml-6 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-400/60 rounded-full"
                          style={{ width: `${Math.round((entry.score / MAX_SCORE) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <Link href="/admin/leaderboard">
                <Button variant="outline" size="sm" className="w-full">
                  Lock Contest Snapshot
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
