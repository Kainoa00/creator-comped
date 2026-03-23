import Link from 'next/link'
import { ArrowRight, BookOpen, LifeBuoy, FileText, Shield } from 'lucide-react'
import AnimatedSection, { EyebrowLabel, StaggerContainer, StaggerItem } from './AnimatedSection'

const resources = [
  { title: 'Rules', desc: 'Platform guidelines and policies', icon: BookOpen },
  { title: 'Support', desc: 'Get help from our team', icon: LifeBuoy },
  { title: 'Terms of Service', desc: 'Legal terms and conditions', icon: FileText },
  { title: 'Privacy Policy', desc: 'How we protect your data', icon: Shield },
]

export default function Resources() {
  return (
    <section id="resources" className="max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32 border-t border-white/[0.05]">
      <AnimatedSection>
        <div className="text-center mb-14">
          <EyebrowLabel>Resources</EyebrowLabel>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-5">Everything you need to know</h2>
          <p className="text-lg text-white/55 leading-relaxed">Guides, support, and legal docs all in one place.</p>
        </div>
      </AnimatedSection>

      <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {resources.map((r) => {
          const Icon = r.icon
          return (
            <StaggerItem key={r.title}>
              <a
                href="#"
                className="group flex flex-col gap-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] hover:border-white/[0.13] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-inset"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500/20 to-blue-600/20 border border-white/[0.07] flex items-center justify-center group-hover:from-orange-500/30 group-hover:to-blue-600/30 transition-all duration-300">
                  <Icon className="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors duration-300" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1 group-hover:text-orange-300 transition-colors">{r.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{r.desc}</p>
                </div>
              </a>
            </StaggerItem>
          )
        })}
      </StaggerContainer>

      <AnimatedSection>
        <div className="text-center">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-white/30 hover:text-white/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-sm"
          >
            Admin Dashboard
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </AnimatedSection>
    </section>
  )
}
