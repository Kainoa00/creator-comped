'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
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
  ArrowLeft,
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
  { href: '/dashboard/scanner', label: 'Scanner', icon: QrCode, exact: false, matchPaths: ['/dashboard/scanner'] },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true, matchPaths: ['/dashboard'] },
  { href: '/dashboard/settings', label: 'Profile', icon: User, exact: false, matchPaths: ['/dashboard/settings', '/dashboard/support'] },
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

  // Native network detection
  useEffect(() => {
    let cleanup: (() => void) | null = null
    let disposed = false
    import('@/lib/network').then(({ watchNetwork }) => {
      if (disposed) return
      cleanup = watchNetwork((connected) => setOffline(!connected))
    })
    return () => { disposed = true; cleanup?.() }
  }, [])

  // Register push notifications on native platforms
  useEffect(() => {
    if (!loading && user) {
      import('@/lib/capacitor').then(({ isNative }) => {
        if (!isNative()) return
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
      })
    }
  }, [loading, user])

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
      {user?.role === 'admin' && (
        <div className="fixed top-0 left-0 right-0 z-[100] flex items-center gap-3 bg-hive-accent/90 backdrop-blur-sm px-4 py-2">
          <Link href="/admin" className="flex items-center gap-1.5 text-white text-xs font-semibold hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Admin
          </Link>
          <span className="text-white/40 text-xs">·</span>
          <span className="text-white/70 text-xs">Admin Preview — Business Dashboard</span>
        </div>
      )}
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

      {/* Main content — page-level mount animation keyed by pathname */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex-1 flex flex-col min-w-0 md:pb-0 pb-20"
      >
        {children}
      </motion.div>

      {/* Mobile 3-tab bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#141414]/95 backdrop-blur-md border-t border-white/[0.06]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Business navigation"
      >
        <div className="flex items-stretch h-16">
          {mobileTabs.map((tab) => {
            const active = tab.exact
              ? pathname === tab.href
              : tab.matchPaths.some((p) => pathname.startsWith(p))
            const Icon = tab.icon
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-1 transition-all relative',
                  active ? 'text-white' : 'text-white/35'
                )}
                aria-current={active ? 'page' : undefined}
              >
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#4A90E2]" />
                )}
                <div className={cn(
                  'w-10 h-8 rounded-xl flex items-center justify-center transition-all',
                  active ? 'bg-white/10' : ''
                )}>
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.75} />
                </div>
                <span className="text-[10px] font-semibold -mt-0.5">{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
