'use client'

import { useState } from 'react'
import {
  Search,
  Check,
  X,
  Instagram,
  Music2,
  Eye,
  ExternalLink,
  AlertCircle,
} from 'lucide-react'

type SubmissionStatus = 'pending' | 'approved' | 'rejected'

interface Submission {
  id: string
  creator: string
  creatorHandle: string
  restaurant: string
  submittedAt: string
  status: SubmissionStatus
  instagramUrl?: string
  tiktokUrl?: string
  instagramViews?: number
  tiktokViews?: number
  deliverables: {
    requiredHashtags: string[]
    tagRestaurant: boolean
    instagramPost: boolean
    tiktokPost: boolean
  }
  compliance: {
    hasHashtags: boolean
    hasTag: boolean
    postedOnTime: boolean
  }
}

const mockSubmissions: Submission[] = [
  {
    id: '1',
    creator: 'Sarah Johnson',
    creatorHandle: '@foodie_sarah',
    restaurant: 'Italian Place',
    submittedAt: '2026-02-28 3:45 PM',
    status: 'pending',
    instagramUrl: 'https://instagram.com/p/abc123',
    tiktokUrl: 'https://tiktok.com/@foodie_sarah/video/123',
    instagramViews: 12400,
    tiktokViews: 45600,
    deliverables: {
      requiredHashtags: ['#HIVE', '#ItalianPlace'],
      tagRestaurant: true,
      instagramPost: true,
      tiktokPost: true,
    },
    compliance: { hasHashtags: true, hasTag: true, postedOnTime: true },
  },
  {
    id: '2',
    creator: 'Mike Thompson',
    creatorHandle: '@tastemaker_mike',
    restaurant: 'Sushi Spot',
    submittedAt: '2026-02-28 1:20 PM',
    status: 'pending',
    instagramUrl: 'https://instagram.com/p/def456',
    instagramViews: 8200,
    deliverables: {
      requiredHashtags: ['#HIVE', '#SushiSpot'],
      tagRestaurant: true,
      instagramPost: true,
      tiktokPost: false,
    },
    compliance: { hasHashtags: false, hasTag: true, postedOnTime: true },
  },
  {
    id: '3',
    creator: 'Emma Davis',
    creatorHandle: '@eats_with_emma',
    restaurant: 'Burger Bar',
    submittedAt: '2026-02-27 5:30 PM',
    status: 'approved',
    instagramUrl: 'https://instagram.com/p/ghi789',
    tiktokUrl: 'https://tiktok.com/@eats_with_emma/video/456',
    instagramViews: 15600,
    tiktokViews: 32100,
    deliverables: {
      requiredHashtags: ['#HIVE', '#BurgerBar'],
      tagRestaurant: true,
      instagramPost: true,
      tiktokPost: true,
    },
    compliance: { hasHashtags: true, hasTag: true, postedOnTime: true },
  },
]

