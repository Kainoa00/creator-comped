'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Resources', href: '#resources' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Guard against no-op state updates on every scroll tick
  useEffect(() => {
    const handler = () => {
      const next = window.scrollY > 20
      setScrolled((prev) => (prev === next ? prev : next))
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Escape key + body scroll-lock when mobile menu is open
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_0_0_rgba(255,255,255,0.04)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between" aria-label="Main navigation">
        {/* Logo */}
        <Link href="/" className="text-xl font-extrabold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-sm">
          Creator<span className="bg-gradient-to-r from-orange-400 to-blue-500 bg-clip-text text-transparent">Comped</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="relative text-sm text-white/60 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-sm after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-gradient-to-r after:from-orange-400 after:to-blue-500 after:transition-all after:duration-300 hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            href="/restaurant-admin/login"
            className="px-5 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
          >
            Login
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-white/70 hover:text-white transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile drawer — proper nav, not role="menu" */}
      <div
        id="mobile-nav"
        className={`md:hidden border-t border-white/[0.06] bg-[#0d0d0d] overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav aria-label="Mobile navigation" className="px-6 py-5 flex flex-col gap-4">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-sm"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/restaurant-admin/login"
            className="mt-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white text-center bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  )
}
