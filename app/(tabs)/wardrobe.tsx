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
import { Plus, Search, Filter } from 'lucide-react-native';
import { Category } from '@/lib/types';

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
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Search size={20} color="#737373" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#a3a3a3"
          />
        </View>
        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/item/new')}
        >
          <Plus size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={styles.filters}>
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
                {item === 'all' ? 'All' : item}
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
            <ItemCard
              item={item}
              onPress={() => router.push(`/item/${item.id}`)}
            />
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
    backgroundColor: '#FFFFFF',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#171717',
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filters: {
    paddingVertical: 8,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#0ea5e9',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#404040',
    textTransform: 'capitalize',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  list: {
    padding: 16,
  },
  row: {
    gap: 16,
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#171717',
  },
  emptyText: {
    fontSize: 16,
    color: '#737373',
    textAlign: 'center',
    marginBottom: 8,
  },
});
