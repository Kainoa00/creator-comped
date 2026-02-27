'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { isDemoMode } from '@/lib/supabase'
import { DEMO_RESTAURANTS } from '@/lib/demo-data'
import { MapPlaceholder } from './MapPlaceholder'
import { FullPageSpinner } from '@/components/ui/spinner'
import type { Restaurant } from '@/lib/types'

// Dynamically import the real map to avoid SSR hydration issues
const MapView = dynamic(
  () => import('./MapView').then((mod) => ({ default: mod.MapView })),
  {
    ssr: false,
    loading: () => <FullPageSpinner />,
  }
)

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''
const hasMapboxToken = Boolean(MAPBOX_TOKEN)

export default function DiscoverPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (isDemoMode) {
        setRestaurants(DEMO_RESTAURANTS)
      } else {
        // In production, fetch from Supabase
        setRestaurants(DEMO_RESTAURANTS) // fallback
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <FullPageSpinner />

  return (
    <div
      className="relative w-full"
      style={{ height: 'calc(100dvh - 64px)' }}
    >
      {hasMapboxToken ? (
        <MapView restaurants={restaurants} />
      ) : (
        <MapPlaceholder restaurants={restaurants} />
      )}
    </div>
  )
}
