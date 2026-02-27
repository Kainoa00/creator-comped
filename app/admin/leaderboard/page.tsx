'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Modal, ModalFooter } from '@/components/ui/modal'
import { useToast } from '@/components/ui/toast'
import {
  DEMO_CONTEST_ENTRIES,
} from '@/lib/demo-data'
import { formatNumber, currentMonthKey } from '@/lib/utils'
import type { ContestEntry, ProofPlatform } from '@/lib/types'
import {
  Trophy,
  Lock,
  ChevronLeft,
  ChevronRight,
  XCircle,
  CheckCircle2,
  ExternalLink,
  CreditCard,
  AlertTriangle,
} from 'lucide-react'

// Prize structure
const PRIZE_TIERS = [
  { rank: 1, label: '1st Place', amount: '$500', icon: '🥇' },
  { rank: 2, label: '2nd Place', amount: '$250', icon: '🥈' },
  { rank: 3, label: '3rd Place', amount: '$100', icon: '🥉' },
  { rank: 4, label: '4th–10th Place', amount: '$25 each', icon: '🏅' },
]

function monthLabel(key: string) {
  const [y, m] = key.split('-')
  const d = new Date(Number(y), Number(m) - 1)
  return d.toLocaleString('default', { month: 'long', year: 'numeric' })
}

