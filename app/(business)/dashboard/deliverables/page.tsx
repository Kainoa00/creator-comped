'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DarkToggle } from '@/components/restaurant-ui/DarkToggle'
import { Info, Settings2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSaveFlash } from '@/lib/hooks/useSaveFlash'

type OfferType = 'IG_REEL' | 'TIKTOK' | 'BOTH' | 'CHOICE'

export default function DeliverablesPage() {
  const [offerType, setOfferType] = useState<OfferType>('BOTH')
  const [minVideoLength, setMinVideoLength] = useState(30)
  const [hashtags, setHashtags] = useState('#HIVE #YourBusiness')
  const [requiredTags, setRequiredTags] = useState('@yourbusiness')
  const [captionRequirements, setCaptionRequirements] = useState('')
  const [contentNotes, setContentNotes] = useState('Please showcase the ambiance and plate presentation. Tag our location!')
  const [postingWindow, setPostingWindow] = useState(48)
  const [avoidTopics, setAvoidTopics] = useState('Politics, religion, controversial topics')
  const [usageRights, setUsageRights] = useState(true)
  const { saved, flash: handleSave } = useSaveFlash()

  const OFFER_TYPES: { value: OfferType; label: string; desc: string }[] = [
    { value: 'IG_REEL', label: 'Instagram Reel', desc: 'Require an IG Reel only' },
    { value: 'TIKTOK', label: 'TikTok', desc: 'Require a TikTok only' },
    { value: 'BOTH', label: 'Both', desc: 'Require IG Reel + TikTok' },
    { value: 'CHOICE', label: 'Creator\'s Choice', desc: 'Creator picks platform' },
  ]

  return (
    <div className="px-4 pt-6 pb-8 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="mb-5">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Business Dashboard</p>
        <h1 className="text-xl font-bold text-white">Deliverables</h1>
        <p className="text-sm text-white/40 mt-0.5">Content requirements for creators</p>
      </div>

      {/* Edit Offer Settings link */}
      <Link
        href="/dashboard/offer-settings"
        className="flex items-center justify-between w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-4 py-3 mb-5 hover:bg-white/[0.06] transition-colors group"
      >
        <div className="flex items-center gap-3">
          <Settings2 className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-semibold text-white">Offer Settings</span>
          <span className="text-xs text-white/40">Type, platform &amp; creator tiers</span>
        </div>
        <span className="text-xs font-semibold text-orange-400 group-hover:text-orange-300 transition-colors">Edit →</span>
      </Link>

      {/* Offer Type */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Current Offer Type</p>
      <div className="grid grid-cols-2 gap-2 mb-6">
        {OFFER_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => setOfferType(type.value)}
            className={cn(
              'flex flex-col items-start p-4 rounded-2xl border transition-all text-left',
              offerType === type.value
                ? 'border-white/30 bg-white/10'
                : 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]'
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={cn(
                'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                offerType === type.value ? 'border-orange-500' : 'border-white/20'
              )}>
                {offerType === type.value && <div className="w-2 h-2 rounded-full bg-orange-500" />}
              </div>
              <p className="text-sm font-semibold text-white">{type.label}</p>
            </div>
            <p className="text-xs text-white/40 ml-6">{type.desc}</p>
          </button>
        ))}
      </div>

      {/* Content Requirements */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Content Requirements</p>
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.05] mb-5">
        {/* Min Video Length */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-white">Minimum Video Length</p>
            <span className="text-sm font-bold text-white">{minVideoLength}s</span>
          </div>
          <input
            type="range"
            min={10}
            max={120}
            step={5}
            value={minVideoLength}
            onChange={(e) => setMinVideoLength(parseInt(e.target.value))}
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between text-xs text-white/30 mt-1">
            <span>10s</span>
            <span>120s</span>
          </div>
        </div>

        {/* Hashtags */}
        <div className="px-4 py-4">
          <p className="text-sm font-medium text-white mb-2">Required Hashtags</p>
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="#HIVE #YourBusiness"
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20"
          />
          <p className="text-xs text-white/30 mt-1.5">Separate hashtags with spaces</p>
        </div>

        {/* Required Tags */}
        <div className="px-4 py-4">
          <p className="text-sm font-medium text-white mb-2">Required Tags</p>
          <input
            type="text"
            value={requiredTags}
            onChange={(e) => setRequiredTags(e.target.value)}
            placeholder="@yourbusiness"
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20"
          />
        </div>

        {/* Caption Requirements */}
        <div className="px-4 py-4">
          <p className="text-sm font-medium text-white mb-2">Caption Requirements</p>
          <input
            type="text"
            value={captionRequirements}
            onChange={(e) => setCaptionRequirements(e.target.value)}
            placeholder="e.g. Mention the dish name in caption"
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20"
          />
        </div>
      </div>

      {/* Content Notes */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Content Notes</p>
      <textarea
        value={contentNotes}
        onChange={(e) => setContentNotes(e.target.value)}
        rows={3}
        placeholder="Any additional guidelines for creators..."
        className="w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 resize-none mb-5"
      />

      {/* Posting Window & Avoid Topics */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Policies</p>
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.05] mb-5">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <p className="text-sm font-medium text-white">Posting Window</p>
            <p className="text-xs text-white/40 mt-0.5">Hours after comp to post</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="12"
              max="168"
              value={postingWindow}
              onChange={(e) => setPostingWindow(parseInt(e.target.value) || 48)}
              className="w-14 bg-white/[0.08] border border-white/[0.08] rounded-xl px-2 py-1.5 text-sm text-white text-center focus:outline-none"
            />
            <span className="text-xs text-white/40">hrs</span>
          </div>
        </div>
        <div className="px-4 py-4">
          <p className="text-sm font-medium text-white mb-2">Avoid Topics</p>
          <textarea
            value={avoidTopics}
            onChange={(e) => setAvoidTopics(e.target.value)}
            rows={2}
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Usage Rights */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Usage Rights</p>
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl mb-5">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.05]">
          <div>
            <p className="text-sm font-medium text-white">Business may repost with credit</p>
            <p className="text-xs text-white/40 mt-0.5">Allow reposting creator content on your channels</p>
          </div>
          <DarkToggle checked={usageRights} onChange={setUsageRights} />
        </div>
        <div className="px-4 py-3.5">
          <p className="text-xs text-white/40 leading-relaxed">
            By participating, creators grant the business rights to repost content on their official channels with proper credit.
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-500/[0.08] border border-blue-500/20 rounded-2xl p-4 mb-5 flex gap-3">
        <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs text-white/60 leading-relaxed">
          Creators see these requirements before redeeming. Clear guidelines help ensure quality content.
        </p>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className={cn(
          'w-full py-4 rounded-2xl text-white font-bold text-sm transition-all',
          saved ? 'bg-emerald-500' : ''
        )}
        style={saved ? {} : { background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
      >
        {saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  )
}
