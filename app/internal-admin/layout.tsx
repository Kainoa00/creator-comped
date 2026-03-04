'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Users, FileCheck, HelpCircle, LogOut } from 'lucide-react'

const navItems = [
  { href: '/internal-admin', icon: Users, label: 'Applications Queue', exact: true },
  { href: '/internal-admin/submissions', icon: FileCheck, label: 'Submissions Queue', exact: false },
  { href: '/internal-admin/support', icon: HelpCircle, label: 'Support Queue', exact: false },
]

export default function InternalAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const handleLogout = () => {
    router.push('/internal-admin/login')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white/5 backdrop-blur-sm border-r border-white/5 flex flex-col fixed h-screen z-50">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="font-bold">LT</span>
            </div>
            <div>
              <div className="font-semibold">Liaison Technologies</div>
              <div className="text-xs text-white/50">Internal Admin</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
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
                <span>{item.label}</span>
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
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  )
}
