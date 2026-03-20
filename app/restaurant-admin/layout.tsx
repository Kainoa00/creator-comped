'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
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

  // Auth guard — redirect to login if no session and not already there
  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.replace('/restaurant-admin/login')
    }
  }, [loading, user, isLoginPage, router])

  // Offline detection
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

  // Show spinner while checking auth (skip on login page to avoid flash)
  if (loading && !isLoginPage) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <span className="h-6 w-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {offline && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-yellow-500 text-black text-center text-xs font-semibold py-2 px-4">
          No internet connection
        </div>
      )}

      <main className={cn('min-h-screen max-w-sm mx-auto', !isLoginPage && 'pb-20')}>
        {children}
      </main>

      {!isLoginPage && <DarkBottomTabBar tabs={tabs} />}
    </div>
  )
}
