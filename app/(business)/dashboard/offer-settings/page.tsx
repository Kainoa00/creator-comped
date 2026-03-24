'use client'

import { useState, useCallback } from 'react'
import { CheckCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSaveFlash } from '@/lib/hooks/useSaveFlash'

// ── Types ──────────────────────────────────────────────────────

type OfferType = 'spotlight' | 'showcase' | 'full_campaign'
type Platform = 'instagram' | 'tiktok'
type CreatorTier = 'starter' | 'rising' | 'established' | 'premium' | 'elite'

// ── Data ───────────────────────────────────────────────────────

const OFFER_TYPES: { value: OfferType; label: string; desc: string }[] = [
  { value: 'spotlight',     label: 'Spotlight',      desc: '1 Instagram Story' },
  { value: 'showcase',      label: 'Showcase',       desc: '1 Video (Instagram Reel or TikTok Video)' },
  { value: 'full_campaign', label: 'Full Campaign',  desc: '1 Instagram Reel + 1 TikTok Video' },
]

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: 'instagram', label: 'Instagram Reel' },
  { value: 'tiktok',    label: 'TikTok Video' },
]

const CREATOR_TIERS: { value: CreatorTier; label: string; desc: string }[] = [
  { value: 'starter',     label: 'Starter',     desc: '0–10K followers' },
  { value: 'rising',      label: 'Rising',      desc: '10–25K followers' },
  { value: 'established', label: 'Established', desc: '25–50K followers' },
  { value: 'premium',     label: 'Premium',     desc: '50–100K followers' },
  { value: 'elite',       label: 'Elite',       desc: '100K+ followers' },
]

// ── Shared selection row ────────────────────────────────────────

function SelectRow({
  label,
  desc,
  active,
  onClick,
}: {
  label: string
  desc: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left',
        active
          ? 'border-orange-500/70 bg-gradient-to-r from-orange-500/10 to-transparent'
          : 'border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06]'
      )}
    >
      <div>
        <p className={cn('text-sm font-bold', active ? 'text-white' : 'text-white/80')}>
          {label}
          {active && <CheckCircle className="inline-block h-4 w-4 text-orange-400 ml-2 -mt-0.5" />}
        </p>
        <p className="text-xs text-white/50 mt-0.5">{desc}</p>
      </div>
    </button>
  )
}

// ── Page ───────────────────────────────────────────────────────

export default function OfferSettingsPage() {
  const [offerType, setOfferType] = useState<OfferType>('showcase')
  const [platform, setPlatform] = useState<Platform>('instagram')
  const [creatorTier, setCreatorTier] = useState<CreatorTier>('established')
  const { saved, flash: handleSave } = useSaveFlash()

  const handleOfferTypeChange = useCallback((type: OfferType) => {
    setOfferType(type)
    if (type === 'spotlight') {
      setPlatform('instagram')
    }
  }, [])

  return (
    <div className="px-4 pt-6 pb-8 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Business Dashboard</p>
        <h1 className="text-xl font-bold text-white">Offer Settings</h1>
        <p className="text-sm text-white/40 mt-0.5">Configure offer type and creator access</p>
      </div>

      {/* Offer Type */}
      <div className="bg-white/[0.05] border border-white/[0.06] rounded-2xl p-5 mb-4">
        <p className="text-base font-bold text-white mb-1">Offer Type</p>
        <p className="text-sm text-white/40 mb-4">Choose the type of content creators will deliver</p>
        <div className="flex flex-col gap-2">
          {OFFER_TYPES.map((o) => (
            <SelectRow
              key={o.value}
              label={o.label}
              desc={o.desc}
              active={offerType === o.value}
              onClick={() => handleOfferTypeChange(o.value)}
            />
          ))}
        </div>
      </div>

      {/* Video Platform */}
      <div className="bg-white/[0.05] border border-white/[0.06] rounded-2xl p-5 mb-4">
        <p className="text-base font-bold text-white mb-4">Video Platform</p>
        {offerType === 'spotlight' && (
          <div className="flex gap-2.5 mb-3 bg-blue-500/[0.08] border border-blue-500/20 rounded-xl p-3">
            <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-white/60 leading-relaxed">
              Spotlight offers use Instagram Stories only. Platform is locked to Instagram.
            </p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          {PLATFORMS.map((p) => {
            const isDisabled = offerType === 'spotlight' && p.value === 'tiktok'
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => !isDisabled && setPlatform(p.value)}
                disabled={isDisabled}
                className={cn(
                  'flex flex-col items-center justify-center py-5 rounded-2xl border transition-all',
                  isDisabled
                    ? 'border-white/[0.04] bg-white/[0.02] opacity-40 cursor-not-allowed'
                    : platform === p.value
                      ? 'border-orange-500/70 bg-gradient-to-b from-orange-500/10 to-transparent'
                      : 'border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06]'
                )}
              >
                <p className={cn('text-sm font-bold mb-1.5', platform === p.value && !isDisabled ? 'text-white' : 'text-white/70')}>
                  {p.label}
                </p>
                {platform === p.value && !isDisabled && <CheckCircle className="h-4 w-4 text-orange-400" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Eligible Creator Tiers */}
      <div className="bg-white/[0.05] border border-white/[0.06] rounded-2xl p-5 mb-6">
        <p className="text-base font-bold text-white mb-1">Eligible Creator Tiers</p>
        <p className="text-sm text-white/40 mb-4">
          Select the minimum creator tier. Creators in this tier and above can access your offer.
        </p>
        <div className="flex flex-col gap-2">
          {CREATOR_TIERS.map((t) => (
            <SelectRow
              key={t.value}
              label={t.label}
              desc={t.desc}
              active={creatorTier === t.value}
              onClick={() => setCreatorTier(t.value)}
            />
          ))}
        </div>
        <p className="text-xs text-white/30 mt-4 leading-relaxed">
          Creators qualify using either Instagram or TikTok follower count. They only need one connected social account to meet the tier threshold.
        </p>
      </div>

      {/* Save */}
      <button
        type="button"
        onClick={handleSave}
        className={cn('w-full py-4 rounded-2xl text-white font-bold text-sm transition-all', saved ? 'bg-emerald-500' : '')}
        style={saved ? {} : { background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
      >
        {saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  )
}
