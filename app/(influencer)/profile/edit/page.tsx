'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Camera, Instagram, Music2 } from 'lucide-react'
import { useCreatorData } from '@/lib/hooks/useCreatorData'
import { supabase, isDemoMode } from '@/lib/supabase'
import { DEMO_ACTIVE_CREATOR } from '@/lib/demo-data'
import { getInitials } from '@/lib/utils'

function Field({ label, value, onChange, type = 'text', placeholder }: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-[18px] text-white placeholder:text-gray-500 px-4 py-3.5 text-sm outline-none focus:border-white/30 transition-colors"
      />
    </div>
  )
}

export default function EditProfilePage() {
  const router = useRouter()
  const { creator: liveCreator, loading: creatorLoading } = useCreatorData()
  const creator = liveCreator ?? DEMO_ACTIVE_CREATOR
  const initials = getInitials(creator.name)

  const [name, setName] = useState(creator.name)
  const [city, setCity] = useState('Provo, UT')
  const [email, setEmail] = useState(creator.email)
  const [phone, setPhone] = useState(creator.phone ?? '')
  const [igHandle, setIgHandle] = useState(creator.ig_handle ?? '')
  const [tiktokHandle, setTiktokHandle] = useState(creator.tiktok_handle ?? '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)

    if (!isDemoMode && supabase && creator.id) {
      try {
        await supabase.from('creators').update({
          name,
          ig_handle: igHandle || null,
          tiktok_handle: tiktokHandle || null,
          phone: phone || null,
        }).eq('id', creator.id)
      } catch (err) {
        console.error('[EditProfile] Save failed:', err)
      }
    }

    setSaving(false)
    router.back()
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white max-w-[430px] mx-auto">
      {/* Header */}
      <header className="px-4 pt-14 pb-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#1a1a1a] active:bg-[#252525] transition-colors">
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white flex-1">Edit Profile</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-sm font-bold text-white rounded-[18px] px-4 py-2 disabled:opacity-50"
          style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </header>

      <div className="px-4 pb-28 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold"
              style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #4A90E2 100%)' }}
            >
              {initials}
            </div>
            <button
              onClick={() => {
                // Photo upload via native camera or gallery
                import('@/lib/capacitor').then(({ isNative }) => {
                  if (isNative()) {
                    import('@capacitor/camera').then(({ Camera, CameraResultType, CameraSource }) => {
                      Camera.getPhoto({
                        quality: 80,
                        allowEditing: true,
                        resultType: CameraResultType.Uri,
                        source: CameraSource.Prompt,
                      }).catch(() => {})
                    })
                  }
                })
              }}
              aria-label="Change profile photo"
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center active:bg-[#252525]"
            >
              <Camera className="h-3.5 w-3.5 text-gray-400" />
            </button>
          </div>
          <p className="text-xs text-gray-500">Tap to change photo</p>
        </div>

        {/* Profile fields */}
        <div className="space-y-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Profile</p>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 space-y-4">
            <Field label="Full Name" value={name} onChange={setName} placeholder="Your full name" />
            <Field label="City / State" value={city} onChange={setCity} placeholder="e.g. Provo, UT" />
            <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="your@email.com" />
            <Field label="Phone" value={phone} onChange={setPhone} type="tel" placeholder="(555) 000-0000" />
          </div>
        </div>

        {/* Social handles */}
        <div className="space-y-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Social Accounts</p>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 space-y-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                <Instagram className="h-3.5 w-3.5 text-pink-400" />
                Instagram Handle
              </label>
              <input
                type="text"
                value={igHandle}
                onChange={(e) => setIgHandle(e.target.value)}
                placeholder="@yourhandle"
                className="w-full bg-[#252525] border border-[#2a2a2a] rounded-[18px] text-white placeholder:text-gray-500 px-4 py-3.5 text-sm outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                <Music2 className="h-3.5 w-3.5 text-gray-400" />
                TikTok Handle
              </label>
              <input
                type="text"
                value={tiktokHandle}
                onChange={(e) => setTiktokHandle(e.target.value)}
                placeholder="@yourhandle"
                className="w-full bg-[#252525] border border-[#2a2a2a] rounded-[18px] text-white placeholder:text-gray-500 px-4 py-3.5 text-sm outline-none focus:border-white/30 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full text-white font-bold rounded-[18px] py-4 text-sm disabled:opacity-50"
          style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
