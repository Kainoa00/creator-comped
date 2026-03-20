'use client'

import { DarkHeader } from '@/components/restaurant-ui/DarkHeader'
import { DarkStatCard } from '@/components/restaurant-ui/DarkStatCard'
import {
  DEMO_ORDERS,
  DEMO_PROOF_SUBMISSIONS,
  DEMO_ANALYTICS_SNAPSHOTS,
  DEMO_CREATORS,
  DEMO_MENU_ITEMS,
} from '@/lib/demo-data'
import { formatNumber, computeScore, cn } from '@/lib/utils'
import { TrendingUp, DollarSign, Video, Eye, Instagram, Music2, ExternalLink } from 'lucide-react'

const confirmedOrders = DEMO_ORDERS.filter((o) =>
  ['confirmed', 'proof_submitted', 'approved'].includes(o.status)
)

function getItemCogs(id: string) {
  return DEMO_MENU_ITEMS.find((m) => m.id === id)?.estimated_cogs ?? 0
}

const totalCogs = confirmedOrders.reduce(
  (sum, o) => sum + o.items.reduce((s, i) => s + getItemCogs(i.menu_item_id) * i.qty, 0),
  0
)

const approvedProofs = DEMO_PROOF_SUBMISSIONS.filter((p) => p.review_status === 'approved')
const videosDelivered = approvedProofs.length

const latestSnapshots = DEMO_PROOF_SUBMISSIONS.map((proof) => {
  const snaps = DEMO_ANALYTICS_SNAPSHOTS.filter((s) => s.proof_id === proof.id)
  if (!snaps.length) return null
  return snaps.reduce((a, b) => (a.timestamp > b.timestamp ? a : b))
}).filter(Boolean)

const totalViews = latestSnapshots.reduce((sum, s) => sum + (s?.views ?? 0), 0)
const cpv = totalViews > 0 ? totalCogs / totalViews : 0

const igProofs = DEMO_PROOF_SUBMISSIONS.filter((p) => p.platform === 'IG_REEL').length
const ttProofs = DEMO_PROOF_SUBMISSIONS.filter((p) => p.platform === 'TIKTOK').length
const totalProofs = igProofs + ttProofs || 1

const today = new Date()
const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
const dailyData: number[] = Array.from({ length: daysInMonth }, (_, i) => {
  const day = i + 1
  if (day === 1) return 2; if (day === 3) return 1; if (day === 5) return 3
  if (day === 7) return 2; if (day === 10) return 1; if (day === 12) return 4
  if (day === 14) return 2; if (day === 15) return 3; if (day === 18) return 1
  if (day === 20) return 2; if (day === 22) return 3
  if (day === today.getDate()) return 1
  return 0
})
const maxDaily = Math.max(...dailyData, 1)

const topContent = DEMO_PROOF_SUBMISSIONS.map((proof) => {
  const snaps = DEMO_ANALYTICS_SNAPSHOTS.filter((s) => s.proof_id === proof.id)
  const latest = snaps.length ? snaps.reduce((a, b) => (a.timestamp > b.timestamp ? a : b)) : null
  const creator = DEMO_CREATORS.find((c) => c.id === proof.creator_id)
  const score = latest ? computeScore(latest.views, latest.likes, latest.comments) : 0
  return { proof, creator, score, views: latest?.views ?? 0 }
}).sort((a, b) => b.score - a.score).slice(0, 5)

