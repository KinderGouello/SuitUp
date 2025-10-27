import { View, Text, StyleSheet } from 'react-native';
import { WeatherSnapshot } from '@/lib/types';
import { Cloud, CloudRain, Sun } from 'lucide-react-native';
import { theme, radii, typography, spacing, elevation } from '@/lib/styles/tokens';

interface WeatherBadgeProps {
  weather: WeatherSnapshot;
  compact?: boolean;
}

export function WeatherBadge({ weather, compact = false }: WeatherBadgeProps) {
  const getWeatherIcon = () => {
    if (weather.precipMm > 0) return <CloudRain size={16} color={theme.text_secondary} strokeWidth={2} />;
    if (weather.condition.includes('Cloud')) return <Cloud size={16} color={theme.text_secondary} strokeWidth={2} />;
    return <Sun size={16} color={theme.text_secondary} strokeWidth={2} />;
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        {getWeatherIcon()}
        <Text style={styles.compactText}>{weather.tempC}°</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconRow}>
          {getWeatherIcon()}
          <Text style={styles.city}>{weather.city || 'Current location'}</Text>
        </View>
        <Text style={styles.condition}>{weather.condition}</Text>
      </View>

      <View style={styles.tempRow}>
        <Text style={styles.tempMain}>{weather.tempC}°</Text>
        <Text style={styles.tempRange}>
          {weather.tempMinC}° / {weather.tempMaxC}°
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: theme.border_subtle,
    padding: spacing.lg,
    ...elevation.sm,
    gap: spacing.md,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface_alt,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  compactText: {
    ...typography.caption,
    color: theme.text_secondary,
  },
  header: {
    gap: spacing.xs,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  city: {
    ...typography.body,
    fontWeight: '600',
    color: theme.text_primary,
  },
  condition: {
    ...typography.caption,
    color: theme.text_secondary,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.md,
  },
  tempMain: {
    ...typography.displayLg,
    color: theme.text_primary,
  },
  tempRange: {
    ...typography.bodyMuted,
    color: theme.text_secondary,
  },
});
