import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  theme,
  radii,
  typography,
  opacity,
  minTouchTarget,
  elevation,
  spacing,
  colors,
} from '@/lib/styles/tokens';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
}: ButtonProps) {
  // Debug logging
  console.log('Button Debug:', {
    title,
    variant,
    size,
    themeAccent: theme.accent,
    primaryBgColor: styles.button_primary.backgroundColor,
  });

  const getActivityIndicatorColor = () => {
    if (variant === 'primary' || variant === 'gradient') return theme.surface;
    if (variant === 'ghost') return theme.accent;
    return theme.text_primary;
  };

  const buttonContent = (pressed: boolean) => (
    <>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={getActivityIndicatorColor()} />
        </View>
      ) : (
        <View style={styles.contentContainer}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              styles.text,
              styles[`text_${size}`],
              styles[`text_${variant}`],
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </>
  );

  if (variant === 'gradient') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        hitSlop={8}
        style={[
          fullWidth && styles.button_fullWidth,
          (disabled || loading) && { opacity: opacity.disabled },
        ]}
      >
        {({ pressed }) => (
          <LinearGradient
            colors={[colors.indigo600, colors.sky500]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.button,
              styles[`button_${size}`],
              styles.button_gradient,
              pressed && styles.button_gradient_pressed,
            ]}
          >
            {buttonContent(pressed)}
          </LinearGradient>
        )}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        styles[`button_${variant}`],
        styles[`button_${size}`],
        fullWidth && styles.button_fullWidth,
        pressed && variant === 'primary' && styles.button_primary_pressed,
        pressed && variant === 'outline' && styles.button_outline_pressed,
        pressed && variant === 'secondary' && styles.button_secondary_pressed,
        pressed && variant === 'ghost' && { opacity: opacity.muted },
        (disabled || loading) && styles.button_disabled,
      ]}
    >
      {buttonContent(false)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.lg,
    flexDirection: 'row',
    minHeight: minTouchTarget,
    paddingHorizontal: spacing.xl,
  },
  button_fullWidth: {
    width: '100%',
  },
  button_primary: {
    backgroundColor: theme.accent,
    ...elevation.sm,
  },
  button_primary_pressed: {
    backgroundColor: theme.accent_hover,
    ...elevation.md,
  },
  button_secondary: {
    backgroundColor: theme.accent_subtle,
    borderWidth: 0,
  },
  button_secondary_pressed: {
    backgroundColor: theme.accent_light,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.border_strong,
  },
  button_outline_pressed: {
    backgroundColor: theme.surface_subtle,
    borderColor: theme.accent,
  },
  button_ghost: {
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.md,
  },
  button_disabled: {
    opacity: opacity.disabled,
  },
  button_sm: {
    height: 40,
    paddingHorizontal: spacing.lg,
  },
  button_md: {
    height: 48,
    paddingHorizontal: spacing.xl,
  },
  button_lg: {
    height: 56,
    paddingHorizontal: spacing.xxl,
  },
  loadingContainer: {
    minHeight: 24,
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
  text_sm: {
    ...typography.button,
    fontSize: 14,
    lineHeight: 20,
  },
  text_md: {
    ...typography.button,
  },
  text_lg: {
    ...typography.buttonLarge,
  },
  text_primary: {
    color: colors.white,
  },
  text_secondary: {
    color: theme.accent,
  },
  text_outline: {
    color: theme.text_primary,
  },
  text_ghost: {
    color: theme.accent,
  },
  button_gradient: {
    ...elevation.md,
  },
  button_gradient_pressed: {
    ...elevation.lg,
    opacity: 0.95,
  },
  text_gradient: {
    color: colors.white,
  },
});
