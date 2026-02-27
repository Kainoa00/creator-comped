'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Modal, ModalFooter } from '@/components/ui/modal'
import { Avatar } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/toast'
import {
  DEMO_CREATORS,
  DEMO_STRIKES,
} from '@/lib/demo-data'
import { relativeTime, formatDate } from '@/lib/utils'
import type { Creator, Strike, StrikeReason } from '@/lib/types'
import {
  Zap,
  Shield,
  Search,
  Plus,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Download,
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

// Extended demo data
const DEMO_ACTIVE_ISSUES: (Creator & { strikes: Strike[] })[] = [
  {
    ...DEMO_CREATORS[1], // Jordan Reyes — 1 strike
    strikes: [DEMO_STRIKES[0]],
  },
  {
    id: 'creator-006',
    name: 'Devon Park',
    photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=devon',
    email: 'devon@example.com',
    phone: null,
    ig_handle: '@devonpark.eats',
    tiktok_handle: '@devonparkeats',
    verified: true,
    invite_code: null,
    strike_count: 2,
    ban_state: 'temporary',
    ban_until: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
    geo_market: 'utah_county',
    created_at: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString(),
    strikes: [
      {
        id: 'strike-002',
        creator_id: 'creator-006',
        reason: 'missed_deadline',
        notes: 'Did not post within 48 hours.',
        admin_id: 'admin-001',
        created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'strike-003',
        creator_id: 'creator-006',
        reason: 'post_removed',
        notes: 'Post was deleted 3 days after submission.',
        admin_id: 'admin-001',
        created_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'creator-007',
    name: 'Yuki Nakamura',
    photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yuki',
    email: 'yuki@example.com',
    phone: null,
    ig_handle: '@yuki.foodtok',
    tiktok_handle: '@yukifoodtok',
    verified: true,
    invite_code: null,
    strike_count: 3,
    ban_state: 'permanent',
    ban_until: null,
    geo_market: 'slc_county',
    created_at: new Date(Date.now() - 120 * 24 * 3600 * 1000).toISOString(),
    strikes: [
      {
        id: 'strike-004',
        creator_id: 'creator-007',
        reason: 'engagement_fraud',
        notes: 'Detected bot engagement on submitted TikTok.',
        admin_id: 'admin-001',
        created_at: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'strike-005',
        creator_id: 'creator-007',
        reason: 'content_violation',
        notes: 'Content promoting competitor. Warned once prior.',
        admin_id: 'admin-001',
        created_at: new Date(Date.now() - 40 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'strike-006',
        creator_id: 'creator-007',
        reason: 'engagement_fraud',
        notes: 'Second confirmed fraud incident. Permanent ban warranted.',
        admin_id: 'admin-001',
        created_at: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
      },
    ],
  },
]

// All strike history
const ALL_STRIKES: (Strike & { creator_name: string })[] = [
  { ...DEMO_STRIKES[0], creator_name: 'Jordan Reyes' },
  { id: 'strike-002', creator_id: 'creator-006', reason: 'missed_deadline', notes: 'Did not post within 48 hours.', admin_id: 'admin-001', created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(), creator_name: 'Devon Park' },
  { id: 'strike-003', creator_id: 'creator-006', reason: 'post_removed', notes: 'Post deleted 3 days after.', admin_id: 'admin-001', created_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(), creator_name: 'Devon Park' },
  { id: 'strike-004', creator_id: 'creator-007', reason: 'engagement_fraud', notes: 'Bot engagement detected.', admin_id: 'admin-001', created_at: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(), creator_name: 'Yuki Nakamura' },
  { id: 'strike-005', creator_id: 'creator-007', reason: 'content_violation', notes: 'Content promoting competitor.', admin_id: 'admin-001', created_at: new Date(Date.now() - 40 * 24 * 3600 * 1000).toISOString(), creator_name: 'Yuki Nakamura' },
  { id: 'strike-006', creator_id: 'creator-007', reason: 'engagement_fraud', notes: 'Second fraud. Permanent ban.', admin_id: 'admin-001', created_at: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(), creator_name: 'Yuki Nakamura' },
]

function StrikeDots({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`h-3 w-3 rounded-full ${i < count ? 'bg-red-500' : 'bg-slate-200'}`}
        />
      ))}
    </div>
  )
}

