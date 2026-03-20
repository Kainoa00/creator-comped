'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

export interface TabItem {
  href: string
  label: string
  icon: LucideIcon
  matchPaths: string[]
}

interface DarkBottomTabBarProps {
  tabs: TabItem[]
}

export function DarkBottomTabBar({ tabs }: DarkBottomTabBarProps) {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/[0.08]"
      style={{ height: '64px' }}
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
                isActive ? 'text-white' : 'text-white/40 hover:text-white/60'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Gradient active indicator */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600" />
              )}

              <div
                className={cn(
                  'w-10 h-7 rounded-2xl flex items-center justify-center transition-all duration-200',
                  isActive ? 'bg-white/10' : 'bg-transparent'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 transition-colors',
                    isActive ? 'text-white' : 'text-white/40'
                  )}
                  strokeWidth={isActive ? 2.5 : 1.75}
                />
              </div>

              <span
                className={cn(
                  'text-[10px] font-semibold tracking-wide transition-colors',
                  isActive ? 'text-white' : 'text-white/40'
                )}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
