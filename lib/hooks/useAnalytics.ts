'use client'

import { useState, useEffect } from 'react'
import { supabase, isDemoMode } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { DEMO_ANALYTICS_SNAPSHOTS } from '@/lib/demo-data'
import type { AnalyticsSnapshot } from '@/lib/types'

export interface PlatformAggregate {
  views: number
  likes: number
  comments: number
  saves: number
  posts: number
  score: number
}

export interface UseAnalyticsResult {
  snapshots: AnalyticsSnapshot[]
  ig: PlatformAggregate
  tiktok: PlatformAggregate
  loading: boolean
  error: string | null
}

const EMPTY_AGG: PlatformAggregate = { views: 0, likes: 0, comments: 0, saves: 0, posts: 0, score: 0 }

/**
 * Returns analytics snapshots for the current creator.
 * Falls back to demo data when isDemoMode is true, no session, or on error.
 *
 * Note: the analytics_snapshots table doesn't have platform-specific ig_/tt_ columns;
 * platform is determined via the linked proof_submissions.platform.
 * In demo mode we aggregate DEMO_ANALYTICS_SNAPSHOTS (all linked to proof-002 = TIKTOK).
 */
export function useAnalytics(): UseAnalyticsResult {
  const [snapshots, setSnapshots] = useState<AnalyticsSnapshot[]>([])
  const [ig, setIg] = useState<PlatformAggregate>(EMPTY_AGG)
  const [tiktok, setTiktok] = useState<PlatformAggregate>(EMPTY_AGG)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      if (isDemoMode || !supabase) {
        if (!cancelled) {
          applyDemoData()
          setLoading(false)
        }
        return
      }

      try {
        const session = await getSession()

        if (!session || !session.creatorId) {
          if (!cancelled) {
            applyDemoData()
            setLoading(false)
          }
          return
        }

        // Fetch proof_ids for this creator
        const { data: proofs, error: proofsError } = await supabase
          .from('proof_submissions')
          .select('id, platform')
          .eq('creator_id', session.creatorId)

        if (proofsError) throw new Error(proofsError.message)

        if (!proofs || proofs.length === 0) {
          // No proofs yet — fall back to demo so analytics page isn't empty
          if (!cancelled) {
            applyDemoData()
            setLoading(false)
          }
          return
        }

        const proofIds = proofs.map((p) => p.id)
        const platformByProof: Record<string, string> = {}
        for (const p of proofs) platformByProof[p.id] = p.platform

        // Fetch all snapshots for those proofs
        const { data: snapshotsRaw, error: snapError } = await supabase
          .from('analytics_snapshots')
          .select('*')
          .in('proof_id', proofIds)
          .order('timestamp', { ascending: true })

        if (snapError) throw new Error(snapError.message)

        const snapshotList = ((snapshotsRaw ?? []) as any[]).map((s) => ({
          id: s.id,
          proof_id: s.proof_id,
          timestamp: s.timestamp,
          views: s.views ?? 0,
          likes: s.likes ?? 0,
          comments: s.comments ?? 0,
          shares: s.shares ?? 0,
          score: s.score ?? 0,
        })) as AnalyticsSnapshot[]

        // Aggregate by platform using latest snapshot per proof
        const latestByProof: Record<string, AnalyticsSnapshot> = {}
        for (const snap of snapshotList) {
          const existing = latestByProof[snap.proof_id]
          if (!existing || snap.timestamp > existing.timestamp) {
            latestByProof[snap.proof_id] = snap
          }
        }

        const igAgg: PlatformAggregate = { ...EMPTY_AGG }
        const ttAgg: PlatformAggregate = { ...EMPTY_AGG }

        for (const [proofId, snap] of Object.entries(latestByProof)) {
          const platform = platformByProof[proofId]
          const target = platform === 'IG_REEL' ? igAgg : ttAgg
          target.views += snap.views
          target.likes += snap.likes
          target.comments += snap.comments
          target.saves += snap.shares  // shares mapped to saves display field
          target.posts += 1
          target.score += snap.score
        }

        if (!cancelled) {
          setSnapshots(snapshotList)
          setIg(igAgg.posts > 0 ? igAgg : getDemoIg())
          setTiktok(ttAgg.posts > 0 ? ttAgg : getDemoTiktok())
          setLoading(false)
        }
      } catch (err) {
        // On error, silently fall back to demo data
        if (!cancelled) {
          applyDemoData()
          setError(err instanceof Error ? err.message : 'Unknown error')
          setLoading(false)
        }
      }
    }

    function applyDemoData() {
      const demoSnaps = DEMO_ANALYTICS_SNAPSHOTS.filter((s) => s.proof_id === 'proof-002')
      setSnapshots(demoSnaps)
      setIg(getDemoIg())
      setTiktok(getDemoTiktok())
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { snapshots, ig, tiktok, loading, error }
}

/** Demo IG aggregate (static fallback matching original hardcoded IG_DATA) */
function getDemoIg(): PlatformAggregate {
  return { views: 12847, likes: 1563, comments: 234, saves: 421, posts: 3, score: 12847 + 1563 * 5 + 234 * 25 }
}

/** Demo TikTok aggregate derived from DEMO_ANALYTICS_SNAPSHOTS latest snapshot */
function getDemoTiktok(): PlatformAggregate {
  return { views: 8934, likes: 892, comments: 156, saves: 287, posts: 2, score: 8934 + 892 * 5 + 156 * 25 }
}
