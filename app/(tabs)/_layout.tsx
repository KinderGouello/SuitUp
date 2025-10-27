import { Tabs } from 'expo-router';
import { Home, ShoppingBag, Sliders, Settings } from 'lucide-react-native';
import { theme, layout, elevation, iconSizes } from '@/lib/styles/tokens';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.surface,
          height: layout.appBar.height,
          ...elevation.sm,
        },
        headerTintColor: theme.text_primary,
        headerTitleStyle: {
          fontSize: 22,
          fontWeight: '700',
        },
        headerShadowVisible: false,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.text_secondary,
        tabBarStyle: {
          height: layout.tabBar.height,
          backgroundColor: theme.surface,
          borderTopWidth: 0,
          ...elevation.sm,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={iconSizes.md} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="wardrobe"
        options={{
          title: 'Wardrobe',
          tabBarIcon: ({ size, color }) => (
            <ShoppingBag size={iconSizes.md} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="preferences"
        options={{
          title: 'Style',
          tabBarIcon: ({ size, color }) => (
            <Sliders size={iconSizes.md} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={iconSizes.md} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}
