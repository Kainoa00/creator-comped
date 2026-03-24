'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { relativeTime, formatDate, formatNumber } from '@/lib/utils'
import type { InviteApplication } from '@/lib/types'
import {
  Search,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  UserCheck,
} from 'lucide-react'

// Expanded demo vetting data
const DEMO_APPLICATIONS: (InviteApplication & { dm_status: 'pending' | 'sent' | 'verified' })[] = [
  {
    id: 'app-001',
    name: 'Aaliyah Okonkwo',
    email: 'aaliyah@example.com',
    ig_handle: '@aaliyah.bites',
    tiktok_handle: '@aaliyahbites',
    follower_count: 12400,
    why_join: 'I love sharing my Utah food adventures with my community!',
    status: 'pending',
    submitted_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    reviewed_at: null,
    reviewer_notes: null,
    dm_status: 'pending',
  },
  {
    id: 'app-002',
    name: 'Brett Sullivan',
    email: 'brett.s@example.com',
    ig_handle: '@brett_eatsslc',
    tiktok_handle: null,
    follower_count: 8700,
    why_join: null,
    status: 'pending',
    submitted_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    reviewed_at: null,
    reviewer_notes: null,
    dm_status: 'sent',
  },
  {
    id: 'app-003',
    name: 'Sofia Mendez',
    email: 'sofia.m@example.com',
    ig_handle: '@sofiafoodie',
    tiktok_handle: '@sofiamendezfood',
    follower_count: 31000,
    why_join: 'Been following the network for months — excited to finally apply!',
    status: 'pending',
    submitted_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    reviewed_at: null,
    reviewer_notes: null,
    dm_status: 'verified',
  },
  {
    id: 'app-004',
    name: 'Marcus Webb',
    email: 'marcus@example.com',
    ig_handle: '@marcusgrills',
    tiktok_handle: '@marcusgrills',
    follower_count: 5200,
    why_join: 'Food content creator looking to grow in Utah market.',
    status: 'approved',
    submitted_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    reviewed_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    reviewer_notes: 'Great engagement rate, approved.',
    dm_status: 'verified',
  },
  {
    id: 'app-005',
    name: 'Priya Nair',
    email: 'priya.nair@example.com',
    ig_handle: '@priyaeatsutah',
    tiktok_handle: null,
    follower_count: null,
    why_join: null,
    status: 'rejected',
    submitted_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    reviewed_at: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString(),
    reviewer_notes: 'Account could not be verified — profile is private.',
    dm_status: 'pending',
  },
]

type SortKey = 'submitted_at' | 'name' | 'follower_count'
type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected'

