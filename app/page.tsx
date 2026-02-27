import Link from 'next/link'
import { CCLogoWithMark } from '@/components/cc-logo'
import {
  Video,
  UtensilsCrossed,
  Shield,
  MapPin,
  ArrowRight,
  Zap,
  Trophy,
  Camera,
  CheckCircle2,
} from 'lucide-react'

const portals = [
  {
    icon: Video,
    title: 'Creator App',
    description:
      'Discover restaurants, browse menus, get your meal comped, and post content to win monthly cash prizes.',
    href: '/creator',
    cta: 'Open Creator App',
    badge: 'Most Popular',
    features: ['Map discovery', 'QR redemption', 'Monthly contests'],
  },
  {
    icon: UtensilsCrossed,
    title: 'Restaurant Dashboard',
    description:
      'Scan creator QR codes, confirm orders, and manage your restaurant comp program with real-time analytics.',
    href: '/restaurant',
    cta: 'Open Dashboard',
    badge: null,
    features: ['QR scanner', 'Order confirmation', 'Analytics'],
  },
  {
    icon: Shield,
    title: 'Admin Panel',
    description:
      'Vet creator applications, review proof submissions, issue strikes, and manage monthly leaderboards.',
    href: '/admin',
    cta: 'Open Admin Panel',
    badge: null,
    features: ['Creator vetting', 'Proof review', 'Leaderboard'],
  },
]

const features = [
  {
    icon: Camera,
    title: 'For Creators',
    description:
      'Get your meals fully comped at partner restaurants. Post authentic content about your experience within 48 hours.',
    points: ['Free meals at 18+ restaurants', 'Flexible 48-hour posting window', 'Monthly cash prize pool'],
  },
  {
    icon: UtensilsCrossed,
    title: 'For Restaurants',
    description:
      'Drive organic UGC from real creators with established audiences. No ads, no agencies — just authentic word-of-mouth.',
    points: ['Verified creator network', 'Real-time order management', 'Performance analytics'],
  },
  {
    icon: Trophy,
    title: 'Monthly Prizes',
    description:
      'Leaderboards rank creators by content quality and reach every month. Top performers earn real cash prizes.',
    points: ['Separate IG Reel & TikTok boards', 'Fair engagement-based scoring', 'Real cash prizes monthly'],
  },
]

const steps = [
  {
    number: '01',
    title: 'Discover',
    description: 'Browse an interactive map of partner restaurants near you. See comp value and posting requirements before you go.',
  },
  {
    number: '02',
    title: 'Redeem',
    description: 'Add items to your cart and generate a QR code. Show it to restaurant staff — no cash, no hassle.',
  },
  {
    number: '03',
    title: 'Post & Win',
    description: 'Post within 48 hours, submit your proof, and watch your leaderboard rank climb toward the monthly prize.',
  },
]

