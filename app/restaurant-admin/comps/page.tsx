'use client'

import { useState } from 'react'
import { FilterSelector } from '@/components/admin-ui/FilterSelector'
import { CheckCircle, Clock, XCircle, Instagram, Music2 } from 'lucide-react'

type FilterType = 'Month' | 'Year' | 'All time'

interface Comp {
  id: string
  creator: string
  date: string
  items: string[]
  value: number
  status: 'completed' | 'pending' | 'expired'
  instagram?: string
  tiktok?: string
}

const mockComps: Comp[] = [
  {
    id: '1',
    creator: '@foodie_sarah',
    date: 'Feb 28, 2026',
    items: ['Margherita Pizza', 'Caesar Salad', 'Tiramisu'],
    value: 42,
    status: 'completed',
    instagram: 'instagram.com/p/abc123',
    tiktok: 'tiktok.com/@foodie_sarah/video/123',
  },
  {
    id: '2',
    creator: '@tastemaker_mike',
    date: 'Feb 27, 2026',
    items: ['Carbonara', 'Bruschetta', 'Gelato'],
    value: 38,
    status: 'completed',
    instagram: 'instagram.com/p/def456',
    tiktok: 'tiktok.com/@tastemaker_mike/video/456',
  },
  {
    id: '3',
    creator: '@eats_with_emma',
    date: 'Feb 26, 2026',
    items: ['Quattro Formaggi', 'Caprese Salad'],
    value: 35,
    status: 'pending',
  },
  {
    id: '4',
    creator: '@chef_chronicles',
    date: 'Feb 25, 2026',
    items: ['Lasagna', 'Garlic Bread', 'Panna Cotta'],
    value: 45,
    status: 'completed',
    instagram: 'instagram.com/p/ghi789',
    tiktok: 'tiktok.com/@chef_chronicles/video/789',
  },
  {
    id: '5',
    creator: '@downtown_diner',
    date: 'Feb 24, 2026',
    items: ['Ravioli', 'House Salad'],
    value: 28,
    status: 'expired',
  },
]

const topItems = [
  { name: 'Margherita Pizza', count: 45 },
  { name: 'Caesar Salad', count: 38 },
  { name: 'Tiramisu', count: 32 },
  { name: 'Carbonara', count: 28 },
  { name: 'Bruschetta', count: 24 },
]

export default function CompsPage() {
  const [filter, setFilter] = useState<FilterType>('Month')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Comps</h1>
          <p className="text-white/70">All comps and redemption details</p>
        </div>
        <FilterSelector value={filter} onChange={setFilter} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Comps List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 grid grid-cols-12 gap-4 font-semibold text-sm text-white/70">
              <div className="col-span-3">Creator</div>
              <div className="col-span-3">Items</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Value</div>
              <div className="col-span-2">Status</div>
            </div>

            <div className="divide-y divide-white/5">
              {mockComps.map((comp) => (
                <div
                  key={comp.id}
                  className="p-4 hover:bg-white/5 transition grid grid-cols-12 gap-4 items-center"
                >
                  <div className="col-span-3">
                    <div className="font-semibold">{comp.creator}</div>
                    <div className="text-sm text-white/50 flex gap-2 mt-1">
                      {comp.instagram && (
                        <a
                          href={`https://${comp.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 hover:text-orange-400"
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}
                      {comp.tiktok && (
                        <a
                          href={`https://${comp.tiktok}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-400"
                        >
                          <Music2 className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="col-span-3">
                    <div className="text-sm">
                      {comp.items.map((item, i) => (
                        <div key={i} className="text-white/70">{item}</div>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2 text-sm text-white/70">{comp.date}</div>
                  <div className="col-span-2 font-semibold">${comp.value}</div>
                  <div className="col-span-2">
                    {comp.status === 'completed' && (
                      <div className="flex items-center gap-2 text-green-500">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Completed</span>
                      </div>
                    )}
                    {comp.status === 'pending' && (
                      <div className="flex items-center gap-2 text-yellow-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Pending</span>
                      </div>
                    )}
                    {comp.status === 'expired' && (
                      <div className="flex items-center gap-2 text-red-500">
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm">Expired</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top 5 Items */}
        <div className="space-y-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
            <h3 className="text-lg font-semibold mb-4">Top 5 Comped Items</h3>
            <div className="space-y-4">
              {topItems.map((item, index) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="font-medium">{item.name}</div>
                    </div>
                    <div className="font-semibold">{item.count}</div>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-blue-600 h-2 rounded-full"
                      style={{ width: `${(item.count / 45) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/70">Total Comps</span>
                <span className="font-semibold">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Completed</span>
                <span className="font-semibold text-green-500">142</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Pending</span>
                <span className="font-semibold text-yellow-500">9</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Expired</span>
                <span className="font-semibold text-red-500">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
