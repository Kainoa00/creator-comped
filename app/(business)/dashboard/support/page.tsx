'use client'

import { useState } from 'react'
import { Mail, MessageCircle, ExternalLink, ChevronDown, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const FAQS = [
  {
    q: 'How do I update my menu or services?',
    a: 'Go to Edit Menu or Services in the sidebar. You can add, edit, and toggle items active/inactive. Changes reflect immediately for creators browsing your listing.',
  },
  {
    q: 'How do I track my budget?',
    a: 'Your monthly budget is shown on the Home dashboard. Detailed spend breakdown is available on the Spend page.',
  },
  {
    q: "What happens if a creator doesn't post?",
    a: 'Creators have a set posting window (default 48 hours) to post after their comp. If they miss the deadline, the comp is marked expired and they may face account restrictions.',
  },
  {
    q: 'Can I adjust the creator cooldown?',
    a: 'Yes — go to Settings or the Campaign page to adjust cooldown periods, daily caps, and item limits.',
  },
  {
    q: 'How is engagement score calculated?',
    a: 'Score = Views + (Likes × 5) + (Comments × 25). This weights meaningful engagement over passive views.',
  },
]

const CONTACT_CARDS = [
  { icon: Mail, label: 'Email Support', sub: 'support@creatorcomped.com', href: 'mailto:support@creatorcomped.com' },
  { icon: MessageCircle, label: 'Live Chat', sub: 'Chat with us instantly', href: '#' },
]

export default function BusinessSupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="px-4 pt-6 pb-8 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="mb-5">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Business Dashboard</p>
        <h1 className="text-xl font-bold text-white">Support</h1>
        <p className="text-sm text-white/40 mt-0.5">Get help from our team</p>
      </div>

      {/* Contact Cards */}
      <div className="flex flex-col gap-3 mb-6">
        {CONTACT_CARDS.map(({ icon: Icon, label, sub, href }) => (
          <a
            key={label}
            href={href}
            className="flex items-center gap-4 bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 hover:bg-white/[0.08] transition-colors"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #4A90E2 100%)' }}
            >
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="text-xs text-white/40 mt-0.5 truncate">{sub}</p>
            </div>
            <ExternalLink className="h-4 w-4 text-white/20 shrink-0" />
          </a>
        ))}
      </div>

      {/* FAQ */}
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="h-4 w-4 text-white/40" />
        <h2 className="text-sm font-semibold text-white">Frequently Asked Questions</h2>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        {FAQS.map((faq, idx) => (
          <div key={idx} className="bg-white/[0.05] border border-white/[0.08] rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <p className="text-sm font-medium text-white pr-4">{faq.q}</p>
              <ChevronDown className={cn(
                'h-4 w-4 text-white/30 shrink-0 transition-transform',
                openFaq === idx && 'rotate-180'
              )} />
            </button>
            {openFaq === idx && (
              <div className="px-5 pb-4">
                <p className="text-sm text-white/50 leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Resources */}
      <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Additional Resources</p>
      <div className="flex flex-col gap-2">
        {[
          'Platform Rules & Guidelines',
          'Business Best Practices',
          'Content Quality Standards',
          'Analytics Guide',
        ].map((r) => (
          <a
            key={r}
            href="#"
            className="flex items-center justify-between bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-3 hover:bg-white/[0.08] transition-colors"
          >
            <span className="text-sm text-white/60">{r}</span>
            <ExternalLink className="h-4 w-4 text-white/20" />
          </a>
        ))}
      </div>
    </div>
  )
}
