import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  /** Adds a hive-accent colored left border for highlighted cards */
  highlighted?: boolean
}

export function Card({ className, hover = false, highlighted = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-slate-100 rounded-2xl shadow-sm p-4',
        hover && 'cursor-pointer transition-all duration-200 hover:shadow-md',
        highlighted && 'border-l-4 border-l-hive-accent',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

type CardHeaderProps = HTMLAttributes<HTMLDivElement>

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-3', className)} {...props}>
      {children}
    </div>
  )
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4'
}

export function CardTitle({ className, as: Tag = 'h3', children, ...props }: CardTitleProps) {
  return (
    <Tag className={cn('text-hive-text font-semibold', className)} {...props}>
      {children}
    </Tag>
  )
}

type CardBodyProps = HTMLAttributes<HTMLDivElement>

export function CardBody({ className, children, ...props }: CardBodyProps) {
  return (
    <div className={cn('text-hive-text-secondary text-sm', className)} {...props}>
      {children}
    </div>
  )
}

type CardFooterProps = HTMLAttributes<HTMLDivElement>

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div
      className={cn('mt-4 pt-4 border-t border-slate-100 flex items-center gap-2', className)}
      {...props}
    >
      {children}
    </div>
  )
}
