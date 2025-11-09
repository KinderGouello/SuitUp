import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable, Platform } from 'react-native';
import { colors, spacing, radii, typography, theme } from '@/lib/styles/tokens';

interface ToggleProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export default function Toggle({
  label,
  description,
  value,
  onValueChange,
  disabled = false,
}: ToggleProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && !disabled && styles.containerPressed,
        disabled && styles.containerDisabled,
      ]}
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
    >
      <View style={styles.textContainer}>
        <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
        {description && (
          <Text style={[styles.description, disabled && styles.descriptionDisabled]}>
            {description}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: colors.gray,
          true: colors.indigo600,
        }}
        thumbColor={colors.white}
        ios_backgroundColor={colors.gray}
        style={styles.switch}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  containerPressed: {
    backgroundColor: 'rgba(168, 85, 247, 0.08)', // Purple-50 with 50% opacity
  },
  containerDisabled: {
    opacity: 0.5,
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  label: {
    fontSize: typography.subtitle.fontSize,
    lineHeight: typography.subtitle.lineHeight,
    fontWeight: typography.subtitle.fontWeight,
    color: theme.text_primary,
  },
  labelDisabled: {
    color: colors.gray,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: colors.gray,
    marginTop: spacing.micro,
  },
  descriptionDisabled: {
    color: 'rgba(107, 114, 128, 0.5)',
  },
  switch: {
    ...Platform.select({
      ios: {
        transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
      },
    }),
  },
});
