'use client'

import dynamic from 'next/dynamic'
import { useState, Component, ReactNode } from 'react'

/* ── Fallback shown while loading or on error ── */
function SplinePlaceholder() {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500/[0.06] via-rose-500/[0.04] to-blue-600/[0.06]">
      {/* Decorative animated orbs */}
      <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-orange-500/15 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-blue-600/15 blur-3xl animate-pulse [animation-delay:1s]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-rose-500/10 blur-2xl animate-pulse [animation-delay:0.5s]" />
      {/* Floating geometric shapes */}
      <div className="absolute top-8 right-12 w-16 h-16 rounded-2xl border border-orange-500/20 rotate-12 animate-[spin_20s_linear_infinite]" />
      <div className="absolute bottom-10 left-10 w-10 h-10 rounded-xl border border-blue-500/20 -rotate-6 animate-[spin_15s_linear_infinite_reverse]" />
      <div className="relative text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-blue-600/20 border border-white/10 flex items-center justify-center">
          <svg className="w-7 h-7 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
          </svg>
        </div>
        <p className="text-xs text-white/25 font-medium">3D Scene</p>
      </div>
    </div>
  )
}

/* ── Error boundary to catch Spline runtime crashes ── */
class SplineErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) return <SplinePlaceholder />
    return this.props.children
  }
}

/* ── Lazy-loaded Spline component ── */
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <SplinePlaceholder />,
})

interface SplineSceneProps {
  url?: string
}

export default function SplineScene({ url }: SplineSceneProps) {
  const [loaded, setLoaded] = useState(false)

  // If no valid URL provided, show the decorative placeholder
  if (!url) return <SplinePlaceholder />

  return (
    <SplineErrorBoundary>
      <div className="relative w-full h-full min-h-[400px]">
        {!loaded && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <SplinePlaceholder />
          </div>
        )}
        <Spline
          scene={url}
          onLoad={() => setLoaded(true)}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </SplineErrorBoundary>
  )
}
