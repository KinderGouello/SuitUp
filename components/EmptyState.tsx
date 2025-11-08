import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Button } from './Button';
import { colors, spacing, typography, radii } from '@/lib/styles/tokens';

export interface EmptyStateProps {
  /**
   * Optional icon to display above title
   */
  icon?: ReactNode;

  /**
   * Main heading text
   */
  title: string;

  /**
   * Optional description text below title
   */
  description?: string;

  /**
   * Optional CTA button text
   */
  ctaText?: string;

  /**
   * Optional CTA button press handler
   */
  onCtaPress?: () => void;

  /**
   * CTA button variant
   * @default 'primary'
   */
  ctaVariant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';

  /**
   * Custom container style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Custom title text style
   */
  titleStyle?: StyleProp<TextStyle>;

  /**
   * Custom description text style
   */
  descriptionStyle?: StyleProp<TextStyle>;
}

/**
 * EmptyState - Reusable empty state component
 *
 * A centered placeholder component for displaying when there's no content to show.
 * Includes optional icon, title, description, and CTA button.
 *
 * @example
 * // Basic empty state
 * <EmptyState
 *   title="No items yet"
 *   description="Add your first item to start building your wardrobe."
 *   ctaText="Add Item"
 *   onCtaPress={() => router.push('/item/new')}
 * />
 *
 * @example
 * // With icon
 * <EmptyState
 *   icon={<ShoppingBag size={48} color={colors.indigo300} />}
 *   title="Your wardrobe is empty"
 *   description="Start adding items to create your digital closet."
 *   ctaText="Get Started"
 *   onCtaPress={handleGetStarted}
 * />
 *
 * @example
 * // No CTA (informational only)
 * <EmptyState
 *   title="No results found"
 *   description="Try adjusting your search or filters."
 * />
 */
export function EmptyState({
  icon,
  title,
  description,
  ctaText,
  onCtaPress,
  ctaVariant = 'primary',
  style,
  titleStyle,
  descriptionStyle,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      {/* Optional Icon */}
      {icon && <View style={styles.iconContainer}>{icon}</View>}

      {/* Title */}
      <Text style={[styles.title, titleStyle]}>{title}</Text>

      {/* Optional Description */}
      {description && (
        <Text style={[styles.description, descriptionStyle]}>
          {description}
        </Text>
      )}

      {/* Optional CTA Button */}
      {ctaText && onCtaPress && (
        <View style={styles.ctaContainer}>
          <Button
            title={ctaText}
            onPress={onCtaPress}
            variant={ctaVariant}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.jumbo,
    gap: spacing.md,
  },
  iconContainer: {
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: colors.indigo900,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.gray,
    textAlign: 'center',
    maxWidth: 320,
  },
  ctaContainer: {
    marginTop: spacing.md,
  },
});
