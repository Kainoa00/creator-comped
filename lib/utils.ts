import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { differenceInSeconds, formatDistanceToNow } from 'date-fns'

/** Merge Tailwind classes safely, resolving conflicts */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Generate a random 5-digit redemption code */
export function generateRedemptionCode(): string {
  return Math.floor(10000 + Math.random() * 90000).toString()
}

/** Generate a unique QR token */
export function generateQRToken(): string {
  return `CC-${Date.now()}-${Math.random().toString(36).slice(2, 9).toUpperCase()}`
}

/** Get expiry timestamp (20 minutes from now) */
export function getCodeExpiry(): string {
  const d = new Date()
  d.setMinutes(d.getMinutes() + 20)
  return d.toISOString()
}

/** Check if a code is expired */
export function isExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date()
}

/** Get seconds remaining until expiry */
export function secondsRemaining(expiresAt: string): number {
  return Math.max(0, differenceInSeconds(new Date(expiresAt), new Date()))
}

/** Format a countdown (MM:SS) */
export function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

/** Format a 48h countdown from deadline (HH:MM:SS) */
export function format48hCountdown(deadline: string): string {
  const remaining = differenceInSeconds(new Date(deadline), new Date())
  if (remaining <= 0) return '00:00:00'
  const h = Math.floor(remaining / 3600)
  const m = Math.floor((remaining % 3600) / 60)
  const s = remaining % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

/** Compute contest score: Views + (Likes x 5) + (Comments x 25) */
export function computeScore(views: number, likes: number, comments: number): number {
  return views + likes * 5 + comments * 25
}

/** Check if currently in blackout hours */
export function isInBlackout(
  blackoutStart: string | null,
  blackoutEnd: string | null
): boolean {
  if (!blackoutStart || !blackoutEnd) return false
  const now = new Date()
  const [sh, sm] = blackoutStart.split(':').map(Number)
  const [eh, em] = blackoutEnd.split(':').map(Number)
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  const startMinutes = sh * 60 + sm
  const endMinutes = eh * 60 + em
  return nowMinutes >= startMinutes && nowMinutes <= endMinutes
}

/** Relative time string (e.g. "2 hours ago") */
export function relativeTime(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

/** Format a date to MM/DD/YYYY */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })
}

/** Format a date to Month D, YYYY */
export function formatDateLong(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Format a date to h:mm AM/PM */
export function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/** Get first two initials from a full name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

/** Truncate text with ellipsis */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

/** Format a number with K/M suffix */
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

/** Get current "YYYY-MM" month string */
export function currentMonthKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

/** Format currency in USD */
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

/** Deep clone an object (for demo data mutations) */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/** Sleep for ms milliseconds (use sparingly) */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
