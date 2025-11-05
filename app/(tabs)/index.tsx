import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Pressable,
  Image,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Button } from '@/components/Button';
import { WeatherBadge } from '@/components/WeatherBadge';
import { WeatherSetup } from '@/components/WeatherSetup';
import { TodaysPerfectMatch } from '@/components/TodaysPerfectMatch';
import { BrandHeader } from '@/components/BrandHeader';
import { weatherClient } from '@/lib/weather/client';
import { recommendOutfit } from '@/lib/ai/heuristics';
import { useWardrobe } from '@/state/useWardrobe';
import { usePreferences } from '@/state/usePreferences';
import { useSettings } from '@/state/useSettings';
import * as weatherRepo from '@/lib/db/repo/weather';
import * as outfitsRepo from '@/lib/db/repo/outfits';
import { WeatherSnapshot, Outfit } from '@/lib/types';
import {
  Sparkles,
  TrendingUp,
  Flame,
  Star,
  Trophy,
  Zap,
} from 'lucide-react-native';
import {
  theme,
  typography,
  spacing,
  radii,
  elevation,
  colors,
} from '@/lib/styles/tokens';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, loadItems } = useWardrobe();
  const { preferences, loadPreferences } = usePreferences();
  const { settings, loadSettings } = useSettings();

  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [latestOutfit, setLatestOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatingOutfit, setGeneratingOutfit] = useState(false);
  const [needsWeatherSetup, setNeedsWeatherSetup] = useState(false);

  // Reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      initializeData();
    }, [])
  );

  const initializeData = async () => {
    setLoading(true);
    try {
      // Load wardrobe data with better error handling
      try {
        await loadItems();
      } catch (error) {
        console.error('Failed to load items:', error);
        // Continue even if items fail to load
      }

      try {
        await loadPreferences();
      } catch (error) {
        console.error('Failed to load preferences:', error);
      }

      try {
        await loadSettings();
      } catch (error) {
        console.error('Failed to load settings:', error);
      }

      // Load weather
      try {
        const cachedWeather = await weatherRepo.getWeather();
        if (cachedWeather) {
          setWeather(cachedWeather);
          setNeedsWeatherSetup(false);
        } else {
          await fetchWeather();
        }
      } catch (error) {
        console.error('Failed to load weather:', error);
      }

      // Load latest outfit
      try {
        const outfit = await outfitsRepo.getLatestOutfit();
        setLatestOutfit(outfit);
      } catch (error) {
        console.error('Failed to load outfit:', error);
      }
    } catch (error) {
      console.error('Failed to initialize:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async () => {
    try {
      let weatherData: WeatherSnapshot | null = null;

      if (settings?.locationMode === 'gps') {
        // Check if we already have permission
        const { status: existingStatus } =
          await Location.getForegroundPermissionsAsync();

        if (existingStatus === 'granted') {
          // We have permission, fetch directly
          const location = await Location.getCurrentPositionAsync({});
          weatherData = await weatherClient.getCurrentWeather({
            lat: location.coords.latitude,
            lon: location.coords.longitude,
          });
        } else {
          // No permission yet, show setup UI
          setNeedsWeatherSetup(true);
          return;
        }
      } else if (settings?.manualCity) {
        weatherData = await weatherClient.getCurrentWeather({
          city: settings.manualCity,
        });
      } else {
        // No location configured, show setup UI
        setNeedsWeatherSetup(true);
        return;
      }

      if (weatherData) {
        await weatherRepo.saveWeather(weatherData);
        setWeather(weatherData);
        setNeedsWeatherSetup(false);
      }
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      // Only show error if we had settings but failed to fetch
      if (settings?.locationMode || settings?.manualCity) {
        Alert.alert('Error', "Can't fetch weather. Using last saved snapshot.");
      } else {
        setNeedsWeatherSetup(true);
      }
    }
  };

  const handleWeatherLoaded = (weatherData: WeatherSnapshot) => {
    setWeather(weatherData);
    setNeedsWeatherSetup(false);
  };

  const handleRecommendOutfit = async () => {
    if (!weather) {
      Alert.alert('Weather needed', 'Please wait for weather data to load');
      return;
    }

    if (items.length === 0) {
      Alert.alert(
        'No items',
        "Let's build your closet. Add your first item to get personalized outfits.",
        [{ text: 'Add Item', onPress: () => router.push('/item/new') }]
      );
      return;
    }

    if (!preferences) {
      Alert.alert('Setup needed', 'Please set your style preferences first');
      return;
    }

    setGeneratingOutfit(true);
    try {
      const outfit = recommendOutfit(items, preferences, weather);
      await outfitsRepo.createOutfit(outfit);

      for (const outfitItem of outfit.items) {
        const item = items.find((i) => i.id === outfitItem.itemId);
        if (item) {
          await useWardrobe
            .getState()
            .updateItem({ ...item, lastWorn: Date.now() });
        }
      }

      setLatestOutfit(outfit);
      router.push(`/outfit/${outfit.id}`);
    } catch (error) {
      console.error('Failed to generate outfit:', error);
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'Could not build a complete outfit'
      );
    } finally {
      setGeneratingOutfit(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  // Dynamic greeting based on weather
  const getWeatherGreeting = () => {
    if (!weather) {
      return {
        greeting: 'Welcome back',
        subtitle: 'Your sustainable wardrobe companion',
      };
    }

    const temp = weather.tempC;
    const condition = weather.condition.toLowerCase();
    const hour = new Date().getHours();

    // Time-based greeting
    let timeGreeting = 'Welcome back';
    if (hour >= 5 && hour < 12) timeGreeting = 'Good morning';
    else if (hour >= 12 && hour < 17) timeGreeting = 'Good afternoon';
    else if (hour >= 17 && hour < 22) timeGreeting = 'Good evening';

    // Weather-based motivational subtitle
    let subtitle = '';

    if (condition.includes('rain') || condition.includes('drizzle')) {
      subtitle = `It's rainy out there! Perfect for cozy layered looks`;
    } else if (condition.includes('snow')) {
      subtitle = `Snowy weather ahead! Time to bundle up in style`;
    } else if (condition.includes('cloud') || condition.includes('overcast')) {
      subtitle = `Cloudy skies today - great for any outfit choice`;
    } else if (condition.includes('sun') || condition.includes('clear')) {
      if (temp > 25) {
        subtitle = `Sunny and warm! Light, breathable fabrics today`;
      } else {
        subtitle = `Beautiful sunny day! Dress comfortably`;
      }
    } else if (condition.includes('wind')) {
      subtitle = `Windy conditions - windproof layers recommended`;
    } else if (condition.includes('fog') || condition.includes('mist')) {
      subtitle = `Misty morning - layer up for changing conditions`;
    } else {
      // Temperature-based fallback
      if (temp < 5) {
        subtitle = `Bundle up warm! It's ${temp}° outside`;
      } else if (temp < 15) {
        subtitle = `Cool weather at ${temp}° - perfect for layering`;
      } else if (temp < 25) {
        subtitle = `Pleasant ${temp}° weather - dress comfortably`;
      } else {
        subtitle = `Warm ${temp}° day - keep it light and breezy`;
      }
    }

    return { greeting: timeGreeting, subtitle };
  };

  const { greeting, subtitle } = getWeatherGreeting();

  // Mock stats for now - these would come from actual data
  const stats = {
    streak: 7,
    styleScore: 92,
    outfitsCreated: items.length > 0 ? Math.min(items.length * 2, 24) : 0,
  };

  // Daily motivations
  const motivations = [
    "You're killing it! 🔥",
    'Style icon in the making! ⭐',
    'Confidence looks good on you! 💫',
    'Ready to slay the day! 👑',
    'Your best look awaits! ✨',
  ];
  const dailyMotivation = motivations[new Date().getDay() % motivations.length];

  return (
    <View style={styles.container}>
      {/* Decorative gradient line at the very top of the screen */}
      <LinearGradient
        colors={[colors.indigo600, colors.sky500, colors.indigo600]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topGradientLine}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: insets.top }]}
      >
        {/* Brand Header with Gradient */}
        <BrandHeader showTagline />

        {/* Weather Greeting Section */}
        {/* <View style={styles.greetingSection}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View> */}

        {/* Daily Motivation Card */}
        {items.length > 0 && (
          <LinearGradient
            colors={[colors.indigo600, colors.sky500]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.motivationCard}
          >
            <View style={styles.motivationIconContainer}>
              <Zap size={24} color={colors.white} fill={colors.white} />
            </View>
            <View style={styles.motivationTextContainer}>
              <Text style={styles.motivationLabel}>Daily Boost</Text>
              <Text style={styles.motivationText}>{dailyMotivation}</Text>
            </View>
          </LinearGradient>
        )}

        {/* Weather Card */}
        {weather ? (
          <View style={styles.weatherContainer}>
            <WeatherBadge weather={weather} />
          </View>
        ) : needsWeatherSetup ? (
          <View style={styles.weatherContainer}>
            <WeatherSetup onWeatherLoaded={handleWeatherLoaded} />
          </View>
        ) : (
          <View style={styles.weatherPlaceholder}>
            <ActivityIndicator size="small" color={theme.accent} />
            <Text style={styles.weatherPlaceholderText}>
              Fetching weather data...
            </Text>
          </View>
        )}

        {/* Generate Outfit CTA - Gradient Card */}
        {items.length > 0 && weather && (
          <LinearGradient
            colors={[colors.indigo600, colors.sky500]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGradientCard}
          >
            <View style={styles.ctaIconContainer}>
              <Sparkles size={32} color={colors.white} fill={colors.white} />
            </View>
            <View style={styles.ctaTextContainer}>
              <Text style={styles.ctaTitle}>Want a fresh look?</Text>
              <Text style={styles.ctaSubtitle}>
                Generate a new outfit based on today's weather and your style!
              </Text>
              <Pressable
                style={styles.ctaButton}
                onPress={handleRecommendOutfit}
                disabled={generatingOutfit}
              >
                {generatingOutfit ? (
                  <ActivityIndicator size="small" color={colors.indigo600} />
                ) : (
                  <>
                    <Sparkles size={16} color={colors.indigo600} />
                    <Text style={styles.ctaButtonText}>Generate Outfit</Text>
                  </>
                )}
              </Pressable>
            </View>
          </LinearGradient>
        )}

        {/* Empty State - Always visible when no items */}
        {(!items || items.length === 0) && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Sparkles
                size={40}
                color={theme.accent_light}
                strokeWidth={1.5}
              />
            </View>
            <Text style={styles.emptyTitle}>Start Your Wardrobe Journey</Text>
            <Text style={styles.emptyText}>
              Add items to your digital closet and discover sustainable outfit
              combinations tailored to your style.
            </Text>
            <Button
              title="Add First Item"
              onPress={() => router.push('/item/new')}
              variant="outline"
              size="lg"
            />
          </View>
        )}

        {/* Today's Perfect Match Section */}
        {latestOutfit && items.length > 0 && (
          <View style={styles.weatherContainer}>
            <View style={styles.dashboardSection}>
              <TodaysPerfectMatch
                outfit={latestOutfit}
                items={items}
                onPress={() => router.push(`/outfit/${latestOutfit.id}`)}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  topGradientLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    zIndex: 1000,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 120, // Account for 80px tab bar + safe area + comfortable spacing
    gap: spacing.xl,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
  },
  dashboardSection: {
    backgroundColor: theme.surface,
    borderRadius: radii.xl,
    borderWidth: 2,
    borderColor: colors.indigo100,
    padding: spacing.xl,
    ...elevation.sm,
  },
  greetingSection: {
    paddingHorizontal: spacing.xl,
    gap: spacing.xs,
  },
  greeting: {
    ...typography.h2,
    color: theme.text_primary,
    fontWeight: '600',
  },
  subtitle: {
    ...typography.bodySmall,
    color: theme.text_tertiary,
  },
  // Stats Row Styles
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  statCard: {
    flex: 1,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.indigo100,
    overflow: 'hidden',
    ...elevation.sm,
  },
  statGradient: {
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    ...typography.h1,
    color: theme.text_primary,
    fontWeight: '600',
  },
  statLabel: {
    ...typography.micro,
    color: theme.text_tertiary,
    textAlign: 'center',
  },
  // Motivation Card Styles
  motivationCard: {
    marginHorizontal: spacing.xl,
    borderRadius: radii.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...elevation.md,
  },
  motivationIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  motivationTextContainer: {
    flex: 1,
  },
  motivationLabel: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.xs,
  },
  motivationText: {
    ...typography.subtitle,
    color: colors.white,
    fontWeight: '600',
  },
  // CTA Gradient Card Styles
  ctaGradientCard: {
    marginHorizontal: spacing.xl,
    borderRadius: radii.lg,
    padding: spacing.xl,
    flexDirection: 'row',
    gap: spacing.lg,
    ...elevation.lg,
  },
  ctaIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: radii.xl,
    padding: spacing.lg,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaTextContainer: {
    flex: 1,
  },
  ctaTitle: {
    ...typography.subtitle,
    color: colors.white,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  ctaSubtitle: {
    ...typography.bodySmall,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.md,
  },
  ctaButton: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start',
    ...elevation.sm,
  },
  ctaButtonText: {
    ...typography.bodySmall,
    color: colors.indigo600,
    fontWeight: '600',
  },
  weatherContainer: {
    paddingHorizontal: spacing.xl,
  },
  weatherPlaceholder: {
    marginHorizontal: spacing.xl,
    backgroundColor: theme.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: theme.border_subtle,
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.md,
  },
  weatherPlaceholderText: {
    ...typography.bodySmall,
    color: theme.text_tertiary,
  },
  ctaSection: {
    gap: spacing.md,
  },
  aiNoteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  aiNoteText: {
    ...typography.caption,
    color: theme.accent,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  emptyState: {
    marginHorizontal: spacing.xl,
    backgroundColor: theme.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: theme.border_subtle,
    padding: spacing.jumbo,
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.xl,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: radii.full,
    backgroundColor: theme.accent_subtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h1,
    color: theme.text_primary,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.body,
    color: theme.text_secondary,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  // Wardrobe Insights Styles
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  insightCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: theme.border_subtle,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    ...elevation.sm,
  },
  insightValue: {
    ...typography.displayMd,
    color: theme.accent,
    fontWeight: '600',
  },
  insightLabel: {
    ...typography.caption,
    color: theme.text_tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Recent Items Styles
  recentItemsScroll: {
    gap: spacing.lg,
    paddingRight: spacing.xl,
  },
  recentItem: {
    width: 120,
    gap: spacing.sm,
  },
  recentItemImage: {
    width: 120,
    height: 160,
    borderRadius: radii.lg,
    backgroundColor: theme.surface_subtle,
    ...elevation.sm,
  },
  recentItemName: {
    ...typography.bodySmall,
    color: theme.text_primary,
    fontWeight: '500',
  },
});
