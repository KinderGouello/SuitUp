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
import TextInput from '@/components/TextInput';
import Toggle from '@/components/Toggle';
import { GradientCard } from '@/components/GradientCard';
import { SectionCard } from '@/components/SectionCard';
import { SelectModal } from '@/components/SelectModal';
import { StylePreference, ColorPalette } from '@/lib/types';
import {
  ChevronDown,
  User,
  Crown,
  MapPin,
  Save,
  Palette,
  Sparkles,
  Bell,
} from 'lucide-react-native';
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
  const selectedColorPalette = colorPaletteOptions.find(
    (c) => c.value === colorPalette
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header Card with Gradient */}
      <View style={styles.profileCardContainer}>
        <GradientCard
          variant="horizontal"
          icon={
            <View style={styles.avatar}>
              <User size={32} color={colors.white} strokeWidth={2} />
            </View>
          }
          badge={
            <View
              style={{
                width: 20,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Crown size={16} color={colors.white} fill={colors.white} />
            </View>
          }
          title="Style Profile"
          subtitle="Customize your preferences"
          titleStyle={{
            ...typography.h2,
            color: colors.white,
            fontWeight: '600',
          }}
          subtitleStyle={{
            ...typography.bodySmall,
            color: 'rgba(255, 255, 255, 0.9)',
          }}
          iconContainerStyle={{ width: 72, height: 72, borderRadius: radii.xl }}
        />
      </View>

      {/* Profile Information Section */}
      <SectionCard
        title="Profile Information"
        description="Update your personal details"
        icon={<User size={20} color={colors.indigo600} strokeWidth={2} />}
      >
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
      </SectionCard>

      {/* Style Preferences Section */}
      <SectionCard
        title="Style Preferences"
        description="Customize your outfit recommendations"
        icon={<Palette size={20} color={colors.indigo600} strokeWidth={2} />}
      >
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
      </SectionCard>

      {/* Outfit Suggestions Section */}
      <SectionCard
        title="Outfit Suggestions"
        description="Customize your daily recommendations"
        icon={<Sparkles size={20} color={colors.indigo600} strokeWidth={2} />}
      >
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
      </SectionCard>

      {/* Notifications Section */}
      <SectionCard
        title="Notifications"
        description="Manage your notification preferences"
        icon={<Bell size={20} color={colors.indigo600} strokeWidth={2} />}
      >
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
      </SectionCard>

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
      <SelectModal
        visible={showStyleModal}
        onClose={() => setShowStyleModal(false)}
        options={styleOptions}
        selectedValue={stylePreference}
        onSelect={setStylePreference}
      />

      {/* Color Palette Modal */}
      <SelectModal
        visible={showColorPaletteModal}
        onClose={() => setShowColorPaletteModal(false)}
        options={colorPaletteOptions}
        selectedValue={colorPalette}
        onSelect={setColorPalette}
      />
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
  // Actions
  actions: {
    gap: spacing.base,
    paddingTop: 0, // Gap handled by parent
  },
});
