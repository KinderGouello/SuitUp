import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/Button';
import { SectionCard } from '@/components/SectionCard';
import { Tag } from '@/components/Tag';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import * as itemsRepo from '@/lib/db/repo/items';
import { Item } from '@/lib/types';
import { theme, radii, spacing, colors } from '@/lib/styles/tokens';

export default function ItemDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    if (!id) return;

    try {
      const fetchedItem = await itemsRepo.getItemById(id);
      setItem(fetchedItem);
    } catch (error) {
      console.error('Failed to load item:', error);
      Alert.alert('Error', 'Failed to load item');
    } finally {
      setLoading(false);
    }
  };

  const formatSeason = (item: Item) => {
    if (!item.seasons || item.seasons.length === 0) {
      return 'All Season';
    }
    if (item.seasons.length === 4) {
      return 'All Season';
    }
    const [firstSeason] = item.seasons;
    return firstSeason.charAt(0).toUpperCase() + firstSeason.slice(1);
  };

  const formatColor = (item: Item) => {
    if (!item.colors || item.colors.length === 0) return 'Not specified';
    // Return first color name or hex
    return item.colors[0];
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!item) {
    return (
      <EmptyState
        title="Item not found"
        description="This item may have been deleted or moved."
        ctaText="Go Back"
        onCtaPress={() => router.back()}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[colors.indigo600, colors.sky500, colors.indigo600]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topGradientLine}
        pointerEvents="none"
      />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <View style={styles.headerButton}>
            <Button
              title="Back to Collection"
              variant="ghost"
              size="sm"
              onPress={() => router.back()}
              icon={<ArrowLeft size={16} color="#7c3aed" />}
            />
          </View>
        </View>

        <View style={styles.contentContainer}>
          {/* Item Name Card */}
          <View style={styles.card}>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.badgeRow}>
              <Tag
                label={
                  item.category.charAt(0).toUpperCase() + item.category.slice(1)
                }
                variant="subtle"
              />
              <Tag label={formatSeason(item)} variant="outline" />
            </View>
          </View>

          {/* Images Grid */}
          <View style={styles.imagesRow}>
            <View style={styles.imageCard}>
              <Text style={styles.imageLabel}>Item Photo</Text>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.photoUri }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            </View>
            <View style={styles.imageCard}>
              <Text style={styles.imageLabel}>Label Photo</Text>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.labelPhotoUri || item.photoUri }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>

          {/* Specifications Card */}
          <SectionCard title="Specifications">
            <View style={styles.specsGrid}>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Brand</Text>
                <Text style={styles.specValue}>
                  {item.brand || 'Not specified'}
                </Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Size</Text>
                <Text style={styles.specValue}>
                  {item.size || 'Not specified'}
                </Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Color</Text>
                <Text style={styles.specValue}>{formatColor(item)}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Material</Text>
                <Text style={styles.specValue}>
                  {item.fabric || 'Not specified'}
                </Text>
              </View>
            </View>
          </SectionCard>

          {/* Notes Card (Conditional) */}
          {item.notes && (
            <SectionCard title="Notes">
              <View style={styles.notesContainer}>
                <Text style={styles.notesText}>{item.notes}</Text>
              </View>
            </SectionCard>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  topGradientLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    zIndex: 10,
  },
  // Header Section
  headerSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerButton: {
    alignSelf: 'flex-start',
  },
  // Content Container
  contentContainer: {
    padding: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.white,
  },
  // Scroll Content
  scrollContent: {
    flexGrow: 1,
  },
  // Card (kept for item name card and image cards)
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.indigo100,
  },
  // Item Name
  itemName: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.text_primary,
    marginBottom: 4,
  },
  // Badges
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  // Images
  imagesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  imageCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.indigo100,
  },
  imageLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: spacing.xs,
  },
  imageContainer: {
    aspectRatio: 1,
    borderRadius: radii.lg,
    backgroundColor: '#f3f4f6',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.indigo100,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  // Specifications
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  specItem: {
    width: '47%',
  },
  specLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  specValue: {
    fontSize: 14,
    color: theme.text_primary,
  },
  // Notes
  notesContainer: {
    padding: spacing.sm,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.indigo100,
    backgroundColor: colors.indigo50,
  },
  notesText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});