const stats = [
  { value: '120+', label: 'Active creators' },
  { value: '18', label: 'Partner restaurants' },
  { value: '340+', label: 'Comps this month' },
  { value: '$2,400', label: 'Monthly prize pool' },
]

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-white flex flex-col font-[family-name:var(--font-manrope)]">

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-1 { animation: fadeUp 0.6s ease-out 0.1s both; }
        .anim-2 { animation: fadeUp 0.6s ease-out 0.25s both; }
        .anim-3 { animation: fadeUp 0.6s ease-out 0.4s both; }
        .anim-4 { animation: fadeUp 0.6s ease-out 0.55s both; }
        .anim-5 { animation: fadeUp 0.6s ease-out 0.7s both; }
      `}</style>

      {/* Demo Banner */}
      <div className="bg-slate-900">
        <div className="cc-container py-2 flex items-center justify-center gap-2">
          <span className="text-[11px] font-medium text-slate-400 tracking-wide uppercase">Demo Mode</span>
          <span className="text-slate-700">·</span>
          <span className="text-[11px] text-slate-500">All data is simulated. No real transactions.</span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="cc-container h-14 flex items-center justify-between">
          <CCLogoWithMark size="md" />

          <nav className="hidden md:flex items-center gap-7">
            {[
              { label: 'Features', href: '#features' },
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Portals', href: '#portals' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Utah County
            </span>
            <Link
              href="/creator"
              className="inline-flex items-center gap-1.5 bg-cc-accent text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-cc-accent-dark transition-colors"
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 overflow-hidden">
        <div className="cc-container py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            {/* Left: Typography */}
            <div className="flex-1 min-w-0">
              <p className="anim-1 text-xs font-semibold text-cc-accent uppercase tracking-widest mb-5">
                Now Live · Utah County
              </p>

              <h1 className="anim-2 text-[44px] sm:text-[56px] lg:text-[64px] font-black leading-[1.0] tracking-tight mb-6 text-slate-900">
                Get Comped.<br />
                <span className="text-cc-accent">Create.</span><br />
                Win.
              </h1>

              <p className="anim-3 text-base text-slate-500 leading-relaxed max-w-sm mb-8">
                The invite-only network where local creators get free meals at restaurants in exchange for authentic Instagram Reels and TikToks.
              </p>

              <div className="anim-4 flex flex-wrap gap-3">
                <Link
                  href="/creator"
                  className="inline-flex items-center gap-2 bg-cc-accent text-white font-semibold px-6 py-3 rounded-lg hover:bg-cc-accent-dark transition-colors text-sm"
                >
                  Start Creating
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/restaurant"
                  className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-colors text-sm"
                >
                  View Demo
                </Link>
              </div>
            </div>

            {/* Right: Phone mockup */}
            <div className="anim-5 shrink-0 w-full lg:w-auto flex justify-center lg:justify-end">
              {/* Phone frame */}
              <div
                style={{
                  width: '260px',
                  height: '460px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                {/* Phone notch */}
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '14px', paddingBottom: '8px', background: 'white' }}>
                  <div style={{ width: '90px', height: '26px', background: '#0f172a', borderRadius: '16px' }} />
                </div>

                {/* App content: Map-style discover page */}
                <div style={{ position: 'relative', height: 'calc(100% - 46px)', background: '#f1f5f9' }}>
                  {/* Map placeholder */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #e8eef5 0%, #dde6f0 100%)' }} />

                  {/* Grid lines mimicking map */}
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }} viewBox="0 0 280 400" preserveAspectRatio="none">
                    {[0,60,120,180,240,300,360,420].map(y => (
                      <line key={`h${y}`} x1="0" y1={y} x2="280" y2={y} stroke="#c8d8e8" strokeWidth="1" />
                    ))}
                    {[0,50,100,150,200,250,300].map(x => (
                      <line key={`v${x}`} x1={x} y1="0" x2={x} y2="500" stroke="#c8d8e8" strokeWidth="1" />
                    ))}
                    {/* Roads */}
                    <path d="M 0 200 Q 100 190 180 220 Q 240 240 280 230" stroke="#d0dcea" strokeWidth="5" fill="none" />
                    <path d="M 60 0 Q 70 120 100 200 Q 130 280 120 400" stroke="#d0dcea" strokeWidth="5" fill="none" />
                    <path d="M 0 120 L 280 130" stroke="#d8e4ef" strokeWidth="3" fill="none" />
                    <path d="M 140 0 L 150 400" stroke="#d8e4ef" strokeWidth="3" fill="none" />
                  </svg>

                  {/* Map pins */}
                  {[
                    { x: 90, y: 110 },
                    { x: 155, y: 165 },
                    { x: 200, y: 90 },
                    { x: 70, y: 200 },
                    { x: 220, y: 210 },
                  ].map((pin, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: pin.x,
                        top: pin.y,
                        width: '28px',
                        height: '28px',
                        background: i === 1 ? '#5c8ebf' : '#ffffff',
                        border: `2px solid ${i === 1 ? '#5c8ebf' : '#cbd5e1'}`,
                        borderRadius: '50% 50% 50% 0',
                        transform: 'translate(-50%, -100%) rotate(-45deg)',
                        boxShadow: i === 1 ? '0 2px 8px rgba(92,142,191,0.4)' : '0 1px 4px rgba(0,0,0,0.08)',
                      }}
                    />
                  ))}

                  {/* Bottom sheet card */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'white',
                    borderTop: '1px solid #e2e8f0',
                    borderRadius: '16px 16px 0 0',
                    padding: '16px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>Cubby&apos;s Chicago Dogs</p>
                        <p style={{ fontSize: '11px', color: '#94a3b8' }}>840 N 1200 W, Orem</p>
                      </div>
                      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '4px 8px' }}>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#5c8ebf' }}>$28 comp</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <div style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 10px' }}>
                        <p style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '1px' }}>Required</p>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>1 IG Reel</p>
                      </div>
                      <div style={{ background: '#5c8ebf', borderRadius: '8px', padding: '6px 14px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>View Menu</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-100">
        <div className="cc-container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center px-6 py-10">
                <span className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</span>
                <span className="text-xs text-slate-400 mt-1.5 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 border-b border-slate-100">
        <div className="cc-container">
          <div className="mb-16">
            <p className="text-xs font-semibold text-cc-accent uppercase tracking-widest mb-4">
              Why CreatorComped
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.05]">
              A better deal for<br />creators and restaurants.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="border border-slate-200 rounded-xl p-7 flex flex-col hover:border-slate-300 transition-colors"
                >
                  <Icon className="h-5 w-5 text-slate-400 mb-5" />
                  <h3 className="text-base font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-1">
                    {feature.description}
                  </p>
                  <ul className="space-y-2.5 border-t border-slate-100 pt-5">
                    {feature.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm text-slate-500">
                        <CheckCircle2 className="h-3.5 w-3.5 text-cc-accent shrink-0 mt-0.5" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-28 border-b border-slate-100">
        <div className="cc-container">
          <div className="mb-16">
            <p className="text-xs font-semibold text-cc-accent uppercase tracking-widest mb-4">
              The Process
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.05]">
              Simple from start<br />to payout.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col">
                <span className="text-5xl font-black text-slate-100 mb-6 leading-none tabular-nums">{step.number}</span>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900">
        <div className="cc-container py-28">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">
              Invite-Only Network
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.05] mb-6">
              Ready to eat for free<br />and get paid?
            </h2>
            <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-md">
              Join 120+ creators already earning comps at Utah&apos;s best restaurants. Apply now — new spots open every month.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/creator"
                className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-7 py-3.5 rounded-lg hover:bg-slate-100 transition-colors text-sm"
              >
                Apply as a Creator
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/restaurant"
                className="inline-flex items-center gap-2 border border-slate-700 text-slate-400 font-semibold px-7 py-3.5 rounded-lg hover:border-slate-600 hover:text-slate-300 transition-colors text-sm"
              >
                I&apos;m a Restaurant
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Portals */}
      <section id="portals" className="py-28 border-b border-slate-100">
        <div className="cc-container">
          <div className="mb-16">
            <p className="text-xs font-semibold text-cc-accent uppercase tracking-widest mb-4">
              Three Portals
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.05]">
              Built for everyone<br />on the platform.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {portals.map((portal) => {
              const Icon = portal.icon
              return (
                <Link
                  key={portal.href}
                  href={portal.href}
                  className="group relative flex flex-col border border-slate-200 rounded-xl p-7 hover:border-cc-accent transition-colors"
                >
                  {portal.badge && (
                    <span className="absolute top-5 right-5 bg-cc-accent text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      {portal.badge}
                    </span>
                  )}

                  <Icon className="h-5 w-5 text-slate-400 mb-6" />
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{portal.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-1">{portal.description}</p>

                  <ul className="space-y-1.5 mb-6 border-t border-slate-100 pt-5">
                    {portal.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="h-px w-3 bg-slate-300 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-1.5 text-sm font-semibold text-cc-accent">
                    {portal.cta}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="cc-container py-16">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1">
              <CCLogoWithMark size="sm" className="mb-4" />
              <p className="text-sm text-slate-400 leading-relaxed">
                The invite-only creator network for local restaurants in Utah.
              </p>
            </div>

            {[
              {
                heading: 'Creators',
                links: ['Discover Restaurants', 'Redeem Comps', 'Submit Proof', 'Leaderboard'],
                href: '/creator',
              },
              {
                heading: 'Restaurants',
                links: ['Scan QR Codes', 'Manage Orders', 'Analytics', 'Settings'],
                href: '/restaurant',
              },
              {
                heading: 'Platform',
                links: ['Admin Panel', 'Proof Review', 'Creator Vetting', 'Strikes'],
                href: '/admin',
              },
            ].map((col) => (
              <div key={col.heading}>
                <h4 className="text-[10px] font-semibold text-slate-900 uppercase tracking-widest mb-4">{col.heading}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((item) => (
                    <li key={item}>
                      <Link href={col.href} className="text-sm text-slate-400 hover:text-slate-700 transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <MapPin className="h-3.5 w-3.5" />
              Serving <span className="text-slate-600 mx-1">Utah County</span> &amp; <span className="text-slate-600 ml-1">Salt Lake County</span>
            </div>
            <p className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} CreatorComped
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
