'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Instagram,
  Music2,
  Lock,
  CheckCircle2,
  Link2,
  ChevronRight,
  Utensils,
  AlertTriangle,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { CountdownCard } from '@/components/ui/countdown'
import { CCLogoWithMark } from '@/components/cc-logo'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import {
  DEMO_ORDERS,
  DEMO_RESTAURANTS,
} from '@/lib/demo-data'
import type { Order, ProofPlatform, DeliverableType } from '@/lib/types'

// ── URL Validation ─────────────────────────────────────────────

function validateIgReel(url: string): boolean {
  return url.includes('instagram.com/reel/')
}

function validateTikTok(url: string): boolean {
  return url.includes('tiktok.com/@') && url.includes('/video/')
}

function validateUrl(url: string, platform: ProofPlatform): boolean {
  if (!url.trim()) return false
  return platform === 'IG_REEL' ? validateIgReel(url) : validateTikTok(url)
}

// ── Platform pill selector ─────────────────────────────────────

function PlatformPill({
  platform,
  selected,
  onClick,
}: {
  platform: ProofPlatform
  selected: boolean
  onClick: () => void
}) {
  const isIG = platform === 'IG_REEL'
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border font-bold text-sm transition-all',
        selected
          ? 'border-hive-accent bg-hive-accent text-white'
          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
      )}
    >
      {isIG ? (
        <Instagram className="h-4 w-4" />
      ) : (
        <Music2 className="h-4 w-4" />
      )}
      {isIG ? 'IG Reel' : 'TikTok'}
    </button>
  )
}

// ── Main page ─────────────────────────────────────────────────

