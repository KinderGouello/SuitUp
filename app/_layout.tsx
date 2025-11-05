import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, LogBox } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initDatabase } from '@/lib/db/init';
import { seedDatabase } from '@/lib/db/seed';
import { getSettings } from '@/lib/db/repo/settings';
import '../global.css';

// Suppress deprecated SafeAreaView warning from React Native internals
LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

const queryClient = new QueryClient();

export default function RootLayout() {
  useFrameworkReady();
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    async function initialize() {
      try {
        await initDatabase();
        await seedDatabase();
        setIsDbReady(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        // Still set ready to true to allow app to continue
        setIsDbReady(true);
      }
    }
    initialize();
  }, []);

  if (!isDbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#13315C" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="item/new" options={{ presentation: 'modal' }} />
          <Stack.Screen name="item/[id]" />
          <Stack.Screen name="outfit/[id]" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="dark" />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
