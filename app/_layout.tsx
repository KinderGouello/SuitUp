import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initDatabase } from '@/lib/db/init';
import { seedDatabase } from '@/lib/db/seed';
import { getSettings } from '@/lib/db/repo/settings';
import '../global.css';

const queryClient = new QueryClient();

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    async function initialize() {
      try {
        await initDatabase();
        await seedDatabase();
      } catch (error) {
        console.error('Failed to initialize:', error);
      }
    }
    initialize();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="item/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="item/[id]" />
        <Stack.Screen name="outfit/[id]" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
