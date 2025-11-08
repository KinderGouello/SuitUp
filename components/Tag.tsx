import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';
import { theme, radii, typography, spacing, colors } from '@/lib/styles/tokens';

export interface TagProps {
  /**
   * Text displayed in the tag
   */
  label: string;

  /**
   * Optional callback when remove icon is pressed
   */
  onRemove?: () => void;

  /**
   * Visual style variant
   * - default: Light gray background
   * - primary: Accent color background
   * - outline: Border with transparent background
   * - subtle: Soft sapphire background
   * - gradient: Linear gradient background (indigo to sky)
   */
  variant?: 'default' | 'primary' | 'outline' | 'subtle' | 'gradient';

  /**
   * Custom gradient colors (only used with gradient variant)
   * @default [colors.indigo600, colors.sky500]
   */
  gradientColors?: readonly [string, string, ...string[]];

  /**
   * Custom container style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Custom text style
   */
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Tag - Reusable badge/tag component
 *
 * A compact label component for displaying categories, statuses, or metadata.
 * Supports multiple visual variants, optional remove functionality, and gradient styles.
 *
 * @example
 * // Basic category badge
 * <Tag label="Casual" variant="primary" />
 *
 * @example
 * // Outline badge
 * <Tag label="Summer" variant="outline" />
 *
 * @example
 * // Gradient badge
 * <Tag label="Featured" variant="gradient" />
 *
 * @example
 * // Removable tag
 * <Tag label="tag-name" variant="subtle" onRemove={() => removeTag('tag-name')} />
 */
export function Tag({
  label,
  onRemove,
  variant = 'default',
  gradientColors = [colors.indigo600, colors.sky500],
  style,
  textStyle,
}: TagProps) {
  const isRemovable = !!onRemove;

  const getIconColor = () => {
    if (variant === 'primary' || variant === 'gradient') return theme.surface;
    if (variant === 'outline') return theme.accent;
    return theme.text_tertiary;
  };

  // Gradient variant uses LinearGradient wrapper
  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.container, styles.containerGradient, style]}
      >
        <Text style={[styles.label, styles.labelGradient, textStyle]}>
          {label}
        </Text>
        {isRemovable && (
          <Pressable onPress={onRemove} hitSlop={8}>
            <X size={14} color={getIconColor()} strokeWidth={2} />
          </Pressable>
        )}
      </LinearGradient>
    );
  }

  // Standard variants use View wrapper
  return (
    <View
      style={[
        styles.container,
        variant === 'primary' && styles.containerPrimary,
        variant === 'outline' && styles.containerOutline,
        variant === 'subtle' && styles.containerSubtle,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'primary' && styles.labelPrimary,
          variant === 'outline' && styles.labelOutline,
          variant === 'subtle' && styles.labelSubtle,
          textStyle,
        ]}
      >
        {label}
      </Text>
      {isRemovable && (
        <Pressable onPress={onRemove} hitSlop={8}>
          <X size={14} color={getIconColor()} strokeWidth={2} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
  },
  containerPrimary: {
    backgroundColor: '#f3e8ff',
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  containerOutline: {
    borderWidth: 1,
    borderColor: '#fbcfe8',
    backgroundColor: colors.white,
  },
  containerSubtle: {
    backgroundColor: '#f3e8ff',
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  containerGradient: {
    borderColor: 'transparent',
  },
  label: {
    ...typography.micro,
    color: theme.text_secondary,
    fontWeight: '500',
  },
  labelPrimary: {
    color: theme.surface,
    fontWeight: '600',
  },
  labelOutline: {
    color: '#be185d',
    fontWeight: '500',
  },
  labelSubtle: {
    color: '#7e22ce',
  },
  labelGradient: {
    color: colors.white,
    fontWeight: '600',
  },
});
