import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B0B0D] flex flex-col items-center justify-center gap-4 text-center px-6">
      <p className="text-6xl font-bold text-white/10">404</p>
      <h2 className="text-xl font-semibold text-white">Page not found</h2>
      <p className="text-sm text-gray-500 max-w-xs">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 text-sm font-medium text-white rounded-xl"
        style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #4A90E2 100%)' }}
      >
        Go home
      </Link>
    </div>
  )
}
