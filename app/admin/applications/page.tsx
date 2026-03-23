'use client'

import { useState } from 'react'
import { Search, Check, X, User, Store, Instagram, Music2, Mail, Phone } from 'lucide-react'

type ApplicationType = 'creator' | 'restaurant'
type ApplicationStatus = 'pending' | 'approved' | 'rejected'

interface Application {
  id: string
  type: ApplicationType
  name: string
  email: string
  phone: string
  submittedAt: string
  status: ApplicationStatus
  instagram?: string
  tiktok?: string
  followers?: number
  restaurantName?: string
  address?: string
  website?: string
}

const mockApplications: Application[] = [
  {
    id: '1',
    type: 'creator',
    name: 'Sarah Johnson',
    email: 'sarah@foodie.com',
    phone: '(555) 123-4567',
    submittedAt: '2026-02-28 10:30 AM',
    status: 'pending',
    instagram: '@foodie_sarah',
    tiktok: '@foodie_sarah',
    followers: 45000,
  },
  {
    id: '2',
    type: 'restaurant',
    name: 'Mike Chen',
    email: 'mike@italianplace.com',
    phone: '(555) 234-5678',
    submittedAt: '2026-02-27 2:15 PM',
    status: 'pending',
    restaurantName: 'Italian Place',
    address: '123 Main St, City, State 12345',
    website: 'https://italianplace.com',
  },
  {
    id: '3',
    type: 'creator',
    name: 'Emma Davis',
    email: 'emma@eats.com',
    phone: '(555) 345-6789',
    submittedAt: '2026-02-27 11:45 AM',
    status: 'approved',
    instagram: '@eats_with_emma',
    tiktok: '@eats_with_emma',
    followers: 28000,
  },
  {
    id: '4',
    type: 'restaurant',
    name: 'John Smith',
    email: 'john@sushispot.com',
    phone: '(555) 456-7890',
    submittedAt: '2026-02-26 4:20 PM',
    status: 'rejected',
    restaurantName: 'Sushi Spot',
    address: '456 Oak Ave, City, State 12345',
    website: 'https://sushispot.com',
  },
]

