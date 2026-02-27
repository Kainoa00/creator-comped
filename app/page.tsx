import Link from 'next/link'
import { CCLogoWithMark } from '@/components/cc-logo'
import {
  Video,
  UtensilsCrossed,
  Shield,
  MapPin,
  ArrowRight,
  Zap,
  Clock,
  Trophy,
  Camera,
  Star,
  CheckCircle2,
} from 'lucide-react'

// ── Portal cards data ──────────────────────────────────────────
const portals = [
  {
    icon: Video,
    title: 'Creator App',
    description:
      'Discover restaurants, browse menus, get your meal comped, and post content to win monthly cash prizes.',
    href: '/creator',
    cta: 'Open Creator App',
    badge: 'Most Popular',
    iconBg: 'bg-cc-accent-subtle text-cc-accent',
    features: ['Map discovery', 'QR redemption', 'Monthly contests'],
    borderAccent: 'hover:border-cc-accent',
  },
  {
    icon: UtensilsCrossed,
    title: 'Restaurant Dashboard',
    description:
      'Scan creator QR codes, confirm orders, and manage your restaurant comp program with real-time analytics.',
    href: '/restaurant',
    cta: 'Open Dashboard',
    badge: null,
    iconBg: 'bg-emerald-50 text-emerald-600',
    features: ['QR scanner', 'Order confirmation', 'Analytics'],
    borderAccent: 'hover:border-emerald-400',
  },
  {
    icon: Shield,
    title: 'Admin Panel',
    description:
      'Vet creator applications, review proof submissions, issue strikes, and manage monthly leaderboards.',
    href: '/admin',
    cta: 'Open Admin Panel',
    badge: null,
    iconBg: 'bg-slate-100 text-slate-600',
    features: ['Creator vetting', 'Proof review', 'Leaderboard'],
    borderAccent: 'hover:border-slate-400',
  },
]

// ── Feature cards data ─────────────────────────────────────────
const features = [
  {
    icon: Camera,
    title: 'For Creators',
    description:
      'Get your meals fully comped at partner restaurants. All we ask is that you post authentic, engaging content about your experience.',
    points: ['Free meals at 18+ restaurants', 'Flexible posting window (48h)', 'Monthly cash prize pool'],
    accent: 'bg-cc-accent-subtle text-cc-accent',
  },
  {
    icon: UtensilsCrossed,
    title: 'For Restaurants',
    description:
      'Drive organic UGC from real creators with established audiences. No ads, no agencies — just authentic word-of-mouth.',
    points: ['Verified creator network', 'Real-time order management', 'Performance analytics'],
    accent: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Trophy,
    title: 'For Everyone',
    description:
      'Monthly leaderboards rank creators by content quality and reach. Top performers earn real cash prizes every month.',
    points: ['Monthly cash prizes', 'Fair ranking system', 'Community of creators'],
    accent: 'bg-amber-50 text-amber-600',
  },
]

// ── How it works steps ─────────────────────────────────────────
const steps = [
  {
    number: '01',
    title: 'Discover',
    description: 'Browse the map to find partner restaurants near you. Filter by cuisine, distance, or comp value.',
    icon: MapPin,
  },
  {
    number: '02',
    title: 'Redeem',
    description: 'Add items to your cart, generate your QR code, and show it to the restaurant staff to get comped.',
    icon: Zap,
  },
  {
    number: '03',
    title: 'Post & Win',
    description: 'Post your content within 48 hours, submit proof, and climb the monthly leaderboard to win prizes.',
    icon: Trophy,
  },
]

