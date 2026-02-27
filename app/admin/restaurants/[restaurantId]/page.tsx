'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Modal, ModalFooter } from '@/components/ui/modal'
import { useToast } from '@/components/ui/toast'
import {
  DEMO_RESTAURANTS,
  DEMO_ORDERS,
  DEMO_PROOF_SUBMISSIONS,
  DEMO_CREATORS,
  getMenuItemsForRestaurant,
  getDeliverableForRestaurant,
} from '@/lib/demo-data'
import { relativeTime, formatDate, formatTime, formatNumber } from '@/lib/utils'
import type { RestaurantSettings } from '@/lib/types'
import {
  ArrowLeft,
  MapPin,
  Edit,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight,
  Pause,
  Play,
  Clock,
  Package,
  Hash,
  Gift,
  CheckCircle2,
  Save,
} from 'lucide-react'

const DAYS_SHORT = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
const DAYS_LABEL: Record<string, string> = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu',
  fri: 'Fri', sat: 'Sat', sun: 'Sun',
}

export default function RestaurantDetailPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>()
  const router = useRouter()
  const { toast } = useToast()

  const restaurant = DEMO_RESTAURANTS.find((r) => r.id === restaurantId) ?? DEMO_RESTAURANTS[0]
  const menuItems = getMenuItemsForRestaurant(restaurant.id)
  const deliverable = getDeliverableForRestaurant(restaurant.id)

  const recentOrders = DEMO_ORDERS
    .filter((o) => o.restaurant_id === restaurant.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  const totalComps = DEMO_ORDERS.filter(
    (o) => o.restaurant_id === restaurant.id && o.status === 'confirmed'
  ).length
  const weekComps = DEMO_ORDERS.filter((o) => {
    const isThisRestaurant = o.restaurant_id === restaurant.id
    const isConfirmed = o.status === 'confirmed' || o.status === 'approved'
    const isThisWeek =
      o.confirmed_at &&
      Date.now() - new Date(o.confirmed_at).getTime() < 7 * 24 * 3600 * 1000
    return isThisRestaurant && isConfirmed && isThisWeek
  }).length

  const [showEditModal, setShowEditModal] = useState(false)
  const [pinRevealed, setPinRevealed] = useState(false)
  const [isActive, setIsActive] = useState(restaurant.active)
  const [isPaused, setIsPaused] = useState(restaurant.settings.pause_comps)
  const [loading, setLoading] = useState(false)

  const [editSettings, setEditSettings] = useState<RestaurantSettings>({
    ...restaurant.settings,
  })

  async function handleSaveSettings() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    setShowEditModal(false)
    setLoading(false)
    toast({ type: 'success', title: 'Settings Updated', message: 'Restaurant settings have been saved.' })
  }

  function toggleActive() {
    setIsActive((v) => !v)
    toast({
      type: isActive ? 'error' : 'success',
      title: isActive ? 'Restaurant Deactivated' : 'Restaurant Activated',
      message: `${restaurant.name} is now ${isActive ? 'inactive' : 'active'}.`,
    })
  }

  function togglePause() {
    setIsPaused((v) => !v)
    toast({
      type: isPaused ? 'success' : 'warning',
      title: isPaused ? 'Comps Resumed' : 'Comps Paused',
      message: `${restaurant.name} comps are now ${isPaused ? 'open' : 'paused'}.`,
    })
  }

  return (
    <div className="px-8 py-6">
      {/* Header */}
      <div className="border-b border-slate-100 pb-5 -mx-8 px-8 mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-900">{restaurant.name}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <p className="text-sm text-slate-400">{restaurant.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-slate-300'}`} />
              <span className={`text-sm font-medium ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            {isPaused && (
              <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full">
                Comps Paused
              </span>
            )}
            <Button
              variant={isPaused ? 'success' : 'secondary'}
              size="sm"
              leftIcon={isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              onClick={togglePause}
            >
              {isPaused ? 'Resume Comps' : 'Pause Comps'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Edit className="h-4 w-4" />}
              onClick={() => setShowEditModal(true)}
            >
              Edit Settings
            </Button>
            <button
              onClick={toggleActive}
              className="flex items-center"
              title={isActive ? 'Deactivate' : 'Activate'}
            >
              {isActive ? (
                <ToggleRight className="h-7 w-7 text-emerald-500" />
              ) : (
                <ToggleLeft className="h-7 w-7 text-slate-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Left Column */}
        <div className="col-span-2 space-y-4">
          {/* Restaurant info card */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">Details</h2>

            <div className="space-y-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Coordinates</span>
                <span className="text-sm font-mono text-slate-700">{restaurant.lat}, {restaurant.lng}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Added</span>
                <span className="text-sm text-slate-700">{formatDate(restaurant.created_at)}</span>
              </div>
            </div>

            {/* Manager PIN */}
            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Manager PIN</span>
                <button
                  onClick={() => setPinRevealed((v) => !v)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {pinRevealed ? (
                    <><EyeOff className="h-3.5 w-3.5" /> Hide</>
                  ) : (
                    <><Eye className="h-3.5 w-3.5" /> Reveal</>
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 text-white rounded-xl px-4 py-3">
                <span className="font-mono text-base tracking-[0.3em] font-bold">
                  {pinRevealed ? restaurant.manager_pin : '•'.repeat(restaurant.manager_pin.length)}
                </span>
              </div>
            </div>
          </div>

          {/* Settings card */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Settings</h2>

            <div className="space-y-3">
              {[
                {
                  label: 'Daily Comp Cap',
                  value: restaurant.settings.daily_comp_cap != null
                    ? `${restaurant.settings.daily_comp_cap} comps/day`
                    : 'Unlimited',
                },
                {
                  label: 'Max Items / Order',
                  value: `${restaurant.settings.max_items_per_order} items`,
                },
                {
                  label: 'Cooldown Period',
                  value: `${restaurant.settings.cooldown_days} days`,
                },
                {
                  label: 'Blackout Hours',
                  value:
                    restaurant.settings.blackout_start && restaurant.settings.blackout_end
                      ? `${restaurant.settings.blackout_start} – ${restaurant.settings.blackout_end}`
                      : 'None',
                },
                {
                  label: 'Comps Status',
                  value: isPaused ? 'Paused' : 'Open',
                  badge: true,
                  variant: isPaused ? 'warning' : 'success',
                },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{row.label}</span>
                  {row.badge ? (
                    <Badge variant={row.variant as 'warning' | 'success'} size="sm">{row.value}</Badge>
                  ) : (
                    <span className="text-sm font-medium text-slate-700">{row.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Hours */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              Hours
            </h2>
            <div className="space-y-1.5">
              {DAYS_SHORT.map((day) => {
                const hours = restaurant.hours[day]
                return (
                  <div key={day} className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 w-8">{DAYS_LABEL[day]}</span>
                    {hours.closed ? (
                      <span className="text-red-400 text-xs font-medium">Closed</span>
                    ) : (
                      <span className="text-slate-700 font-mono text-xs">{hours.open} – {hours.close}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-3 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Comps This Week', value: weekComps, iconBg: 'bg-blue-50', iconColor: 'text-cc-accent', icon: <Gift className="h-5 w-5" /> },
              { label: 'Comps All Time', value: totalComps, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', icon: <CheckCircle2 className="h-5 w-5" /> },
              { label: 'Menu Items', value: menuItems.length, iconBg: 'bg-violet-50', iconColor: 'text-violet-500', icon: <Package className="h-5 w-5" /> },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${stat.iconBg} ${stat.iconColor} mb-3`}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-400 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Menu Items */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
              <Package className="h-4 w-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-900">Menu Items</h2>
              <span className="text-xs text-slate-400 font-medium bg-slate-50 border border-slate-100 rounded-full px-2 py-0.5 ml-1">
                {menuItems.length}
              </span>
            </div>
            {menuItems.length === 0 ? (
              <p className="text-sm text-slate-400 px-5 py-8 text-center">No menu items configured.</p>
            ) : (
              <ul>
                {menuItems.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 px-5 py-3 border-b border-slate-50 last:border-0">
                    <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      <Package className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                      {item.description && (
                        <p className="text-xs text-slate-400 truncate">{item.description}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-slate-400">Max qty</p>
                      <p className="text-sm font-mono text-slate-700">{item.max_qty_per_order}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                      item.active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      {item.active ? 'Active' : 'Off'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Deliverable Requirements */}
          {deliverable && (
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Hash className="h-4 w-4 text-slate-400" />
                Deliverable Requirements
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Platform Type</span>
                  <Badge variant="info">{deliverable.allowed_types}</Badge>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block mb-2">Required Hashtags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {deliverable.required_hashtags.map((h) => (
                      <span key={h} className="text-xs bg-slate-100 rounded-full px-2.5 py-1 text-cc-accent font-mono">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block mb-2">Required Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {deliverable.required_tags.map((t) => (
                      <span key={t} className="text-xs bg-slate-100 rounded-full px-2.5 py-1 text-blue-500 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Redemptions */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
              <Gift className="h-4 w-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-900">Recent Redemptions</h2>
            </div>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-slate-400 px-5 py-8 text-center">No redemptions yet.</p>
            ) : (
              <ul>
                {recentOrders.map((order) => {
                  const creator = DEMO_CREATORS.find((c) => c.id === order.creator_id)
                  return (
                    <li key={order.id} className="flex items-center gap-4 px-5 py-3 border-b border-slate-50 last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">{creator?.name ?? 'Unknown Creator'}</p>
                        <p className="text-xs text-slate-400">
                          {order.items.map((i) => i.menu_item_name).join(', ')}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-slate-400">{relativeTime(order.created_at)}</p>
                        <Badge
                          variant={
                            order.status === 'approved' ? 'success' :
                            order.status === 'rejected' ? 'error' :
                            order.status === 'confirmed' ? 'accent' :
                            'warning'
                          }
                          size="sm"
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Edit Settings Modal */}
      <Modal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Restaurant Settings"
        description={restaurant.name}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Daily Comp Cap
              </label>
              <input
                type="number"
                min="0"
                value={editSettings.daily_comp_cap ?? ''}
                onChange={(e) =>
                  setEditSettings((s) => ({
                    ...s,
                    daily_comp_cap: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                placeholder="Unlimited"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cc-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Max Items / Order
              </label>
              <input
                type="number"
                min="1"
                value={editSettings.max_items_per_order}
                onChange={(e) =>
                  setEditSettings((s) => ({ ...s, max_items_per_order: Number(e.target.value) }))
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cc-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Cooldown (days)
            </label>
            <input
              type="number"
              min="0"
              value={editSettings.cooldown_days}
              onChange={(e) =>
                setEditSettings((s) => ({ ...s, cooldown_days: Number(e.target.value) }))
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cc-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Blackout Start
              </label>
              <input
                type="time"
                value={editSettings.blackout_start ?? ''}
                onChange={(e) =>
                  setEditSettings((s) => ({ ...s, blackout_start: e.target.value || null }))
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cc-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Blackout End
              </label>
              <input
                type="time"
                value={editSettings.blackout_end ?? ''}
                onChange={(e) =>
                  setEditSettings((s) => ({ ...s, blackout_end: e.target.value || null }))
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cc-accent"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-sm font-medium text-slate-700">Pause Comps</span>
            <button
              onClick={() => setEditSettings((s) => ({ ...s, pause_comps: !s.pause_comps }))}
              className="flex items-center"
            >
              {editSettings.pause_comps ? (
                <ToggleRight className="h-7 w-7 text-amber-500" />
              ) : (
                <ToggleLeft className="h-7 w-7 text-slate-300" />
              )}
            </button>
          </div>
        </div>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button
            variant="primary"
            loading={loading}
            onClick={handleSaveSettings}
            leftIcon={<Save className="h-4 w-4" />}
          >
            Save Settings
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
