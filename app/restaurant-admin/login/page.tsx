'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'

export default function RestaurantAdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/restaurant-admin')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShieldCheck className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold">Restaurant Admin Login</h1>
          </div>
          <p className="text-white/70">Sign in to manage your restaurant</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange-500 transition"
                placeholder="admin@restaurant.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange-500 transition pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 text-white font-semibold hover:opacity-90 transition"
            >
              Log In
            </button>

            <div className="text-center">
              <a href="#" className="text-sm text-white/70 hover:text-white transition">
                Forgot password?
              </a>
            </div>
          </form>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-sm text-white/70 hover:text-white transition">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
