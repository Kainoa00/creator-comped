/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Unit tests for lib/auth.ts
 *
 * These tests mock the Supabase client so they run without a live database.
 * They verify signInWithEmail and getSession logic: role detection via
 * user_profiles, legacy restaurant_users fallback, error handling, and
 * demo-mode bypass.
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

/** Mock a user_profiles row returned from .single() */
function mockUserProfilesQuery(
  result: { role: string; creator_id: string | null; restaurant_user_id: string | null } | null,
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

/** Mock both user_profiles (first call) and restaurant_users (second call) */
function mockProfileThenRestaurant(
  profile: { role: string; creator_id: string | null; restaurant_user_id: string | null },
  restaurantId: string
) {
  mockFrom
    .mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: profile, error: null }),
    })
    .mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { restaurant_id: restaurantId }, error: null }),
    })
}

/** Mock user_profiles miss then restaurant_users hit (legacy fallback) */
function mockLegacyFallback(
  restaurantId: string,
  role = 'business'
) {
  mockFrom
    .mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: 'not found' } }),
    })
    .mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { restaurant_id: restaurantId, role }, error: null }),
    })
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('signInWithEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setDemoMode(false)
  })

  describe('demo mode', () => {
    beforeEach(() => setDemoMode(true))

    it('returns influencer session for a regular email', async () => {
      const { session, error } = await signInWithEmail('user@test.com', 'any-pass')
      expect(error).toBeNull()
      expect(session).toMatchObject({
        userId: 'demo-user',
        email: 'user@test.com',
        role: 'influencer',
        creatorId: 'creator-001',
      })
    })

    it('returns business session for a biz email', async () => {
      const { session, error } = await signInWithEmail('owner@biz.com', 'any-pass')
      expect(error).toBeNull()
      expect(session).toMatchObject({
        role: 'business',
        restaurantId: 'restaurant-001',
        creatorId: null,
      })
    })

    it('returns admin session for an admin email', async () => {
      const { session, error } = await signInWithEmail('admin@hive.app', 'any-pass')
      expect(error).toBeNull()
      expect(session).toMatchObject({ role: 'admin' })
    })

    it('returns error when email or password is missing', async () => {
      const { session, error } = await signInWithEmail('', '')
      expect(session).toBeNull()
      expect(error).toBe('Email and password required')
    })
  })

  describe('live mode', () => {
    it('returns business session via user_profiles + restaurant_users', async () => {
      mockSupabaseAuth({ id: 'user-abc', email: 'owner@burger.com' })
      mockProfileThenRestaurant(
        { role: 'business', creator_id: null, restaurant_user_id: 'ru-001' },
        'rest-001'
      )

      const { session, error } = await signInWithEmail('owner@burger.com', 'password123')

      expect(error).toBeNull()
      expect(session).toMatchObject({
        userId: 'user-abc',
        email: 'owner@burger.com',
        role: 'business',
        restaurantId: 'rest-001',
        creatorId: null,
      })
    })

    it('falls back to legacy restaurant_users when no user_profiles row', async () => {
      mockSupabaseAuth({ id: 'user-legacy', email: 'legacy@burger.com' })
      mockLegacyFallback('rest-legacy')
      mockSignOut.mockResolvedValue({})

      const { session, error } = await signInWithEmail('legacy@burger.com', 'password123')

      expect(error).toBeNull()
      expect(session).toMatchObject({
        role: 'business',
        restaurantId: 'rest-legacy',
      })
    })

    it('signs out and returns error when no profile and no restaurant_users row', async () => {
      mockSupabaseAuth({ id: 'user-xyz', email: 'orphan@test.com' })
      // user_profiles miss
      mockFrom
        .mockReturnValueOnce({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null, error: { message: 'not found' } }),
        })
        // restaurant_users miss
        .mockReturnValueOnce({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null, error: { message: 'not found' } }),
        })
      mockSignOut.mockResolvedValue({})

      const { session, error } = await signInWithEmail('orphan@test.com', 'password123')

      expect(session).toBeNull()
      expect(error).toContain('not set up')
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

    it('returns influencer session for role=influencer profile', async () => {
      mockSupabaseAuth({ id: 'creator-001', email: 'creator@hive.app' })
      mockUserProfilesQuery({ role: 'influencer', creator_id: 'c-001', restaurant_user_id: null })

      const { session } = await signInWithEmail('creator@hive.app', 'pass')

      expect(session?.role).toBe('influencer')
      expect(session?.creatorId).toBe('c-001')
      expect(session?.restaurantId).toBeNull()
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

  it('re-fetches role and restaurantId on session restore', async () => {
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: { id: 'user-abc', email: 'owner@burger.com' },
        },
      },
    })
    mockProfileThenRestaurant(
      { role: 'business', creator_id: null, restaurant_user_id: 'ru-001' },
      'rest-001'
    )

    const session = await getSession()

    expect(session).toMatchObject({
      userId: 'user-abc',
      role: 'business',
      restaurantId: 'rest-001',
    })
  })

  it('returns null if no profile and no legacy restaurant_users row', async () => {
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: { id: 'user-abc', email: 'owner@burger.com' },
        },
      },
    })
    // user_profiles miss
    mockFrom
      .mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      })
      // restaurant_users miss
      .mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      })

    const session = await getSession()
    expect(session).toBeNull()
  })
})
