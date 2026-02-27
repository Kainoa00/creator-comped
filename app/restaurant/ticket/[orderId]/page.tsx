'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Modal, ModalFooter } from '@/components/ui/modal'
import { useToast } from '@/components/ui/toast'
import { Textarea } from '@/components/ui/input'
import {
  DEMO_ORDERS,
  DEMO_CREATORS,
  DEMO_RESTAURANTS,
} from '@/lib/demo-data'
import {
  isExpired,
  isInBlackout,
  formatTime,
  cn,
  sleep,
} from '@/lib/utils'
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Ban,
  Users,
  ArrowLeft,
  Instagram,
  Music2,
  Hash,
  AtSign,
  BadgeCheck,
} from 'lucide-react'

const REJECTION_REASONS = [
  'Expired code',
  'Already redeemed',
  'Blackout hours',
  'Daily cap reached',
  'Out of stock',
  'Other',
]

type CheckStatus = 'pass' | 'fail' | 'warn'

interface ValidationCheck {
  label: string
  status: CheckStatus
  detail: string
  icon: React.ReactNode
}

function DeliverableIcon({ type }: { type: string }) {
  if (type === 'IG_REEL') return <Instagram className="h-4 w-4" />
  if (type === 'TIKTOK') return <Music2 className="h-4 w-4" />
  return <span className="text-xs font-bold">CC</span>
}

function DeliverableLabel({ type }: { type: string }) {
  const labels: Record<string, string> = {
    IG_REEL: 'Instagram Reel',
    TIKTOK: 'TikTok Video',
    BOTH: 'IG Reel + TikTok',
    CHOICE: 'IG Reel or TikTok',
  }
  return <>{labels[type] ?? type}</>
}

