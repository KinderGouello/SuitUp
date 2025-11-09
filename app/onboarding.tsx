import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { useSettings } from '@/state/useSettings';
import * as Location from 'expo-location';

export default function OnboardingScreen() {
  const router = useRouter();
  const { saveSettings } = useSettings();

  const [useGPS, setUseGPS] = useState(true);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (!useGPS && !city.trim()) {
      Alert.alert('City required', 'Please enter a city name');
      return;
    }

    setLoading(true);

    try {
      if (useGPS) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission needed',
            'Location permission is required for weather-based recommendations'
          );
          setLoading(false);
          return;
        }
      }

      await saveSettings({
        useCloudAI: false,
        locationMode: useGPS ? 'gps' : 'manual',
        manualCity: useGPS ? undefined : city.trim(),
        onboardingCompleted: true,
      });

      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Suit up!</Text>
        <Text style={styles.subtitle}>
          Get personalized outfit recommendations based on weather and your
          style
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.description}>
            We need your location to provide weather-based outfit
            recommendations
          </Text>

          <View style={styles.options}>
            <Button
              title="Use GPS"
              onPress={() => setUseGPS(true)}
              variant={useGPS ? 'primary' : 'secondary'}
            />
            <Button
              title="Enter City"
              onPress={() => setUseGPS(false)}
              variant={!useGPS ? 'primary' : 'secondary'}
            />
          </View>

          {!useGPS && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your city"
                value={city}
                onChangeText={setCity}
                placeholderTextColor="#a3a3a3"
              />
            </View>
          )}
        </View>

        <View style={styles.privacy}>
          <Text style={styles.privacyTitle}>Privacy First</Text>
          <Text style={styles.privacyText}>
            All your data is stored locally on your device. Weather data and
            outfit recommendations work offline using cached information.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Get Started"
          onPress={handleComplete}
          size="lg"
          loading={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#171717',
  },
  subtitle: {
    fontSize: 18,
    color: '#737373',
    lineHeight: 26,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#171717',
  },
  description: {
    fontSize: 16,
    color: '#737373',
    lineHeight: 24,
  },
  options: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    marginTop: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#171717',
  },
  privacy: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 20,
    gap: 8,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0369a1',
  },
  privacyText: {
    fontSize: 14,
    color: '#0369a1',
    lineHeight: 20,
  },
  footer: {
    padding: 32,
    paddingTop: 0,
  },
});
