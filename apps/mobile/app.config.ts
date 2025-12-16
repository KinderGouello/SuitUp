import { ExpoConfig, ConfigContext } from 'expo/config';

const packageJson = require('./package.json');

// Calculate Android version code from semver (formula: major*10000 + minor*100 + patch)
// Example: "1.2.3" -> 10203, "2.0.0" -> 20000
const [major, minor, patch] = packageJson.version.split('.').map(Number);
const versionCode = major * 10000 + minor * 100 + patch;

// Environment configuration with safe defaults
const ENV = process.env.EXPO_PUBLIC_ENV || 'local';
const APP_NAME = process.env.EXPO_PUBLIC_APP_NAME || 'SuitUp (Dev)';
const ANDROID_PACKAGE = process.env.EXPO_PUBLIC_ANDROID_PACKAGE || 'com.suitup.app.dev';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: APP_NAME,
  slug: 'suitup',
  version: packageJson.version,
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'suitup',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  android: {
    package: ANDROID_PACKAGE,
    versionCode: versionCode,
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    permissions: [
      'CAMERA',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
      'ACCESS_FINE_LOCATION',
      'ACCESS_COARSE_LOCATION',
    ],
  },
  web: {
    bundler: 'metro',
    output: 'single',
    favicon: './assets/images/favicon.png',
  },
  plugins: ['expo-router', 'expo-font', 'expo-web-browser'],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    environment: ENV,
    // Expose env vars for expo-constants access (lib/supabase/client.ts pattern)
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    langfusePublicKey: process.env.EXPO_PUBLIC_LANGFUSE_PUBLIC_KEY,
    langfuseSecretKey: process.env.EXPO_PUBLIC_LANGFUSE_SECRET_KEY,
    langfuseBaseUrl: process.env.EXPO_PUBLIC_LANGFUSE_BASE_URL,
  },
});
