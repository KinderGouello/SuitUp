import { View, Text, StyleSheet, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { theme, radii, typography, spacing, colors } from '@/lib/styles/tokens';

interface TagProps {
  label: string;
  onRemove?: () => void;
  variant?: 'default' | 'primary' | 'outline' | 'subtle';
}

export function Tag({ label, onRemove, variant = 'default' }: TagProps) {
  const isRemovable = !!onRemove;

  const getIconColor = () => {
    if (variant === 'primary') return theme.surface;
    if (variant === 'outline') return theme.accent;
    return theme.text_tertiary;
  };

  return (
    <View
      style={[
        styles.container,
        variant === 'primary' && styles.containerPrimary,
        variant === 'outline' && styles.containerOutline,
        variant === 'subtle' && styles.containerSubtle,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'primary' && styles.labelPrimary,
          variant === 'outline' && styles.labelOutline,
          variant === 'subtle' && styles.labelSubtle,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface_subtle,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  containerPrimary: {
    backgroundColor: theme.accent,
    borderColor: theme.accent,
  },
  containerOutline: {
    backgroundColor: 'transparent',
    borderColor: theme.border_medium,
  },
  containerSubtle: {
    backgroundColor: colors.sapphire50,
    borderColor: 'transparent',
  },
  label: {
    ...typography.caption,
    color: theme.text_secondary,
    fontWeight: '500',
  },
  labelPrimary: {
    color: theme.surface,
  },
  labelOutline: {
    color: theme.accent,
  },
  labelSubtle: {
    color: theme.accent,
  },
});
