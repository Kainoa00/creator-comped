/**
 * HIVE — Capacitor platform utilities
 * Safe for server-side import: returns false/'web' when window is undefined.
 */

/** Returns true when running inside the Capacitor native runtime (iOS or Android). */
export function isNative(): boolean {
  if (typeof window === 'undefined') return false
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!(window as any).Capacitor?.isNativePlatform?.()
  } catch {
    return false
  }
}

/** Returns 'ios', 'android', or 'web'. */
export function getPlatform(): 'ios' | 'android' | 'web' {
  if (typeof window === 'undefined') return 'web'
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const platform = (window as any).Capacitor?.getPlatform?.() as string | undefined
    if (platform === 'ios') return 'ios'
    if (platform === 'android') return 'android'
    return 'web'
  } catch {
    return 'web'
  }
}

/** Returns true when running on iOS (native). */
export function isIOS(): boolean {
  return getPlatform() === 'ios'
}

/** Returns true when running on Android (native). */
export function isAndroid(): boolean {
  return getPlatform() === 'android'
}
