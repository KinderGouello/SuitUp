import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import { MapPin, Navigation } from 'lucide-react-native';
import { Button } from '@/components/Button';
import {
  theme,
  radii,
  typography,
  spacing,
  elevation,
} from '@/lib/styles/tokens';
import { useSettings } from '@/state/useSettings';
import { weatherClient } from '@/lib/weather/client';
import * as weatherRepo from '@/lib/db/repo/weather';
import { WeatherSnapshot } from '@/lib/types';

interface WeatherSetupProps {
  onWeatherLoaded: (weather: WeatherSnapshot) => void;
}

export function WeatherSetup({ onWeatherLoaded }: WeatherSetupProps) {
  const { settings, saveSettings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [manualCity, setManualCity] = useState('');
  const [mode, setMode] = useState<'choice' | 'manual'>('choice');

  const handleUseGPS = async () => {
    setLoading(true);
    try {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to get weather for your current location. You can enable it in your device settings or enter a city manually.'
        );
        setLoading(false);
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({});

      // Fetch weather
      const weatherData = await weatherClient.getCurrentWeather({
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      });

      // Save settings and weather
      await saveSettings({
        ...settings,
        locationMode: 'gps',
        onboardingCompleted: settings?.onboardingCompleted || false,
        useCloudAI: settings?.useCloudAI || false,
      });

      await weatherRepo.saveWeather(weatherData);
      onWeatherLoaded(weatherData);
    } catch (error) {
      console.error('Failed to get GPS location:', error);
      Alert.alert(
        'Location Error',
        'Could not get your current location. Please try again or enter a city manually.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleManualCity = async () => {
    if (!manualCity.trim()) {
      Alert.alert('City Required', 'Please enter a city name');
      return;
    }

    setLoading(true);
    try {
      // Fetch weather for the city
      const weatherData = await weatherClient.getCurrentWeather({
        city: manualCity.trim(),
      });

      // Save settings and weather
      await saveSettings({
        ...settings,
        locationMode: 'manual',
        manualCity: manualCity.trim(),
        onboardingCompleted: settings?.onboardingCompleted || false,
        useCloudAI: settings?.useCloudAI || false,
      });

      await weatherRepo.saveWeather(weatherData);
      onWeatherLoaded(weatherData);
    } catch (error) {
      console.error('Failed to fetch weather for city:', error);
      Alert.alert(
        'City Not Found',
        'Could not find weather data for this city. Please check the spelling and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'manual') {
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <MapPin size={24} color={theme.accent} strokeWidth={1.5} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Enter Your City</Text>
          <Text style={styles.description}>
            We'll get weather data for outfit recommendations
          </Text>

          <TextInput
            style={styles.input}
            placeholder="City name (e.g., San Francisco)"
            value={manualCity}
            onChangeText={setManualCity}
            placeholderTextColor={theme.text_tertiary}
            editable={!loading}
            autoCapitalize="words"
            autoCorrect={false}
          />

          <View style={styles.actions}>
            <Button
              title="Get Weather"
              onPress={handleManualCity}
              loading={loading}
              disabled={!manualCity.trim() || loading}
              fullWidth
            />
            <Button
              title="Back"
              onPress={() => setMode('choice')}
              variant="ghost"
              disabled={loading}
              fullWidth
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Navigation size={24} color={theme.accent} strokeWidth={1.5} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Weather Setup</Text>
        <Text style={styles.description}>
          We need your location to recommend the perfect outfit
        </Text>

        <View style={styles.actions}>
          <Button
            title="Use My Location"
            onPress={handleUseGPS}
            loading={loading}
            disabled={loading}
            fullWidth
            icon={
              <Navigation size={18} color={theme.background} strokeWidth={2} />
            }
          />
          <Button
            title="Enter City Manually"
            onPress={() => setMode('manual')}
            variant="outline"
            disabled={loading}
            fullWidth
          />
        </View>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.accent} />
          <Text style={styles.loadingText}>Getting weather data...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: theme.border_subtle,
    padding: spacing.xl,
    gap: spacing.lg,
    ...elevation.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radii.full,
    backgroundColor: theme.accent_subtle,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  content: {
    gap: spacing.md,
  },
  title: {
    ...typography.subtitle,
    color: theme.text_primary,
    textAlign: 'center',
    fontWeight: '600',
  },
  description: {
    ...typography.bodySmall,
    color: theme.text_secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  input: {
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: radii.lg,
    padding: spacing.lg,
    ...typography.body,
    color: theme.text_primary,
  },
  actions: {
    gap: spacing.sm,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: radii.xl,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    ...typography.body,
    color: theme.text_secondary,
  },
});
