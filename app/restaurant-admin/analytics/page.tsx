'use client'

import { useState } from 'react'
import { DarkHeader } from '@/components/restaurant-ui/DarkHeader'
import { Instagram, Music2, Eye, Heart, MessageCircle, Info } from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'

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

// All derived data computed once at module scope — topCreators is a static constant
const { igViewTotal, ttViewTotal } = topCreators.reduce(
  (acc, c) => ({ igViewTotal: acc.igViewTotal + c.instagram.views, ttViewTotal: acc.ttViewTotal + c.tiktok.views }),
  { igViewTotal: 0, ttViewTotal: 0 }
)
const igPct = Math.round((igViewTotal / (igViewTotal + ttViewTotal)) * 100)

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

export default function AnalyticsPage() {
  const [platform, setPlatform] = useState<Platform>('instagram')

  const totals = totalsByPlatform[platform]

  return (
    <div className="px-4 pt-6 pb-20">
      <DarkHeader title="Analytics" subtitle="Content performance" />

      {/* Platform Toggle */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setPlatform('instagram')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all border',
            platform === 'instagram'
              ? 'bg-white/10 border-white/20 text-white'
              : 'border-white/[0.08] text-white/40 hover:text-white/60'
          )}
        >
          <Instagram className="h-4 w-4" />
          Instagram
        </button>
        <button
          onClick={() => setPlatform('tiktok')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all border',
            platform === 'tiktok'
              ? 'bg-white/10 border-white/20 text-white'
              : 'border-white/[0.08] text-white/40 hover:text-white/60'
          )}
        >
          <Music2 className="h-4 w-4" />
          TikTok
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { icon: Eye, label: 'Total Views', value: formatNumber(totals.views) },
          { icon: Heart, label: 'Total Likes', value: formatNumber(totals.likes) },
          { icon: MessageCircle, label: 'Comments', value: formatNumber(totals.comments) },
          { icon: platform === 'instagram' ? Instagram : Music2, label: 'Posts', value: totals.posts.toString() },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 via-rose-500 to-blue-600 flex items-center justify-center mb-2">
              <Icon className="h-4 w-4 text-white" />
            </div>
            <p className="text-xl font-bold text-white">{value}</p>
            <p className="text-xs text-white/40 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Platform Split */}
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 mb-5">
        <p className="text-sm font-semibold text-white mb-3">Platform Split (Views)</p>
        <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600 rounded-full"
            style={{ width: `${igPct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/40">
          <span className="flex items-center gap-1"><Instagram className="h-3 w-3" />{igPct}% Instagram</span>
          <span className="flex items-center gap-1"><Music2 className="h-3 w-3" />{100 - igPct}% TikTok</span>
        </div>
      </div>

      {/* Anti-bot note */}
      <div className="bg-blue-500/[0.08] border border-blue-500/20 rounded-2xl p-4 mb-5 flex gap-3">
        <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs text-white/60 leading-relaxed">
          <strong className="text-white/80">Anti-Bot Policy:</strong> Metrics are filtered for verified, authentic engagement.
        </p>
      </div>

      {/* Top Creators */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">
        Top Creators · {platform === 'instagram' ? 'Instagram' : 'TikTok'}
      </p>
      <div className="flex flex-col gap-2">
        {topCreators.map((creator) => {
          const d = creator[platform]
          return (
            <div key={creator.rank} className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 via-rose-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {creator.rank}
                </div>
                <p className="text-sm font-semibold text-white">{creator.name}</p>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { label: 'Views', value: formatNumber(d.views) },
                  { label: 'Likes', value: formatNumber(d.likes) },
                  { label: 'Comments', value: formatNumber(d.comments) },
                  { label: 'Posts', value: formatNumber(d.posts) },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <p className="text-xs font-semibold text-white">{value}</p>
                    <p className="text-[10px] text-white/30">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
