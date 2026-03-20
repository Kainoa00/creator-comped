'use client'

import { usePathname } from 'next/navigation'
import { Scan, LayoutDashboard } from 'lucide-react'
import { DarkBottomTabBar } from '@/components/restaurant-ui/DarkBottomTabBar'
import { cn } from '@/lib/utils'

const tabs = [
  {
    href: '/restaurant',
    label: 'Scanner',
    icon: Scan,
    matchPaths: ['/restaurant'],
  },
  {
    href: '/restaurant/manager',
    label: 'Manager',
    icon: LayoutDashboard,
    matchPaths: ['/restaurant/manager'],
  },
]

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Hide tab bar on ticket pages (staff is in the middle of a confirmation)
  const isTicketPage = pathname.startsWith('/restaurant/ticket')

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <main className={cn('min-h-screen max-w-sm mx-auto', !isTicketPage && 'pb-20')}>
        {children}
      </main>

      {!isTicketPage && <DarkBottomTabBar tabs={tabs} />}
    </div>
  )
}
