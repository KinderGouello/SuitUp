import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { Tag } from '@/components/Tag';
import { useWardrobe } from '@/state/useWardrobe';
import * as itemsRepo from '@/lib/db/repo/items';
import { Item } from '@/lib/types';

export default function ItemDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { deleteItem } = useWardrobe();

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

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!id) return;
            try {
              await deleteItem(id);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Item not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: item.photoUri }} style={styles.image} />

      <View style={styles.section}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Colors</Text>
        <View style={styles.colors}>
          {item.colors.map((color, index) => (
            <View
              key={index}
              style={[styles.colorDot, { backgroundColor: color }]}
            />
          ))}
        </View>
      </View>

      {item.fabric && (
        <View style={styles.section}>
          <Text style={styles.label}>Fabric</Text>
          <Text style={styles.value}>{item.fabric}</Text>
        </View>
      )}

      {item.warmth !== undefined && (
        <View style={styles.section}>
          <Text style={styles.label}>Warmth Level</Text>
          <Text style={styles.value}>
            {['Very Light', 'Light', 'Moderate', 'Warm', 'Very Warm', 'Extra Warm'][item.warmth]}
          </Text>
        </View>
      )}

      {item.waterproof && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Waterproof</Text>
        </View>
      )}

      {item.windproof && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Windproof</Text>
        </View>
      )}

      {item.lastWorn && (
        <View style={styles.section}>
          <Text style={styles.label}>Last Worn</Text>
          <Text style={styles.value}>
            {new Date(item.lastWorn).toLocaleDateString()}
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        <Button
          title="Delete Item"
          onPress={handleDelete}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#737373',
  },
  image: {
    width: '100%',
    height: 400,
    backgroundColor: '#f5f5f5',
  },
  section: {
    padding: 20,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#171717',
  },
  category: {
    fontSize: 16,
    color: '#737373',
    textTransform: 'capitalize',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#737373',
  },
  value: {
    fontSize: 16,
    color: '#171717',
  },
  colors: {
    flexDirection: 'row',
    gap: 12,
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0ea5e9',
  },
  actions: {
    padding: 20,
    gap: 12,
  },
});
