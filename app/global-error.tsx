'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body style={{ margin: 0, backgroundColor: '#0B0B0D' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            textAlign: 'center',
            padding: '24px',
            fontFamily: 'system-ui, sans-serif',
            backgroundColor: '#0B0B0D',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0, color: '#ffffff' }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0, maxWidth: '280px' }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 500,
              background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
