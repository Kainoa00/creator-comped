'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { HiveLogoWithMark } from '@/components/hive-logo'
import { useAuth } from '@/lib/hooks/useAuth'
import {
  LayoutDashboard,
  UserCheck,
  Film,
  Zap,
  Trophy,
  UtensilsCrossed,
  Users,
  FileCheck,
  Inbox,
  LogOut,
  Store,
} from 'lucide-react'

const PENDING_VETTING = 3
const PENDING_PROOFS = 5
const PENDING_APPS = 2
const PENDING_INBOX = 2

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: number
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    label: 'Creator Vetting',
    href: '/admin/vetting',
    icon: <UserCheck className="h-4 w-4" />,
    badge: PENDING_VETTING,
  },
  {
    label: 'Proof Review',
    href: '/admin/proof',
    icon: <Film className="h-4 w-4" />,
    badge: PENDING_PROOFS,
  },
  {
    label: 'Strikes & Bans',
    href: '/admin/strikes',
    icon: <Zap className="h-4 w-4" />,
  },
  {
    label: 'Leaderboard',
    href: '/admin/leaderboard',
    icon: <Trophy className="h-4 w-4" />,
  },
  {
    label: 'Restaurants',
    href: '/admin/restaurants',
    icon: <UtensilsCrossed className="h-4 w-4" />,
  },
  {
    label: 'Applications',
    href: '/admin/applications',
    icon: <Users className="h-4 w-4" />,
    badge: PENDING_APPS,
  },
  {
    label: 'Submissions',
    href: '/admin/submissions',
    icon: <FileCheck className="h-4 w-4" />,
  },
  {
    label: 'Support Inbox',
    href: '/admin/inbox',
    icon: <Inbox className="h-4 w-4" />,
    badge: PENDING_INBOX,
  },
]

const PREVIEW_ITEMS: NavItem[] = [
  {
    label: 'Business Dashboard',
    href: '/dashboard',
    icon: <Store className="h-4 w-4" />,
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, signOut } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    } else if (!loading && user && user.role !== 'admin') {
      router.replace(user.role === 'business' ? '/dashboard' : '/discover')
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B0B0D]">
        <div className="h-5 w-5 border-2 border-white/10 border-t-white/60 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || user.role !== 'admin') return null

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <div className="flex h-screen bg-[#0B0B0D] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col bg-[#0B0B0D] border-r border-white/[0.06]">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <HiveLogoWithMark size="sm" />
          <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mt-2">
            Admin Panel
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors relative',
                  active
                    ? 'text-white font-semibold bg-white/10'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 bg-cc-accent rounded-full" />
                )}
                <span className={cn('shrink-0', active ? 'text-white' : 'text-white/40')}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="shrink-0 text-xs font-semibold text-white/40 tabular-nums">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}

          {/* Preview section */}
          <div className="mt-3 pt-3 border-t border-white/[0.06]">
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/25">
              Preview
            </p>
            {PREVIEW_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors relative',
                    active
                      ? 'text-white font-semibold bg-white/10'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  )}
                >
                  <span className={cn('shrink-0', active ? 'text-white' : 'text-white/40')}>
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-white/[0.06] px-5 py-4">
          <p className="text-xs font-semibold text-white mb-0.5">Admin</p>
          <p className="text-xs text-white/40 mb-3 truncate">{user.email}</p>
          <button
            onClick={() => signOut().then(() => router.push('/login'))}
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#0B0B0D]">
        {children}
      </main>
    </div>
  )
}
