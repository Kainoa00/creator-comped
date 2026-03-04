'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Receipt,
  DollarSign,
  BarChart3,
  Menu as MenuIcon,
  FileText,
  User,
  HelpCircle,
  LogOut,
  ChevronLeft,
} from 'lucide-react'

const navItems = [
  { href: '/restaurant-admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/restaurant-admin/comps', icon: Receipt, label: 'Comps', exact: false },
  { href: '/restaurant-admin/spend', icon: DollarSign, label: 'Spend', exact: false },
  { href: '/restaurant-admin/analytics', icon: BarChart3, label: 'Analytics', exact: false },
  { href: '/restaurant-admin/menu', icon: MenuIcon, label: 'Edit Menu', exact: false },
  { href: '/restaurant-admin/deliverables', icon: FileText, label: 'Edit Deliverables', exact: false },
  { href: '/restaurant-admin/profile', icon: User, label: 'Edit Profile', exact: false },
  { href: '/restaurant-admin/support', icon: HelpCircle, label: 'Support', exact: false },
]

export default function RestaurantAdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const handleLogout = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white/5 backdrop-blur-sm border-r border-white/5 flex flex-col transition-all duration-300 fixed h-screen z-50`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="font-bold">CC</span>
          </div>
          {sidebarOpen && (
            <div>
              <div className="font-semibold">Restaurant Name</div>
              <div className="text-xs text-white/50">Admin Dashboard</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  active
                    ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition w-full"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-6 w-6 h-6 bg-white/10 backdrop-blur-sm border border-white/5 rounded-full flex items-center justify-center hover:bg-white/20 transition"
        >
          <ChevronLeft
            className={`w-4 h-4 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`}
          />
        </button>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        } transition-all duration-300 p-8`}
      >
        {children}
      </main>
    </div>
  )
}
