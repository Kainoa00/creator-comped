import type { CapacitorConfig } from '@capacitor/cli'

/**
 * Capacitor config for CreatorComped iOS + Android apps.
 *
 * BUNDLED MODE: The app loads from the static export in `out/`.
 * Run `npm run mobile` to build and sync.
 */
const config: CapacitorConfig = {
  appId: 'com.creatorcomped.app',
  appName: 'HIVE',
  webDir: 'out',
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
