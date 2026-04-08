'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Instagram, Music2, ChevronLeft, ChevronRight } from 'lucide-react'
import { DEMO_CONTEST_ENTRIES } from '@/lib/demo-data'
import { supabase, isDemoMode } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { formatNumber } from '@/lib/utils'
import type { ContestEntry } from '@/lib/types'

// Leaderboard wires to the contest_entries table when Supabase is configured.
// Creator name/photo are joined from the creators table.
// Falls back to DEMO_CONTEST_ENTRIES when isDemoMode is true or on error.

const MONTHS = ['2026-03', '2026-02', '2026-01']
const MONTH_LABELS: Record<string, string> = {
  '2026-03': 'March 2026',
  '2026-02': 'February 2026',
  '2026-01': 'January 2026',
}

const MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

export default function LeaderboardPage() {
  const router = useRouter()
  const [monthIdx, setMonthIdx] = useState(0)
  const [tab, setTab] = useState<'TIKTOK' | 'IG_REEL'>('TIKTOK')
  const [allEntries, setAllEntries] = useState<ContestEntry[]>(DEMO_CONTEST_ENTRIES)
  const [currentUserId, setCurrentUserId] = useState<string>('creator-001')
  const [loading, setLoading] = useState(!isDemoMode)

  useEffect(() => {
    if (isDemoMode || !supabase) {
      setAllEntries(DEMO_CONTEST_ENTRIES)
      setCurrentUserId('creator-001')
      setLoading(false)
      return
    }

    let cancelled = false
    async function loadLeaderboard() {
      try {
        const session = await getSession()
        if (session?.creatorId && !cancelled) setCurrentUserId(session.creatorId)

        const month = MONTHS[0] // always fetch all relevant months at once
        const { data: rawEntries, error } = await supabase!
          .from('contest_entries')
          .select(`
            id,
            proof_id,
            creator_id,
            month,
            platform,
            score,
            eligible,
            disqualified,
            disqualification_reason,
            creator:creators(name, photo_url)
          `)
          .in('month', MONTHS)
          .order('score', { ascending: false })

        if (error) throw new Error(error.message)

        if (!rawEntries || rawEntries.length === 0) {
          // No real data — keep demo entries
          if (!cancelled) setLoading(false)
          return
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const normalised: ContestEntry[] = ((rawEntries ?? []) as any[]).map((e) => ({
          id: e.id,
          proof_id: e.proof_id,
          creator_id: e.creator_id,
          creator_name: e.creator?.name ?? 'Unknown Creator',
          creator_photo: e.creator?.photo_url ?? null,
          month: e.month,
          platform: e.platform,
          score: e.score,
          eligible: e.eligible,
          disqualified: e.disqualified,
          disqualification_reason: e.disqualification_reason ?? null,
        }))

        if (!cancelled) {
          setAllEntries(normalised)
          setLoading(false)
        }
      } catch {
        // On error, silently keep demo entries
        if (!cancelled) setLoading(false)
      }
    }

    loadLeaderboard()
    return () => { cancelled = true }
  }, [])

  const month = MONTHS[monthIdx]
  const entries = allEntries
    .filter((e) => e.month === month && e.platform === tab)
    .sort((a, b) => b.score - a.score)

  const myEntry = entries.find((e) => e.creator_id === currentUserId)
  const myRank = myEntry ? entries.indexOf(myEntry) + 1 : null

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white max-w-[430px] mx-auto">
      {/* Header */}
      <header className="px-4 pt-14 pb-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#1a1a1a] active:bg-[#252525] transition-colors">
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white flex-1">Leaderboard</h1>
        {myRank && (
          <span
            className="text-xs font-bold text-white rounded-lg px-2.5 py-1"
            style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
          >
            #{myRank}
          </span>
        )}
      </header>

      <div className="px-4 pb-28 space-y-4">
        {/* Month selector */}
        <div className="flex items-center justify-between bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-3">
          <button
            onClick={() => setMonthIdx((i) => Math.min(i + 1, MONTHS.length - 1))}
            disabled={monthIdx >= MONTHS.length - 1}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </button>
          <span className="text-sm font-semibold text-white">{MONTH_LABELS[month]}</span>
          <button
            onClick={() => setMonthIdx((i) => Math.max(i - 1, 0))}
            disabled={monthIdx <= 0}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Platform toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab('IG_REEL')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border font-semibold text-sm transition-all"
            style={tab === 'IG_REEL'
              ? { background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)', border: 'none', color: 'white' }
              : { background: '#1a1a1a', borderColor: '#2a2a2a', color: '#9ca3af' }
            }
          >
            <Instagram className="h-4 w-4" />
            Instagram
          </button>
          <button
            onClick={() => setTab('TIKTOK')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border font-semibold text-sm transition-all"
            style={tab === 'TIKTOK'
              ? { background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)', border: 'none', color: 'white' }
              : { background: '#1a1a1a', borderColor: '#2a2a2a', color: '#9ca3af' }
            }
          >
            <Music2 className="h-4 w-4" />
            TikTok
          </button>
        </div>

        {/* Ranked list */}
        {entries.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-white font-semibold">No entries yet</p>
            <p className="text-sm text-gray-500">Be the first on the leaderboard!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, i) => {
              const rank = i + 1
              const isMe = entry.creator_id === currentUserId
              return (
                <div
                  key={entry.id}
                  className={`rounded-2xl px-4 py-3.5 flex items-center gap-3 border transition-all ${isMe ? 'border-white/20' : 'border-[#2a2a2a]'}`}
                  style={isMe ? { background: 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(74,144,226,0.1) 100%)' } : { background: '#1a1a1a' }}
                >
                  <span className="text-lg w-7 text-center">{MEDALS[rank] ?? rank}</span>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #4A90E2 100%)' }}
                  >
                    {entry.creator_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isMe ? 'text-white' : 'text-gray-200'}`}>
                      {entry.creator_name}
                      {isMe && <span className="ml-1.5 text-[10px] font-bold opacity-70">(you)</span>}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatNumber(entry.score)} pts</p>
                  </div>
                  {rank <= 3 && (
                    <span
                      className="text-xs font-bold text-white rounded-lg px-2 py-0.5"
                      style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
                    >
                      #{rank}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {!myEntry && (
          <p className="text-center text-xs text-gray-600 py-2">Submit an approved post to enter the leaderboard</p>
        )}
      </div>
    </div>
  )
}