const DM_STATUS_CONFIG = {
  pending: { label: 'Pending', dot: 'bg-white/30', bg: 'bg-white/5', text: 'text-white/50', border: 'border-white/[0.06]' },
  sent: { label: 'Code Sent', dot: 'bg-amber-400', bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/20' },
  verified: { label: 'Verified', dot: 'bg-emerald-400', bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/20' },
}

const STATUS_CONFIG = {
  pending: { label: 'Pending', variant: 'warning' as const },
  approved: { label: 'Approved', variant: 'success' as const },
  rejected: { label: 'Rejected', variant: 'error' as const },
}

export default function VettingQueuePage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortKey, setSortKey] = useState<SortKey>('submitted_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const filtered = useMemo(() => {
    let list = [...DEMO_APPLICATIONS]

    if (statusFilter !== 'all') {
      list = list.filter((a) => a.status === statusFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.ig_handle?.toLowerCase().includes(q) ||
          a.tiktok_handle?.toLowerCase().includes(q)
      )
    }

    list.sort((a, b) => {
      let av: string | number | null
      let bv: string | number | null
      if (sortKey === 'submitted_at') {
        av = a.submitted_at
        bv = b.submitted_at
      } else if (sortKey === 'name') {
        av = a.name
        bv = b.name
      } else {
        av = a.follower_count ?? -1
        bv = b.follower_count ?? -1
      }
      if (av === null) return 1
      if (bv === null) return -1
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return list
  }, [search, statusFilter, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  function SortIcon({ field }: { field: SortKey }) {
    if (sortKey !== field) return <ChevronUp className="h-3 w-3 opacity-30" />
    return sortDir === 'asc' ? (
      <ChevronUp className="h-3 w-3 text-hive-accent" />
    ) : (
      <ChevronDown className="h-3 w-3 text-hive-accent" />
    )
  }

  const pendingCount = DEMO_APPLICATIONS.filter((a) => a.status === 'pending').length

  return (
    <div className="px-8 py-6 space-y-5">
      {/* Page Header */}
      <div className="border-b border-white/[0.06] pb-5 -mx-8 px-8 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-[#FF6B35] to-[#4A90E2] shrink-0" />
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Creator Vetting</h1>
              <p className="text-sm font-semibold text-white/40 mt-0.5">
                Review and approve incoming creator applications
              </p>
            </div>
          </div>
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 border border-white/[0.06] text-white/60 text-sm font-bold px-3 py-1.5 rounded-md">
              <span className="h-2 w-2 rounded-full bg-amber-500 inline-block animate-pulse" />
              {pendingCount} pending review
            </span>
          )}
        </div>
      </div>

      {/* Filter Row */}
      <div className="border border-white/[0.06] rounded-lg p-3 flex items-center gap-3 mb-4">
        {/* Status filter pills */}
        <div className="flex items-center gap-1.5">
          {(['all', 'pending', 'approved', 'rejected'] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all capitalize ${
                statusFilter === s
                  ? 'bg-hive-accent text-white'
                  : 'bg-white/5 border border-white/[0.06] text-white/60 hover:border-white/[0.1]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Search — right side */}
        <div className="relative ml-auto w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search by name, email, or handle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/[0.06] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-hive-accent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl overflow-hidden min-h-[500px]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/5">
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => toggleSort('name')}
                  className="flex items-center gap-1 text-xs font-bold text-white/40 uppercase tracking-wider hover:text-white/70"
                >
                  Creator <SortIcon field="name" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-bold text-white/40 uppercase tracking-wider">IG Handle</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-bold text-white/40 uppercase tracking-wider">TikTok</span>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => toggleSort('follower_count')}
                  className="flex items-center gap-1 text-xs font-bold text-white/40 uppercase tracking-wider hover:text-white/70 ml-auto"
                >
                  Followers <SortIcon field="follower_count" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => toggleSort('submitted_at')}
                  className="flex items-center gap-1 text-xs font-bold text-white/40 uppercase tracking-wider hover:text-white/70"
                >
                  Applied <SortIcon field="submitted_at" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Status</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-bold text-white/40 uppercase tracking-wider">DM Verification</span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-16 w-16 rounded-lg border border-white/[0.06] flex items-center justify-center">
                      <UserCheck className="h-7 w-7 text-white/30" />
                    </div>
                    <p className="font-bold text-white">Queue is clear</p>
                    <p className="text-sm text-white/40">No applications match your filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((app) => {
                const dmCfg = DM_STATUS_CONFIG[app.dm_status]
                return (
                  <tr
                    key={app.id}
                    className="border-b border-white/[0.06] hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => router.push(`/admin/vetting/${app.id}`)}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={null} name={app.name} size="sm" />
                        <div>
                          <p className="font-bold text-white">{app.name}</p>
                          <p className="text-xs text-white/40">{app.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {app.ig_handle ? (
                        <a
                          href={`https://instagram.com/${app.ig_handle.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-hive-accent text-sm font-medium hover:underline"
                        >
                          {app.ig_handle}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {app.tiktok_handle ? (
                        <a
                          href={`https://tiktok.com/${app.tiktok_handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-hive-accent text-sm font-medium hover:underline"
                        >
                          {app.tiktok_handle}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-sm text-white font-mono font-bold">
                        {app.follower_count != null ? formatNumber(app.follower_count) : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-white/50">{relativeTime(app.submitted_at)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={STATUS_CONFIG[app.status].variant} dot>
                        {STATUS_CONFIG[app.status].label}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border border-white/[0.06] text-white/60">
                        <span className={`h-1.5 w-1.5 rounded-full ${dmCfg.dot} shrink-0`} />
                        {dmCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/admin/vetting/${app.id}`)
                        }}
                        className="text-white rounded-xl px-3 py-1.5 text-xs font-bold hover:brightness-110 transition-all"
                        style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
