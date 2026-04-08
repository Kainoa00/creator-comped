/**
 * HIVE — Native share utility for Capacitor (iOS/Android)
 * Uses the native Share Sheet on mobile, falls back to Web Share API or clipboard on web.
 */
import { isNative } from './capacitor'

interface ShareOptions {
  title: string
  text?: string
  url?: string
}

/**
 * Share content using the native share sheet (iOS/Android) or Web Share API.
 * Returns true if shared successfully, false otherwise.
 */
export async function shareContent(options: ShareOptions): Promise<boolean> {
  if (isNative()) {
    try {
      const { Share } = await import('@capacitor/share')
      await Share.share({
        title: options.title,
        text: options.text,
        url: options.url,
        dialogTitle: options.title,
      })
      return true
    } catch {
      return false
    }
  }

  // Web fallback: Web Share API
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: options.title,
        text: options.text,
        url: options.url,
      })
      return true
    } catch {
      return false
    }
  }

  // Final fallback: copy URL to clipboard
  if (options.url && typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(options.url)
      return true
    } catch {
      return false
    }
  }

  return false
}
