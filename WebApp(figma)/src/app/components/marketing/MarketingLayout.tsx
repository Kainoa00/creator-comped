import { Outlet, Link } from "react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function MarketingLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/5">
        <nav className="max-w-[1440px] mx-auto px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="text-2xl font-semibold">Creator Comped</div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-white/70 hover:text-white transition">
              Features
            </a>
            <a href="#how-it-works" className="text-white/70 hover:text-white transition">
              How it works
            </a>
            <a href="#faq" className="text-white/70 hover:text-white transition">
              FAQ
            </a>
            <a href="#resources" className="text-white/70 hover:text-white transition">
              Resources
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/restaurant-admin/login"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 text-white font-medium hover:opacity-90 transition"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#0a0a0a]">
            <div className="px-8 py-4 flex flex-col gap-4">
              <a href="#features" className="text-white/70 hover:text-white transition">
                Features
              </a>
              <a href="#how-it-works" className="text-white/70 hover:text-white transition">
                How it works
              </a>
              <a href="#faq" className="text-white/70 hover:text-white transition">
                FAQ
              </a>
              <a href="#resources" className="text-white/70 hover:text-white transition">
                Resources
              </a>
              <Link
                to="/restaurant-admin/login"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 text-white font-medium hover:opacity-90 transition"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-[1440px] mx-auto px-8 py-12">
          <div className="flex flex-wrap gap-8 justify-between mb-8">
            <div>
              <div className="text-xl font-semibold mb-4">Creator Comped</div>
              <p className="text-white/50 max-w-xs">
                Connect creators with restaurants for authentic content and comped meals.
              </p>
            </div>
            <div className="flex flex-wrap gap-12">
              <div>
                <h4 className="font-medium mb-3">Resources</h4>
                <div className="flex flex-col gap-2">
                  <a href="#" className="text-white/50 hover:text-white transition">
                    Rules
                  </a>
                  <a href="#" className="text-white/50 hover:text-white transition">
                    Support
                  </a>
                  <a href="#" className="text-white/50 hover:text-white transition">
                    FAQ
                  </a>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Legal</h4>
                <div className="flex flex-col gap-2">
                  <a href="#" className="text-white/50 hover:text-white transition">
                    Terms of Service
                  </a>
                  <a href="#" className="text-white/50 hover:text-white transition">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-white/50 text-sm">
            © 2026 Liaison Technologies. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}