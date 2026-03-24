'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Modal, ModalFooter } from '@/components/ui/modal'
import { Avatar } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/toast'
import { relativeTime, formatNumber } from '@/lib/utils'
import {
  ArrowLeft,
  Instagram,
  ExternalLink,
  MapPin,
  Mail,
  Phone,
  Tag,
  Calendar,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Copy,
  Check,
  Shield,
  Clock,
} from 'lucide-react'

// Expanded demo application data
const DEMO_APPLICATIONS: Record<string, {
  id: string
  name: string
  email: string
  phone: string | null
  ig_handle: string | null
  tiktok_handle: string | null
  follower_count: number | null
  geo_market: string
  invite_code: string | null
  why_join: string | null
  status: 'pending' | 'approved' | 'rejected'
  submitted_at: string
  dm_status: 'pending' | 'sent' | 'verified'
  dm_code: string
}> = {
  'app-001': {
    id: 'app-001',
    name: 'Aaliyah Okonkwo',
    email: 'aaliyah@example.com',
    phone: '(801) 555-1234',
    ig_handle: '@aaliyah.bites',
    tiktok_handle: '@aaliyahbites',
    follower_count: 12400,
    geo_market: 'Utah County',
    invite_code: 'CC-FRIEND-2024',
    why_join: "I love sharing my Utah food adventures with my community! I've been creating food content for 2 years and would love to grow with local restaurants.",
    status: 'pending',
    submitted_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    dm_status: 'pending',
    dm_code: 'CC-VERIFY-AXK7P2',
  },
  'app-002': {
    id: 'app-002',
    name: 'Brett Sullivan',
    email: 'brett.s@example.com',
    phone: null,
    ig_handle: '@brett_eatsslc',
    tiktok_handle: null,
    follower_count: 8700,
    geo_market: 'SLC County',
    invite_code: null,
    why_join: null,
    status: 'pending',
    submitted_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    dm_status: 'sent',
    dm_code: 'CC-VERIFY-B3M9QR',
  },
  'app-003': {
    id: 'app-003',
    name: 'Sofia Mendez',
    email: 'sofia.m@example.com',
    phone: '(385) 555-9988',
    ig_handle: '@sofiafoodie',
    tiktok_handle: '@sofiamendezfood',
    follower_count: 31000,
    geo_market: 'Utah County',
    invite_code: 'CC-CREATOR-SOFIA',
    why_join: 'Been following the network for months — excited to finally apply! I create food + lifestyle content and have worked with 10+ local brands.',
    status: 'pending',
    submitted_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    dm_status: 'verified',
    dm_code: 'CC-VERIFY-C5T2WX',
  },
}

const DM_STATUS_STEPS = {
  pending: 0,
  sent: 1,
  verified: 2,
}

