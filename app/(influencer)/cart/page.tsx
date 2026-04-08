'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus, Check, AlertCircle, MapPin, Instagram, Music2, Zap, CheckCircle2 } from 'lucide-react'
import { useCartStore } from '@/lib/stores/cart-store'
import { useOrderStore } from '@/lib/stores/order-store'
import { useAuth } from '@/lib/hooks/useAuth'
import { supabase, isDemoMode } from '@/lib/supabase'
import { generateRedemptionCode, generateQRToken, getCodeExpiry } from '@/lib/utils'
import { hapticMedium, hapticHeavy, hapticLight } from '@/lib/haptics'
import type { DeliverableType } from '@/lib/types'

// ── Agreement Check ───────────────────────────────────────────

function AgreementCheck({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-start gap-3.5 text-left w-full py-4 group"
    >
      <div
        className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${checked ? 'border-transparent' : 'border-[#2a2a2a] bg-[#252525]'}`}
        style={checked ? { background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' } : undefined}
      >
        {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
      </div>
      <span className="text-sm text-gray-300 leading-relaxed">{children}</span>
    </button>
  )
}

// ── Cart Item Row ─────────────────────────────────────────────

function CartItemRow({ name, qty, onIncrease, onDecrease, onRemove }: {
  name: string; qty: number; onIncrease: () => void; onDecrease: () => void; onRemove: () => void
}) {
  return (
    <div className="flex items-center gap-3 py-4 px-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white">{name}</p>
        <span className="inline-block mt-1 text-[10px] font-semibold bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">FREE</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onDecrease}
          aria-label={`Decrease ${name} quantity`}
          className="w-7 h-7 rounded-full border border-[#2a2a2a] flex items-center justify-center text-gray-400 hover:border-white/20 transition-colors"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-5 text-center text-sm font-bold text-white tabular-nums">{qty}</span>
        <button
          onClick={onIncrease}
          aria-label={`Increase ${name} quantity`}
          className="w-7 h-7 rounded-full flex items-center justify-center text-white"
          style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
        >
          <Plus className="h-3 w-3" />
        </button>
        <button onClick={onRemove} aria-label={`Remove ${name}`} className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-red-400 transition-colors ml-0.5">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

// ── Deliverable reminder ──────────────────────────────────────

function DeliverableReminder({ type }: { type: DeliverableType }) {
  const configs: Record<DeliverableType, { icon: React.ReactNode; label: string }> = {
    IG_REEL: { icon: <Instagram className="h-4 w-4 text-pink-400" />, label: 'Post 1 Instagram Reel within 48 hours' },
    TIKTOK: { icon: <Music2 className="h-4 w-4 text-gray-400" />, label: 'Post 1 TikTok Video within 48 hours' },
    CHOICE: { icon: <CheckCircle2 className="h-4 w-4 text-gray-400" />, label: 'Post 1 IG Reel OR 1 TikTok within 48 hours' },
    BOTH: { icon: <Zap className="h-4 w-4 text-yellow-400" />, label: 'Post IG Reel AND TikTok within 48 hours' },
  }
  const { icon, label } = configs[type]
  return (
    <div className="bg-[#252525] border border-[#2a2a2a] rounded-2xl p-4 flex items-start gap-3">
      <div className="shrink-0">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">Failure to post = strike + account block</p>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────

export default function CartPage() {
  const router = useRouter()
  const { items, restaurant, deliverableReq, updateQty, removeItem, clearCart, totalItems } = useCartStore()
  const { setActiveRedemption } = useOrderStore()
  const { user } = useAuth()

  const [agree1, setAgree1] = useState(false)
  const [agree2, setAgree2] = useState(false)
  const [agree3, setAgree3] = useState(false)
  const [placing, setPlacing] = useState(false)

  const allAgreed = agree1 && agree2 && agree3
  const cartTotal = totalItems()
  const canPlace = allAgreed && cartTotal > 0

  const handleIncrease = (itemId: string, currentQty: number, maxQty: number) => {
    if (currentQty < maxQty) {
      updateQty(itemId, currentQty + 1)
      hapticLight()
    }
  }

  const handleDecrease = (itemId: string, currentQty: number) => {
    if (currentQty <= 1) {
      removeItem(itemId)
      hapticMedium()
    } else {
      updateQty(itemId, currentQty - 1)
      hapticLight()
    }
  }

  const handlePlaceOrder = async () => {
    if (!canPlace || !restaurant) return
    setPlacing(true)
    hapticHeavy()

    const code = generateRedemptionCode()
    const token = generateQRToken()
    const expiry = getCodeExpiry()
    let orderId = `order-demo-${Date.now()}`

    // Persist order to Supabase in production
    if (!isDemoMode && supabase && user?.creatorId) {
      try {
        const { data: orderRow, error } = await supabase.from('orders').insert({
          creator_id: user.creatorId,
          restaurant_id: restaurant.id,
          restaurant_name: restaurant.name,
          items: items.map((i) => ({
            menu_item_id: i.menu_item.id,
            menu_item_name: i.menu_item.name,
            qty: i.qty,
          })),
          status: 'created',
          redemption_code: code,
          qr_token: token,
          expires_at: expiry,
        }).select('id').single()

        if (!error && orderRow) {
          orderId = orderRow.id
        }
      } catch (err) {
        console.error('[Cart] Order creation failed:', err)
      }
    }

    setActiveRedemption({
      orderId,
      restaurantName: restaurant.name,
      redemptionCode: code,
      qrToken: token,
      expiresAt: expiry,
      items: items.map((i) => ({ name: i.menu_item.name, qty: i.qty })),
    })
    clearCart()
    setPlacing(false)
    router.push('/redeem')
  }

  // Empty state
  if (!restaurant || items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] text-white flex flex-col max-w-[430px] mx-auto">
        <header className="px-4 pt-14 pb-4 flex items-center gap-3">
          <button onClick={() => router.back()} aria-label="Go back" className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#1a1a1a] active:bg-[#252525] transition-colors">
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">Your Order</h1>
        </header>
        <div className="flex flex-col items-center justify-center gap-5 px-6 text-center flex-1" style={{ paddingBottom: '80px' }}>
          <div className="w-20 h-20 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
            <ShoppingCart className="h-9 w-9 text-gray-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">Ready to get comped?</p>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">Browse restaurants and pick items from their comped menu.</p>
          </div>
          <button
            onClick={() => router.push('/discover')}
            className="text-white font-bold rounded-[18px] px-8 py-3.5 text-sm"
            style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white flex flex-col max-w-[430px] mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#0B0B0D]/95 backdrop-blur-md border-b border-[#2a2a2a] px-4 pt-14 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} aria-label="Go back" className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#1a1a1a] active:bg-[#252525] transition-colors">
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white flex-1">Your Order</h1>
          <span
            className="text-xs font-bold text-white rounded-lg px-2.5 py-1"
            style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
          >
            {cartTotal} item{cartTotal !== 1 ? 's' : ''}
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-36 space-y-4 pt-4 px-4">
        {/* Restaurant info */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 flex items-center gap-3">
          <MapPin className="h-4 w-4 text-gray-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Comping at</p>
            <p className="text-sm font-semibold text-white truncate">{restaurant.name}</p>
          </div>
        </div>

        {/* Deliverable reminder */}
        {deliverableReq && <DeliverableReminder type={deliverableReq.allowed_types} />}

        {/* Items */}
        <div>
          <p className="text-[10px] font-semibold text-gray-500 mb-2 uppercase tracking-widest">Items</p>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden divide-y divide-[#2a2a2a]">
            {items.map((ci) => (
              <CartItemRow
                key={ci.menu_item.id}
                name={ci.menu_item.name}
                qty={ci.qty}
                onIncrease={() => handleIncrease(ci.menu_item.id, ci.qty, ci.menu_item.max_qty_per_order)}
                onDecrease={() => handleDecrease(ci.menu_item.id, ci.qty)}
                onRemove={() => removeItem(ci.menu_item.id)}
              />
            ))}
          </div>
        </div>

        {/* Agreements */}
        <div>
          <p className="text-[10px] font-semibold text-gray-500 mb-2 uppercase tracking-widest">Before you continue</p>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 divide-y divide-[#2a2a2a]">
            <AgreementCheck checked={agree1} onChange={setAgree1}>
              I agree to post within <strong className="text-white font-bold">48 hours</strong> of redemption.
            </AgreementCheck>
            <AgreementCheck checked={agree2} onChange={setAgree2}>
              My account will remain <strong className="text-white font-bold">public</strong>. Posts must stay active for at least 30 days.
            </AgreementCheck>
            <AgreementCheck checked={agree3} onChange={setAgree3}>
              I understand <strong className="text-white font-bold">3 strikes = permanent ban</strong> from HIVE.
            </AgreementCheck>
          </div>
          {!allAgreed && (
            <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>Check all boxes above to place your order</span>
            </div>
          )}
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed left-0 right-0 z-30 px-4 max-w-[430px] mx-auto" style={{ bottom: 'calc(max(24px, env(safe-area-inset-bottom, 24px)) + 72px)' }}>
        <button
          onClick={handlePlaceOrder}
          disabled={!canPlace || placing}
          className="w-full flex items-center justify-center gap-2 text-white font-bold rounded-[18px] py-4 text-sm transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
        >
          {placing ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Placing Order...
            </span>
          ) : (
            'Get Comped'
          )}
        </button>
      </div>
    </div>
  )
}
