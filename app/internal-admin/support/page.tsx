'use client'

import { useState } from 'react'
import { Search, Check, Mail, User } from 'lucide-react'

type TicketStatus = 'open' | 'resolved'
type TicketType = 'creator' | 'restaurant' | 'general'

interface SupportTicket {
  id: string
  name: string
  email: string
  type: TicketType
  subject: string
  message: string
  submittedAt: string
  status: TicketStatus
}

const mockTickets: SupportTicket[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@foodie.com',
    type: 'creator',
    subject: 'Issue with QR code redemption',
    message:
      "Hi, I tried to redeem my comp at Italian Place yesterday but the QR code wouldn't scan. The restaurant staff tried multiple times but it kept showing an error. Can you help? My comp ID is #12345.",
    submittedAt: '2026-02-28 4:15 PM',
    status: 'open',
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@italianplace.com',
    type: 'restaurant',
    subject: 'Need to update menu items',
    message:
      "We need to update our menu but some items aren't appearing in the dashboard. When I try to add new items to the Pizza category, I get an error. Could you please look into this?",
    submittedAt: '2026-02-28 11:30 AM',
    status: 'open',
  },
  {
    id: '3',
    name: 'Emma Davis',
    email: 'emma@eats.com',
    type: 'creator',
    subject: 'Payment for monthly leaderboard prize',
    message:
      "Hi! I was ranked #3 last month but haven't received my prize payment yet. Can you check on the status? Thanks!",
    submittedAt: '2026-02-27 2:45 PM',
    status: 'resolved',
  },
  {
    id: '4',
    name: 'John Smith',
    email: 'john@example.com',
    type: 'general',
    subject: "How do I sign up as a restaurant?",
    message:
      "I own a restaurant and I'm interested in joining Creator Comped. What are the requirements and how do I get started? Do you have any pricing information?",
    submittedAt: '2026-02-27 10:20 AM',
    status: 'resolved',
  },
]

export default function SupportQueuePage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(tickets[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'all'>('all')
  const [filterType, setFilterType] = useState<TicketType | 'all'>('all')
  const [replyText, setReplyText] = useState('')

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus
    const matchesType = filterType === 'all' || ticket.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  const handleResolve = (id: string) => {
    setTickets(tickets.map((ticket) =>
      ticket.id === id ? { ...ticket, status: 'resolved' as TicketStatus } : ticket
    ))
    setReplyText('')
  }

  const openCount = tickets.filter((ticket) => ticket.status === 'open').length

  return (
    <div className="flex h-screen">
      {/* List Panel */}
      <div className="w-[500px] border-r border-white/5 flex flex-col bg-white/5">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Support Inbox</h1>
            <div className="px-3 py-1 rounded-full bg-orange-500 text-white text-sm font-semibold">
              {openCount} open
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tickets..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange-500 transition"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as TicketType | 'all')}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange-500 text-sm"
            >
              <option value="all">All Types</option>
              <option value="creator">Creator</option>
              <option value="restaurant">Restaurant</option>
              <option value="general">General</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as TicketStatus | 'all')}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Tickets List */}
        <div className="flex-1 overflow-y-auto">
          {filteredTickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={`w-full p-4 border-b border-white/5 text-left hover:bg-white/5 transition ${
                selectedTicket?.id === ticket.id ? 'bg-white/10' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold">{ticket.name}</div>
                  <div className="text-sm text-white/70">{ticket.email}</div>
                </div>
                {ticket.status === 'open' && (
                  <div className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-500 text-xs">Open</div>
                )}
                {ticket.status === 'resolved' && (
                  <div className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 text-xs">Resolved</div>
                )}
              </div>
              <div className="font-medium text-sm mb-1">{ticket.subject}</div>
              <div className="flex items-center gap-3 text-xs text-white/50">
                <div>{ticket.submittedAt}</div>
                <div className="capitalize">{ticket.type}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="flex-1 overflow-y-auto">
        {selectedTicket ? (
          <div className="p-8">
            <div className="max-w-3xl mx-auto">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{selectedTicket.name}</h2>
                      <p className="text-white/70 text-sm">{selectedTicket.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-white/50">Type:</span>
                    <span className="capitalize px-2 py-0.5 bg-white/10 rounded">{selectedTicket.type}</span>
                  </div>
                </div>
                {selectedTicket.status === 'open' && (
                  <button
                    onClick={() => handleResolve(selectedTicket.id)}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-blue-600 hover:opacity-90 transition flex items-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Mark as Resolved
                  </button>
                )}
              </div>

              {/* Ticket Details */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-5 h-5 text-orange-500" />
                  <h3 className="font-semibold text-lg">{selectedTicket.subject}</h3>
                </div>
                <div className="text-white/90 leading-relaxed whitespace-pre-wrap">
                  {selectedTicket.message}
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 text-sm text-white/50">
                  Submitted: {selectedTicket.submittedAt}
                </div>
              </div>

              {/* Reply Form */}
              {selectedTicket.status === 'open' && (
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
                  <h3 className="font-semibold mb-4">Reply to {selectedTicket.name}</h3>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your response..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange-500 transition h-40 resize-none mb-4"
                  />
                  <div className="flex justify-end gap-3">
                    <button className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition">
                      Save Draft
                    </button>
                    <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-blue-600 hover:opacity-90 transition">
                      Send Reply
                    </button>
                  </div>
                </div>
              )}

              {selectedTicket.status === 'resolved' && (
                <div className="bg-green-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <Check className="w-6 h-6 text-green-500" />
                    <div>
                      <div className="font-semibold text-green-500">Ticket Resolved</div>
                      <div className="text-sm text-white/70">
                        This support ticket has been marked as resolved.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-white/50">
            Select a ticket to view details
          </div>
        )}
      </div>
    </div>
  )
}
