import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Alert,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Slider from '@react-native-community/slider';
import { useWardrobe } from '@/state/useWardrobe';
import { Button } from '@/components/Button';
import { Item, Category, Warmth } from '@/lib/types';
import { extractDominantColor, suggestItemName } from '@/lib/utils/colorExtractor';
import { Camera, Image as ImageIcon, X, ChevronDown } from 'lucide-react-native';
import { theme, spacing, radii, typography, elevation } from '@/lib/styles/tokens';

export default function NewItemScreen() {
  const router = useRouter();
  const { addItem } = useWardrobe();

  const [photoUri, setPhotoUri] = useState<string>('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('top');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [colors, setColors] = useState<string[]>([]);
  const [fabric, setFabric] = useState('');
  const [warmth, setWarmth] = useState<Warmth>(2);
  const [waterproof, setWaterproof] = useState(false);
  const [windproof, setWindproof] = useState(false);

  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await prefillFromImage(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow camera access');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await prefillFromImage(result.assets[0].uri);
    }
  };

  const prefillFromImage = async (uri: string) => {
    setPhotoUri(uri);

    try {
      const dominantColor = await extractDominantColor(uri);
      setColors([dominantColor]);

      if (!name) {
        setName(suggestItemName(category));
      }
    } catch (error) {
      console.error('Failed to prefill:', error);
    }
  };

  const handleSave = async () => {
    if (!photoUri) {
      Alert.alert('Photo required', 'Please add a photo of your item');
      return;
    }

    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter a name for your item');
      return;
    }

    setLoading(true);

    try {
      const item: Item = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        name: name.trim(),
        photoUri,
        category,
        colors: colors.length > 0 ? colors : ['#808080'],
        fabric: fabric.trim() || undefined,
        warmth,
        waterproof,
        windproof,
        archived: false,
      };

      await addItem(item);
      Alert.alert('Success', 'Item added to your wardrobe');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  const categories: { value: Category; label: string }[] = [
    { value: 'top', label: 'Top' },
    { value: 'bottom', label: 'Bottom' },
    { value: 'dress', label: 'Dress' },
    { value: 'outerwear', label: 'Outerwear' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'accessory', label: 'Accessory' },
    { value: 'athleisure', label: 'Athleisure' },
  ];

  const selectedCategory = categories.find((c) => c.value === category);

  const getWarmthLabel = (value: number): string => {
    const labels = ['Very Light', 'Light', 'Moderate', 'Warm', 'Very Warm', 'Extra Warm'];
    return labels[value] || 'Moderate';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Item</Text>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <X size={24} color={theme.text_primary} strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {photoUri ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: photoUri }} style={styles.image} resizeMode="contain" />
            <Pressable
              style={styles.removeImage}
              onPress={() => setPhotoUri('')}
            >
              <X size={20} color="#FFFFFF" strokeWidth={2} />
            </Pressable>
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <View style={styles.imageButtons}>
              <Pressable style={styles.imageButton} onPress={handleTakePhoto}>
                <Camera size={32} color={theme.accent} strokeWidth={2} />
                <Text style={styles.imageButtonText}>Take Photo</Text>
              </Pressable>
              <Pressable style={styles.imageButton} onPress={handlePickImage}>
                <ImageIcon size={32} color={theme.accent} strokeWidth={2} />
                <Text style={styles.imageButtonText}>Choose Photo</Text>
              </Pressable>
            </View>
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g., Blue Denim Jacket"
            placeholderTextColor={theme.text_tertiary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Category</Text>
          <Pressable
            style={styles.dropdown}
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <Text style={styles.dropdownText}>{selectedCategory?.label}</Text>
            <ChevronDown size={20} color={theme.text_secondary} strokeWidth={2} />
          </Pressable>

          {showCategoryDropdown && (
            <View style={styles.dropdownMenu}>
              {categories.map((cat) => (
                <Pressable
                  key={cat.value}
                  style={[
                    styles.dropdownItem,
                    category === cat.value && styles.dropdownItemSelected,
                  ]}
                  onPress={() => {
                    setCategory(cat.value);
                    setShowCategoryDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      category === cat.value && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Fabric (optional)</Text>
          <TextInput
            style={styles.input}
            value={fabric}
            onChangeText={setFabric}
            placeholder="e.g., Cotton, Wool, Denim"
            placeholderTextColor={theme.text_tertiary}
          />
        </View>

        <View style={styles.field}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Warmth Level</Text>
            <Text style={styles.labelValue}>{getWarmthLabel(warmth)}</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={5}
            step={1}
            value={warmth}
            onValueChange={(value) => setWarmth(value as Warmth)}
            minimumTrackTintColor={theme.accent}
            maximumTrackTintColor={theme.border_subtle}
            thumbTintColor={theme.accent}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>Very Light</Text>
            <Text style={styles.sliderLabel}>Extra Warm</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="Save Item"
            onPress={handleSave}
            size="lg"
            loading={loading}
            disabled={!photoUri || !name.trim()}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.medium,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border_subtle,
  },
  headerTitle: {
    ...typography.title,
    color: theme.text_primary,
  },
  content: {
    padding: spacing.large,
    gap: spacing.large,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: theme.surface,
    ...elevation.sm,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeImage: {
    position: 'absolute',
    top: spacing.base,
    right: spacing.base,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: radii.full,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    height: 300,
    borderRadius: radii.lg,
    backgroundColor: theme.surface,
    borderWidth: 2,
    borderColor: theme.border_subtle,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButtons: {
    flexDirection: 'row',
    gap: spacing.jumbo,
  },
  imageButton: {
    alignItems: 'center',
    gap: spacing.base,
  },
  imageButtonText: {
    ...typography.caption,
    fontWeight: '600',
    color: theme.accent,
  },
  field: {
    gap: spacing.small,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    color: theme.text_primary,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelValue: {
    ...typography.caption,
    fontWeight: '600',
    color: theme.accent,
  },
  input: {
    backgroundColor: theme.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: theme.border_subtle,
    padding: spacing.medium,
    ...typography.body,
    color: theme.text_primary,
  },
  dropdown: {
    backgroundColor: theme.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: theme.border_subtle,
    padding: spacing.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    ...typography.body,
    color: theme.text_primary,
    textTransform: 'capitalize',
  },
  dropdownMenu: {
    backgroundColor: theme.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: theme.border_subtle,
    marginTop: spacing.micro,
    overflow: 'hidden',
    ...elevation.md,
  },
  dropdownItem: {
    padding: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.border_subtle,
  },
  dropdownItemSelected: {
    backgroundColor: theme.background,
  },
  dropdownItemText: {
    ...typography.body,
    color: theme.text_primary,
    textTransform: 'capitalize',
  },
  dropdownItemTextSelected: {
    fontWeight: '600',
    color: theme.accent,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    ...typography.micro,
    color: theme.text_tertiary,
  },
  actions: {
    gap: spacing.base,
    paddingTop: spacing.medium,
  },
});
