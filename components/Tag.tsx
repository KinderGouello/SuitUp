import { View, Text, StyleSheet, Pressable } from 'react-native';
import { X } from 'lucide-react-native';

interface TagProps {
  label: string;
  onRemove?: () => void;
  variant?: 'default' | 'primary';
}

export function Tag({ label, onRemove, variant = 'default' }: TagProps) {
  const isRemovable = !!onRemove;

  return (
    <View
      style={[
        styles.container,
        variant === 'primary' && styles.containerPrimary,
      ]}
    >
      <Text
        style={[styles.label, variant === 'primary' && styles.labelPrimary]}
      >
        {label}
      </Text>
      {isRemovable && (
        <Pressable onPress={onRemove} hitSlop={8}>
          <X
            size={14}
            color={variant === 'primary' ? '#FFFFFF' : '#737373'}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  containerPrimary: {
    backgroundColor: '#0ea5e9',
  },
  label: {
    fontSize: 14,
    color: '#404040',
    fontWeight: '500',
  },
  labelPrimary: {
    color: '#FFFFFF',
  },
});
