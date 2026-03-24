'use client'

export function generateStaticParams() { return [] }

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
  Instagram,
  Music2,
  Zap,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { isInBlackout } from '@/lib/utils'
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
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday',
  fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
}

function getTodayKey() {
  return DAY_KEYS[new Date().getDay()]
}

function isOpenNow(r: Restaurant): boolean {
  const key = getTodayKey()
  const h = r.hours[key]
  if (!h || h.closed) return false
  const now = new Date()
  const [oh, om] = h.open.split(':').map(Number)
  const [ch, cm] = h.close.split(':').map(Number)
  const nowMin = now.getHours() * 60 + now.getMinutes()
  return nowMin >= oh * 60 + om && nowMin < ch * 60 + cm
}

function formatHour(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

const FOOD_EMOJIS = ['🍜', '🥗', '🍕', '🍔', '🌮', '🍣', '🥩', '🍝', '🧆', '🍱']
function getFoodEmoji(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  return FOOD_EMOJIS[Math.abs(hash) % FOOD_EMOJIS.length]
}

// ── Deliverable box ───────────────────────────────────────────

function DeliverableBox({ type }: { type: DeliverableType }) {
  const config: Record<DeliverableType, { icon: React.ReactNode; label: string }> = {
    IG_REEL: { icon: <Instagram className="h-4 w-4 text-pink-400" />, label: '1 Instagram Reel within 48 hours' },
    TIKTOK: { icon: <Music2 className="h-4 w-4 text-gray-400" />, label: '1 TikTok Video within 48 hours' },
    CHOICE: { icon: <CheckCircle2 className="h-4 w-4 text-gray-400" />, label: '1 IG Reel OR TikTok within 48 hours' },
    BOTH: { icon: <Zap className="h-4 w-4 text-yellow-400" />, label: 'IG Reel AND TikTok both required' },
  }
  const { icon, label } = config[type]
  return (
    <div className="bg-[#252525] border border-[#2a2a2a] rounded-2xl p-4 flex items-start gap-3">
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">Failure to post = strike + account block</p>
      </div>
    </div>
  )
}

// ── Menu Item Card ────────────────────────────────────────────

function MenuItemCard({
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
  const atMax = qty >= item.max_qty_per_order
  const emoji = getFoodEmoji(item.id)

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-4 flex items-center gap-3 border border-[#2a2a2a]">
      <div className="w-14 h-14 rounded-xl bg-[#252525] flex items-center justify-center shrink-0">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-xl" />
        ) : (
          <span className="text-2xl">{emoji}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white">{item.name}</p>
        {item.description && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>
        )}
        {item.max_qty_per_order > 1 && (
          <p className="text-[10px] text-gray-600 mt-0.5">Max {item.max_qty_per_order}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {qty > 0 ? (
          <>
            <button
              onClick={onRemove}
              className="w-8 h-8 rounded-full border border-[#2a2a2a] flex items-center justify-center text-gray-400 hover:border-white/20 active:scale-95 transition-all"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-5 text-center text-sm font-bold text-white tabular-nums">{qty}</span>
            <button
              onClick={onAdd}
              disabled={atMax || maxReached}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
              style={atMax || maxReached ? { background: '#2a2a2a' } : { background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
            >
              <Plus className="h-3 w-3" />
            </button>
          </>
        ) : (
          <button
            onClick={onAdd}
            disabled={maxReached}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
            style={maxReached ? { background: '#2a2a2a' } : { background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
          >
            <Plus className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────

export default function RestaurantPage({ params }: { params: Promise<{ restaurantId: string }> }) {
  const { restaurantId } = use(params)
  const router = useRouter()
  const [showHours, setShowHours] = useState(false)
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
      const currentId = useCartStore.getState().restaurant?.id
      if (currentId && currentId !== restaurantId) clearCart()
      setCartRestaurant(r, deliv)
    }
  }, [restaurantId, setCartRestaurant, clearCart])

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center max-w-[430px] mx-auto">
        <div className="text-center px-4">
          <XCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
          <p className="text-white font-bold">Restaurant not found</p>
          <button onClick={() => router.back()} className="mt-4 text-sm text-[#FF6B35] font-bold">Go back</button>
        </div>
      </div>
    )
  }

  const openNow = isOpenNow(restaurant)
  const inBlackout = isInBlackout(restaurant.settings.blackout_start, restaurant.settings.blackout_end)
  const todayKey = getTodayKey()
  const todayHours = restaurant.hours[todayKey]
  const maxItems = restaurant.settings.max_items_per_order
  const cartTotal = totalItems()
  const maxReached = cartTotal >= maxItems

  const getItemQty = (itemId: string) => cartItems.find((ci) => ci.menu_item.id === itemId)?.qty ?? 0

  const handleAdd = (item: MenuItem) => {
    if (getItemQty(item.id) >= item.max_qty_per_order || maxReached) return
    addItem(item)
  }

  const handleRemove = (item: MenuItem) => {
    const qty = getItemQty(item.id)
    if (qty <= 1) removeItem(item.id)
    else updateQty(item.id, qty - 1)
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white flex flex-col max-w-[430px] mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#0B0B0D]/95 backdrop-blur-md border-b border-[#2a2a2a] px-4 pt-14 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#1a1a1a] transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-white truncate">{restaurant.name}</h1>
            <p className="text-xs text-gray-500 truncate">{restaurant.address}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-32 space-y-4 pt-4 px-4">
        {/* Status pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {restaurant.settings.pause_comps ? (
            <span className="inline-flex items-center gap-1.5 bg-red-500/20 text-red-400 text-xs font-semibold px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              Comps Paused
            </span>
          ) : openNow ? (
            <span className="inline-flex items-center gap-1.5 bg-green-500/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Open Now
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-white/10 text-gray-500 text-xs font-semibold px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
              Closed
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 bg-white/10 text-gray-400 text-xs font-semibold px-3 py-1 rounded-full">
            <Clock className="h-3 w-3" />
            {restaurant.settings.cooldown_days}d cooldown
          </span>
        </div>

        {/* Blackout warning */}
        {inBlackout && restaurant.settings.blackout_start && restaurant.settings.blackout_end && (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-3 flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-yellow-400 shrink-0" />
            <p className="text-xs text-gray-400">
              No comps during lunch rush ({formatHour(restaurant.settings.blackout_start)}–{formatHour(restaurant.settings.blackout_end)})
            </p>
          </div>
        )}

        {/* Hours */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowHours((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-4"
          >
            <div className="flex items-center gap-2.5">
              <span className={`w-2 h-2 rounded-full ${openNow ? 'bg-green-400' : 'bg-gray-600'}`} />
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-semibold text-white">
                Today: {todayHours?.closed ? 'Closed' : `${formatHour(todayHours?.open ?? '00:00')} – ${formatHour(todayHours?.close ?? '00:00')}`}
              </span>
            </div>
            {showHours ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
          </button>
          {showHours && (
            <div className="border-t border-[#2a2a2a] divide-y divide-[#2a2a2a]">
              {DAY_KEYS.map((day) => {
                const h = restaurant.hours[day]
                const isToday = day === todayKey
                return (
                  <div key={day} className={`flex items-center justify-between px-4 py-2.5 ${isToday ? 'bg-white/5' : ''}`}>
                    <span className={`text-xs font-semibold ${isToday ? 'text-[#FF6B35]' : 'text-gray-400'}`}>
                      {DAY_LABELS[day]}{isToday && <span className="ml-1.5 text-[10px] opacity-70">TODAY</span>}
                    </span>
                    <span className="text-xs text-gray-500">
                      {h.closed ? 'Closed' : `${formatHour(h.open)} – ${formatHour(h.close)}`}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Deliverable */}
        {deliverable && (
          <>
            <DeliverableBox type={deliverable.allowed_types} />
            {deliverable.required_hashtags.length > 0 && (
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-4">
                <p className="text-[10px] text-gray-500 mb-2.5 font-semibold uppercase tracking-widest">Required hashtags</p>
                <div className="flex flex-wrap gap-2">
                  {deliverable.required_hashtags.map((tag) => (
                    <span key={tag} className="text-xs bg-white/10 text-gray-300 rounded-lg px-2.5 py-1 font-medium">{tag}</span>
                  ))}
                </div>
                {deliverable.required_tags.length > 0 && (
                  <>
                    <p className="text-[10px] text-gray-500 mt-4 mb-2.5 font-semibold uppercase tracking-widest">Tag in post</p>
                    <div className="flex flex-wrap gap-2">
                      {deliverable.required_tags.map((tag) => (
                        <span key={tag} className="text-xs bg-white/10 text-gray-300 rounded-lg px-2.5 py-1 font-medium">{tag}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}

        {/* Menu header */}
        <div className="flex items-center justify-between">
          <h2 className="text-white text-2xl font-bold">Comped Menu</h2>
          <span className="text-xs text-gray-500 bg-white/10 rounded-lg px-2.5 py-1">Max {maxItems} item{maxItems !== 1 ? 's' : ''}</span>
        </div>

        {maxReached && (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-3 flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-yellow-400 shrink-0" />
            <p className="text-xs text-gray-400">Order limit reached — {maxItems} items max</p>
          </div>
        )}

        {/* Menu items */}
        <div className="space-y-3">
          {menuItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              qty={getItemQty(item.id)}
              onAdd={() => handleAdd(item)}
              onRemove={() => handleRemove(item)}
              maxReached={maxReached}
            />
          ))}
        </div>
      </div>

      {/* Sticky cart CTA */}
      <div className={`fixed bottom-24 left-0 right-0 z-30 px-4 max-w-[430px] mx-auto transition-all duration-300 ${cartTotal > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
        <button
          onClick={() => router.push('/cart')}
          disabled={cartTotal === 0}
          className="w-full flex items-center justify-between px-5 py-4 rounded-[18px] text-white font-bold"
          style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
        >
          <span className="bg-white/20 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">{cartTotal}</span>
          <span>View Order ({cartTotal} item{cartTotal !== 1 ? 's' : ''})</span>
          <span className="text-white/60">→</span>
        </button>
      </div>
    </div>
  )
}
