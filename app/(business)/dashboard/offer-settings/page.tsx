'use client'

import { useState } from 'react'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useSaveFlash } from '@/lib/hooks/useSaveFlash'

// ── Types ──────────────────────────────────────────────────────

type OfferType = 'spotlight' | 'showcase' | 'full_campaign'
type CreatorTier = 'starter' | 'rising' | 'established' | 'premium' | 'elite'

// ── Data ───────────────────────────────────────────────────────

const OFFER_TYPES: { value: OfferType; label: string; desc: string }[] = [
  { value: 'spotlight',     label: 'Spotlight',      desc: '1 Instagram Story' },
  { value: 'showcase',      label: 'Showcase',       desc: '1 Video (Instagram Reel or TikTok Video)' },
  { value: 'full_campaign', label: 'Full Campaign',  desc: '1 Instagram Reel + 1 TikTok Video' },
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
  const router = useRouter()
  const [offerType, setOfferType] = useState<OfferType>('showcase')
  const [creatorTier, setCreatorTier] = useState<CreatorTier>('established')
  const { saved, flash: handleSave } = useSaveFlash()

  const handleOfferTypeChange = (type: OfferType) => setOfferType(type)

  return (
    <div className="px-4 pt-6 pb-8 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-white/70" />
          </button>
          <h1 className="text-xl font-bold text-white">Offer Settings</h1>
        </div>
        <p className="text-sm text-white/40 mt-0.5 ml-11">Configure offer type and creator access</p>
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
