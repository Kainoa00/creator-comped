'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { roleRedirectPath } from '@/lib/auth'
import { isDemoMode } from '@/lib/supabase'

function friendlyError(err: string): string {
  const lower = err.toLowerCase()
  if (lower.includes('fetch') || lower.includes('networkerror') || lower.includes('network'))
    return 'Cannot reach server. Check your internet connection.'
  if (lower.includes('not set up'))
    return 'Account not found. Please contact support.'
  if (lower.includes('invalid login') || lower.includes('invalid email or password'))
    return 'Incorrect email or password.'
  return err
}

export default function LoginPage() {
  const router = useRouter()
  const { user, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState(false)
  const [offline, setOffline] = useState(false)

  // Watch network status
  useEffect(() => {
    let cleanup: (() => void) | undefined
    import('@/lib/network').then(({ watchNetwork }) => {
      cleanup = watchNetwork((connected) => setOffline(!connected))
    }).catch(() => {})
    return () => cleanup?.()
  }, [])

  async function handleForgotPassword() {
    if (!email) {
      setError('Enter your email address first')
      return
    }
    if (!isDemoMode) {
      const { supabase } = await import('@/lib/supabase')
      if (supabase) {
        await supabase.auth.resetPasswordForEmail(email)
      }
    }
    setResetSent(true)
    setError(null)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const err = await signIn(email, password)
    if (err) {
      setError(friendlyError(err))
      setLoading(false)
      return
    }
    // signIn() updates the hook's user state, but we can't read it synchronously
    // after the call (React batches state updates). Fetch the session once to get the role.
    const { getSession } = await import('@/lib/auth')
    const session = await getSession()
    router.push(session ? roleRedirectPath(session.role) : '/discover')
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center px-4">
      <div className="w-full max-w-[430px] mx-auto">
        {/* Logo */}
        <div className="text-center pt-8 pb-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hive-logo.svg" alt="HIVE" className="w-16 h-16 mx-auto mb-3" />
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
            >
              HIVE
            </span>
          </h1>
          <p className="text-gray-400 text-sm font-medium">Creating Local Buzz</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="px-4 py-3 rounded-[14px] bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-[18px] text-white text-base placeholder:text-gray-500 focus:outline-none focus:border-[#3a3a3a] transition-colors"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-[18px] text-white text-base placeholder:text-gray-500 focus:outline-none focus:border-[#3a3a3a] transition-colors pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {offline && (
            <div className="px-4 py-3 rounded-[14px] bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm text-center">
              No internet connection. Login requires internet.
            </div>
          )}

          <button
            type="submit"
            disabled={loading || offline}
            className="w-full py-4 rounded-[18px] text-white font-semibold text-base transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
          >
            {loading ? 'Signing in…' : 'Log In'}
          </button>

          <div className="text-center">
            {resetSent ? (
              <p className="text-green-400 text-sm font-medium">
                Password reset link sent to {email}
              </p>
            ) : (
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-gray-400 text-sm font-medium hover:text-gray-300 active:text-white transition-colors"
              >
                Forgot password?
              </button>
            )}
          </div>

          {/* OAuth buttons hidden — Apple/Google sign-in not yet wired up
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-[#2a2a2a]" />
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-[#2a2a2a]" />
          </div>
          <button type="button" ...>Continue with Apple</button>
          <button type="button" ...>Continue with Google</button>
          */}
        </form>

        {/* Bottom */}
        <div className="text-center pb-8 pt-8">
          <p className="text-gray-400 text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-white font-semibold hover:opacity-70 transition-opacity">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