function StatusBadge({ status }: { status: ApplicationStatus }) {
  if (status === 'pending') return <div className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">Pending</div>
  if (status === 'approved') return <div className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">Approved</div>
  return <div className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">Rejected</div>
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>(mockApplications)
  const [selectedApp, setSelectedApp] = useState<Application | null>(applications[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<ApplicationType | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'all'>('all')

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || app.type === filterType
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const handleApprove = (id: string) => {
    setApplications(applications.map((app) =>
      app.id === id ? { ...app, status: 'approved' as ApplicationStatus } : app
    ))
    const updated = applications.find((a) => a.id === id)
    if (updated) setSelectedApp({ ...updated, status: 'approved' })
  }

  const handleReject = (id: string) => {
    setApplications(applications.map((app) =>
      app.id === id ? { ...app, status: 'rejected' as ApplicationStatus } : app
    ))
    const updated = applications.find((a) => a.id === id)
    if (updated) setSelectedApp({ ...updated, status: 'rejected' })
  }

  const pendingCount = applications.filter((app) => app.status === 'pending').length

  return (
    <div className="flex h-full">
      {/* List Panel */}
      <div className="w-80 shrink-0 border-r border-white/[0.06] flex flex-col bg-white/5">
        <div className="p-5 border-b border-white/[0.06]">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-black text-white">Applications</h1>
            {pendingCount > 0 && (
              <div className="px-2.5 py-1 rounded-full bg-cc-accent text-white text-xs font-semibold">
                {pendingCount} pending
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search applications..."
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-cc-accent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as ApplicationType | 'all')}
              className="flex-1 px-2.5 py-1.5 bg-white/5 border border-white/[0.06] rounded-lg text-xs text-white focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="creator">Creators</option>
              <option value="restaurant">Restaurants</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ApplicationStatus | 'all')}
              className="flex-1 px-2.5 py-1.5 bg-white/5 border border-white/[0.06] rounded-lg text-xs text-white focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filteredApplications.map((app) => (
            <button
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className={`w-full p-4 border-b border-white/[0.06] text-left hover:bg-white/5 transition-colors ${
                selectedApp?.id === app.id ? 'bg-white/10' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  app.type === 'creator' ? 'bg-orange-500/20' : 'bg-blue-500/20'
                }`}>
                  {app.type === 'creator'
                    ? <User className="w-4 h-4 text-orange-600" />
                    : <Store className="w-4 h-4 text-blue-600" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="text-sm font-semibold text-white truncate">{app.name}</p>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="text-xs text-white/50 truncate">{app.email}</p>
                  <p className="text-xs text-white/40 mt-0.5">{app.submittedAt}</p>
                </div>
              </div>
            </button>
          ))}
          {filteredApplications.length === 0 && (
            <div className="py-12 text-center text-white/40 text-sm">No applications found</div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="flex-1 overflow-y-auto">
        {selectedApp ? (
          <div className="p-8 max-w-2xl">
            {/* Header */}
            <div className="flex items-start justify-between mb-8 border-b border-white/[0.06] pb-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedApp.type === 'creator' ? 'bg-orange-500/20' : 'bg-blue-500/20'
                }`}>
                  {selectedApp.type === 'creator'
                    ? <User className="w-6 h-6 text-orange-600" />
                    : <Store className="w-6 h-6 text-blue-600" />
                  }
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">{selectedApp.name}</h2>
                  <p className="text-sm text-white/50 capitalize">{selectedApp.type} Application</p>
                  <div className="mt-1"><StatusBadge status={selectedApp.status} /></div>
                </div>
              </div>
              {selectedApp.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleReject(selectedApp.id)}
                    className="px-4 py-2 rounded-lg border border-red-500/20 bg-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/30 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedApp.id)}
                    className="px-4 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                    style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
                  >
                    <Check className="w-4 h-4" /> Approve
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-5">
              {/* Contact Info */}
              <div className="border border-white/[0.06] rounded-lg p-5 bg-[#1a1a1a]">
                <h3 className="text-sm font-semibold text-white mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-white/40 shrink-0" />
                    <div>
                      <p className="text-xs text-white/40">Email</p>
                      <p className="text-sm text-white/70">{selectedApp.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-white/40 shrink-0" />
                    <div>
                      <p className="text-xs text-white/40">Phone</p>
                      <p className="text-sm text-white/70">{selectedApp.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Creator: Social Media */}
              {selectedApp.type === 'creator' && (
                <div className="border border-white/[0.06] rounded-lg p-5 bg-[#1a1a1a]">
                  <h3 className="text-sm font-semibold text-white mb-4">Social Media</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Instagram className="w-4 h-4 text-orange-500 shrink-0" />
                      <div>
                        <p className="text-xs text-white/40">Instagram</p>
                        <a
                          href={`https://instagram.com/${selectedApp.instagram?.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-cc-accent hover:underline"
                        >
                          {selectedApp.instagram}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Music2 className="w-4 h-4 text-blue-500 shrink-0" />
                      <div>
                        <p className="text-xs text-white/40">TikTok</p>
                        <a
                          href={`https://tiktok.com/${selectedApp.tiktok}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-cc-accent hover:underline"
                        >
                          {selectedApp.tiktok}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-white/40 shrink-0" />
                      <div>
                        <p className="text-xs text-white/40">Total Followers</p>
                        <p className="text-sm font-semibold text-white">{selectedApp.followers?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Restaurant: Details */}
              {selectedApp.type === 'restaurant' && (
                <div className="border border-white/[0.06] rounded-lg p-5 bg-[#1a1a1a]">
                  <h3 className="text-sm font-semibold text-white mb-4">Restaurant Details</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-white/40">Restaurant Name</p>
                      <p className="text-sm font-semibold text-white">{selectedApp.restaurantName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40">Address</p>
                      <p className="text-sm text-white/70">{selectedApp.address}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40">Website</p>
                      <a
                        href={selectedApp.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-cc-accent hover:underline"
                      >
                        {selectedApp.website}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Application Status */}
              <div className="border border-white/[0.06] rounded-lg p-5 bg-[#1a1a1a]">
                <h3 className="text-sm font-semibold text-white mb-4">Application Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Submitted</span>
                    <span className="text-white">{selectedApp.submittedAt}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Status</span>
                    <StatusBadge status={selectedApp.status} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-white/40 text-sm">
            Select an application to view details
          </div>
        )}
      </div>
    </div>
  )
}
