'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import {
  DEMO_CREATORS,
  DEMO_RESTAURANTS,
  DEMO_PROOF_SUBMISSIONS,
  DEMO_ORDERS,
  DEMO_CONTEST_ENTRIES,
} from '@/lib/demo-data'
import { relativeTime, formatNumber, currentMonthKey } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

const STATS = [
  { label: 'Total Creators', value: 48 },
  { label: 'Verified', value: 41 },
  { label: 'Pending Vetting', value: 3 },
  { label: 'Active Restaurants', value: DEMO_RESTAURANTS.filter((r) => r.active).length },
  { label: 'Comps This Month', value: 127 },
  {
    label: 'Proofs Pending',
    value: DEMO_PROOF_SUBMISSIONS.filter((p) => p.review_status === 'pending').length,
  },
]

const ACTIVITY_LOG = [
  { id: 1, text: "Proof approved for Mia Tanaka (TikTok @ Cubby's)", time: '2 hours ago' },
  { id: 2, text: 'New proof submitted by Mia Tanaka (IG Reel @ Brick Oven)', time: '5 hours ago' },
  { id: 3, text: 'Creator Jordan Reyes approved after DM verification', time: '1 day ago' },
  { id: 4, text: 'Strike issued to Jordan Reyes (account_private)', time: '3 weeks ago' },
  { id: 5, text: "Comp confirmed: Mia Tanaka @ Cubby's Chicago Dogs", time: '3 weeks ago' },
  { id: 6, text: 'Creator application rejected (incomplete profile)', time: '1 month ago' },
  { id: 7, text: "Restaurant \"Cubby's Chicago Dogs\" added to network", time: '5 months ago' },
  { id: 8, text: 'January 2026 contest locked — winner: @miaeatsutah', time: '1 month ago' },
]

const PENDING_CREATORS = [
  {
    id: 'app-001',
    name: 'Aaliyah Okonkwo',
    ig_handle: '@aaliyah.bites',
    submitted_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'app-002',
    name: 'Brett Sullivan',
    ig_handle: '@brett_eatsslc',
    submitted_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
  },
  {
    id: 'app-003',
    name: 'Sofia Mendez',
    ig_handle: '@sofiafoodie',
    submitted_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  },
]

const TOP_IG = DEMO_CONTEST_ENTRIES
  .filter((e) => e.platform === 'IG_REEL')
  .sort((a, b) => b.score - a.score)
  .slice(0, 3)
const TOP_TT = DEMO_CONTEST_ENTRIES
  .filter((e) => e.platform === 'TIKTOK')
  .sort((a, b) => b.score - a.score)
  .slice(0, 3)

const MAX_SCORE = Math.max(
  ...TOP_IG.map((e) => e.score),
  ...TOP_TT.map((e) => e.score),
  1
)

