import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Tag } from './Tag';
import { Item } from '@/lib/types';
import { theme, radii, elevation, spacing, colors } from '@/lib/styles/tokens';

interface ItemCardProps {
  item: Item;
  onPress?: () => void;
}

export function ItemCard({ item, onPress }: ItemCardProps) {
  const formatCategory = () => {
    const label =
      item.category.charAt(0).toUpperCase() + item.category.slice(1);
    return label;
  };

  const formatColor = () => {
    if (!item.colors || item.colors.length === 0) return null;
    if (item.colors.length === 1) {
      return item.colors[0];
    }
    return `${item.colors.length} colors`;
  };

  const formatSeason = () => {
    if (!item.seasons || item.seasons.length === 0) {
      return 'All Season';
    }
    if (item.seasons.length === 4) {
      return 'All Season';
    }
    const [firstSeason] = item.seasons;
    return firstSeason.charAt(0).toUpperCase() + firstSeason.slice(1);
  };

  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      {() => (
        <View style={[styles.container]}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.photoUri }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>

          <View style={styles.content}>
            <View style={styles.badgeRow}>
              <Tag label={formatCategory()} variant="subtle" />
              <Tag label={formatSeason()} variant="outline" />
            </View>

            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            {formatColor() && (
              <Text style={styles.colorText} numberOfLines={1}>
                {formatColor()}
              </Text>
            )}
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.surface,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.indigo50,
    overflow: 'hidden',
    ...elevation.sm,
    shadowColor: colors.indigo200,
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
  content: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.text_primary,
    fontWeight: '600',
  },
  colorText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#6b7280',
    marginTop: 4,
  },
});