export default function CreatorReviewPage() {
  const { creatorId } = useParams<{ creatorId: string }>()
  const router = useRouter()
  const { toast } = useToast()

  const app = DEMO_APPLICATIONS[creatorId as string] ?? {
    id: creatorId,
    name: 'Unknown Applicant',
    email: 'unknown@example.com',
    phone: null,
    ig_handle: null,
    tiktok_handle: null,
    follower_count: null,
    geo_market: 'Unknown',
    invite_code: null,
    why_join: null,
    status: 'pending' as const,
    submitted_at: new Date().toISOString(),
    dm_status: 'pending' as const,
    dm_code: 'CC-VERIFY-XXXXXX',
  }

  const [dmStatus, setDmStatus] = useState<'pending' | 'sent' | 'verified'>(app.dm_status)
  const [appStatus, setAppStatus] = useState<'pending' | 'approved' | 'rejected'>(app.status)
  const [notes, setNotes] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [moreInfoMsg, setMoreInfoMsg] = useState('')
  const [codeCopied, setCodeCopied] = useState(false)

  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showMoreInfoModal, setShowMoreInfoModal] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleMarkSent() {
    setDmStatus('sent')
    toast({ type: 'info', title: 'DM Status Updated', message: 'Marked as code sent.' })
  }

  async function handleMarkVerified() {
    setDmStatus('verified')
    toast({ type: 'success', title: 'DM Verified', message: 'Creator has been DM-verified.' })
  }

  async function handleApprove() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    setAppStatus('approved')
    setShowApproveModal(false)
    setLoading(false)
    toast({ type: 'success', title: 'Creator Approved', message: `${app.name} has been approved and notified.` })
  }

  async function handleReject() {
    if (!rejectReason.trim()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    setAppStatus('rejected')
    setShowRejectModal(false)
    setLoading(false)
    toast({ type: 'error', title: 'Creator Rejected', message: `${app.name}'s application has been rejected.` })
  }

  async function handleMoreInfo() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    setShowMoreInfoModal(false)
    setLoading(false)
    toast({ type: 'info', title: 'Request Sent', message: 'More information requested from creator.' })
  }

  function copyCode() {
    navigator.clipboard.writeText(app.dm_code)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  const dmStep = DM_STATUS_STEPS[dmStatus]

  return (
    <div className="px-8 py-6">
      {/* Back + header */}
      <div className="border-b border-white/[0.06] pb-5 -mx-8 px-8 mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">Creator Review</h1>
            <p className="text-sm text-white/40">Application #{app.id}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {appStatus === 'approved' && <Badge variant="success" dot size="md">Approved</Badge>}
            {appStatus === 'rejected' && <Badge variant="error" dot size="md">Rejected</Badge>}
            {appStatus === 'pending' && <Badge variant="warning" dot size="md">Pending Review</Badge>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Left Column: Creator Info */}
        <div className="col-span-2 space-y-4">
          {/* Profile card */}
          <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <Avatar src={null} name={app.name} size="xl" />
              <h2 className="mt-4 text-2xl font-bold text-white">{app.name}</h2>
              {app.follower_count != null && (
                <p className="text-sm text-white/40 mt-1">
                  ~{formatNumber(app.follower_count)} followers
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-white/40 shrink-0" />
                <span className="text-sm text-white/70">{app.email}</span>
              </div>
              {app.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-white/40 shrink-0" />
                  <span className="text-sm text-white/70">{app.phone}</span>
                </div>
              )}
              {app.ig_handle && (
                <div className="flex items-center gap-3">
                  <Instagram className="h-4 w-4 text-white/40 shrink-0" />
                  <a
                    href={`https://instagram.com/${app.ig_handle.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-hive-accent hover:underline flex items-center gap-1"
                  >
                    {app.ig_handle} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              {app.tiktok_handle && (
                <div className="flex items-center gap-3">
                  <span className="h-4 w-4 text-white/40 shrink-0 text-xs font-bold flex items-center justify-center">TT</span>
                  <a
                    href={`https://tiktok.com/${app.tiktok_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-hive-accent hover:underline flex items-center gap-1"
                  >
                    {app.tiktok_handle} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-white/40 shrink-0" />
                <span className="text-sm text-white/60">{app.geo_market}</span>
              </div>
              {app.invite_code && (
                <div className="flex items-center gap-3">
                  <Tag className="h-4 w-4 text-white/40 shrink-0" />
                  <span className="border border-white/[0.06] rounded-md px-3 py-1 text-sm font-mono text-white/70">{app.invite_code}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-white/40 shrink-0" />
                <span className="text-sm text-white/50">Applied {relativeTime(app.submitted_at)}</span>
              </div>
            </div>
          </div>

          {/* Why join */}
          {app.why_join && (
            <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-2">Why they want to join</h3>
              <p className="text-sm text-white/50 leading-relaxed">{app.why_join}</p>
            </div>
          )}

          {/* Admin notes */}
          <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-2">Internal Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes (not visible to applicant)..."
              rows={4}
              className="w-full bg-white/5 border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 resize-none focus:outline-none focus:border-hive-accent"
            />
            {notes && (
              <Button variant="secondary" size="sm" className="mt-2">
                Save Notes
              </Button>
            )}
          </div>
        </div>

        {/* Right Column: Review Actions */}
        <div className="col-span-3 space-y-4">
          {/* DM Verification Section */}
          <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Shield className="h-5 w-5 text-hive-accent" />
              <h2 className="text-base font-semibold text-white">DM Verification</h2>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border border-white/[0.06] text-white/60">
                <span className={`h-1.5 w-1.5 rounded-full ${
                  dmStatus === 'verified' ? 'bg-emerald-500' : dmStatus === 'sent' ? 'bg-amber-500' : 'bg-white/40'
                }`} />
                {dmStatus === 'verified' ? 'Verified' : dmStatus === 'sent' ? 'Code Sent' : 'Pending'}
              </span>
            </div>

            {/* Verification code */}
            <div className="bg-black/60 text-white rounded-lg p-4 font-mono text-lg tracking-widest text-center mb-4">
              {app.dm_code}
              <button
                onClick={copyCode}
                className="ml-4 inline-flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors"
              >
                {codeCopied ? (
                  <><Check className="h-3.5 w-3.5 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
                ) : (
                  <><Copy className="h-3.5 w-3.5" /> Copy</>
                )}
              </button>
            </div>

            {/* Instructions */}
            <div className="border border-white/[0.06] rounded-lg px-4 py-3 mb-5 text-sm text-white/70">
              <p className="font-semibold mb-1">Instructions</p>
              <p className="text-white/50 leading-relaxed">
                Send this code via Instagram DM to{' '}
                <span className="font-medium text-white/70">@{app.ig_handle?.replace('@', '')}</span>. Ask the
                creator to reply with the code to confirm ownership of the account.
              </p>
            </div>

            {/* 3-step progress */}
            <div className="flex items-center gap-2 mb-5">
              {[
                { label: 'Code Generated', step: 0 },
                { label: 'Code Sent', step: 1 },
                { label: 'Verified', step: 2 },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`h-6 w-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                        dmStep > s.step
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : dmStep === s.step
                          ? 'border-hive-accent text-hive-accent'
                          : 'border-white/[0.06] text-white/30'
                      }`}
                    >
                      {dmStep > s.step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </div>
                    <span className={`text-xs whitespace-nowrap ${dmStep >= s.step ? 'text-white/70' : 'text-white/30'}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < 2 && <div className={`w-10 border-t mb-4 ${dmStep > s.step ? 'border-emerald-300' : 'border-white/[0.06]'}`} />}
                </div>
              ))}
            </div>

            {/* DM Action Buttons */}
            <div className="flex items-center gap-3">
              {dmStatus === 'pending' && (
                <Button variant="secondary" onClick={handleMarkSent} leftIcon={<Clock className="h-4 w-4" />}>
                  Mark Code Sent
                </Button>
              )}
              {dmStatus === 'sent' && (
                <Button variant="success" onClick={handleMarkVerified} leftIcon={<CheckCircle2 className="h-4 w-4" />}>
                  Mark as Verified
                </Button>
              )}
              {dmStatus === 'verified' && (
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-semibold">DM Verified</span>
                </div>
              )}
            </div>
          </div>

          {/* Vetting Decision */}
          <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-4">Vetting Decision</h2>

            {appStatus !== 'pending' ? (
              <div className="flex items-center gap-3 p-4 rounded-lg border border-white/[0.06] text-white/70">
                {appStatus === 'approved' ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <p className="font-semibold capitalize">Application {appStatus}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dmStatus !== 'verified' && (
                  <div className="flex items-center gap-2 border border-white/[0.06] rounded-lg px-4 py-3 text-sm text-white/60">
                    <Shield className="h-4 w-4 shrink-0" />
                    <span>Complete DM verification before approving.</span>
                  </div>
                )}

                <Button
                  variant="success"
                  disabled={dmStatus !== 'verified'}
                  onClick={() => setShowApproveModal(true)}
                  leftIcon={<CheckCircle2 className="h-4 w-4" />}
                  className="w-full"
                >
                  Approve Creator
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setShowRejectModal(true)}
                  leftIcon={<XCircle className="h-4 w-4" />}
                  className="w-full"
                >
                  Reject
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowMoreInfoModal(true)}
                  leftIcon={<MessageSquare className="h-4 w-4" />}
                  className="w-full"
                >
                  Request More Info
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      <Modal
        open={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Approve Creator"
        description="This will grant the creator access to the network."
      >
        <div className="flex items-center gap-3 p-4 border border-white/[0.06] rounded-lg">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          <p className="text-sm text-white/60">
            <span className="font-semibold text-white">{app.name}</span> will be marked as verified and can
            immediately start comping at restaurants.
          </p>
        </div>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowApproveModal(false)}>Cancel</Button>
          <Button variant="success" loading={loading} onClick={handleApprove}>
            Confirm Approval
          </Button>
        </ModalFooter>
      </Modal>

      {/* Reject Modal */}
      <Modal
        open={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Application"
        description="Provide a reason for rejection."
      >
        <div className="space-y-3">
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Reason for rejection (required)..."
            rows={4}
            className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowRejectModal(false)}>Cancel</Button>
          <Button
            variant="danger"
            loading={loading}
            disabled={!rejectReason.trim()}
            onClick={handleReject}
          >
            Reject Application
          </Button>
        </ModalFooter>
      </Modal>

      {/* More Info Modal */}
      <Modal
        open={showMoreInfoModal}
        onClose={() => setShowMoreInfoModal(false)}
        title="Request More Information"
        description="Send a message to the applicant asking for additional details."
      >
        <textarea
          value={moreInfoMsg}
          onChange={(e) => setMoreInfoMsg(e.target.value)}
          placeholder="What information do you need from the applicant?"
          rows={4}
          className="w-full bg-white/5 border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 resize-none focus:outline-none focus:border-hive-accent"
        />
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowMoreInfoModal(false)}>Cancel</Button>
          <Button
            variant="primary"
            loading={loading}
            disabled={!moreInfoMsg.trim()}
            onClick={handleMoreInfo}
          >
            Send Request
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