export default function TicketPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const orderId = params.orderId as string
  const order = DEMO_ORDERS.find((o) => o.id === orderId)
  const creator = order ? DEMO_CREATORS.find((c) => c.id === order.creator_id) : null
  const restaurant = DEMO_RESTAURANTS[0]

  const [confirming, setConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState<string | null>(null)
  const [otherText, setOtherText] = useState('')
  const [rejecting, setRejecting] = useState(false)
  const [showSuccessFlash, setShowSuccessFlash] = useState(false)

  if (!order) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center px-6">
        <div className="h-20 w-20 rounded-lg border border-slate-200 flex items-center justify-center">
          <XCircle className="h-10 w-10 text-red-400" />
        </div>
        <p className="text-2xl font-black text-slate-900">Order Not Found</p>
        <p className="text-sm text-slate-500">
          The order ID &quot;{orderId}&quot; does not exist in the system.
        </p>
        <button
          onClick={() => router.push('/restaurant')}
          className="flex items-center gap-2 text-cc-accent hover:text-cc-accent-dark text-sm font-semibold transition-colors mt-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Scanner
        </button>
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center px-6">
        <p className="text-2xl font-black text-slate-900">Creator Not Found</p>
        <button
          onClick={() => router.push('/restaurant')}
          className="flex items-center gap-2 text-cc-accent hover:text-cc-accent-dark text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>
    )
  }

  // ── Validation Checks ──
  const codeValid = order.status !== 'expired' && order.status !== 'rejected'
  const notExpired = !isExpired(order.expires_at) || order.status === 'confirmed'
  const notInBlackout = !isInBlackout(
    restaurant.settings.blackout_start,
    restaurant.settings.blackout_end
  )
  const capOk = true
  const cooldownOk = true

  const timeRemaining = Math.max(
    0,
    Math.round((new Date(order.expires_at).getTime() - Date.now()) / 60000)
  )

  const blackoutStr =
    restaurant.settings.blackout_start && restaurant.settings.blackout_end
      ? `${restaurant.settings.blackout_start} – ${restaurant.settings.blackout_end}`
      : 'None configured'

  const checks: ValidationCheck[] = [
    {
      label: 'Code valid?',
      status: codeValid ? 'pass' : 'fail',
      detail: codeValid ? `Code: ${order.redemption_code}` : `Status: ${order.status}`,
      icon: <ShieldCheck className="h-4 w-4" />,
    },
    {
      label: 'Not expired?',
      status: notExpired ? 'pass' : 'fail',
      detail: notExpired
        ? order.status === 'confirmed'
          ? 'Already scanned — no expiry'
          : `${timeRemaining} min remaining`
        : 'Code expired',
      icon: <Clock className="h-4 w-4" />,
    },
    {
      label: 'Within redemption hours?',
      status: notInBlackout ? 'pass' : 'fail',
      detail: notInBlackout
        ? 'No active blackout'
        : `Blackout: ${blackoutStr}`,
      icon: <Ban className="h-4 w-4" />,
    },
    {
      label: 'Daily cap not reached?',
      status: capOk ? 'pass' : 'warn',
      detail: capOk
        ? `Cap: ${restaurant.settings.daily_comp_cap ?? 'Unlimited'}/day`
        : 'Daily cap reached',
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: 'Cooldown period clear?',
      status: cooldownOk ? 'pass' : 'warn',
      detail: cooldownOk
        ? `${restaurant.settings.cooldown_days}-day cooldown clear`
        : 'Cooldown active',
      icon: <Clock className="h-4 w-4" />,
    },
  ]

  const allGreen = checks.every((c) => c.status === 'pass')
  const hasFail = checks.some((c) => c.status === 'fail')

  // Check if already confirmed/approved
  const isAlreadyConfirmed =
    order.status === 'confirmed' ||
    order.status === 'approved' ||
    order.status === 'proof_submitted'

  async function handleConfirm() {
    setConfirming(true)
    await sleep(800)
    setConfirming(false)
    setShowSuccessFlash(true)
    await sleep(1200)
    setShowSuccessFlash(false)
    setConfirmed(true)
    toast({
      type: 'success',
      title: 'Comp confirmed!',
      message: 'Creator has been notified. They have 48 hours to post.',
    })
    await sleep(800)
    router.push('/restaurant')
  }

  async function handleReject() {
    if (!rejectionReason) return
    setRejecting(true)
    await sleep(600)
    setRejecting(false)
    setShowRejectModal(false)
    toast({
      type: 'warning',
      title: 'Order rejected',
      message: `Reason: ${rejectionReason === 'Other' ? otherText || 'Other' : rejectionReason}`,
    })
    router.push('/restaurant')
  }

  if (showSuccessFlash) {
    return (
      <div className="fixed inset-0 z-50 bg-emerald-500 flex flex-col items-center justify-center gap-6">
        <div className="h-32 w-32 rounded-full bg-white/20 flex items-center justify-center">
          <CheckCircle2 className="h-20 w-20 text-white" />
        </div>
        <p className="text-5xl font-black text-white">Comp Confirmed!</p>
        <p className="text-xl text-white/80 font-medium">Notifying creator...</p>
      </div>
    )
  }

  return (
    <div className="p-6 pb-10">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.push('/restaurant')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-6 text-sm font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Scanner
        </button>

        {/* ── Already Confirmed State ── */}
        {isAlreadyConfirmed && (
          <div className="border border-slate-200 rounded-lg p-8 mb-4 flex flex-col items-center gap-3 text-center">
            <div className="h-16 w-16 rounded-lg border border-slate-200 bg-white flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-slate-400" />
            </div>
            <p className="text-2xl font-black text-slate-900">Order Confirmed</p>
            <p className="text-sm text-slate-500 font-medium">
              {order.confirmed_at
                ? `Confirmed at ${formatTime(order.confirmed_at)}`
                : 'This order has already been processed.'}
            </p>
          </div>
        )}

        {/* ── Creator Identity Card ── */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-4">
          <div className="flex items-start gap-5">
            {/* Avatar — 64px per spec */}
            <div className="relative shrink-0">
              <img
                src={creator.photo_url ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.id}`}
                alt={creator.name}
                className="h-16 w-16 rounded-full object-cover border-2 border-slate-200 bg-slate-50"
              />
              {creator.verified && (
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-cc-accent flex items-center justify-center border-2 border-white">
                  <BadgeCheck className="h-3.5 w-3.5 text-white" />
                </div>
              )}
            </div>

            {/* Name + handles */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h1 className="text-xl font-black text-slate-900">{creator.name}</h1>
                {creator.verified && (
                  <span className="border border-slate-200 text-slate-600 rounded-md px-3 py-1 text-xs font-bold">
                    Verified
                  </span>
                )}
                {creator.strike_count > 0 && (
                  <span className="border border-slate-200 text-slate-600 rounded-md px-2 py-0.5 text-xs font-semibold">
                    {creator.strike_count} Strike{creator.strike_count !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5 mt-1">
                {creator.ig_handle && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shrink-0">
                      <Instagram className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="font-semibold text-slate-700">{creator.ig_handle}</span>
                  </div>
                )}
                {creator.tiktok_handle && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-6 w-6 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
                      <Music2 className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="font-semibold text-slate-700">{creator.tiktok_handle}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Anti-fraud note */}
          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0" />
            <p className="text-xs text-slate-400">
              Verify that the person in front of you matches the name and handles above.
            </p>
          </div>
        </div>

        {/* ── Order Details ── */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">Order Details</h2>
            <span className="text-xs text-slate-400 font-mono bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg font-bold tracking-widest">
              #{order.redemption_code}
            </span>
          </div>

          {/* Restaurant */}
          <div className="flex items-center gap-2 mb-4 border border-slate-200 rounded-lg px-3 py-2">
            <span className="text-xs text-slate-400 font-medium">Restaurant:</span>
            <span className="text-sm font-semibold text-slate-900">{order.restaurant_name}</span>
          </div>

          {/* Items */}
          <div className="flex flex-col gap-2.5 mb-5">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 border border-slate-200 rounded-lg px-4 py-3"
              >
                {/* Item icon placeholder */}
                <div className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center shrink-0">
                  <span className="text-lg">🍽️</span>
                </div>
                <span className="text-sm font-bold text-slate-900 flex-1">
                  {item.menu_item_name}
                </span>
                {item.qty > 1 && (
                  <span className="bg-cc-accent text-white text-xs font-black rounded-md px-2.5 py-1 tabular-nums">
                    ×{item.qty}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Deliverable requirement */}
          {order.deliverable_requirement && (
            <div className="border-t border-slate-200 pt-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Content Requirement
              </p>
              <div className="border border-slate-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <DeliverableIcon type={order.deliverable_requirement.allowed_types} />
                  <span className="text-sm font-semibold text-slate-900">
                    <DeliverableLabel type={order.deliverable_requirement.allowed_types} />
                  </span>
                </div>

                {order.deliverable_requirement.required_hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-1.5">
                    {order.deliverable_requirement.required_hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-xs border border-slate-200 rounded-md px-2 py-0.5 text-slate-600 font-medium"
                      >
                        <Hash className="h-2.5 w-2.5" />
                        {tag.replace('#', '')}
                      </span>
                    ))}
                  </div>
                )}

                {order.deliverable_requirement.required_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {order.deliverable_requirement.required_tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-xs border border-slate-200 rounded-md px-2 py-0.5 text-slate-600 font-medium"
                      >
                        <AtSign className="h-2.5 w-2.5" />
                        {tag.replace('@', '')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Validation Checklist ── */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-5">
          <h2 className="text-base font-bold text-slate-900 mb-4">Validation</h2>

          <div className="flex flex-col gap-2">
            {checks.map((check, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3',
                  check.status === 'pass' && 'bg-emerald-50',
                  check.status === 'fail' && 'bg-red-50',
                  check.status === 'warn' && 'bg-amber-50'
                )}
              >
                <div className={cn(
                  'shrink-0',
                  check.status === 'pass' && 'text-emerald-600',
                  check.status === 'fail' && 'text-red-500',
                  check.status === 'warn' && 'text-amber-600'
                )}>
                  {check.status === 'pass' ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : check.status === 'fail' ? (
                    <XCircle className="h-5 w-5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm font-semibold',
                    check.status === 'pass' && 'text-emerald-700',
                    check.status === 'fail' && 'text-red-600',
                    check.status === 'warn' && 'text-amber-700'
                  )}>
                    {check.label}
                  </p>
                  <p className="text-xs text-slate-500">{check.detail}</p>
                </div>

                <span className={cn(
                  'text-xs font-bold px-2 py-0.5 rounded-md shrink-0',
                  check.status === 'pass' && 'bg-emerald-100 text-emerald-700',
                  check.status === 'fail' && 'bg-red-100 text-red-600',
                  check.status === 'warn' && 'bg-amber-100 text-amber-700'
                )}>
                  {check.status === 'pass' ? 'Pass' : check.status === 'fail' ? 'Fail' : 'Warn'}
                </span>
              </div>
            ))}
          </div>

          {hasFail && (
            <div className="mt-4 flex items-start gap-2 border border-slate-200 rounded-lg px-4 py-3">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600">
                One or more checks failed. Review before confirming — you can still confirm manually.
              </p>
            </div>
          )}
        </div>

        {/* ── Action Buttons ── */}
        {!isAlreadyConfirmed && (
          <div className="flex flex-col gap-3">
            <button
              onClick={handleConfirm}
              disabled={confirming || confirmed}
              className={cn(
                'w-full py-4 rounded-lg flex items-center justify-center gap-3 text-white font-bold text-base transition-all duration-150 cursor-pointer',
                allGreen
                  ? 'bg-emerald-500 hover:bg-emerald-600'
                  : 'bg-emerald-400 hover:bg-emerald-500',
                (confirming || confirmed) && 'opacity-60 cursor-not-allowed'
              )}
            >
              {confirming ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Confirm Comp
                </>
              )}
            </button>

            <button
              onClick={() => setShowRejectModal(true)}
              className="w-full py-4 rounded-lg border border-slate-200 text-red-500 font-bold text-base hover:bg-red-50 transition-colors cursor-pointer"
            >
              Reject Order
            </button>
          </div>
        )}
      </div>

      {/* ── Rejection Modal ── */}
      <Modal
        open={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Order"
        description="Select a reason for rejection."
        maxWidth="max-w-lg"
      >
        <div className="flex flex-col gap-2 mt-2">
          {REJECTION_REASONS.map((reason) => (
            <button
              key={reason}
              onClick={() => setRejectionReason(reason)}
              className={cn(
                'w-full text-left px-4 py-4 rounded-lg border transition-all text-sm font-medium cursor-pointer',
                rejectionReason === reason
                  ? 'border-cc-accent bg-cc-accent text-white'
                  : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
              )}
            >
              {reason}
            </button>
          ))}

          {rejectionReason === 'Other' && (
            <Textarea
              placeholder="Describe the reason..."
              rows={3}
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              className="mt-1"
            />
          )}
        </div>

        <ModalFooter>
          <Button
            variant="ghost"
            onClick={() => { setShowRejectModal(false); setRejectionReason(null) }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={rejecting}
            disabled={!rejectionReason || (rejectionReason === 'Other' && !otherText.trim())}
            onClick={handleReject}
          >
            Confirm Rejection
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
