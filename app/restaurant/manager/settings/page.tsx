'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { DEMO_RESTAURANTS } from '@/lib/demo-data'
import type { RestaurantSettings } from '@/lib/types'
import { deepClone, cn } from '@/lib/utils'
import {
  ArrowLeft,
  Clock,
  BarChart2,
  Zap,
  Instagram,
  Music2,
  Hash,
  X,
  CheckCircle2,
  Pause,
  Play,
} from 'lucide-react'

const restaurant = DEMO_RESTAURANTS[0]

const COOLDOWN_OPTIONS = [
  { label: '7 days', value: 7 },
  { label: '14 days', value: 14 },
  { label: '30 days', value: 30 },
  { label: '60 days', value: 60 },
  { label: 'Custom', value: -1 },
]

const PLATFORM_OPTIONS = [
  { label: 'Instagram Reel', value: 'IG_REEL', icon: Instagram },
  { label: 'TikTok Video', value: 'TIKTOK', icon: Music2 },
  { label: 'Either (creator chooses)', value: 'CHOICE', icon: null },
  { label: 'Both Required', value: 'BOTH', icon: null },
]

function SectionHeader({ label }: { label: string }) {
  return (
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 mt-6 px-1">
      {label}
    </p>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [settings, setSettings] = useState<RestaurantSettings>(() =>
    deepClone(restaurant.settings)
  )
  const [noCap, setNoCap] = useState(restaurant.settings.daily_comp_cap === null)
  const [cooldownMode, setCooldownMode] = useState<number>(() => {
    const val = restaurant.settings.cooldown_days
    return COOLDOWN_OPTIONS.find((o) => o.value === val) ? val : -1
  })
  const [customCooldown, setCustomCooldown] = useState(
    COOLDOWN_OPTIONS.find((o) => o.value === restaurant.settings.cooldown_days)
      ? ''
      : String(restaurant.settings.cooldown_days)
  )

  const [platform, setPlatform] = useState('CHOICE')
  const [hashtags, setHashtags] = useState<string[]>(['#CreatorComped'])
  const [mentions, setMentions] = useState<string[]>(['@brickovenprovo'])
  const [hashtagInput, setHashtagInput] = useState('')
  const [mentionInput, setMentionInput] = useState('')

  const [saving, setSaving] = useState(false)

  function addTag(
    input: string,
    list: string[],
    setter: (v: string[]) => void,
    inputSetter: (v: string) => void,
    prefix: string
  ) {
    const raw = input.trim()
    if (!raw) return
    const tag = raw.startsWith(prefix) ? raw : `${prefix}${raw}`
    if (!list.includes(tag)) setter([...list, tag])
    inputSetter('')
  }

  function removeTag(tag: string, list: string[], setter: (v: string[]) => void) {
    setter(list.filter((t) => t !== tag))
  }

  async function handleSave() {
    setSaving(true)
    const finalCooldown = cooldownMode === -1 ? parseInt(customCooldown) || 14 : cooldownMode
    const finalCap = noCap ? null : settings.daily_comp_cap

    setSettings((s) => ({
      ...s,
      cooldown_days: finalCooldown,
      daily_comp_cap: finalCap,
    }))

    await new Promise((r) => setTimeout(r, 500))
    setSaving(false)
    toast({
      type: 'success',
      title: 'Settings saved',
      message: 'Restaurant settings have been updated.',
    })
  }

  function handleTogglePause() {
    setSettings((s) => ({ ...s, pause_comps: !s.pause_comps }))
  }

  const inputClass = cn(
    'w-full h-11 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm px-3',
    'focus:outline-none focus:ring-2 focus:ring-cc-accent/10 focus:border-cc-accent',
    'transition-colors duration-150'
  )

  return (
    <div className="p-6 pb-28">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push('/restaurant/manager')}
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
            <p className="text-sm text-slate-500">{restaurant.name}</p>
          </div>
        </div>

        {/* ── Pause / Resume Banner ── */}
        <div className={cn(
          'rounded-2xl p-5 mb-6 border',
          settings.pause_comps
            ? 'bg-red-50 border-red-200'
            : 'bg-emerald-50 border-emerald-200'
        )}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn(
                'text-base font-bold',
                settings.pause_comps ? 'text-red-700' : 'text-emerald-700'
              )}>
                {settings.pause_comps ? 'Comps PAUSED' : 'Comps Active'}
              </p>
              <p className={cn(
                'text-xs mt-0.5',
                settings.pause_comps ? 'text-red-600' : 'text-emerald-600'
              )}>
                {settings.pause_comps
                  ? 'No new redemptions are being accepted'
                  : 'Creators can redeem normally'}
              </p>
            </div>
            <button
              onClick={handleTogglePause}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer min-h-[44px]',
                settings.pause_comps
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              )}
            >
              {settings.pause_comps ? (
                <><Play className="h-4 w-4" /> Resume</>
              ) : (
                <><Pause className="h-4 w-4" /> Pause</>
              )}
            </button>
          </div>
        </div>

        {/* ── Blackout Hours ── */}
        <SectionHeader label="Redemption Hours" />
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <p className="text-sm font-semibold text-slate-900">Blackout Hours</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-xs text-slate-400 mb-4">
              Creators cannot redeem during blackout hours (e.g. lunch rush).
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">Blackout Start</label>
                <input
                  type="time"
                  value={settings.blackout_start ?? ''}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, blackout_start: e.target.value || null }))
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">Blackout End</label>
                <input
                  type="time"
                  value={settings.blackout_end ?? ''}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, blackout_end: e.target.value || null }))
                  }
                  className={inputClass}
                />
              </div>
            </div>
            {settings.blackout_start && settings.blackout_end && (
              <div className="mt-3 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                Active: {settings.blackout_start} – {settings.blackout_end}
              </div>
            )}
            <button
              onClick={() => setSettings((s) => ({ ...s, blackout_start: null, blackout_end: null }))}
              className="mt-3 text-xs text-slate-400 hover:text-red-500 transition-colors"
            >
              Clear blackout hours
            </button>
          </div>
        </div>

        {/* ── Caps & Limits ── */}
        <SectionHeader label="Caps & Limits" />
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-slate-400" />
            <p className="text-sm font-semibold text-slate-900">Caps &amp; Limits</p>
          </div>
          <div className="px-5 py-4 flex flex-col gap-5">
            {/* Daily Cap */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">Daily Comp Cap</label>
                <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={noCap}
                    onChange={(e) => setNoCap(e.target.checked)}
                    className="accent-cc-accent rounded"
                  />
                  No cap
                </label>
              </div>
              <input
                type="number"
                min={1}
                max={100}
                disabled={noCap}
                value={noCap ? '' : (settings.daily_comp_cap ?? '')}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    daily_comp_cap: parseInt(e.target.value) || null,
                  }))
                }
                placeholder={noCap ? 'Unlimited' : '5'}
                className={cn(inputClass, 'disabled:opacity-40 disabled:cursor-not-allowed')}
              />
            </div>

            {/* Max Items per Order */}
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Max Items Per Order</label>
              <input
                type="number"
                min={1}
                max={10}
                value={settings.max_items_per_order}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    max_items_per_order: Math.min(10, Math.max(1, parseInt(e.target.value) || 1)),
                  }))
                }
                className={inputClass}
              />
            </div>

            {/* Cooldown */}
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">
                Cooldown Period (between visits by same creator)
              </label>
              <div className="flex flex-wrap gap-2">
                {COOLDOWN_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setCooldownMode(opt.value)}
                    className={cn(
                      'px-4 py-2 rounded-xl border text-sm font-medium transition-colors cursor-pointer min-h-[40px]',
                      cooldownMode === opt.value
                        ? 'bg-blue-50 border-cc-accent text-cc-accent'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {cooldownMode === -1 && (
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={365}
                    placeholder="Days"
                    value={customCooldown}
                    onChange={(e) => setCustomCooldown(e.target.value)}
                    className={cn(inputClass, 'w-28')}
                  />
                  <span className="text-sm text-slate-500">days</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Content Requirements ── */}
        <SectionHeader label="Content Requirements" />
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Zap className="h-4 w-4 text-slate-400" />
            <p className="text-sm font-semibold text-slate-900">What creators must post</p>
          </div>
          <div className="px-5 py-4 flex flex-col gap-5">
            {/* Platform */}
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Platform</label>
              <div className="grid grid-cols-2 gap-2">
                {PLATFORM_OPTIONS.map((opt) => {
                  const Icon = opt.icon
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setPlatform(opt.value)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer text-left min-h-[48px]',
                        platform === opt.value
                          ? 'bg-blue-50 border-cc-accent text-cc-accent'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                      )}
                    >
                      {Icon && <Icon className="h-4 w-4 shrink-0" />}
                      <span>{opt.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Hashtags */}
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Required Hashtags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs bg-slate-50 border border-slate-200 rounded-full px-2.5 py-1 text-slate-700"
                  >
                    <Hash className="h-3 w-3 text-slate-400" />
                    {tag.replace('#', '')}
                    <button
                      onClick={() => removeTag(tag, hashtags, setHashtags)}
                      className="text-slate-400 hover:text-red-500 transition-colors ml-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  placeholder="#hashtag"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter')
                      addTag(hashtagInput, hashtags, setHashtags, setHashtagInput, '#')
                  }}
                  className={cn(inputClass, 'flex-1 h-10')}
                />
                <button
                  onClick={() => addTag(hashtagInput, hashtags, setHashtags, setHashtagInput, '#')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl px-4 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Mentions */}
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Required Mentions</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {mentions.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1 text-cc-accent"
                  >
                    @{tag.replace('@', '')}
                    <button
                      onClick={() => removeTag(tag, mentions, setMentions)}
                      className="text-slate-400 hover:text-red-500 transition-colors ml-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  placeholder="@handle"
                  value={mentionInput}
                  onChange={(e) => setMentionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter')
                      addTag(mentionInput, mentions, setMentions, setMentionInput, '@')
                  }}
                  className={cn(inputClass, 'flex-1 h-10')}
                />
                <button
                  onClick={() => addTag(mentionInput, mentions, setMentions, setMentionInput, '@')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl px-4 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full min-h-[56px] bg-cc-accent hover:bg-cc-accent-dark text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              <div className="h-5 w-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
