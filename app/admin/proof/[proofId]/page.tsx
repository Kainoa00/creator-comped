'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge, ProofStatusBadge } from '@/components/ui/badge'
import { Modal, ModalFooter } from '@/components/ui/modal'
import { Avatar } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/toast'
import {
  DEMO_PROOF_SUBMISSIONS,
  DEMO_CREATORS,
  DEMO_ORDERS,
  DEMO_RESTAURANTS,
  DEMO_DELIVERABLE_REQUIREMENTS,
  getLatestSnapshot,
} from '@/lib/demo-data'
import { relativeTime, formatNumber } from '@/lib/utils'
import type { ProofReviewStatus, StrikeReason } from '@/lib/types'
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  CheckSquare,
  Square,
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Play,
} from 'lucide-react'

const STRIKE_REASONS: { value: StrikeReason; label: string }[] = [
  { value: 'missed_deadline', label: 'Missed Deadline' },
  { value: 'invalid_url', label: 'Invalid URL' },
  { value: 'account_private', label: 'Account Private' },
  { value: 'post_removed', label: 'Post Removed' },
  { value: 'content_violation', label: 'Content Violation' },
  { value: 'engagement_fraud', label: 'Engagement Fraud' },
  { value: 'other', label: 'Other' },
]

// Extended proof data for demo
const ALL_PROOFS: typeof DEMO_PROOF_SUBMISSIONS = [
  ...DEMO_PROOF_SUBMISSIONS,
  {
    id: 'proof-003',
    order_id: 'order-003',
    creator_id: 'creator-002',
    platform: 'IG_REEL',
    url: 'https://www.instagram.com/reel/CexampleReel002/',
    screenshot_url: null,
    submitted_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    review_status: 'pending',
    reviewer_notes: null,
    deadline: new Date(Date.now() + 20 * 3600 * 1000).toISOString(),
  },
  {
    id: 'proof-004',
    order_id: 'order-004',
    creator_id: 'creator-001',
    platform: 'TIKTOK',
    url: 'https://www.tiktok.com/@miaeatsutah/video/7000000000000000002',
    screenshot_url: null,
    submitted_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    review_status: 'needs_fix',
    reviewer_notes: 'Missing required hashtag #HIVE in caption.',
    deadline: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
  },
]

const CHECKLIST_ITEMS = [
  'Mentions restaurant name (spoken or on-screen)',
  'Shows storefront, signage, or interior',
  'Shows each comped menu item',
  'Uses required hashtags',
  'Tags restaurant account',
  'Post is public and accessible',
  'Correct platform format (Reel/TikTok video, not story/post)',
]

