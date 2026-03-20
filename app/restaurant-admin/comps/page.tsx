'use client'

import { useState, useMemo } from 'react'
import { DarkHeader } from '@/components/restaurant-ui/DarkHeader'
import { DEMO_ORDERS, DEMO_CREATORS } from '@/lib/demo-data'
import { relativeTime, cn } from '@/lib/utils'
import type { OrderStatus } from '@/lib/types'
import { CheckCircle2, Clock, XCircle, Search, Instagram, Music2 } from 'lucide-react'

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

function statusColor(status: OrderStatus) {
  if (status === 'confirmed' || status === 'approved') return 'text-emerald-400'
  if (status === 'rejected' || status === 'expired') return 'text-red-400'
  return 'text-amber-400'
}

export default function CompsPage() {
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
        return creator?.name.toLowerCase().includes(q) || o.redemption_code.includes(q) ||
          o.items.some((i) => i.menu_item_name.toLowerCase().includes(q))
      })
    }
    return list
  }, [search, statusFilter])

  // Summary
  const summary = {
    confirmed: DEMO_ORDERS.filter((o) => ['confirmed', 'approved', 'proof_submitted'].includes(o.status)).length,
    pending: DEMO_ORDERS.filter((o) => o.status === 'proof_submitted').length,
    rejected: DEMO_ORDERS.filter((o) => o.status === 'rejected').length,
  }

  return (
    <div className="px-4 pt-6 pb-6">
      <DarkHeader title="Comps" subtitle={`${filtered.length} records`} />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Confirmed', value: summary.confirmed, color: 'text-emerald-400' },
          { label: 'Pending', value: summary.pending, color: 'text-amber-400' },
          { label: 'Rejected', value: summary.rejected, color: 'text-red-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 text-center">
            <p className={cn('text-2xl font-bold', color)}>{value}</p>
            <p className="text-xs text-white/40 mt-0.5">{label}</p>
          </div>
        ))}
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

      {/* Status Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
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
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {filtered.map((order) => {
          const creator = DEMO_CREATORS.find((c) => c.id === order.creator_id)
          return (
            <div key={order.id} className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  {statusIcon(order.status)}
                  <div>
                    <p className="text-sm font-semibold text-white">{creator?.name ?? 'Unknown'}</p>
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
                <div className="text-right shrink-0">
                  <p className={cn('text-xs font-semibold capitalize', statusColor(order.status))}>
                    {order.status.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-white/30 mt-0.5">{relativeTime(order.created_at)}</p>
                </div>
              </div>
              <p className="text-xs text-white/50">
                {order.items.map((i) => `${i.menu_item_name}${i.qty > 1 ? ` ×${i.qty}` : ''}`).join(', ')}
              </p>
              <p className="text-xs text-white/30 mt-1 font-mono">#{order.redemption_code}</p>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/30">
            <p className="text-sm">No comps found</p>
          </div>
        )}
      </div>
    </div>
  )
}
