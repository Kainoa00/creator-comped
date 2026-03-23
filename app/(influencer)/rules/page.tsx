'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Trophy } from 'lucide-react'

const RULES = [
  {
    section: 'How It Works',
    icon: <CheckCircle2 className="h-5 w-5 text-green-400" />,
    items: [
      'Browse restaurants near you on the Discover tab',
      'Select items from the Comped Menu and add to your order',
      'Agree to posting requirements and place your order',
      'Show the QR code or 5-digit code to restaurant staff',
      'Post your content within 48 hours',
      'Submit proof via the Proof tab',
    ],
  },
  {
    section: 'Posting Requirements',
    icon: <Trophy className="h-5 w-5 text-[#FF6B35]" />,
    items: [
      'Post must be published within 48 hours of redemption',
      'Your account must be public at time of posting',
      'Posts must remain active for at least 30 days',
      'Include all required hashtags and tags specified by the restaurant',
      'Content must clearly feature the food or restaurant',
    ],
  },
  {
    section: 'Strike Policy',
    icon: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
    items: [
      'Strike 1: Warning — 7-day posting suspension',
      'Strike 2: 30-day account suspension',
      'Strike 3: Permanent ban from HIVE',
    ],
  },
  {
    section: 'What Causes a Strike',
    icon: <XCircle className="h-5 w-5 text-red-400" />,
    items: [
      'Failure to post within 48 hours',
      'Setting account to private before 30-day period',
      'Deleting the post before 30 days',
      'Submitting false or unrelated proof',
      'Misrepresenting items received',
    ],
  },
]

export default function RulesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white max-w-[430px] mx-auto">
      <header className="px-4 pt-14 pb-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#1a1a1a] transition-colors">
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white">Rules & Guidelines</h1>
      </header>

      <div className="px-4 pb-28 space-y-4">
        {/* Intro */}
        <div
          className="rounded-2xl p-5"
          style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.15) 0%, rgba(74,144,226,0.15) 100%)', border: '1px solid rgba(255,107,53,0.2)' }}
        >
          <p className="text-sm text-gray-300 leading-relaxed">
            HIVE connects creators with restaurants for mutually beneficial partnerships. These rules ensure a fair experience for everyone.
          </p>
        </div>

        {RULES.map(({ section, icon, items }) => (
          <div key={section} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-4 border-b border-[#2a2a2a]">
              {icon}
              <h2 className="text-sm font-bold text-white">{section}</h2>
            </div>
            <ul className="px-4 py-3 space-y-2.5">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600 shrink-0 mt-1.5" />
                  <p className="text-sm text-gray-300 leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <p className="text-center text-xs text-gray-600 pb-4">Last updated March 2026 · HIVE v1.0.0</p>
      </div>
    </div>
  )
}
