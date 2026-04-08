'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DarkToggle } from '@/components/restaurant-ui/DarkToggle'
import { MapPin, ChevronRight, LogOut, AlertTriangle, Building2 } from 'lucide-react'
import Link from 'next/link'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { cn } from '@/lib/utils'
import { useSaveFlash } from '@/lib/hooks/useSaveFlash'
import { useAuth } from '@/lib/hooks/useAuth'
import { DEMO_RESTAURANTS } from '@/lib/demo-data'

type UserMode = 'admin' | 'staff'

const locations = DEMO_RESTAURANTS.map((r) => ({
  id: r.id,
  name: r.name,
  address: r.address,
  active: r.active,
}))

export default function BusinessSettingsPage() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [businessName, setBusinessName] = useState(DEMO_RESTAURANTS[0].name)
  const [address, setAddress] = useState(DEMO_RESTAURANTS[0].address)
  const [userMode, setUserMode] = useState<UserMode>('admin')
  const { saved, flash: handleSave } = useSaveFlash()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  return (
    <div className="px-4 pt-6 pb-8 max-w-2xl mx-auto w-full">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-8 p-5 bg-white/[0.04] border border-white/[0.08] rounded-2xl">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#4A90E2] flex items-center justify-center shrink-0">
          <Building2 className="h-7 w-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-white truncate">{DEMO_RESTAURANTS[0].name}</p>
          <p className="text-xs text-white/40 truncate mt-0.5">{user?.email}</p>
          <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#FF6B35]/20 to-[#4A90E2]/20 border border-white/10 text-white/60 uppercase tracking-wider">
            Business Owner
          </span>
        </div>
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
          { label: 'Terms of Service', href: '/terms' },
          { label: 'Privacy Policy', href: '/privacy' },
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

      {/* Sign Out */}
      <button
        onClick={async () => {
          await signOut()
          router.replace('/login')
        }}
        className="w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl flex items-center justify-center gap-2 px-4 py-4 hover:bg-white/[0.08] active:bg-white/10 transition-colors mb-4"
      >
        <LogOut className="h-4 w-4 text-white/50" />
        <span className="text-sm font-semibold text-white/50">Sign Out</span>
      </button>

      {/* Danger Zone */}
      <div className="mb-6">
        <p className="text-xs text-red-500 uppercase tracking-widest font-medium mb-3 flex items-center gap-2">
          <AlertTriangle className="h-3.5 w-3.5" />
          Danger Zone
        </p>
        <div className="bg-white/[0.03] border border-red-500/20 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="w-full flex items-center px-4 py-4 hover:bg-red-500/5 active:bg-red-500/10 transition-colors"
          >
            <span className="text-sm font-semibold text-red-400">Delete Account</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-white/20 pb-8">HIVE Business v1.0.0</p>

      {/* Delete Account Dialog */}
      <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
          <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
            <AlertDialog.Title className="text-lg font-bold text-white">
              Delete Account?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-sm text-gray-400 mt-2 leading-relaxed">
              This will permanently delete your business account and all associated data. This action cannot be undone.
            </AlertDialog.Description>
            <div className="flex gap-3 mt-6">
              <AlertDialog.Cancel asChild>
                <button className="flex-1 py-3 rounded-xl text-sm font-semibold bg-[#252525] text-white border border-[#2a2a2a]">
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  onClick={async () => {
                    setDeleting(true)
                    await signOut()
                    router.replace('/login')
                  }}
                  disabled={deleting}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold bg-red-500 text-white disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  )
}
