'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Instagram, Music2 } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import { useAnalytics } from '@/lib/hooks/useAnalytics'

function MetricCard({ label, value, change }: { label: string; value: number; change?: number }) {
  const isPositive = (change ?? 0) >= 0
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-2">{label}</p>
      <p className="text-2xl font-bold text-white">{formatNumber(value)}</p>
      {change !== undefined && (
        <p className={`text-xs font-semibold mt-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{change}% vs last month
        </p>
      )}
    </div>
  )
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'ig' | 'tiktok'>('ig')
  const { ig: IG_DATA, tiktok: TT_DATA, loading } = useAnalytics()
  const data = tab === 'ig' ? IG_DATA : TT_DATA

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white max-w-[430px] mx-auto">
      {/* Header */}
      <header className="px-4 pt-14 pb-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#1a1a1a] transition-colors">
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
      </header>

      <div className="px-4 pb-28 space-y-4">
        {/* Platform toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab('ig')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border font-semibold text-sm transition-all"
            style={tab === 'ig'
              ? { background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)', border: 'none', color: 'white' }
              : { background: '#1a1a1a', borderColor: '#2a2a2a', color: '#9ca3af' }
            }
          >
            <Instagram className="h-4 w-4" />
            Instagram
          </button>
          <button
            onClick={() => setTab('tiktok')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border font-semibold text-sm transition-all"
            style={tab === 'tiktok'
              ? { background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)', border: 'none', color: 'white' }
              : { background: '#1a1a1a', borderColor: '#2a2a2a', color: '#9ca3af' }
            }
          >
            <Music2 className="h-4 w-4" />
            TikTok
          </button>
        </div>

        {/* Summary card */}
        <div
          className="rounded-2xl p-5 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.15) 0%, rgba(74,144,226,0.15) 100%)', border: '1px solid rgba(255,107,53,0.2)' }}
        >
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1">Total Reach</p>
            <p className="text-3xl font-bold text-white">{formatNumber(data.views)}</p>
            <p className="text-xs text-gray-500 mt-0.5">{data.posts} post{data.posts !== 1 ? 's' : ''} this month</p>
          </div>
          {tab === 'ig'
            ? <Instagram className="h-10 w-10 text-pink-400/50" />
            : <Music2 className="h-10 w-10 text-gray-400/50" />
          }
        </div>

        {/* Metric cards grid */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard label="Views" value={data.views} change={12} />
          <MetricCard label="Likes" value={data.likes} change={8} />
          <MetricCard label="Comments" value={data.comments} change={-3} />
          <MetricCard label="Saves" value={data.saves} change={15} />
        </div>

        {/* Posts card */}
        <MetricCard label="Posts This Month" value={data.posts} />

        {/* Performance note */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-2">Score Formula</p>
          <p className="text-sm text-gray-300">Views × 1 + Likes × 5 + Comments × 25</p>
          <p className="text-xs text-gray-500 mt-1.5">
            Current score: <span className="text-white font-bold">{formatNumber(data.views + data.likes * 5 + data.comments * 25)}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
