import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { colors, spacing, typography } from '@/lib/styles/tokens';

export interface LoadingStateProps {
  /**
   * Optional loading message
   */
  message?: string;

  /**
   * Color of the activity indicator
   * @default colors.indigo600
   */
  color?: string;

  /**
   * Size of the activity indicator
   * @default 'large'
   */
  size?: 'small' | 'large';

  /**
   * Custom container style
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * LoadingState - Reusable loading state component
 *
 * A centered loading spinner with optional message.
 * Used throughout the app for async operations and data fetching.
 *
 * @example
 * // Basic loading state
 * <LoadingState />
 *
 * @example
 * // With message
 * <LoadingState message="Loading your wardrobe..." />
 *
 * @example
 * // Custom color and size
 * <LoadingState
 *   color={colors.sky500}
 *   size="small"
 *   message="Please wait"
 * />
 */
export function LoadingState({
  message,
  color = colors.indigo600,
  size = 'large',
  style,
}: LoadingStateProps) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
    gap: spacing.md,
  },
  message: {
    ...typography.body,
    color: colors.gray,
    textAlign: 'center',
  },
});