function StatusBadge({ status }: { status: SubmissionStatus }) {
  if (status === 'pending') return <div className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">Pending</div>
  if (status === 'approved') return <div className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">Approved</div>
  return <div className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">Rejected</div>
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(submissions[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<SubmissionStatus | 'all'>('all')

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.creatorHandle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.restaurant.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleApprove = (id: string) => {
    const updated = submissions.map((sub) => sub.id === id ? { ...sub, status: 'approved' as SubmissionStatus } : sub)
    setSubmissions(updated)
    const found = updated.find((s) => s.id === id)
    if (found) setSelectedSubmission(found)
  }

  const handleReject = (id: string) => {
    const updated = submissions.map((sub) => sub.id === id ? { ...sub, status: 'rejected' as SubmissionStatus } : sub)
    setSubmissions(updated)
    const found = updated.find((s) => s.id === id)
    if (found) setSelectedSubmission(found)
  }

  const pendingCount = submissions.filter((sub) => sub.status === 'pending').length

  return (
    <div className="flex h-full">
      {/* List Panel */}
      <div className="w-80 shrink-0 border-r border-slate-200 flex flex-col bg-slate-50">
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-black text-slate-900">Submissions</h1>
            {pendingCount > 0 && (
              <div className="px-2.5 py-1 rounded-full bg-cc-accent text-white text-xs font-semibold">
                {pendingCount} pending
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search submissions..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-cc-accent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as SubmissionStatus | 'all')}
            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filteredSubmissions.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubmission(sub)}
              className={`w-full p-4 border-b border-slate-200 text-left hover:bg-white transition-colors ${
                selectedSubmission?.id === sub.id ? 'bg-white shadow-sm' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <p className="text-sm font-semibold text-slate-900">{sub.creator}</p>
                <StatusBadge status={sub.status} />
              </div>
              <p className="text-xs text-slate-500">{sub.creatorHandle}</p>
              <p className="text-xs text-slate-400 mt-0.5">{sub.restaurant}</p>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                <span>{sub.submittedAt}</span>
                {!sub.compliance.hasHashtags && (
                  <span className="flex items-center gap-0.5 text-red-500">
                    <AlertCircle className="w-3 h-3" /> Hashtags
                  </span>
                )}
              </div>
            </button>
          ))}
          {filteredSubmissions.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm">No submissions found</div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="flex-1 overflow-y-auto">
        {selectedSubmission ? (
          <div className="p-8 max-w-2xl">
            {/* Header */}
            <div className="flex items-start justify-between mb-8 border-b border-slate-200 pb-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">{selectedSubmission.creator}</h2>
                <p className="text-sm text-slate-500">{selectedSubmission.creatorHandle}</p>
                <p className="text-sm text-slate-400 mt-0.5">Restaurant: {selectedSubmission.restaurant}</p>
                <div className="mt-2"><StatusBadge status={selectedSubmission.status} /></div>
              </div>
              {selectedSubmission.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleReject(selectedSubmission.id)}
                    className="px-4 py-2 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedSubmission.id)}
                    className="px-4 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                    style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
                  >
                    <Check className="w-4 h-4" /> Approve
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-5">
              {/* Submitted Posts */}
              <div className="border border-slate-200 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Submitted Posts</h3>
                <div className="space-y-3">
                  {selectedSubmission.instagramUrl && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3">
                        <Instagram className="w-5 h-5 text-orange-500" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">Instagram Post</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Eye className="w-3 h-3" />
                            {selectedSubmission.instagramViews?.toLocaleString()} views
                          </p>
                        </div>
                      </div>
                      <a
                        href={selectedSubmission.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                  {selectedSubmission.tiktokUrl && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3">
                        <Music2 className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">TikTok Post</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Eye className="w-3 h-3" />
                            {selectedSubmission.tiktokViews?.toLocaleString()} views
                          </p>
                        </div>
                      </div>
                      <a
                        href={selectedSubmission.tiktokUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Deliverables Compliance */}
              <div className="border border-slate-200 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Deliverables Compliance</h3>
                <div className="space-y-3">
                  {[
                    {
                      label: 'Required Hashtags',
                      sub: selectedSubmission.deliverables.requiredHashtags.join(', '),
                      pass: selectedSubmission.compliance.hasHashtags,
                    },
                    { label: 'Restaurant Tagged', sub: null, pass: selectedSubmission.compliance.hasTag },
                    { label: 'Posted Within Deadline', sub: null, pass: selectedSubmission.compliance.postedOnTime },
                  ].map(({ label, sub, pass }) => (
                    <div key={label} className="flex items-center gap-3">
                      {pass
                        ? <Check className="w-4 h-4 text-green-500 shrink-0" />
                        : <X className="w-4 h-4 text-red-500 shrink-0" />
                      }
                      <div>
                        <p className="text-sm font-medium text-slate-900">{label}</p>
                        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submission Details */}
              <div className="border border-slate-200 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Submission Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Submitted</span>
                    <span className="text-slate-900">{selectedSubmission.submittedAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status</span>
                    <StatusBadge status={selectedSubmission.status} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            Select a submission to review
          </div>
        )}
      </div>
    </div>
  )
}
