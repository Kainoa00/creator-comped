'use client'

import { useState } from 'react'
import { TrendingUp, DollarSign, Users, Instagram, Music2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type FilterType = 'Month' | 'Year' | 'All time'

const FILTERS: FilterType[] = ['Month', 'Year', 'All time']

const spendData = [
  { month: 'Sep', amount: 3200 },
  { month: 'Oct', amount: 3800 },
  { month: 'Nov', amount: 4200 },
  { month: 'Dec', amount: 3600 },
  { month: 'Jan', amount: 4500 },
  { month: 'Feb', amount: 4892 },
]

const topCreators = [
  { rank: 1, name: '@foodie_sarah', spend: 842, comps: 18 },
  { rank: 2, name: '@tastemaker_mike', spend: 756, comps: 16 },
  { rank: 3, name: '@eats_with_emma', spend: 698, comps: 15 },
  { rank: 4, name: '@chef_chronicles', spend: 624, comps: 14 },
  { rank: 5, name: '@downtown_diner', spend: 582, comps: 13 },
]

const maxAmount = Math.max(...spendData.map((d) => d.amount))

export default function SpendPage() {
  const [filter, setFilter] = useState<FilterType>('Month')

  return (
    <div className="px-4 pt-6 pb-8 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="mb-5">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Business Dashboard</p>
        <h1 className="text-xl font-bold text-white">Spend</h1>
        <p className="text-sm text-white/40 mt-0.5">Budget & spending overview</p>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border',
              filter === f
                ? 'bg-white/10 border-white/20 text-white'
                : 'border-white/[0.08] text-white/40 hover:text-white/60'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { icon: DollarSign, label: 'Total Spent', value: '$4,892', sub: '+12% vs last mo', up: true },
          { icon: Users, label: 'Active Creators', value: '12', sub: '+2 this month', up: true },
          { icon: DollarSign, label: 'Avg Comp', value: '$28', sub: 'per redemption', up: false },
        ].map(({ icon: Icon, label, value, sub, up }) => (
          <div key={label} className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
              style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #4A90E2 100%)' }}
            >
              <Icon className="h-4 w-4 text-white" />
            </div>
            <p className="text-lg font-bold text-white leading-none">{value}</p>
            <p className="text-[10px] text-white/40 mt-0.5 leading-tight">{label}</p>
            <p className={cn('text-[10px] mt-1 leading-tight flex items-center gap-0.5', up ? 'text-emerald-400' : 'text-white/30')}>
              {up && <TrendingUp className="h-2.5 w-2.5" />}{sub}
            </p>
          </div>
        ))}
      </div>

      {/* Spend Chart */}
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 mb-5">
        <p className="text-sm font-semibold text-white mb-4">Spend Over Time</p>
        <div className="h-40 flex items-end gap-2">
          {spendData.map((d) => {
            const heightPct = (d.amount / maxAmount) * 100
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                <p className="text-[9px] text-white/40">${(d.amount / 1000).toFixed(1)}k</p>
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: `${heightPct}%`,
                    minHeight: '4px',
                    background: 'linear-gradient(180deg, #4A90E2 0%, #FF6B35 100%)',
                  }}
                />
                <p className="text-[9px] text-white/40">{d.month}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top Creators by Spend */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Top Creators by Spend</p>
      <div className="flex flex-col gap-2">
        {topCreators.map((creator) => (
          <div
            key={creator.rank}
            className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 flex items-center gap-3"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #4A90E2 100%)' }}
            >
              {creator.rank}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{creator.name}</p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs text-white/40 flex items-center gap-1">
                  <Instagram className="h-3 w-3" /><Music2 className="h-3 w-3" />
                </span>
                <span className="text-xs text-white/40">{creator.comps} comps</span>
              </div>
            </div>
            <p className="text-sm font-bold text-white shrink-0">${creator.spend.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
