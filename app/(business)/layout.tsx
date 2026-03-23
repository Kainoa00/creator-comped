'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  TrendingUp,
  UtensilsCrossed,
  Scissors,
  FileText,
  Megaphone,
  Settings,
  LifeBuoy,
  QrCode,
  LogOut,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/hooks/useAuth'

const sidebarNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/comps', label: 'Comps', icon: Receipt },
  { href: '/dashboard/spend', label: 'Spend', icon: TrendingUp },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/menu', label: 'Edit Menu', icon: UtensilsCrossed },
  { href: '/dashboard/services', label: 'Services', icon: Scissors },
  { href: '/dashboard/deliverables', label: 'Edit Deliverables', icon: FileText },
  { href: '/dashboard/campaign', label: 'Campaign', icon: Megaphone },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/support', label: 'Support', icon: LifeBuoy },
]

const mobileTabs = [
  { href: '/dashboard/scanner', label: 'Scanner', icon: QrCode, matchPaths: ['/dashboard/scanner'] },
  { href: '/dashboard/settings', label: 'Profile', icon: User, matchPaths: ['/dashboard/settings', '/dashboard/support'] },
]

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const [offline, setOffline] = useState(false)

  // Auth guard — business only
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    } else if (!loading && user && user.role !== 'business' && user.role !== 'admin') {
      if (user.role === 'influencer') router.replace('/discover')
    }
  }, [loading, user, router])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="h-6 w-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex">
      {offline && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-yellow-500 text-black text-center text-xs font-semibold py-2 px-4">
          No internet connection
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-white/[0.06] bg-[#0d0d0d] sticky top-0 h-screen">
        {/* Brand */}
        <div className="px-5 py-6 border-b border-white/[0.06]">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg mb-3">
            H
          </div>
          <p className="text-sm font-bold text-white leading-tight">HIVE</p>
          <p className="text-[10px] text-white/40 mt-0.5 font-medium tracking-widest uppercase">Business</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="Business navigation">
          {sidebarNav.map((item) => {
            const active = isActive(item.href, item.exact)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                )}
                aria-current={active ? 'page' : undefined}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full bg-gradient-to-b from-[#FF6B35] to-[#4A90E2]" />
                )}
                <Icon className="h-4 w-4 shrink-0" strokeWidth={active ? 2.5 : 1.75} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/[0.06] px-5 py-4">
          <p className="text-xs text-white/30 mb-3 truncate">{user?.email}</p>
          <button
            onClick={() => signOut().then(() => router.push('/login'))}
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 md:pb-0 pb-20">
        {children}
      </div>

      {/* Mobile 2-tab bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] border-t border-white/[0.06]"
        style={{ height: '64px' }}
        aria-label="Business navigation"
      >
        <div className="h-full flex items-stretch">
          {mobileTabs.map((tab) => {
            const active = tab.matchPaths.some((p) => pathname.startsWith(p))
            const Icon = tab.icon
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-1 transition-colors',
                  active ? 'text-white' : 'text-white/40'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.75} />
                <span className="text-[10px] font-semibold">{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
