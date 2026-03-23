'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  MapPin,
  Calendar,
  Hash,
  Instagram,
  Video,
} from 'lucide-react'
import { getOrdersForCreator, getProofForOrder } from '@/lib/demo-data'
import { formatDate, relativeTime } from '@/lib/utils'

function statusConfig(status: string) {
  switch (status) {
    case 'approved':
      return { label: 'Approved', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' }
    case 'proof_submitted':
      return { label: 'In Review', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' }
    case 'confirmed':
      return { label: 'Confirmed', icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' }
    case 'rejected':
      return { label: 'Rejected', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' }
    default:
      return { label: status, icon: AlertCircle, color: 'text-gray-400', bg: 'bg-white/5 border-white/10' }
  }
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  // Find order across all demo orders
  const allOrders = getOrdersForCreator('creator-001')
  const order = allOrders.find((o) => o.id === id)

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] text-white max-w-[430px] mx-auto flex flex-col items-center justify-center gap-3 px-4">
        <AlertCircle className="h-10 w-10 text-gray-600" />
        <p className="text-white font-semibold">Order not found</p>
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-white transition-colors"
        >
          Go back
        </button>
      </div>
    )
  }

  const proof = getProofForOrder(order.id)
  const { label, icon: StatusIcon, color, bg } = statusConfig(order.status)
  const estimatedValue = order.items.reduce((sum, i) => sum + i.qty * 12, 0)

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white max-w-[430px] mx-auto">
      {/* Header */}
      <header className="px-4 pt-14 pb-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#1a1a1a] transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white">Order Details</h1>
      </header>

      <div className="px-4 pb-28 space-y-4">
        {/* Status card */}
        <div className={`rounded-2xl border p-4 flex items-center gap-3 ${bg}`}>
          <StatusIcon className={`h-6 w-6 shrink-0 ${color}`} />
          <div>
            <p className={`text-sm font-bold ${color}`}>{label}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {order.status === 'confirmed' && 'Comp confirmed — post within the deadline'}
              {order.status === 'proof_submitted' && 'Your proof is being reviewed by our team'}
              {order.status === 'approved' && 'Great work! Your content has been approved'}
              {order.status === 'rejected' && (order.rejection_reason ?? 'Your proof was rejected')}
            </p>
          </div>
        </div>

        {/* Restaurant info */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-lg font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #4A90E2 100%)' }}
            >
              {order.restaurant_name[0]}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{order.restaurant_name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3 text-gray-500" />
                <p className="text-xs text-gray-500">View location</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden">
          <p className="px-4 pt-4 pb-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
            Items Comped
          </p>
          <div className="divide-y divide-[#2a2a2a]">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between px-4 py-3">
                <p className="text-sm text-white">{item.menu_item_name}</p>
                <div className="flex items-center gap-2">
                  {item.qty > 1 && (
                    <span className="text-xs text-gray-500">×{item.qty}</span>
                  )}
                  <span className="text-xs font-semibold text-green-400">FREE</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#2a2a2a]">
            <p className="text-xs text-gray-500">Estimated value</p>
            <p className="text-sm font-bold text-white">~${estimatedValue}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-3">Timeline</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm text-white">{formatDate(order.created_at)}</p>
              </div>
            </div>
            {order.confirmed_at && (
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Confirmed at restaurant</p>
                  <p className="text-sm text-white">{formatDate(order.confirmed_at)}</p>
                </div>
              </div>
            )}
            {proof && (
              <div className="flex items-center gap-3">
                <Video className="h-4 w-4 text-yellow-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Proof submitted</p>
                  <p className="text-sm text-white">{relativeTime(proof.submitted_at)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Redemption code */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Redemption Code</p>
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-gray-500" />
            <p className="text-2xl font-bold tracking-[0.3em] text-white">{order.redemption_code}</p>
          </div>
        </div>

        {/* Proof link */}
        {proof && (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Submitted Proof</p>
            <div className="flex items-center gap-2">
              <Instagram className="h-4 w-4 text-gray-500 shrink-0" />
              <a
                href={proof.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 underline underline-offset-2 truncate"
              >
                {proof.url}
              </a>
            </div>
          </div>
        )}

        {/* Deliverables */}
        {order.deliverable_requirement && (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-3">Required Deliverables</p>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Platform: <span className="text-white font-medium">{order.deliverable_requirement.allowed_types.replace('_', ' ')}</span></p>
              {order.deliverable_requirement.required_hashtags.length > 0 && (
                <p>Hashtags: <span className="text-white font-medium">{order.deliverable_requirement.required_hashtags.join(' ')}</span></p>
              )}
              {order.deliverable_requirement.required_tags.length > 0 && (
                <p>Tags: <span className="text-white font-medium">{order.deliverable_requirement.required_tags.join(' ')}</span></p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
