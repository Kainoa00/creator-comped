'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, MessageSquare } from 'lucide-react'
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
        className="w-11 h-6 rounded-full relative transition-colors outline-none cursor-pointer bg-[#2a2a2a]"
        style={checked ? { background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' } : undefined}
      >
        <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-200 translate-x-0.5 data-[state=checked]:translate-x-[22px] shadow-sm" />
      </Switch.Root>
    </div>
  )
}

export default function NotificationsPage() {
  const router = useRouter()
  const [push, setPush] = useState(true)
  const [email, setEmail] = useState(true)
  const [proofReminder, setProofReminder] = useState(true)
  const [compAlert, setCompAlert] = useState(true)
  const [approvalUpdate, setApprovalUpdate] = useState(true)
  const [leaderboard, setLeaderboard] = useState(false)

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white max-w-[430px] mx-auto">
      <header className="px-4 pt-14 pb-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#1a1a1a] active:bg-[#252525] transition-colors">
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white flex-1">Notifications</h1>
        <button
          onClick={() => router.push('/profile/notifications/feed')}
          className="text-xs font-semibold text-gray-400 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2 hover:border-white/20 transition-colors"
        >
          View Feed
        </button>
      </header>

      <div className="px-4 pb-28 space-y-4">
        {/* Delivery channels */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <Bell className="h-4 w-4 text-gray-500" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Delivery</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden divide-y divide-[#2a2a2a]">
            <ToggleRow label="Push Notifications" description="Real-time alerts on your device" checked={push} onChange={setPush} />
            <ToggleRow label="Email Notifications" description="Summary emails for important updates" checked={email} onChange={setEmail} />
          </div>
        </div>

        {/* Event types */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <MessageSquare className="h-4 w-4 text-gray-500" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Alert Types</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden divide-y divide-[#2a2a2a]">
            <ToggleRow label="New Comp Alerts" description="When a restaurant near you opens a slot" checked={compAlert} onChange={setCompAlert} />
            <ToggleRow label="Proof Reminders" description="48h posting deadline approaching" checked={proofReminder} onChange={setProofReminder} />
            <ToggleRow label="Approval Updates" description="When your proof is reviewed" checked={approvalUpdate} onChange={setApprovalUpdate} />
            <ToggleRow label="Leaderboard Updates" description="Monthly rankings and contest results" checked={leaderboard} onChange={setLeaderboard} />
          </div>
        </div>
      </div>
    </div>
  )
}
