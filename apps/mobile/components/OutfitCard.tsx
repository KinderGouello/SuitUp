import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Outfit, Item } from '@/lib/types';
import { theme, radii, elevation, typography, spacing, opacity } from '@/lib/styles/tokens';

interface OutfitCardProps {
  outfit: Outfit;
  items: Item[];
  onPress?: () => void;
}

export function OutfitCard({ outfit, items, onPress }: OutfitCardProps) {
  const outfitItems = outfit.items
    .map((oi) => items.find((item) => item.id === oi.itemId))
    .filter(Boolean) as Item[];

  const displayItems = outfitItems.slice(0, 4);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && { opacity: opacity.pressed },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.date}>
          {new Date(outfit.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </Text>
        <Text style={styles.weather}>
          {outfit.weather.tempC}° · {outfit.weather.condition}
        </Text>
      </View>

      <View style={styles.images}>
        {displayItems.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.imageWrapper,
              index > 0 && { marginLeft: -spacing.lg },
            ]}
          >
            <Image
              source={{ uri: item.photoUri }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ))}
      </View>

      {outfit.explanation && (
        <Text style={styles.explanation} numberOfLines={3}>
          {outfit.explanation}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: theme.border_subtle,
    padding: spacing.xl,
    ...elevation.md,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
  },
  date: {
    ...typography.title,
    color: theme.text_primary,
  },
  weather: {
    ...typography.caption,
    color: theme.text_tertiary,
  },
  images: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 72,
  },
  imageWrapper: {
    width: 72,
    height: 72,
    borderRadius: radii.md,
    backgroundColor: theme.surface_subtle,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: theme.surface,
    ...elevation.sm,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  explanation: {
    ...typography.bodySmall,
    color: theme.text_secondary,
    lineHeight: 22,
  },
});
