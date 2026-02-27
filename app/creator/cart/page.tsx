'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Instagram,
  Music2,
  Zap,
  CheckCircle2,
  AlertCircle,
  Check,
  ChevronRight,
  MapPin,
} from 'lucide-react'
import { cn, generateRedemptionCode, generateQRToken, getCodeExpiry } from '@/lib/utils'
import { useCartStore } from '@/lib/stores/cart-store'
import { useOrderStore } from '@/lib/stores/order-store'
import { useToast } from '@/components/ui/toast'
import type { DeliverableType } from '@/lib/types'

// ── Deliverable platform reminder ─────────────────────────────

function DeliverableReminder({ type }: { type: DeliverableType }) {
  const configs: Record<DeliverableType, { icon: React.ReactNode; label: string }> = {
    IG_REEL: {
      icon: <Instagram className="h-4 w-4 text-slate-400" />,
      label: 'Post 1 Instagram Reel within 48 hours',
    },
    TIKTOK: {
      icon: <Music2 className="h-4 w-4 text-slate-400" />,
      label: 'Post 1 TikTok Video within 48 hours',
    },
    CHOICE: {
      icon: <CheckCircle2 className="h-4 w-4 text-slate-400" />,
      label: 'Post 1 IG Reel OR 1 TikTok within 48 hours',
    },
    BOTH: {
      icon: <Zap className="h-4 w-4 text-slate-400" />,
      label: 'Post IG Reel AND TikTok within 48 hours',
    },
  }

  const { icon, label } = configs[type]

  return (
    <div className="border border-slate-200 rounded-lg p-4 flex items-start gap-3">
      <div className="shrink-0 text-slate-400">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">
          Failure to post = strike + account block
        </p>
      </div>
    </div>
  )
}

// ── Agreement checkbox ─────────────────────────────────────────

