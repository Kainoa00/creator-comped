'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Info } from 'lucide-react'
import { DarkToggle } from '@/components/restaurant-ui/DarkToggle'
import { cn } from '@/lib/utils'
import { useSaveFlash } from '@/lib/hooks/useSaveFlash'

const fieldClass = 'w-full bg-white/[0.06] border border-white/[0.06] rounded-2xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/15'
const gradientLabel = { background: 'linear-gradient(90deg, #8B5CF6 0%, #4A90E2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }

export default function DeliverablesPage() {
  const [minVideoLength, setMinVideoLength] = useState('20-30 seconds')
  const [hashtags, setHashtags] = useState('#HivePartner #LocalEats')
  const [requiredTags, setRequiredTags] = useState('@yourbusiness')
  const [captionRequirements, setCaptionRequirements] = useState('Mention the business name and location')
  const [contentNotes, setContentNotes] = useState('Highlight your favorite item and the experience')
  const [postingWindow, setPostingWindow] = useState('7 days from redemption')
  const [usageRights, setUsageRights] = useState(true)
  const { saved, flash: handleSave } = useSaveFlash()

  return (
    <div className="px-4 pt-6 pb-8 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Business Dashboard</p>
        <h1 className="text-xl font-bold text-white">Edit Deliverables</h1>
        <p className="text-sm text-white/40 mt-0.5">Content requirements for creators</p>
      </div>

      {/* Offer Type / Platform summary card */}
      <div className="bg-white/[0.05] border border-white/[0.06] rounded-2xl p-5 mb-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-8">
            <div>
              <p className="text-xs text-white/40 mb-1">Current Offer Type</p>
              <p className="text-base font-bold text-white">Showcase</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Platform</p>
              <p className="text-base font-bold text-white">Instagram Reel</p>
            </div>
          </div>
          <Link
            href="/dashboard/offer-settings"
            className="text-sm font-semibold text-orange-400 hover:text-orange-300 transition-colors whitespace-nowrap shrink-0"
          >
            Edit Offer Settings →
          </Link>
        </div>
      </div>

      {/* Content Requirements card */}
      <div className="bg-white/[0.05] border border-white/[0.06] rounded-2xl p-5 mb-4">
        <p className="text-base font-bold text-white mb-5">Content Requirements</p>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold mb-1.5" style={gradientLabel}>Minimum Video Length</p>
            <input type="text" value={minVideoLength} onChange={(e) => setMinVideoLength(e.target.value)} className={fieldClass} placeholder="e.g. 20-30 seconds" />
          </div>

          <div>
            <p className="text-xs font-semibold mb-1.5" style={gradientLabel}>Required Hashtags</p>
            <input type="text" value={hashtags} onChange={(e) => setHashtags(e.target.value)} className={fieldClass} placeholder="#HIVE #YourBusiness" />
          </div>

          <div>
            <p className="text-xs font-semibold mb-1.5" style={gradientLabel}>Required Tags (@)</p>
            <input type="text" value={requiredTags} onChange={(e) => setRequiredTags(e.target.value)} className={fieldClass} placeholder="@yourbusiness" />
          </div>

          <div>
            <p className="text-xs font-semibold mb-1.5" style={gradientLabel}>Caption Requirements</p>
            <textarea value={captionRequirements} onChange={(e) => setCaptionRequirements(e.target.value)} rows={2} className={`${fieldClass} resize-none`} placeholder="e.g. Mention the business name and location" />
          </div>

          <div>
            <p className="text-xs font-semibold mb-1.5" style={gradientLabel}>Content Notes</p>
            <textarea value={contentNotes} onChange={(e) => setContentNotes(e.target.value)} rows={2} className={`${fieldClass} resize-none`} placeholder="Additional guidelines for creators" />
          </div>

          <div>
            <p className="text-xs font-semibold mb-1.5" style={gradientLabel}>Posting Window</p>
            <input type="text" value={postingWindow} onChange={(e) => setPostingWindow(e.target.value)} className={fieldClass} placeholder="e.g. 7 days from redemption" />
          </div>
        </div>
      </div>

      {/* Avoid Topics card */}
      <div className="bg-white/[0.05] border border-white/[0.06] rounded-2xl p-5 mb-4 flex gap-4">
        <div className="w-8 h-8 rounded-full border border-orange-500/60 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="h-4 w-4 text-orange-400" />
        </div>
        <div>
          <p className="text-base font-bold text-white mb-1">Avoid (Topics)</p>
          <p className="text-sm text-white/60 leading-relaxed">
            No profanity, no alcohol/drug references, no competitor brands, no controversial topics.
          </p>
        </div>
      </div>

      {/* Usage Rights card */}
      <div className="bg-white/[0.05] border border-white/[0.06] rounded-2xl p-5 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-base font-bold text-white mb-2">Usage Rights</p>
            <p className="text-sm text-white/60 leading-relaxed mb-3">
              We have the right to repost your media on our social channels and marketing.
            </p>
            {usageRights && (
              <p className="text-xs font-semibold" style={gradientLabel}>
                Enabled — This statement will be included in creator requirements
              </p>
            )}
          </div>
          <DarkToggle checked={usageRights} onChange={setUsageRights} />
        </div>
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
