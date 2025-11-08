import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Pressable,
  Modal,
} from 'react-native';
import { usePreferences } from '@/state/usePreferences';
import { Button } from '@/components/Button';
import TextInput from '@/components/TextInput';
import Toggle from '@/components/Toggle';
import { StylePreference, ColorPalette } from '@/lib/types';
import { ChevronDown, User, Crown, MapPin, Save, Palette, Sparkles, Bell, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
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

  // Profile Information
  // const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [emailError, setEmailError] = useState('');

  // Style Preferences
  const [stylePreference, setStylePreference] =
    useState<StylePreference>('casual');
  const [colorPalette, setColorPalette] = useState<ColorPalette>('neutral');
  const [formalityLevel, setFormalityLevel] = useState(3);
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [showColorPaletteModal, setShowColorPaletteModal] = useState(false);

  // Outfit Suggestions
  const [dailySuggestion, setDailySuggestion] = useState(true);
  const [weatherBased, setWeatherBased] = useState(true);
  // const [occasionBased, setOccasionBased] = useState(false);

  // Notifications
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [outfitReminder, setOutfitReminder] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  useEffect(() => {
    if (preferences) {
      // setName(preferences.name);
      // setEmail(preferences.email);
      setLocation(preferences.location);
      setStylePreference(preferences.stylePreference);
      setColorPalette(preferences.colorPalette || 'neutral');
      setFormalityLevel(preferences.formalityLevel || 3);
      setDailySuggestion(preferences.dailySuggestion);
      setWeatherBased(preferences.weatherBased);
      // setOccasionBased(preferences.occasionBased);
      setEnableNotifications(preferences.enableNotifications);
      // setOutfitReminder(preferences.outfitReminder);
      // setWeatherAlerts(preferences.weatherAlerts);
    }
  }, [preferences]);

  // const validateEmail = (email: string): boolean => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(email);
  // };

  // const handleEmailChange = (value: string) => {
  //   setEmail(value);
  //   if (value && !validateEmail(value)) {
  //     setEmailError('Please enter a valid email address');
  //   } else {
  //     setEmailError('');
  //   }
  // };

  const handleSave = async () => {
    // Validate email if provided
    // if (email && !validateEmail(email)) {
    //   Alert.alert('Error', 'Please enter a valid email address');
    //   return;
    // }

    try {
      await savePreferences({
        // name,
        // email,
        location,
        stylePreference,
        colorPalette,
        formalityLevel,
        units: preferences?.units || 'metric',
        dailySuggestion,
        weatherBased,
        // occasionBased,
        enableNotifications,
        // outfitReminder,
        // weatherAlerts,
      });
      Alert.alert('Success', 'Preferences saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save preferences');
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
    { value: 'minimalist', label: '⚪ Minimalist' },
    { value: 'casual', label: '🎯 Casual' },
    { value: 'formal', label: '💼 Business' },
    { value: 'sporty', label: '⚡ Sporty' },
    { value: 'street', label: '🔥 Streetwear' },
    { value: 'chic', label: '✨ Elegant' },
    { value: 'edgy', label: '🖤 Edgy' },
    { value: 'boho', label: '🌸 Boho' },
  ];

  const colorPaletteOptions: { value: ColorPalette; label: string }[] = [
    { value: 'neutral', label: '⚪ Neutral Tones' },
    { value: 'bold', label: '🌈 Bold Colors' },
    { value: 'pastel', label: '🎨 Pastel Colors' },
    { value: 'monochrome', label: '⬛ Monochrome' },
    { value: 'earth', label: '🌿 Earth Tones' },
  ];

  const selectedStyle = styleOptions.find((s) => s.value === stylePreference);
  const selectedColorPalette = colorPaletteOptions.find((c) => c.value === colorPalette);

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
              <Text style={styles.profileSubtitle}>
                Customize your preferences
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Profile Information Section */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <User size={20} color={colors.indigo600} strokeWidth={2} />
          <Text style={styles.sectionTitle}>Profile Information</Text>
        </View>
        <Text style={styles.sectionDescription}>
          Update your personal details
        </Text>
        <View style={styles.sectionContent}>
          {/* <TextInput
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
          /> */}
          <TextInput
            placeholder="Enter your location"
            value={location}
            onChangeText={setLocation}
            icon={MapPin}
            iconColor={colors.gray}
          />
        </View>
      </View>

      {/* Style Preferences Section */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Palette size={20} color={colors.indigo600} strokeWidth={2} />
          <Text style={styles.sectionTitle}>Style Preferences</Text>
        </View>
        <Text style={styles.sectionDescription}>
          Customize your outfit recommendations
        </Text>
        <View style={styles.sectionContent}>
          {/* Style Preference */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Style Preference</Text>
            <Pressable
              style={styles.selectTrigger}
              onPress={() => setShowStyleModal(true)}
              accessibilityRole="button"
              accessibilityLabel="Select style preference"
            >
              <Text style={styles.selectTriggerText}>
                {selectedStyle?.label || 'Select style'}
              </Text>
              <ChevronDown
                size={20}
                color={theme.text_secondary}
                strokeWidth={2}
              />
            </Pressable>
          </View>

          {/* Color Palette */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Color Palette</Text>
            <Pressable
              style={styles.selectTrigger}
              onPress={() => setShowColorPaletteModal(true)}
              accessibilityRole="button"
              accessibilityLabel="Select color palette"
            >
              <Text style={styles.selectTriggerText}>
                {selectedColorPalette?.label || 'Select palette'}
              </Text>
              <ChevronDown
                size={20}
                color={theme.text_secondary}
                strokeWidth={2}
              />
            </Pressable>
          </View>

          {/* Formality Level */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Formality Level</Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Casual</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={5}
                step={1}
                value={formalityLevel}
                onValueChange={setFormalityLevel}
                minimumTrackTintColor={colors.indigo600}
                maximumTrackTintColor={colors.indigo200}
                thumbTintColor={colors.indigo600}
              />
              <Text style={styles.sliderLabel}>Formal</Text>
            </View>
            <View style={styles.formalityBadgeContainer}>
              <View style={styles.formalityBadge}>
                <Text style={styles.formalityBadgeText}>
                  Level {formalityLevel} of 5
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Outfit Suggestions Section */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Sparkles size={20} color={colors.indigo600} strokeWidth={2} />
          <Text style={styles.sectionTitle}>Outfit Suggestions</Text>
        </View>
        <Text style={styles.sectionDescription}>
          Customize your daily recommendations
        </Text>
        <View style={styles.sectionContent}>
          <Toggle
            label="Daily Suggestion"
            description="Get a fresh outfit recommendation every morning"
            value={dailySuggestion}
            onValueChange={setDailySuggestion}
          />
          <Toggle
            label="Weather-Based"
            description="Match your outfits to the current weather"
            value={weatherBased}
            onValueChange={setWeatherBased}
          />
          {/* <Toggle
            label="Occasion-Based"
            description="Consider your calendar events for outfit selection"
            value={occasionBased}
            onValueChange={setOccasionBased}
          /> */}
        </View>
      </View>

      {/* Notifications Section */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Bell size={20} color={colors.indigo600} strokeWidth={2} />
          <Text style={styles.sectionTitle}>Notifications</Text>
        </View>
        <Text style={styles.sectionDescription}>
          Manage your notification preferences
        </Text>
        <View style={styles.sectionContent}>
          <Toggle
            label="Enable Notifications"
            description="Receive app notifications"
            value={enableNotifications}
            onValueChange={(value) => {
              setEnableNotifications(value);
              // Disable child toggles if master is disabled
              if (!value) {
                setOutfitReminder(false);
                setWeatherAlerts(false);
              }
            }}
          />
          {/* <Toggle
            label="Outfit Reminder"
            description="Get notified about your daily outfit"
            value={outfitReminder}
            onValueChange={setOutfitReminder}
            disabled={!enableNotifications}
          />
          <Toggle
            label="Weather Alerts"
            description="Receive alerts when weather changes"
            value={weatherAlerts}
            onValueChange={setWeatherAlerts}
            disabled={!enableNotifications}
          /> */}
        </View>
      </View>

      {/* Save Button */}
      <View style={styles.actions}>
        <Button
          title="Save Preferences"
          onPress={handleSave}
          size="lg"
          variant="gradient"
          fullWidth
          icon={<Save size={16} color={colors.white} />}
        />
      </View>

      {/* Style Preference Modal */}
      <Modal
        visible={showStyleModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStyleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowStyleModal(false)}
            accessibilityLabel="Dismiss style preference menu"
          />
          <View style={styles.modalCard}>
            {styleOptions.map((option) => {
              const isActive = option.value === stylePreference;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    setStylePreference(option.value);
                    setShowStyleModal(false);
                  }}
                  style={[
                    styles.modalOption,
                    isActive && styles.modalOptionActive,
                  ]}
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected: isActive }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      isActive && styles.modalOptionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {isActive && (
                    <Check
                      size={16}
                      color={colors.indigo600}
                      strokeWidth={2.5}
                      style={styles.modalOptionIcon}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>

      {/* Color Palette Modal */}
      <Modal
        visible={showColorPaletteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowColorPaletteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowColorPaletteModal(false)}
            accessibilityLabel="Dismiss color palette menu"
          />
          <View style={styles.modalCard}>
            {colorPaletteOptions.map((option) => {
              const isActive = option.value === colorPalette;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    setColorPalette(option.value);
                    setShowColorPaletteModal(false);
                  }}
                  style={[
                    styles.modalOption,
                    isActive && styles.modalOptionActive,
                  ]}
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected: isActive }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      isActive && styles.modalOptionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {isActive && (
                    <Check
                      size={16}
                      color={colors.indigo600}
                      strokeWidth={2.5}
                      style={styles.modalOptionIcon}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    padding: spacing.xl, // 24px all around per Figma spec
    paddingBottom: 120, // Account for tab bar
    gap: spacing.xxl, // 32px gap between sections per Figma spec
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Profile Card Styles
  profileCardContainer: {
    marginBottom: 0, // Gap handled by parent
  },
  profileGradient: {
    borderRadius: radii.lg, // 16px per Figma spec
    padding: spacing.xl, // 24px per Figma spec
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
    width: 72, // 72x72px per Figma spec
    height: 72,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3, // 3px white border per Figma spec
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
    fontSize: 24, // 24px per Figma spec
    lineHeight: 32,
    fontWeight: '600',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  profileSubtitle: {
    fontSize: 14, // 14px per Figma spec
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.9)', // 90% opacity per Figma spec
  },
  // Section Card Styles (Figma spec)
  sectionCard: {
    backgroundColor: colors.white,
    borderWidth: 2, // 2px border per Figma spec
    borderColor: colors.indigo100, // Indigo-100 per Figma spec
    borderRadius: radii.lg, // 16px per Figma spec
    padding: spacing.lg, // 16px per Figma spec
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm, // 8px gap per Figma spec (gap-2)
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: 16, // 16px per Figma spec
    lineHeight: 24,
    fontWeight: '500',
    color: theme.text_primary,
  },
  sectionDescription: {
    fontSize: 13, // 13px per Figma spec
    lineHeight: 18,
    color: colors.gray, // Gray-600 per Figma spec
    marginBottom: spacing.md,
  },
  sectionContent: {
    gap: spacing.lg, // 16px gap between fields
  },
  // Field Styles
  fieldContainer: {
    gap: spacing.sm, // 8px gap between label and input
  },
  fieldLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: theme.text_primary,
  },
  selectTrigger: {
    backgroundColor: colors.white,
    borderRadius: radii.md, // 12px per Figma spec
    borderWidth: 1.5,
    borderColor: colors.indigo200,
    padding: spacing.lg, // 16px per Figma spec
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
  },
  selectTriggerText: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    color: theme.text_primary,
    flex: 1,
  },
  // Slider Styles
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md, // 12px gap
    marginTop: spacing.sm,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderLabel: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.text_secondary,
    width: 50,
  },
  formalityBadgeContainer: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  formalityBadge: {
    backgroundColor: colors.indigo50,
    borderWidth: 1,
    borderColor: colors.indigo200,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  formalityBadgeText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: colors.indigo600,
  },
  // Modal Styles (based on wardrobe filter pattern)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 11, 28, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: theme.surface,
    borderRadius: radii.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.indigo100,
    gap: spacing.xs,
    ...elevation.lg,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  modalOptionActive: {
    backgroundColor: colors.indigo50,
  },
  modalOptionText: {
    ...typography.body,
    color: theme.text_secondary,
    flex: 1,
  },
  modalOptionTextActive: {
    color: colors.indigo600,
    fontWeight: '600',
  },
  modalOptionIcon: {
    marginLeft: spacing.sm,
  },
  // Actions
  actions: {
    gap: spacing.base,
    paddingTop: 0, // Gap handled by parent
  },
});
