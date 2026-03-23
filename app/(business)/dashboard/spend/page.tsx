'use client'

import { useState } from 'react'
import { TimeRangeTrigger, timeRangeLabel } from '@/components/restaurant-ui/TimeRangeTrigger'
import { TimeRangeModal } from '@/components/restaurant-ui/TimeRangeModal'
import type { TimeRange } from '@/lib/types'
import { AnimatedCounter } from '@/components/effects/AnimatedCounter'
import { StaggeredList, StaggerItem } from '@/components/effects/StaggeredList'
import { CardSpotlight } from '@/components/effects/CardSpotlight'

// ── Demo data ────────────────────────────────────────────────────────────────

const DAILY_SPEND = [
  { label: 'Mar 1',  value: 60 },
  { label: 'Mar 5',  value: 180 },
  { label: 'Mar 10', value: 420 },
  { label: 'Mar 15', value: 790 },
  { label: 'Mar 20', value: 1340 },
  { label: 'Mar 25', value: 1920 },
  { label: 'Mar 28', value: 2240 },
  { label: 'Today',  value: 2450 },
]

const CATEGORIES = [
  { name: 'Entrees',    value: 1200, color: '#ffffff' },
  { name: 'Appetizers', value: 720,  color: '#aaaaaa' },
  { name: 'Drinks',     value: 380,  color: '#666666' },
  { name: 'Desserts',   value: 150,  color: '#333333' },
]

const TOTAL_SPEND   = 2450
const COMPS_DONE    = 12
const AVG_PER_COMP  = Math.round(TOTAL_SPEND / COMPS_DONE)
const MONTHLY_BUDGET = 3000
const BUDGET_PCT    = Math.round((TOTAL_SPEND / MONTHLY_BUDGET) * 100)
const CAT_TOTAL     = CATEGORIES.reduce((s, c) => s + c.value, 0)

// ── SVG Line Chart ────────────────────────────────────────────────────────────

function LineChart() {
  const W = 540
  const H = 220
  const PAD = { top: 16, right: 16, bottom: 36, left: 52 }
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom

  const maxVal = 2600
  const yTicks = [0, 650, 1300, 1950, 2600]

  const xScale = (i: number) => PAD.left + (i / (DAILY_SPEND.length - 1)) * innerW
  const yScale = (v: number) => PAD.top + innerH - (v / maxVal) * innerH

  const pathD = DAILY_SPEND.map((d, i) =>
    `${i === 0 ? 'M' : 'L'} ${xScale(i).toFixed(1)} ${yScale(d.value).toFixed(1)}`
  ).join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" style={{ overflow: 'visible' }}>
      {/* Grid lines */}
      {yTicks.map((t) => (
        <line
          key={t}
          x1={PAD.left} x2={W - PAD.right}
          y1={yScale(t)} y2={yScale(t)}
          stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 3"
        />
      ))}

      {/* Y-axis labels */}
      {yTicks.map((t) => (
        <text
          key={t}
          x={PAD.left - 8} y={yScale(t) + 4}
          textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.35)"
        >
          ${t === 0 ? '0' : `${t / 1000 >= 1 ? t.toLocaleString() : t}`}
        </text>
      ))}

      {/* X-axis labels */}
      {DAILY_SPEND.map((d, i) => (
        <text
          key={i}
          x={xScale(i)} y={H - 6}
          textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.35)"
        >
          {d.label}
        </text>
      ))}

      {/* Line */}
      <path d={pathD} fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

      {/* Dots */}
      {DAILY_SPEND.map((d, i) => (
        <circle key={i} cx={xScale(i)} cy={yScale(d.value)} r="4" fill="white" />
      ))}
    </svg>
  )
}

// ── SVG Donut Chart ───────────────────────────────────────────────────────────

