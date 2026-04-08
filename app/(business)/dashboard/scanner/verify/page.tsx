'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Clock,
  Ban, Users, ArrowLeft, Instagram, Music2, Hash, AtSign, BadgeCheck, Loader2,
} from 'lucide-react'
import { supabase, isDemoMode } from '@/lib/supabase'
import { DEMO_ORDERS, DEMO_CREATORS, DEMO_RESTAURANTS } from '@/lib/demo-data'
import { isExpired, isInBlackout, formatTime, cn, sleep } from '@/lib/utils'
import { hapticSuccess, hapticError, hapticHeavy } from '@/lib/haptics'
import type { Order, Creator, Restaurant } from '@/lib/types'

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

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const code = searchParams.get('code')

  const [order, setOrder] = useState<Order | null>(null)
  const [creator, setCreator] = useState<Creator | null>(null)
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [confirming, setConfirming] = useState(false)
  const [showRejectSheet, setShowRejectSheet] = useState(false)
  const [rejectionReason, setRejectionReason] = useState<string | null>(null)
  const [otherText, setOtherText] = useState('')
  const [rejecting, setRejecting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Fetch order data on mount
  useEffect(() => {
    async function lookupOrder() {
      setLoading(true)
      setError(null)

      try {
        if (isDemoMode || (!token && code !== 'manual' && !code)) {
          // Demo mode: find the first valid demo order
          const demoToken = token || ''
          const demoCode = code === 'manual' ? '' : (code || '')
          let demoOrder = DEMO_ORDERS.find(
            (o) => o.qr_token === demoToken || o.redemption_code === demoCode
          )
          // Fall back to first demo order if no match
          if (!demoOrder) demoOrder = DEMO_ORDERS[0]
          const demoCreator = DEMO_CREATORS.find((c) => c.id === demoOrder!.creator_id) ?? DEMO_CREATORS[0]
          const demoRestaurant = DEMO_RESTAURANTS.find((r) => r.id === demoOrder!.restaurant_id) ?? DEMO_RESTAURANTS[0]

          setOrder(demoOrder)
          setCreator(demoCreator)
          setRestaurant(demoRestaurant)
          setLoading(false)
          return
        }

        // Production: query Supabase directly (API routes are unavailable in static export)
        if (!supabase) {
          setError('App not configured. Please contact support.')
          setLoading(false)
          return
        }

        // Build the order query based on token or code
        let orderQuery = supabase.from('orders').select('*')
        if (token) {
          orderQuery = orderQuery.eq('qr_token', token)
        } else if (code && code !== 'manual') {
          orderQuery = orderQuery.eq('redemption_code', code)
        }
        const { data: orderData, error: orderErr } = await orderQuery.single()

        if (orderErr || !orderData) {
          setError('Order not found')
          setLoading(false)
          return
        }

        // Fetch the creator
        const { data: creatorData } = await supabase
          .from('creators')
          .select('*')
          .eq('id', orderData.creator_id)
          .single()

        // Fetch the restaurant
        const { data: restaurantData } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', orderData.restaurant_id)
          .single()

        setOrder(orderData)
        setCreator(creatorData ?? null)
        setRestaurant(restaurantData ?? null)
        setLoading(false)
      } catch {
        setError('Failed to look up order. Please try again.')
        setLoading(false)
      }
    }

    lookupOrder()
  }, [token, code])

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 text-white animate-spin" />
        <p className="text-white/50 text-sm">Looking up order...</p>
      </div>
    )
  }

  // --- Error / Not Found State ---
  if (error || !order || !creator) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex flex-col items-center justify-center gap-5 px-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <XCircle className="h-10 w-10 text-red-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Order Not Found</h2>
          <p className="text-sm text-gray-500">{error ?? 'Could not find an order with this code.'}</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/scanner')}
          aria-label="Back to scanner"
          className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Scanner
        </button>
      </div>
    )
  }

  // --- Validation Checks ---
  const codeValid = order.status !== 'expired' && order.status !== 'rejected'
  const notExpired = !isExpired(order.expires_at) || order.status === 'confirmed'
  const notInBlackout = restaurant
    ? !isInBlackout(restaurant.settings.blackout_start, restaurant.settings.blackout_end)
    : true
  const timeRemaining = Math.max(0, Math.round((new Date(order.expires_at).getTime() - Date.now()) / 60000))

  const checks: ValidationCheck[] = [
    {
      label: 'Code valid',
      status: codeValid ? 'pass' : 'fail',
      detail: codeValid ? `#${order.redemption_code}` : `Status: ${order.status}`,
      icon: <ShieldCheck className="h-4 w-4" />,
    },
    {
      label: 'Not expired',
      status: notExpired ? 'pass' : 'fail',
      detail: notExpired
        ? order.status === 'confirmed' ? 'Already confirmed' : `${timeRemaining} min left`
        : 'Code expired',
      icon: <Clock className="h-4 w-4" />,
    },
    {
      label: 'Within hours',
      status: notInBlackout ? 'pass' : 'fail',
      detail: notInBlackout ? 'No active blackout' : `Blackout: ${restaurant?.settings.blackout_start}–${restaurant?.settings.blackout_end}`,
      icon: <Ban className="h-4 w-4" />,
    },
    {
      label: 'Daily cap',
      status: 'pass',
      detail: `Cap: ${restaurant?.settings.daily_comp_cap ?? 'Unlimited'}/day`,
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: 'Cooldown clear',
      status: 'pass',
      detail: `${restaurant?.settings.cooldown_days ?? 14}-day cooldown clear`,
      icon: <Clock className="h-4 w-4" />,
    },
  ]

  const allGreen = checks.every((c) => c.status === 'pass')
  const hasFail = checks.some((c) => c.status === 'fail')
  const isAlreadyConfirmed = ['confirmed', 'approved', 'proof_submitted'].includes(order.status)

  async function handleConfirm() {
    setConfirming(true)
    hapticHeavy()

    if (!isDemoMode && supabase) {
      try {
        await supabase.from('orders').update({
          status: 'confirmed',
          confirmed_at: new Date().toISOString(),
        }).eq('id', order!.id)
      } catch { /* continue to success screen */ }
    }

    await sleep(800)
    setConfirming(false)
    setShowSuccess(true)
    hapticSuccess()
    await sleep(1500)
    setShowSuccess(false)
    await sleep(300)
    router.push('/dashboard/scanner/confirmed')
  }

  async function handleReject() {
    if (!rejectionReason) return
    setRejecting(true)
    hapticError()

    if (!isDemoMode && supabase) {
      try {
        await supabase.from('orders').update({
          status: 'rejected',
          rejection_reason: rejectionReason === 'Other' ? otherText : rejectionReason,
        }).eq('id', order!.id)
      } catch { /* continue anyway */ }
    }

    await sleep(600)
    setRejecting(false)
    setShowRejectSheet(false)
    router.push('/dashboard/scanner')
  }

  function checkColor(s: CheckStatus) {
    if (s === 'pass') return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-400' }
    if (s === 'fail') return { bg: 'bg-red-500/10', text: 'text-red-400', badge: 'bg-red-500/20 text-red-400' }
    return { bg: 'bg-amber-500/10', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-400' }
  }

  // --- Success Screen ---
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 bg-emerald-500 flex flex-col items-center justify-center gap-6">
        <div className="h-28 w-28 rounded-full bg-white/20 flex items-center justify-center">
          <CheckCircle2 className="h-16 w-16 text-white" />
        </div>
        <p className="text-4xl font-bold text-white">Comp Confirmed!</p>
        <p className="text-lg text-white/80">Notifying creator...</p>
      </div>
    )
  }

  // --- Main UI ---
  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white">
      <div className="max-w-[430px] mx-auto px-4 pt-14 pb-10">
        {/* Back */}
        <button
          onClick={() => router.push('/dashboard/scanner')}
          aria-label="Back to scanner"
          className="flex items-center gap-2 text-white/40 hover:text-white active:text-white text-sm font-medium transition-colors mb-6 w-11 h-11"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        {/* Already confirmed banner */}
        {isAlreadyConfirmed && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 mb-4 flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
            <div>
              <p className="font-semibold text-white">Order Confirmed</p>
              {order.confirmed_at && (
                <p className="text-sm text-white/50 mt-0.5">at {formatTime(order.confirmed_at)}</p>
              )}
            </div>
          </div>
        )}

        {/* Creator Card */}
        <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5 mb-4">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={creator.photo_url ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.id}`}
                alt={creator.name}
                className="h-16 w-16 rounded-2xl object-cover"
              />
              {creator.verified && (
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center border-2 border-[#0B0B0D]">
                  <BadgeCheck className="h-3 w-3 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h1 className="text-lg font-bold text-white">{creator.name}</h1>
                {creator.verified && (
                  <span className="text-xs bg-white/10 text-white/60 rounded-lg px-2 py-0.5 font-medium">Verified</span>
                )}
                {creator.strike_count > 0 && (
                  <span className="text-xs bg-red-500/10 text-red-400 rounded-lg px-2 py-0.5 font-medium">
                    {creator.strike_count} Strike{creator.strike_count !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {creator.ig_handle && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-5 w-5 rounded-md bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shrink-0">
                      <Instagram className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-white/60">{creator.ig_handle}</span>
                  </div>
                )}
                {creator.tiktok_handle && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-5 w-5 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                      <Music2 className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-white/60">{creator.tiktok_handle}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-white/30 shrink-0" />
            <p className="text-xs text-white/30">Verify this person matches the name and handles above.</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Order Items</h2>
            <span className="font-mono text-xs bg-white/10 text-white/60 rounded-lg px-2.5 py-1 font-bold tracking-widest">
              #{order.redemption_code}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-4 py-3">
                <span className="text-lg">🍽️</span>
                <span className="text-sm font-medium text-white flex-1">{item.menu_item_name}</span>
                {item.qty > 1 && (
                  <span className="text-xs font-bold bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-lg px-2 py-0.5">
                    x{item.qty}
                  </span>
                )}
              </div>
            ))}
          </div>

          {order.deliverable_requirement && (
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Content Requirement</p>
              <div className="bg-white/[0.03] rounded-xl p-3">
                <p className="text-sm font-semibold text-white mb-2">
                  {order.deliverable_requirement.allowed_types === 'IG_REEL' ? 'Instagram Reel' :
                   order.deliverable_requirement.allowed_types === 'TIKTOK' ? 'TikTok Video' :
                   order.deliverable_requirement.allowed_types === 'BOTH' ? 'IG Reel + TikTok' : 'IG Reel or TikTok'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {order.deliverable_requirement.required_hashtags?.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 text-xs bg-white/[0.05] border border-white/[0.08] rounded-lg px-2 py-0.5 text-white/50">
                      <Hash className="h-2.5 w-2.5" />{tag.replace('#', '')}
                    </span>
                  ))}
                  {order.deliverable_requirement.required_tags?.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 text-xs bg-white/[0.05] border border-white/[0.08] rounded-lg px-2 py-0.5 text-white/50">
                      <AtSign className="h-2.5 w-2.5" />{tag.replace('@', '')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Validation Checks */}
        <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5 mb-5">
          <h2 className="text-sm font-semibold text-white mb-4">Validation</h2>
          <div className="flex flex-col gap-2">
            {checks.map((check, idx) => {
              const colors = checkColor(check.status)
              return (
                <div key={idx} className={cn('flex items-center gap-3 rounded-xl px-4 py-3', colors.bg)}>
                  <span className={colors.text}>{check.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm font-semibold', colors.text)}>{check.label}</p>
                    <p className="text-xs text-white/40">{check.detail}</p>
                  </div>
                  <span className={cn('text-xs font-bold px-2 py-0.5 rounded-lg shrink-0', colors.badge)}>
                    {check.status === 'pass' ? 'Pass' : check.status === 'fail' ? 'Fail' : 'Warn'}
                  </span>
                </div>
              )
            })}
          </div>
          {hasFail && (
            <div className="mt-3 flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300">One or more checks failed. Review before confirming.</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {!isAlreadyConfirmed && (
          <div className="flex flex-col gap-3 pb-8" style={{ paddingBottom: 'max(32px, env(safe-area-inset-bottom, 32px))' }}>
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className={cn(
                'w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-white font-bold text-base transition-all',
                allGreen ? 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700' : 'bg-emerald-500/80',
                (confirming) && 'opacity-60 cursor-not-allowed'
              )}
            >
              {confirming ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
              onClick={() => setShowRejectSheet(true)}
              className="w-full py-4 rounded-2xl border border-red-500/20 text-red-400 font-bold text-base hover:bg-red-500/10 active:bg-red-500/20 transition-colors"
            >
              Reject Order
            </button>
          </div>
        )}

        {/* Rejection Bottom Sheet */}
        {showRejectSheet && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRejectSheet(false)} />
            <div className="relative bg-[#111] rounded-t-3xl border-t border-white/[0.08] p-6 pb-10">
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />
              <h3 className="text-lg font-bold text-white mb-1">Reject Order</h3>
              <p className="text-sm text-white/50 mb-5">Select a reason</p>

              <div className="flex flex-col gap-2 mb-5">
                {REJECTION_REASONS.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setRejectionReason(reason)}
                    className={cn(
                      'w-full text-left px-4 py-4 rounded-2xl border transition-all text-sm font-medium',
                      rejectionReason === reason
                        ? 'border-transparent bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600 text-white'
                        : 'border-white/[0.08] bg-white/[0.03] text-white/70 hover:border-white/20'
                    )}
                  >
                    {reason}
                  </button>
                ))}
                {rejectionReason === 'Other' && (
                  <textarea
                    placeholder="Describe the reason..."
                    rows={3}
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 resize-none"
                  />
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowRejectSheet(false); setRejectionReason(null) }}
                  className="flex-1 py-4 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-white/60 font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason || (rejectionReason === 'Other' && !otherText.trim()) || rejecting}
                  className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {rejecting ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function VerifyOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-white animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}
