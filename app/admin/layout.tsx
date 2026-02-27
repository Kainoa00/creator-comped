'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { CCLogoWithMark } from '@/components/cc-logo'
import {
  LayoutDashboard,
  UserCheck,
  Film,
  Zap,
  Trophy,
  UtensilsCrossed,
  LogOut,
} from 'lucide-react'

const PENDING_VETTING = 3
const PENDING_PROOFS = 5

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
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col bg-white border-r border-slate-200">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-200">
          <CCLogoWithMark size="sm" />
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-2">
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
                    ? 'text-cc-accent font-semibold bg-slate-50'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 bg-cc-accent rounded-full" />
                )}
                <span className={cn('shrink-0', active ? 'text-cc-accent' : 'text-slate-400')}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="shrink-0 text-xs font-semibold text-slate-400 tabular-nums">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-200 px-5 py-4">
          <p className="text-xs font-semibold text-slate-900 mb-0.5">Admin User</p>
          <p className="text-xs text-slate-400 mb-3">admin@creatorcomped.com</p>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-white">
        {children}
      </main>
    </div>
  )
}
