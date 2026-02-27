'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Search, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Restaurant } from '@/lib/types'

interface MapPlaceholderProps {
  restaurants: Restaurant[]
}

export function MapPlaceholder({ restaurants }: MapPlaceholderProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const filtered = restaurants.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase()) ||
    r.address.toLowerCase().includes(query.toLowerCase())
  )

  // Fake distance for demo display
  const fakeDistance = (index: number) => {
    const distances = ['0.3 mi', '0.7 mi', '1.1 mi', '1.4 mi', '2.0 mi']
    return distances[index % distances.length]
  }

  return (
    <div className="flex flex-col h-full bg-white max-w-sm mx-auto">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Discover</h1>
        <p className="text-sm text-slate-500 mt-0.5">Restaurants near you</p>
      </div>

      {/* Search bar */}
      <div className="px-5 pb-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search restaurants..."
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cc-accent transition-colors"
          />
        </div>
      </div>

      {/* Location pill */}
      <div className="px-5 pb-3">
        <div className="inline-flex items-center gap-1.5 border border-slate-200 rounded-full px-3 py-1">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Utah County</span>
        </div>
      </div>

      {/* Restaurant list */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-lg border border-slate-200 flex items-center justify-center mb-3">
              <Search className="h-6 w-6 text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No results</p>
            <p className="text-xs text-slate-400 mt-1">Try a different search</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filtered.map((r, i) => (
              <li key={r.id}>
                <button
                  onClick={() => router.push(`/creator/discover/${r.id}`)}
                  disabled={r.settings.pause_comps}
                  className={cn(
                    'w-full bg-white border border-slate-200 rounded-lg p-4',
                    'flex items-center gap-3 text-left transition-colors',
                    'hover:bg-slate-50',
                    r.settings.pause_comps && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{r.name}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{r.address}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-slate-400 font-medium">
                        {fakeDistance(i)}
                      </span>
                      {r.settings.pause_comps && (
                        <span className="border border-red-200 text-red-500 text-xs font-semibold rounded px-1.5 py-0.5">
                          Paused
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right action */}
                  <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
