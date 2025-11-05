import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Outfit, Item } from '@/lib/types';
import { Progress } from './Progress';
import {
  theme,
  radii,
  elevation,
  typography,
  spacing,
  colors,
  opacity,
} from '@/lib/styles/tokens';

interface TodaysPerfectMatchProps {
  outfit: Outfit;
  items: Item[];
  onPress?: () => void;
  styleScore?: number; // 0-100, defaults to 95
}

export function TodaysPerfectMatch({
  outfit,
  items,
  onPress,
  styleScore = 95,
}: TodaysPerfectMatchProps) {
  // Map outfit items to actual Item objects
  const outfitItems = outfit.items
    .map((oi) => items.find((item) => item.id === oi.itemId))
    .filter(Boolean) as Item[];

  // Show only first 3 items
  const displayItems = outfitItems.slice(0, 3);
  const remainingCount = outfitItems.length - 3;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && { opacity: opacity.pressed },
      ]}
    >
      {/* Header with title/subtitle and AI Picked badge */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.sectionTitle}>Today's Perfect Match</Text>
          <Text style={styles.sectionSubtitle}>
            Styled for {outfit.weather.tempC}° and{' '}
            {outfit.weather.condition.toLowerCase()}
          </Text>
        </View>
        <LinearGradient
          colors={[colors.indigo600, colors.sky500]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.badge}
        >
          <Text style={styles.badgeText}>AI Picked</Text>
        </LinearGradient>
      </View>

      {/* Grid of outfit items - exactly 3 items */}
      <View style={styles.grid}>
        {displayItems.map((item) => (
          <View key={item.id} style={styles.gridItem}>
            {/* Item image */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.photoUri }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>

            {/* Category badge and name */}
            <View style={styles.itemInfo}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
          </View>
        ))}

        {/* Show "+X more" if there are additional items */}
        {remainingCount > 0 && (
          <View style={styles.gridItem}>
            <View style={[styles.imageContainer, styles.moreItemsContainer]}>
              <Text style={styles.moreItemsText}>+{remainingCount}</Text>
              <Text style={styles.moreItemsLabel}>more</Text>
            </View>
          </View>
        )}
      </View>

      {/* Style Match Score */}
      <View style={styles.scoreContainer}>
        <View style={styles.scoreHeader}>
          <Text style={styles.scoreLabel}>Style Match</Text>
          <Text style={styles.scoreValue}>{styleScore}%</Text>
        </View>
        <Progress value={styleScore} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.surface,
    borderRadius: radii.xl,
    borderWidth: 2,
    borderColor: colors.indigo100,
    padding: spacing.xl,
    ...elevation.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  headerLeft: {
    flex: 1,
    gap: spacing.xs,
  },
  sectionTitle: {
    ...typography.h2,
    color: theme.text_primary,
    fontWeight: '600',
  },
  sectionSubtitle: {
    ...typography.caption,
    color: theme.text_tertiary,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
  },
  badgeText: {
    ...typography.caption,
    color: theme.surface,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  gridItem: {
    flex: 1,
    gap: spacing.sm,
  },
  imageContainer: {
    aspectRatio: 1,
    borderRadius: radii.lg,
    backgroundColor: theme.surface_subtle,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.indigo100,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    gap: spacing.xs,
  },
  categoryBadge: {
    backgroundColor: colors.indigo50,
    borderRadius: radii.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.indigo200,
  },
  categoryText: {
    ...typography.micro,
    color: colors.indigo700,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  itemName: {
    ...typography.micro,
    color: theme.text_primary,
  },
  moreItemsContainer: {
    backgroundColor: colors.indigo50,
    borderColor: colors.indigo200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreItemsText: {
    ...typography.h2,
    color: colors.indigo600,
    fontWeight: '600',
  },
  moreItemsLabel: {
    ...typography.micro,
    color: colors.indigo600,
    fontWeight: '500',
  },
  scoreContainer: {
    backgroundColor: colors.indigo50,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.indigo100,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLabel: {
    ...typography.bodySmall,
    color: theme.text_primary,
  },
  scoreValue: {
    ...typography.bodySmall,
    color: theme.text_primary,
    fontWeight: '600',
  },
});
