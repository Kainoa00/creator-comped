'use client'

import { useRef, useEffect, useState } from 'react'
import { useInView } from 'framer-motion'
import AnimatedSection from './AnimatedSection'
import AppPreview from './AppPreview'
import BorderBeam from './BorderBeam'

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 1600
    const step = 16
    const increment = target / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setValue(target)
        clearInterval(timer)
      } else {
        setValue(Math.floor(start))
      }
    }, step)
    return () => clearInterval(timer)
  }, [isInView, target])

  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString()}
      {suffix}
    </span>
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-xs font-medium text-orange-300">Now open to creators in Utah</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
              Eat free.{' '}
              <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-blue-500 bg-clip-text text-transparent">
                Create content.
              </span>
              <br />
              Win rewards.
            </h1>

            <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-lg">
              CreatorComped matches food creators with restaurants offering comped meals.
              Post authentic content, climb the leaderboard, and earn monthly prizes.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#contact"
                className="group px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600 text-white font-semibold text-base shadow-lg shadow-orange-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
              >
                Download / Join as Creator
              </a>
              <a
                href="#contact"
                className="px-8 py-4 rounded-full border border-white/15 text-white font-semibold text-base transition-all duration-300 hover:bg-white/[0.06] hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
              >
                Join as Restaurant
              </a>
            </div>

            {/* Stats with count-up */}
            <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/[0.08]">
              <div>
                <div className="text-3xl font-extrabold bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
                  <CountUp target={500} suffix="+" />
                </div>
                <div className="text-xs text-white/45 mt-1 font-medium tracking-wide">Active creators</div>
              </div>
              <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/10 to-transparent" aria-hidden="true" />
              <div>
                <div className="text-3xl font-extrabold bg-gradient-to-r from-rose-400 to-blue-400 bg-clip-text text-transparent">
                  <CountUp target={80} suffix="+" />
                </div>
                <div className="text-xs text-white/45 mt-1 font-medium tracking-wide">Partner restaurants</div>
              </div>
              <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/10 to-transparent" aria-hidden="true" />
              <div>
                <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
                  $<CountUp target={50} suffix="K+" />
                </div>
                <div className="text-xs text-white/45 mt-1 font-medium tracking-wide">Comps redeemed</div>
              </div>
            </div>
          </AnimatedSection>

          {/* Right: App preview */}
          <AnimatedSection delay={0.15}>
            <div className="relative">
              {/* Glow blob behind the frame */}
              <div
                className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-orange-500/20 via-rose-500/10 to-blue-600/20 blur-3xl"
                aria-hidden="true"
              />

              {/* Card frame with BorderBeam */}
              <div className="relative rounded-3xl overflow-hidden bg-[#0d0d0d] border border-white/[0.08] shadow-2xl shadow-black/60" style={{ minHeight: '480px' }}>
                <AppPreview />
                <BorderBeam size={180} duration={9} colorFrom="#f97316" colorTo="#3b82f6" borderWidth={1.5} />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
