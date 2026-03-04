'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  MapPin,
  ShoppingBag,
  QrCode,
  Link2,
  Trophy,
  BarChart3,
  ArrowRight,
  Smartphone,
  Menu,
  X,
} from 'lucide-react'

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/5">
        <nav className="max-w-[1440px] mx-auto px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-semibold">Creator Comped</div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-white/70 hover:text-white transition">Features</a>
            <a href="#how-it-works" className="text-white/70 hover:text-white transition">How it works</a>
            <a href="#faq" className="text-white/70 hover:text-white transition">FAQ</a>
            <a href="#resources" className="text-white/70 hover:text-white transition">Resources</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/restaurant-admin/login"
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
              <a href="#features" className="text-white/70 hover:text-white transition">Features</a>
              <a href="#how-it-works" className="text-white/70 hover:text-white transition">How it works</a>
              <a href="#faq" className="text-white/70 hover:text-white transition">FAQ</a>
              <a href="#resources" className="text-white/70 hover:text-white transition">Resources</a>
              <Link
                href="/restaurant-admin/login"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 text-white font-medium hover:opacity-90 transition text-center"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="max-w-[1440px] mx-auto px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Get your food comped.
              <br />
              Create content.
              <br />
              Win rewards.
            </h1>
            <p className="text-xl text-white/70 mb-8 leading-relaxed">
              Creator Comped connects content creators with local restaurants.
              Redeem complimentary meals, create authentic content, and compete
              for monthly prizes while restaurants gain exposure.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 text-white font-semibold hover:opacity-90 transition text-lg">
                Download / Join as Creator
              </button>
              <button className="px-8 py-4 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition text-lg">
                Join as Restaurant
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10 bg-white/5 border border-white/10 h-96 flex items-center justify-center">
              <div className="text-center text-white/30">
                <Smartphone className="w-24 h-24 mx-auto mb-4" />
                <p className="text-lg">Creator Comped App</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-[1440px] mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything you need</h2>
          <p className="text-xl text-white/70">
            Powerful features for creators and restaurants
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition border border-white/5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center mb-6">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Discovery Map & List</h3>
            <p className="text-white/70 leading-relaxed">
              Find participating restaurants near you with an interactive map
              and list view showing all available comps in your area.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition border border-white/5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center mb-6">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Simple Ordering</h3>
            <p className="text-white/70 leading-relaxed">
              Select menu items within restaurant-defined limits. Clear pricing
              and restrictions ensure transparency for both parties.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition border border-white/5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center mb-6">
              <QrCode className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold mb-3">QR Code Redemption</h3>
            <p className="text-white/70 leading-relaxed">
              Redeem your comp instantly with a QR code scan at the restaurant.
              Backup 5-digit codes ensure smooth redemption every time.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition border border-white/5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center mb-6">
              <Link2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Post Submission</h3>
            <p className="text-white/70 leading-relaxed">
              Submit your Instagram and TikTok post links for verification.
              Track your content performance and deliverable compliance.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition border border-white/5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center mb-6">
              <Trophy className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Monthly Leaderboard</h3>
            <p className="text-white/70 leading-relaxed">
              Compete with other creators for monthly prizes. Top performers
              earn rewards based on engagement and content quality.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition border border-white/5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center mb-6">
              <BarChart3 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Business Analytics</h3>
            <p className="text-white/70 leading-relaxed">
              Restaurants track spend, monitor comp usage, analyze creator
              performance, and measure ROI with comprehensive dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-[1440px] mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How it works</h2>
          <p className="text-xl text-white/70">Simple process for creators and restaurants</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* For Creators */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-10 border border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">For Creators</h3>
            </div>
            <div className="space-y-6">
              {[
                { n: 1, title: 'Choose a restaurant', desc: 'Browse the map or list to find participating restaurants near you' },
                { n: 2, title: 'Select menu items', desc: "Choose items within the restaurant's defined limits and restrictions" },
                { n: 3, title: 'Get comped via QR code', desc: 'Show your QR code at the restaurant to redeem your complimentary meal' },
                { n: 4, title: 'Submit post links', desc: 'Share your Instagram and TikTok posts to complete the comp' },
              ].map((step) => (
                <div key={step.n} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center font-semibold">
                    {step.n}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{step.title}</h4>
                    <p className="text-white/70">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For Restaurants */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-10 border border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">For Restaurants</h3>
            </div>
            <div className="space-y-6">
              {[
                { n: 1, title: 'Set menu + limits', desc: 'Upload your menu, set pricing, and define per-item and category limits' },
                { n: 2, title: 'Set deliverables', desc: 'Define content requirements, hashtags, and posting guidelines' },
                { n: 3, title: 'Employees scan QR', desc: 'Staff quickly validate and redeem comps with built-in QR scanner' },
                { n: 4, title: 'Track spend + analytics', desc: 'Monitor your investment, creator performance, and content reach' },
              ].map((step) => (
                <div key={step.n} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center font-semibold">
                    {step.n}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{step.title}</h4>
                    <p className="text-white/70">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="max-w-[1440px] mx-auto px-8 py-24">
        <div className="bg-gradient-to-br from-orange-500/10 to-blue-600/10 backdrop-blur-sm rounded-3xl p-16 text-center border border-white/5">
          <h2 className="text-3xl font-bold mb-4">Trusted by local restaurants</h2>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Join hundreds of restaurants and thousands of creators already using
            Creator Comped to drive authentic engagement and build community.
          </p>
          <div className="flex flex-wrap justify-center gap-12 items-center opacity-50">
            <div className="text-2xl font-semibold">Restaurant Logo</div>
            <div className="text-2xl font-semibold">Restaurant Logo</div>
            <div className="text-2xl font-semibold">Restaurant Logo</div>
            <div className="text-2xl font-semibold">Restaurant Logo</div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-[1440px] mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Frequently asked questions</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              q: 'How do I become a creator?',
              a: 'Download the Creator Comped app, create an account with your Instagram and TikTok profiles, and start browsing participating restaurants immediately.',
            },
            {
              q: 'How do restaurants benefit?',
              a: 'Restaurants gain authentic content, increased social media exposure, and detailed analytics tracking ROI—all while controlling their budget and comp limits.',
            },
            {
              q: 'What are the posting requirements?',
              a: 'Each restaurant sets their own deliverables. Typically, creators must post within 48 hours and include specified hashtags and restaurant tags.',
            },
            {
              q: 'How does the leaderboard work?',
              a: 'Creators earn points based on engagement (views, likes, comments) across their Instagram and TikTok posts. Top performers each month win prizes from the prize pool.',
            },
          ].map((item) => (
            <div key={item.q} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/5">
              <h3 className="text-xl font-semibold mb-3">{item.q}</h3>
              <p className="text-white/70 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="max-w-[1440px] mx-auto px-8 py-24">
        <div className="bg-gradient-to-r from-orange-500 to-blue-600 rounded-3xl p-16 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join Creator Comped today and start connecting with your local food community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 rounded-full bg-white text-gray-900 font-semibold hover:bg-white/90 transition text-lg">
              Download the App
            </button>
            <button className="px-8 py-4 rounded-full bg-white/20 text-white font-semibold hover:bg-white/30 transition text-lg backdrop-blur-sm">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="max-w-[1440px] mx-auto px-8 py-24 border-t border-white/5">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Resources</h2>
          <p className="text-xl text-white/70">Everything you need to know about Creator Comped</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { title: 'Rules', desc: 'Platform guidelines and policies' },
            { title: 'Support', desc: 'Get help from our team' },
            { title: 'Terms of Service', desc: 'Legal terms and conditions' },
            { title: 'Privacy Policy', desc: 'How we protect your data' },
          ].map((r) => (
            <a
              key={r.title}
              href="#"
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:bg-white/10 transition text-center"
            >
              <h3 className="font-semibold mb-2">{r.title}</h3>
              <p className="text-white/70 text-sm">{r.desc}</p>
            </a>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/internal-admin/login"
            className="inline-block text-white/50 hover:text-white transition text-sm"
          >
            Admin Dashboard →
          </Link>
        </div>
      </section>

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
                  <a href="#" className="text-white/50 hover:text-white transition">Rules</a>
                  <a href="#" className="text-white/50 hover:text-white transition">Support</a>
                  <a href="#" className="text-white/50 hover:text-white transition">FAQ</a>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Legal</h4>
                <div className="flex flex-col gap-2">
                  <a href="#" className="text-white/50 hover:text-white transition">Terms of Service</a>
                  <a href="#" className="text-white/50 hover:text-white transition">Privacy Policy</a>
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
  )
}
