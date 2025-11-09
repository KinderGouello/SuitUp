import React, { useState } from 'react';
import { View, TextInput as RNTextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors, spacing, radii, typography, theme } from '@/lib/styles/tokens';
import { LucideIcon } from 'lucide-react-native';

interface CustomTextInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  iconColor?: string;
}

export default function TextInput({
  label,
  error,
  icon: Icon,
  iconColor = colors.gray,
  ...props
}: CustomTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}
      >
        {Icon && (
          <Icon
            size={20}
            color={error ? colors.error : iconColor}
            style={styles.icon}
          />
        )}
        <RNTextInput
          style={[styles.input, Icon && styles.inputWithIcon]}
          placeholderTextColor={colors.gray}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    fontWeight: '500',
    color: colors.darkGray,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: theme.border_subtle,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  inputContainerFocused: {
    borderColor: colors.indigo600,
    borderWidth: 2,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  icon: {
    marginRight: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    fontWeight: typography.body.fontWeight,
    color: theme.text_primary,
    padding: 0,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  errorText: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
