'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, MessageCircle, FileQuestion, ExternalLink } from 'lucide-react'

export default function SupportPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white max-w-[430px] mx-auto">
      <header className="px-4 pt-14 pb-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#1a1a1a] active:bg-[#252525] transition-colors">
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white">Support</h1>
      </header>

      <div className="px-4 pb-28 space-y-4">
        {/* Hero */}
        <div
          className="rounded-2xl p-5"
          style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.15) 0%, rgba(74,144,226,0.15) 100%)', border: '1px solid rgba(255,107,53,0.2)' }}
        >
          <h2 className="text-lg font-bold text-white mb-1">How can we help?</h2>
          <p className="text-sm text-gray-400">We typically respond within 24 hours on business days.</p>
        </div>

        {/* Contact options */}
        <div className="space-y-3">
          <a
            href="mailto:kaishintaku08@gmail.com"
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 flex items-center gap-4 hover:border-white/20 transition-colors block"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #4A90E2 100%)' }}
            >
              <Mail className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white">Email Support</p>
              <p className="text-xs text-gray-500 mt-0.5">kaishintaku08@gmail.com</p>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-600" />
          </a>

          <a
            href="sms:+18015550100"
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 flex items-center gap-4 hover:border-white/20 transition-colors block"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #4A90E2 0%, #FF6B35 100%)' }}
            >
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-bold text-white">Text Support</p>
              <p className="text-xs text-gray-500 mt-0.5">Send us a text message</p>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-600" />
          </a>

          <button
            onClick={() => router.push('/rules')}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 flex items-center gap-4 hover:border-white/20 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-[#252525] flex items-center justify-center shrink-0">
              <FileQuestion className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-bold text-white">Rules & FAQ</p>
              <p className="text-xs text-gray-500 mt-0.5">How HIVE works, strike policy, and more</p>
            </div>
          </button>
        </div>

        {/* FAQ accordion preview */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-4 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Common Questions</p>
          {[
            'How do I get comped?',
            'What counts as a strike?',
            'How long does proof review take?',
            'Can I dispute a rejected proof?',
          ].map((q) => (
            <div key={q} className="py-2 border-t border-[#2a2a2a]">
              <p className="text-sm font-semibold text-white">{q}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
