import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radii, typography, elevation } from '@/lib/styles/tokens';

export interface GradientCardProps {
  /**
   * Layout variant for the card
   * - 'horizontal': Icon on left, content on right (default)
   * - 'vertical': Icon on top, content below
   * - 'orb': Circular gradient with centered icon
   * - 'subtle': Light gradient background
   */
  variant?: 'horizontal' | 'vertical' | 'orb' | 'subtle';

  /**
   * Gradient colors array (minimum 2 colors required)
   * @default [colors.indigo600, colors.sky500]
   */
  gradientColors?: readonly [string, string, ...string[]];

  /**
   * Gradient start position
   * @default { x: 0, y: 0 }
   */
  gradientStart?: { x: number; y: number };

  /**
   * Gradient end position
   * @default { x: 1, y: 1 }
   */
  gradientEnd?: { x: number; y: number };

  /**
   * Icon or avatar to display
   */
  icon?: ReactNode;

  /**
   * Optional badge to overlay on icon (e.g., crown badge)
   */
  badge?: ReactNode;

  /**
   * Main title text
   */
  title?: string;

  /**
   * Subtitle or description text
   */
  subtitle?: string;

  /**
   * Custom children content (overrides title/subtitle)
   */
  children?: ReactNode;

  /**
   * Custom container style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Custom content wrapper style
   */
  contentStyle?: StyleProp<ViewStyle>;

  /**
   * Custom icon container style
   */
  iconContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Custom title text style
   */
  titleStyle?: StyleProp<TextStyle>;

  /**
   * Custom subtitle text style
   */
  subtitleStyle?: StyleProp<TextStyle>;
}

/**
 * GradientCard - Reusable gradient card component
 *
 * Used for motivation cards, CTAs, profile headers, and decorative elements
 * throughout the app.
 *
 * @example
 * // Horizontal motivation card
 * <GradientCard
 *   variant="horizontal"
 *   icon={<Zap size={24} color={colors.white} fill={colors.white} />}
 *   title="Daily Boost"
 *   subtitle="You're building a sustainable wardrobe!"
 * />
 *
 * @example
 * // Orb with sparkles
 * <GradientCard
 *   variant="orb"
 *   icon={<Sparkles size={48} color="#fff" />}
 * />
 *
 * @example
 * // Custom content with children
 * <GradientCard variant="vertical">
 *   <Text>Custom content here</Text>
 *   <Button title="Action" />
 * </GradientCard>
 */
export function GradientCard({
  variant = 'horizontal',
  gradientColors = [colors.indigo600, colors.sky500],
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 1 },
  icon,
  badge,
  title,
  subtitle,
  children,
  style,
  contentStyle,
  iconContainerStyle,
  titleStyle,
  subtitleStyle,
}: GradientCardProps) {
  // Orb variant - circular gradient with centered icon
  if (variant === 'orb') {
    return (
      <View style={[styles.orbContainer, style]}>
        <LinearGradient
          colors={gradientColors}
          start={gradientStart}
          end={gradientEnd}
          style={[styles.orbGradient, iconContainerStyle]}
        >
          {icon}
        </LinearGradient>
      </View>
    );
  }

  // Subtle variant - light gradient background
  if (variant === 'subtle') {
    return (
      <LinearGradient
        colors={gradientColors}
        start={gradientStart}
        end={gradientEnd}
        style={[styles.subtleCard, style]}
      >
        <View style={[styles.subtleContent, contentStyle]}>
          {children || (
            <>
              {title && <Text style={[styles.subtleTitle, titleStyle]}>{title}</Text>}
              {subtitle && (
                <Text style={[styles.subtleSubtitle, subtitleStyle]}>{subtitle}</Text>
              )}
            </>
          )}
        </View>
      </LinearGradient>
    );
  }

  // Horizontal variant - icon left, content right
  if (variant === 'horizontal') {
    return (
      <LinearGradient
        colors={gradientColors}
        start={gradientStart}
        end={gradientEnd}
        style={[styles.horizontalCard, style]}
      >
        {icon && (
          <View style={[styles.horizontalIconContainer, iconContainerStyle]}>
            {icon}
            {badge && <View style={styles.badgeOverlay}>{badge}</View>}
          </View>
        )}
        <View style={[styles.horizontalTextContainer, contentStyle]}>
          {children || (
            <>
              {title && <Text style={[styles.horizontalTitle, titleStyle]}>{title}</Text>}
              {subtitle && (
                <Text style={[styles.horizontalSubtitle, subtitleStyle]}>
                  {subtitle}
                </Text>
              )}
            </>
          )}
        </View>
      </LinearGradient>
    );
  }

  // Vertical variant - icon top, content below
  return (
    <LinearGradient
      colors={gradientColors}
      start={gradientStart}
      end={gradientEnd}
      style={[styles.verticalCard, style]}
    >
      {icon && (
        <View style={[styles.verticalIconContainer, iconContainerStyle]}>
          {icon}
          {badge && <View style={styles.badgeOverlay}>{badge}</View>}
        </View>
      )}
      <View style={[styles.verticalTextContainer, contentStyle]}>
        {children || (
          <>
            {title && <Text style={[styles.verticalTitle, titleStyle]}>{title}</Text>}
            {subtitle && (
              <Text style={[styles.verticalSubtitle, subtitleStyle]}>{subtitle}</Text>
            )}
          </>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  // Orb variant styles
  orbContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.md,
  },

  // Subtle variant styles
  subtleCard: {
    borderRadius: radii.lg,
    padding: spacing.lg,
    ...elevation.sm,
  },
  subtleContent: {
    gap: spacing.sm,
  },
  subtleTitle: {
    ...typography.subtitle,
    fontWeight: '600',
    color: colors.indigo900,
  },
  subtleSubtitle: {
    ...typography.bodySmall,
    color: colors.indigo700,
  },

  // Horizontal variant styles
  horizontalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...elevation.md,
  },
  horizontalIconContainer: {
    width: 56,
    height: 56,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  horizontalTextContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  horizontalTitle: {
    ...typography.label,
    color: colors.white,
    opacity: 0.9,
  },
  horizontalSubtitle: {
    ...typography.subtitle,
    fontWeight: '600',
    color: colors.white,
  },

  // Vertical variant styles
  verticalCard: {
    borderRadius: radii.lg,
    padding: spacing.xl,
    gap: spacing.lg,
    ...elevation.md,
  },
  verticalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    position: 'relative',
  },
  verticalTextContainer: {
    gap: spacing.sm,
  },
  verticalTitle: {
    ...typography.h2,
    color: colors.white,
  },
  verticalSubtitle: {
    ...typography.body,
    color: colors.white,
    opacity: 0.95,
    lineHeight: 24,
  },

  // Badge overlay (for crown badge on avatar)
  badgeOverlay: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.indigo600,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
});
