'use client'

import { useState } from 'react'
import { Instagram, Music2, Eye, Heart, MessageCircle, Info, TrendingUp } from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'
import { TimeRangeTrigger } from '@/components/restaurant-ui/TimeRangeTrigger'
import { TimeRangeModal } from '@/components/restaurant-ui/TimeRangeModal'
import type { TimeRange } from '@/lib/types'
import { AnimatedTabs } from '@/components/effects/AnimatedTabs'
import { AnimatedCounter } from '@/components/effects/AnimatedCounter'
import { StaggeredList, StaggerItem } from '@/components/effects/StaggeredList'

type Platform = 'instagram' | 'tiktok'

const topCreators = [
  {
    rank: 1,
    name: '@foodie_sarah',
    instagram: { views: 145000, likes: 12400, comments: 856, posts: 18 },
    tiktok: { views: 892000, likes: 45600, comments: 2340, posts: 18 },
  },
  {
    rank: 2,
    name: '@tastemaker_mike',
    instagram: { views: 128000, likes: 10200, comments: 742, posts: 16 },
    tiktok: { views: 756000, likes: 38900, comments: 1980, posts: 16 },
  },
  {
    rank: 3,
    name: '@eats_with_emma',
    instagram: { views: 112000, likes: 9300, comments: 654, posts: 15 },
    tiktok: { views: 687000, likes: 34200, comments: 1750, posts: 15 },
  },
  {
    rank: 4,
    name: '@chef_chronicles',
    instagram: { views: 98000, likes: 8100, comments: 567, posts: 14 },
    tiktok: { views: 623000, likes: 31200, comments: 1620, posts: 14 },
  },
  {
    rank: 5,
    name: '@downtown_diner',
    instagram: { views: 87000, likes: 7200, comments: 498, posts: 13 },
    tiktok: { views: 542000, likes: 27800, comments: 1430, posts: 13 },
  },
]

const totalsByPlatform = (['instagram', 'tiktok'] as Platform[]).reduce(
  (map, platform) => {
    map[platform] = topCreators.reduce(
      (acc, c) => {
        const d = c[platform]
        return { views: acc.views + d.views, likes: acc.likes + d.likes, comments: acc.comments + d.comments, posts: acc.posts + d.posts }
      },
      { views: 0, likes: 0, comments: 0, posts: 0 }
    )
    return map
  },
  {} as Record<Platform, { views: number; likes: number; comments: number; posts: number }>
)

const PLATFORM_TABS = [
  { key: 'instagram', label: 'Instagram', icon: <Instagram className="h-4 w-4" /> },
  { key: 'tiktok', label: 'TikTok', icon: <Music2 className="h-4 w-4" /> },
]

export default function AnalyticsPage() {
  const now = new Date()
  const [platform, setPlatform] = useState<Platform>('instagram')
  const [timeRange, setTimeRange] = useState<TimeRange>({ mode: 'month', month: now.getMonth(), year: now.getFullYear() })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const totals = totalsByPlatform[platform]
  const engagementRate = totals.views > 0
    ? (((totals.likes + totals.comments) / totals.views) * 100).toFixed(1)
    : '0.0'

  return (
    <div className="px-4 pt-6 pb-8 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Business Dashboard</p>
          <h1 className="text-xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-white/40 mt-0.5">Content performance</p>
        </div>
        <TimeRangeTrigger range={timeRange} onClick={() => setIsModalOpen(true)} />
      </div>

      {/* Platform Toggle — AnimatedTabs */}
      <AnimatedTabs
        tabs={PLATFORM_TABS}
        activeKey={platform}
        onTabChange={(k) => setPlatform(k as Platform)}
        layoutId="analytics-platform-tab"
        className="mb-5"
      />

      {/* Stat Cards */}
      <StaggeredList className="grid grid-cols-2 gap-3 mb-5">
        {[
          { icon: Eye, label: 'Total Views', value: totals.views },
          { icon: Heart, label: 'Total Likes', value: totals.likes },
          { icon: MessageCircle, label: 'Comments', value: totals.comments },
          { icon: platform === 'instagram' ? Instagram : Music2, label: 'Posts', value: totals.posts },
        ].map(({ icon: Icon, label, value }) => (
          <StaggerItem key={label}>
            <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
                style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #4A90E2 100%)' }}
              >
                <Icon className="h-4 w-4 text-white" />
              </div>
              <p className="text-xl font-bold text-white">
                <AnimatedCounter value={value} />
              </p>
              <p className="text-xs text-white/40 mt-0.5">{label}</p>
            </div>
          </StaggerItem>
        ))}
        <StaggerItem>
          <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
              style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #4A90E2 100%)' }}
            >
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <p className="text-xl font-bold text-white">{engagementRate}%</p>
            <p className="text-xs text-white/40 mt-0.5">Engagement Rate</p>
          </div>
        </StaggerItem>
      </StaggeredList>

      {/* Anti-Bot Policy Banner */}
      <div className="bg-amber-500/[0.08] border border-amber-500/20 rounded-2xl p-4 mb-5 flex gap-3">
        <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-amber-400 mb-0.5">Anti-Bot Policy</p>
          <p className="text-xs text-white/60 leading-relaxed">
            Metrics are filtered for verified, authentic engagement only. Inflated or bot-generated views are excluded from your analytics.
          </p>
        </div>
      </div>

      {/* Top 5 Creators by Combined Performance */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">
        Top 5 Creators · {platform === 'instagram' ? 'Instagram' : 'TikTok'}
      </p>
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 px-4 py-3 border-b border-white/[0.06]">
          {['Creator', 'Views', 'Likes', 'Cmts', 'Posts'].map((h) => (
            <span key={h} className="text-xs text-white/30 font-semibold uppercase tracking-wider">{h}</span>
          ))}
        </div>
        <StaggeredList staggerDelay={0.04}>
          {topCreators.map((creator, idx) => {
            const d = creator[platform]
            return (
              <StaggerItem key={creator.rank}>
                <div
                  className={cn(
                    'grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 px-4 py-3 items-center hover:bg-white/[0.03] transition-colors',
                    idx < topCreators.length - 1 && 'border-b border-white/[0.06]'
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                      style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #4A90E2 100%)' }}
                    >
                      {creator.rank}
                    </div>
                    <p className="text-sm font-semibold text-white truncate">{creator.name}</p>
                  </div>
                  <p className="text-xs text-white/60">{formatNumber(d.views)}</p>
                  <p className="text-xs text-white/60">{formatNumber(d.likes)}</p>
                  <p className="text-xs text-white/60">{formatNumber(d.comments)}</p>
                  <p className="text-xs text-white/60">{d.posts}</p>
                </div>
              </StaggerItem>
            )
          })}
        </StaggeredList>
      </div>
      <TimeRangeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={setTimeRange}
        initialRange={timeRange}
      />
    </div>
  )
}
