'use client'

import { motion, useReducedMotion, useInView } from 'framer-motion'
import { ElementType, useRef } from 'react'
import React from 'react'
import { cn } from '@/lib/utils'

interface TextGenerateEffectProps {
  text: string
  className?: string
  as?: ElementType
}

export function TextGenerateEffect({
  text,
  className,
  as: Tag = 'span',
}: TextGenerateEffectProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-20px' })
  const shouldReduceMotion = useReducedMotion()

  const words = text.split(' ')

  return (
    <Tag ref={ref as React.RefObject<HTMLElement>} className={cn('inline', className)}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={shouldReduceMotion ? false : { opacity: 0, filter: 'blur(4px)' }}
          animate={
            isInView || shouldReduceMotion
              ? { opacity: 1, filter: 'blur(0px)' }
              : { opacity: 0, filter: 'blur(4px)' }
          }
          transition={{
            duration: 0.4,
            delay: i * 0.07,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{ display: 'inline-block', marginRight: '0.3em' }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  )
}
