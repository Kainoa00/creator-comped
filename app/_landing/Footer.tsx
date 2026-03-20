import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.05] bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="text-lg font-extrabold mb-3 tracking-tight">
              Creator<span className="bg-gradient-to-r from-orange-400 to-blue-500 bg-clip-text text-transparent">Comped</span>
            </div>
            <p className="text-sm text-white/40 max-w-xs leading-relaxed">
              Connecting food creators with local restaurants for authentic content and comped meals.
            </p>
          </div>

          {/* Resources */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">Resources</p>
            <nav aria-label="Footer resources" className="flex flex-col gap-3">
              {['Rules', 'Support', 'FAQ'].map((l) => (
                <a key={l} href="#" className="text-sm text-white/45 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-sm w-fit">
                  {l}
                </a>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">Legal</p>
            <nav aria-label="Footer legal" className="flex flex-col gap-3">
              {['Terms of Service', 'Privacy Policy'].map((l) => (
                <a key={l} href="#" className="text-sm text-white/45 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-sm w-fit">
                  {l}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25">&copy; 2026 Liaison Technologies. All rights reserved.</p>
          <Link
            href="/restaurant-admin/login"
            className="text-xs text-white/25 hover:text-white/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-sm"
          >
            Restaurant Login &rarr;
          </Link>
        </div>
      </div>
    </footer>
  )
}
