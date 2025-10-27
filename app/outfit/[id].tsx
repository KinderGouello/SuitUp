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
import { WeatherBadge } from '@/components/WeatherBadge';
import { useWardrobe } from '@/state/useWardrobe';
import * as outfitsRepo from '@/lib/db/repo/outfits';
import { Outfit, Item } from '@/lib/types';

export default function OutfitDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, loadItems } = useWardrobe();

  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    try {
      await loadItems();
      const fetchedOutfit = await outfitsRepo.getOutfitById(id);
      setOutfit(fetchedOutfit);
    } catch (error) {
      console.error('Failed to load outfit:', error);
      Alert.alert('Error', 'Failed to load outfit');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Outfit',
      'Are you sure you want to delete this outfit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!id) return;
            try {
              await outfitsRepo.deleteOutfit(id);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete outfit');
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

  if (!outfit) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Outfit not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const outfitItems = outfit.items
    .map((oi) => items.find((item) => item.id === oi.itemId))
    .filter(Boolean) as Item[];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.date}>
          {new Date(outfit.createdAt).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      <WeatherBadge weather={outfit.weather} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why this outfit?</Text>
        <Text style={styles.explanation}>{outfit.explanation}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items ({outfitItems.length})</Text>
        <View style={styles.items}>
          {outfitItems.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <Image
                source={{ uri: item.photoUri }}
                style={styles.itemImage}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          title="Delete Outfit"
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
    padding: 20,
    gap: 24,
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
  header: {
    gap: 8,
  },
  date: {
    fontSize: 20,
    fontWeight: '700',
    color: '#171717',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
  },
  explanation: {
    fontSize: 16,
    color: '#404040',
    lineHeight: 24,
  },
  items: {
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  itemImage: {
    width: 80,
    height: 80,
    backgroundColor: '#e5e5e5',
  },
  itemInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    gap: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#171717',
  },
  itemCategory: {
    fontSize: 14,
    color: '#737373',
    textTransform: 'capitalize',
  },
  actions: {
    gap: 12,
    paddingTop: 16,
  },
});
