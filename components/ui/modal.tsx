'use client'

import * as Dialog from '@radix-ui/react-dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  /** 'default' = centered sheet, 'bottom' = mobile bottom sheet */
  placement?: 'default' | 'bottom'
  className?: string
  /** Hide the default close button */
  hideClose?: boolean
  /** Max width for the modal panel */
  maxWidth?: string
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  placement = 'default',
  className,
  hideClose = false,
  maxWidth = 'max-w-lg',
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/30 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0'
          )}
        />

        {/* Content panel */}
        <Dialog.Content
          className={cn(
            'fixed z-50 bg-white border border-slate-100 shadow-xl shadow-slate-200/50',
            'focus:outline-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            placement === 'bottom'
              ? [
                  'bottom-0 left-0 right-0 rounded-t-2xl p-6',
                  'data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom',
                  'max-h-[90dvh] overflow-y-auto',
                ]
              : [
                  'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6',
                  'w-[calc(100vw-2rem)]',
                  maxWidth,
                  'max-h-[90dvh] overflow-y-auto',
                  'data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                  'data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                ],
            className
          )}
        >
          {/* Title — always rendered for a11y; hidden when no title prop */}
          {title ? (
            <div className="flex items-start justify-between mb-4">
              <div>
                <Dialog.Title className="text-lg font-bold text-cc-text">{title}</Dialog.Title>
                {description && (
                  <Dialog.Description className="text-sm text-cc-text-secondary mt-1">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              {!hideClose && (
                <Dialog.Close
                  className="ml-4 shrink-0 text-cc-text-muted hover:text-cc-text transition-colors rounded-xl p-1.5 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </Dialog.Close>
              )}
            </div>
          ) : (
            <>
              <VisuallyHidden.Root>
                <Dialog.Title>Dialog</Dialog.Title>
              </VisuallyHidden.Root>
              {!hideClose && (
                <div className="flex justify-end mb-2">
                  <Dialog.Close
                    className="text-cc-text-muted hover:text-cc-text transition-colors rounded-xl p-1.5 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </Dialog.Close>
                </div>
              )}
            </>
          )}

          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

/** Modal footer with consistent padding and border */
export function ModalFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3', className)}>
      {children}
    </div>
  )
}
