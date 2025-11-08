import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye } from 'lucide-react-native';
import { Item } from '@/lib/types';
import { theme, radii, elevation, typography, spacing, colors } from '@/lib/styles/tokens';

interface ItemCardProps {
  item: Item;
  onPress?: () => void;
}

export function ItemCard({ item, onPress }: ItemCardProps) {
  const formatCategory = () => {
    const label = item.category.charAt(0).toUpperCase() + item.category.slice(1);
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
      {({ pressed }) => (
        <View style={[styles.container, pressed && styles.containerPressed]}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.photoUri }}
              style={styles.image}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgba(12, 15, 36, 0.65)', 'rgba(12, 15, 36, 0.0)']}
              start={{ x: 0.5, y: 1 }}
              end={{ x: 0.5, y: 0 }}
              style={[
                styles.imageOverlay,
                pressed && styles.imageOverlayVisible,
              ]}
              pointerEvents="none"
            >
              <View style={styles.overlayContent}>
                <Eye size={12} color={colors.white} strokeWidth={2} />
                <Text style={styles.overlayText}>View Details</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.content}>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, styles.badgePrimary]}>
                <Text style={[styles.badgeText, styles.badgePrimaryText]}>
                  {formatCategory()}
                </Text>
              </View>
              <View style={[styles.badge, styles.badgeOutline]}>
                <Text style={[styles.badgeText, styles.badgeOutlineText]}>
                  {formatSeason()}
                </Text>
              </View>
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
  containerPressed: {
    borderColor: colors.indigo200,
    transform: [{ translateY: -4 }],
    ...elevation.md,
    shadowColor: colors.indigo300,
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
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    opacity: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: spacing.md,
  },
  imageOverlayVisible: {
    opacity: 1,
  },
  overlayContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
  },
  overlayText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
    letterSpacing: 0.5,
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
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
  },
  badgePrimary: {
    backgroundColor: '#f3e8ff',
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  badgePrimaryText: {
    color: '#7e22ce',
    fontWeight: '600',
  },
  badgeOutline: {
    borderWidth: 1,
    borderColor: '#fbcfe8',
    backgroundColor: colors.white,
  },
  badgeOutlineText: {
    color: '#be185d',
    fontWeight: '500',
  },
  badgeText: {
    ...typography.micro,
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
