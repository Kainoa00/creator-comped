'use client'

import { useState, useCallback } from 'react'
import Map, { Marker, Popup } from 'react-map-gl/mapbox'
import { useRouter } from 'next/navigation'
import { MapPin, ChevronRight, X } from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'
import { cn } from '@/lib/utils'
import type { Restaurant } from '@/lib/types'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

const INITIAL_VIEW = {
  latitude: 40.2338,
  longitude: -111.6588,
  zoom: 12,
}

interface MapViewProps {
  restaurants: Restaurant[]
}

function RestaurantMarker({
  restaurant,
  isSelected,
  onClick,
}: {
  restaurant: Restaurant
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border-2',
        'shadow-md bg-white',
        isSelected
          ? 'border-cc-accent scale-125 shadow-cc-accent/30'
          : 'border-cc-accent hover:scale-110 hover:shadow-cc-accent/20',
        restaurant.settings.pause_comps && 'opacity-40 border-slate-300'
      )}
      aria-label={`View ${restaurant.name}`}
    >
      <MapPin
        className={cn(
          'h-4 w-4',
          restaurant.settings.pause_comps ? 'text-slate-400' : 'text-cc-accent'
        )}
        strokeWidth={2.5}
        fill={isSelected ? 'rgba(92,142,191,0.15)' : 'none'}
      />
    </button>
  )
}

export function MapView({ restaurants }: MapViewProps) {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [viewState, setViewState] = useState(INITIAL_VIEW)

  const selectedRestaurant = restaurants.find((r) => r.id === selectedId) ?? null

  const handleMarkerClick = useCallback(
    (restaurant: Restaurant) => {
      setSelectedId(restaurant.id)
      setViewState((prev) => ({
        ...prev,
        latitude: restaurant.lat - 0.005,
        longitude: restaurant.lng,
        zoom: Math.max(prev.zoom, 13),
      }))
    },
    []
  )

  const handleDismiss = useCallback(() => {
    setSelectedId(null)
  }, [])

  const handleViewMenu = useCallback(
    (restaurantId: string) => {
      router.push(`/creator/discover/${restaurantId}`)
    },
    [router]
  )

  return (
    <div className="relative w-full h-full">
      {/* Floating location pill — top center */}
      <div className="absolute top-4 left-0 right-0 z-20 flex justify-center pointer-events-none">
        <div className="bg-white shadow-md border border-slate-100 rounded-full px-4 py-1.5 flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-cc-accent" />
          <span className="text-xs font-semibold text-slate-700">Utah County</span>
        </div>
      </div>

      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        reuseMaps
      >
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            latitude={restaurant.lat}
            longitude={restaurant.lng}
            anchor="center"
          >
            <RestaurantMarker
              restaurant={restaurant}
              isSelected={selectedId === restaurant.id}
              onClick={() => handleMarkerClick(restaurant)}
            />
          </Marker>
        ))}

        {selectedRestaurant && (
          <Popup
            latitude={selectedRestaurant.lat}
            longitude={selectedRestaurant.lng}
            anchor="top"
            onClose={handleDismiss}
            closeButton={false}
            closeOnClick={false}
            offset={25}
            className="mapbox-popup-override"
          >
            <div className="bg-white border border-slate-100 rounded-2xl p-3 w-56 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {selectedRestaurant.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {selectedRestaurant.address}
                  </p>
                </div>
                <button
                  onClick={handleDismiss}
                  className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {selectedRestaurant.settings.pause_comps ? (
                <div className="mt-2 text-xs text-red-500 font-medium bg-red-50 rounded-xl px-2 py-1">
                  Comps paused
                </div>
              ) : (
                <button
                  onClick={() => handleViewMenu(selectedRestaurant.id)}
                  className="w-full mt-2 bg-cc-accent text-white text-sm font-bold rounded-xl px-4 py-2 flex items-center justify-center gap-1 hover:bg-cc-accent-dark transition-colors"
                >
                  View Menu
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </Popup>
        )}
      </Map>

      {/* Bottom peek card when restaurant selected */}
      {selectedRestaurant && (
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pointer-events-none">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-md pointer-events-auto">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900 truncate">{selectedRestaurant.name}</p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  {selectedRestaurant.address}
                </p>
                {!selectedRestaurant.settings.pause_comps && (
                  <p className="text-xs text-emerald-600 font-semibold mt-1">
                    Comps available
                  </p>
                )}
              </div>
              <button
                onClick={() => handleViewMenu(selectedRestaurant.id)}
                disabled={selectedRestaurant.settings.pause_comps}
                className="bg-cc-accent text-white text-sm font-bold rounded-xl px-4 py-2 flex items-center gap-1 hover:bg-cc-accent-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                View
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