function AgreementCheck({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-start gap-3.5 text-left w-full py-3.5 group"
    >
      <div
        className={cn(
          'w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors',
          checked
            ? 'bg-cc-accent border-cc-accent'
            : 'bg-white border-slate-200 group-hover:border-slate-300'
        )}
      >
        {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
      </div>
      <span className="text-sm text-slate-600 leading-relaxed">{children}</span>
    </button>
  )
}

// ── Cart Item Row ──────────────────────────────────────────────

function CartItemRow({
  name,
  qty,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  name: string
  qty: number
  onIncrease: () => void
  onDecrease: () => void
  onRemove: () => void
}) {
  return (
    <div className="flex items-center gap-3.5 py-4 px-5">
      <div className="flex-1 min-w-0">
        <p className="text-base font-black text-slate-900">{name}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onDecrease}
          className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:border-slate-300 transition-colors"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-5 text-center text-sm font-semibold text-slate-900 tabular-nums">{qty}</span>
        <button
          onClick={onIncrease}
          className="w-7 h-7 rounded border border-cc-accent bg-cc-accent flex items-center justify-center text-white hover:bg-cc-accent-dark transition-colors"
        >
          <Plus className="h-3 w-3" />
        </button>
        <button
          onClick={onRemove}
          className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-red-400 transition-colors ml-0.5"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────

export default function CartPage() {
  const router = useRouter()
  const { toast } = useToast()
  const {
    items,
    restaurant,
    deliverableReq,
    updateQty,
    removeItem,
    clearCart,
    totalItems,
  } = useCartStore()
  const { setActiveRedemption } = useOrderStore()

  const [agree1, setAgree1] = useState(false)
  const [agree2, setAgree2] = useState(false)
  const [agree3, setAgree3] = useState(false)
  const [placing, setPlacing] = useState(false)

  const allAgreed = agree1 && agree2 && agree3
  const cartTotal = totalItems()
  const canPlace = allAgreed && cartTotal > 0

  const handleIncrease = (itemId: string, currentQty: number, maxQty: number) => {
    if (currentQty < maxQty) updateQty(itemId, currentQty + 1)
  }

  const handleDecrease = (itemId: string, currentQty: number) => {
    if (currentQty <= 1) {
      removeItem(itemId)
    } else {
      updateQty(itemId, currentQty - 1)
    }
  }

  const handlePlaceOrder = async () => {
    if (!canPlace || !restaurant) return
    setPlacing(true)

    await new Promise((r) => setTimeout(r, 600))

    const code = generateRedemptionCode()
    const token = generateQRToken()
    const expiry = getCodeExpiry()

    setActiveRedemption({
      orderId: `order-demo-${Date.now()}`,
      restaurantName: restaurant.name,
      redemptionCode: code,
      qrToken: token,
      expiresAt: expiry,
      items: items.map((i) => ({ name: i.menu_item.name, qty: i.qty })),
    })

    clearCart()
    setPlacing(false)

    toast({
      type: 'success',
      title: 'Order created!',
      message: 'Show the code to restaurant staff.',
    })

    router.push('/creator/redeem')
  }

  // Empty cart state
  if (!restaurant || items.length === 0) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'white', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
        <header className="border-b border-slate-100 shrink-0" style={{ height: '56px', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px' }}>
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 active:scale-95 transition-all shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-base font-black text-slate-900">Your Order</h1>
        </header>
        <div className="flex flex-col items-center justify-center gap-5 px-6 text-center" style={{ flex: 1, paddingBottom: '64px' }}>
          {/* Big icon container */}
          <div className="w-20 h-20 rounded-lg border border-slate-200 flex items-center justify-center">
            <ShoppingCart className="h-9 w-9 text-cc-accent" />
          </div>
          <div>
            <p className="text-xl font-black text-slate-900">Ready to get comped?</p>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Browse restaurants near you and pick items from their comped menu.
            </p>
          </div>
          <button
            onClick={() => router.push('/creator/discover')}
            className="bg-cc-accent text-white font-black rounded-lg px-8 py-3.5 text-sm hover:bg-cc-accent-dark active:scale-95 transition-all"
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-sm mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center gap-3 h-14 px-4">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 active:scale-95 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-base font-black text-slate-900">Your Order</h1>
          {/* Item count badge */}
          <span className="ml-auto bg-cc-accent text-white text-xs font-black rounded-md px-2.5 py-0.5">
            {cartTotal} item{cartTotal !== 1 ? 's' : ''}
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-36 space-y-5 pt-4">
        {/* Restaurant info card */}
        <div className="px-4">
          <div className="border border-slate-200 rounded-lg p-4 flex items-center gap-3">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Comping at</p>
              <p className="text-sm font-semibold text-slate-900 truncate">{restaurant.name}</p>
            </div>
            {deliverableReq && (
              <div className="shrink-0">
                {deliverableReq.allowed_types === 'IG_REEL' && (
                  <Instagram className="h-4 w-4 text-slate-400" />
                )}
                {deliverableReq.allowed_types === 'TIKTOK' && (
                  <Music2 className="h-4 w-4 text-slate-400" />
                )}
                {deliverableReq.allowed_types === 'CHOICE' && (
                  <CheckCircle2 className="h-4 w-4 text-slate-400" />
                )}
                {deliverableReq.allowed_types === 'BOTH' && (
                  <Zap className="h-4 w-4 text-slate-400" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Deliverable reminder */}
        {deliverableReq && (
          <div className="px-4">
            <DeliverableReminder type={deliverableReq.allowed_types} />
          </div>
        )}

        {/* Items list */}
        <div className="px-4 pt-4">
          <p className="text-[10px] font-semibold text-slate-400 mb-2 uppercase tracking-widest px-0.5">
            Items
          </p>
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <ul className="divide-y divide-slate-50">
              {items.map((ci) => (
                <li key={ci.menu_item.id}>
                  <CartItemRow
                    name={ci.menu_item.name}
                    qty={ci.qty}
                    onIncrease={() =>
                      handleIncrease(ci.menu_item.id, ci.qty, ci.menu_item.max_qty_per_order)
                    }
                    onDecrease={() => handleDecrease(ci.menu_item.id, ci.qty)}
                    onRemove={() => removeItem(ci.menu_item.id)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Agreements */}
        <div className="px-4 py-4">
          <p className="text-[10px] font-semibold text-slate-400 mb-2 uppercase tracking-widest px-0.5">
            Before you continue
          </p>
          <div className="bg-white border border-slate-200 rounded-lg px-4 divide-y divide-slate-100">
            <AgreementCheck checked={agree1} onChange={setAgree1}>
              I agree to post within <strong className="text-slate-900 font-black">48 hours</strong> of redemption.
            </AgreementCheck>
            <AgreementCheck checked={agree2} onChange={setAgree2}>
              My account will remain <strong className="text-slate-900 font-black">public</strong>. Posts must stay active for at least 30 days.
            </AgreementCheck>
            <AgreementCheck checked={agree3} onChange={setAgree3}>
              I understand <strong className="text-slate-900 font-black">3 strikes = permanent ban</strong> from CreatorComped.
            </AgreementCheck>
          </div>

          {!allAgreed && (
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-400 px-0.5">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span className="font-medium">Check all boxes above to place your order</span>
            </div>
          )}
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-16 left-0 right-0 z-30 px-4 pb-3 max-w-sm mx-auto bg-white border-t border-slate-200 pt-3">
        <button
          onClick={handlePlaceOrder}
          disabled={!canPlace || placing}
          className={cn(
            'w-full flex items-center justify-center gap-2 bg-cc-accent text-white font-semibold rounded-lg py-3.5 text-sm transition-colors',
            'hover:bg-cc-accent-dark',
            (!canPlace || placing) && 'opacity-40 cursor-not-allowed'
          )}
        >
          {placing ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Placing Order...
            </span>
          ) : (
            <>
              Place Order
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
