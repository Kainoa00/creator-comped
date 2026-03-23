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
    subject: 'How do I sign up as a restaurant?',
    message:
      "I own a restaurant and I'm interested in joining HIVE. What are the requirements and how do I get started? Do you have any pricing information?",
    submittedAt: '2026-02-27 10:20 AM',
    status: 'resolved',
  },
]

type PriorityLabel = 'High' | 'Normal'

function getPriority(ticket: SupportTicket): PriorityLabel {
  return ticket.status === 'open' && ticket.type !== 'general' ? 'High' : 'Normal'
}

function StatusBadge({ status }: { status: TicketStatus }) {
  if (status === 'open') return <div className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">Open</div>
  return <div className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">Resolved</div>
}

export default function InboxPage() {
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
    const updated = tickets.map((ticket) =>
      ticket.id === id ? { ...ticket, status: 'resolved' as TicketStatus } : ticket
    )
    setTickets(updated)
    const found = updated.find((t) => t.id === id)
    if (found) setSelectedTicket(found)
    setReplyText('')
  }

  const openCount = tickets.filter((ticket) => ticket.status === 'open').length

  return (
    <div className="flex h-full">
      {/* List Panel */}
      <div className="w-80 shrink-0 border-r border-white/[0.06] flex flex-col bg-white/5">
        <div className="p-5 border-b border-white/[0.06]">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-black text-white">Support Inbox</h1>
            {openCount > 0 && (
              <div className="px-2.5 py-1 rounded-full bg-hive-accent text-white text-xs font-semibold">
                {openCount} open
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
              placeholder="Search tickets..."
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-hive-accent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as TicketType | 'all')}
              className="flex-1 px-2.5 py-1.5 bg-white/5 border border-white/[0.06] rounded-lg text-xs text-white focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="creator">Creator</option>
              <option value="restaurant">Restaurant</option>
              <option value="general">General</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as TicketStatus | 'all')}
              className="flex-1 px-2.5 py-1.5 bg-white/5 border border-white/[0.06] rounded-lg text-xs text-white focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Ticket List */}
        <div className="flex-1 overflow-y-auto">
          {filteredTickets.map((ticket) => {
            const priority = getPriority(ticket)
            return (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`w-full p-4 border-b border-white/[0.06] text-left hover:bg-white/5 transition-colors ${
                  selectedTicket?.id === ticket.id ? 'bg-white/10' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-semibold text-white truncate flex-1 mr-2">{ticket.name}</p>
                  <StatusBadge status={ticket.status} />
                </div>
                <p className="text-sm text-white/70 truncate mb-0.5">{ticket.subject}</p>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <span>{ticket.submittedAt}</span>
                  <span className="capitalize">{ticket.type}</span>
                  {priority === 'High' && (
                    <span className="text-orange-500 font-medium">· High</span>
                  )}
                </div>
              </button>
            )
          })}
          {filteredTickets.length === 0 && (
            <div className="py-12 text-center text-white/40 text-sm">No tickets found</div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="flex-1 overflow-y-auto">
        {selectedTicket ? (
          <div className="p-8 max-w-2xl">
            {/* Header */}
            <div className="flex items-start justify-between mb-8 border-b border-white/[0.06] pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-white/50" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">{selectedTicket.name}</h2>
                  <p className="text-sm text-white/50">{selectedTicket.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded capitalize">{selectedTicket.type}</span>
                    <StatusBadge status={selectedTicket.status} />
                  </div>
                </div>
              </div>
              {selectedTicket.status === 'open' && (
                <button
                  onClick={() => handleResolve(selectedTicket.id)}
                  className="px-4 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                  style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
                >
                  <Check className="w-4 h-4" />
                  Mark Resolved
                </button>
              )}
            </div>

            {/* Message Thread */}
            <div className="border border-white/[0.06] rounded-lg p-5 mb-5 bg-[#1a1a1a]">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-semibold text-white">{selectedTicket.subject}</h3>
              </div>

              {/* Original message */}
              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-white/70">{selectedTicket.name}</p>
                  <p className="text-xs text-white/40">{selectedTicket.submittedAt}</p>
                </div>
                <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{selectedTicket.message}</p>
              </div>

              {selectedTicket.status === 'resolved' && (
                <div className="bg-emerald-500/20 border border-emerald-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <p className="text-xs font-semibold text-emerald-400">Resolved by Admin</p>
                  </div>
                  <p className="text-sm text-emerald-400">This ticket has been marked as resolved.</p>
                </div>
              )}
            </div>

            {/* Reply Composer */}
            {selectedTicket.status === 'open' && (
              <div className="border border-white/[0.08] rounded-2xl p-5 bg-white/[0.05]">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Reply to {selectedTicket.name}
                </h3>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response..."
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/[0.06] rounded-2xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-hive-accent h-32 resize-none mb-3"
                />
                <div className="flex justify-end gap-2">
                  <button className="px-4 py-2 rounded-lg border border-white/[0.06] text-sm font-medium text-white/60 hover:bg-white/5 transition-colors">
                    Save Draft
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
                  >
                    Send Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-white/40 text-sm">
            Select a ticket to view details
          </div>
        )}
      </div>
    </div>
  )
}
