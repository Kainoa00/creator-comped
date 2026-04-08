/**
 * HIVE — Haptic feedback utility for Capacitor (iOS/Android)
 * Safe to import on web — all calls are no-ops on non-native platforms.
 * Caches the module after first import to avoid repeated async overhead.
 */
import { isNative } from './capacitor'

// Cache the haptics module after first import
let _mod: typeof import('@capacitor/haptics') | null = null
async function getHaptics() {
  if (!_mod) _mod = await import('@capacitor/haptics')
  return _mod
}

/** Light tap — used for button presses, toggles */
export async function hapticLight(): Promise<void> {
  if (!isNative()) return
  try {
    const { Haptics, ImpactStyle } = await getHaptics()
    await Haptics.impact({ style: ImpactStyle.Light })
  } catch { /* no-op on web */ }
}

/** Medium tap — used for adding items, confirmations */
export async function hapticMedium(): Promise<void> {
  if (!isNative()) return
  try {
    const { Haptics, ImpactStyle } = await getHaptics()
    await Haptics.impact({ style: ImpactStyle.Medium })
  } catch { /* no-op on web */ }
}

/** Heavy tap — used for significant actions like placing an order */
export async function hapticHeavy(): Promise<void> {
  if (!isNative()) return
  try {
    const { Haptics, ImpactStyle } = await getHaptics()
    await Haptics.impact({ style: ImpactStyle.Heavy })
  } catch { /* no-op on web */ }
}

/** Success notification — used for successful QR scans, order confirmation */
export async function hapticSuccess(): Promise<void> {
  if (!isNative()) return
  try {
    const { Haptics, NotificationType } = await getHaptics()
    await Haptics.notification({ type: NotificationType.Success })
  } catch { /* no-op on web */ }
}

/** Warning notification — used for expiring timers, low-priority alerts */
export async function hapticWarning(): Promise<void> {
  if (!isNative()) return
  try {
    const { Haptics, NotificationType } = await getHaptics()
    await Haptics.notification({ type: NotificationType.Warning })
  } catch { /* no-op on web */ }
}

/** Error notification — used for failures, expired codes */
export async function hapticError(): Promise<void> {
  if (!isNative()) return
  try {
    const { Haptics, NotificationType } = await getHaptics()
    await Haptics.notification({ type: NotificationType.Error })
  } catch { /* no-op on web */ }
}
