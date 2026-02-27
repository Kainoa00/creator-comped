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
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">

        {/* Logo + Restaurant */}
        <div className="px-5 pt-5 pb-4 border-b border-slate-200">
          <CCLogoWithMark size="sm" />
          <div className="mt-4">
            <p className="text-sm font-semibold text-slate-900 truncate">{restaurant.name}</p>
            <p className="text-xs text-slate-400 truncate mt-0.5">{restaurant.address}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href, item.exact)
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer text-left relative',
                  active
                    ? 'text-cc-accent font-semibold bg-slate-50'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 bg-cc-accent rounded-full" />
                )}
                <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-cc-accent' : 'text-slate-400')} />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Status */}
        <div className="px-5 pb-5 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                <p className="text-xs font-medium text-slate-700">
                  {pathname.startsWith('/restaurant/manager') ? 'Manager Mode' : 'Staff Mode'}
                </p>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{restaurant.name}</p>
            </div>
            <button
              onClick={() => router.push('/restaurant/manager')}
              className="h-7 w-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors cursor-pointer shrink-0"
              title="Manager Settings"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center justify-between h-12 px-6">
            <p className="text-sm text-slate-400">
              {pathname === '/restaurant'
                ? 'Staff Scanner'
                : pathname.startsWith('/restaurant/manager')
                ? 'Manager Dashboard'
                : 'Restaurant Portal'}
            </p>
            <span className={cn(
              'text-xs font-medium px-2.5 py-0.5 rounded border',
              pathname.startsWith('/restaurant/manager')
                ? 'text-cc-accent border-cc-accent/30 bg-slate-50'
                : 'text-emerald-600 border-emerald-200 bg-emerald-50'
            )}>
              {pathname.startsWith('/restaurant/manager') ? 'Manager' : 'Staff'}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