export default function ManagerAnalyticsPage() {
  return (
    <div className="px-4 pt-6 pb-6">
      <DarkHeader
        title="Analytics"
        subtitle={today.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
        backHref="/restaurant/manager"
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <DarkStatCard icon={TrendingUp} label="Total Comps" value={confirmedOrders.length} sub="this month" accent />
        <DarkStatCard icon={DollarSign} label="Est. COGS" value={`$${totalCogs.toFixed(0)}`} sub="food cost" />
        <DarkStatCard icon={Video} label="Videos" value={videosDelivered} sub="delivered" />
        <DarkStatCard icon={Eye} label="Total Views" value={formatNumber(totalViews)} sub="est. reach" />
      </div>

      {/* Daily Bar Chart */}
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5 mb-4">
        <p className="text-sm font-semibold text-white mb-4">Daily Comps This Month</p>
        <div className="flex items-end gap-0.5 h-24">
          {dailyData.map((count, idx) => {
            const day = idx + 1
            const isToday = day === today.getDate()
            const height = count === 0 ? 2 : Math.round((count / maxDaily) * 100)
            return (
              <div key={day} className="flex flex-col items-center flex-1 min-w-0">
                <div
                  className={cn(
                    'w-full rounded-t-sm',
                    isToday ? 'bg-gradient-to-t from-orange-500 to-rose-400' : count > 0 ? 'bg-white/20' : 'bg-white/[0.05]'
                  )}
                  style={{ height: `${height}%`, minHeight: count === 0 ? '2px' : '4px' }}
                />
              </div>
            )
          })}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-white/30">1</span>
          <span className="text-xs text-white/30">{Math.round(daysInMonth / 2)}</span>
          <span className="text-xs text-white/30">{daysInMonth}</span>
        </div>
      </div>

      {/* Platform Split */}
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5 mb-4">
        <p className="text-sm font-semibold text-white mb-4">Platform Split</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/[0.03] rounded-xl p-4 text-center">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mx-auto mb-2">
              <Instagram className="h-5 w-5 text-white" />
            </div>
            <p className="text-xl font-bold text-white">{igProofs}</p>
            <p className="text-xs text-white/40 mt-0.5">IG Reels</p>
            <p className="text-sm font-semibold text-white/60">{Math.round((igProofs / totalProofs) * 100)}%</p>
          </div>
          <div className="bg-white/[0.03] rounded-xl p-4 text-center">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-2">
              <Music2 className="h-5 w-5 text-white" />
            </div>
            <p className="text-xl font-bold text-white">{ttProofs}</p>
            <p className="text-xs text-white/40 mt-0.5">TikToks</p>
            <p className="text-sm font-semibold text-white/60">{Math.round((ttProofs / totalProofs) * 100)}%</p>
          </div>
        </div>
        <div className="h-2 rounded-full overflow-hidden bg-white/[0.05] flex">
          <div className="h-full bg-gradient-to-r from-pink-500 to-purple-600" style={{ width: `${(igProofs / totalProofs) * 100}%` }} />
          <div className="h-full bg-white/30" style={{ width: `${(ttProofs / totalProofs) * 100}%` }} />
        </div>
      </div>

      {/* ROI */}
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5 mb-4">
        <p className="text-sm font-semibold text-white mb-4">Estimated ROI</p>
        <div className="flex flex-col gap-2">
          {[
            { label: 'COGS spent', value: `$${totalCogs.toFixed(2)}`, color: 'text-red-400' },
            { label: 'Est. reach (views)', value: formatNumber(totalViews), color: 'text-emerald-400' },
            { label: 'Cost per view', value: totalViews > 0 ? `$${cpv.toFixed(4)}` : '—', color: 'text-white' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center justify-between bg-white/[0.03] rounded-xl px-4 py-3">
              <span className="text-sm text-white/50">{label}</span>
              <span className={cn('text-sm font-bold', color)}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Content */}
      {topContent.length > 0 && (
        <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-sm font-semibold text-white mb-1">Top Content</p>
          <p className="text-xs text-white/30 mb-4">Score = Views + Likes×5 + Comments×25</p>
          <div className="flex flex-col gap-4">
            {topContent.map((entry, idx) => {
              const maxScore = topContent[0]?.score ?? 1
              const barPct = Math.round((entry.score / maxScore) * 100)
              return (
                <div key={entry.proof.id} className="flex items-center gap-3">
                  <span className={cn(
                    'text-lg font-bold w-6 text-center shrink-0',
                    idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-white/40' : 'text-white/20'
                  )}>
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-white truncate">{entry.creator?.name ?? 'Unknown'}</p>
                      <p className="text-xs text-white/40 shrink-0 ml-2">{formatNumber(entry.score)}</p>
                    </div>
                    <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-blue-600"
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                  </div>
                  <a href={entry.proof.url} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white shrink-0">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
