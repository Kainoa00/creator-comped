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
  Shield,
} from 'lucide-react'

// Demo pending counts
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
      <aside className="w-64 shrink-0 flex flex-col bg-slate-50 border-r border-slate-100">
        {/* Logo + Brand */}
        <div className="px-5 py-5 border-b border-slate-100">
          <CCLogoWithMark size="sm" />
          <div className="flex items-center gap-1.5 mt-2 ml-0.5">
            <Shield className="h-3 w-3 text-cc-accent" />
            <span className="text-xs font-bold text-cc-accent uppercase tracking-widest">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 pb-4 px-3 flex flex-col gap-0.5 overflow-y-auto">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold px-5 pt-5 pb-2">
            Main
          </p>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative',
                  active
                    ? 'bg-cc-accent-subtle text-cc-accent font-bold border-l-4 border-cc-accent pl-2'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                )}
              >
                <span className={cn('shrink-0', active ? 'text-cc-accent' : 'text-slate-400')}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="shrink-0 inline-flex items-center justify-center h-5 w-5 rounded-full bg-cc-accent text-white text-xs font-bold ml-auto">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom: Admin info + Sign Out */}
        <div className="border-t border-slate-100 px-5 py-5">
          {/* Admin Mode indicator */}
          <div className="flex items-center gap-2 px-3 py-2 bg-cc-accent-subtle rounded-xl mb-3">
            <Shield className="h-3.5 w-3.5 text-cc-accent shrink-0" />
            <span className="text-xs font-bold text-cc-accent">Admin Mode</span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-cc-accent/10 border border-cc-accent/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-cc-accent">AD</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-slate-900 truncate">Admin User</span>
              <span className="text-xs text-slate-400 truncate">admin@creatorcomped.com</span>
            </div>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-600 hover:bg-white transition-colors"
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
