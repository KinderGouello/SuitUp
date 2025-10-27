import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Outfit, Item } from '@/lib/types';
import { shadows } from '@/lib/styles/tokens';

interface OutfitCardProps {
  outfit: Outfit;
  items: Item[];
  onPress?: () => void;
}

export function OutfitCard({ outfit, items, onPress }: OutfitCardProps) {
  const outfitItems = outfit.items
    .map((oi) => items.find((item) => item.id === oi.itemId))
    .filter(Boolean) as Item[];

  const displayItems = outfitItems.slice(0, 4);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.images}>
        {displayItems.map((item, index) => (
          <Image
            key={item.id}
            source={{ uri: item.photoUri }}
            style={[
              styles.image,
              index > 0 && styles.imageOffset,
            ]}
          />
        ))}
      </View>
      <View style={styles.content}>
        <Text style={styles.date}>
          {new Date(outfit.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.weather}>
          {outfit.weather.tempC}°C · {outfit.weather.condition}
        </Text>
        <Text style={styles.explanation} numberOfLines={2}>
          {outfit.explanation}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    ...shadows.md,
  },
  pressed: {
    opacity: 0.7,
  },
  images: {
    flexDirection: 'row',
    marginBottom: 12,
    height: 60,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  imageOffset: {
    marginLeft: -20,
  },
  content: {
    gap: 4,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171717',
  },
  weather: {
    fontSize: 12,
    color: '#737373',
  },
  explanation: {
    fontSize: 14,
    color: '#404040',
    lineHeight: 20,
  },
});