function prevMonth(key: string) {
  const [y, m] = key.split('-').map(Number)
  const d = new Date(y, m - 2)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function nextMonth(key: string) {
  const [y, m] = key.split('-').map(Number)
  const d = new Date(y, m)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function daysLeftInMonth() {
  const now = new Date()
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return last.getDate() - now.getDate()
}

// Extended leaderboard data
const EXTENDED_ENTRIES: ContestEntry[] = [
  ...DEMO_CONTEST_ENTRIES,
  {
    id: 'contest-006',
    proof_id: 'proof-007',
    creator_id: 'creator-006',
    creator_name: 'Devon Park',
    creator_photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=devon',
    month: '2026-02',
    platform: 'IG_REEL',
    score: 18200,
    eligible: true,
    disqualified: false,
    disqualification_reason: null,
  },
  {
    id: 'contest-007',
    proof_id: 'proof-008',
    creator_id: 'creator-007',
    creator_name: 'Yuki Nakamura',
    creator_photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yuki',
    month: '2026-02',
    platform: 'TIKTOK',
    score: 15600,
    eligible: false,
    disqualified: true,
    disqualification_reason: 'Engagement fraud detected. Removed from eligibility.',
  },
]

type PaymentStatus = 'pending' | 'paid' | 'na'
interface PaymentState { [entryId: string]: PaymentStatus }

export default function LeaderboardPage() {
  const { toast } = useToast()
  const [monthKey, setMonthKey] = useState(currentMonthKey())
  const [activeTab, setActiveTab] = useState<ProofPlatform>('IG_REEL')
  const [showLockModal, setShowLockModal] = useState(false)
  const [showDQModal, setShowDQModal] = useState(false)
  const [showReinstate, setShowReinstate] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<ContestEntry | null>(null)
  const [dqReason, setDqReason] = useState('')
  const [paymentStatus, setPaymentStatus] = useState<PaymentState>({})
  const [loading, setLoading] = useState(false)
  const [locked, setLocked] = useState(false)

  const currentMonth = currentMonthKey()
  const isCurrentMonth = monthKey === currentMonth

  const allEntries = EXTENDED_ENTRIES.filter(
    (e) => e.month === monthKey && e.platform === activeTab
  ).sort((a, b) => b.score - a.score)

  async function handleLock() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLocked(true)
    setShowLockModal(false)
    setLoading(false)
    toast({ type: 'success', title: 'Contest Locked', message: 'Scores have been frozen at this snapshot.' })
  }

  async function handleDisqualify() {
    if (!dqReason.trim()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    setShowDQModal(false)
    setDqReason('')
    setLoading(false)
    toast({ type: 'warning', title: 'Creator Disqualified', message: `${selectedEntry?.creator_name} removed from leaderboard.` })
  }

  async function handleReinstate() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    setShowReinstate(false)
    setLoading(false)
    toast({ type: 'success', title: 'Creator Reinstated', message: `${selectedEntry?.creator_name} is back on the leaderboard.` })
  }

  function togglePayment(entryId: string) {
    setPaymentStatus((prev) => ({
      ...prev,
      [entryId]: prev[entryId] === 'paid' ? 'pending' : 'paid',
    }))
  }

  function getRankDisplay(rank: number) {
    if (rank === 1) return { display: '🥇', isTop3: true }
    if (rank === 2) return { display: '🥈', isTop3: true }
    if (rank === 3) return { display: '🥉', isTop3: true }
    return { display: `#${rank}`, isTop3: false }
  }

  function getPrize(rank: number) {
    if (rank === 1) return '$500'
    if (rank === 2) return '$250'
    if (rank === 3) return '$100'
    if (rank <= 10) return '$25'
    return null
  }

  return (
    <div className="px-8 py-6 space-y-5">
      {/* Header */}
      <div className="border-b border-slate-100 pb-5 -mx-8 px-8 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Contest Leaderboard</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Monthly creator rankings by engagement score
            </p>
          </div>
          <div className="flex items-center gap-3">
            {locked && (
              <span className="inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 text-sm font-medium px-3 py-1.5 rounded-md">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                Locked Snapshot
              </span>
            )}
            {isCurrentMonth && !locked && (
              <Button
                variant="primary"
                leftIcon={<Lock className="h-4 w-4" />}
                onClick={() => setShowLockModal(true)}
              >
                Lock Snapshot
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Month Navigator + Prize info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMonthKey(prevMonth(monthKey))}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="text-center">
            <p className="text-lg font-bold text-slate-900">{monthLabel(monthKey)}</p>
            {isCurrentMonth && (
              <p className="text-xs text-slate-400">{daysLeftInMonth()} days remaining</p>
            )}
          </div>
          <button
            onClick={() => setMonthKey(nextMonth(monthKey))}
            disabled={monthKey >= currentMonthKey()}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Prize tiers */}
        <div className="flex items-center gap-3">
          {PRIZE_TIERS.map((t) => (
            <div key={t.rank} className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-3 py-1.5">
              <span className="text-sm">{t.icon}</span>
              <span className="text-sm font-semibold text-slate-900 font-mono">{t.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Tabs */}
      <div className="flex gap-1.5 border border-slate-200 rounded-lg p-1 w-fit">
        {(['IG_REEL', 'TIKTOK'] as ProofPlatform[]).map((platform) => (
          <button
            key={platform}
            onClick={() => setActiveTab(platform)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === platform
                ? 'bg-cc-accent text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {platform === 'IG_REEL' ? 'IG Reel' : 'TikTok'}
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden min-h-[500px]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-16">Rank</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Creator</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Score</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Eligible</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Prize</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Payment</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allEntries.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Trophy className="h-10 w-10 text-slate-200" />
                    <p className="font-semibold text-slate-900">No entries for this month</p>
                    <p className="text-sm text-slate-400">Entries will appear once proofs are approved.</p>
                  </div>
                </td>
              </tr>
            ) : (
              allEntries.map((entry, idx) => {
                const rank = idx + 1
                const rankDisplay = getRankDisplay(rank)
                const prize = getPrize(rank)
                const payStatus: PaymentStatus = paymentStatus[entry.id] ?? (entry.disqualified || !entry.eligible ? 'na' : 'pending')

                return (
                  <tr
                    key={entry.id}
                    className={`border-b border-slate-100 transition-colors ${
                      rankDisplay.isTop3
                        ? 'bg-blue-50/20 hover:bg-blue-50/40'
                        : 'hover:bg-slate-50/50'
                    } ${entry.disqualified ? 'opacity-40' : ''}`}
                  >
                    <td className="px-4 py-4">
                      {rankDisplay.isTop3 ? (
                        <span className="text-xl">{rankDisplay.display}</span>
                      ) : (
                        <span className="text-2xl font-black text-slate-200">{rankDisplay.display}</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={entry.creator_photo ?? undefined}
                          alt={entry.creator_name}
                          className="h-8 w-8 rounded-full border border-slate-100 object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none' }}
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{entry.creator_name}</p>
                          <p className="text-xs text-slate-400">{entry.creator_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="font-mono font-bold text-cc-accent">{formatNumber(entry.score)}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {entry.eligible && !entry.disqualified ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" />
                      ) : (
                        <span className="text-slate-300 text-lg">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {entry.disqualified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border border-slate-200 text-slate-500">
                          Disqualified
                        </span>
                      ) : entry.eligible ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border border-slate-200 text-slate-600">
                          Eligible
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border border-slate-200 text-slate-500">
                          Ineligible
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {prize && !entry.disqualified && entry.eligible ? (
                        <span className="font-mono text-emerald-600 font-semibold">{prize}</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {prize && !entry.disqualified && entry.eligible ? (
                        <button
                          onClick={() => togglePayment(entry.id)}
                          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border transition-colors ${
                            payStatus === 'paid'
                              ? 'border-slate-200 text-slate-600'
                              : 'border-slate-200 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          <CreditCard className="h-3 w-3" />
                          {payStatus === 'paid' ? 'Paid' : 'Pending'}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-300">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/admin/proof/${entry.proof_id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="View proof"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        {!entry.disqualified ? (
                          <button
                            onClick={() => {
                              setSelectedEntry(entry)
                              setShowDQModal(true)
                            }}
                            className="px-2 py-1 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 transition-colors"
                          >
                            DQ
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedEntry(entry)
                              setShowReinstate(true)
                            }}
                            className="px-2 py-1 rounded-lg border border-emerald-200 text-emerald-600 text-xs font-medium hover:bg-emerald-50 transition-colors"
                          >
                            Reinstate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Payout note */}
      <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-500">
        <CreditCard className="h-4 w-4 text-slate-400 shrink-0" />
        <span>
          <strong className="text-slate-900">Stripe integration coming in v2.</strong> Payments are currently tracked manually. Use the payment toggle above to mark winners.
        </span>
      </div>

      {/* Reset note */}
      <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
        <Trophy className="h-4 w-4 text-slate-300 shrink-0" />
        <span>Leaderboard resets on <strong className="text-slate-500">March 1, 2026</strong></span>
      </div>

      {/* Lock Contest Modal */}
      <Modal
        open={showLockModal}
        onClose={() => setShowLockModal(false)}
        title="Lock Contest Snapshot"
        description="Freeze scores at this moment for final standings."
      >
        <div className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-600">
            Locking the contest will freeze the current scores. New proofs can still be submitted,
            but they will not affect the standings for <strong className="text-slate-900">{monthLabel(monthKey)}</strong>.
          </p>
        </div>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowLockModal(false)}>Cancel</Button>
          <Button variant="primary" loading={loading} onClick={handleLock} leftIcon={<Lock className="h-4 w-4" />}>
            Lock Snapshot
          </Button>
        </ModalFooter>
      </Modal>

      {/* Disqualify Modal */}
      <Modal
        open={showDQModal}
        onClose={() => setShowDQModal(false)}
        title={`Disqualify ${selectedEntry?.creator_name}`}
        description="Provide a reason for disqualification."
      >
        <textarea
          value={dqReason}
          onChange={(e) => setDqReason(e.target.value)}
          placeholder="Reason for disqualification..."
          rows={3}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:border-cc-accent"
        />
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowDQModal(false)}>Cancel</Button>
          <Button
            variant="danger"
            loading={loading}
            disabled={!dqReason.trim()}
            onClick={handleDisqualify}
          >
            Disqualify
          </Button>
        </ModalFooter>
      </Modal>

      {/* Reinstate Modal */}
      <Modal
        open={showReinstate}
        onClose={() => setShowReinstate(false)}
        title={`Reinstate ${selectedEntry?.creator_name}`}
        description="Confirm reinstating this creator on the leaderboard."
      >
        <p className="text-sm text-slate-600">
          {selectedEntry?.creator_name} will be restored to their ranked position based on score.
        </p>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowReinstate(false)}>Cancel</Button>
          <Button variant="success" loading={loading} onClick={handleReinstate}>
            Reinstate
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
