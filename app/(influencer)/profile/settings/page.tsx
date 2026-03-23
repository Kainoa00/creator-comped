'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, Mail, Lock, AlertTriangle } from 'lucide-react'
import * as Switch from '@radix-ui/react-switch'

function ToggleRow({ label, description, checked, onChange }: {
  label: string
  description?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between py-4 px-4">
      <div className="flex-1 min-w-0 mr-3">
        <p className="text-sm font-semibold text-white">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <Switch.Root
        checked={checked}
        onCheckedChange={onChange}
        className={`w-11 h-6 rounded-full relative transition-colors outline-none cursor-pointer ${checked ? '' : 'bg-[#2a2a2a]'}`}
        style={checked ? { background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' } : undefined}
      >
        <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-200 translate-x-0.5 data-[state=checked]:translate-x-[22px] shadow-sm" />
      </Switch.Root>
    </div>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const [newCompNotif, setNewCompNotif] = useState(true)
  const [proofReminder, setProofReminder] = useState(true)
  const [approvalNotif, setApprovalNotif] = useState(true)
  const [leaderboardNotif, setLeaderboardNotif] = useState(false)
  const [marketingNotif, setMarketingNotif] = useState(false)

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white max-w-[430px] mx-auto">
      {/* Header */}
      <header className="px-4 pt-14 pb-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#1a1a1a] transition-colors">
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </header>

      <div className="px-4 pb-28 space-y-4">
        {/* Notifications */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <Bell className="h-4 w-4 text-gray-500" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Notifications</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden divide-y divide-[#2a2a2a]">
            <ToggleRow label="New Comp Available" description="When a restaurant near you opens a slot" checked={newCompNotif} onChange={setNewCompNotif} />
            <ToggleRow label="Proof Reminders" description="48h posting deadline approaching" checked={proofReminder} onChange={setProofReminder} />
            <ToggleRow label="Approval Updates" description="When your proof is approved or rejected" checked={approvalNotif} onChange={setApprovalNotif} />
            <ToggleRow label="Leaderboard Updates" description="Monthly rankings and results" checked={leaderboardNotif} onChange={setLeaderboardNotif} />
            <ToggleRow label="Promotions & Offers" description="Special deals and featured restaurants" checked={marketingNotif} onChange={setMarketingNotif} />
          </div>
        </div>

        {/* Account */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <Mail className="h-4 w-4 text-gray-500" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Account</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden divide-y divide-[#2a2a2a]">
            <div className="flex items-center justify-between px-4 py-4">
              <div>
                <p className="text-sm font-semibold text-white">Email</p>
                <p className="text-xs text-gray-500 mt-0.5">mia.tanaka@example.com</p>
              </div>
            </div>
            <button className="w-full flex items-center gap-3 px-4 py-4 hover:bg-white/5 transition-colors">
              <Lock className="h-4 w-4 text-gray-500 shrink-0" />
              <span className="text-sm font-semibold text-white">Change Password</span>
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <p className="text-xs font-semibold text-red-500 uppercase tracking-widest">Danger Zone</p>
          </div>
          <div className="bg-[#1a1a1a] border border-red-500/20 rounded-2xl overflow-hidden">
            <button className="w-full flex items-center px-4 py-4 hover:bg-red-500/5 transition-colors">
              <span className="text-sm font-semibold text-red-400">Delete Account</span>
            </button>
          </div>
        </div>

        {/* Version */}
        <p className="text-center text-xs text-gray-700 pt-2">HIVE v1.0.0</p>
      </div>
    </div>
  )
}
