import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ItemCard } from '@/components/ItemCard';
import { SelectModal } from '@/components/SelectModal';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { useWardrobe } from '@/state/useWardrobe';
import {
  Search,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react-native';
import { Category } from '@/lib/types';
import { theme, spacing, radii, elevation, colors } from '@/lib/styles/tokens';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

export default function WardrobeScreen() {
  const router = useRouter();
  const { items, loading, loadItems, searchItems } = useWardrobe();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>(
    'all'
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const filterOptions: Array<{ label: string; value: Category | 'all' }> = [
    { label: 'All', value: 'all' },
    { label: 'Tops', value: 'top' },
    { label: 'Bottoms', value: 'bottom' },
    { label: 'Dresses', value: 'dress' },
    { label: 'Outerwear', value: 'outerwear' },
    { label: 'Shoes', value: 'shoes' },
    { label: 'Accessories', value: 'accessory' },
    { label: 'Athleisure', value: 'athleisure' },
  ];

  const filteredItems =
    selectedCategory === 'all'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  if (loading && items.length === 0) {
    return <LoadingState />;
  }

  return (
    <View style={styles.container}>
      {/* Header with Gradient Title */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <MaskedView
            maskElement={<Text style={styles.titleMask}>My Collection</Text>}
          >
            <LinearGradient
              colors={[colors.indigo600, colors.sky500]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientTitle}
            >
              <Text style={[styles.titleMask, { opacity: 0 }]}>
                My Collection
              </Text>
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
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Search size={16} color={colors.indigo400} strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search your style..."
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor={theme.text_muted}
            />
          </View>
          <Pressable
            style={styles.filterTrigger}
            onPress={() => setIsFilterOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Filter wardrobe items"
            accessibilityHint="Opens a list of wardrobe filters"
          >
            <SlidersHorizontal
              size={16}
              color={colors.indigo500}
              strokeWidth={2}
            />
            <Text style={styles.filterTriggerLabel}>
              {filterOptions.find((option) => option.value === selectedCategory)
                ?.label ?? 'All'}
            </Text>
            <ChevronDown
              size={16}
              color={theme.text_secondary}
              strokeWidth={2}
            />
          </Pressable>
        </View>
      </View>

      <SelectModal
        visible={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        options={filterOptions}
        selectedValue={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {filteredItems.length === 0 ? (
        <EmptyState
          title="No items yet"
          description="Add your first item to start building your wardrobe."
          ctaText="Add Item"
          onCtaPress={() => router.push('/item/new')}
        />
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
  // Header Styles
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerText: {
    gap: spacing.xs,
  },
  titleMask: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  gradientTitle: {
    paddingVertical: 2,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.text_tertiary,
    lineHeight: 20,
  },
  // Search Bar
  searchContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: radii.lg,
    paddingLeft: 12,
    paddingRight: spacing.lg,
    height: 48,
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.indigo200,
    flex: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.text_primary,
    paddingVertical: 0,
  },
  filterTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.indigo200,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
    minWidth: 120,
    ...elevation.sm,
  },
  filterTriggerLabel: {
    fontSize: 14,
    color: theme.text_secondary,
    fontWeight: '600',
    flex: 1,
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
});
