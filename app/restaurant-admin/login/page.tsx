'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRestaurantAuth } from '@/lib/hooks/useRestaurantAuth'
import { isDemoMode } from '@/lib/supabase'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function RestaurantAdminLoginPage() {
  const router = useRouter()
  const { signIn } = useRestaurantAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const err = await signIn(email, password)
    setLoading(false)
    if (err) {
      setError(err)
    } else {
      router.push('/restaurant-admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 via-rose-500 to-blue-600 flex items-center justify-center mx-auto mb-5">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Restaurant Admin</h1>
          <p className="text-sm text-white/50">Sign in to manage your restaurant</p>
        </div>

        {/* Demo Mode Notice */}
        {isDemoMode && (
          <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-3 mb-6 text-center">
            <p className="text-xs text-white/40">
              Demo mode — any email + password will work
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@restaurant.com"
              required
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600 text-white font-bold text-sm mt-2 disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>

          <div className="text-center">
            <a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">
              Forgot password?
            </a>
          </div>
        </form>

        <div className="text-center mt-8">
          <Link href="/" className="text-sm text-white/30 hover:text-white/60 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
