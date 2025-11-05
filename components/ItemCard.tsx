import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Item } from '@/lib/types';
import { theme, radii, elevation, typography, spacing, opacity, colors } from '@/lib/styles/tokens';

interface ItemCardProps {
  item: Item;
  onPress?: () => void;
}

export function ItemCard({ item, onPress }: ItemCardProps) {
  // Format season display
  const formatSeasons = (seasons: string[]) => {
    if (!seasons || seasons.length === 0) return 'All Season';
    if (seasons.length === 4) return 'All Season';
    return seasons.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ');
  };

  // Format color display
  const formatColor = () => {
    if (!item.colors || item.colors.length === 0) return null;
    if (item.colors.length === 1) {
      // Simple color name if possible, otherwise hex
      return item.colors[0];
    }
    return `${item.colors.length} colors`;
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.photoUri }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Badges Overlay */}
        <View style={styles.badgesContainer}>
          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Text>
          </View>

          {/* Season Badge */}
          <View style={styles.seasonBadge}>
            <Text style={styles.seasonBadgeText}>
              {formatSeasons(item.seasons)}
            </Text>
          </View>
        </View>

        {/* Hover/Press Overlay - "View Details" */}
        {/* This will be visible on press in React Native */}
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        {formatColor() && (
          <Text style={styles.colorText} numberOfLines={1}>
            {formatColor()}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.surface,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.indigo50,
    overflow: 'hidden',
    ...elevation.sm,
  },
  containerPressed: {
    borderColor: colors.indigo200,
    transform: [{ translateY: -4 }],
    ...elevation.md,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1, // Square aspect ratio per FIGMA
    backgroundColor: theme.surface_subtle,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgesContainer: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    backgroundColor: colors.indigo100,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
  },
  categoryBadgeText: {
    ...typography.micro,
    color: colors.indigo700,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  seasonBadge: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.indigo200,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
  },
  seasonBadgeText: {
    ...typography.micro,
    color: colors.indigo700,
    fontWeight: '500',
  },
  content: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  name: {
    ...typography.bodySmall,
    color: theme.text_primary,
    fontWeight: '600',
  },
  colorText: {
    ...typography.caption,
    color: theme.text_tertiary,
  },
});
