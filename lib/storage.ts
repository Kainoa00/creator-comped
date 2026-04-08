/**
 * SSR-safe localStorage wrapper for Zustand persist middleware.
 * Returns localStorage on client, a no-op shim on server.
 */
export function ssrSafeStorage() {
  if (typeof window !== 'undefined') return localStorage
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  }
}