export default function ProofPage() {
  const router = useRouter()
  const { toast } = useToast()

  const order: Order | undefined = DEMO_ORDERS.find(
    (o) => o.creator_id === 'creator-001' && o.status === 'confirmed'
  )

  const deliverableType: DeliverableType | null =
    order?.deliverable_requirement?.allowed_types ?? null

  const [selectedPlatform, setSelectedPlatform] = useState<ProofPlatform>(
    deliverableType === 'TIKTOK' ? 'TIKTOK' : 'IG_REEL'
  )

  const [url, setUrl] = useState('')
  const [urlTouched, setUrlTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const platformsRequired: ProofPlatform[] = useMemo(() => {
    if (!deliverableType) return []
    if (deliverableType === 'IG_REEL') return ['IG_REEL']
    if (deliverableType === 'TIKTOK') return ['TIKTOK']
    if (deliverableType === 'CHOICE') return ['IG_REEL', 'TIKTOK']
    if (deliverableType === 'BOTH') return ['IG_REEL', 'TIKTOK']
    return []
  }, [deliverableType])

  const activePlatform: ProofPlatform =
    deliverableType === 'CHOICE'
      ? selectedPlatform
      : deliverableType === 'TIKTOK'
      ? 'TIKTOK'
      : 'IG_REEL'

  const urlValid = validateUrl(url, activePlatform)
  const urlError =
    urlTouched && url.length > 0 && !urlValid
      ? activePlatform === 'IG_REEL'
        ? 'Must be a valid Instagram Reel URL (instagram.com/reel/...)'
        : 'Must be a valid TikTok video URL (tiktok.com/@.../video/...)'
      : undefined

  const deadline = useMemo(() => {
    if (!order?.confirmed_at) return new Date(Date.now() + 48 * 3600 * 1000).toISOString()
    return new Date(new Date(order.confirmed_at).getTime() + 48 * 60 * 60 * 1000).toISOString()
  }, [order?.confirmed_at])

  const restaurant = DEMO_RESTAURANTS.find((r) => r.id === order?.restaurant_id)

  const handleSubmit = async () => {
    if (!urlValid) {
      setUrlTouched(true)
      return
    }
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 800))
    setSubmitting(false)

    toast({
      type: 'success',
      title: 'Proof submitted!',
      message: 'Under review within 24 hours.',
      duration: 6000,
    })

    router.replace('/creator/discover')
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-4 max-w-sm mx-auto text-center">
        <CheckCircle2 className="h-14 w-14 text-emerald-500" />
        <p className="text-slate-900 font-bold text-lg">All caught up!</p>
        <p className="text-sm text-slate-500">You have no pending proofs right now.</p>
        <button
          onClick={() => router.push('/creator/discover')}
          className="bg-hive-accent text-white font-bold rounded-xl px-6 py-2.5 text-sm hover:bg-hive-accent-dark transition-colors"
        >
          Discover Restaurants
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-sm mx-auto md:max-w-2xl">
      {/* Locked header */}
      <header className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-slate-100">
        <CCLogoWithMark size="sm" />
        <div className="flex items-center gap-1.5 border border-slate-200 rounded-md px-3 py-1">
          <Lock className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-xs font-bold text-slate-600">Post Required</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-36 space-y-5 pt-5">
        {/* Restaurant */}
        <div className="px-4">
          <div className="bg-slate-50 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <Utensils className="h-4 w-4 text-hive-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{order.restaurant_name}</p>
              {restaurant && (
                <p className="text-xs text-slate-500 truncate mt-0.5">{restaurant.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* 48h Countdown */}
        <div className="px-4">
          <CountdownCard
            deadline={deadline}
            label="Time remaining to submit proof"
          />
        </div>

        {/* Items comped */}
        <div className="px-4">
          <div className="bg-white border border-slate-200 rounded-lg px-4 py-3">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2.5 font-bold">
              Items you received
            </p>
            <ul className="space-y-1.5">
              {order.items.map((item, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">{item.menu_item_name}</span>
                  <span className="text-xs font-bold text-slate-500">×{item.qty}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Deliverable box */}
        {deliverableType && (
          <div className="px-4">
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-bold">
                What you need to post
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {platformsRequired.includes('IG_REEL') && (
                  <div className="flex items-center gap-1.5">
                    <Instagram className="h-4 w-4 text-pink-500" />
                    <span className="text-sm font-bold text-slate-800">IG Reel</span>
                  </div>
                )}
                {deliverableType === 'BOTH' && (
                  <span className="text-slate-400 font-bold">+</span>
                )}
                {platformsRequired.includes('TIKTOK') && deliverableType !== 'CHOICE' && (
                  <div className="flex items-center gap-1.5">
                    <Music2 className="h-4 w-4 text-slate-700" />
                    <span className="text-sm font-bold text-slate-800">TikTok</span>
                  </div>
                )}
                {deliverableType === 'CHOICE' && (
                  <span className="text-sm text-slate-500">(choose below)</span>
                )}
              </div>
              {(order.deliverable_requirement?.required_hashtags?.length ?? 0) > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {order.deliverable_requirement!.required_hashtags.map((h) => (
                    <span
                      key={h}
                      className="text-xs bg-white text-slate-600 border border-slate-200 rounded-md px-2.5 py-0.5 font-bold"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Platform selector (CHOICE only) */}
        {deliverableType === 'CHOICE' && (
          <div className="px-4">
            <p className="text-sm font-bold text-slate-900 mb-2">Select platform to submit</p>
            <div className="flex gap-2">
              <PlatformPill
                platform="IG_REEL"
                selected={selectedPlatform === 'IG_REEL'}
                onClick={() => {
                  setSelectedPlatform('IG_REEL')
                  setUrl('')
                  setUrlTouched(false)
                }}
              />
              <PlatformPill
                platform="TIKTOK"
                selected={selectedPlatform === 'TIKTOK'}
                onClick={() => {
                  setSelectedPlatform('TIKTOK')
                  setUrl('')
                  setUrlTouched(false)
                }}
              />
            </div>
          </div>
        )}

        {/* URL Input */}
        <div className="px-4">
          <Input
            label={activePlatform === 'IG_REEL' ? 'Instagram Reel URL' : 'TikTok Video URL'}
            placeholder={
              activePlatform === 'IG_REEL'
                ? 'https://www.instagram.com/reel/...'
                : 'https://www.tiktok.com/@yourusername/video/...'
            }
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={() => setUrlTouched(true)}
            error={urlError}
            hint={
              activePlatform === 'IG_REEL'
                ? 'Must contain instagram.com/reel/'
                : 'Must contain tiktok.com/@.../video/'
            }
            leftAddon={<Link2 className="h-4 w-4 text-slate-400" />}
          />
        </div>

        {/* Warning — understated */}
        <div className="px-4">
          <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            Failure to post within 48 hours will result in a strike.
          </p>
        </div>
      </div>

      {/* Submit CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-6 max-w-sm mx-auto bg-white border-t border-slate-100 pt-3">
        <button
          onClick={handleSubmit}
          disabled={!urlValid || submitting}
          className={cn(
            'w-full flex items-center justify-center gap-2 bg-hive-accent text-white font-bold rounded-lg py-3.5 text-sm transition-all',
            'hover:bg-hive-accent-dark',
            (!urlValid || submitting) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Submitting...
            </span>
          ) : (
            <>
              Submit Proof
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
        <p className="text-center text-xs text-slate-400 mt-2">
          Under admin review within 24 hours
        </p>
      </div>
    </div>
  )
}
