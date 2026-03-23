'use client'

import { useState, useEffect } from 'react'
import {
  signInWithEmail,
  signUpInfluencer,
  signOut,
  getSession,
  persistDemoSession,
  type AuthSession,
  type AppRole,
} from '@/lib/auth'
import { isDemoMode } from '@/lib/supabase'

export type { AuthSession, AppRole }

export function useAuth() {
  const [user, setUser] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSession().then((session) => {
      setUser(session)
      setLoading(false)
    })
  }, [])

  async function signIn(email: string, password: string): Promise<string | null> {
    const { session, error } = await signInWithEmail(email, password)
    if (error) return error
    if (session) {
      if (isDemoMode) persistDemoSession(session)
      setUser(session)
    }
    return null
  }

  async function signUp(email: string, password: string, name: string): Promise<string | null> {
    const { session, error } = await signUpInfluencer(email, password, name)
    if (error) return error
    if (session) {
      if (isDemoMode) persistDemoSession(session)
      setUser(session)
    }
    return null
  }

  async function logout(): Promise<void> {
    await signOut()
    setUser(null)
  }

  return { user, loading, signIn, signUp, signOut: logout }
}

/** Thin wrapper kept for backwards compatibility with restaurant-admin pages */
export function useRestaurantAuth() {
  const { user, loading, signIn, signOut: logout } = useAuth()
  return { user, loading, signIn, signOut: logout }
}
