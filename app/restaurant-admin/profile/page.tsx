'use client'

import { useState, useMemo } from 'react'
import { DarkHeader } from '@/components/restaurant-ui/DarkHeader'
import { Upload, Lock, MapPin, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSaveFlash } from '@/lib/hooks/useSaveFlash'

export default function EditProfilePage() {
  const [description, setDescription] = useState(
    'Welcome to our restaurant! We serve authentic Italian cuisine with fresh, locally-sourced ingredients.'
  )
  const [address, setAddress] = useState('123 Main Street, City, State 12345')
  // null = not editing; string = user is actively typing a search
  const [addressSearch, setAddressSearch] = useState<string | null>(null)
  const { saved, flash: handleSave } = useSaveFlash()

  const suggestions = useMemo(() =>
    addressSearch !== null
      ? [
          '123 Main Street, City, State 12345',
          '456 Oak Avenue, City, State 12345',
          '789 Pine Road, City, State 12345',
        ].filter((a) => a.toLowerCase().includes(addressSearch.toLowerCase()))
      : [],
    [addressSearch]
  )

  return (
    <div className="px-4 pt-6 pb-20">
      <DarkHeader title="Edit Profile" subtitle="Restaurant information" />

      {/* Logo Upload */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Logo</p>
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 mb-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.08] border border-dashed border-white/20 flex items-center justify-center shrink-0">
          <Upload className="h-6 w-6 text-white/30" />
        </div>
        <div>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600 text-white text-sm font-semibold">
            Upload Logo
          </button>
          <p className="text-xs text-white/30 mt-1.5">512×512px, PNG or JPG</p>
        </div>
      </div>

      {/* Locked Fields */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Restaurant Info</p>
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.05] mb-4">
        {[
          { label: 'Restaurant Name', value: 'Restaurant Name' },
          { label: 'Phone', value: '(555) 123-4567' },
          { label: 'Email', value: 'contact@restaurant.com' },
          { label: 'Website', value: 'https://restaurant.com' },
        ].map(({ label, value }) => (
          <div key={label} className="px-4 py-3.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-white/40 mb-0.5">{label}</p>
              <p className="text-sm text-white/60 truncate">{value}</p>
            </div>
            <Lock className="h-4 w-4 text-white/20 shrink-0" />
          </div>
        ))}
      </div>

      {/* Address */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Address</p>
      <div className="relative mb-4">
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            type="text"
            value={addressSearch ?? address}
            onChange={(e) => setAddressSearch(e.target.value)}
            onFocus={() => setAddressSearch(address)}
            onBlur={() => setAddressSearch(null)}
            aria-label="Restaurant address"
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20"
            placeholder="Search for address..."
          />
        </div>
        {suggestions.length > 0 && (
          <div className="absolute w-full mt-2 bg-[#1a1a1a] border border-white/[0.08] rounded-2xl shadow-xl z-20 overflow-hidden">
            {suggestions.map((addr) => (
              <button
                key={addr}
                onMouseDown={(e) => e.preventDefault()} // prevent input blur before click
                onClick={() => { setAddress(addr); setAddressSearch(null) }}
                className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/[0.05] last:border-b-0 flex items-center gap-3"
              >
                <MapPin className="h-4 w-4 text-white/30 shrink-0" />
                <span className="text-sm text-white">{addr}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Description</p>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        className="w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 resize-none mb-4"
        placeholder="Tell creators about your restaurant..."
      />

      {/* Support Notice */}
      <div className="bg-blue-500/[0.08] border border-blue-500/20 rounded-2xl p-4 mb-5 flex gap-3">
        <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs text-white/60 leading-relaxed">
          <strong className="text-white/80">Locked fields?</strong> Email{' '}
          <a href="mailto:support@creatorcomped.com" className="text-orange-400">
            support@creatorcomped.com
          </a>{' '}
          to update name, phone, email, or website.
        </p>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className={cn(
          'w-full py-4 rounded-2xl text-white font-bold text-sm transition-all',
          saved
            ? 'bg-emerald-500'
            : 'bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600'
        )}
      >
        {saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  )
}
