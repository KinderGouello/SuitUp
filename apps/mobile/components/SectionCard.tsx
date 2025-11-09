import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, radii, typography, elevation } from '@/lib/styles/tokens';

export interface SectionCardProps {
  /**
   * Section title text
   */
  title: string;

  /**
   * Optional description text below title
   */
  description?: string;

  /**
   * Optional icon to display before title
   */
  icon?: ReactNode;

  /**
   * Section content (form fields, lists, etc.)
   */
  children: ReactNode;

  /**
   * Custom container style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Custom header style
   */
  headerStyle?: StyleProp<ViewStyle>;

  /**
   * Custom title text style
   */
  titleStyle?: StyleProp<TextStyle>;

  /**
   * Custom description text style
   */
  descriptionStyle?: StyleProp<TextStyle>;

  /**
   * Custom content wrapper style
   */
  contentStyle?: StyleProp<ViewStyle>;
}

/**
 * SectionCard - Reusable section card container
 *
 * A card wrapper for grouping related content with a header, optional description,
 * and content area. Used for form sections, settings groups, and information displays.
 *
 * @example
 * // Profile information section
 * <SectionCard
 *   title="Profile Information"
 *   description="Update your personal details"
 *   icon={<User size={20} color={colors.indigo600} />}
 * >
 *   <TextInput placeholder="Name" />
 *   <TextInput placeholder="Email" />
 * </SectionCard>
 *
 * @example
 * // Without description
 * <SectionCard
 *   title="Account Settings"
 *   icon={<Settings size={20} />}
 * >
 *   <Toggle label="Enable notifications" />
 * </SectionCard>
 */
export function SectionCard({
  title,
  description,
  icon,
  children,
  style,
  headerStyle,
  titleStyle,
  descriptionStyle,
  contentStyle,
}: SectionCardProps) {
  return (
    <View style={[styles.card, style]}>
      {/* Header with icon and title */}
      <View style={[styles.header, headerStyle]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      </View>

      {/* Optional description */}
      {description && (
        <Text style={[styles.description, descriptionStyle]}>
          {description}
        </Text>
      )}

      {/* Content area */}
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.indigo100,
    borderRadius: radii.lg,
    padding: spacing.lg,
    ...elevation.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  iconContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.subtitle,
    fontWeight: '500',
    color: colors.indigo900,
    flex: 1,
  },
  description: {
    ...typography.caption,
    color: colors.gray,
    marginBottom: spacing.md,
  },
  content: {
    gap: spacing.lg,
  },
});
