import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ItemCard } from '@/components/ItemCard';
import { Button } from '@/components/Button';
import { useWardrobe } from '@/state/useWardrobe';
import { Plus, Search, Filter, Sparkles } from 'lucide-react-native';
import { Category } from '@/lib/types';
import { theme, typography, spacing, radii, elevation, colors } from '@/lib/styles/tokens';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

export default function WardrobeScreen() {
  const router = useRouter();
  const { items, loading, loadItems, searchItems } = useWardrobe();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>(
    'all'
  );

  useEffect(() => {
    loadItems();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchItems(query);
    } else {
      loadItems();
    }
  };

  const categories: Array<Category | 'all'> = [
    'all',
    'top',
    'bottom',
    'dress',
    'outerwear',
    'shoes',
    'accessory',
    'athleisure',
  ];

  const filteredItems =
    selectedCategory === 'all'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  if (loading && items.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Gradient Title */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <MaskedView
            maskElement={
              <Text style={styles.titleMask}>My Collection</Text>
            }
          >
            <LinearGradient
              colors={[colors.indigo600, colors.sky500]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientTitle}
            >
              <Text style={[styles.titleMask, { opacity: 0 }]}>My Collection</Text>
            </LinearGradient>
          </MaskedView>
          <View style={styles.subtitleContainer}>
            <Sparkles size={12} color={colors.indigo500} />
            <Text style={styles.subtitle}>
              {filteredItems.length} amazing pieces
            </Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.indigo400} strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your style..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor={theme.text_muted}
          />
        </View>
      </View>

      {/* Category Filters */}
      <View style={styles.filtersSection}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.categoryChip,
                selectedCategory === item && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === item && styles.categoryChipTextActive,
                ]}
              >
                {item === 'all' ? 'All Items' : item}
              </Text>
            </Pressable>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        />
      </View>

      {filteredItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No items yet</Text>
          <Text style={styles.emptyText}>
            Add your first item to start building your wardrobe.
          </Text>
          <Button
            title="Add Item"
            onPress={() => router.push('/item/new')}
            variant="primary"
          />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              <ItemCard
                item={item}
                onPress={() => router.push(`/item/${item.id}`)}
              />
            </View>
          )}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
  },
  // Header Styles
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    gap: spacing.xs,
  },
  titleMask: {
    ...typography.h1,
    fontSize: 28,
    fontWeight: '700',
  },
  gradientTitle: {
    paddingVertical: 2,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  subtitle: {
    ...typography.bodySmall,
    color: theme.text_tertiary,
  },
  // Search Bar
  searchContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    height: 48,
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.indigo200,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: theme.text_primary,
  },
  // Filters
  filtersSection: {
    paddingBottom: spacing.md,
  },
  filtersContent: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    backgroundColor: theme.surface,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: theme.border_medium,
    marginRight: spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: theme.accent,
    borderColor: theme.accent,
  },
  categoryChipText: {
    ...typography.caption,
    fontWeight: '600',
    color: theme.text_secondary,
    textTransform: 'capitalize',
  },
  categoryChipTextActive: {
    color: theme.surface,
  },
  // Mosaic Grid
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120, // Account for 80px tab bar + safe area + comfortable spacing
  },
  row: {
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  itemWrapper: {
    flex: 1,
  },
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.jumbo,
    gap: spacing.lg,
  },
  emptyTitle: {
    ...typography.h1,
    color: theme.text_primary,
  },
  emptyText: {
    ...typography.body,
    color: theme.text_secondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});
