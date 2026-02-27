'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Modal, ModalFooter } from '@/components/ui/modal'
import { useToast } from '@/components/ui/toast'
import { DEMO_RESTAURANTS, DEMO_ORDERS, getMenuItemsForRestaurant } from '@/lib/demo-data'
import {
  UtensilsCrossed,
  Plus,
  Search,
  MapPin,
  ToggleLeft,
  ToggleRight,
  Eye,
  Pause,
  Play,
} from 'lucide-react'

function getRestaurantStats(restaurantId: string) {
  const todayOrders = DEMO_ORDERS.filter(
    (o) =>
      o.restaurant_id === restaurantId &&
      o.confirmed_at &&
      new Date(o.confirmed_at).toDateString() === new Date().toDateString()
  )
  const menuItems = getMenuItemsForRestaurant(restaurantId)
  return { compsToday: todayOrders.length, menuItemCount: menuItems.length }
}

export default function RestaurantsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pausedMap, setPausedMap] = useState<Record<string, boolean>>(
    DEMO_RESTAURANTS.reduce((acc, r) => ({ ...acc, [r.id]: r.settings.pause_comps }), {})
  )
  const [activeMap, setActiveMap] = useState<Record<string, boolean>>(
    DEMO_RESTAURANTS.reduce((acc, r) => ({ ...acc, [r.id]: r.active }), {})
  )

  const [newName, setNewName] = useState('')
  const [newAddress, setNewAddress] = useState('')
  const [newLat, setNewLat] = useState('')
  const [newLng, setNewLng] = useState('')
  const [newPin, setNewPin] = useState('')

  const filtered = DEMO_RESTAURANTS.filter((r) =>
    search.trim()
      ? r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.address.toLowerCase().includes(search.toLowerCase())
      : true
  )

  function togglePause(restaurantId: string, name: string) {
    const isPaused = pausedMap[restaurantId]
    setPausedMap((prev) => ({ ...prev, [restaurantId]: !isPaused }))
    toast({
      type: isPaused ? 'success' : 'warning',
      title: isPaused ? 'Comps Resumed' : 'Comps Paused',
      message: `${name} is now ${isPaused ? 'accepting comps' : 'paused'}.`,
    })
  }

  function toggleActive(restaurantId: string, name: string) {
    const isActive = activeMap[restaurantId]
    setActiveMap((prev) => ({ ...prev, [restaurantId]: !isActive }))
    toast({
      type: isActive ? 'error' : 'success',
      title: isActive ? 'Restaurant Deactivated' : 'Restaurant Activated',
      message: `${name} has been ${isActive ? 'deactivated' : 'activated'}.`,
    })
  }

  async function handleAddRestaurant() {
    if (!newName || !newAddress || !newPin) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setShowAddModal(false)
    setNewName('')
    setNewAddress('')
    setNewLat('')
    setNewLng('')
    setNewPin('')
    setLoading(false)
    toast({ type: 'success', title: 'Restaurant Added', message: `${newName} has been added to the network.` })
  }

  return (
    <div className="px-8 py-6 space-y-5">
      {/* Header */}
      <div className="border-b border-slate-100 pb-5 -mx-8 px-8 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Restaurants</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Manage participating restaurants and their settings
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setShowAddModal(true)}
          >
            Add Restaurant
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search restaurants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cc-accent shadow-sm"
        />
      </div>

      {/* Restaurants Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Address</th>
              <th className="px-5 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Active</th>
              <th className="px-5 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Comps Today</th>
              <th className="px-5 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Menu Items</th>
              <th className="px-5 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Comps</th>
              <th className="px-5 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-14 w-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <UtensilsCrossed className="h-6 w-6 text-slate-300" />
                    </div>
                    <p className="font-semibold text-slate-900">No restaurants found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((restaurant) => {
                const { compsToday, menuItemCount } = getRestaurantStats(restaurant.id)
                const isActive = activeMap[restaurant.id]
                const isPaused = pausedMap[restaurant.id]
                const cap = restaurant.settings.daily_comp_cap

                return (
                  <tr
                    key={restaurant.id}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/admin/restaurants/${restaurant.id}`)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-cc-accent/10 border border-cc-accent/20 flex items-center justify-center shrink-0">
                          <UtensilsCrossed className="h-4 w-4 text-cc-accent" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{restaurant.name}</p>
                          {isPaused && (
                            <span className="text-xs text-amber-600">Comps paused</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="text-sm text-slate-500">{restaurant.address}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleActive(restaurant.id, restaurant.name)
                        }}
                        className="flex items-center justify-center mx-auto"
                        title={isActive ? 'Deactivate' : 'Activate'}
                      >
                        {isActive ? (
                          <ToggleRight className="h-6 w-6 text-emerald-500" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-slate-300" />
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-slate-900 font-mono">
                          {compsToday}
                          {cap ? <span className="text-slate-400 font-normal"> / {cap}</span> : null}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="font-mono text-slate-700">{menuItemCount}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                        <span className={`text-sm font-medium ${isPaused ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {isPaused ? 'Paused' : 'Active'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/admin/restaurants/${restaurant.id}`)
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="View / Edit"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            togglePause(restaurant.id, restaurant.name)
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isPaused
                              ? 'text-emerald-500 hover:bg-emerald-50'
                              : 'text-amber-500 hover:bg-amber-50'
                          }`}
                          title={isPaused ? 'Resume Comps' : 'Pause Comps'}
                        >
                          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Restaurant Modal */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Restaurant"
        description="Add a new restaurant to the CreatorComped network."
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Restaurant Name *
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Brick Oven Restaurant"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cc-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Address *
            </label>
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="111 E 800 N, Provo, UT 84606"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cc-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={newLat}
                onChange={(e) => setNewLat(e.target.value)}
                placeholder="40.2477"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cc-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={newLng}
                onChange={(e) => setNewLng(e.target.value)}
                placeholder="-111.6561"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cc-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Manager PIN *
            </label>
            <input
              type="password"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.slice(0, 6))}
              placeholder="4–6 digit PIN"
              maxLength={6}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cc-accent font-mono tracking-widest"
            />
          </div>
        </div>

        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button
            variant="primary"
            loading={loading}
            disabled={!newName || !newAddress || !newPin}
            onClick={handleAddRestaurant}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Restaurant
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
