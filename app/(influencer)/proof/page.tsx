'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Instagram, Music2, CheckCircle2, Link2, ChevronRight, AlertTriangle } from 'lucide-react'
import { useOrderStore } from '@/lib/stores/order-store'
import { DEMO_ORDERS } from '@/lib/demo-data'
import type { DeliverableType } from '@/lib/types'

type ProofPlatform = 'IG_REEL' | 'TIKTOK'

function validateUrl(url: string, platform: ProofPlatform): boolean {
  if (!url.trim()) return false
  return platform === 'IG_REEL' ? url.includes('instagram.com/reel/') : (url.includes('tiktok.com/@') && url.includes('/video/'))
}

export default function ProofPage() {
  const router = useRouter()
  const activeRedemption = useOrderStore((s) => s.activeRedemption)

  // Fallback: use demo order if no active redemption
  const order = DEMO_ORDERS.find((o) => o.creator_id === 'creator-001' && o.status === 'confirmed')
  const deliverableType: DeliverableType | null = order?.deliverable_requirement?.allowed_types ?? null

  const [selectedPlatform, setSelectedPlatform] = useState<ProofPlatform>(
    deliverableType === 'TIKTOK' ? 'TIKTOK' : 'IG_REEL'
  )
  const [url, setUrl] = useState('')
  const [urlTouched, setUrlTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const activePlatform: ProofPlatform =
    deliverableType === 'TIKTOK' ? 'TIKTOK'
    : deliverableType === 'CHOICE' ? selectedPlatform
    : 'IG_REEL'

  const urlValid = validateUrl(url, activePlatform)
  const urlError = urlTouched && url.length > 0 && !urlValid
    ? activePlatform === 'IG_REEL'
      ? 'Must be a valid Instagram Reel URL (instagram.com/reel/...)'
      : 'Must be a valid TikTok video URL (tiktok.com/@.../video/...)'
    : undefined

  const itemsToShow = activeRedemption
    ? activeRedemption.items
    : order?.items.map((i) => ({ name: i.menu_item_name, qty: i.qty })) ?? []

  const restaurantName = activeRedemption?.restaurantName ?? order?.restaurant_name ?? 'Restaurant'

  const handleSubmit = async () => {
    if (!urlValid) { setUrlTouched(true); return }
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 800))
    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] text-white flex flex-col items-center justify-center gap-6 px-6 text-center" style={{ paddingBottom: '80px' }}>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
        >
          <CheckCircle2 className="h-10 w-10 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Proof Submitted!</h2>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed">Under review within 24 hours. We&apos;ll notify you when it&apos;s approved.</p>
        </div>
        <button
          onClick={() => router.push('/discover')}
          className="text-white font-bold rounded-[18px] px-8 py-3.5 text-sm"
          style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
        >
          Back to Discover
        </button>
      </div>
    )
  }

  if (!order && !activeRedemption) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] text-white flex flex-col items-center justify-center gap-4 px-4 text-center" style={{ paddingBottom: '80px' }}>
        <CheckCircle2 className="h-14 w-14 text-green-400" />
        <p className="text-white font-bold text-lg">All caught up!</p>
        <p className="text-sm text-gray-500">You have no pending proofs right now.</p>
        <button
          onClick={() => router.push('/discover')}
          className="text-white font-bold rounded-[18px] px-6 py-2.5 text-sm"
          style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
        >
          Discover Restaurants
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white flex flex-col max-w-[430px] mx-auto">
      {/* Header */}
      <header className="px-4 pt-14 pb-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#1a1a1a] transition-colors">
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <h1 className="text-lg font-bold text-white">Submit Proof</h1>
      </header>

      <div className="flex-1 overflow-y-auto pb-36 space-y-4 px-4">
        {/* Restaurant */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">Comped at</p>
          <p className="text-sm font-bold text-white">{restaurantName}</p>
        </div>

        {/* Items received */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2.5 font-semibold">Items you received</p>
          <ul className="space-y-1.5">
            {itemsToShow.map((item, i) => (
              <li key={i} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{item.name}</span>
                <span className="text-xs font-bold text-gray-500">×{item.qty}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What to post */}
        {deliverableType && (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2.5 font-semibold">What to post</p>
            <div className="flex items-center gap-3 flex-wrap">
              {(deliverableType === 'IG_REEL' || deliverableType === 'BOTH' || deliverableType === 'CHOICE') && (
                <div className="flex items-center gap-1.5">
                  <Instagram className="h-4 w-4 text-pink-400" />
                  <span className="text-sm font-semibold text-white">IG Reel</span>
                </div>
              )}
              {deliverableType === 'BOTH' && <span className="text-gray-500 font-bold">+</span>}
              {(deliverableType === 'TIKTOK' || deliverableType === 'BOTH') && (
                <div className="flex items-center gap-1.5">
                  <Music2 className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-semibold text-white">TikTok</span>
                </div>
              )}
              {deliverableType === 'CHOICE' && <span className="text-sm text-gray-500">(choose below)</span>}
            </div>
            {(order?.deliverable_requirement?.required_hashtags?.length ?? 0) > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {order!.deliverable_requirement!.required_hashtags.map((h) => (
                  <span key={h} className="text-xs bg-white/10 text-gray-300 border border-[#2a2a2a] rounded-lg px-2.5 py-0.5 font-semibold">{h}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Platform selector (CHOICE only) */}
        {deliverableType === 'CHOICE' && (
          <div>
            <p className="text-sm font-semibold text-white mb-2">Select platform</p>
            <div className="flex gap-2">
              {(['IG_REEL', 'TIKTOK'] as ProofPlatform[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => { setSelectedPlatform(p); setUrl(''); setUrlTouched(false) }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border font-semibold text-sm transition-all"
                  style={selectedPlatform === p
                    ? { background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)', border: 'none', color: 'white' }
                    : { background: '#1a1a1a', borderColor: '#2a2a2a', color: '#9ca3af' }
                  }
                >
                  {p === 'IG_REEL' ? <Instagram className="h-4 w-4" /> : <Music2 className="h-4 w-4" />}
                  {p === 'IG_REEL' ? 'IG Reel' : 'TikTok'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* URL Input */}
        <div>
          <p className="text-sm font-semibold text-white mb-2">
            {activePlatform === 'IG_REEL' ? 'Instagram Reel URL' : 'TikTok Video URL'}
          </p>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Link2 className="h-4 w-4" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={() => setUrlTouched(true)}
              placeholder={activePlatform === 'IG_REEL' ? 'https://www.instagram.com/reel/...' : 'https://www.tiktok.com/@yourusername/video/...'}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-[18px] text-white placeholder:text-gray-500 pl-10 pr-4 py-3.5 text-sm outline-none focus:border-white/30 transition-colors"
            />
          </div>
          {urlError && <p className="text-xs text-red-400 mt-1.5">{urlError}</p>}
          <p className="text-xs text-gray-600 mt-1.5">
            {activePlatform === 'IG_REEL' ? 'Must contain instagram.com/reel/' : 'Must contain tiktok.com/@.../video/'}
          </p>
        </div>

        {/* Warning */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-yellow-500" />
          Failure to post within 48 hours will result in a strike.
        </div>
      </div>

      {/* Submit CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-6 pt-3 max-w-[430px] mx-auto bg-[#0B0B0D] border-t border-[#2a2a2a]">
        <button
          onClick={handleSubmit}
          disabled={!urlValid || submitting}
          className="w-full flex items-center justify-center gap-2 text-white font-bold rounded-[18px] py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Submitting...
            </span>
          ) : (
            <>Submit Proof <ChevronRight className="h-4 w-4" /></>
          )}
        </button>
        <p className="text-center text-xs text-gray-600 mt-2">Under admin review within 24 hours</p>
      </div>
    </div>
  )
}