const TROPHY_ICONS = ['🥇', '🥈', '🥉']

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
      {/* Header */}
      <div className="border-b border-white/[0.06] pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Dashboard</h1>
            <p className="text-sm text-white/40 mt-0.5">{today}</p>
          </div>
          <span className="text-xs text-white/40 border border-white/[0.06] px-3 py-1.5 rounded-lg font-medium">
            Demo Mode
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-[#1a1a1a] border border-white/[0.06] rounded-lg p-4">
            <div className="text-3xl font-black text-white leading-none mb-1">{stat.value}</div>
            <div className="text-xs text-white/40 mt-1 leading-snug">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-12 gap-5">
        {/* Proof Review */}
        <div className="col-span-7 bg-[#1a1a1a] border border-white/[0.06] rounded-lg">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">Pending Proof Review</h2>
              {pendingProofs.length > 0 && (
                <span className="text-xs text-white/40 font-medium">({pendingProofs.length})</span>
              )}
            </div>
            <Link href="/admin/proof" className="flex items-center gap-1 text-cc-accent text-xs font-medium hover:underline">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {pendingProofs.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <p className="text-sm font-medium text-white">Queue is clear</p>
              <p className="text-xs text-white/40 mt-0.5">No proofs pending review.</p>
            </div>
          ) : (
            <ul>
              {pendingProofs.map((proof) => {
                const order = DEMO_ORDERS.find((o) => o.id === proof.order_id)
                const creator = DEMO_CREATORS.find((c) => c.id === proof.creator_id)
                return (
                  <li key={proof.id} className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.06] last:border-0 hover:bg-white/5 transition-colors">
                    <Avatar
                      src={creator?.photo_url ?? null}
                      name={creator?.name ?? 'Unknown'}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {creator?.name ?? 'Unknown Creator'}
                      </p>
                      <p className="text-xs text-white/40 truncate">
                        {order?.restaurant_name ?? '—'} · {relativeTime(proof.submitted_at)}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-white/40 border border-white/[0.06] px-2 py-0.5 rounded">
                      {proof.platform === 'IG_REEL' ? 'IG Reel' : 'TikTok'}
                    </span>
                    <button
                      onClick={() => router.push(`/admin/proof/${proof.id}`)}
                      className="bg-cc-accent text-white rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-cc-accent-dark transition-colors shrink-0"
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
        <div className="col-span-5 bg-[#1a1a1a] border border-white/[0.06] rounded-lg">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">Pending Vetting</h2>
              <span className="text-xs text-white/40 font-medium">({PENDING_CREATORS.length})</span>
            </div>
            <Link href="/admin/vetting" className="flex items-center gap-1 text-cc-accent text-xs font-medium hover:underline">
              All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <ul>
            {PENDING_CREATORS.map((c) => (
              <li key={c.id} className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.06] last:border-0 hover:bg-white/5 transition-colors">
                <Avatar src={null} name={c.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{c.name}</p>
                  <p className="text-xs text-white/40 truncate">
                    {c.ig_handle} · {relativeTime(c.submitted_at)}
                  </p>
                </div>
                <button
                  onClick={() => router.push(`/admin/vetting/${c.id}`)}
                  className="bg-cc-accent text-white rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-cc-accent-dark transition-colors shrink-0"
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
        <div className="col-span-7 bg-[#1a1a1a] border border-white/[0.06] rounded-lg">
          <div className="px-5 py-3.5 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
          </div>
          <ul>
            {ACTIVITY_LOG.map((event) => (
              <li key={event.id} className="flex items-start gap-3 px-5 py-3 border-b border-white/[0.06] last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/60 leading-snug">{event.text}</p>
                </div>
                <span className="shrink-0 text-xs text-white/40 whitespace-nowrap mt-0.5">{event.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Leaderboard */}
        <div className="col-span-5 bg-[#1a1a1a] border border-white/[0.06] rounded-lg">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
            <div>
              <h2 className="text-sm font-semibold text-white">February Leaderboard</h2>
              <p className="text-xs text-white/40 mt-0.5">Feb 2026 · 2 days remaining</p>
            </div>
            <Link href="/admin/leaderboard" className="flex items-center gap-1 text-cc-accent text-xs font-medium hover:underline">
              Manage <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="px-5 py-4 space-y-5">
            <div>
              <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-3">IG Reel</p>
              <div className="space-y-2.5">
                {TOP_IG.length === 0 ? (
                  <p className="text-xs text-white/40">No entries yet</p>
                ) : (
                  TOP_IG.map((entry, i) => (
                    <div key={entry.id} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm shrink-0">{TROPHY_ICONS[i]}</span>
                        <span className="flex-1 text-sm text-white/70 truncate">{entry.creator_name}</span>
                        <span className="text-xs font-semibold text-cc-accent">{formatNumber(entry.score)}</span>
                      </div>
                      <div className="ml-6 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cc-accent rounded-full"
                          style={{ width: `${Math.round((entry.score / MAX_SCORE) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t border-white/[0.06]" />

            <div>
              <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-3">TikTok</p>
              <div className="space-y-2.5">
                {TOP_TT.length === 0 ? (
                  <p className="text-xs text-white/40">No entries yet</p>
                ) : (
                  TOP_TT.map((entry, i) => (
                    <div key={entry.id} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm shrink-0">{TROPHY_ICONS[i]}</span>
                        <span className="flex-1 text-sm text-white/70 truncate">{entry.creator_name}</span>
                        <span className="text-xs font-semibold text-white/50">{formatNumber(entry.score)}</span>
                      </div>
                      <div className="ml-6 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white/40 rounded-full"
                          style={{ width: `${Math.round((entry.score / MAX_SCORE) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t border-white/[0.06] pt-3">
              <Link href="/admin/leaderboard">
                <Button variant="outline" size="sm" className="w-full border-white/[0.06] text-white/60 hover:bg-white/5">
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
