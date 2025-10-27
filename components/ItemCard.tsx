import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Item } from '@/lib/types';
import { theme, radii, elevation, typography, spacing } from '@/lib/styles/tokens';

interface ItemCardProps {
  item: Item;
  onPress?: () => void;
}

export function ItemCard({ item, onPress }: ItemCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && { opacity: 0.92 },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.photoUri }} 
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: theme.border_subtle,
    overflow: 'hidden',
    ...elevation.sm,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 5,
    backgroundColor: theme.surface_alt,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  name: {
    ...typography.body,
    fontWeight: '600',
    color: theme.text_primary,
  },
  category: {
    ...typography.caption,
    color: theme.text_tertiary,
    textTransform: 'capitalize',
  },
});
