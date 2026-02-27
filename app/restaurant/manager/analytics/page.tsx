'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import {
  DEMO_ORDERS,
  DEMO_CREATORS,
  DEMO_PROOF_SUBMISSIONS,
  DEMO_ANALYTICS_SNAPSHOTS,
  DEMO_MENU_ITEMS,
} from '@/lib/demo-data'
import { formatNumber, computeScore, cn } from '@/lib/utils'
import {
  ArrowLeft,
  Download,
  TrendingUp,
  DollarSign,
  Video,
  Eye,
  Instagram,
  Music2,
  ExternalLink,
  BarChart3,
} from 'lucide-react'

// ── Compute summary metrics ──────────────────────────────────

const confirmedOrders = DEMO_ORDERS.filter(
  (o) =>
    o.status === 'confirmed' ||
    o.status === 'proof_submitted' ||
    o.status === 'approved'
)

function getItemCogs(itemId: string): number {
  const item = DEMO_MENU_ITEMS.find((m) => m.id === itemId)
  return item?.estimated_cogs ?? 0
}

const totalCogs = confirmedOrders.reduce((sum, order) => {
  return (
    sum +
    order.items.reduce((s, item) => s + getItemCogs(item.menu_item_id) * item.qty, 0)
  )
}, 0)

const approvedProofs = DEMO_PROOF_SUBMISSIONS.filter((p) => p.review_status === 'approved')
const videosDelivered = approvedProofs.length

const latestSnapshots = DEMO_PROOF_SUBMISSIONS.map((proof) => {
  const snaps = DEMO_ANALYTICS_SNAPSHOTS.filter((s) => s.proof_id === proof.id)
  if (snaps.length === 0) return null
  return snaps.reduce((latest, s) => (s.timestamp > latest.timestamp ? s : latest))
}).filter(Boolean)

const totalViews = latestSnapshots.reduce((sum, s) => sum + (s?.views ?? 0), 0)

const today = new Date()
const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

const dailyCompsData: number[] = Array.from({ length: daysInMonth }, (_, i) => {
  const day = i + 1
  if (day === 1) return 2
  if (day === 3) return 1
  if (day === 5) return 3
  if (day === 7) return 2
  if (day === 10) return 1
  if (day === 12) return 4
  if (day === 14) return 2
  if (day === 15) return 3
  if (day === 18) return 1
  if (day === 20) return 2
  if (day === 22) return 3
  if (day === today.getDate()) return 1
  return 0
})

const maxDailyComps = Math.max(...dailyCompsData, 1)

const igProofs = DEMO_PROOF_SUBMISSIONS.filter((p) => p.platform === 'IG_REEL').length
const tikTokProofs = DEMO_PROOF_SUBMISSIONS.filter((p) => p.platform === 'TIKTOK').length
const totalProofs = igProofs + tikTokProofs || 1

const scoredContent = DEMO_PROOF_SUBMISSIONS.map((proof) => {
  const snaps = DEMO_ANALYTICS_SNAPSHOTS.filter((s) => s.proof_id === proof.id)
  const latest = snaps.length
    ? snaps.reduce((a, b) => (a.timestamp > b.timestamp ? a : b))
    : null
  const creator = DEMO_CREATORS.find((c) => c.id === proof.creator_id)
  const score = latest ? computeScore(latest.views, latest.likes, latest.comments) : 0
  return { proof, creator, score, views: latest?.views ?? 0 }
}).sort((a, b) => b.score - a.score).slice(0, 5)

const cpv = totalViews > 0 ? totalCogs / totalViews : 0

