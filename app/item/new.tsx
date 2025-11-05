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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWardrobe } from '@/state/useWardrobe';
import { Button } from '@/components/Button';
import { Item, Category, Warmth } from '@/lib/types';
import { extractDominantColor, suggestItemName } from '@/lib/utils/colorExtractor';
import { Camera, Image as ImageIcon, X, ChevronDown } from 'lucide-react-native';
import { theme, spacing, radii, typography, elevation } from '@/lib/styles/tokens';

export default function NewItemScreen() {
  const router = useRouter();
  const { addItem } = useWardrobe();
  const insets = useSafeAreaInsets();

  // Step management: 'photo' or 'form'
  const [currentStep, setCurrentStep] = useState<'photo' | 'form'>('photo');

  const [photoUri, setPhotoUri] = useState<string>('');
  const [labelPhotoUri, setLabelPhotoUri] = useState<string>('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('top');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [colors, setColors] = useState<string[]>([]);
  const [fabric, setFabric] = useState('');
  const [warmth, setWarmth] = useState<Warmth>(2);
  const [waterproof, setWaterproof] = useState(false);
  const [windproof, setWindproof] = useState(false);

  const [loading, setLoading] = useState(false);
  const [currentPhotoType, setCurrentPhotoType] = useState<'item' | 'label'>('item');

  const handlePickImage = async (type: 'item' | 'label') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: type === 'item' ? [3, 4] : [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await prefillFromImage(result.assets[0].uri, type);
    }
  };

  const handleTakePhoto = async (type: 'item' | 'label') => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow camera access');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: type === 'item' ? [3, 4] : [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await prefillFromImage(result.assets[0].uri, type);
    }
  };

  const prefillFromImage = async (uri: string, type: 'item' | 'label') => {
    setLoading(true);

    try {
      if (type === 'item') {
        setPhotoUri(uri);

        // Extract color from item photo
        const dominantColor = await extractDominantColor(uri);
        setColors([dominantColor]);

        if (!name) {
          setName(suggestItemName(category));
        }

        // After item photo, check if we should prompt for label photo
        if (!labelPhotoUri) {
          setCurrentPhotoType('label');
        } else {
          setCurrentStep('form');
        }
      } else {
        // Label photo - could extract fabric info via OCR in future
        setLabelPhotoUri(uri);

        // Move to form after label photo
        setCurrentStep('form');
      }
    } catch (error) {
      console.error('Failed to prefill:', error);

      if (type === 'item' && !labelPhotoUri) {
        setCurrentPhotoType('label');
      } else {
        setCurrentStep('form');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSkipPhoto = () => {
    if (currentPhotoType === 'item') {
      // If skipping item photo, also skip label and go to form
      setCurrentStep('form');
    } else {
      // If skipping label photo, just go to form
      setCurrentStep('form');
    }
  };

  const handleSkipLabelPhoto = () => {
    setCurrentStep('form');
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter a name for your item');
      return;
    }

    if (!photoUri) {
      Alert.alert(
        'No photo',
        'Are you sure you want to save this item without a photo?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Save anyway', onPress: () => performSave() },
        ]
      );
      return;
    }

    await performSave();
  };

  const performSave = async () => {
    setLoading(true);

    try {
      const item: Item = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        name: name.trim(),
        photoUri: photoUri || 'https://via.placeholder.com/300x400?text=No+Photo',
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

  // Render Photo Capture Step
  const renderPhotoStep = () => {
    const isItemPhoto = currentPhotoType === 'item';
    const stepNumber = isItemPhoto ? '1/2' : '2/2';

    return (
      <View style={styles.photoStepContainer}>
        <View style={styles.photoStepContent}>
          <View style={styles.photoStepHeader}>
            {photoUri && !isItemPhoto && (
              <Text style={styles.stepIndicator}>Step {stepNumber}</Text>
            )}
            <Text style={styles.photoStepTitle}>
              {isItemPhoto ? 'Add a photo of the item' : 'Add a photo of the label'}
            </Text>
            <Text style={styles.photoStepSubtitle}>
              {isItemPhoto
                ? 'Take or select a photo of your clothing item to automatically detect colors'
                : 'Capture the care label to help identify fabric composition and care instructions'}
            </Text>
          </View>

          {photoUri && !isItemPhoto && (
            <View style={styles.itemPhotoPreview}>
              <Image source={{ uri: photoUri }} style={styles.itemPhotoPreviewImage} resizeMode="cover" />
              <Text style={styles.itemPhotoPreviewLabel}>Item photo captured</Text>
            </View>
          )}

          <View style={styles.photoActions}>
            <Pressable
              style={[styles.photoActionButton, styles.photoActionPrimary]}
              onPress={() => handleTakePhoto(currentPhotoType)}
              disabled={loading}
            >
              <View style={styles.photoActionIcon}>
                <Camera size={40} color={theme.surface} strokeWidth={2} />
              </View>
              <Text style={styles.photoActionTextPrimary}>Take Photo</Text>
              <Text style={styles.photoActionDescPrimary}>Use your camera</Text>
            </Pressable>

            <Pressable
              style={[styles.photoActionButton, styles.photoActionSecondary]}
              onPress={() => handlePickImage(currentPhotoType)}
              disabled={loading}
            >
              <View style={styles.photoActionIcon}>
                <ImageIcon size={40} color={theme.accent} strokeWidth={2} />
              </View>
              <Text style={styles.photoActionTextSecondary}>Choose from Library</Text>
              <Text style={styles.photoActionDescSecondary}>Select existing photo</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.skipSection}>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>
          <Pressable
            style={styles.skipButton}
            onPress={handleSkipPhoto}
            disabled={loading}
          >
            <Text style={styles.skipButtonText}>
              {isItemPhoto ? 'Skip and add manually' : 'Skip label photo'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  // Render Form Step
  const renderFormStep = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.photosSection}>
        {/* Item Photo */}
        {photoUri ? (
          <View style={[styles.imageContainer, styles.imageContainerMain]}>
            <Image source={{ uri: photoUri }} style={styles.image} resizeMode="cover" />
            <View style={styles.photoLabel}>
              <Text style={styles.photoLabelText}>Item</Text>
            </View>
            <Pressable
              style={styles.removeImage}
              onPress={() => {
                setPhotoUri('');
                setCurrentPhotoType('item');
                setCurrentStep('photo');
              }}
            >
              <X size={20} color="#FFFFFF" strokeWidth={2} />
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={[styles.addPhotoPlaceholder, styles.addPhotoPlaceholderMain]}
            onPress={() => {
              setCurrentPhotoType('item');
              setCurrentStep('photo');
            }}
          >
            <Camera size={24} color={theme.accent} strokeWidth={2} />
            <Text style={styles.addPhotoText}>Add Item Photo</Text>
          </Pressable>
        )}

        {/* Label Photo */}
        {labelPhotoUri ? (
          <View style={[styles.imageContainer, styles.imageContainerSecondary]}>
            <Image source={{ uri: labelPhotoUri }} style={styles.image} resizeMode="cover" />
            <View style={styles.photoLabel}>
              <Text style={styles.photoLabelText}>Label</Text>
            </View>
            <Pressable
              style={styles.removeImage}
              onPress={() => {
                setLabelPhotoUri('');
              }}
            >
              <X size={20} color="#FFFFFF" strokeWidth={2} />
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={[styles.addPhotoPlaceholder, styles.addPhotoPlaceholderSecondary]}
            onPress={() => {
              setCurrentPhotoType('label');
              setCurrentStep('photo');
            }}
          >
            <ImageIcon size={20} color={theme.text_tertiary} strokeWidth={2} />
            <Text style={styles.addPhotoTextSecondary}>Add Label</Text>
          </Pressable>
        )}
      </View>

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
          title="Add to Collection"
          onPress={handleSave}
          size="lg"
          loading={loading}
          disabled={!name.trim()}
          fullWidth
          variant="gradient"
        />
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>
          {currentStep === 'photo' ? 'Add Item' : 'Item Details'}
        </Text>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <X size={24} color={theme.text_primary} strokeWidth={2} />
        </Pressable>
      </View>

      {currentStep === 'photo' ? renderPhotoStep() : renderFormStep()}
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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border_subtle,
  },
  headerTitle: {
    ...typography.title,
    color: theme.text_primary,
  },
  // Photo Step Styles
  photoStepContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.jumbo,
  },
  photoStepContent: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.jumbo,
  },
  photoStepHeader: {
    gap: spacing.md,
    alignItems: 'center',
  },
  photoStepTitle: {
    ...typography.hero,
    color: theme.text_primary,
    textAlign: 'center',
  },
  photoStepSubtitle: {
    ...typography.body,
    color: theme.text_secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  stepIndicator: {
    ...typography.caption,
    color: theme.accent,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemPhotoPreview: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  itemPhotoPreviewImage: {
    width: 80,
    height: 100,
    borderRadius: radii.md,
    backgroundColor: theme.surface_subtle,
  },
  itemPhotoPreviewLabel: {
    ...typography.micro,
    color: theme.text_tertiary,
  },
  photoActions: {
    gap: spacing.lg,
  },
  photoActionButton: {
    borderRadius: radii.lg,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    ...elevation.md,
  },
  photoActionPrimary: {
    backgroundColor: theme.accent,
  },
  photoActionSecondary: {
    backgroundColor: theme.surface,
    borderWidth: 2,
    borderColor: theme.border_strong,
  },
  photoActionIcon: {
    marginBottom: spacing.xs,
  },
  photoActionTextPrimary: {
    ...typography.h3,
    color: theme.surface,
    fontWeight: '600',
  },
  photoActionTextSecondary: {
    ...typography.h3,
    color: theme.text_primary,
    fontWeight: '600',
  },
  photoActionDescPrimary: {
    ...typography.caption,
    color: theme.surface,
    opacity: 0.9,
  },
  photoActionDescSecondary: {
    ...typography.caption,
    color: theme.text_tertiary,
  },
  skipSection: {
    gap: spacing.lg,
    paddingTop: spacing.xl,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.border_subtle,
  },
  dividerText: {
    ...typography.caption,
    color: theme.text_tertiary,
  },
  skipButton: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  skipButtonText: {
    ...typography.body,
    color: theme.text_secondary,
    textDecorationLine: 'underline',
  },
  // Form Step Styles
  content: {
    padding: spacing.large,
    paddingBottom: spacing.jumbo * 2,
    gap: spacing.large,
  },
  photosSection: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: theme.surface,
    ...elevation.sm,
  },
  imageContainerMain: {
    flex: 2,
    aspectRatio: 3 / 4,
  },
  imageContainerSecondary: {
    flex: 1,
    aspectRatio: 3 / 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  photoLabel: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
  },
  photoLabelText: {
    ...typography.micro,
    color: theme.surface,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  removeImage: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: radii.full,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoPlaceholder: {
    borderRadius: radii.lg,
    backgroundColor: theme.surface_subtle,
    borderWidth: 2,
    borderColor: theme.border_subtle,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  addPhotoPlaceholderMain: {
    flex: 2,
    aspectRatio: 3 / 4,
  },
  addPhotoPlaceholderSecondary: {
    flex: 1,
    aspectRatio: 3 / 4,
  },
  addPhotoText: {
    ...typography.caption,
    fontWeight: '600',
    color: theme.accent,
  },
  addPhotoTextSecondary: {
    ...typography.micro,
    fontWeight: '600',
    color: theme.text_tertiary,
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    marginTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.border_subtle,
  },
});
