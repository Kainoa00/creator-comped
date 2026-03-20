import { Smartphone, BarChart3, LucideIcon } from 'lucide-react'
import AnimatedSection, { EyebrowLabel } from './AnimatedSection'

interface Step {
  title: string
  desc: string
}

const creatorSteps: Step[] = [
  { title: 'Choose a restaurant', desc: 'Browse the map or list to find participating restaurants near you.' },
  { title: 'Select menu items', desc: "Choose items within the restaurant's defined limits and restrictions." },
  { title: 'Get comped via QR code', desc: 'Show your QR code at the restaurant to redeem your complimentary meal.' },
  { title: 'Submit post links', desc: 'Share your Instagram and TikTok posts to complete the comp.' },
]

const restaurantSteps: Step[] = [
  { title: 'Set menu + limits', desc: 'Upload your menu, set pricing, and define per-item and category limits.' },
  { title: 'Set deliverables', desc: 'Define content requirements, hashtags, and posting guidelines.' },
  { title: 'Employees scan QR', desc: 'Staff quickly validate and redeem comps with the built-in QR scanner.' },
  { title: 'Track spend + analytics', desc: 'Monitor your investment, creator performance, and content reach.' },
]

function StepCard({
  steps,
  title,
  icon: Icon,
  delay = 0,
}: {
  steps: Step[]
  title: string
  icon: LucideIcon
  delay?: number
}) {
  return (
    <AnimatedSection delay={delay}>
      <div className="h-full bg-white/[0.03] border border-white/[0.07] rounded-3xl p-8 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/[0.10]">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600 flex items-center justify-center shrink-0 ring-1 ring-white/10 shadow-lg shadow-orange-500/20">
            <Icon className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        </div>

        <div className="relative space-y-7">
          {/* Vertical connector line */}
          <div
            className="absolute left-[13px] top-4 bottom-4 w-px bg-gradient-to-b from-orange-500/40 via-rose-500/30 to-blue-600/40"
            aria-hidden="true"
          />

          {steps.map((step, i) => (
            <div key={step.title} className="relative flex gap-4 group/step">
              <div className="relative z-10 flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600 flex items-center justify-center text-xs font-bold mt-0.5 shadow-md shadow-orange-500/20 transition-transform duration-200 group-hover/step:scale-110">
                {i + 1}
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">{step.title}</h4>
                <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32">
      <AnimatedSection>
        <div className="text-center mb-16">
          <EyebrowLabel>Process</EyebrowLabel>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-5">How it works</h2>
          <p className="text-lg text-white/55 max-w-lg mx-auto leading-relaxed">Simple steps for creators and restaurants.</p>
        </div>
      </AnimatedSection>

      <div className="grid lg:grid-cols-2 gap-6">
        <StepCard steps={creatorSteps} title="For Creators" icon={Smartphone} delay={0.1} />
        <StepCard steps={restaurantSteps} title="For Restaurants" icon={BarChart3} delay={0.2} />
      </div>
    </section>
  )
}
