'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
}

export default function AnimatedSection({ children, className = '', delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* Stagger container: wrap children in motion.div with staggerChildren */
const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const staggerItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

interface StaggerContainerProps {
  children: ReactNode
  className?: string
}

export function StaggerContainer({ children, className = '' }: StaggerContainerProps) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  )
}

/** Eyebrow label with orange text and a gradient underline — used in section headers */
export function EyebrowLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm font-semibold uppercase tracking-widest text-orange-400 mb-4">
      <span className="relative inline-block">
        {children}
        <span
          className="absolute left-0 -bottom-1 h-px w-full bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600"
          aria-hidden="true"
        />
      </span>
    </p>
  )
}

/** Subtle gradient divider line — used between sections */
export function SectionDivider() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8" aria-hidden="true">
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  )
}
