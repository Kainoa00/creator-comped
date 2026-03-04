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

export default function ApplicationsQueuePage() {
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
  }

  const handleReject = (id: string) => {
    setApplications(applications.map((app) =>
      app.id === id ? { ...app, status: 'rejected' as ApplicationStatus } : app
    ))
  }

  const pendingCount = applications.filter((app) => app.status === 'pending').length

  return (
    <div className="flex h-screen">
      {/* List Panel */}
      <div className="w-[500px] border-r border-white/5 flex flex-col bg-white/5">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Applications</h1>
            <div className="px-3 py-1 rounded-full bg-orange-500 text-white text-sm font-semibold">
              {pendingCount} pending
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search applications..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange-500 transition"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as ApplicationType | 'all')}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange-500 text-sm"
            >
              <option value="all">All Types</option>
              <option value="creator">Creators</option>
              <option value="restaurant">Restaurants</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ApplicationStatus | 'all')}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredApplications.map((app) => (
            <button
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className={`w-full p-4 border-b border-white/5 text-left hover:bg-white/5 transition ${
                selectedApp?.id === app.id ? 'bg-white/10' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    app.type === 'creator' ? 'bg-orange-500/20' : 'bg-blue-500/20'
                  }`}
                >
                  {app.type === 'creator' ? (
                    <User className="w-5 h-5 text-orange-500" />
                  ) : (
                    <Store className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-semibold truncate">{app.name}</div>
                    {app.status === 'pending' && (
                      <div className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500 text-xs">Pending</div>
                    )}
                    {app.status === 'approved' && (
                      <div className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 text-xs">Approved</div>
                    )}
                    {app.status === 'rejected' && (
                      <div className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 text-xs">Rejected</div>
                    )}
                  </div>
                  <div className="text-sm text-white/70 truncate">{app.email}</div>
                  <div className="text-xs text-white/50 mt-1">{app.submittedAt}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="flex-1 overflow-y-auto">
        {selectedApp ? (
          <div className="p-8">
            <div className="max-w-3xl mx-auto">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedApp.type === 'creator' ? 'bg-orange-500/20' : 'bg-blue-500/20'
                      }`}
                    >
                      {selectedApp.type === 'creator' ? (
                        <User className="w-6 h-6 text-orange-500" />
                      ) : (
                        <Store className="w-6 h-6 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedApp.name}</h2>
                      <p className="text-white/70 capitalize">{selectedApp.type} Application</p>
                    </div>
                  </div>
                </div>
                {selectedApp.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReject(selectedApp.id)}
                      className="px-6 py-2 rounded-xl bg-red-500/20 text-red-500 hover:bg-red-500/30 transition flex items-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(selectedApp.id)}
                      className="px-6 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-blue-600 hover:opacity-90 transition flex items-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      Approve
                    </button>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
                  <h3 className="font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-white/50" />
                      <div>
                        <div className="text-sm text-white/50">Email</div>
                        <div>{selectedApp.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-white/50" />
                      <div>
                        <div className="text-sm text-white/50">Phone</div>
                        <div>{selectedApp.phone}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedApp.type === 'creator' && (
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
                    <h3 className="font-semibold mb-4">Social Media</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Instagram className="w-5 h-5 text-orange-500" />
                        <div>
                          <div className="text-sm text-white/50">Instagram</div>
                          <a
                            href={`https://instagram.com/${selectedApp.instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-500 hover:text-orange-400"
                          >
                            {selectedApp.instagram}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Music2 className="w-5 h-5 text-blue-500" />
                        <div>
                          <div className="text-sm text-white/50">TikTok</div>
                          <a
                            href={`https://tiktok.com/${selectedApp.tiktok}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-400"
                          >
                            {selectedApp.tiktok}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-white/50" />
                        <div>
                          <div className="text-sm text-white/50">Total Followers</div>
                          <div className="font-semibold">{selectedApp.followers?.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedApp.type === 'restaurant' && (
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
                    <h3 className="font-semibold mb-4">Restaurant Details</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-white/50">Restaurant Name</div>
                        <div className="font-semibold">{selectedApp.restaurantName}</div>
                      </div>
                      <div>
                        <div className="text-sm text-white/50">Address</div>
                        <div>{selectedApp.address}</div>
                      </div>
                      <div>
                        <div className="text-sm text-white/50">Website</div>
                        <a
                          href={selectedApp.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 hover:text-orange-400"
                        >
                          {selectedApp.website}
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
                  <h3 className="font-semibold mb-4">Application Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/70">Submitted</span>
                      <span>{selectedApp.submittedAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Status</span>
                      <span className="capitalize font-semibold">{selectedApp.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-white/50">
            Select an application to view details
          </div>
        )}
      </div>
    </div>
  )
}
