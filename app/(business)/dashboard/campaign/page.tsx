'use client'

import { useState } from 'react'
import { GradientSlider } from '@/components/restaurant-ui/GradientSlider'
import { cn } from '@/lib/utils'
import { useSaveFlash } from '@/lib/hooks/useSaveFlash'
import { DEMO_MENU_ITEMS } from '@/lib/demo-data'
import { Check } from 'lucide-react'

type Platform = 'IG_REEL' | 'TIKTOK' | 'BOTH'

const menuItems = DEMO_MENU_ITEMS.filter((i) => i.restaurant_id === 'restaurant-001')

// Gradient label style used across screenshot sections
const labelClass = 'text-xs font-semibold mb-1.5'
const labelStyle = { background: 'linear-gradient(90deg, #8B5CF6 0%, #4A90E2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }
const inputClass = 'w-full bg-white/[0.05] border border-white/[0.06] rounded-2xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20'

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: 'IG_REEL', label: 'Instagram Reel' },
  { value: 'TIKTOK', label: 'TikTok' },
  { value: 'BOTH', label: 'Both Platforms' },
]

export default function CampaignPage() {
  const [totalItemLimit, setTotalItemLimit] = useState(2)
  const [itemLimits, setItemLimits] = useState<Record<string, number>>(
    Object.fromEntries(menuItems.map((i) => [i.id, i.max_qty_per_order]))
  )
  const [platform, setPlatform] = useState<Platform>('BOTH')

  // Video Requirements — all text fields matching screenshot
  const [featureProducts, setFeatureProducts] = useState('All ordered items')
  const [minVideoLength, setMinVideoLength] = useState('20-30 seconds')
  const [hashtags, setHashtags] = useState('#HIVE #YourBusiness')
  const [tags, setTags] = useState('@yourbusiness')
  const [captionRequirements, setCaptionRequirements] = useState('Mention experience and favorite item')
  const [talkingPoints, setTalkingPoints] = useState('Atmosphere, food quality, presentation')
  const [avoidTopics, setAvoidTopics] = useState('Politics, controversial subjects')
  const [usageRights, setUsageRights] = useState('Restaurant may repost with credit')
  const [mentionLocation, setMentionLocation] = useState(true)

  const { saved, flash: handleSave } = useSaveFlash()

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
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-white">Total Item Limit</p>
              <p className="text-xs text-white/40 mt-0.5">Max items per comp order</p>
            </div>
            <span className="text-sm font-bold text-white">{totalItemLimit} items</span>
          </div>
          <GradientSlider min={1} max={10} value={totalItemLimit} onChange={setTotalItemLimit} />
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
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-4">Video Requirements</p>
      <div className="flex flex-col gap-3 mb-5">
        {/* Feature Product(s) */}
        <div>
          <p className={labelClass} style={labelStyle}>Feature Product(s)</p>
          <input
            type="text"
            value={featureProducts}
            onChange={(e) => setFeatureProducts(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Minimum Video Length */}
        <div>
          <p className={labelClass} style={labelStyle}>Minimum Video Length</p>
          <input
            type="text"
            value={minVideoLength}
            onChange={(e) => setMinVideoLength(e.target.value)}
            placeholder="e.g. 20-30 seconds"
            className={inputClass}
          />
        </div>

        {/* Required Hashtags */}
        <div>
          <p className={labelClass} style={labelStyle}>Required Hashtags</p>
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="#HIVE #YourBusiness"
            className={inputClass}
          />
        </div>

        {/* Required Tags */}
        <div>
          <p className={labelClass} style={labelStyle}>Required Tags</p>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="@yourbusiness"
            className={inputClass}
          />
        </div>

        {/* Caption Requirements */}
        <div>
          <p className={labelClass} style={labelStyle}>Caption Requirements</p>
          <textarea
            value={captionRequirements}
            onChange={(e) => setCaptionRequirements(e.target.value)}
            rows={2}
            placeholder="e.g. Mention experience and favorite item"
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Required Talking Points */}
        <div>
          <p className={labelClass} style={labelStyle}>Required Talking Points</p>
          <textarea
            value={talkingPoints}
            onChange={(e) => setTalkingPoints(e.target.value)}
            rows={2}
            placeholder="e.g. Atmosphere, food quality, presentation"
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Avoid Topics */}
        <div>
          <p className={labelClass} style={labelStyle}>Avoid Topics</p>
          <input
            type="text"
            value={avoidTopics}
            onChange={(e) => setAvoidTopics(e.target.value)}
            placeholder="Politics, controversial subjects"
            className={inputClass}
          />
        </div>

        {/* Usage Rights */}
        <div>
          <p className={labelClass} style={labelStyle}>Usage Rights</p>
          <input
            type="text"
            value={usageRights}
            onChange={(e) => setUsageRights(e.target.value)}
            placeholder="Restaurant may repost with credit"
            className={inputClass}
          />
        </div>

        {/* Mention Location — accessible checkbox */}
        <label
          className="flex items-center justify-between bg-white/[0.05] border border-white/[0.06] rounded-2xl px-4 py-3.5 cursor-pointer"
        >
          <span className="text-sm font-semibold text-white">Mention Location</span>
          <input
            type="checkbox"
            checked={mentionLocation}
            onChange={(e) => setMentionLocation(e.target.checked)}
            className="sr-only peer"
          />
          <span
            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-all"
            style={mentionLocation
              ? { background: 'linear-gradient(135deg, #8B5CF6 0%, #4A90E2 100%)' }
              : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }
            }
          >
            {mentionLocation && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
          </span>
        </label>
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
