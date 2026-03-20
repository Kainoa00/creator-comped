import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
      <p className="text-6xl font-bold text-gray-200">404</p>
      <h2 className="text-xl font-semibold">Page not found</h2>
      <p className="text-sm text-gray-500 max-w-xs">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 text-sm font-medium bg-black text-white rounded-xl"
      >
        Go home
      </Link>
    </div>
  )
}
