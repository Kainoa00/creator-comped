'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/hooks/useAuth'
import { isNative } from '@/lib/capacitor'

const tabs = [
  {
    href: '/discover',
    label: 'Discover',
    icon: MapPin,
    matchPaths: ['/discover', '/cart', '/redeem', '/proof'],
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: User,
    matchPaths: ['/profile'],
  },
]

export default function InfluencerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading } = useAuth()
  const [offline, setOffline] = useState(false)

  // Auth guard — influencer only
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    } else if (!loading && user && user.role !== 'influencer') {
      // Wrong role — redirect to their correct portal
      if (user.role === 'business') router.replace('/dashboard')
      else if (user.role === 'admin') router.replace('/admin')
    }
  }, [loading, user, router])

  // Register push notifications on native platforms
  useEffect(() => {
    if (!loading && user && isNative()) {
      import('@/lib/supabase').then(({ supabase, isDemoMode }) => {
        if (isDemoMode || !supabase) return
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.access_token) {
            import('@/lib/push-notifications').then(({ registerPushNotifications }) => {
              registerPushNotifications(user.userId, session.access_token).catch(() => {})
            })
          }
        })
      })
    }
  }, [loading, user])

  useEffect(() => {
    let cleanup: (() => void) | null = null
    let disposed = false
    import('@/lib/network').then(({ watchNetwork }) => {
      if (disposed) return
      cleanup = watchNetwork((connected) => setOffline(!connected))
    })
    return () => { disposed = true; cleanup?.() }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center">
        <div className="h-7 w-7 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div>
    )
  }

  const isProofPage = pathname === '/proof'

  return (
    <div className="min-h-screen bg-[#0B0B0D] relative">
      {offline && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-yellow-500 text-black text-center text-xs font-semibold py-2 px-4">
          No internet connection
        </div>
      )}

      {/* Main content — leave room for floating nav */}
      <div className={cn('flex-1', !isProofPage && 'pb-24')}>
        {children}
      </div>

      {/* Floating pill bottom nav */}
      {!isProofPage && (
        <nav
          className="fixed left-1/2 -translate-x-1/2 z-50"
          style={{ bottom: 'max(24px, env(safe-area-inset-bottom, 24px))' }}
          aria-label="Main navigation"
        >
          <div className="flex items-center bg-[#1a1a1a] rounded-[26px] px-2 py-2 gap-1 shadow-xl shadow-black/40 border border-white/[0.06]">
            {tabs.map((tab) => {
              const isActive = tab.matchPaths.some((p) => pathname.startsWith(p))
              const Icon = tab.icon
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-[20px] text-sm font-semibold transition-all duration-200',
                    isActive
                      ? 'text-white'
                      : 'text-white/40 hover:text-white/70'
                  )}
                  style={
                    isActive
                      ? { background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }
                      : undefined
                  }
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={isActive ? 2.5 : 1.75} />
                  {isActive && <span>{tab.label}</span>}
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </div>
  )
}
