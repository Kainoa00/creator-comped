import { MapPin, ShoppingBag, QrCode, Link2, Trophy, BarChart3, LucideIcon } from 'lucide-react'
import AnimatedSection, { EyebrowLabel } from './AnimatedSection'
import SpotlightCard from './SpotlightCard'

const features: { icon: LucideIcon; title: string; desc: string; colSpan: string; large?: boolean }[] = [
  {
    icon: MapPin,
    title: 'Discovery Map & List',
    desc: 'Find participating restaurants near you with an interactive map and filterable list view. Browse available comps by cuisine, distance, and comp value — all in real time.',
    colSpan: 'md:col-span-2',
    large: true,
  },
  {
    icon: ShoppingBag,
    title: 'Simple Ordering',
    desc: 'Select menu items within restaurant-defined limits. Clear pricing and restrictions ensure transparency.',
    colSpan: 'md:col-span-1',
  },
  {
    icon: QrCode,
    title: 'QR Code Redemption',
    desc: 'Redeem your comp instantly with a QR code scan at the restaurant. Backup 5-digit codes ensure smooth redemption.',
    colSpan: 'md:col-span-1',
  },
  {
    icon: Link2,
    title: 'Post Submission',
    desc: 'Submit your Instagram and TikTok post links for verification. Track your content performance and deliverable compliance.',
    colSpan: 'md:col-span-1',
  },
  {
    icon: Trophy,
    title: 'Monthly Leaderboard',
    desc: 'Compete with other creators for monthly prizes. Top performers earn rewards based on engagement and content quality.',
    colSpan: 'md:col-span-1',
  },
  {
    icon: BarChart3,
    title: 'Business Analytics',
    desc: 'Restaurants track spend, monitor comp usage, analyze creator performance, and measure ROI with comprehensive dashboards. Get actionable insights into which creators drive the most engagement and foot traffic.',
    colSpan: 'md:col-span-3',
    large: true,
  },
]

export default function Features() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32">
      <AnimatedSection>
        <div className="text-center mb-16">
          <EyebrowLabel>Features</EyebrowLabel>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-5">
            Everything you{' '}
            <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-blue-500 bg-clip-text text-transparent">
              need
            </span>
          </h2>
          <p className="text-lg text-white/55 max-w-xl mx-auto leading-relaxed">
            Powerful features designed for creators and restaurants alike.
          </p>
        </div>
      </AnimatedSection>

      <div className="grid md:grid-cols-3 gap-5">
        {features.map((f) => {
          const Icon = f.icon
          const isFullWidth = f.colSpan === 'md:col-span-3'
          return (
            <AnimatedSection key={f.title}>
              <SpotlightCard className={`${f.colSpan} ${f.large ? 'min-h-[220px]' : ''}`}>
                <div className={`p-8 ${isFullWidth ? 'flex items-start gap-6' : ''}`}>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 via-rose-500 to-blue-600 flex items-center justify-center shadow-lg shadow-orange-500/20 ring-1 ring-white/10 ${isFullWidth ? 'shrink-0' : 'mb-5'}`}
                  >
                    <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 tracking-tight">{f.title}</h3>
                    <p className={`text-sm text-white/50 leading-relaxed ${f.large ? 'max-w-lg' : ''}`}>{f.desc}</p>
                  </div>
                </div>
              </SpotlightCard>
            </AnimatedSection>
          )
        })}
      </div>
    </section>
  )
}
