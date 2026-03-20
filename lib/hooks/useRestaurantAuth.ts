'use client'

import { useState, useEffect } from 'react'
import { signInWithEmail, signOut, getSession, persistDemoSession } from '@/lib/auth'
import type { AuthSession } from '@/lib/auth'
import { isDemoMode } from '@/lib/supabase'

export function useRestaurantAuth() {
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

  async function logout(): Promise<void> {
    await signOut()
    setUser(null)
  }

  return { user, loading, signIn, signOut: logout }
}
