'use client'

import { useState, useMemo } from 'react'
import { DEMO_ORDERS, DEMO_CREATORS } from '@/lib/demo-data'
import { relativeTime, cn } from '@/lib/utils'
import type { OrderStatus, TimeRange } from '@/lib/types'
import { CheckCircle2, Clock, XCircle, Search, Instagram, Music2 } from 'lucide-react'
import { TimeRangeTrigger } from '@/components/restaurant-ui/TimeRangeTrigger'
import { TimeRangeModal } from '@/components/restaurant-ui/TimeRangeModal'
import { StaggeredList, StaggerItem } from '@/components/effects/StaggeredList'

const STATUS_FILTERS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Approved', value: 'approved' },
  { label: 'Pending', value: 'proof_submitted' },
  { label: 'Rejected', value: 'rejected' },
]

function statusIcon(status: OrderStatus) {
  if (status === 'confirmed' || status === 'approved') return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
  if (status === 'rejected' || status === 'expired') return <XCircle className="h-4 w-4 text-red-400" />
  return <Clock className="h-4 w-4 text-amber-400" />
}

function statusBadge(status: OrderStatus) {
  if (status === 'approved') return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">Completed</span>
  if (status === 'rejected') return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400">Rejected</span>
  if (status === 'proof_submitted') return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400">Pending</span>
  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 capitalize">{status.replace('_', ' ')}</span>
}

// Estimate comp value per order
function orderValue(itemCount: number) {
  return itemCount * 14
}

