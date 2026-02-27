'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { MapPin, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  {
    href: '/creator/discover',
    label: 'Discover',
    icon: MapPin,
    matchPaths: ['/creator/discover', '/creator/cart', '/creator/redeem'],
  },
  {
    href: '/creator/profile',
    label: 'Profile',
    icon: User,
    matchPaths: ['/creator/profile'],
  },
]

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // On the proof page, hide tab bar — creator is locked in
  const isProofPage = pathname === '/creator/proof'

  return (
    <div className="min-h-screen bg-white relative">
      {/* Main content area */}
      <main className={cn('min-h-screen', !isProofPage && 'pb-16')}>
        {children}
      </main>

      {/* Bottom Tab Bar — premium iOS style */}
      {!isProofPage && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100/80"
          style={{ height: '64px' }}
          aria-label="Creator navigation"
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
                    isActive ? 'text-cc-accent' : 'text-slate-400 hover:text-slate-500'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Icon container — filled bg when active */}
                  <div
                    className={cn(
                      'w-10 h-7 rounded-2xl flex items-center justify-center transition-all duration-200',
                      isActive ? 'bg-cc-accent-subtle' : 'bg-transparent'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-5 w-5 transition-colors',
                        isActive ? 'text-cc-accent' : 'text-slate-400'
                      )}
                      strokeWidth={isActive ? 2.5 : 1.75}
                    />
                  </div>

                  {/* Label */}
                  <span
                    className={cn(
                      'text-[10px] font-semibold tracking-wide transition-colors',
                      isActive ? 'text-cc-accent' : 'text-slate-400'
                    )}
                  >
                    {tab.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </div>
  )
}
