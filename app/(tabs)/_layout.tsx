import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Shirt, Plus, Settings, Sparkles } from 'lucide-react-native';
import { theme, spacing, radii, elevation, colors } from '@/lib/styles/tokens';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.appContainer}>
      <LinearGradient
        colors={[colors.indigo600, colors.sky500, colors.indigo600]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topGradientLine}
        pointerEvents="none"
      />
      <View style={[styles.tabsWrapper, { paddingTop: insets.top }]}>
        <Tabs
          sceneContainerStyle={styles.sceneContainer}
          screenOptions={{
            headerShown: false,
            headerStyle: {
              backgroundColor: theme.surface,
              ...elevation.sm,
            },
            headerTintColor: theme.text_primary,
            headerTitleStyle: {
              fontSize: 22,
              fontWeight: '700',
            },
            headerShadowVisible: false,
            tabBarStyle: {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.8)', // bg-white/80 in Figma
              borderTopWidth: 2,
              borderTopColor: colors.indigo100,
              paddingBottom: insets.bottom + spacing.sm,
              paddingTop: spacing.md,
              paddingHorizontal: spacing.md, // Increased for better spacing
              height: 80 + insets.bottom, // Increased height to accommodate labels
              ...elevation.xl,
            },
            tabBarBackground: () =>
              Platform.OS !== 'web' ? (
                <BlurView
                  intensity={80}
                  tint="light"
                  style={StyleSheet.absoluteFill}
                />
              ) : null,
            tabBarActiveTintColor: colors.white,
            tabBarInactiveTintColor: colors.darkGray, // gray-600 to match Figma
            tabBarShowLabel: false,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  icon={
                    <Home
                      size={24}
                      color={focused ? colors.white : colors.darkGray}
                      strokeWidth={2}
                    />
                  }
                  label="Home"
                  focused={focused}
                  showSparkle={focused}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="wardrobe"
            options={{
              title: 'Closet',
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  icon={
                    <Shirt
                      size={24}
                      color={focused ? colors.white : colors.darkGray}
                      strokeWidth={2}
                    />
                  }
                  label="Closet"
                  focused={focused}
                  showSparkle={focused}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Add',
              headerTitle: 'Add Item',
              href: '/item/new',
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  icon={
                    <Plus size={20} color={colors.white} strokeWidth={2.5} />
                  }
                  label="Add"
                  focused={focused}
                  isAddButton
                />
              ),
            }}
          />
          <Tabs.Screen
            name="preferences"
            options={{
              title: 'Profile',
              headerTitle: 'Preferences',
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  icon={
                    <Settings
                      size={24}
                      color={focused ? colors.white : colors.darkGray}
                      strokeWidth={2}
                    />
                  }
                  label="Profile"
                  focused={focused}
                  showSparkle={focused}
                />
              ),
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}

// Custom Tab Icon Component matching Figma design
function TabIcon({
  icon,
  label,
  focused,
  showSparkle,
  isAddButton,
}: {
  icon: React.ReactNode;
  label: string;
  focused: boolean;
  showSparkle?: boolean;
  isAddButton?: boolean;
}) {
  // Add button is ALWAYS gradient (even when inactive)
  if (isAddButton) {
    return (
      <View style={[styles.tabButton, styles.activeTabButton]}>
        {/* Main gradient background */}
        {/* <LinearGradient
          colors={[colors.indigo600, colors.sky500]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        /> */}
        {/* Blurred gradient behind for depth */}
        {/* <LinearGradient
          colors={[colors.indigo600, colors.sky500]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.blurredGradientBackground}
        /> */}

        <View style={styles.tabContent}>
          {/* Add button has a circular gradient container */}
          <View style={styles.iconWrapper}>
            <LinearGradient
              colors={[colors.indigo600, colors.sky500]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addIconContainer}
            >
              {icon}
            </LinearGradient>
          </View>
          <Text style={styles.inactiveTabLabel} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </View>
    );
  }

  // Regular tabs
  if (focused) {
    return (
      <View style={[styles.tabButton, styles.activeTabButton]}>
        {/* Main gradient background */}
        <LinearGradient
          colors={[colors.indigo600, colors.sky500]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        />
        {/* Blurred gradient behind for depth */}
        {/* <LinearGradient
          colors={[colors.indigo600, colors.sky500]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.blurredGradientBackground}
        /> */}

        <View style={styles.tabContent}>
          <View style={styles.iconWrapper}>{icon}</View>
          <Text style={styles.activeTabLabel} numberOfLines={1}>
            {label}
          </Text>
        </View>

        {showSparkle && (
          <View style={styles.sparkleContainer}>
            <Sparkles
              size={12}
              color={colors.amber400}
              fill={colors.amber400}
            />
          </View>
        )}
      </View>
    );
  }

  // Inactive tab
  return (
    <View style={styles.tabButton}>
      <View style={styles.tabContent}>
        <View style={styles.iconWrapper}>{icon}</View>
        <Text style={styles.inactiveTabLabel} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: theme.background,
  },
  topGradientLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    zIndex: 10,
  },
  tabsWrapper: {
    flex: 1,
  },
  sceneContainer: {
    backgroundColor: theme.background,
  },
  tabButton: {
    position: 'absolute',
    flex: 1, // Ensure equal distribution of space
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm, // 8px
    paddingHorizontal: spacing.xs, // Reduced padding to fit labels
    borderRadius: radii.lg, // 16px (rounded-2xl in Figma)
    minWidth: 60, // Minimum width to prevent compression
  },
  activeTabButton: {
    // Active state styling handled by gradient layers
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radii.lg, // 16px (rounded-2xl in Figma)
    zIndex: 0,
  },
  blurredGradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radii.lg, // 16px (rounded-2xl in Figma)
    opacity: 0.5,
    zIndex: 0,
    // Note: React Native doesn't support blur on View, but the gradient layering creates depth
  },
  tabContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, // Ensure content appears above gradients
  },
  iconWrapper: {
    marginBottom: 4, // 4px gap between icon and label
  },
  addIconContainer: {
    borderRadius: radii.full, // Circular container for Add icon
    padding: spacing.sm, // 8px padding
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12, // text-xs in Figma
    fontWeight: '600',
    letterSpacing: 0,
  },
  activeTabLabel: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0,
    textAlign: 'center',
  },
  inactiveTabLabel: {
    color: colors.darkGray, // text-gray-600 in Figma (#4b5563)
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0,
    textAlign: 'center',
  },
  sparkleContainer: {
    position: 'absolute',
    top: -4, // -top-1 in Figma
    right: -4, // -right-1 in Figma
  },
});
