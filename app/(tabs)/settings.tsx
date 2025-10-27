import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSettings } from '@/state/useSettings';
import { Button } from '@/components/Button';
import * as itemsRepo from '@/lib/db/repo/items';
import * as prefsRepo from '@/lib/db/repo/preferences';
import * as outfitsRepo from '@/lib/db/repo/outfits';

export default function SettingsScreen() {
  const { settings, loading, loadSettings, saveSettings } = useSettings();

  const [useCloudAI, setUseCloudAI] = useState(false);
  const [locationMode, setLocationMode] = useState<'gps' | 'manual'>('gps');
  const [manualCity, setManualCity] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      setUseCloudAI(settings.useCloudAI);
      setLocationMode(settings.locationMode);
      setManualCity(settings.manualCity || '');
    }
  }, [settings]);

  const handleSave = async () => {
    if (locationMode === 'manual' && !manualCity.trim()) {
      Alert.alert('Error', 'Please enter a city name');
      return;
    }

    try {
      await saveSettings({
        useCloudAI,
        locationMode,
        manualCity: locationMode === 'manual' ? manualCity : undefined,
        onboardingCompleted: settings?.onboardingCompleted || false,
      });
      Alert.alert('Success', 'Settings saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const handleExport = async () => {
    try {
      const items = await itemsRepo.getAllItems();
      const preferences = await prefsRepo.getPreferences();
      const outfits = await outfitsRepo.getAllOutfits();

      const data = {
        version: 1,
        exportedAt: Date.now(),
        items,
        preferences,
        outfits,
      };

      const jsonString = JSON.stringify(data, null, 2);
      console.log('Export data:', jsonString);

      Alert.alert(
        'Export Ready',
        `Found ${items.length} items, ${outfits.length} outfits. Data logged to console.`
      );
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export data');
    }
  };

  if (loading && !settings) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Recommendations</Text>
        <View style={styles.setting}>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Use Cloud AI</Text>
            <Text style={styles.settingDescription}>
              Enable cloud-based AI for enhanced recommendations
            </Text>
          </View>
          <Switch
            value={useCloudAI}
            onValueChange={setUseCloudAI}
            trackColor={{ false: '#e5e5e5', true: '#7dd3fc' }}
            thumbColor={useCloudAI ? '#0ea5e9' : '#f5f5f5'}
          />
        </View>
        {useCloudAI && (
          <View style={styles.note}>
            <Text style={styles.noteText}>
              When enabled, your wardrobe photos and metadata may be sent to a
              cloud service for AI analysis.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.setting}>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Use GPS</Text>
            <Text style={styles.settingDescription}>
              Automatically detect your location
            </Text>
          </View>
          <Switch
            value={locationMode === 'gps'}
            onValueChange={(value) =>
              setLocationMode(value ? 'gps' : 'manual')
            }
            trackColor={{ false: '#e5e5e5', true: '#7dd3fc' }}
            thumbColor={locationMode === 'gps' ? '#0ea5e9' : '#f5f5f5'}
          />
        </View>

        {locationMode === 'manual' && (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>City Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter city name"
              value={manualCity}
              onChangeText={setManualCity}
              placeholderTextColor="#a3a3a3"
            />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        <Button
          title="Export Data"
          onPress={handleExport}
          variant="secondary"
        />
        <Text style={styles.settingDescription}>
          Export your wardrobe, preferences, and outfits as JSON
        </Text>
      </View>

      <Button title="Save Settings" onPress={handleSave} size="lg" />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Suit up! v1.0.0</Text>
        <Text style={styles.footerText}>
          All data stored locally on your device
        </Text>
      </View>
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
    gap: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  settingText: {
    flex: 1,
    gap: 4,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#171717',
  },
  settingDescription: {
    fontSize: 14,
    color: '#737373',
  },
  note: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#0ea5e9',
  },
  noteText: {
    fontSize: 14,
    color: '#0369a1',
    lineHeight: 20,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#404040',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#171717',
  },
  footer: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#a3a3a3',
  },
});
