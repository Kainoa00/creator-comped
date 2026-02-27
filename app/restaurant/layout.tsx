'use client'

import { CCLogoWithMark } from '@/components/cc-logo'
import { DEMO_RESTAURANTS } from '@/lib/demo-data'
import { Settings, Scan, LayoutDashboard } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const restaurant = DEMO_RESTAURANTS[0]

const NAV_ITEMS = [
  {
    label: 'Scanner',
    href: '/restaurant',
    icon: Scan,
    exact: true,
  },
  {
    label: 'Manager',
    href: '/restaurant/manager',
    icon: LayoutDashboard,
    exact: false,
  },
]

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ── Sidebar ── */}
      <aside className="w-64 shrink-0 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen shadow-sm">

        {/* Logo + Restaurant Identity */}
        <div className="px-5 pt-6 pb-5 border-b border-slate-100">
          <CCLogoWithMark size="sm" />
          <div className="mt-4 flex items-center gap-3">
            {/* Restaurant avatar / logo placeholder */}
            <div className="h-10 w-10 rounded-xl bg-cc-accent flex items-center justify-center text-white font-black text-base shrink-0 shadow-sm">
              {restaurant.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 leading-tight truncate">{restaurant.name}</p>
              <p className="text-xs text-slate-400 truncate mt-0.5">{restaurant.address}</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href, item.exact)
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer text-left',
                  'border-l-2',
                  active
                    ? 'bg-cc-accent-subtle text-cc-accent font-bold border-cc-accent'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-transparent'
                )}
              >
                <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-cc-accent' : 'text-slate-400')} />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Bottom: Mode indicator */}
        <div className="px-5 pb-6 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
            <div className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-700 leading-tight">
                {pathname.startsWith('/restaurant/manager') ? 'Manager Mode' : 'Staff Mode'}
              </p>
              <p className="text-xs text-slate-400 truncate mt-0.5">{restaurant.name}</p>
            </div>
            <button
              onClick={() => router.push('/restaurant/manager')}
              className="ml-auto h-7 w-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors cursor-pointer shrink-0"
              title="Manager Settings"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top status bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between h-14 px-6">
            <p className="text-sm font-semibold text-slate-400">
              {pathname === '/restaurant'
                ? 'Staff Scanner'
                : pathname.startsWith('/restaurant/manager')
                ? 'Manager Dashboard'
                : pathname.startsWith('/restaurant/ticket')
                ? 'Redemption Ticket'
                : 'Restaurant Portal'}
            </p>
            <div className="flex items-center gap-2">
              <span className={cn(
                'text-xs font-bold px-3 py-1 rounded-full',
                pathname.startsWith('/restaurant/manager')
                  ? 'bg-cc-accent-subtle text-cc-accent'
                  : 'bg-emerald-50 text-emerald-600'
              )}>
                {pathname.startsWith('/restaurant/manager') ? 'Manager' : 'Staff'}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
