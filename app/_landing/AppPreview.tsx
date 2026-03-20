'use client'

import { motion } from 'framer-motion'
import { MapPin, Star, CheckCircle2, Trophy, Zap, LucideIcon } from 'lucide-react'

const comps = [
  {
    name: 'Slab Pizza',
    location: 'Provo, UT',
    value: '$45',
    requirement: '1 Instagram Reel',
    accent: 'from-orange-500/20 to-rose-500/10',
    border: 'border-orange-500/25',
    dot: 'bg-orange-400',
  },
  {
    name: 'R&R BBQ',
    location: 'Salt Lake City, UT',
    value: '$60',
    requirement: '1 TikTok + 1 Post',
    accent: 'from-blue-500/20 to-purple-500/10',
    border: 'border-blue-500/25',
    dot: 'bg-blue-400',
  },
]

/** Wraps children in a motion.div that gently floats up and down on loop */
function FloatWrapper({
  children,
  delay = 0,
  distance = 8,
}: {
  children: React.ReactNode
  delay?: number
  distance?: number
}) {
  return (
    <motion.div
      animate={{ y: [0, -distance, 0] }}
      transition={{
        duration: 3.5 + delay * 0.4,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

const ENTER_EASE = [0.25, 0.46, 0.45, 0.94] as const

/** Reusable floating notification badge used for the decorative side-chips */
function FloatingBadge({
  icon: Icon,
  gradient,
  shadow,
  title,
  subtitle,
  position,
  enterDelay,
  enterX,
  floatDelay,
}: {
  icon: LucideIcon
  gradient: string
  shadow: string
  title: string
  subtitle: string
  position: string
  enterDelay: number
  enterX: number
  floatDelay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, x: enterX }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ delay: enterDelay, duration: 0.5, ease: ENTER_EASE }}
      className={`absolute z-20 ${position}`}
    >
      <FloatWrapper delay={floatDelay} distance={6}>
        <div className="bg-[#111]/90 backdrop-blur-xl border border-white/[0.1] rounded-2xl px-3.5 py-2.5 shadow-xl shadow-black/40">
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-lg ${shadow}`}>
              <Icon className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <div className="text-[12px] font-semibold text-white leading-tight">{title}</div>
              <div className="text-[10px] text-white/40 mt-0.5">{subtitle}</div>
            </div>
          </div>
        </div>
      </FloatWrapper>
    </motion.div>
  )
}

export default function AppPreview() {
  return (
    <div className="relative w-full min-h-[480px] flex items-center justify-center select-none">
      {/* Dot grid background */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* ── Main comp card ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7, ease: ENTER_EASE }}
        className="z-10"
      >
        <FloatWrapper delay={0} distance={7}>
          <div className="w-full max-w-[290px] rounded-2xl bg-white/[0.05] border border-white/[0.1] backdrop-blur-sm p-5 shadow-2xl shadow-black/50">
            {/* Card header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest">
                  Live Comps
                </span>
              </div>
              <span className="text-[11px] text-white/35 font-medium">3 near you</span>
            </div>

            {/* Comp rows */}
            <div className="space-y-2.5">
              {comps.map((comp, i) => (
                <motion.div
                  key={comp.name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.12, duration: 0.5 }}
                  className={`rounded-xl bg-gradient-to-br ${comp.accent} border ${comp.border} p-3`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${comp.dot} shrink-0`} />
                        <span className="text-[13px] font-semibold text-white leading-tight truncate">
                          {comp.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-white/35 shrink-0" />
                        <span className="text-[11px] text-white/35 truncate">{comp.location}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[15px] font-bold text-white leading-none">{comp.value}</div>
                      <div className="text-[10px] text-white/35 mt-0.5">comp</div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <Star className="w-3 h-3 text-white/40 shrink-0" />
                    <span className="text-[11px] text-white/45">{comp.requirement}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
              className="mt-3.5 pt-3 border-t border-white/[0.07] flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3 h-3 text-orange-400" />
              <span className="text-[11px] text-white/40 font-medium">12 more comps available</span>
            </motion.div>
          </div>
        </FloatWrapper>
      </motion.div>

      {/* ── Floating: Comp redeemed notification ── */}
      <FloatingBadge
        icon={CheckCircle2}
        gradient="from-emerald-400 to-cyan-500"
        shadow="shadow-emerald-500/20"
        title="Comp redeemed!"
        subtitle="+250 XP earned"
        position="top-8 right-2 lg:right-0"
        enterDelay={0.9}
        enterX={16}
        floatDelay={1.2}
      />

      {/* ── Floating: Leaderboard badge ── */}
      <FloatingBadge
        icon={Trophy}
        gradient="from-orange-400 to-rose-500"
        shadow="shadow-orange-500/20"
        title="#3 on leaderboard"
        subtitle="Top 5% this month"
        position="bottom-8 left-2 lg:left-0"
        enterDelay={1.15}
        enterX={-16}
        floatDelay={2.4}
      />
    </div>
  )
}
