'use client'

import { useState } from 'react'
import { DarkToggle } from '@/components/restaurant-ui/DarkToggle'
import { ExternalLink, MapPin, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useSaveFlash } from '@/lib/hooks/useSaveFlash'
import { DEMO_RESTAURANTS } from '@/lib/demo-data'

type UserMode = 'admin' | 'staff'

const locations = DEMO_RESTAURANTS.map((r) => ({
  id: r.id,
  name: r.name,
  address: r.address,
  active: r.active,
}))

export default function BusinessSettingsPage() {
  const [businessName, setBusinessName] = useState(DEMO_RESTAURANTS[0].name)
  const [address, setAddress] = useState(DEMO_RESTAURANTS[0].address)
  const [userMode, setUserMode] = useState<UserMode>('admin')
  const { saved, flash: handleSave } = useSaveFlash()

  return (
    <div className="px-4 pt-6 pb-8 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="mb-5">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Business Dashboard</p>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-sm text-white/40 mt-0.5">Account & preferences</p>
      </div>

      {/* Business Information */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Business Information</p>
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.05] mb-5">
        <div className="px-4 py-4">
          <p className="text-xs text-white/40 mb-1.5">Business Name</p>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20"
          />
        </div>
        <div className="px-4 py-4">
          <p className="text-xs text-white/40 mb-1.5">Address</p>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20"
          />
        </div>
      </div>

      {/* User Mode */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">User Mode</p>
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 mb-5">
        <div className="flex gap-1 p-1 bg-white/[0.05] rounded-2xl">
          {(['admin', 'staff'] as UserMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setUserMode(mode)}
              className={cn(
                'flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all',
                userMode === mode ? 'text-white' : 'text-white/40 hover:text-white/60'
              )}
              style={userMode === mode ? { background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' } : {}}
            >
              {mode}
            </button>
          ))}
        </div>
        <p className="text-xs text-white/40 mt-3 text-center">
          {userMode === 'admin'
            ? 'Full access to all settings and reports'
            : 'Limited access — scanning and basic comps only'}
        </p>
      </div>

      {/* Locations */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Locations</p>
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.05] mb-5">
        {locations.map((loc) => (
          <div key={loc.id} className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-9 h-9 rounded-xl bg-white/[0.08] flex items-center justify-center shrink-0">
              <MapPin className="h-4 w-4 text-white/50" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{loc.name}</p>
              <p className="text-xs text-white/40 truncate mt-0.5">{loc.address}</p>
            </div>
            <span className={cn(
              'px-2 py-0.5 rounded-full text-xs font-semibold shrink-0',
              loc.active ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'
            )}>
              {loc.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        ))}
      </div>

      {/* Save */}
      <button
        type="button"
        onClick={handleSave}
        className={cn(
          'w-full py-4 rounded-2xl text-white font-bold text-sm transition-all mb-6',
          saved ? 'bg-emerald-500' : ''
        )}
        style={saved ? {} : { background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
      >
        {saved ? 'Saved!' : 'Save Changes'}
      </button>

      {/* Support & Legal */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Support & Legal</p>
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.05] mb-6">
        {[
          { label: 'Help & Support', href: '/dashboard/support' },
          { label: 'Terms of Service', href: '#' },
          { label: 'Privacy Policy', href: '#' },
        ].map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors"
          >
            <span className="text-sm text-white/70">{label}</span>
            <ChevronRight className="h-4 w-4 text-white/20" />
          </Link>
        ))}
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-white/20">HIVE v1.0.0 · Liaison Technologies</p>
    </div>
  )
}
