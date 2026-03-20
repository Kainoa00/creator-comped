'use client'

import { useState } from 'react'
import { DarkHeader } from '@/components/restaurant-ui/DarkHeader'
import { DarkToggle } from '@/components/restaurant-ui/DarkToggle'
import { Lock, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSaveFlash } from '@/lib/hooks/useSaveFlash'

export default function EditDeliverablesPage() {
  const [formData, setFormData] = useState({
    instagramRequired: true,
    tiktokRequired: true,
    instagramStory: false,
    hashtags: '#CreatorComped #YourRestaurant',
    tagRestaurant: true,
    usageRights: true,
    additionalNotes: 'Please showcase the ambiance and plate presentation. Tag our location!',
  })
  const set = (field: keyof typeof formData, value: boolean | string) => setFormData({ ...formData, [field]: value })
  const { saved, flash: handleSave } = useSaveFlash()

  return (
    <div className="px-4 pt-6 pb-20">
      <DarkHeader title="Deliverables" subtitle="Content requirements" />

      {/* Platform Requirements */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Platform Requirements</p>
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.05] mb-4">
        {(
          [
            { field: 'instagramRequired', label: 'Instagram Post', desc: 'Require creators to post on Instagram feed' },
            { field: 'tiktokRequired', label: 'TikTok Post', desc: 'Require creators to post on TikTok' },
            { field: 'instagramStory', label: 'Instagram Story', desc: 'Optional Instagram story requirement' },
          ] as { field: keyof typeof formData; label: string; desc: string }[]
        ).map(({ field, label, desc }) => (
          <div key={field} className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs text-white/40 mt-0.5">{desc}</p>
            </div>
            <DarkToggle
              checked={formData[field] as boolean}
              onChange={(v) => set(field, v)}
            />
          </div>
        ))}
      </div>

      {/* Hashtags */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Hashtags & Tagging</p>
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.05] mb-4">
        <div className="px-4 py-3.5">
          <p className="text-sm font-medium text-white mb-2">Required Hashtags</p>
          <input
            type="text"
            value={formData.hashtags}
            onChange={(e) => set('hashtags', e.target.value)}
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20"
            placeholder="#CreatorComped #YourRestaurant"
          />
          <p className="text-xs text-white/30 mt-1.5">Separate hashtags with spaces</p>
        </div>
        <div className="flex items-center justify-between px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-white">Tag Restaurant Account</p>
            <p className="text-xs text-white/40 mt-0.5">Require tagging your restaurant in posts</p>
          </div>
          <DarkToggle checked={formData.tagRestaurant} onChange={(v) => set('tagRestaurant', v)} />
        </div>
      </div>

      {/* Fixed Fields */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Platform Policy (Fixed)</p>
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.05] mb-4">
        {[
          { label: 'Posting Deadline', value: '48 hours after redemption' },
          { label: 'Topics to Avoid', value: 'Politics, religion, controversial topics' },
        ].map(({ label, value }) => (
          <div key={label} className="px-4 py-3.5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs text-white/40 mt-0.5">{value}</p>
            </div>
            <Lock className="h-4 w-4 text-white/20 shrink-0" />
          </div>
        ))}
      </div>

      {/* Usage Rights */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Usage Rights</p>
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl mb-4">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.05]">
          <div>
            <p className="text-sm font-medium text-white">Request Content Usage Rights</p>
            <p className="text-xs text-white/40 mt-0.5">Allow reposting creator content on your channels</p>
          </div>
          <DarkToggle checked={formData.usageRights} onChange={(v) => set('usageRights', v)} />
        </div>
        <div className="px-4 py-3.5">
          <p className="text-xs text-white/40 leading-relaxed">
            By participating, creators grant the restaurant rights to repost content on their official channels.
          </p>
        </div>
      </div>

      {/* Additional Notes */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Additional Notes</p>
      <textarea
        value={formData.additionalNotes}
        onChange={(e) => set('additionalNotes', e.target.value)}
        rows={4}
        className="w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 resize-none mb-4"
        placeholder="Any additional guidelines for creators..."
      />

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
          saved
            ? 'bg-emerald-500'
            : 'bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600'
        )}
      >
        {saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  )
}
