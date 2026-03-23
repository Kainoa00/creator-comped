'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import AnimatedSection, { EyebrowLabel, StaggerContainer, StaggerItem } from './AnimatedSection'

const faqs = [
  {
    q: 'How do I become a creator?',
    a: 'Download the HIVE app, create an account with your Instagram and TikTok profiles, and start browsing participating businesses immediately. No minimum follower count required to start.',
  },
  {
    q: 'How do restaurants benefit?',
    a: 'Restaurants gain authentic content, increased social media exposure, and detailed analytics tracking ROI — all while controlling their budget and comp limits. Only pay for content that actually gets created.',
  },
  {
    q: 'What are the posting requirements?',
    a: 'Each restaurant sets their own deliverables. Typically, creators must post within 48 hours and include specified hashtags and restaurant tags. Requirements are shown clearly before you claim a comp.',
  },
  {
    q: 'How does the leaderboard work?',
    a: 'Creators earn points based on engagement (views, likes, comments) across their Instagram and TikTok posts. Top performers each month win prizes from the prize pool, refreshed every month.',
  },
]

function FAQItem({
  item,
  isOpen,
  onToggle,
}: {
  item: (typeof faqs)[number]
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className={`rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-white/[0.05] border border-white/[0.10]' : 'bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.10]'}`}>
      <h3>
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 hover:bg-white/[0.02] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-inset"
          aria-expanded={isOpen}
        >
          <span className={`font-semibold text-[15px] transition-colors duration-200 ${isOpen ? 'text-white' : 'text-white/80'}`}>{item.q}</span>
          <ChevronDown
            className={`w-4 h-4 shrink-0 transition-all duration-300 ${isOpen ? 'rotate-180 text-orange-400' : 'text-white/40'}`}
            aria-hidden="true"
          />
        </button>
      </h3>
      {/* CSS grid accordion — no JS height measurement needed */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-sm text-white/55 leading-relaxed">{item.a}</p>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32">
      <AnimatedSection>
        <div className="text-center mb-14">
          <EyebrowLabel>FAQ</EyebrowLabel>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">Frequently asked questions</h2>
        </div>
      </AnimatedSection>

      <StaggerContainer className="max-w-2xl mx-auto space-y-3">
        {faqs.map((item, i) => (
          <StaggerItem key={item.q}>
            <FAQItem
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex((prev) => (prev === i ? null : i))}
            />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  )
}