function exportAnalyticsCSV() {
  const rows = [
    ['Metric', 'Value'],
    ['Total Comps This Month', String(confirmedOrders.length)],
    ['Estimated COGS Spent', `$${totalCogs.toFixed(2)}`],
    ['Videos Delivered', String(videosDelivered)],
    ['Total Views Generated', String(totalViews)],
    ['IG Reels', String(igProofs)],
    ['TikToks', String(tikTokProofs)],
    ['Cost Per View', `$${cpv.toFixed(4)}`],
    [],
    ['Creator', 'Platform', 'Score', 'Views', 'URL'],
    ...scoredContent.map((c) => [
      c.creator?.name ?? '',
      c.proof.platform,
      String(c.score),
      String(c.views),
      c.proof.url,
    ]),
  ]

  const csv = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `analytics-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
  iconBg: string
  iconColor: string
  topBorder: string
}

function StatCard({ icon, label, value, sub, iconBg, iconColor, topBorder }: StatCardProps) {
  return (
    <div className={cn('bg-white border border-slate-100 rounded-2xl shadow-sm p-5 border-t-4', topBorder)}>
      <div className={cn('h-10 w-10 rounded-full flex items-center justify-center mb-3', iconBg)}>
        <span className={iconColor}>{icon}</span>
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-3xl font-black text-slate-900">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function AnalyticsPage() {
  const router = useRouter()

  return (
    <div className="p-6">
      <div className="cc-inner">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/restaurant/manager')}
              className="text-slate-400 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
              <p className="text-sm text-slate-500">
                {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <button
            onClick={exportAnalyticsCSV}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Total Comps"
            value={String(confirmedOrders.length)}
            sub="this month"
            iconBg="bg-blue-50"
            iconColor="text-cc-accent"
            topBorder="border-cc-accent"
          />
          <StatCard
            icon={<DollarSign className="h-5 w-5" />}
            label="Est. COGS"
            value={`$${totalCogs.toFixed(2)}`}
            sub="food cost"
            iconBg="bg-red-50"
            iconColor="text-red-500"
            topBorder="border-red-400"
          />
          <StatCard
            icon={<Video className="h-5 w-5" />}
            label="Videos Delivered"
            value={String(videosDelivered)}
            sub="approved posts"
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            topBorder="border-emerald-400"
          />
          <StatCard
            icon={<Eye className="h-5 w-5" />}
            label="Total Views"
            value={formatNumber(totalViews)}
            sub="est. reach"
            iconBg="bg-purple-50"
            iconColor="text-purple-500"
            topBorder="border-purple-400"
          />
        </div>

        {/* ── Daily Comps Bar Chart ── */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 mb-5">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="h-5 w-5 text-cc-accent" />
            <h2 className="text-base font-bold text-slate-900">Daily Comps This Month</h2>
          </div>

          <div className="flex items-end gap-1 h-32 bg-slate-50 rounded-xl p-3">
            {dailyCompsData.map((count, idx) => {
              const day = idx + 1
              const isToday = day === today.getDate()
              const height = count === 0 ? 2 : Math.round((count / maxDailyComps) * 100)

              return (
                <div key={day} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                  <div
                    className={cn(
                      'w-full rounded-t-sm transition-all',
                      isToday
                        ? 'bg-cc-accent'
                        : count > 0
                        ? 'bg-cc-accent/35'
                        : 'bg-slate-200'
                    )}
                    style={{ height: `${height}%`, minHeight: count === 0 ? '2px' : '4px' }}
                    title={`Day ${day}: ${count} comp${count !== 1 ? 's' : ''}`}
                  />
                  {(day === 1 || day % 5 === 0 || isToday) && (
                    <span className={cn(
                      'text-[9px] font-semibold',
                      isToday ? 'text-cc-accent' : 'text-slate-400'
                    )}>
                      {day}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* ── Platform Split ── */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-900 mb-5">Platform Split</h2>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="text-center bg-slate-50 rounded-2xl p-4">
                <div className="h-12 w-12 rounded-full bg-pink-50 flex items-center justify-center mx-auto mb-2">
                  <Instagram className="h-6 w-6 text-pink-500" />
                </div>
                <p className="text-2xl font-black text-slate-900">{igProofs}</p>
                <p className="text-xs text-slate-400 mt-0.5">IG Reels</p>
                <p className="text-sm font-bold text-pink-500 mt-0.5">
                  {Math.round((igProofs / totalProofs) * 100)}%
                </p>
              </div>
              <div className="text-center bg-slate-50 rounded-2xl p-4">
                <div className="h-12 w-12 rounded-full bg-cyan-50 flex items-center justify-center mx-auto mb-2">
                  <Music2 className="h-6 w-6 text-cyan-500" />
                </div>
                <p className="text-2xl font-black text-slate-900">{tikTokProofs}</p>
                <p className="text-xs text-slate-400 mt-0.5">TikToks</p>
                <p className="text-sm font-bold text-cyan-500 mt-0.5">
                  {Math.round((tikTokProofs / totalProofs) * 100)}%
                </p>
              </div>
            </div>

            {/* Split bar */}
            <div className="h-3 rounded-full overflow-hidden bg-slate-100 flex">
              <div
                className="h-full bg-pink-400 rounded-l-full transition-all"
                style={{ width: `${(igProofs / totalProofs) * 100}%` }}
              />
              <div
                className="h-full bg-cyan-400 rounded-r-full transition-all"
                style={{ width: `${(tikTokProofs / totalProofs) * 100}%` }}
              />
            </div>
          </div>

          {/* ── ROI ── */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-900 mb-5">Estimated ROI</h2>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center bg-slate-50 rounded-xl px-4 py-3">
                <span className="text-sm text-slate-500">COGS spent</span>
                <span className="text-base font-bold text-red-500">${totalCogs.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 rounded-xl px-4 py-3">
                <span className="text-sm text-slate-500">Est. reach (views)</span>
                <span className="text-base font-bold text-emerald-600">{formatNumber(totalViews)}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 rounded-xl px-4 py-3">
                <span className="text-sm text-slate-500">Cost per view</span>
                <span className="text-base font-bold text-cc-accent">
                  {totalViews > 0 ? `$${cpv.toFixed(4)}` : '—'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                Compared to paid social ads (avg $0.02–$0.05 CPV), creator comps
                {cpv > 0 && cpv < 0.02 ? (
                  <span className="text-emerald-600 font-semibold"> are significantly more cost-effective.</span>
                ) : cpv > 0 ? (
                  <span className="text-slate-600"> provide comparable reach.</span>
                ) : (
                  <span> — data available once content is approved.</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* ── Top Content ── */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-5 w-5 text-cc-accent" />
            <h2 className="text-base font-bold text-slate-900">Top Content by Score</h2>
          </div>
          <p className="text-xs text-slate-400 mb-5">Score = Views + Likes×5 + Comments×25</p>

          {scoredContent.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">
              No approved content yet this month.
            </p>
          ) : (
            <div className="flex flex-col">
              {scoredContent.map((entry, idx) => {
                const maxScore = scoredContent[0]?.score ?? 1
                const barPct = Math.round((entry.score / maxScore) * 100)

                return (
                  <div
                    key={entry.proof.id}
                    className={cn(
                      'flex items-center gap-4 py-4',
                      idx < scoredContent.length - 1 && 'border-b border-slate-100'
                    )}
                  >
                    {/* Rank number */}
                    <div className="w-8 shrink-0 text-center">
                      <span className={cn(
                        'font-black text-2xl',
                        idx === 0 && 'text-amber-400',
                        idx === 1 && 'text-slate-300',
                        idx === 2 && 'text-amber-700/60',
                        idx > 2 && 'text-slate-200'
                      )}>
                        {idx + 1}
                      </span>
                    </div>

                    <Avatar
                      src={entry.creator?.photo_url ?? null}
                      name={entry.creator?.name ?? 'Unknown'}
                      size="sm"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {entry.creator?.name ?? 'Unknown'}
                        </p>
                        <Badge
                          variant={entry.proof.platform === 'IG_REEL' ? 'info' : 'neutral'}
                          size="sm"
                        >
                          {entry.proof.platform === 'IG_REEL' ? 'IG Reel' : 'TikTok'}
                        </Badge>
                      </div>
                      {/* Score bar */}
                      <div className="h-1.5 w-full bg-cc-accent/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cc-accent rounded-full transition-all"
                          style={{ width: `${barPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-slate-900">
                        {formatNumber(entry.score)}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatNumber(entry.views)} views
                      </p>
                    </div>

                    <a
                      href={entry.proof.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-slate-400 hover:text-cc-accent transition-colors p-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
