'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, ChevronRight } from 'lucide-react'
import { useCreatorData } from '@/lib/hooks/useCreatorData'
import { formatDate, relativeTime } from '@/lib/utils'

const statusColor = (status: string) => {
  if (status === 'approved') return 'bg-green-500/20 text-green-400'
  if (status === 'proof_submitted') return 'bg-yellow-500/20 text-yellow-400'
  if (status === 'confirmed') return 'bg-blue-500/20 text-blue-400'
  if (status === 'rejected') return 'bg-red-500/20 text-red-400'
  return 'bg-white/10 text-gray-400'
}

const statusLabel = (status: string) => {
  if (status === 'approved') return 'Approved'
  if (status === 'proof_submitted') return 'In Review'
  if (status === 'confirmed') return 'Confirmed'
  if (status === 'rejected') return 'Rejected'
  return status
}

// Estimated value per comp (demo)
const COMP_VALUE = 18

export default function HistoryPage() {
  const router = useRouter()
  const { orders, loading } = useCreatorData()

  const completedOrders = orders.filter((o) => ['confirmed', 'proof_submitted', 'approved'].includes(o.status))

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    )
  }
  const totalSaved = completedOrders.length * COMP_VALUE

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white max-w-[430px] mx-auto">
      {/* Header */}
      <header className="px-4 pt-14 pb-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#1a1a1a] transition-colors">
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white">History</h1>
      </header>

      <div className="px-4 pb-28 space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{completedOrders.length}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-1">Comps Completed</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-white">${totalSaved}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-1">Total Saved</p>
          </div>
        </div>

        {/* Order list */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Clock className="h-10 w-10 text-gray-700" />
            <p className="text-white font-semibold">No history yet</p>
            <p className="text-sm text-gray-500">Your completed comps will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <button
                key={order.id}
                onClick={() => router.push(`/profile/order/${order.id}`)}
                className="w-full text-left bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-4 hover:bg-[#222] transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{order.restaurant_name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{relativeTime(order.created_at)}</p>
                    <p className="text-xs text-gray-600 mt-1.5 truncate">
                      {order.items.map((i) => `${i.menu_item_name}${i.qty > 1 ? ` ×${i.qty}` : ''}`).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor(order.status)}`}>
                      {statusLabel(order.status)}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
                {order.status === 'rejected' && order.rejection_reason && (
                  <p className="text-xs text-red-400/80 mt-2 leading-relaxed">{order.rejection_reason}</p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
