import { useEffect } from 'react';
import { Platform } from 'react-native';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Use globalThis which is available across all environments
      const globalObject = globalThis as typeof globalThis & { window?: Window };
      if (globalObject.window?.frameworkReady) {
        globalObject.window.frameworkReady();
      }
    }
  });
}
