'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge, ProofStatusBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import {
  DEMO_PROOF_SUBMISSIONS,
  DEMO_CREATORS,
  DEMO_ORDERS,
} from '@/lib/demo-data'
import { relativeTime, truncate } from '@/lib/utils'
import type { ProofReviewStatus, ProofPlatform } from '@/lib/types'
import {
  Film,
  Search,
  CheckCircle2,
  Copy,
  Check,
  Clock,
} from 'lucide-react'

// Extended demo proofs
const ALL_PROOFS = [
  ...DEMO_PROOF_SUBMISSIONS,
  {
    id: 'proof-003',
    order_id: 'order-003',
    creator_id: 'creator-002',
    platform: 'IG_REEL' as ProofPlatform,
    url: 'https://www.instagram.com/reel/CexampleReel002/',
    screenshot_url: null,
    submitted_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    review_status: 'pending' as ProofReviewStatus,
    reviewer_notes: null,
    deadline: new Date(Date.now() + 20 * 3600 * 1000).toISOString(),
  },
  {
    id: 'proof-004',
    order_id: 'order-004',
    creator_id: 'creator-001',
    platform: 'TIKTOK' as ProofPlatform,
    url: 'https://www.tiktok.com/@miaeatsutah/video/7000000000000000002',
    screenshot_url: null,
    submitted_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    review_status: 'needs_fix' as ProofReviewStatus,
    reviewer_notes: 'Missing required hashtag #CreatorComped in caption.',
    deadline: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
  },
]

type StatusFilter = 'all' | ProofReviewStatus
type PlatformFilter = 'all' | ProofPlatform

// Quick stats
const QUICK_STATS = [
  {
    label: 'Pending',
    value: ALL_PROOFS.filter((p) => p.review_status === 'pending').length,
  },
  {
    label: 'Needs Fix',
    value: ALL_PROOFS.filter((p) => p.review_status === 'needs_fix').length,
  },
  {
    label: 'Approved Today',
    value: 4,
  },
  {
    label: 'Rejected Today',
    value: 1,
  },
]

