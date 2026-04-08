import type { CapacitorConfig } from '@capacitor/cli'

/**
 * Capacitor config for HIVE Business iOS + Android apps.
 *
 * BUNDLED MODE: The app loads from the static export in `out-business/`.
 * Run `npm run mobile:business` to build and sync.
 */
const config: CapacitorConfig = {
  appId: 'com.creatorcomped.business',
  appName: 'HIVE Business',
  webDir: 'out-business',
  server: {
    allowNavigation: ['*.supabase.co'],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0a0a0a',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#0a0a0a',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    Keyboard: {
      style: 'dark',
      resize: 'body',
      resizeOnFullScreen: true,
    },
    CapacitorUpdater: {
      autoUpdate: true,
    },
  },
  ios: {
    appendUserAgent: 'HIVE-Business',
    path: 'ios-business',
  },
  android: {
    path: 'android-business',
  },
}

export default config
