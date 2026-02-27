'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Clock,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  AlertTriangle,
  ShoppingCart,
  Instagram,
  Music2,
  Zap,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { cn, isInBlackout } from '@/lib/utils'
import {
  DEMO_RESTAURANTS,
  getMenuItemsForRestaurant,
  getDeliverableForRestaurant,
} from '@/lib/demo-data'
import { useCartStore } from '@/lib/stores/cart-store'
import type { Restaurant, MenuItem, DeliverableRequirement, DeliverableType } from '@/lib/types'

// ── Helpers ───────────────────────────────────────────────────

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
const DAY_LABELS: Record<string, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
}

function getTodayKey() {
  const day = new Date().getDay()
  return DAY_KEYS[day]
}

function isOpenNow(restaurant: Restaurant): boolean {
  const todayKey = getTodayKey()
  const hours = restaurant.hours[todayKey]
  if (!hours || hours.closed) return false
  const now = new Date()
  const [oh, om] = hours.open.split(':').map(Number)
  const [ch, cm] = hours.close.split(':').map(Number)
  const nowMin = now.getHours() * 60 + now.getMinutes()
  return nowMin >= oh * 60 + om && nowMin < ch * 60 + cm
}

function formatHour(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

// ── Food image placeholder ────────────────────────────────────

const FOOD_EMOJIS = ['🍜', '🥗', '🍕', '🍔', '🌮', '🍣', '🥩', '🍝', '🧆', '🍱']
function getFoodEmoji(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  return FOOD_EMOJIS[Math.abs(hash) % FOOD_EMOJIS.length]
}

// ── Deliverable UI ─────────────────────────────────────────────

function DeliverableBox({ type }: { type: DeliverableType }) {
  const config: Record<DeliverableType, { icon: React.ReactNode; label: string }> = {
    IG_REEL: {
      icon: <Instagram className="h-4 w-4 text-slate-400" />,
      label: '1 Instagram Reel required within 48 hours',
    },
    TIKTOK: {
      icon: <Music2 className="h-4 w-4 text-slate-400" />,
      label: '1 TikTok Video required within 48 hours',
    },
    CHOICE: {
      icon: <CheckCircle2 className="h-4 w-4 text-slate-400" />,
      label: '1 IG Reel OR 1 TikTok required within 48 hours',
    },
    BOTH: {
      icon: <Zap className="h-4 w-4 text-slate-400" />,
      label: 'IG Reel AND TikTok both required within 48 hours',
    },
  }

  const { icon, label } = config[type]

  return (
    <div className="border border-slate-200 rounded-lg p-4 flex items-start gap-3">
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">Failure to post = strike + account block</p>
      </div>
    </div>
  )
}

// ── Menu Item Row ─────────────────────────────────────────────

function MenuItemRow({
  item,
  qty,
  onAdd,
  onRemove,
  maxReached,
}: {
  item: MenuItem
  qty: number
  onAdd: () => void
  onRemove: () => void
  maxReached: boolean
}) {
  const atItemMax = qty >= item.max_qty_per_order
  const emoji = getFoodEmoji(item.id)

  return (
    <div className="flex items-center gap-3.5 py-4 px-5">
      {/* Image placeholder */}
      <div className="w-14 h-14 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xl">{emoji}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900">{item.name}</p>
        {item.description && (
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-snug">{item.description}</p>
        )}
        {item.max_qty_per_order > 1 && (
          <p className="text-xs text-slate-400 mt-0.5">Max {item.max_qty_per_order}</p>
        )}
      </div>

      {/* Qty controls */}
      <div className="flex items-center gap-2 shrink-0">
        {qty > 0 ? (
          <>
            <button
              onClick={onRemove}
              className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:border-slate-300 active:scale-95 transition-all"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-5 text-center text-sm font-semibold text-slate-900">{qty}</span>
            <button
              onClick={onAdd}
              disabled={atItemMax || maxReached}
              className="w-7 h-7 rounded border border-cc-accent bg-cc-accent flex items-center justify-center text-white hover:bg-cc-accent-dark disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
            >
              <Plus className="h-3 w-3" />
            </button>
          </>
        ) : (
          <button
            onClick={onAdd}
            disabled={maxReached}
            className="w-7 h-7 rounded border border-cc-accent bg-cc-accent flex items-center justify-center text-white hover:bg-cc-accent-dark disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
          >
            <Plus className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────

export default function RestaurantSheetPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>
}) {
  const { restaurantId } = use(params)
  const router = useRouter()
  const [showFullHours, setShowFullHours] = useState(false)
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [deliverable, setDeliverable] = useState<DeliverableRequirement | null>(null)

  const { items: cartItems, addItem, removeItem, updateQty, clearCart, setRestaurant: setCartRestaurant, totalItems } = useCartStore()

  useEffect(() => {
    const r = DEMO_RESTAURANTS.find((r) => r.id === restaurantId) ?? null
    setRestaurant(r)
    if (r) {
      setMenuItems(getMenuItemsForRestaurant(restaurantId))
      const deliv = getDeliverableForRestaurant(restaurantId)
      setDeliverable(deliv)
      const currentRestaurantId = useCartStore.getState().restaurant?.id
      if (currentRestaurantId && currentRestaurantId !== restaurantId) {
        clearCart()
      }
      setCartRestaurant(r, deliv)
    }
  }, [restaurantId, setCartRestaurant, clearCart])

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center max-w-sm mx-auto">
        <div className="text-center px-4">
          <XCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
          <p className="text-slate-900 font-black">Restaurant not found</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-sm text-cc-accent font-bold"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  const openNow = isOpenNow(restaurant)
  const inBlackout = isInBlackout(
    restaurant.settings.blackout_start,
    restaurant.settings.blackout_end
  )
  const todayKey = getTodayKey()
  const todayHours = restaurant.hours[todayKey]
  const maxItems = restaurant.settings.max_items_per_order
  const cartTotal = totalItems()
  const maxReached = cartTotal >= maxItems

  const getItemQty = (itemId: string) => {
    return cartItems.find((ci) => ci.menu_item.id === itemId)?.qty ?? 0
  }

  const handleAdd = (item: MenuItem) => {
    const qty = getItemQty(item.id)
    if (qty >= item.max_qty_per_order || maxReached) return
    addItem(item)
  }

  const handleRemove = (item: MenuItem) => {
    const qty = getItemQty(item.id)
    if (qty <= 1) {
      removeItem(item.id)
    } else {
      updateQty(item.id, qty - 1)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-sm mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3 h-14 px-4">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 active:scale-95 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-black text-slate-900 truncate leading-tight">{restaurant.name}</h1>
            <p className="text-xs text-slate-500 truncate font-medium">{restaurant.address}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-28">
        {/* Status pills row */}
        <div className="px-4 pt-5 pb-2 flex items-center gap-2 flex-wrap">
          {restaurant.settings.pause_comps ? (
            <span className="inline-flex items-center gap-1.5 border border-slate-200 text-slate-500 text-xs font-medium rounded px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              Comps Paused
            </span>
          ) : openNow ? (
            <span className="inline-flex items-center gap-1.5 border border-slate-200 text-slate-500 text-xs font-medium rounded px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              Open Now
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 border border-slate-200 text-slate-400 text-xs font-medium rounded px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
              Closed
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 border border-slate-200 text-slate-400 text-xs font-medium rounded px-2.5 py-1">
            <Clock className="h-3 w-3" />
            Every {restaurant.settings.cooldown_days}d cooldown
          </span>
        </div>

        {/* Blackout warning */}
        {inBlackout && restaurant.settings.blackout_start && restaurant.settings.blackout_end && (
          <div className="mx-4 mt-3 flex items-center gap-2.5 border border-slate-200 rounded-lg px-4 py-3">
            <AlertTriangle className="h-4 w-4 text-slate-400 shrink-0" />
            <p className="text-xs text-slate-500">
              No comps during lunch rush ({formatHour(restaurant.settings.blackout_start)}–{formatHour(restaurant.settings.blackout_end)})
            </p>
          </div>
        )}

        {/* Hours card */}
        <div className="px-4 pt-4">
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowFullHours((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                {/* Open/closed dot */}
                {openNow && !restaurant.settings.pause_comps ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                )}
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-900">
                  Today:{' '}
                  {todayHours?.closed
                    ? 'Closed'
                    : `${formatHour(todayHours?.open ?? '00:00')} – ${formatHour(todayHours?.close ?? '00:00')}`}
                </span>
              </div>
              {showFullHours ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>
            {showFullHours && (
              <div className="border-t border-slate-100 divide-y divide-slate-50">
                {DAY_KEYS.map((day) => {
                  const h = restaurant.hours[day]
                  const isToday = day === todayKey
                  return (
                    <div
                      key={day}
                      className={cn(
                        'flex items-center justify-between px-4 py-2.5',
                        isToday && 'bg-cc-accent-subtle'
                      )}
                    >
                      <span
                        className={cn(
                          'text-xs font-bold',
                          isToday ? 'text-cc-accent' : 'text-slate-600'
                        )}
                      >
                        {DAY_LABELS[day]}
                        {isToday && <span className="ml-1.5 text-[10px] font-black opacity-70">TODAY</span>}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {h.closed
                          ? 'Closed'
                          : `${formatHour(h.open)} – ${formatHour(h.close)}`}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Deliverable box */}
        {deliverable && (
          <div className="px-4 pt-4 space-y-4">
            <DeliverableBox type={deliverable.allowed_types} />

            {deliverable.required_hashtags.length > 0 && (
              <div className="border border-slate-200 rounded-lg px-4 py-4">
                <p className="text-[10px] text-slate-400 mb-2.5 font-semibold uppercase tracking-widest">
                  Required hashtags
                </p>
                <div className="flex flex-wrap gap-2">
                  {deliverable.required_hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs border border-slate-200 text-slate-600 rounded px-2.5 py-1 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {deliverable.required_tags.length > 0 && (
                  <>
                    <p className="text-[10px] text-slate-400 mt-4 mb-2.5 font-semibold uppercase tracking-widest">
                      Tag in post
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {deliverable.required_tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs border border-slate-200 text-slate-600 rounded px-2.5 py-1 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Menu section header */}
        <div className="px-4 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-900">Comped Menu</h2>
            <span className="text-xs text-slate-400 border border-slate-200 rounded px-2.5 py-1">
              Max {maxItems} item{maxItems !== 1 ? 's' : ''}
            </span>
          </div>

          {maxReached && (
            <div className="flex items-center gap-2.5 border border-slate-200 rounded-lg px-4 py-3 mb-4">
              <AlertTriangle className="h-4 w-4 text-slate-400 shrink-0" />
              <p className="text-xs text-slate-500">
                Order limit reached — {maxItems} items max
              </p>
            </div>
          )}
        </div>

        {/* Menu items */}
        <div className="mx-4 border border-slate-200 rounded-lg overflow-hidden">
          <ul className="divide-y divide-slate-50">
            {menuItems.map((item) => (
              <li key={item.id}>
                <MenuItemRow
                  item={item}
                  qty={getItemQty(item.id)}
                  onAdd={() => handleAdd(item)}
                  onRemove={() => handleRemove(item)}
                  maxReached={maxReached}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sticky cart CTA */}
      <div className="fixed bottom-16 left-0 right-0 z-30 px-4 pb-3 max-w-sm mx-auto">
        <div
          className={cn(
            'rounded-lg overflow-hidden transition-all duration-300',
            cartTotal > 0
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 pointer-events-none'
          )}
        >
          <button
            onClick={() => router.push('/creator/cart')}
            disabled={cartTotal === 0}
            className="w-full flex items-center justify-between px-5 py-3.5 bg-cc-accent hover:bg-cc-accent-dark active:bg-cc-accent-dark transition-colors rounded-lg"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="h-5 w-5 text-white" />
              <span className="bg-white/25 text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">
                {cartTotal}
              </span>
            </div>
            <span className="text-sm font-black text-white">View Order</span>
            <span className="text-sm font-black text-white/60">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