export default function ProofReviewQueuePage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  function copyUrl(url: string, id: string) {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filtered = useMemo(() => {
    let list = [...ALL_PROOFS]

    if (statusFilter !== 'all') {
      list = list.filter((p) => p.review_status === statusFilter)
    }
    if (platformFilter !== 'all') {
      list = list.filter((p) => p.platform === platformFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) => {
        const creator = DEMO_CREATORS.find((c) => c.id === p.creator_id)
        const order = DEMO_ORDERS.find((o) => o.id === p.order_id)
        return (
          creator?.name.toLowerCase().includes(q) ||
          order?.restaurant_name.toLowerCase().includes(q) ||
          p.url.toLowerCase().includes(q)
        )
      })
    }

    // FIFO: oldest first
    list.sort((a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime())
    return list
  }, [search, statusFilter, platformFilter])

  function isDeadlineSoon(deadline: string) {
    const hoursLeft = (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60)
    return hoursLeft < 24 && hoursLeft > 0
  }

  function isDeadlinePassed(deadline: string) {
    return new Date(deadline).getTime() < Date.now()
  }

  function deadlineLabel(deadline: string) {
    const hoursLeft = (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60)
    if (hoursLeft < 0) return 'Deadline passed'
    if (hoursLeft < 1) return `${Math.round(hoursLeft * 60)}m left`
    if (hoursLeft < 24) return `${Math.round(hoursLeft)}h left`
    return relativeTime(deadline).replace('in ', '')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 pt-6 pb-5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="w-1 self-stretch rounded-full bg-cc-accent shrink-0" />
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Proof Review Queue</h1>
              <p className="text-sm font-semibold text-slate-400 mt-0.5">
                Review creator-submitted content proofs — FIFO order
              </p>
            </div>
          </div>
          {/* Quick stats inline with header */}
          <div className="flex items-center gap-4 flex-wrap justify-end">
            {QUICK_STATS.map((s) => (
              <div key={s.label} className="text-right">
                <p className="text-xl font-black text-slate-900 leading-none">{s.value}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Row — sticky */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-8 py-3">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Status filter */}
        <div className="flex items-center gap-1.5">
          {(['all', 'pending', 'needs_fix', 'approved', 'rejected'] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                statusFilter === s
                  ? 'bg-cc-accent text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {s === 'needs_fix' ? 'Needs Fix' : s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Platform filter */}
        <div className="flex items-center gap-1.5">
          {(['all', 'IG_REEL', 'TIKTOK'] as PlatformFilter[]).map((p) => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                platformFilter === p
                  ? 'bg-cc-accent text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {p === 'all' ? 'All Platforms' : p === 'IG_REEL' ? 'IG Reel' : 'TikTok'}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative ml-auto w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search creator or restaurant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cc-accent transition-colors"
          />
        </div>
      </div>
      </div>

      {/* Queue List */}
      <div className="flex-1 overflow-y-auto px-8 py-5">
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center border border-slate-200 rounded-lg justify-center">
          <CheckCircle2 className="h-8 w-8 text-slate-300" />
          <div>
            <p className="font-semibold text-slate-900">All caught up!</p>
            <p className="text-sm text-slate-400 mt-1">No proofs match your current filters.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((proof) => {
            const creator = DEMO_CREATORS.find((c) => c.id === proof.creator_id)
            const order = DEMO_ORDERS.find((o) => o.id === proof.order_id)
            const deadlineSoon = isDeadlineSoon(proof.deadline)
            const deadlinePassed = isDeadlinePassed(proof.deadline)

            return (
              <div
                key={proof.id}
                className={`bg-white border rounded-lg px-5 py-4 flex items-center gap-4 transition-colors hover:bg-slate-50 cursor-pointer ${
                  deadlinePassed
                    ? 'border-red-200'
                    : deadlineSoon
                    ? 'border-amber-200'
                    : 'border-slate-200'
                }`}
                onClick={() => router.push(`/admin/proof/${proof.id}`)}
              >
                {/* Platform badge */}
                <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded border border-slate-200 text-xs font-semibold text-slate-500">
                  {proof.platform === 'IG_REEL' ? 'IG Reel' : 'TikTok'}
                </span>

                {/* Creator */}
                <div className="flex items-center gap-3 w-44 shrink-0">
                  <Avatar src={creator?.photo_url ?? null} name={creator?.name ?? '?'} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{creator?.name ?? 'Unknown'}</p>
                    <p className="text-xs text-slate-400 truncate">{creator?.ig_handle ?? creator?.tiktok_handle ?? '—'}</p>
                  </div>
                </div>

                {/* Restaurant */}
                <div className="w-36 shrink-0">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Restaurant</p>
                  <p className="text-sm text-slate-700 font-medium truncate">{order?.restaurant_name ?? '—'}</p>
                </div>

                {/* Submitted */}
                <div className="w-24 shrink-0">
                  <p className="text-xs text-slate-400">Submitted</p>
                  <p className="text-sm text-slate-700">{relativeTime(proof.submitted_at)}</p>
                </div>

                {/* Deadline */}
                <div className="w-24 shrink-0">
                  <p className="text-xs text-slate-400">Deadline</p>
                  {proof.review_status === 'pending' || proof.review_status === 'needs_fix' ? (
                    <div className="flex items-center gap-1">
                      <Clock className={`h-3 w-3 ${deadlinePassed ? 'text-red-500' : deadlineSoon ? 'text-amber-500' : 'text-slate-400'}`} />
                      <p className={`text-sm font-medium ${
                        deadlinePassed ? 'text-red-500' : deadlineSoon ? 'text-amber-500' : 'text-slate-400'
                      }`}>
                        {deadlineLabel(proof.deadline)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-300">—</p>
                  )}
                </div>

                {/* URL */}
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <span className="text-xs text-slate-400 truncate font-mono">
                    {truncate(proof.url, 40)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      copyUrl(proof.url, proof.id)
                    }}
                    className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Copy URL"
                  >
                    {copiedId === proof.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                {/* Status */}
                <div className="shrink-0">
                  <ProofStatusBadge status={proof.review_status} />
                </div>

                {/* Action */}
                <div className="shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/admin/proof/${proof.id}`)
                    }}
                    className="bg-cc-accent text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-cc-accent-dark transition-colors"
                  >
                    Review
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
      </div>
    </div>
  )
}
