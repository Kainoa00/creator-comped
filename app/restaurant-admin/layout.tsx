'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  UtensilsCrossed,
  MoreHorizontal,
} from 'lucide-react'
import { DarkBottomTabBar } from '@/components/restaurant-ui/DarkBottomTabBar'
import { useRestaurantAuth } from '@/lib/hooks/useRestaurantAuth'
import { cn } from '@/lib/utils'

const tabs = [
  {
    href: '/restaurant-admin',
    label: 'Home',
    icon: LayoutDashboard,
    matchPaths: ['/restaurant-admin'],
  },
  {
    href: '/restaurant-admin/comps',
    label: 'Comps',
    icon: Receipt,
    matchPaths: ['/restaurant-admin/comps'],
  },
  {
    href: '/restaurant-admin/analytics',
    label: 'Analytics',
    icon: BarChart3,
    matchPaths: ['/restaurant-admin/analytics', '/restaurant-admin/spend'],
  },
  {
    href: '/restaurant-admin/menu',
    label: 'Menu',
    icon: UtensilsCrossed,
    matchPaths: ['/restaurant-admin/menu', '/restaurant-admin/deliverables'],
  },
  {
    href: '/restaurant-admin/more',
    label: 'More',
    icon: MoreHorizontal,
    matchPaths: ['/restaurant-admin/more', '/restaurant-admin/profile', '/restaurant-admin/settings', '/restaurant-admin/support'],
  },
]

export default function RestaurantAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading } = useRestaurantAuth()
  const [offline, setOffline] = useState(false)

  const isLoginPage = pathname === '/restaurant-admin/login'

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.replace('/restaurant-admin/login')
    }
  }, [loading, user, isLoginPage, router])

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

  if (loading && !isLoginPage) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <span className="h-6 w-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {offline && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-yellow-500 text-black text-center text-xs font-semibold py-2 px-4">
          No internet connection
        </div>
      )}

      {/* Desktop sidebar — hidden on mobile, hidden on login page */}
      {!isLoginPage && (
        <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-white/[0.06] bg-[#0d0d0d] sticky top-0 h-screen">
          {/* Brand */}
          <div className="px-5 py-6 border-b border-white/[0.06]">
            <span className="text-sm font-bold tracking-tight text-white">
              <span className="bg-gradient-to-r from-orange-400 to-blue-500 bg-clip-text text-transparent">HIVE</span>
            </span>
            <p className="text-[10px] text-white/40 mt-0.5 font-medium tracking-widest uppercase">Business</p>
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Restaurant navigation">
            {tabs.map((tab) => {
              const isActive = tab.matchPaths.some((p) =>
                p === '/restaurant-admin' ? pathname === p : pathname.startsWith(p)
              )
              const Icon = tab.icon
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {isActive && (
                    <span className="absolute left-0 w-0.5 h-5 rounded-r-full bg-gradient-to-b from-orange-500 to-rose-500" />
                  )}
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
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0',
          !isLoginPage && 'md:pb-0 pb-20'
        )}
      >
        {children}
      </div>

      {/* Mobile bottom tab bar — hidden on desktop */}
      {!isLoginPage && (
        <div className="md:hidden">
          <DarkBottomTabBar tabs={tabs} />
        </div>
      )}
    </div>
  )
}
