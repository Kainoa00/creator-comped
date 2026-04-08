/**
 * HIVE — Network status utility for Capacitor (iOS/Android)
 * Uses native Network plugin on mobile, falls back to browser APIs on web.
 */
import { isNative } from './capacitor'

type NetworkCallback = (connected: boolean) => void

/**
 * Watch network connectivity changes.
 * Returns an unsubscribe function.
 */
export function watchNetwork(callback: NetworkCallback): () => void {
  if (isNative()) {
    let removeListener: (() => void) | null = null
    let disposed = false

    import('@capacitor/network').then(({ Network }) => {
      if (disposed) return

      Network.getStatus().then((status) => {
        if (!disposed) callback(status.connected)
      })

      Network.addListener('networkStatusChange', (status) => {
        if (!disposed) callback(status.connected)
      }).then((handle) => {
        if (disposed) {
          handle.remove()
        } else {
          removeListener = () => handle.remove()
        }
      })
    })

    return () => {
      disposed = true
      removeListener?.()
    }
  }

  // Web fallback
  callback(navigator.onLine)
  const onOnline = () => callback(true)
  const onOffline = () => callback(false)
  window.addEventListener('online', onOnline)
  window.addEventListener('offline', onOffline)
  return () => {
    window.removeEventListener('online', onOnline)
    window.removeEventListener('offline', onOffline)
  }
}
