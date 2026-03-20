/**
 * Unit tests for lib/auth.ts
 *
 * These tests mock the Supabase client so they run without a live database.
 * They verify the signInWithEmail logic: restaurantId lookup, error handling,
 * and demo-mode bypass.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Hoist mocks so vi.mock factory can reference them ──────────────────────
const { mockSignInWithPassword, mockSignOut, mockGetSession, mockFrom } = vi.hoisted(() => ({
  mockSignInWithPassword: vi.fn(),
  mockSignOut: vi.fn(),
  mockGetSession: vi.fn(),
  mockFrom: vi.fn(),
}))

vi.mock('@/lib/supabase', () => ({
  get isDemoMode() {
    return (globalThis as any).__CC_DEMO_MODE ?? false
  },
  supabase: {
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signOut: mockSignOut,
      getSession: mockGetSession,
    },
    from: mockFrom,
  },
}))

import { signInWithEmail, getSession } from '@/lib/auth'

// ─── Helpers ────────────────────────────────────────────────────────────────

function setDemoMode(val: boolean) {
  ;(globalThis as any).__CC_DEMO_MODE = val
}

function mockSupabaseAuth(user: { id: string; email: string } | null, error: string | null = null) {
  mockSignInWithPassword.mockResolvedValue({
    data: { user },
    error: error ? { message: error } : null,
  })
}

function mockRestaurantUsersQuery(
  result: { restaurant_id: string; role: string } | null,
  error = false
) {
  const chainMock = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: result,
      error: error ? { message: 'not found' } : null,
    }),
  }
  mockFrom.mockReturnValue(chainMock)
  return chainMock
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('signInWithEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setDemoMode(false)
  })

  describe('demo mode', () => {
    it('returns a session for any email + password', async () => {
      setDemoMode(true)
      const { session, error } = await signInWithEmail('owner@test.com', 'any-pass')
      expect(error).toBeNull()
      expect(session).toMatchObject({
        userId: 'demo-user',
        email: 'owner@test.com',
        role: 'restaurant_admin',
        restaurantId: 'restaurant-001',
      })
    })

    it('returns error when email or password is missing', async () => {
      setDemoMode(true)
      const { session, error } = await signInWithEmail('', '')
      expect(session).toBeNull()
      expect(error).toBe('Email and password required')
    })
  })

  describe('live mode', () => {
    it('returns session with restaurantId when restaurant_users record exists', async () => {
      mockSupabaseAuth({ id: 'user-abc', email: 'owner@burger.com' })
      mockRestaurantUsersQuery({ restaurant_id: 'rest-001', role: 'restaurant_admin' })

      const { session, error } = await signInWithEmail('owner@burger.com', 'password123')

      expect(error).toBeNull()
      expect(session).toMatchObject({
        userId: 'user-abc',
        email: 'owner@burger.com',
        role: 'restaurant_admin',
        restaurantId: 'rest-001',
      })
    })

    it('signs out and returns error when user has no restaurant_users record', async () => {
      mockSupabaseAuth({ id: 'user-xyz', email: 'orphan@test.com' })
      mockRestaurantUsersQuery(null, true) // DB error / not found
      mockSignOut.mockResolvedValue({})

      const { session, error } = await signInWithEmail('orphan@test.com', 'password123')

      expect(session).toBeNull()
      expect(error).toContain('not linked to a restaurant')
      expect(mockSignOut).toHaveBeenCalledOnce()
    })

    it('returns error when Supabase auth fails', async () => {
      mockSupabaseAuth(null, 'Invalid login credentials')

      const { session, error } = await signInWithEmail('wrong@test.com', 'badpass')

      expect(session).toBeNull()
      expect(error).toBe('Invalid login credentials')
      expect(mockFrom).not.toHaveBeenCalled()
    })

    it('returns error when Supabase returns no user', async () => {
      mockSignInWithPassword.mockResolvedValue({ data: { user: null }, error: null })

      const { session, error } = await signInWithEmail('test@test.com', 'pass')

      expect(session).toBeNull()
      expect(error).toBe('No user returned')
    })

    it('includes role in session for admin role', async () => {
      mockSupabaseAuth({ id: 'admin-001', email: 'admin@creatorcomped.com' })
      mockRestaurantUsersQuery({ restaurant_id: 'rest-hq', role: 'admin' })

      const { session } = await signInWithEmail('admin@creatorcomped.com', 'pass')

      expect(session?.role).toBe('admin')
      expect(session?.restaurantId).toBe('rest-hq')
    })
  })
})

describe('getSession', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setDemoMode(false)
  })

  it('returns null when no active Supabase session', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } })

    const session = await getSession()
    expect(session).toBeNull()
  })

  it('re-fetches restaurantId on session restore', async () => {
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: { id: 'user-abc', email: 'owner@burger.com' },
        },
      },
    })
    mockRestaurantUsersQuery({ restaurant_id: 'rest-001', role: 'restaurant_admin' })

    const session = await getSession()

    expect(session).toMatchObject({
      userId: 'user-abc',
      restaurantId: 'rest-001',
      role: 'restaurant_admin',
    })
  })

  it('returns null restaurantId if restaurant_users lookup fails on restore', async () => {
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: { id: 'user-abc', email: 'owner@burger.com' },
        },
      },
    })
    mockRestaurantUsersQuery(null, false) // no error but no data

    const session = await getSession()

    expect(session?.restaurantId).toBeNull()
  })
})
