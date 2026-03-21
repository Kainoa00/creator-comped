'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase, isDemoMode } from '@/lib/supabase'

const tabs = [
  {
    href: '/creator/discover',
    label: 'Discover',
    icon: MapPin,
    matchPaths: ['/creator/discover', '/creator/cart', '/creator/redeem'],
  },
  {
    href: '/creator/profile',
    label: 'Profile',
    icon: User,
    matchPaths: ['/creator/profile'],
  },
]

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(isDemoMode)
  const [offline, setOffline] = useState(false)

  const isProofPage = pathname === '/creator/proof'

  useEffect(() => {
    if (isDemoMode) return
    supabase?.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace('/')
      } else {
        setAuthChecked(true)
      }
    })
  }, [router])

  useEffect(() => {
    setOffline(!navigator.onLine)
    const onOnline = () => setOffline(false)
    const onOffline = () => setOffline(true)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="h-7 w-7 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white relative flex">
      {offline && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-yellow-500 text-black text-center text-xs font-semibold py-2 px-4">
          No internet connection
        </div>
      )}

      {/* Desktop sidebar — hidden on mobile */}
      {!isProofPage && (
        <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-slate-100 bg-white sticky top-0 h-screen">
          {/* Brand */}
          <div className="px-5 py-6 border-b border-slate-100">
            <span className="text-sm font-bold tracking-tight text-slate-900">
              Creator<span className="text-cc-accent">Comped</span>
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Creator navigation">
            {tabs.map((tab) => {
              const isActive = tab.matchPaths.some((p) => pathname.startsWith(p))
              const Icon = tab.icon
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-cc-accent-subtle text-cc-accent'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    className="h-4 w-4 shrink-0"
                    strokeWidth={isActive ? 2.5 : 1.75}
                  />
                  {tab.label}
                </Link>
              )
            })}
          </nav>
        </aside>
      )}

      {/* Main content */}
      <div className={cn('flex-1 flex flex-col min-w-0', !isProofPage && 'md:pb-0 pb-16')}>
        {children}
      </div>

      {/* Mobile bottom tab bar — hidden on desktop */}
      {!isProofPage && (
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100/80"
          style={{ height: '64px' }}
          aria-label="Creator navigation"
        >
          <div className="max-w-sm mx-auto h-full flex items-stretch">
            {tabs.map((tab) => {
              const isActive = tab.matchPaths.some((p) => pathname.startsWith(p))
              const Icon = tab.icon

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    'relative flex-1 flex flex-col items-center justify-center gap-0.5 transition-all duration-200',
                    isActive ? 'text-cc-accent' : 'text-slate-400 hover:text-slate-500'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div
                    className={cn(
                      'w-10 h-7 rounded-2xl flex items-center justify-center transition-all duration-200',
                      isActive ? 'bg-cc-accent-subtle' : 'bg-transparent'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-5 w-5 transition-colors',
                        isActive ? 'text-cc-accent' : 'text-slate-400'
                      )}
                      strokeWidth={isActive ? 2.5 : 1.75}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-[10px] font-semibold tracking-wide transition-colors',
                      isActive ? 'text-cc-accent' : 'text-slate-400'
                    )}
                  >
                    {tab.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </div>
  )
}