export default function StrikesPage() {
  const { toast } = useToast()

  const [showIssueModal, setShowIssueModal] = useState(false)
  const [issueCreatorId, setIssueCreatorId] = useState('')
  const [issueReason, setIssueReason] = useState<StrikeReason>('invalid_url')
  const [issueNotes, setIssueNotes] = useState('')

  const [showTempBanModal, setShowTempBanModal] = useState(false)
  const [banCreator, setBanCreator] = useState<Creator | null>(null)
  const [banUntil, setBanUntil] = useState('')

  const [showPermBanModal, setShowPermBanModal] = useState(false)
  const [permBanCreator, setPermBanCreator] = useState<Creator | null>(null)

  const [showLiftModal, setShowLiftModal] = useState(false)
  const [liftCreator, setLiftCreator] = useState<Creator | null>(null)

  const [historySearch, setHistorySearch] = useState('')
  const [loading, setLoading] = useState(false)

  const filteredHistory = ALL_STRIKES.filter((s) =>
    historySearch
      ? s.creator_name.toLowerCase().includes(historySearch.toLowerCase())
      : true
  )

  async function handleIssueStrike() {
    if (!issueCreatorId || !issueNotes.trim()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    setShowIssueModal(false)
    setIssueCreatorId('')
    setIssueNotes('')
    setLoading(false)
    const name = [...DEMO_CREATORS, ...DEMO_ACTIVE_ISSUES].find(
      (c) => c.id === issueCreatorId
    )?.name
    toast({ type: 'error', title: 'Strike Issued', message: `Strike issued to ${name ?? issueCreatorId}.` })
  }

  async function handleTempBan() {
    if (!banUntil) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    setShowTempBanModal(false)
    setBanUntil('')
    setLoading(false)
    toast({ type: 'warning', title: 'Temporary Ban Applied', message: `${banCreator?.name} banned until ${banUntil}.` })
  }

  async function handlePermBan() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    setShowPermBanModal(false)
    setLoading(false)
    toast({ type: 'error', title: 'Permanent Ban Applied', message: `${permBanCreator?.name} has been permanently banned.` })
  }

  async function handleLift() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    setShowLiftModal(false)
    setLoading(false)
    toast({ type: 'success', title: 'Lifted', message: `${liftCreator?.name}'s ban/strike has been lifted.` })
  }

  return (
    <div className="px-8 py-6 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-100 pb-5 -mx-8 px-8 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Strikes & Bans</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Manage creator violations and account restrictions
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setShowIssueModal(true)}
          >
            Issue Strike
          </Button>
        </div>
      </div>

      {/* Section 1: Active Issues */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
          <Zap className="h-4 w-4 text-red-500" />
          <h2 className="text-sm font-semibold text-slate-900">Active Issues</h2>
          <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-md border border-slate-200 text-slate-600 text-xs font-bold">
            {DEMO_ACTIVE_ISSUES.length}
          </span>
        </div>

        <div>
          {DEMO_ACTIVE_ISSUES.map((creator) => {
            const lastStrike = creator.strikes[creator.strikes.length - 1]
            const isBanned = creator.ban_state !== 'none'

            return (
              <div key={creator.id} className="px-5 py-5 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-4 mb-3">
                  {/* Creator info */}
                  <img
                    src={creator.photo_url ?? undefined}
                    alt={creator.name}
                    className="h-10 w-10 rounded-full border border-slate-100 object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-slate-900">{creator.name}</p>
                      {creator.ban_state === 'permanent' && (
                        <span className="border border-slate-200 text-slate-600 rounded-md px-3 py-0.5 text-xs font-semibold">
                          Permanently Banned
                        </span>
                      )}
                      {creator.ban_state === 'temporary' && (
                        <span className="border border-slate-200 text-slate-600 rounded-md px-3 py-0.5 text-xs font-semibold">
                          Temp Ban until {creator.ban_until ? formatDate(creator.ban_until) : '—'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      {creator.ig_handle ?? '—'} · {creator.email}
                    </p>
                  </div>

                  {/* Strike dots */}
                  <div className="flex flex-col items-center gap-1">
                    <StrikeDots count={creator.strike_count} />
                    <span className="text-xs text-slate-400">{creator.strike_count}/3</span>
                  </div>

                  {/* Last violation */}
                  <div className="w-44 min-w-0">
                    <p className="text-xs text-slate-400">Last Violation</p>
                    <p className="text-sm text-slate-700 capitalize truncate">
                      {lastStrike?.reason.replace(/_/g, ' ') ?? '—'}
                    </p>
                    <p className="text-xs text-slate-400">{lastStrike ? relativeTime(lastStrike.created_at) : '—'}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {creator.ban_state === 'none' && (
                      <>
                        <button
                          onClick={() => {
                            setIssueCreatorId(creator.id)
                            setShowIssueModal(true)
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                        >
                          <Zap className="h-3.5 w-3.5" />
                          Strike
                        </button>
                        <button
                          onClick={() => {
                            setBanCreator(creator)
                            setShowTempBanModal(true)
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                        >
                          <Calendar className="h-3.5 w-3.5" />
                          Temp Ban
                        </button>
                        <button
                          onClick={() => {
                            setPermBanCreator(creator)
                            setShowPermBanModal(true)
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                        >
                          <Ban className="h-3.5 w-3.5" />
                          Perm Ban
                        </button>
                      </>
                    )}
                    {isBanned && (
                      <button
                        onClick={() => {
                          setLiftCreator(creator)
                          setShowLiftModal(true)
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Lift Ban
                      </button>
                    )}
                  </div>
                </div>

                {/* Strike list */}
                {creator.strikes.length > 0 && (
                  <div className="ml-14 space-y-1.5">
                    {creator.strikes.map((strike, i) => (
                      <div
                        key={strike.id}
                        className="flex items-start gap-2 border border-slate-200 rounded-lg px-3 py-2"
                      >
                        <span className="text-xs font-bold text-red-500 shrink-0 mt-0.5">#{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-medium text-slate-700 capitalize">
                            {strike.reason.replace(/_/g, ' ')}
                          </span>
                          {strike.notes && (
                            <p className="text-xs text-slate-400 truncate">{strike.notes}</p>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 shrink-0">{relativeTime(strike.created_at)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Section 2: Strike History Log */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900">Strike History</h2>
            <span className="text-xs text-slate-500 font-medium border border-slate-200 rounded-md px-2 py-0.5">
              {ALL_STRIKES.length} total
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by creator..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cc-accent w-48"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Download className="h-4 w-4" />}
              onClick={() => toast({ type: 'info', title: 'Export', message: 'CSV export would download here in production.' })}
            >
              Export CSV
            </Button>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Creator</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Strike #</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Reason</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Admin</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((strike) => {
              const creatorData = DEMO_ACTIVE_ISSUES.find((c) => c.id === strike.creator_id)
              const strikesForCreator = ALL_STRIKES.filter((s) => s.creator_id === strike.creator_id)
              const strikeNum = strikesForCreator.findIndex((s) => s.id === strike.id) + 1

              return (
                <tr key={strike.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={creatorData?.photo_url ?? undefined}
                        alt={strike.creator_name}
                        className="h-6 w-6 rounded-full border border-slate-100"
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                      />
                      <span className="font-medium text-slate-900">{strike.creator_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-md border border-slate-200 text-slate-600 text-xs font-bold">
                      {strikeNum}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-slate-700 capitalize">{strike.reason.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-slate-500">Admin</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-slate-500">{formatDate(strike.created_at)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-slate-400 text-xs truncate max-w-xs block">
                      {strike.notes ?? '—'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Issue Strike Modal */}
      <Modal
        open={showIssueModal}
        onClose={() => setShowIssueModal(false)}
        title="Issue Strike"
        description="Select a creator and provide a reason."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Creator
            </label>
            <select
              value={issueCreatorId}
              onChange={(e) => setIssueCreatorId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-cc-accent"
            >
              <option value="">Select creator...</option>
              {[...DEMO_CREATORS, ...DEMO_ACTIVE_ISSUES.filter(c => !DEMO_CREATORS.find(dc => dc.id === c.id))].map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Reason
            </label>
            <select
              value={issueReason}
              onChange={(e) => setIssueReason(e.target.value as StrikeReason)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-cc-accent"
            >
              {STRIKE_REASONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Notes
            </label>
            <textarea
              value={issueNotes}
              onChange={(e) => setIssueNotes(e.target.value)}
              placeholder="Document the violation..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:border-cc-accent"
            />
          </div>

          <div className="flex items-start gap-2 border border-slate-200 rounded-lg px-3 py-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600">
              Strikes are cumulative. 2 strikes = 7-day ban. 3 strikes = permanent ban.
            </p>
          </div>
        </div>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowIssueModal(false)}>Cancel</Button>
          <Button
            variant="danger"
            loading={loading}
            disabled={!issueCreatorId || !issueNotes.trim()}
            onClick={handleIssueStrike}
            leftIcon={<Zap className="h-4 w-4" />}
          >
            Issue Strike
          </Button>
        </ModalFooter>
      </Modal>

      {/* Temp Ban Modal */}
      <Modal
        open={showTempBanModal}
        onClose={() => setShowTempBanModal(false)}
        title="Temporary Ban"
        description={`Set a temporary ban end date for ${banCreator?.name}.`}
      >
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Ban Until
          </label>
          <input
            type="date"
            value={banUntil}
            onChange={(e) => setBanUntil(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-cc-accent"
          />
        </div>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowTempBanModal(false)}>Cancel</Button>
          <Button
            variant="secondary"
            className="border-amber-300 text-amber-600"
            loading={loading}
            disabled={!banUntil}
            onClick={handleTempBan}
          >
            Apply Temporary Ban
          </Button>
        </ModalFooter>
      </Modal>

      {/* Perm Ban Modal */}
      <Modal
        open={showPermBanModal}
        onClose={() => setShowPermBanModal(false)}
        title="Permanent Ban"
        description="This action cannot be undone without manual reversal."
      >
        <div className="p-4 border border-slate-200 rounded-lg">
          <p className="text-sm text-slate-600">
            You are about to permanently ban{' '}
            <span className="font-bold text-red-600">{permBanCreator?.name}</span>. They will lose
            all access to the CreatorComped network immediately.
          </p>
        </div>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowPermBanModal(false)}>Cancel</Button>
          <Button variant="danger" loading={loading} onClick={handlePermBan} leftIcon={<Ban className="h-4 w-4" />}>
            Permanently Ban
          </Button>
        </ModalFooter>
      </Modal>

      {/* Lift Modal */}
      <Modal
        open={showLiftModal}
        onClose={() => setShowLiftModal(false)}
        title="Lift Ban / Clear Strike"
        description={`Confirm lifting restriction on ${liftCreator?.name}.`}
      >
        <p className="text-sm text-slate-600">
          This will remove the active ban for{' '}
          <span className="font-semibold text-slate-900">{liftCreator?.name}</span> and restore their access.
          Strike count will not be automatically cleared.
        </p>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowLiftModal(false)}>Cancel</Button>
          <Button variant="success" loading={loading} onClick={handleLift} leftIcon={<CheckCircle2 className="h-4 w-4" />}>
            Lift Restriction
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
