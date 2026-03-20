'use client'

import { useState, useRef, useEffect } from 'react'
import { DarkHeader } from '@/components/restaurant-ui/DarkHeader'
import { DarkToggle } from '@/components/restaurant-ui/DarkToggle'
import { Shield, Bell, Clock, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSaveFlash } from '@/lib/hooks/useSaveFlash'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    newCompAlert: true,
    dailyDigest: false,
    weeklyReport: true,
    autoApprove: false,
    requireProof: true,
  })
  const [cooldown, setCooldown] = useState(30)
  const [dailyCap, setDailyCap] = useState(10)
  const [currentPin, setCurrentPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [pinMsg, setPinMsg] = useState<{ text: string; error: boolean } | null>(null)
  const set = (field: keyof typeof settings, value: boolean) => setSettings({ ...settings, [field]: value })
  const pinMsgTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { saved, flash: handleSave } = useSaveFlash()

  useEffect(() => {
    return () => {
      if (pinMsgTimer.current) clearTimeout(pinMsgTimer.current)
    }
  }, [])

  const handleSavePin = () => {
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setPinMsg({ text: 'PIN must be exactly 4 digits.', error: true })
      return
    }
    if (newPin !== confirmPin) {
      setPinMsg({ text: 'PINs do not match.', error: true })
      return
    }
    // Note: currentPin field shown for UX consistency; server-side validation required in production
    setPinMsg({ text: 'PIN updated successfully.', error: false })
    setCurrentPin('')
    setNewPin('')
    setConfirmPin('')
    if (pinMsgTimer.current) clearTimeout(pinMsgTimer.current)
    pinMsgTimer.current = setTimeout(() => setPinMsg(null), 3000)
  }

  return (
    <div className="px-4 pt-6 pb-20">
      <DarkHeader title="Settings" subtitle="Account & preferences" />

      {/* Notifications */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3 flex items-center gap-2">
        <Bell className="h-3 w-3" /> Notifications
      </p>
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.05] mb-5">
        {(
          [
            { field: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
            { field: 'newCompAlert', label: 'New Comp Alerts', desc: 'Notify on every new redemption' },
            { field: 'dailyDigest', label: 'Daily Digest', desc: 'Daily summary at 8am' },
            { field: 'weeklyReport', label: 'Weekly Report', desc: 'Performance report every Monday' },
          ] as { field: keyof typeof settings; label: string; desc: string }[]
        ).map(({ field, label, desc }) => (
          <div key={field} className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs text-white/40 mt-0.5">{desc}</p>
            </div>
            <DarkToggle
              checked={settings[field]}
              onChange={(v) => set(field, v)}
            />
          </div>
        ))}
      </div>

      {/* Comp Rules */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3 flex items-center gap-2">
        <Clock className="h-3 w-3" /> Comp Rules
      </p>
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.05] mb-5">
        <div className="flex items-center justify-between px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-white">Auto-Approve Comps</p>
            <p className="text-xs text-white/40 mt-0.5">Skip manual review for trusted creators</p>
          </div>
          <DarkToggle checked={settings.autoApprove} onChange={(v) => set('autoApprove', v)} />
        </div>
        <div className="flex items-center justify-between px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-white">Require Proof Submission</p>
            <p className="text-xs text-white/40 mt-0.5">Creators must submit post link/screenshot</p>
          </div>
          <DarkToggle checked={settings.requireProof} onChange={(v) => set('requireProof', v)} />
        </div>
        <div className="flex items-center justify-between px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-white">Creator Cooldown</p>
            <p className="text-xs text-white/40 mt-0.5">Days before same creator can redeem again</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="365"
              value={cooldown}
              onChange={(e) => setCooldown(parseInt(e.target.value) || 1)}
              className="w-14 bg-white/[0.08] border border-white/[0.08] rounded-xl px-2 py-1.5 text-sm text-white text-center focus:outline-none"
            />
            <span className="text-xs text-white/40">days</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-white">Daily Cap</p>
            <p className="text-xs text-white/40 mt-0.5">Max redemptions per day</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="100"
              value={dailyCap}
              onChange={(e) => setDailyCap(parseInt(e.target.value) || 1)}
              className="w-14 bg-white/[0.08] border border-white/[0.08] rounded-xl px-2 py-1.5 text-sm text-white text-center focus:outline-none"
            />
            <span className="text-xs text-white/40">/day</span>
          </div>
        </div>
      </div>

      {/* PIN Management */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3 flex items-center gap-2">
        <Shield className="h-3 w-3" /> Manager PIN
      </p>
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 mb-5">
        <div className="flex flex-col gap-3">
          {[
            { label: 'Current PIN', value: currentPin, setter: setCurrentPin },
            { label: 'New PIN (4 digits)', value: newPin, setter: setNewPin },
            { label: 'Confirm New PIN', value: confirmPin, setter: setConfirmPin },
          ].map(({ label, value, setter }) => (
            <div key={label}>
              <p className="text-xs text-white/40 mb-1.5">{label}</p>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={value}
                onChange={(e) => setter(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 tracking-widest"
                placeholder="••••"
              />
            </div>
          ))}
          {pinMsg && (
            <p className={cn('text-xs text-center font-medium', pinMsg.error ? 'text-red-400' : 'text-emerald-400')}>
              {pinMsg.text}
            </p>
          )}
          <button
            type="button"
            onClick={handleSavePin}
            className="w-full py-2.5 rounded-xl bg-white/[0.08] text-white text-sm font-semibold hover:bg-white/[0.12] transition-colors"
          >
            Update PIN
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3 flex items-center gap-2">
        <AlertTriangle className="h-3 w-3 text-red-400" />
        <span className="text-red-400/60">Danger Zone</span>
      </p>
      <div className="bg-red-500/[0.05] border border-red-500/20 rounded-2xl divide-y divide-red-500/10 mb-5">
        {[
          { label: 'Reset All Settings', desc: 'Restore defaults for comp rules and notifications', action: 'Reset' },
          { label: 'Delete Account', desc: 'Permanently remove your restaurant and all data', action: 'Delete' },
        ].map(({ label, desc, action }) => (
          <div key={label} className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="text-sm font-semibold text-red-400">{label}</p>
              <p className="text-xs text-red-400/50 mt-0.5">{desc}</p>
            </div>
            <button className="px-3 py-1.5 rounded-xl border border-red-500/30 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors">
              {action}
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className={cn(
          'w-full py-4 rounded-2xl text-white font-bold text-sm transition-all',
          saved
            ? 'bg-emerald-500'
            : 'bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600'
        )}
      >
        {saved ? 'Saved!' : 'Save Settings'}
      </button>
    </div>
  )
}