function DonutChart({ hoveredCategory, onHover }: { hoveredCategory: string | null; onHover: (name: string | null) => void }) {
  const R = 70
  const r = 44
  const cx = 90
  const cy = 90

  let cumAngle = -Math.PI / 2
  const slices = CATEGORIES.map((cat) => {
    const angle = (cat.value / CAT_TOTAL) * 2 * Math.PI
    const startAngle = cumAngle
    cumAngle += angle
    const endAngle = cumAngle

    const x1 = cx + R * Math.cos(startAngle)
    const y1 = cy + R * Math.sin(startAngle)
    const x2 = cx + R * Math.cos(endAngle)
    const y2 = cy + R * Math.sin(endAngle)
    const ix1 = cx + r * Math.cos(endAngle)
    const iy1 = cy + r * Math.sin(endAngle)
    const ix2 = cx + r * Math.cos(startAngle)
    const iy2 = cy + r * Math.sin(startAngle)
    const large = angle > Math.PI ? 1 : 0

    const d = [
      `M ${x1.toFixed(2)} ${y1.toFixed(2)}`,
      `A ${R} ${R} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
      `L ${ix1.toFixed(2)} ${iy1.toFixed(2)}`,
      `A ${r} ${r} 0 ${large} 0 ${ix2.toFixed(2)} ${iy2.toFixed(2)}`,
      'Z',
    ].join(' ')

    return { ...cat, d }
  })

  return (
    <svg viewBox="0 0 180 180" className="w-[140px] h-[140px] shrink-0">
      {slices.map((s) => {
        const isHovered = hoveredCategory === s.name
        const isDimmed = hoveredCategory !== null && !isHovered
        return (
          <path
            key={s.name}
            d={s.d}
            fill={s.color}
            stroke="#1a1a1a"
            strokeWidth="2"
            opacity={isDimmed ? 0.3 : 1}
            style={{ transition: 'opacity 0.2s ease, transform 0.2s ease', cursor: 'pointer' }}
            onMouseEnter={() => onHover(s.name)}
            onMouseLeave={() => onHover(null)}
          />
        )
      })}
    </svg>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SpendPage() {
  const now = new Date()
  const [timeRange, setTimeRange] = useState<TimeRange>({
    mode: 'month',
    month: now.getMonth(),
    year: now.getFullYear(),
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  return (
    <div className="px-4 pt-6 pb-10 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Business Dashboard</p>
          <h1 className="text-xl font-bold text-white">Spend</h1>
        </div>
        <TimeRangeTrigger range={timeRange} onClick={() => setIsModalOpen(true)} />
      </div>

      {/* KPI Row */}
      <StaggeredList className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {/* Total Spend */}
        <StaggerItem>
          <CardSpotlight className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 h-full">
            <p className="text-xs text-white/50 mb-2">Total Spend</p>
            <p className="text-2xl font-bold text-white">
              $<AnimatedCounter value={TOTAL_SPEND} />
            </p>
          </CardSpotlight>
        </StaggerItem>

        {/* Comps Completed */}
        <StaggerItem>
          <CardSpotlight className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 h-full">
            <p className="text-xs text-white/50 mb-2">Comps Completed</p>
            <p className="text-2xl font-bold text-white">
              <AnimatedCounter value={COMPS_DONE} />
            </p>
          </CardSpotlight>
        </StaggerItem>

        {/* Avg Spend/Comp */}
        <StaggerItem>
          <CardSpotlight className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 h-full">
            <p className="text-xs text-white/50 mb-2">Avg Spend/Comp</p>
            <p className="text-2xl font-bold text-white">
              $<AnimatedCounter value={AVG_PER_COMP} />
            </p>
          </CardSpotlight>
        </StaggerItem>

        {/* Budget Used */}
        <StaggerItem>
          <CardSpotlight className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 h-full">
            <p className="text-xs text-white/50 mb-2">Budget Used</p>
            <p className="text-lg font-bold text-white mb-2">
              $<AnimatedCounter value={TOTAL_SPEND} /> / ${MONTHLY_BUDGET.toLocaleString()}
            </p>
            <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(BUDGET_PCT, 100)}%`,
                  background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)',
                }}
              />
            </div>
            <p className="text-[10px] text-white/40 mt-1"><AnimatedCounter value={BUDGET_PCT} suffix="%" /> used</p>
          </CardSpotlight>
        </StaggerItem>
      </StaggeredList>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Spend Over Time */}
        <CardSpotlight className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-sm font-semibold text-white mb-4">Spend Over Time</p>
          <div className="h-[220px]">
            <LineChart />
          </div>
        </CardSpotlight>

        {/* Spend by Category */}
        <CardSpotlight className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-sm font-semibold text-white mb-4">Spend by Category</p>
          <div className="flex items-center gap-5">
            <DonutChart hoveredCategory={hoveredCategory} onHover={setHoveredCategory} />
            <div className="flex flex-col gap-3 flex-1 min-w-0">
              {CATEGORIES.map((cat) => {
                const pct = Math.round((cat.value / CAT_TOTAL) * 100)
                const isHovered = hoveredCategory === cat.name
                const isDimmed = hoveredCategory !== null && !isHovered
                return (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between gap-2 rounded-lg px-2 py-1 -mx-2 transition-all cursor-pointer"
                    style={{ opacity: isDimmed ? 0.35 : 1, background: isHovered ? 'rgba(255,255,255,0.05)' : 'transparent' }}
                    onMouseEnter={() => setHoveredCategory(cat.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: cat.color }} />
                      <p className="text-sm text-white/70 truncate">{cat.name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-white">${cat.value.toLocaleString()}</p>
                      <p className="text-[10px] text-white/40">{pct}%</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardSpotlight>
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
