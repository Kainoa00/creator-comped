import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * Shared "Saved!" flash state for save buttons.
 * Clears automatically after `duration` ms and cancels on unmount.
 */
export function useSaveFlash(duration = 2000) {
  const [saved, setSaved] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const flash = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    setSaved(true)
    timer.current = setTimeout(() => setSaved(false), duration)
  }, [duration])

  return { saved, flash }
}
