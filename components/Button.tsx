import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme, radii, typography, opacity, minTouchTarget } from '@/lib/styles/tokens';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        styles[`button_${variant}`],
        styles[`button_${size}`],
        pressed && { opacity: 1 - opacity.overlay },
        (disabled || loading) && { opacity: opacity.disabled },
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? theme.surface : theme.accent}
        />
      ) : (
        <Text style={[styles.text, styles[`text_${variant}`]]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    flexDirection: 'row',
    minHeight: minTouchTarget,
  },
  button_primary: {
    backgroundColor: theme.accent,
    paddingHorizontal: 24,
  },
  button_secondary: {
    backgroundColor: theme.surface_alt,
    borderWidth: 1,
    borderColor: theme.border_subtle,
    paddingHorizontal: 20,
  },
  button_ghost: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
  },
  button_sm: {
    height: 32,
  },
  button_md: {
    height: 40,
  },
  button_lg: {
    height: minTouchTarget,
  },
  text: {
    ...typography.button,
  },
  text_primary: {
    color: theme.surface,
  },
  text_secondary: {
    color: theme.text_primary,
  },
  text_ghost: {
    color: theme.accent,
  },
});