// ── Stats ──────────────────────────────────────────────────────
const stats = [
  { value: '120+', label: 'Active Creators' },
  { value: '18', label: 'Partner Restaurants' },
  { value: '340+', label: 'Comps This Month' },
  { value: '48h', label: 'To Post Content' },
]

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-white flex flex-col">

      {/* Custom animations */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-slow-2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-float-slow { animation: float-slow 3s ease-in-out infinite; }
        .animate-float-slow-2 { animation: float-slow-2 3.5s ease-in-out infinite 0.5s; }
      `}</style>

      {/* Demo Mode Banner */}
      <div className="bg-cc-accent-subtle border-b border-blue-100">
        <div className="cc-container py-2 flex items-center justify-center gap-2">
          <Zap className="h-3.5 w-3.5 text-cc-accent" />
          <span className="text-xs font-semibold text-cc-accent tracking-wide uppercase">
            Demo Mode Active
          </span>
          <span className="text-xs text-cc-text-muted">
            — All data is simulated. No real transactions.
          </span>
        </div>
      </div>

      {/* ── Sticky Header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="cc-container h-16 flex items-center justify-between">
          {/* Logo */}
          <CCLogoWithMark size="md" />

          {/* Nav links — hidden on mobile */}
          <nav className="hidden md:flex items-center gap-1">
            {['Features', 'How It Works', 'Community', 'Portals'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-3 py-1.5 text-sm font-medium text-cc-text-secondary hover:text-cc-text hover:bg-slate-50 rounded-lg transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-cc-text-muted">
              <span className="h-2 w-2 rounded-full bg-cc-success animate-pulse" />
              Utah County
            </span>
            <Link
              href="/creator"
              className="inline-flex items-center gap-1.5 bg-cc-accent text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-cc-accent-dark transition-colors shadow-sm"
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white">
        <div className="cc-container pt-24 pb-28 flex flex-col items-center text-center">

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-cc-accent-subtle border border-blue-200 rounded-full px-4 py-1.5 mb-6">
            <Star className="h-3.5 w-3.5 text-cc-accent fill-cc-accent" />
            <span className="text-xs font-semibold text-cc-accent uppercase tracking-wider">
              Now Live in Utah County
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-black leading-[1.05] tracking-tight mb-5 text-cc-text">
            Get Comped.{' '}
            <span className="text-cc-accent">Create Content.</span>{' '}
            Win Prizes.
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-cc-text-secondary leading-relaxed max-w-lg mx-auto mb-8">
            The invite-only creator network where local creators get free meals at restaurants
            in exchange for authentic Instagram Reels and TikToks.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <Link
              href="/creator"
              className="inline-flex items-center gap-2 bg-cc-accent text-white font-bold px-7 py-3.5 rounded-full hover:bg-cc-accent-dark transition-colors shadow-sm text-base"
            >
              Start Creating Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/restaurant"
              className="inline-flex items-center gap-2 bg-white text-cc-text font-bold px-7 py-3.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-base"
            >
              View Demo
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-3 mb-14">
            <div className="flex -space-x-2">
              {['A', 'B', 'C', 'D', 'E'].map((letter, i) => (
                <div
                  key={letter}
                  className="h-8 w-8 rounded-full bg-cc-accent-subtle border-2 border-white flex items-center justify-center text-xs font-bold text-cc-accent"
                  style={{ zIndex: 5 - i }}
                >
                  {letter}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-cc-text-muted">
                <span className="font-semibold text-cc-text">120+ creators</span> already earning comps
              </p>
            </div>
          </div>

          {/* Centered app mockup card */}
          <div className="relative w-full max-w-md mx-auto">
            {/* Blue radial glow behind card */}
            <div
              aria-hidden
              className="absolute -inset-8 blur-3xl bg-cc-accent/10 rounded-full"
            />
            {/* Main card */}
            <div className="relative bg-white border border-slate-200 rounded-3xl shadow-2xl shadow-slate-200/80 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-cc-text">Active Comp</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  ● Confirmed
                </span>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 text-left">
                <p className="text-xs text-cc-text-muted mb-1">Restaurant</p>
                <p className="font-bold text-cc-text text-base">The Local Kitchen</p>
                <p className="text-sm text-cc-text-secondary mt-0.5">Utah County</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-cc-accent-subtle rounded-2xl p-4 text-left">
                  <p className="text-xs text-cc-text-muted mb-1">Comp Value</p>
                  <p className="font-black text-cc-accent text-2xl">$28.50</p>
                </div>
                <div className="bg-amber-50 rounded-2xl p-4 text-left">
                  <p className="text-xs text-cc-text-muted mb-1">Time Left</p>
                  <p className="font-black text-amber-600 text-2xl">44h 12m</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-cc-text-muted border-t border-slate-100 pt-4">
                <Clock className="h-3.5 w-3.5 text-cc-accent shrink-0" />
                Post your Reel before the deadline to earn points
              </div>
            </div>

            {/* Floating leaderboard badge */}
            <div className="animate-float-slow absolute -top-3 -right-6 bg-cc-accent text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
              #3 on Leaderboard
            </div>

            {/* Floating notification */}
            <div className="animate-float-slow-2 absolute -bottom-3 -left-6 bg-white border border-slate-100 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
              <div className="h-8 w-8 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-cc-text">Proof Approved!</p>
                <p className="text-xs text-cc-text-muted">+120 points earned</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="cc-container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-200">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center px-6 py-2">
                <span className="text-4xl font-black text-cc-text">{stat.value}</span>
                <span className="text-sm text-cc-text-muted mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section id="features" className="bg-slate-50 py-20">
        <div className="cc-container">
          {/* Section header */}
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold text-cc-accent uppercase tracking-widest mb-3">
              Platform Core
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-cc-text tracking-tight mb-3">
              Everything restaurants and creators need
            </h2>
            <p className="text-base text-cc-text-secondary leading-relaxed max-w-xl mx-auto">
              A complete platform connecting content creators with local restaurants — built for
              authentic, measurable results.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  <div className={`h-14 w-14 rounded-xl flex items-center justify-center mb-5 ${feature.accent}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-cc-text mb-2">{feature.title}</h3>
                  <p className="text-base text-cc-text-secondary leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.points.map((point) => (
                      <li key={point} className="flex items-center gap-2 text-sm text-cc-text-secondary">
                        <CheckCircle2 className="h-4 w-4 text-cc-accent shrink-0" />
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

      {/* ── How It Works ──────────────────────────────────────── */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="cc-container">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold text-cc-accent uppercase tracking-widest mb-3">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-cc-text tracking-tight mb-3">
              Three simple steps
            </h2>
            <p className="text-base text-cc-text-secondary leading-relaxed max-w-xl mx-auto">
              From discovery to payout — CreatorComped makes it seamless.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="flex flex-col items-center text-center relative">
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-px bg-slate-200" />
                  )}
                  {/* Icon circle */}
                  <div className="relative z-10 h-16 w-16 rounded-full bg-cc-accent-subtle border-2 border-cc-accent/20 flex items-center justify-center mb-5">
                    <Icon className="h-6 w-6 text-cc-accent" />
                  </div>
                  <span className="text-xs font-bold text-cc-accent uppercase tracking-wider mb-2">
                    Step {step.number}
                  </span>
                  <h3 className="text-xl font-bold text-cc-text mb-2">{step.title}</h3>
                  <p className="text-base text-cc-text-secondary leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Creator CTA Banner ────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #5c8ebf 0%, #3a6fa3 60%, #2c5f8f 100%)',
        }}
      >
        <div className="relative cc-container py-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 border border-white/30 px-4 py-1.5 mb-6">
            <Star className="h-3.5 w-3.5 text-white fill-white" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Invite-Only Network
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Ready to eat for free and get paid?
          </h2>
          <p className="text-white/80 text-lg leading-relaxed max-w-xl mx-auto mb-8">
            Join 120+ creators already earning comps at Utah&apos;s best restaurants. Apply now — new spots open every month.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/creator"
              className="inline-flex items-center gap-2 bg-white text-cc-accent font-black px-8 py-4 rounded-full hover:bg-slate-50 transition-colors shadow-lg text-base"
            >
              Apply as a Creator
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/restaurant"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-8 py-4 rounded-full hover:bg-white/20 transition-colors text-base"
            >
              I&apos;m a Restaurant
            </Link>
          </div>
          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-8 mt-10 text-white/60 text-sm">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-white/70" />
              Free to join
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-white/70" />
              No commitments
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-white/70" />
              Real cash prizes
            </div>
          </div>
        </div>
      </section>

      {/* ── Portals / CTA cards ───────────────────────────────── */}
      <section id="portals" className="bg-slate-50 py-20">
        <div className="cc-container">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold text-cc-accent uppercase tracking-widest mb-3">
              Get Started
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-cc-text tracking-tight mb-3">
              Choose your portal
            </h2>
            <p className="text-base text-cc-text-secondary leading-relaxed max-w-xl mx-auto">
              CreatorComped has dedicated experiences for creators, restaurant staff, and administrators.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {portals.map((portal) => {
              const Icon = portal.icon
              return (
                <Link
                  key={portal.href}
                  href={portal.href}
                  className={`group relative flex flex-col bg-white border border-slate-100 rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 text-left ${portal.borderAccent}`}
                >
                  {/* Badge */}
                  {portal.badge && (
                    <div className="absolute -top-2.5 left-5 bg-cc-accent text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                      {portal.badge}
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`h-14 w-14 rounded-xl flex items-center justify-center mb-5 ${portal.iconBg}`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Content */}
                  <h3 className="text-base font-bold text-cc-text mb-2">{portal.title}</h3>
                  <p className="text-base text-cc-text-secondary leading-relaxed mb-4 flex-1">
                    {portal.description}
                  </p>

                  {/* Feature list */}
                  <ul className="space-y-1.5 mb-5">
                    {portal.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-cc-text-muted">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA with animated arrow */}
                  <div className="flex items-center gap-1.5 text-sm font-bold text-cc-accent">
                    <span>{portal.cta}</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-100">
        <div className="cc-container py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <CCLogoWithMark size="sm" className="mb-4" />
              <p className="text-sm text-cc-text-muted leading-relaxed">
                The invite-only creator network for local restaurants in Utah.
              </p>
            </div>

            {/* Creators */}
            <div>
              <h4 className="text-sm font-bold text-cc-text mb-3">Creators</h4>
              <ul className="space-y-2">
                {['Discover Restaurants', 'Redeem Comps', 'Submit Proof', 'Leaderboard'].map((item) => (
                  <li key={item}>
                    <Link href="/creator" className="text-sm text-cc-text-muted hover:text-cc-text transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Restaurants */}
            <div>
              <h4 className="text-sm font-bold text-cc-text mb-3">Restaurants</h4>
              <ul className="space-y-2">
                {['Scan QR Codes', 'Manage Orders', 'Analytics', 'Settings'].map((item) => (
                  <li key={item}>
                    <Link href="/restaurant" className="text-sm text-cc-text-muted hover:text-cc-text transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-sm font-bold text-cc-text mb-3">Platform</h4>
              <ul className="space-y-2">
                {['Admin Panel', 'Proof Review', 'Creator Vetting', 'Strikes'].map((item) => (
                  <li key={item}>
                    <Link href="/admin" className="text-sm text-cc-text-muted hover:text-cc-text transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-cc-text-muted">
              <MapPin className="h-4 w-4 text-cc-accent" />
              <span>
                Serving{' '}
                <span className="font-semibold text-cc-text">Utah County</span>
                {' '}&amp;{' '}
                <span className="font-semibold text-cc-text">Salt Lake County</span>
              </span>
            </div>
            <p className="text-xs text-cc-text-muted">
              &copy; {new Date().getFullYear()} CreatorComped &mdash; Invite-only network
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
