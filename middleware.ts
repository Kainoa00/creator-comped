import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PROTECTED_PREFIXES = ['/admin', '/dashboard', '/profile', '/cart', '/redeem', '/proof']
const PROTECTED_EXACT = new Set(['/discover'])

function isProtected(pathname: string): boolean {
  if (PROTECTED_EXACT.has(pathname)) return true
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (!isProtected(pathname)) return NextResponse.next()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured (demo/dev), allow through
  if (!url || !anon) return NextResponse.next()

  const res = NextResponse.next()
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          res.cookies.set(name, value, options)
        })
      },
    },
  })

  // Use getSession() (cookie-only, no network call) for the redirect gate.
  // API routes perform their own getUser() checks for actual data operations.
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, public assets
     * - API routes (handled by their own auth guards)
     */
    '/((?!_next/static|_next/image|favicon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$|api/).*)',
  ],
}
