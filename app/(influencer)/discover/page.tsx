'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, ChevronRight, ShoppingCart } from 'lucide-react'
import { supabase, isDemoMode } from '@/lib/supabase'
import { DEMO_RESTAURANTS } from '@/lib/demo-data'
import { useCartStore } from '@/lib/stores/cart-store'
import { FullPageSpinner } from '@/components/ui/spinner'
import type { Restaurant } from '@/lib/types'

const MapView = dynamic(
  () => import('@/components/map/MapView').then((mod) => ({ default: mod.MapView })),
  { ssr: false, loading: () => <FullPageSpinner /> }
)

const MapPlaceholder = dynamic(
  () => import('@/components/map/MapPlaceholder').then((mod) => ({ default: mod.MapPlaceholder })),
  { ssr: false }
)

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''
const hasMapboxToken = Boolean(MAPBOX_TOKEN)

function isOpenNow(restaurant: Restaurant): boolean {
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
  const key = days[new Date().getDay()]
  const h = restaurant.hours[key]
  if (!h || h.closed) return false
  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const [oh, om] = h.open.split(':').map(Number)
  const [ch, cm] = h.close.split(':').map(Number)
  return nowMin >= oh * 60 + om && nowMin < ch * 60 + cm
}

export default function DiscoverPage() {
  const router = useRouter()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const { totalItems, restaurant: cartRestaurant } = useCartStore()
  const cartCount = totalItems()

  useEffect(() => {
    async function loadRestaurants() {
      if (isDemoMode || !supabase) {
        setRestaurants(DEMO_RESTAURANTS)
        setLoading(false)
        return
      }
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .order('name')
        if (error || !data?.length) {
          setRestaurants(DEMO_RESTAURANTS)
        } else {
          setRestaurants(data as Restaurant[])
        }
      } catch {
        setRestaurants(DEMO_RESTAURANTS)
      }
      setLoading(false)
    }
    loadRestaurants()
  }, [])

  if (loading) return <FullPageSpinner />

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white">
      {/* Header */}
      <div className="px-4 pt-14 pb-4 flex items-center justify-between max-w-[430px] mx-auto">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hive-logo.svg" alt="" className="w-9 h-9" />
          <div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              HIVE
            </h1>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-400">Provo, UT</span>
            </div>
          </div>
        </div>
        {cartCount > 0 && (
          <button
            onClick={() => router.push('/cart')}
            aria-label={`View cart with ${cartCount} items`}
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-[#2a2a2a]"
          >
            <ShoppingCart className="h-4 w-4 text-white" />
            <span
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
              style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
            >
              {cartCount}
            </span>
          </button>
        )}
      </div>

      {/* Map */}
      <div className="relative mx-4 rounded-2xl overflow-hidden" style={{ height: '240px' }}>
        {hasMapboxToken ? (
          <MapView restaurants={restaurants} basePath="/discover" />
        ) : (
          <MapPlaceholder restaurants={restaurants} basePath="/discover" />
        )}
      </div>

      {/* Restaurant list */}
      <div className="max-w-[430px] mx-auto px-4 pt-5 pb-28">
        <h2 className="text-white text-2xl font-bold mb-4">Restaurants</h2>
        <div className="space-y-3">
          {restaurants.map((r) => {
            const open = isOpenNow(r)
            const isCartRest = cartRestaurant?.id === r.id && cartCount > 0
            return (
              <button
                key={r.id}
                onClick={() => router.push(`/discover/${r.id}`)}
                className="w-full bg-[#1a1a1a] rounded-2xl p-4 flex items-center gap-3 border border-[#2a2a2a] hover:border-white/20 transition-colors text-left"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #4A90E2 100%)' }}
                >
                  <span className="text-lg">🍽️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{r.name}</p>
                  <p className="text-gray-500 text-xs truncate mt-0.5">{r.address}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${open ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${open ? 'bg-green-400' : 'bg-gray-600'}`} />
                      {open ? 'Open' : 'Closed'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-white/10 text-gray-400 px-2 py-0.5 rounded-full">
                      {r.settings.daily_comp_cap} comps/day
                    </span>
                    {isCartRest && (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                        style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
                      >
                        {cartCount} in cart
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-600 shrink-0" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
