import type { CapacitorConfig } from '@capacitor/cli'

/**
 * Capacitor config for CreatorComped iOS + Android apps.
 *
 * SERVER MODE: The app loads from the live Vercel URL rather than a static
 * export. This means app updates deploy automatically without an App Store
 * submission — only native code changes require a new binary.
 *
 * Set CAPACITOR_SERVER_URL in your environment to override (useful for staging).
 */
const config: CapacitorConfig = {
  appId: 'com.creatorcomped.app',
  appName: 'HIVE',
  webDir: 'out',  // fallback for offline; server.url takes precedence when set
  server: {
    // Point to the /creator route on the production Vercel deployment.
    // Change this to your actual Vercel domain before App Store submission.
    url: process.env.CAPACITOR_SERVER_URL ?? 'https://creatorcomped.com/login',
    cleartext: false,
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: '#0a0a0a',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0a0a0a',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
  ios: {
    // Set to true before release builds
    appendUserAgent: 'HIVE',
  },
  android: {
    // Minimum Android API level
    minSdkVersion: 24,
    buildOptions: {
      keystorePath: undefined,  // set via CI/CD environment
      keystoreAlias: undefined,
    },
  },
}

export default config
