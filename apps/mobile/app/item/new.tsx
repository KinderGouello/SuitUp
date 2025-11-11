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
  ActivityIndicator,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Camera,
  ChevronDown,
  RefreshCw,
} from 'lucide-react-native';
import { useWardrobe } from '@/state/useWardrobe';
import { Button } from '@/components/Button';
import { SectionCard } from '@/components/SectionCard';
import { Tag } from '@/components/Tag';
import { Item, Category, Warmth } from '@/lib/types';
import {
  analyzeItem,
  suggestItemName,
  ItemAnalysisResult,
} from '@/lib/utils/itemAnalyzer';
import { theme, spacing, radii, colors } from '@/lib/styles/tokens';

type Screen = 'itemPhoto' | 'labelPhoto' | 'form';

const categories: { value: Category; label: string }[] = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'dress', label: 'Dress' },
  { value: 'outerwear', label: 'Outerwear' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'accessory', label: 'Accessory' },
  { value: 'athleisure', label: 'Athleisure' },
];

export default function NewItemScreen() {
  const router = useRouter();
  const { addItem } = useWardrobe();
  const insets = useSafeAreaInsets();

  // Screen state
  const [currentScreen, setCurrentScreen] = useState<Screen>('itemPhoto');

  // Photo URIs
  const [itemPhotoUri, setItemPhotoUri] = useState<string>('');
  const [labelPhotoUri, setLabelPhotoUri] = useState<string>('');

  // Analysis state
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<ItemAnalysisResult | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('top');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [fabric, setFabric] = useState('');
  const [itemColors, setItemColors] = useState<string[]>(['#808080']);
  const [warmth, setWarmth] = useState<Warmth>(2);
  const [waterproof, setWaterproof] = useState(false);
  const [windproof, setWindproof] = useState(false);

  const [saving, setSaving] = useState(false);

  // Request permissions and capture photo
  const capturePhoto = async (
    type: 'item' | 'label',
    method: 'camera' | 'library',
  ) => {
    try {
      let result: ImagePicker.ImagePickerResult;

      if (method === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Please allow camera access');
          return;
        }

        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: type === 'item' ? [3, 4] : [1, 1],
          quality: 0.8,
        });
      } else {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission needed',
            'Please allow access to your photos',
          );
          return;
        }

        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: type === 'item' ? [3, 4] : [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;

        if (type === 'item') {
          setItemPhotoUri(uri);
          // Auto-advance to label photo screen
          setCurrentScreen('labelPhoto');
        } else {
          setLabelPhotoUri(uri);
          // Auto-advance to form and analyze both photos
          await analyzePhotosAndAdvance(itemPhotoUri, uri);
        }
      }
    } catch (error) {
      console.error('Failed to capture photo:', error);
      Alert.alert('Error', 'Failed to capture photo');
    }
  };

  // Analyze both photos and populate form
  const analyzePhotosAndAdvance = async (itemUri: string, labelUri: string) => {
    setAnalyzing(true);
    setCurrentScreen('form');

    try {
      const result = await analyzeItem(itemUri, labelUri);
      setAnalysisResult(result);

      // Auto-populate form fields
      setCategory(result.suggestedCategory);
      setBrand(result.brand || '');
      setSize(result.size || '');
      setFabric(result.fabric || '');
      setItemColors(result.colors);
      setWarmth(result.warmth);
      setWaterproof(result.waterproof);
      setWindproof(result.windproof);

      // Suggest a name based on analysis
      setName(suggestItemName(result.suggestedCategory, result));
    } catch (error) {
      console.error('Failed to analyze item:', error);
      Alert.alert(
        'Analysis failed',
        'Could not analyze photos. Please fill in manually.',
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // Retake photo and re-analyze
  const handleRetake = async (type: 'item' | 'label') => {
    if (type === 'item') {
      setCurrentScreen('itemPhoto');
      setItemPhotoUri('');
    } else {
      setCurrentScreen('labelPhoto');
      setLabelPhotoUri('');
    }
  };

  // Save item
  // Show photo options action sheet
  const showPhotoOptions = (type: 'item' | 'label') => {
    Alert.alert(
      'Add Photo',
      'Choose how you want to add a photo',
      [
        {
          text: 'Take Photo',
          onPress: () => capturePhoto(type, 'camera'),
        },
        {
          text: 'Choose from Library',
          onPress: () => capturePhoto(type, 'library'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter a name for this item');
      return;
    }

    setSaving(true);

    try {
      const item: Item = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        name: name.trim(),
        photoUri: itemPhotoUri,
        labelPhotoUri: labelPhotoUri,
        category,
        brand: brand.trim() || undefined,
        size: size.trim() || undefined,
        colors: itemColors,
        fabric: fabric.trim() || undefined,
        warmth,
        waterproof,
        windproof,
        archived: false,
      };

      await addItem(item);
      Alert.alert('Success', 'Item added to your wardrobe!');
      router.dismiss();
    } catch (error) {
      console.error('Failed to save item:', error);
      Alert.alert('Error', 'Failed to save item');
    } finally {
      setSaving(false);
    }
  };

  // Render different screens
  const renderScreen = () => {
    switch (currentScreen) {
      case 'itemPhoto':
        return renderItemPhotoScreen();
      case 'labelPhoto':
        return renderLabelPhotoScreen();
      case 'form':
        return renderFormScreen();
    }
  };

  // Screen 1: Item Photo Capture
  const renderItemPhotoScreen = () => (
    <View style={styles.captureContainer}>
      <View style={styles.captureContent}>
        <Text style={styles.stepText}>Step 1 of 3</Text>
        <Text style={styles.captureTitle}>Take Item Photo</Text>
        <Text style={styles.captureSubtitle}>
          Capture a clear photo of your clothing item
        </Text>

        <Pressable
          style={styles.capturePreview}
          onPress={() => showPhotoOptions('item')}
        >
          {itemPhotoUri ? (
            <Image source={{ uri: itemPhotoUri }} style={styles.previewImage} />
          ) : (
            <View style={styles.previewPlaceholder}>
              <Camera size={64} color={colors.indigo300} />
              <Text style={styles.placeholderText}>Tap to add photo</Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );

  // Screen 2: Label Photo Capture
  const renderLabelPhotoScreen = () => (
    <View style={styles.captureContainer}>
      <View style={styles.captureContent}>
        <Text style={styles.stepText}>Step 2 of 3</Text>
        <Text style={styles.captureTitle}>Take Label Photo</Text>
        <Text style={styles.captureSubtitle}>
          Capture the care label for automatic details
        </Text>

        <Pressable
          style={styles.capturePreview}
          onPress={() => showPhotoOptions('label')}
        >
          {labelPhotoUri ? (
            <Image
              source={{ uri: labelPhotoUri }}
              style={styles.previewImage}
            />
          ) : (
            <View style={styles.previewPlaceholder}>
              <Camera size={64} color={colors.indigo300} />
              <Text style={styles.placeholderText}>Tap to add photo</Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );

  // Screen 3: Form with auto-populated fields
  const renderFormScreen = () => (
    <ScrollView
      style={styles.formContainer}
      contentContainerStyle={[
        styles.formContent,
        { paddingBottom: insets.bottom + 32 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.stepText}>Step 3 of 3</Text>
      <Text style={styles.formTitle}>Review & Add Item</Text>
      {analyzing && (
        <View style={styles.analyzingBanner}>
          <ActivityIndicator size="small" color={colors.indigo600} />
          <Text style={styles.analyzingText}>Analyzing photos...</Text>
        </View>
      )}

      {/* Photo Thumbnails with Retake */}
      <View style={styles.photoThumbnails}>
        <Pressable
          style={styles.thumbnailCard}
          onPress={() => handleRetake('item')}
        >
          <Image source={{ uri: itemPhotoUri }} style={styles.thumbnailImage} />
          <View style={styles.thumbnailOverlay}>
            <RefreshCw size={16} color="#fff" />
            <Text style={styles.thumbnailText}>Retake</Text>
          </View>
        </Pressable>

        <Pressable
          style={styles.thumbnailCard}
          onPress={() => handleRetake('label')}
        >
          <Image
            source={{ uri: labelPhotoUri }}
            style={styles.thumbnailImage}
          />
          <View style={styles.thumbnailOverlay}>
            <RefreshCw size={16} color="#fff" />
            <Text style={styles.thumbnailText}>Retake</Text>
          </View>
        </Pressable>
      </View>

      {/* Item Details Card */}
      <SectionCard title="Item Details">
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>
            Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="e.g., Blue Cotton Shirt"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Category</Text>
          <Pressable
            style={styles.dropdown}
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <Text style={styles.dropdownText}>
              {categories.find((c) => c.value === category)?.label}
            </Text>
            <ChevronDown size={20} color="#6b7280" />
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

        <View style={styles.formRow}>
          <View style={styles.formFieldHalf}>
            <Text style={styles.fieldLabel}>Brand</Text>
            <TextInput
              style={styles.textInput}
              value={brand}
              onChangeText={setBrand}
              placeholder="e.g., Uniqlo"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.formFieldHalf}>
            <Text style={styles.fieldLabel}>Size</Text>
            <TextInput
              style={styles.textInput}
              value={size}
              onChangeText={setSize}
              placeholder="e.g., M, 32"
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Fabric</Text>
          <TextInput
            style={styles.textInput}
            value={fabric}
            onChangeText={setFabric}
            placeholder="e.g., 100% Cotton"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Colors</Text>
          <View style={styles.colorChips}>
            {itemColors.map((color, index) => (
              <View key={index} style={styles.colorChip}>
                <View
                  style={[styles.colorSwatch, { backgroundColor: color }]}
                />
                <Text style={styles.colorText}>{color}</Text>
              </View>
            ))}
          </View>
        </View>
      </SectionCard>

      {/* Attributes Card */}
      <SectionCard title="Attributes">
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Warmth Level</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Very Light</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={5}
              step={1}
              value={warmth}
              onValueChange={(value) => setWarmth(value as Warmth)}
              minimumTrackTintColor={colors.indigo600}
              maximumTrackTintColor="#e5e7eb"
              thumbTintColor={colors.indigo600}
            />
            <Text style={styles.sliderLabel}>Extra Warm</Text>
          </View>
          <Text style={styles.sliderValue}>Level {warmth}</Text>
        </View>

        <View style={styles.toggleRow}>
          <Pressable
            style={styles.toggleOption}
            onPress={() => setWaterproof(!waterproof)}
          >
            <View
              style={[styles.checkbox, waterproof && styles.checkboxChecked]}
            >
              {waterproof && <View style={styles.checkboxInner} />}
            </View>
            <Text style={styles.toggleText}>Waterproof</Text>
          </Pressable>

          <Pressable
            style={styles.toggleOption}
            onPress={() => setWindproof(!windproof)}
          >
            <View
              style={[styles.checkbox, windproof && styles.checkboxChecked]}
            >
              {windproof && <View style={styles.checkboxInner} />}
            </View>
            <Text style={styles.toggleText}>Windproof</Text>
          </Pressable>
        </View>
      </SectionCard>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <Button
          title={saving ? 'Adding...' : 'Add to Collection'}
          onPress={handleSave}
          variant="gradient"
          fullWidth
          disabled={saving || !name.trim()}
        />
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[colors.indigo600, colors.sky500, colors.indigo600]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topGradientLine}
        pointerEvents="none"
      />

      <View style={styles.header}>
        <View style={styles.headerButton}>
          <Button
            title="Cancel"
            variant="ghost"
            size="sm"
            onPress={() => router.dismiss()}
            icon={<ArrowLeft size={16} color="#7c3aed" />}
          />
        </View>
      </View>

      {renderScreen()}
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
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerButton: {
    alignSelf: 'flex-start',
  },

  // Capture screens (item & label photo)
  captureContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    justifyContent: 'center',
  },
  captureContent: {
    gap: spacing.lg,
  },
  stepText: {
    fontSize: 14,
    color: colors.indigo600,
    fontWeight: '600',
    textAlign: 'center',
  },
  captureTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.text_primary,
    textAlign: 'center',
  },
  captureSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  capturePreview: {
    aspectRatio: 3 / 4,
    borderRadius: radii.xl,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: colors.indigo100,
    marginVertical: spacing.md,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.indigo50,
    gap: spacing.sm,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.indigo400,
    fontWeight: '500',
  },

  // Form screen
  formContainer: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.text_primary,
    marginBottom: spacing.sm,
  },
  analyzingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.indigo50,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.indigo100,
  },
  analyzingText: {
    fontSize: 14,
    color: colors.indigo600,
    fontWeight: '500',
  },

  // Photo thumbnails
  photoThumbnails: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  thumbnailCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.indigo100,
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  thumbnailText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Form fields
  formField: {
    gap: spacing.xs,
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  formFieldHalf: {
    flex: 1,
    gap: spacing.xs,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text_primary,
  },
  required: {
    color: '#ef4444',
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.indigo100,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: theme.text_primary,
    backgroundColor: colors.white,
  },

  // Dropdown
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.indigo100,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
  },
  dropdownText: {
    fontSize: 16,
    color: theme.text_primary,
  },
  dropdownMenu: {
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.indigo100,
    borderRadius: radii.lg,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemSelected: {
    backgroundColor: colors.indigo50,
  },
  dropdownItemText: {
    fontSize: 16,
    color: theme.text_primary,
  },
  dropdownItemTextSelected: {
    color: colors.indigo600,
    fontWeight: '600',
  },

  // Color chips
  colorChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  colorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.lg,
    backgroundColor: colors.indigo50,
    borderWidth: 1,
    borderColor: colors.indigo100,
  },
  colorSwatch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  colorText: {
    fontSize: 12,
    color: theme.text_primary,
    fontWeight: '500',
  },

  // Slider
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  sliderValue: {
    fontSize: 14,
    color: colors.indigo600,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Toggles
  toggleRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  toggleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.indigo100,
    backgroundColor: colors.white,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.indigo300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.indigo600,
    borderColor: colors.indigo600,
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 3,
    backgroundColor: colors.white,
  },
  toggleText: {
    fontSize: 14,
    color: theme.text_primary,
    fontWeight: '500',
  },

  // Save button
  saveButtonContainer: {
    marginTop: spacing.md,
  },
});
