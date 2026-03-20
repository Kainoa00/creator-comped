'use client'

import Link from 'next/link'
import { DarkHeader } from '@/components/restaurant-ui/DarkHeader'
import { useRestaurantAuth } from '@/lib/hooks/useRestaurantAuth'
import { useRouter } from 'next/navigation'
import {
  DollarSign,
  FileText,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/restaurant-admin/spend', icon: DollarSign, label: 'Spend', desc: 'Budget & spending breakdown' },
  { href: '/restaurant-admin/deliverables', icon: FileText, label: 'Deliverables', desc: 'Content requirements' },
  { href: '/restaurant-admin/profile', icon: User, label: 'Profile', desc: 'Restaurant information' },
  { href: '/restaurant-admin/settings', icon: Settings, label: 'Settings', desc: 'Account & preferences' },
  { href: '/restaurant-admin/support', icon: HelpCircle, label: 'Support', desc: 'Help & contact' },
]

export default function MorePage() {
  const { signOut } = useRestaurantAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push('/restaurant-admin/login')
  }

  return (
    <div className="px-4 pt-6 pb-20">
      <DarkHeader title="More" subtitle="Settings & resources" />

      <div className="flex flex-col gap-2 mb-6">
        {NAV_ITEMS.map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 hover:bg-white/[0.08] transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5 text-white/60" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="text-xs text-white/40 mt-0.5">{desc}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-white/20 shrink-0" />
          </Link>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-4 bg-red-500/[0.08] border border-red-500/20 rounded-2xl p-4 hover:bg-red-500/[0.12] transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-red-500/[0.12] flex items-center justify-center shrink-0">
          <LogOut className="h-5 w-5 text-red-400" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-red-400">Sign Out</p>
          <p className="text-xs text-red-400/50 mt-0.5">Sign out of your account</p>
        </div>
      </button>
    </div>
  )
}
