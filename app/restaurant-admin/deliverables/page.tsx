'use client'

import { useState } from 'react'
import { Lock, Info } from 'lucide-react'

export default function EditDeliverablesPage() {
  const [formData, setFormData] = useState({
    instagramRequired: true,
    tiktokRequired: true,
    instagramStory: false,
    tiktokStory: false,
    hashtags: '#CreatorComped #YourRestaurant',
    tagRestaurant: true,
    postingDeadline: '48 hours',
    avoidTopics: 'Politics, religion, controversial topics',
    usageRights: true,
    usageRightsText:
      'By participating, creators grant the restaurant rights to repost content on their official channels.',
    additionalNotes: 'Please showcase the ambiance and plate presentation. Tag our location!',
  })

  const handleChange = (field: string, value: boolean | string) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Deliverables</h1>
        <p className="text-white/70">Set content requirements and posting guidelines</p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Platform Requirements */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
          <h3 className="font-semibold mb-4">Platform Requirements</h3>
          <div className="space-y-4">
            {[
              { field: 'instagramRequired', label: 'Instagram Post', desc: 'Require creators to post on Instagram feed' },
              { field: 'tiktokRequired', label: 'TikTok Post', desc: 'Require creators to post on TikTok' },
              { field: 'instagramStory', label: 'Instagram Story', desc: 'Optional Instagram story requirement' },
            ].map(({ field, label, desc }) => (
              <div key={field} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{label}</div>
                  <p className="text-sm text-white/70">{desc}</p>
                </div>
                <label className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    checked={formData[field as keyof typeof formData] as boolean}
                    onChange={(e) => handleChange(field, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Hashtags & Tagging */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
          <h3 className="font-semibold mb-4">Hashtags & Tagging</h3>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Required Hashtags</label>
              <input
                type="text"
                value={formData.hashtags}
                onChange={(e) => handleChange('hashtags', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange-500 transition"
                placeholder="#CreatorComped #YourRestaurant"
              />
              <p className="text-sm text-white/50 mt-2">Separate hashtags with spaces</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Tag Restaurant Account</div>
                <p className="text-sm text-white/70">Require tagging your restaurant in posts</p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={formData.tagRestaurant}
                  onChange={(e) => handleChange('tagRestaurant', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Posting Deadline (Fixed) */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 relative">
          <div className="absolute top-4 right-4">
            <Lock className="w-5 h-5 text-white/30" />
          </div>
          <h3 className="font-semibold mb-4">Posting Deadline</h3>
          <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/50">
            <span className="font-medium">{formData.postingDeadline}</span>
            <span className="text-sm">(Fixed by platform policy)</span>
          </div>
        </div>

        {/* Avoid Topics (Fixed) */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 relative">
          <div className="absolute top-4 right-4">
            <Lock className="w-5 h-5 text-white/30" />
          </div>
          <h3 className="font-semibold mb-4">Topics to Avoid</h3>
          <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/50">
            <p>{formData.avoidTopics}</p>
            <p className="text-sm mt-2">(Fixed by platform policy)</p>
          </div>
        </div>

        {/* Usage Rights */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
          <h3 className="font-semibold mb-4">Usage Rights</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Request Content Usage Rights</div>
                <p className="text-sm text-white/70">Allow reposting creator content</p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={formData.usageRights}
                  onChange={(e) => handleChange('usageRights', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-blue-600"></div>
              </label>
            </div>

            <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/70">
              <p className="text-sm">{formData.usageRightsText}</p>
              <p className="text-xs text-white/50 mt-2">(Fixed description text)</p>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
          <h3 className="font-semibold mb-4">Additional Notes</h3>
          <textarea
            value={formData.additionalNotes}
            onChange={(e) => handleChange('additionalNotes', e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange-500 transition h-32 resize-none"
            placeholder="Any additional guidelines or requests for creators..."
          />
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/20 flex gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-white/90">
            Creators will see these requirements before redeeming a comp. Clear guidelines
            help ensure quality content that meets your expectations.
          </div>
        </div>

        {/* Save Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
            Cancel
          </button>
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-blue-600 hover:opacity-90 transition">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
