import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ItemCard } from '@/components/ItemCard';
import { Button } from '@/components/Button';
import { useWardrobe } from '@/state/useWardrobe';
import {
  Search,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  Check,
} from 'lucide-react-native';
import { Category } from '@/lib/types';
import {
  theme,
  typography,
  spacing,
  radii,
  elevation,
  colors,
} from '@/lib/styles/tokens';
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

      <Modal
        visible={isFilterOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsFilterOpen(false)}
      >
        <View style={styles.filterModalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setIsFilterOpen(false)}
            accessibilityLabel="Dismiss filter menu"
          />
          <View style={styles.filterModalCard}>
            {filterOptions.map((option) => {
              const isActive = option.value === selectedCategory;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    setSelectedCategory(option.value);
                    setIsFilterOpen(false);
                  }}
                  style={[
                    styles.filterOption,
                    isActive && styles.filterOptionActive,
                  ]}
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected: isActive }}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      isActive && styles.filterOptionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {isActive && (
                    <Check
                      size={16}
                      color={colors.indigo500}
                      strokeWidth={2.5}
                      style={styles.filterOptionIcon}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>

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
  filterModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 11, 28, 0.2)',
    justifyContent: 'flex-start',
    paddingTop: spacing.large,
    paddingHorizontal: spacing.xl,
  },
  filterModalCard: {
    alignSelf: 'flex-end',
    width: 180,
    backgroundColor: theme.surface,
    borderRadius: radii.xl,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.indigo100,
    gap: spacing.xs,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radii.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  filterOptionActive: {
    backgroundColor: colors.indigo50,
  },
  filterOptionText: {
    ...typography.bodySmall,
    color: theme.text_secondary,
  },
  filterOptionTextActive: {
    color: colors.indigo600,
    fontWeight: '600',
  },
  filterOptionIcon: {
    marginLeft: spacing.sm,
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
