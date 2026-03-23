/**
 * HIVE — Push notification registration for Capacitor (iOS/Android)
 * Only runs on native platforms. Safe to import on web (no-ops).
 */
import { isNative, getPlatform } from './capacitor'

let _registered = false

/**
 * Creates an authenticated Supabase client using the user's JWT
 * so RLS policies (auth_user_id = auth.uid()) pass correctly.
 */
async function createUserClient(accessToken: string) {
  const { createClient } = await import('@supabase/supabase-js')
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return null
  return createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  })
}

/**
 * Request push permission and register device token.
 * Stores the token in the `push_tokens` Supabase table.
 *
 * @param authUserId  The authenticated user's Supabase auth UUID
 * @param accessToken The user's current Supabase JWT (required for RLS)
 */
export async function registerPushNotifications(
  authUserId: string,
  accessToken: string
): Promise<void> {
  if (!isNative() || _registered) return

  try {
    const { PushNotifications } = await import('@capacitor/push-notifications')

    // Check/request permission
    const permission = await PushNotifications.checkPermissions()
    if (permission.receive === 'prompt') {
      const result = await PushNotifications.requestPermissions()
      if (result.receive !== 'granted') {
        console.warn('[Push] Permission denied')
        return
      }
    } else if (permission.receive !== 'granted') {
      return
    }

    // Clear any stale listeners before re-registering
    await PushNotifications.removeAllListeners()
    await PushNotifications.register()

    // Attach all listeners before marking as registered so the flag
    // is only true once the full setup is complete
    PushNotifications.addListener('registration', async (token) => {
      const supabase = await createUserClient(accessToken)
      if (!supabase) return
      await supabase.from('push_tokens').upsert(
        {
          auth_user_id: authUserId,
          platform: getPlatform() === 'ios' ? 'ios' : 'android',
          token: token.value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'auth_user_id,platform' }
      )
    })

    PushNotifications.addListener('registrationError', (err) => {
      console.error('[Push] Registration error:', err)
    })

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('[Push] Foreground notification:', notification.title)
    })

    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      const route = action.notification.data?.route
      if (route) {
        window.dispatchEvent(new CustomEvent('hive:push-navigate', { detail: route }))
      }
    })

    // Set registered only after all listeners are attached
    _registered = true
  } catch (err) {
    console.error('[Push] Setup failed:', err)
  }
}

/** Remove stored push token on logout. */
export async function unregisterPushNotifications(
  authUserId: string,
  accessToken: string
): Promise<void> {
  if (!isNative()) return
  _registered = false
  try {
    const { PushNotifications } = await import('@capacitor/push-notifications')
    await PushNotifications.removeAllListeners()

    const supabase = await createUserClient(accessToken)
    if (!supabase) return
    await supabase.from('push_tokens').delete().eq('auth_user_id', authUserId)
  } catch (err) {
    console.error('[Push] Unregister failed:', err)
  }
}
