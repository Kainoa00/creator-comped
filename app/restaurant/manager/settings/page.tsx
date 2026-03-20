'use client'

import { useState } from 'react'
import { DarkHeader } from '@/components/restaurant-ui/DarkHeader'
import { useToast } from '@/components/ui/toast'
import { DEMO_RESTAURANTS } from '@/lib/demo-data'
import { cn } from '@/lib/utils'
import type { RestaurantSettings } from '@/lib/types'

const restaurant = DEMO_RESTAURANTS[0]

export default function ManagerSettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<RestaurantSettings>({ ...restaurant.settings })
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    toast({ type: 'success', title: 'Settings saved', message: 'Demo mode — not persisted.' })
  }

  function update<K extends keyof RestaurantSettings>(key: K, value: RestaurantSettings[K]) {
    setSettings((p) => ({ ...p, [key]: value }))
  }

  return (
    <div className="px-4 pt-6 pb-24">
      <DarkHeader title="Settings" subtitle={restaurant.name} backHref="/restaurant/manager" />

      {/* Pause Comps */}
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Pause Comps</p>
            <p className="text-xs text-white/40 mt-0.5">Stop accepting redemptions temporarily</p>
          </div>
          <button
            onClick={() => update('pause_comps', !settings.pause_comps)}
            className={cn('w-12 h-6 rounded-full transition-colors relative', settings.pause_comps ? 'bg-orange-500' : 'bg-white/[0.1]')}
          >
            <span className={cn('absolute top-1 h-4 w-4 rounded-full bg-white transition-all', settings.pause_comps ? 'left-7' : 'left-1')} />
          </button>
        </div>
      </div>

      {/* Daily Cap */}
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5 mb-4">
        <p className="text-sm font-semibold text-white mb-1">Daily Comp Cap</p>
        <p className="text-xs text-white/40 mb-3">Max comps per day (0 = unlimited)</p>
        <input
          type="number" min="0"
          value={settings.daily_comp_cap ?? 0}
          onChange={(e) => update('daily_comp_cap', parseInt(e.target.value) || null)}
          className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20"
        />
      </div>

      {/* Cooldown */}
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5 mb-4">
        <p className="text-sm font-semibold text-white mb-1">Cooldown Period</p>
        <p className="text-xs text-white/40 mb-3">Days before a creator can redeem again</p>
        <input
          type="number" min="0"
          value={settings.cooldown_days}
          onChange={(e) => update('cooldown_days', parseInt(e.target.value) || 0)}
          className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20"
        />
      </div>

      {/* Max Items */}
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5 mb-4">
        <p className="text-sm font-semibold text-white mb-1">Max Items per Order</p>
        <p className="text-xs text-white/40 mb-3">Max items a creator can order at once</p>
        <input
          type="number" min="1"
          value={settings.max_items_per_order}
          onChange={(e) => update('max_items_per_order', parseInt(e.target.value) || 1)}
          className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20"
        />
      </div>

      {/* Blackout Hours */}
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5 mb-6">
        <p className="text-sm font-semibold text-white mb-1">Blackout Hours</p>
        <p className="text-xs text-white/40 mb-3">No redemptions during these hours (e.g. lunch rush)</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Start</label>
            <input
              type="time"
              value={settings.blackout_start ?? ''}
              onChange={(e) => update('blackout_start', e.target.value || null)}
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20"
            />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">End</label>
            <input
              type="time"
              value={settings.blackout_end ?? ''}
              onChange={(e) => update('blackout_end', e.target.value || null)}
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20"
            />
          </div>
        </div>
        {(settings.blackout_start || settings.blackout_end) && (
          <button
            onClick={() => { update('blackout_start', null); update('blackout_end', null) }}
            className="mt-3 text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            Clear blackout hours
          </button>
        )}
      </div>

      {/* Sticky Save */}
      <div className="fixed bottom-20 left-0 right-0 px-4">
        <div className="max-w-sm mx-auto">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600 text-white font-bold text-sm disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}