export default function CompsPage() {
  const now = new Date()
  const [timeRange, setTimeRange] = useState<TimeRange>({ mode: 'month', month: now.getMonth(), year: now.getFullYear() })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')

  const filtered = useMemo(() => {
    let list = [...DEMO_ORDERS].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    if (statusFilter !== 'all') list = list.filter((o) => o.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((o) => {
        const creator = DEMO_CREATORS.find((c) => c.id === o.creator_id)
        return (
          creator?.name.toLowerCase().includes(q) ||
          o.redemption_code.includes(q) ||
          o.items.some((i) => i.menu_item_name.toLowerCase().includes(q))
        )
      })
    }
    return list
  }, [search, statusFilter])

  const summary = {
    completed: DEMO_ORDERS.filter((o) => o.status === 'approved').length,
    pending: DEMO_ORDERS.filter((o) => o.status === 'proof_submitted').length,
    total: DEMO_ORDERS.length,
    value: DEMO_ORDERS.reduce((sum, o) => sum + orderValue(o.items.length), 0),
  }

  // Top 5 comped items (by item name frequency)
  const itemFreq: Record<string, number> = {}
  DEMO_ORDERS.forEach((o) =>
    o.items.forEach((i) => {
      itemFreq[i.menu_item_name] = (itemFreq[i.menu_item_name] || 0) + i.qty
    })
  )
  const topItems = Object.entries(itemFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <>
    <div className="flex flex-col lg:flex-row min-h-0 flex-1">
      {/* Main Panel */}
      <div className="flex-1 px-4 pt-6 pb-8 min-w-0">
        {/* Header */}
        <div className="mb-5">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Business Dashboard</p>
          <h1 className="text-xl font-bold text-white">Comps</h1>
        </div>

        {/* Time Range Trigger */}
        <div className="mb-5">
          <TimeRangeTrigger range={timeRange} onClick={() => setIsModalOpen(true)} />
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            placeholder="Search creator, item, or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20"
          />
        </div>

        {/* Status Pills + Result Count */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-5">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border',
                statusFilter === f.value
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'border-white/[0.08] text-white/40 hover:text-white/60'
              )}
            >
              {f.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-white/30 whitespace-nowrap tabular-nums shrink-0">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Table */}
        <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 px-5 py-3 border-b border-white/[0.06]">
            <span className="text-xs text-white/30 font-semibold uppercase tracking-wider">Creator</span>
            <span className="text-xs text-white/30 font-semibold uppercase tracking-wider">Items</span>
            <span className="text-xs text-white/30 font-semibold uppercase tracking-wider">Date</span>
            <span className="text-xs text-white/30 font-semibold uppercase tracking-wider">Status</span>
          </div>

          <StaggeredList staggerDelay={0.03}>
          {filtered.map((order, idx) => {
            const creator = DEMO_CREATORS.find((c) => c.id === order.creator_id)
            return (
              <StaggerItem key={order.id}>
              <div
                className={cn(
                  'px-5 py-4 hover:bg-white/[0.03] transition-colors',
                  idx < filtered.length - 1 && 'border-b border-white/[0.06]'
                )}
              >
                {/* Mobile layout */}
                <div className="md:hidden">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${creator?.name ?? 'user'}`}
                        alt=""
                        className="w-8 h-8 rounded-full bg-white/10"
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">{creator?.name ?? 'Unknown'}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {creator?.ig_handle && (
                            <span className="text-xs text-white/40 flex items-center gap-1">
                              <Instagram className="h-3 w-3" />{creator.ig_handle}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {statusBadge(order.status)}
                  </div>
                  <p className="text-xs text-white/50 mb-1">
                    {order.items.map((i) => `${i.menu_item_name}${i.qty > 1 ? ` ×${i.qty}` : ''}`).join(', ')}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/30 font-mono">#{order.redemption_code}</p>
                    <p className="text-xs text-white/30">{relativeTime(order.created_at)}</p>
                  </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 items-center">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${creator?.name ?? 'user'}`}
                      alt=""
                      className="w-8 h-8 rounded-full bg-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{creator?.name ?? 'Unknown'}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {creator?.ig_handle && (
                          <span className="text-xs text-white/40 flex items-center gap-1">
                            <Instagram className="h-3 w-3" />{creator.ig_handle}
                          </span>
                        )}
                        {creator?.tiktok_handle && (
                          <span className="text-xs text-white/40 flex items-center gap-1">
                            <Music2 className="h-3 w-3" />{creator.tiktok_handle}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-white/70 truncate">
                    {order.items.map((i) => `${i.menu_item_name}${i.qty > 1 ? ` ×${i.qty}` : ''}`).join(', ')}
                  </p>
                  <p className="text-sm text-white/50">{relativeTime(order.created_at)}</p>
                  <div>{statusBadge(order.status)}</div>
                </div>
              </div>
              </StaggerItem>
            )
          })}
          </StaggeredList>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-white/30">
              <p className="text-sm">No comps found</p>
            </div>
          )}
        </div>

        {/* Mobile Summary */}
        <div className="lg:hidden mt-5 bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4">
          <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Summary</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Completed', value: summary.completed, color: 'text-emerald-400' },
              { label: 'Pending', value: summary.pending, color: 'text-amber-400' },
              { label: 'Total', value: summary.total, color: 'text-white' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center">
                <p className={cn('text-2xl font-bold', color)}>{value}</p>
                <p className="text-xs text-white/40 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Right Sidebar */}
      <div className="hidden lg:flex flex-col w-72 shrink-0 border-l border-white/[0.06] px-4 pt-8 pb-8 gap-6">
        {/* Top 5 Comped Items */}
        <div>
          <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Top 5 Comped Items</p>
          <div className="flex flex-col gap-2">
            {topItems.map(([name, count], idx) => (
              <div key={name} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #4A90E2 100%)' }}
                >
                  {idx + 1}
                </div>
                <p className="flex-1 text-sm text-white/70 truncate">{name}</p>
                <span className="text-xs font-semibold text-white/50">{count}×</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4">
          <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Summary</p>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Completed', value: summary.completed, color: 'text-emerald-400' },
              { label: 'Pending', value: summary.pending, color: 'text-amber-400' },
              { label: 'Total Comps', value: summary.total, color: 'text-white' },
              { label: 'Est. Value', value: `$${summary.value}`, color: 'text-white' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between">
                <p className="text-sm text-white/50">{label}</p>
                <p className={cn('text-sm font-bold', color)}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    <TimeRangeModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onApply={setTimeRange}
      initialRange={timeRange}
    />
    </>
  )
}
