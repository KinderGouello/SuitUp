import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Pressable,
} from 'react-native';
import { usePreferences } from '@/state/usePreferences';
import { Button } from '@/components/Button';
import { Preferences, StylePreference, Fit, DressCode } from '@/lib/types';
import { ChevronDown, User, Crown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  theme,
  spacing,
  radii,
  typography,
  elevation,
  colors,
} from '@/lib/styles/tokens';

export default function PreferencesScreen() {
  const { preferences, loading, loadPreferences, savePreferences } =
    usePreferences();

  const [stylePreference, setStylePreference] =
    useState<StylePreference>('casual');
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const [fit, setFit] = useState<Fit>('regular');
  const [showFitDropdown, setShowFitDropdown] = useState(false);
  const [dressCodes, setDressCodes] = useState<DressCode[]>([
    'smart_casual',
    'weekend',
  ]);

  useEffect(() => {
    loadPreferences();
  }, []);

  useEffect(() => {
    if (preferences) {
      setStylePreference(preferences.stylePreference);
      setFit(preferences.fit);
      setDressCodes(preferences.dressCodes);
    }
  }, [preferences]);

  const handleSave = async () => {
    try {
      await savePreferences({
        stylePreference,
        fit,
        dressCodes,
        avoidTags: preferences?.avoidTags,
        units: preferences?.units || 'metric',
      });
      Alert.alert('Success', 'Preferences saved');
    } catch (error) {
      Alert.alert('Error', 'Failed to save preferences');
    }
  };

  const toggleDressCode = (code: DressCode) => {
    if (dressCodes.includes(code)) {
      setDressCodes(dressCodes.filter((c) => c !== code));
    } else {
      setDressCodes([...dressCodes, code]);
    }
  };

  if (loading && !preferences) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  const styleOptions: { value: StylePreference; label: string }[] = [
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'casual', label: 'Casual' },
    { value: 'formal', label: 'Formal' },
    { value: 'sporty', label: 'Sporty' },
    { value: 'street', label: 'Street' },
    { value: 'chic', label: 'Chic' },
    { value: 'edgy', label: 'Edgy' },
    { value: 'boho', label: 'Boho' },
  ];

  const fitOptions: { value: Fit; label: string }[] = [
    { value: 'regular', label: 'Regular' },
    { value: 'oversized', label: 'Oversized' },
    { value: 'slim', label: 'Slim' },
  ];

  const selectedStyle = styleOptions.find((s) => s.value === stylePreference);
  const selectedFit = fitOptions.find((f) => f.value === fit);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header Card with Gradient */}
      <View style={styles.profileCardContainer}>
        <LinearGradient
          colors={[colors.indigo600, colors.sky500]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileGradient}
        >
          <View style={styles.profileContent}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <User size={32} color={colors.white} strokeWidth={2} />
              </View>
              <View style={styles.crownBadge}>
                <Crown size={16} color={colors.white} fill={colors.white} />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Style Profile</Text>
              <Text style={styles.profileSubtitle}>Customize your preferences</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Style Preference</Text>
        <Text style={styles.sectionDescription}>
          Choose your primary style aesthetic
        </Text>
        <Pressable
          style={styles.dropdown}
          onPress={() => setShowStyleDropdown(!showStyleDropdown)}
        >
          <Text style={styles.dropdownText}>{selectedStyle?.label}</Text>
          <ChevronDown size={20} color={theme.text_secondary} strokeWidth={2} />
        </Pressable>

        {showStyleDropdown && (
          <View style={styles.dropdownMenu}>
            {styleOptions.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.dropdownItem,
                  stylePreference === option.value &&
                    styles.dropdownItemSelected,
                ]}
                onPress={() => {
                  setStylePreference(option.value);
                  setShowStyleDropdown(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    stylePreference === option.value &&
                      styles.dropdownItemTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fit Preference</Text>
        <Text style={styles.sectionDescription}>
          How do you prefer your clothes to fit?
        </Text>
        <Pressable
          style={styles.dropdown}
          onPress={() => setShowFitDropdown(!showFitDropdown)}
        >
          <Text style={styles.dropdownText}>{selectedFit?.label}</Text>
          <ChevronDown size={20} color={theme.text_secondary} strokeWidth={2} />
        </Pressable>

        {showFitDropdown && (
          <View style={styles.dropdownMenu}>
            {fitOptions.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.dropdownItem,
                  fit === option.value && styles.dropdownItemSelected,
                ]}
                onPress={() => {
                  setFit(option.value);
                  setShowFitDropdown(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    fit === option.value && styles.dropdownItemTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dress Codes</Text>
        <Text style={styles.sectionDescription}>
          Select the occasions you dress for (can choose multiple)
        </Text>
        <View style={styles.chipGroup}>
          {(
            [
              { value: 'office', label: 'Office' },
              { value: 'business_formal', label: 'Business Formal' },
              { value: 'smart_casual', label: 'Smart Casual' },
              { value: 'weekend', label: 'Weekend' },
              { value: 'workout', label: 'Workout' },
            ] as { value: DressCode; label: string }[]
          ).map((code) => (
            <Button
              key={code.value}
              title={code.label}
              onPress={() => toggleDressCode(code.value)}
              variant={
                dressCodes.includes(code.value) ? 'primary' : 'secondary'
              }
              size="sm"
            />
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          title="Save Preferences"
          onPress={handleSave}
          size="lg"
          variant="gradient"
          fullWidth
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    padding: spacing.large,
    gap: spacing.xlarge,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Profile Card Styles
  profileCardContainer: {
    marginBottom: spacing.md,
  },
  profileGradient: {
    borderRadius: radii.lg,
    padding: spacing.xl,
    ...elevation.md,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  crownBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: colors.indigo600,
    borderRadius: radii.full,
    padding: spacing.xs,
    borderWidth: 2,
    borderColor: colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...typography.h1,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  profileSubtitle: {
    ...typography.bodySmall,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    gap: spacing.small,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: theme.text_primary,
  },
  sectionDescription: {
    ...typography.caption,
    color: theme.text_secondary,
  },
  dropdown: {
    backgroundColor: theme.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: theme.border_subtle,
    padding: spacing.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    ...typography.body,
    color: theme.text_primary,
  },
  dropdownMenu: {
    backgroundColor: theme.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: theme.border_subtle,
    marginTop: spacing.micro,
    overflow: 'hidden',
    ...elevation.md,
  },
  dropdownItem: {
    padding: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.border_subtle,
  },
  dropdownItemSelected: {
    backgroundColor: theme.background,
  },
  dropdownItemText: {
    ...typography.body,
    color: theme.text_primary,
  },
  dropdownItemTextSelected: {
    fontWeight: '600',
    color: theme.accent,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.small,
  },
  actions: {
    gap: spacing.base,
    paddingTop: spacing.medium,
  },
});
