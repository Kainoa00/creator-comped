'use client'

import { useState } from 'react'
import { DarkToggle } from '@/components/restaurant-ui/DarkToggle'
import { cn } from '@/lib/utils'
import { useSaveFlash } from '@/lib/hooks/useSaveFlash'
import { DEMO_MENU_ITEMS } from '@/lib/demo-data'

type Platform = 'IG_REEL' | 'TIKTOK' | 'BOTH'

// Use Brick Oven items as demo
const menuItems = DEMO_MENU_ITEMS.filter((i) => i.restaurant_id === 'restaurant-001')

export default function CampaignPage() {
  const [totalItemLimit, setTotalItemLimit] = useState(2)
  const [itemLimits, setItemLimits] = useState<Record<string, number>>(
    Object.fromEntries(menuItems.map((i) => [i.id, i.max_qty_per_order]))
  )
  const [platform, setPlatform] = useState<Platform>('BOTH')
  const [featureProducts, setFeatureProducts] = useState(true)
  const [minVideoLength, setMinVideoLength] = useState(30)
  const [hashtags, setHashtags] = useState('#HIVE #YourBusiness')
  const [tags, setTags] = useState('@yourbusiness')
  const [captionRequirements, setCaptionRequirements] = useState('')
  const [talkingPoints, setTalkingPoints] = useState('')
  const [avoidTopics, setAvoidTopics] = useState('Politics, religion, controversial topics')
  const [usageRights, setUsageRights] = useState(true)
  const [mentionLocation, setMentionLocation] = useState(true)
  const [postingDeadline, setPostingDeadline] = useState(48)
  const { saved, flash: handleSave } = useSaveFlash()

  const PLATFORMS: { value: Platform; label: string }[] = [
    { value: 'IG_REEL', label: 'Instagram Reel' },
    { value: 'TIKTOK', label: 'TikTok' },
    { value: 'BOTH', label: 'Both Platforms' },
  ]

  return (
    <div className="px-4 pt-6 pb-8 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="mb-5">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Business Dashboard</p>
        <h1 className="text-xl font-bold text-white">Campaign</h1>
        <p className="text-sm text-white/40 mt-0.5">Configure your HIVE campaign settings</p>
      </div>

      {/* Total Item Limit */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Item Limits</p>
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.05] mb-5">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-white">Total Item Limit</p>
              <p className="text-xs text-white/40 mt-0.5">Max items per comp order</p>
            </div>
            <span className="text-sm font-bold text-white">{totalItemLimit} items</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={totalItemLimit}
            onChange={(e) => setTotalItemLimit(parseInt(e.target.value))}
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between text-xs text-white/30 mt-1">
            <span>1</span>
            <span>10</span>
          </div>
        </div>

        {/* Per-Item Limits */}
        <div className="px-4 py-4">
          <p className="text-sm font-medium text-white mb-3">Per-Item Limits</p>
          <div className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <p className="text-sm text-white/70 truncate flex-1 mr-3">{item.name}</p>
                <div className="flex items-center border border-white/[0.08] rounded-lg overflow-hidden shrink-0">
                  <button
                    type="button"
                    onClick={() => setItemLimits((prev) => ({ ...prev, [item.id]: Math.max(1, (prev[item.id] ?? 1) - 1) }))}
                    className="px-2 py-1 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    −
                  </button>
                  <span className="px-2 py-1 text-xs text-white font-semibold min-w-[1.5rem] text-center">
                    {itemLimits[item.id] ?? 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => setItemLimits((prev) => ({ ...prev, [item.id]: (prev[item.id] ?? 1) + 1 }))}
                    className="px-2 py-1 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Required Deliverables */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Required Deliverables</p>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {PLATFORMS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => setPlatform(p.value)}
            className={cn(
              'flex flex-col items-center p-3 rounded-2xl border transition-all',
              platform === p.value
                ? 'border-white/30 bg-white/10 text-white'
                : 'border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white/60 hover:bg-white/[0.06]'
            )}
          >
            <div className={cn(
              'w-4 h-4 rounded-full border-2 mb-1.5',
              platform === p.value ? 'border-orange-500 bg-orange-500' : 'border-white/20'
            )} />
            <p className="text-xs font-semibold text-center leading-tight">{p.label}</p>
          </button>
        ))}
      </div>

      {/* Video Requirements */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Video Requirements</p>
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.05] mb-5">
        {/* Feature Products toggle */}
        <div className="flex items-center justify-between px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-white">Feature Products</p>
            <p className="text-xs text-white/40 mt-0.5">Creator must visually feature your products</p>
          </div>
          <DarkToggle checked={featureProducts} onChange={setFeatureProducts} />
        </div>

        {/* Min Video Length */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-white">Min Video Length</p>
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
          <p className="text-sm font-medium text-white mb-2">Hashtags</p>
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="#HIVE #YourBusiness"
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none"
          />
        </div>

        {/* Tags */}
        <div className="px-4 py-4">
          <p className="text-sm font-medium text-white mb-2">Tags</p>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="@yourbusiness"
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none"
          />
        </div>

        {/* Caption Requirements */}
        <div className="px-4 py-4">
          <p className="text-sm font-medium text-white mb-2">Caption Requirements</p>
          <input
            type="text"
            value={captionRequirements}
            onChange={(e) => setCaptionRequirements(e.target.value)}
            placeholder="e.g. Mention dish name in caption"
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none"
          />
        </div>

        {/* Talking Points */}
        <div className="px-4 py-4">
          <p className="text-sm font-medium text-white mb-2">Talking Points</p>
          <textarea
            value={talkingPoints}
            onChange={(e) => setTalkingPoints(e.target.value)}
            rows={2}
            placeholder="Key messages you want creators to mention..."
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Additional Settings */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Additional Settings</p>
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.05] mb-5">
        {/* Avoid Topics */}
        <div className="px-4 py-4">
          <p className="text-sm font-medium text-white mb-2">Avoid Topics</p>
          <textarea
            value={avoidTopics}
            onChange={(e) => setAvoidTopics(e.target.value)}
            rows={2}
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none resize-none"
          />
        </div>

        {/* Usage Rights */}
        <div className="flex items-center justify-between px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-white">Business may repost with credit</p>
            <p className="text-xs text-white/40 mt-0.5">Allow reposting creator content</p>
          </div>
          <DarkToggle checked={usageRights} onChange={setUsageRights} />
        </div>

        {/* Mention Location */}
        <div className="flex items-center justify-between px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-white">Mention Location</p>
            <p className="text-xs text-white/40 mt-0.5">Tag or mention your business location</p>
          </div>
          <DarkToggle checked={mentionLocation} onChange={setMentionLocation} />
        </div>

        {/* Posting Deadline */}
        <div className="flex items-center justify-between px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-white">Posting Deadline</p>
            <p className="text-xs text-white/40 mt-0.5">Hours after comp to post</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="12"
              max="168"
              value={postingDeadline}
              onChange={(e) => setPostingDeadline(parseInt(e.target.value) || 48)}
              className="w-14 bg-white/[0.08] border border-white/[0.08] rounded-xl px-2 py-1.5 text-sm text-white text-center focus:outline-none"
            />
            <span className="text-xs text-white/40">hrs</span>
          </div>
        </div>
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
