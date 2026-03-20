'use client'

import { useState, useMemo } from 'react'
import { DarkHeader } from '@/components/restaurant-ui/DarkHeader'
import { DEMO_ORDERS, DEMO_CREATORS } from '@/lib/demo-data'
import { relativeTime, cn } from '@/lib/utils'
import type { OrderStatus } from '@/lib/types'
import { Search, Download, ClipboardList } from 'lucide-react'

const STATUS_FILTERS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Proof Sub.', value: 'proof_submitted' },
]

function statusColor(status: OrderStatus) {
  if (status === 'confirmed' || status === 'approved') return 'text-emerald-400'
  if (status === 'rejected' || status === 'expired') return 'text-red-400'
  if (status === 'proof_submitted') return 'text-blue-400'
  return 'text-white/40'
}

function exportCSV(orders: typeof DEMO_ORDERS) {
  const rows = [
    ['Code', 'Creator', 'Items', 'Status', 'Date'],
    ...orders.map((o) => {
      const creator = DEMO_CREATORS.find((c) => c.id === o.creator_id)
      return [
        o.redemption_code,
        creator?.name ?? o.creator_id,
        o.items.map((i) => `${i.menu_item_name} x${i.qty}`).join('; '),
        o.status,
        new Date(o.created_at).toLocaleDateString(),
      ]
    }),
  ]
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `history-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function HistoryPage() {
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
        return creator?.name.toLowerCase().includes(q) || o.redemption_code.includes(q)
      })
    }
    return list
  }, [search, statusFilter])

  return (
    <div className="px-4 pt-6 pb-6">
      <DarkHeader
        title="History"
        subtitle={`${filtered.length} records`}
        backHref="/restaurant/manager"
        right={
          <button
            onClick={() => exportCSV(filtered)}
            className="h-9 w-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-colors"
          >
            <Download className="h-4 w-4" />
          </button>
        }
      />

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <input
          placeholder="Search creator or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20"
        />
      </div>

      {/* Status Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-none">
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
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <ClipboardList className="h-8 w-8 text-white/20" />
          <p className="text-sm text-white/40">No redemptions found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((order) => {
            const creator = DEMO_CREATORS.find((c) => c.id === order.creator_id)
            return (
              <div key={order.id} className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-white">{creator?.name ?? 'Unknown'}</p>
                    <p className="text-xs text-white/40 mt-0.5">{creator?.ig_handle ?? ''}</p>
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
        </div>
      )}
    </div>
  )
}
