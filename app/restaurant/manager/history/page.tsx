'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Badge, OrderStatusBadge, ProofStatusBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import {
  DEMO_ORDERS,
  DEMO_CREATORS,
  DEMO_PROOF_SUBMISSIONS,
} from '@/lib/demo-data'
import { formatDate, formatTime, relativeTime, cn } from '@/lib/utils'
import type { Order, OrderStatus } from '@/lib/types'
import {
  ArrowLeft,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ClipboardList,
} from 'lucide-react'

const PAGE_SIZE = 20

const STATUS_FILTERS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Proof Submitted', value: 'proof_submitted' },
  { label: 'Approved', value: 'approved' },
]

function getCreator(creatorId: string) {
  return DEMO_CREATORS.find((c) => c.id === creatorId) ?? null
}

function getProof(orderId: string) {
  return DEMO_PROOF_SUBMISSIONS.find((p) => p.order_id === orderId) ?? null
}

function exportCSV(orders: Order[]) {
  const rows = [
    ['Date', 'Time', 'Creator', 'Items', 'Status', 'Deliverable', 'Proof Status', 'Proof URL'],
    ...orders.map((o) => {
      const creator = getCreator(o.creator_id)
      const proof = getProof(o.id)
      return [
        formatDate(o.created_at),
        formatTime(o.created_at),
        creator?.name ?? o.creator_id,
        o.items.map((i) => `${i.menu_item_name} x${i.qty}`).join('; '),
        o.status,
        o.deliverable_requirement?.allowed_types ?? '',
        proof?.review_status ?? '',
        proof?.url ?? '',
      ]
    }),
  ]

  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `redemption-history-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function HistoryPage() {
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let list = [...DEMO_ORDERS].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    if (statusFilter !== 'all') {
      list = list.filter((o) => o.status === statusFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((o) => {
        const creator = getCreator(o.creator_id)
        return (
          creator?.name.toLowerCase().includes(q) ||
          creator?.ig_handle?.toLowerCase().includes(q) ||
          o.redemption_code.includes(q)
        )
      })
    }

    if (startDate) {
      list = list.filter((o) => new Date(o.created_at) >= new Date(startDate))
    }
    if (endDate) {
      list = list.filter((o) => new Date(o.created_at) <= new Date(endDate + 'T23:59:59'))
    }

    return list
  }, [search, statusFilter, startDate, endDate])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleStatusFilter(val: OrderStatus | 'all') {
    setStatusFilter(val)
    setPage(1)
  }

  const inputClass = cn(
    'h-10 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm px-3',
    'focus:outline-none focus:ring-2 focus:ring-cc-accent/10 focus:border-cc-accent',
    'transition-colors duration-150'
  )

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
              <h1 className="text-2xl font-bold text-slate-900">Redemption History</h1>
              <p className="text-sm text-slate-500">
                {filtered.length} record{filtered.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <button
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 mb-5">
          <div className="flex flex-wrap gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                placeholder="Search creator name..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className={cn(inputClass, 'w-full pl-9')}
              />
            </div>

            {/* Date range */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(1) }}
                className={inputClass}
              />
              <span className="text-slate-400 text-sm">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(1) }}
                className={inputClass}
              />
            </div>
          </div>

          {/* Status filter pills */}
          <div className="flex flex-wrap gap-2 mt-3">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => handleStatusFilter(f.value)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer',
                  statusFilter === f.value
                    ? 'bg-blue-50 border-cc-accent text-cc-accent'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table / Empty */}
        {pageItems.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <div className="h-14 w-14 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center">
              <ClipboardList className="h-6 w-6 text-slate-400" />
            </div>
            <p className="font-semibold text-slate-900">No redemptions found</p>
            <p className="text-sm text-slate-400">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3">
                      Date / Time
                    </th>
                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3">
                      Creator
                    </th>
                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3">
                      Items
                    </th>
                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3">
                      Deliverable
                    </th>
                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3">
                      Proof
                    </th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((order, i) => {
                    const creator = getCreator(order.creator_id)
                    const proof = getProof(order.id)

                    return (
                      <tr
                        key={order.id}
                        className={cn(
                          'hover:bg-slate-50/50 transition-colors',
                          i < pageItems.length - 1 && 'border-b border-slate-50'
                        )}
                      >
                        <td className="px-5 py-4">
                          <div className="text-sm font-medium text-slate-900">
                            {formatDate(order.created_at)}
                          </div>
                          <div className="text-xs text-slate-400">
                            {formatTime(order.created_at)}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={creator?.photo_url ?? null}
                              name={creator?.name ?? 'Unknown'}
                              size="sm"
                            />
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {creator?.name ?? 'Unknown'}
                              </p>
                              {creator?.ig_handle && (
                                <p className="text-xs text-slate-400">{creator.ig_handle}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-600 max-w-[180px] truncate">
                            {order.items.map((i) => i.menu_item_name).join(', ')}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          {order.deliverable_requirement ? (
                            <Badge variant="info" size="sm">
                              {order.deliverable_requirement.allowed_types}
                            </Badge>
                          ) : (
                            <span className="text-xs text-slate-300">—</span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <OrderStatusBadge status={order.status} />
                        </td>

                        <td className="px-5 py-4">
                          {proof ? (
                            <ProofStatusBadge status={proof.review_status} />
                          ) : (
                            <span className="text-xs text-slate-300">—</span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-right">
                          {proof?.url && (
                            <a
                              href={proof.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-cc-accent hover:underline"
                            >
                              View
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col gap-3">
              {pageItems.map((order) => {
                const creator = getCreator(order.creator_id)
                const proof = getProof(order.id)
                return (
                  <div key={order.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={creator?.photo_url ?? null}
                          name={creator?.name ?? 'Unknown'}
                          size="sm"
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{creator?.name ?? 'Unknown'}</p>
                          <p className="text-xs text-slate-400">{relativeTime(order.created_at)}</p>
                        </div>
                      </div>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-slate-600 mb-2">
                      {order.items.map((i) => i.menu_item_name).join(', ')}
                    </p>
                    {proof && (
                      <div className="flex items-center justify-between">
                        <ProofStatusBadge status={proof.review_status} />
                        {proof.url && (
                          <a
                            href={proof.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-cc-accent hover:underline flex items-center gap-1"
                          >
                            View Proof <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-5">
                <p className="text-sm text-slate-400">
                  Page {page} of {totalPages} · {filtered.length} results
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page === 1}
                    leftIcon={<ChevronLeft className="h-4 w-4" />}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page === totalPages}
                    rightIcon={<ChevronRight className="h-4 w-4" />}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
