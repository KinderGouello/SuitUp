import { View, Text, StyleSheet } from 'react-native';
import { WeatherSnapshot } from '@/lib/types';
import { Cloud, CloudRain, Sun, Thermometer, Wind } from 'lucide-react-native';
import {
  theme,
  radii,
  typography,
  spacing,
  elevation,
  colors,
} from '@/lib/styles/tokens';

interface WeatherBadgeProps {
  weather: WeatherSnapshot;
  compact?: boolean;
}

export function WeatherBadge({ weather, compact = false }: WeatherBadgeProps) {
  const getWeatherIcon = () => {
    const iconSize = compact ? 18 : 48;
    const iconColor = colors.sky600;
    const strokeWidth = compact ? 1.5 : 2;

    if (weather.precipMm > 0)
      return (
        <CloudRain
          size={iconSize}
          color={iconColor}
          strokeWidth={strokeWidth}
        />
      );
    if (weather.condition.includes('Cloud'))
      return (
        <Cloud size={iconSize} color={iconColor} strokeWidth={strokeWidth} />
      );
    return <Sun size={iconSize} color={iconColor} strokeWidth={strokeWidth} />;
  };

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
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
      {/* Header with Location and Icon */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.location}>
            {weather.city || 'Current Location'}
          </Text>
          <Text style={styles.date}>{formatDate()}</Text>
        </View>
        <View style={styles.iconContainer}>{getWeatherIcon()}</View>
      </View>

      {/* Temperature and Condition */}
      <View style={styles.tempRow}>
        <Text style={styles.tempMain}>{weather.tempC}°</Text>
        <Text style={styles.condition}>{weather.condition}</Text>
      </View>

      {/* Weather Details */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Thermometer size={16} color={theme.text_tertiary} strokeWidth={2} />
          <Text style={styles.detailText}>{weather.humidity || 65}%</Text>
        </View>
        <View style={styles.detailItem}>
          <Wind size={16} color={theme.text_tertiary} strokeWidth={2} />
          <Text style={styles.detailText}>{weather.windKph || 0} mph</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.surface,
    borderRadius: radii.xl,
    borderWidth: 2,
    borderColor: colors.indigo100,
    padding: spacing.xl,
    ...elevation.sm,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.indigo50,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  compactText: {
    ...typography.caption,
    color: theme.accent,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  headerLeft: {
    flex: 1,
    gap: spacing.xs,
  },
  location: {
    ...typography.h2,
    color: theme.text_primary,
    fontWeight: '600',
  },
  date: {
    ...typography.caption,
    color: theme.text_tertiary,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  tempMain: {
    fontSize: 60,
    lineHeight: 64,
    fontWeight: '300',
    color: theme.text_primary,
  },
  condition: {
    ...typography.h2,
    color: theme.text_tertiary,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailText: {
    ...typography.bodySmall,
    color: theme.text_tertiary,
  },
});
