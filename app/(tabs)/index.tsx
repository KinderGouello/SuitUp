import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { Button } from '@/components/Button';
import { WeatherBadge } from '@/components/WeatherBadge';
import { OutfitCard } from '@/components/OutfitCard';
import { weatherClient } from '@/lib/weather/client';
import { recommendOutfit } from '@/lib/ai/heuristics';
import { useWardrobe } from '@/state/useWardrobe';
import { usePreferences } from '@/state/usePreferences';
import { useSettings } from '@/state/useSettings';
import * as weatherRepo from '@/lib/db/repo/weather';
import * as outfitsRepo from '@/lib/db/repo/outfits';
import { WeatherSnapshot, Outfit } from '@/lib/types';
import { Sparkles } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { items, loadItems } = useWardrobe();
  const { preferences, loadPreferences } = usePreferences();
  const { settings, loadSettings } = useSettings();

  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [latestOutfit, setLatestOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatingOutfit, setGeneratingOutfit] = useState(false);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadItems(), loadPreferences(), loadSettings()]);

      const cachedWeather = await weatherRepo.getWeather();
      if (cachedWeather) {
        setWeather(cachedWeather);
      } else {
        await fetchWeather();
      }

      const outfit = await outfitsRepo.getLatestOutfit();
      setLatestOutfit(outfit);
    } catch (error) {
      console.error('Failed to initialize:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async () => {
    try {
      let weatherData: WeatherSnapshot;

      if (settings?.locationMode === 'gps') {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          Alert.alert(
            'Permission needed',
            'Location permission is required for weather updates.'
          );
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        weatherData = await weatherClient.getCurrentWeather({
          lat: location.coords.latitude,
          lon: location.coords.longitude,
        });
      } else if (settings?.manualCity) {
        weatherData = await weatherClient.getCurrentWeather({
          city: settings.manualCity,
        });
      } else {
        Alert.alert('Setup needed', 'Please set your location in Settings');
        return;
      }

      await weatherRepo.saveWeather(weatherData);
      setWeather(weatherData);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      Alert.alert('Error', "Can't fetch weather. Using last saved snapshot.");
    }
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
        error instanceof Error ? error.message : 'Could not build a complete outfit'
      );
    } finally {
      setGeneratingOutfit(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {weather ? (
        <WeatherBadge weather={weather} />
      ) : (
        <View style={styles.noWeather}>
          <Text style={styles.noWeatherText}>
            Loading weather...
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Button
          title="Recommend Today's Outfit"
          onPress={handleRecommendOutfit}
          size="lg"
          disabled={!weather || items.length === 0}
          loading={generatingOutfit}
        />
        {settings?.useCloudAI && (
          <Text style={styles.aiNote}>Cloud AI enabled</Text>
        )}
      </View>

      {latestOutfit && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest Outfit</Text>
          <OutfitCard
            outfit={latestOutfit}
            items={items}
            onPress={() => router.push(`/outfit/${latestOutfit.id}`)}
          />
        </View>
      )}

      {items.length === 0 && (
        <View style={styles.emptyState}>
          <Sparkles size={48} color="#d4d4d4" />
          <Text style={styles.emptyTitle}>Let's build your closet</Text>
          <Text style={styles.emptyText}>
            Add your first item to get personalized outfits.
          </Text>
          <Button
            title="Add Item"
            onPress={() => router.push('/item/new')}
            variant="secondary"
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
    gap: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noWeather: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  noWeatherText: {
    fontSize: 16,
    color: '#737373',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#171717',
  },
  aiNote: {
    fontSize: 12,
    color: '#737373',
    textAlign: 'center',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#171717',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#737373',
    textAlign: 'center',
    marginBottom: 8,
  },
});
