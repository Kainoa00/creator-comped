'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { roleRedirectPath } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const { user, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const err = await signIn(email, password)
    if (err) {
      setError(err)
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
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
            >
              HIVE
            </span>
          </h1>
          <p className="text-gray-400 text-sm font-medium">Creators. Businesses. Comped.</p>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-[18px] text-white font-semibold text-base transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
          >
            {loading ? 'Signing in…' : 'Log In'}
          </button>

          <div className="text-center">
            <button type="button" className="text-gray-400 text-sm font-medium hover:text-gray-300 transition-colors">
              Forgot password?
            </button>
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