export default function ProofReviewDetailPage() {
  const { proofId } = useParams<{ proofId: string }>()
  const router = useRouter()
  const { toast } = useToast()

  const proof = ALL_PROOFS.find((p) => p.id === proofId) ?? ALL_PROOFS[0]
  const creator = DEMO_CREATORS.find((c) => c.id === proof.creator_id)
  const order = DEMO_ORDERS.find((o) => o.id === proof.order_id)
  const restaurant = DEMO_RESTAURANTS.find((r) => r.id === order?.restaurant_id)
  const deliverable = DEMO_DELIVERABLE_REQUIREMENTS.find((d) => d.restaurant_id === order?.restaurant_id)
  const snapshot = getLatestSnapshot(proof.id)

  const [checklist, setChecklist] = useState<boolean[]>(Array(CHECKLIST_ITEMS.length).fill(false))
  const [reviewNotes, setReviewNotes] = useState(proof.reviewer_notes ?? '')
  const [creatorMessage, setCreatorMessage] = useState('')
  const [strikeReason, setStrikeReason] = useState<StrikeReason>('invalid_url')
  const [strikeNotes, setStrikeNotes] = useState('')
  const [reviewStatus, setReviewStatus] = useState<ProofReviewStatus>(proof.review_status)
  const [urlCopied, setUrlCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showNeedsFixModal, setShowNeedsFixModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)

  function copyUrl() {
    navigator.clipboard.writeText(proof.url)
    setUrlCopied(true)
    setTimeout(() => setUrlCopied(false), 2000)
  }

  function toggleCheck(i: number) {
    setChecklist((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
  }

  const allChecked = checklist.every(Boolean)
  const checkedCount = checklist.filter(Boolean).length

  async function handleApprove() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    setReviewStatus('approved')
    setShowApproveModal(false)
    setLoading(false)
    toast({ type: 'success', title: 'Proof Approved', message: 'Creator has been notified.' })
  }

  async function handleNeedsFix() {
    if (!creatorMessage.trim()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    setReviewStatus('needs_fix')
    setShowNeedsFixModal(false)
    setLoading(false)
    toast({ type: 'warning', title: 'Needs Fix Sent', message: 'Creator notified with instructions.' })
  }

  async function handleRejectStrike() {
    if (!strikeNotes.trim()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    setReviewStatus('rejected')
    setShowRejectModal(false)
    setLoading(false)
    toast({ type: 'error', title: 'Rejected + Strike Issued', message: `Strike issued: ${strikeReason.replace('_', ' ')}` })
  }

  function deadlineLabel() {
    const hoursLeft = (new Date(proof.deadline).getTime() - Date.now()) / (1000 * 60 * 60)
    if (hoursLeft < 0) return { text: 'Deadline passed', color: 'text-red-500' }
    if (hoursLeft < 6) return { text: `${Math.round(hoursLeft)}h left — URGENT`, color: 'text-red-500' }
    if (hoursLeft < 24) return { text: `${Math.round(hoursLeft)}h remaining`, color: 'text-amber-500' }
    return { text: `${Math.round(hoursLeft)}h remaining`, color: 'text-slate-500' }
  }

  const dl = deadlineLabel()

  return (
    <div className="px-8 py-6">
      {/* Header */}
      <div className="border-b border-slate-100 pb-5 -mx-8 px-8 mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-start gap-3">
            <div className="w-1 self-stretch rounded-full bg-cc-accent shrink-0" />
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Proof Review</h1>
              <p className="text-sm text-slate-400 font-medium">#{proof.id}</p>
            </div>
          </div>
          <div className="ml-auto">
            <ProofStatusBadge status={reviewStatus} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Left Panel: Context */}
        <div className="col-span-3 space-y-4">
          {/* Creator card */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Creator</p>
            <div className="flex items-center gap-3 mb-4">
              <Avatar src={creator?.photo_url ?? null} name={creator?.name ?? '?'} size="md" />
              <div>
                <p className="font-bold text-slate-900 text-base">{creator?.name ?? 'Unknown'}</p>
                <p className="text-xs text-slate-400">{creator?.ig_handle ?? creator?.tiktok_handle ?? '—'}</p>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Strikes</span>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className={`h-2.5 w-2.5 rounded-full ${
                        i < (creator?.strike_count ?? 0) ? 'bg-red-500' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Ban State</span>
                <Badge
                  variant={creator?.ban_state === 'none' ? 'success' : 'error'}
                  size="sm"
                >
                  {creator?.ban_state ?? 'none'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Order details */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Order</p>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-slate-400">Restaurant</span>
              <span className="text-sm font-semibold text-slate-900">{order?.restaurant_name ?? '—'}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-slate-400">Items Ordered</span>
              {order?.items.map((item) => (
                <span key={item.menu_item_id} className="text-sm text-slate-700">
                  {item.qty}× {item.menu_item_name}
                </span>
              ))}
            </div>
            {order?.confirmed_at && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-slate-400">Confirmed At</span>
                <span className="text-sm text-slate-700">{relativeTime(order.confirmed_at)}</span>
              </div>
            )}
          </div>

          {/* Deliverable requirements */}
          {deliverable && (
            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Requirements
              </p>
              <div className="space-y-2.5">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-slate-400">Platform</span>
                  <Badge variant="info" size="sm" className="self-start">{deliverable.allowed_types}</Badge>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-slate-400">Hashtags</span>
                  <div className="flex flex-wrap gap-1">
                    {deliverable.required_hashtags.map((h) => (
                      <span key={h} className="text-xs border border-slate-200 rounded-md px-2 py-0.5 text-slate-600 font-mono">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-slate-400">Tags</span>
                  <div className="flex flex-wrap gap-1">
                    {deliverable.required_tags.map((t) => (
                      <span key={t} className="text-xs border border-slate-200 rounded-md px-2 py-0.5 text-slate-600 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submission info */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Submission
            </p>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-slate-400">Platform</span>
              <span className="inline-flex self-start items-center px-2 py-0.5 rounded-md text-xs font-bold border border-slate-200 text-slate-600">
                {proof.platform === 'IG_REEL' ? 'IG Reel' : 'TikTok'}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-slate-400">Submitted</span>
              <span className="text-sm text-slate-700">{relativeTime(proof.submitted_at)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-slate-400">Deadline</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span className={`text-sm font-medium ${dl.color}`}>{dl.text}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel: Content Preview */}
        <div className="col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Content Preview</p>

            {/* URL Display */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
              <p className="text-xs text-slate-400 mb-2">Submission URL</p>
              <div className="flex items-start gap-2">
                <p className="flex-1 text-sm font-mono text-slate-900 break-all leading-relaxed">{proof.url}</p>
                <button
                  onClick={copyUrl}
                  className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  {urlCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Open in tab CTA */}
            <a
              href={proof.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-cc-accent text-white rounded-lg font-semibold text-sm hover:bg-cc-accent-dark transition-colors mb-4"
            >
              <ExternalLink className="h-4 w-4" />
              Open in New Tab
            </a>

            {/* Preview card with play button overlay */}
            <div className="relative border border-dashed border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 p-10 text-center">
                <div className="relative inline-flex items-center justify-center mb-3">
                  <div className="h-16 w-16 rounded-lg border border-slate-200 bg-white flex items-center justify-center">
                    <Play className="h-7 w-7 text-slate-400 ml-0.5" />
                  </div>
                </div>
                <p className="text-sm font-semibold text-slate-700">Embed Preview Unavailable</p>
                <p className="text-xs text-slate-400 mt-1">
                  {proof.platform === 'IG_REEL' ? 'Instagram' : 'TikTok'} blocks iframe embedding.
                  <br />
                  Use the link above to review the content.
                </p>
              </div>
            </div>

            {/* Analytics snapshot if available */}
            {snapshot && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Analytics Snapshot
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { icon: <Eye className="h-4 w-4" />, label: 'Views', value: formatNumber(snapshot.views) },
                    { icon: <Heart className="h-4 w-4" />, label: 'Likes', value: formatNumber(snapshot.likes) },
                    { icon: <MessageCircle className="h-4 w-4" />, label: 'Comments', value: formatNumber(snapshot.comments) },
                    { icon: <Share2 className="h-4 w-4" />, label: 'Shares', value: formatNumber(snapshot.shares) },
                  ].map((stat) => (
                    <div key={stat.label} className="border border-slate-200 rounded-lg p-3 text-center">
                      <div className="flex justify-center text-slate-400 mb-1">{stat.icon}</div>
                      <p className="text-base font-bold text-slate-900">{stat.value}</p>
                      <p className="text-xs text-slate-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Contest score: <span className="font-mono font-bold text-cc-accent">{formatNumber(snapshot.score)}</span>
                  </span>
                  <span className="text-xs text-slate-400">Snapshot {relativeTime(snapshot.timestamp)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Reviewer Notes */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <p className="text-sm font-semibold text-slate-900 mb-2">Reviewer Notes</p>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Internal notes about this proof..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:border-cc-accent"
            />
          </div>
        </div>

        {/* Right Panel: Checklist + Actions */}
        <div className="col-span-4 space-y-4">
          {/* Quality Checklist */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-slate-900">Quality Checklist</p>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md border border-slate-200 text-slate-500">
                {checkedCount}/{CHECKLIST_ITEMS.length}
              </span>
            </div>

            <div className="space-y-1.5">
              {CHECKLIST_ITEMS.map((item, i) => {
                const displayItem =
                  i === 3 && deliverable
                    ? `Uses required hashtags: ${deliverable.required_hashtags.join(', ')}`
                    : item

                return (
                  <button
                    key={i}
                    onClick={() => toggleCheck(i)}
                    className={`w-full flex items-start gap-3 py-3 px-3 rounded-lg text-left transition-all border ${
                      checklist[i]
                        ? 'bg-slate-50 border-slate-200'
                        : 'border-transparent hover:bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    {checklist[i] ? (
                      <CheckSquare className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="h-4 w-4 text-slate-300 shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`text-sm leading-snug ${
                        checklist[i] ? 'text-slate-400 line-through' : 'text-slate-700'
                      }`}
                    >
                      {displayItem}
                    </span>
                  </button>
                )
              })}
            </div>

            {allChecked && (
              <div className="mt-3 flex items-center gap-2 text-slate-600 text-sm border border-slate-200 rounded-lg px-3 py-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                All items checked — ready to approve
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {reviewStatus !== 'pending' && reviewStatus !== 'needs_fix' ? (
            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <p className="text-sm font-bold text-slate-900 mb-3">Decision Recorded</p>
              <ProofStatusBadge status={reviewStatus} />
              {reviewNotes && (
                <p className="mt-3 text-sm text-slate-500 italic">"{reviewNotes}"</p>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
              <p className="text-sm font-bold text-slate-900 mb-1">Review Decision</p>

              <button
                onClick={() => setShowApproveModal(true)}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white rounded-lg py-4 font-bold text-base hover:bg-emerald-600 transition-colors"
              >
                <CheckCircle2 className="h-5 w-5" />
                Approve
              </button>

              <button
                onClick={() => setShowNeedsFixModal(true)}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white rounded-lg py-4 font-bold text-base hover:bg-amber-600 transition-colors"
              >
                <AlertTriangle className="h-5 w-5" />
                Needs Fix
              </button>

              <button
                onClick={() => setShowRejectModal(true)}
                className="w-full flex items-center justify-center gap-2 bg-red-500 text-white rounded-lg py-4 font-bold text-base hover:bg-red-600 transition-colors"
              >
                <XCircle className="h-5 w-5" />
                Reject + Strike
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Approve Modal */}
      <Modal
        open={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Approve Proof"
        description="This will approve the submission and enter it into the contest."
      >
        <div className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          <p className="text-sm text-slate-600">
            Proof from <span className="font-semibold text-slate-900">{creator?.name}</span> will be approved
            and their score will count toward the monthly leaderboard.
          </p>
        </div>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowApproveModal(false)}>Cancel</Button>
          <Button variant="success" loading={loading} onClick={handleApprove}>
            Confirm Approval
          </Button>
        </ModalFooter>
      </Modal>

      {/* Needs Fix Modal */}
      <Modal
        open={showNeedsFixModal}
        onClose={() => setShowNeedsFixModal(false)}
        title="Request Fix"
        description="Send a message to the creator explaining what needs to be fixed."
      >
        <div className="space-y-3">
          <textarea
            value={creatorMessage}
            onChange={(e) => setCreatorMessage(e.target.value)}
            placeholder="Explain what the creator needs to fix (e.g., missing hashtag, private account)..."
            rows={4}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:border-cc-accent"
          />
          <p className="text-xs text-slate-400">Creator will have 24 hours to resubmit.</p>
        </div>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowNeedsFixModal(false)}>Cancel</Button>
          <Button
            variant="secondary"
            className="border-amber-300 text-amber-600"
            loading={loading}
            disabled={!creatorMessage.trim()}
            onClick={handleNeedsFix}
          >
            Send Fix Request
          </Button>
        </ModalFooter>
      </Modal>

      {/* Reject + Strike Modal */}
      <Modal
        open={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Proof + Issue Strike"
        description="This will reject the submission and automatically issue a strike to the creator."
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg">
            <Zap className="h-4 w-4 text-red-500 shrink-0" />
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{creator?.name}</span> will receive a strike.{' '}
              {(creator?.strike_count ?? 0) + 1 >= 3
                ? 'This will result in a PERMANENT BAN.'
                : (creator?.strike_count ?? 0) + 1 >= 2
                ? 'This will trigger a 7-day temporary ban.'
                : 'They currently have no active ban.'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Strike Reason
            </label>
            <select
              value={strikeReason}
              onChange={(e) => setStrikeReason(e.target.value as StrikeReason)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-cc-accent"
            >
              {STRIKE_REASONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Notes (required)
            </label>
            <textarea
              value={strikeNotes}
              onChange={(e) => setStrikeNotes(e.target.value)}
              placeholder="Document why this proof is being rejected..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:border-cc-accent"
            />
          </div>
        </div>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowRejectModal(false)}>Cancel</Button>
          <Button
            variant="danger"
            loading={loading}
            disabled={!strikeNotes.trim()}
            onClick={handleRejectStrike}
            leftIcon={<Zap className="h-4 w-4" />}
          >
            Reject + Issue Strike
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
