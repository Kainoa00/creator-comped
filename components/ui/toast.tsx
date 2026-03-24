'use client'

import * as ToastPrimitive from '@radix-ui/react-toast'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createContext, useContext, useState, useCallback } from 'react'
import type { Notification } from '@/lib/types'

// ── Toast Context ─────────────────────────────────────────────

interface ToastContextValue {
  toast: (notification: Omit<Notification, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

// ── Provider ──────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Notification[]>([])

  const toast = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { ...notification, id }])
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {toasts.map((t) => (
          <ToastItem key={t.id} notification={t} onDismiss={() => dismiss(t.id)} />
        ))}
        <ToastPrimitive.Viewport className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[360px] max-w-[calc(100vw-2rem)]" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}

// ── Single Toast ──────────────────────────────────────────────

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const variantStyles = {
  success: 'border-hive-success/40 bg-hive-success/10',
  error: 'border-hive-error/40 bg-hive-error/10',
  warning: 'border-hive-warning/40 bg-hive-warning/10',
  info: 'border-blue-500/40 bg-blue-500/10',
}

const iconColors = {
  success: 'text-hive-success',
  error: 'text-hive-error',
  warning: 'text-hive-warning',
  info: 'text-blue-400',
}

function ToastItem({
  notification,
  onDismiss,
}: {
  notification: Notification
  onDismiss: () => void
}) {
  const Icon = icons[notification.type]

  return (
    <ToastPrimitive.Root
      duration={notification.duration ?? 5000}
      onOpenChange={(open) => !open && onDismiss()}
      className={cn(
        'flex items-start gap-3 rounded-[12px] border p-4 shadow-xl',
        'bg-hive-card backdrop-blur',
        variantStyles[notification.type],
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=open]:slide-in-from-right-full data-[state=closed]:slide-out-to-right-full',
        'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
        'transition-all duration-200'
      )}
    >
      <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', iconColors[notification.type])} />
      <div className="flex-1 min-w-0">
        <ToastPrimitive.Title className="text-sm font-semibold text-hive-text">
          {notification.title}
        </ToastPrimitive.Title>
        {notification.message && (
          <ToastPrimitive.Description className="text-xs text-hive-text-secondary mt-0.5">
            {notification.message}
          </ToastPrimitive.Description>
        )}
      </div>
      <ToastPrimitive.Close
        aria-label="Dismiss"
        className="shrink-0 text-hive-text-muted hover:text-hive-text transition-colors"
        onClick={onDismiss}
      >
        <X className="h-4 w-4" />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  )
}
