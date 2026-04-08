'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, Mail, Lock, AlertTriangle, LogOut } from 'lucide-react'
import * as Switch from '@radix-ui/react-switch'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { useAuth } from '@/lib/hooks/useAuth'
import { isDemoMode } from '@/lib/supabase'

function ToggleRow({ label, description, checked, onChange }: {
  label: string
  description?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between py-4 px-4">
      <div className="flex-1 min-w-0 mr-3">
        <p className="text-sm font-semibold text-white">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <Switch.Root
        checked={checked}
        onCheckedChange={onChange}
        className={`w-11 h-6 rounded-full relative transition-colors outline-none cursor-pointer ${checked ? '' : 'bg-[#2a2a2a]'}`}
        style={checked ? { background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' } : undefined}
      >
        <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-200 translate-x-0.5 data-[state=checked]:translate-x-[22px] shadow-sm" />
      </Switch.Root>
    </div>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [newCompNotif, setNewCompNotif] = useState(true)
  const [proofReminder, setProofReminder] = useState(true)
  const [approvalNotif, setApprovalNotif] = useState(true)
  const [leaderboardNotif, setLeaderboardNotif] = useState(false)
  const [marketingNotif, setMarketingNotif] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [passwordSent, setPasswordSent] = useState(false)

  async function handleDeleteAccount() {
    setDeleting(true)
    try {
      if (!isDemoMode) {
        const { supabase } = await import('@/lib/supabase')
        if (supabase && user) {
          // Delete user data from tables
          await supabase.from('push_tokens').delete().eq('auth_user_id', user.userId)
          await supabase.from('user_profiles').delete().eq('auth_user_id', user.userId)
          if (user.creatorId) {
            await supabase.from('creators').delete().eq('id', user.creatorId)
          }
        }
      }
      await signOut()
      router.replace('/login')
    } catch {
      setDeleting(false)
    }
  }

  async function handleResetPassword() {
    if (!isDemoMode && user?.email) {
      const { supabase } = await import('@/lib/supabase')
      if (supabase) {
        await supabase.auth.resetPasswordForEmail(user.email)
      }
    }
    setPasswordSent(true)
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white max-w-[430px] mx-auto">
      {/* Header */}
      <header className="px-4 pt-14 pb-4 flex items-center gap-3">
        <button onClick={() => router.back()} aria-label="Go back" className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#1a1a1a] active:bg-[#252525] transition-colors">
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </header>

      <div className="px-4 pb-28 space-y-4">
        {/* Notifications */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <Bell className="h-4 w-4 text-gray-500" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Notifications</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden divide-y divide-[#2a2a2a]">
            <ToggleRow label="New Comp Available" description="When a restaurant near you opens a slot" checked={newCompNotif} onChange={setNewCompNotif} />
            <ToggleRow label="Proof Reminders" description="48h posting deadline approaching" checked={proofReminder} onChange={setProofReminder} />
            <ToggleRow label="Approval Updates" description="When your proof is approved or rejected" checked={approvalNotif} onChange={setApprovalNotif} />
            <ToggleRow label="Leaderboard Updates" description="Monthly rankings and results" checked={leaderboardNotif} onChange={setLeaderboardNotif} />
            <ToggleRow label="Promotions & Offers" description="Special deals and featured restaurants" checked={marketingNotif} onChange={setMarketingNotif} />
          </div>
        </div>

        {/* Account */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <Mail className="h-4 w-4 text-gray-500" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Account</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden divide-y divide-[#2a2a2a]">
            <div className="flex items-center justify-between px-4 py-4">
              <div>
                <p className="text-sm font-semibold text-white">Email</p>
                <p className="text-xs text-gray-500 mt-0.5">{user?.email ?? 'Not available'}</p>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordDialog(true)}
              className="w-full flex items-center gap-3 px-4 py-4 hover:bg-white/5 active:bg-white/10 transition-colors"
            >
              <Lock className="h-4 w-4 text-gray-500 shrink-0" />
              <span className="text-sm font-semibold text-white">Change Password</span>
            </button>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={async () => {
            await signOut()
            router.replace('/login')
          }}
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl flex items-center gap-3 px-4 py-4 hover:border-white/20 active:bg-[#252525] transition-colors"
        >
          <LogOut className="h-4 w-4 text-gray-500 shrink-0" />
          <span className="text-sm font-semibold text-white">Sign Out</span>
        </button>

        {/* Danger zone */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <p className="text-xs font-semibold text-red-500 uppercase tracking-widest">Danger Zone</p>
          </div>
          <div className="bg-[#1a1a1a] border border-red-500/20 rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="w-full flex items-center px-4 py-4 hover:bg-red-500/5 active:bg-red-500/10 transition-colors"
            >
              <span className="text-sm font-semibold text-red-400">Delete Account</span>
            </button>
          </div>
        </div>

        {/* Version */}
        <p className="text-center text-xs text-gray-700 pt-2">HIVE v1.0.0</p>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
          <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
            <AlertDialog.Title className="text-lg font-bold text-white">
              Delete Account?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-sm text-gray-400 mt-2 leading-relaxed">
              This will permanently delete your account, order history, and all associated data. This action cannot be undone.
            </AlertDialog.Description>
            <div className="flex gap-3 mt-6">
              <AlertDialog.Cancel asChild>
                <button className="flex-1 py-3 rounded-xl text-sm font-semibold bg-[#252525] text-white border border-[#2a2a2a]">
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold bg-red-500 text-white disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>

      {/* Change Password Dialog */}
      <AlertDialog.Root open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
          <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
            <AlertDialog.Title className="text-lg font-bold text-white">
              {passwordSent ? 'Email Sent' : 'Change Password'}
            </AlertDialog.Title>
            <AlertDialog.Description className="text-sm text-gray-400 mt-2 leading-relaxed">
              {passwordSent
                ? `We've sent a password reset link to ${user?.email ?? 'your email'}. Check your inbox.`
                : `We'll send a password reset link to ${user?.email ?? 'your email'}.`
              }
            </AlertDialog.Description>
            <div className="flex gap-3 mt-6">
              {passwordSent ? (
                <AlertDialog.Cancel asChild>
                  <button
                    onClick={() => setPasswordSent(false)}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
                    style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
                  >
                    Done
                  </button>
                </AlertDialog.Cancel>
              ) : (
                <>
                  <AlertDialog.Cancel asChild>
                    <button className="flex-1 py-3 rounded-xl text-sm font-semibold bg-[#252525] text-white border border-[#2a2a2a]">
                      Cancel
                    </button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <button
                      onClick={handleResetPassword}
                      className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
                      style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
                    >
                      Send Link
                    </button>
                  </AlertDialog.Action>
                </>
              )}
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  )
}
