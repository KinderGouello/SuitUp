import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  StyleProp,
  TextStyle,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Check,
  RefreshCw,
  Sparkles,
  Trash2,
} from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { GradientCard } from '@/components/GradientCard';
import { useWardrobe } from '@/state/useWardrobe';
import * as outfitsRepo from '@/lib/db/repo/outfits';
import { Item, Outfit, OutfitSlot } from '@/lib/types';

type SwapContext = {
  slot: OutfitSlot;
  item: Item;
};

const primaryGradient = ['#7c3aed', '#ec4899'] as const;
const badgeGradient = ['#7c3aed', '#db2777'] as const;

export default function OutfitDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, loadItems } = useWardrobe();
  const insets = useSafeAreaInsets();

  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [swapContext, setSwapContext] = useState<SwapContext | null>(null);
  const [swapModalVisible, setSwapModalVisible] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async (showLoader = true) => {
    if (!id) return;

    if (showLoader) {
      setLoading(true);
    }

    try {
      await loadItems();
      const fetchedOutfit = await outfitsRepo.getOutfitById(id);
      setOutfit(fetchedOutfit);
      setHasGenerated(!!fetchedOutfit);
    } catch (error) {
      console.error('Failed to load outfit:', error);
      Alert.alert('Error', 'Failed to load outfit');
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  // const handleDelete = () => {
  //   Alert.alert(
  //     'Delete Outfit',
  //     'Are you sure you want to delete this outfit?',
  //     [
  //       { text: 'Cancel', style: 'cancel' },
  //       {
  //         text: 'Delete',
  //         style: 'destructive',
  //         onPress: async () => {
  //           if (!id) return;
  //           try {
  //             await outfitsRepo.deleteOutfit(id);
  //             router.back();
  //           } catch (error) {
  //             Alert.alert('Error', 'Failed to delete outfit');
  //           }
  //         },
  //       },
  //     ]
  //   );
  // };

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    await loadData(false);
    setIsGenerating(false);
    setHasGenerated(true);
  };

  const outfitItems = useMemo(() => {
    if (!outfit) return [];
    return outfit.items
      .map((oi) => items.find((item) => item.id === oi.itemId))
      .filter(Boolean) as Item[];
  }, [outfit, items]);

  const alternativeItems = useMemo(() => {
    return items.reduce<Record<string, Item[]>>((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
  }, [items]);

  const formattedDate = outfit
    ? new Date(outfit.createdAt).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const weatherTagline = outfit?.weather
    ? `Based on ${Math.round(outfit.weather.tempC)}°C • ${
        outfit.weather.condition
      }`
    : 'Based on your latest preferences';

  const openSwapModal = (item: Item) => {
    if (!outfit) return;
    const slot = outfit.items.find((oi) => oi.itemId === item.id)?.slot;
    if (!slot) return;
    setSwapContext({ slot, item });
    setSwapModalVisible(true);
  };

  const handleSwapSelection = (replacement: Item) => {
    if (!outfit || !swapContext) return;

    const updatedItems = outfit.items.map((outfitItem) =>
      outfitItem.itemId === swapContext.item.id
        ? { ...outfitItem, itemId: replacement.id }
        : outfitItem
    );

    setOutfit({ ...outfit, items: updatedItems });
    setSwapModalVisible(false);
    setSwapContext(null);
    Alert.alert('Item swapped', `Swapped to ${replacement.name}`);
  };

  const handleLaundry = (item: Item) => {
    if (!outfit) return;
    const alternatives =
      alternativeItems[item.category]?.filter((alt) => alt.id !== item.id) ||
      [];

    if (!alternatives.length) {
      Alert.alert(
        'No alternatives',
        'Add more wardrobe items in this category to swap automatically.'
      );
      return;
    }

    const randomAlt =
      alternatives[Math.floor(Math.random() * alternatives.length)];

    const updatedItems = outfit.items.map((outfitItem) =>
      outfitItem.itemId === item.id
        ? { ...outfitItem, itemId: randomAlt.id }
        : outfitItem
    );

    setOutfit({ ...outfit, items: updatedItems });
    Alert.alert(
      'Laundry noted',
      `${item.name} marked as in laundry. Auto-selected ${randomAlt.name}.`
    );
  };

  const selectedAlternatives = useMemo(() => {
    if (!swapContext) return [];
    const key = swapContext.item.category || swapContext.slot;
    return (
      alternativeItems[key]?.filter((alt) => alt.id !== swapContext.item.id) ||
      []
    );
  }, [swapContext, alternativeItems]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#7c3aed" />
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

  if (!hasGenerated) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.generationContainer}>
          <View style={styles.headerButton}>
            <Button
              title="Back"
              variant="ghost"
              size="sm"
              onPress={() => router.back()}
              icon={<ArrowLeft size={16} color="#7c3aed" />}
            />
          </View>

          <View style={styles.generationCard}>
            <View style={styles.sparklesOrb}>
              <GradientCard
                variant="orb"
                gradientColors={primaryGradient}
                icon={<Sparkles size={48} color="#fff" />}
              />
            </View>

            <GradientText textStyle={styles.generationTitle} align="center">
              Ready to Suit Up?
            </GradientText>

            <Text style={styles.generationDescription}>
              Let AI create your perfect outfit based on today's weather and
              your style preferences.
            </Text>

            {isGenerating ? (
              <View style={styles.progressWrapper}>
                <View style={styles.progressStatus}>
                  <RefreshCw size={18} color="#7c3aed" />
                  <Text style={styles.progressLabel}>
                    Analyzing your wardrobe...
                  </Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: '66%' }]} />
                </View>
              </View>
            ) : (
              <Button
                title="Generate My Outfit"
                onPress={handleGenerate}
                variant="gradient"
                fullWidth
                icon={<Sparkles size={18} color="#fff" />}
              />
            )}

            <Text style={styles.helperText}>
              Based on 22° • Partly Cloudy • Casual Style
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#7c3aed', '#38bdf8', '#7c3aed']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topGradientLine}
        pointerEvents="none"
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <View style={styles.headerButton}>
            <Button
              title="Back to Home"
              variant="ghost"
              size="sm"
              onPress={() => router.back()}
              icon={<ArrowLeft size={16} color="#7c3aed" />}
            />
          </View>

          <View style={styles.headerRow}>
            <GradientText textStyle={styles.headerTitle}>
              Today&apos;s Outfit
            </GradientText>

            <Pressable
              style={({ pressed }) => [
                styles.regenerateButton,
                pressed && styles.regenerateButtonPressed,
                isGenerating && styles.regenerateButtonDisabled,
              ]}
              onPress={handleGenerate}
              disabled={isGenerating}
              hitSlop={8}
            >
              {isGenerating ? (
                <ActivityIndicator size="small" color="#7c3aed" />
              ) : (
                <View style={styles.regenerateButtonContent}>
                  <RefreshCw size={16} color="#7c3aed" />
                  <Text style={styles.regenerateButtonText}>Regenerate</Text>
                </View>
              )}
            </Pressable>
          </View>
          <Text style={styles.headerSub}>{formattedDate}</Text>
        </View>

        <View style={styles.styleMatchCard}>
          <GradientCard
            variant="subtle"
            gradientColors={['#f5f3ff', '#fff']}
          >
            <View style={styles.styleMatchHeader}>
              <Text style={styles.styleMatchLabel}>Style Match</Text>
              <LinearGradient
                colors={badgeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.badge}
              >
                <Text style={styles.badgeText}>Perfect Match</Text>
              </LinearGradient>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '95%' }]} />
            </View>
            <Text style={styles.styleMatchNote}>
              This outfit perfectly matches your preferences and the weather!
            </Text>
          </GradientCard>
        </View>

        <View style={styles.itemsSection}>
          {outfitItems.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemImageWrapper}>
                {imageErrors[item.id] || !item.photoUri ? (
                  <View style={styles.itemImageFallback}>
                    <Sparkles size={20} color="#a855f7" />
                  </View>
                ) : (
                  <Image
                    source={{ uri: item.photoUri }}
                    style={styles.itemImage}
                    onError={() =>
                      setImageErrors((prev) => ({ ...prev, [item.id]: true }))
                    }
                  />
                )}
              </View>

              <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                  <View style={styles.badgePill}>
                    <Text style={styles.badgePillText}>
                      {formatCategory(item.category)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.reasonRow}>
                  <Sparkles size={16} color="#a855f7" />
                  <Text style={styles.reasonText}>
                    {buildReason(item.category, outfit)}
                  </Text>
                </View>
                <View style={styles.itemActions}>
                  <Pressable
                    style={styles.swapButton}
                    onPress={() => openSwapModal(item)}
                  >
                    <RefreshCw size={14} color="#7c3aed" />
                    <Text style={styles.swapButtonText}>Swap</Text>
                  </Pressable>
                  <Pressable
                    style={styles.laundryButton}
                    onPress={() => handleLaundry(item)}
                  >
                    <Trash2 size={14} color="#fb923c" />
                    <Text style={styles.laundryButtonText}>In Laundry</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* <View style={styles.actions}>
          <Button
            title="Love It! Suit Up"
            variant="gradient"
            size="lg"
            fullWidth
            onPress={() =>
              Alert.alert('Suit up', 'Enjoy your perfectly matched outfit!')
            }
            icon={<Check size={18} color="#fff" />}
          />
          <Button
            title="Delete Outfit"
            onPress={handleDelete}
            variant="secondary"
            fullWidth
            icon={<Trash2 size={16} color="#7c3aed" />}
          />
          <Text style={styles.helperText}>{weatherTagline}</Text>
        </View> */}
      </ScrollView>

      <Modal
        visible={swapModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSwapModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            {swapContext && (
              <>
                <Text style={styles.modalTitle}>
                  Swap {formatCategory(swapContext.item.category)}
                </Text>
                <Text style={styles.modalDescription}>
                  Choose an alternative from your wardrobe
                </Text>

                <View style={styles.alternativeGrid}>
                  {selectedAlternatives.map((alternative) => (
                    <Pressable
                      key={alternative.id}
                      style={styles.alternativeCard}
                      onPress={() => handleSwapSelection(alternative)}
                    >
                      {imageErrors[alternative.id] || !alternative.photoUri ? (
                        <View style={styles.alternativeImageFallback}>
                          <Sparkles size={18} color="#fff" />
                        </View>
                      ) : (
                        <Image
                          source={{ uri: alternative.photoUri }}
                          style={styles.alternativeImage}
                          onError={() =>
                            setImageErrors((prev) => ({
                              ...prev,
                              [alternative.id]: true,
                            }))
                          }
                        />
                      )}
                      <LinearGradient
                        colors={['rgba(0,0,0,0.6)', 'transparent']}
                        start={{ x: 0.5, y: 1 }}
                        end={{ x: 0.5, y: 0 }}
                        style={styles.alternativeOverlay}
                      />
                      <Text style={styles.alternativeName}>
                        {alternative.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Button
                  title="Cancel"
                  variant="outline"
                  fullWidth
                  onPress={() => setSwapModalVisible(false)}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

type GradientTextProps = {
  children: ReactNode;
  textStyle: StyleProp<TextStyle>;
  align?: 'start' | 'center';
};

const GradientText = ({
  children,
  textStyle,
  align = 'start',
}: GradientTextProps) => {
  const flattened = StyleSheet.flatten(textStyle) || {};
  const { color: _ignored, ...restStyle } = flattened;

  const textValue = getTextFromChildren(children);
  if (!textValue) {
    return <Text style={restStyle}>{children}</Text>;
  }

  const characters = textValue.split('');

  return (
    <View
      style={[
        styles.gradientWrapper,
        align === 'center' && styles.gradientWrapperCenter,
      ]}
    >
      <Text style={restStyle}>
        {characters.map((char, index) => (
          <Text
            key={`${char}-${index}`}
            style={{
              color: getGradientColor(
                primaryGradient[0],
                primaryGradient[1],
                characters.length,
                index
              ),
            }}
          >
            {char}
          </Text>
        ))}
      </Text>
    </View>
  );
};

const hexToRgb = (hex: string) => {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')}`;

const getGradientColor = (
  start: string,
  end: string,
  total: number,
  index: number
) => {
  if (total <= 1) return start;
  const factor = index / (total - 1);
  const startRgb = hexToRgb(start);
  const endRgb = hexToRgb(end);
  const r = Math.round(startRgb.r + (endRgb.r - startRgb.r) * factor);
  const g = Math.round(startRgb.g + (endRgb.g - startRgb.g) * factor);
  const b = Math.round(startRgb.b + (endRgb.b - startRgb.b) * factor);
  return rgbToHex(r, g, b);
};

const getTextFromChildren = (children: ReactNode): string => {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(getTextFromChildren).join('');
  }

  return '';
};

const formatCategory = (category: string) => {
  if (!category) return 'Item';
  return category.charAt(0).toUpperCase() + category.slice(1);
};

const buildReason = (category: string, outfit: Outfit | null) => {
  if (!outfit?.weather) {
    return 'Matches your saved style preferences.';
  }

  const temp = Math.round(outfit.weather.tempC);
  const condition = outfit.weather.condition.toLowerCase();

  switch (category) {
    case 'top':
      return `Light & breathable for ${temp}° and ${condition}.`;
    case 'bottom':
      return `Versatile choice for the ${condition} forecast.`;
    case 'shoes':
      return `Comfortable pick for today's plans.`;
    default:
      return `Fits perfectly with ${condition} conditions.`;
  }
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topGradientLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    zIndex: 10,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    gap: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
    backgroundColor: '#ffffff',
  },
  errorText: {
    fontSize: 16,
    color: '#737373',
  },
  headerSection: {
    gap: 12,
    paddingTop: 8,
  },
  headerButton: {
    alignSelf: 'flex-start',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  gradientWrapper: {
    alignSelf: 'flex-start',
  },
  gradientWrapperCenter: {
    alignSelf: 'center',
  },
  headerSub: {
    fontSize: 14,
    color: '#6b7280',
  },
  styleMatchCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ede9fe',
  },
  styleMatchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  styleMatchLabel: {
    fontSize: 14,
    color: '#4b5563',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#ede9fe',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#7c3aed',
  },
  styleMatchNote: {
    fontSize: 12,
    color: '#6b7280',
  },
  itemsSection: {
    gap: 16,
  },
  itemCard: {
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ede9fe',
    padding: 12,
    gap: 16,
    backgroundColor: '#fff',
  },
  itemImageWrapper: {
    width: 96,
    height: 96,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: '#ede9fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemImageFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ede9fe',
  },
  itemContent: {
    flex: 1,
    gap: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgePill: {
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgePillText: {
    color: '#7c3aed',
    fontSize: 12,
    fontWeight: '600',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reasonText: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  swapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#d8b4fe',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  swapButtonText: {
    color: '#7c3aed',
    fontSize: 12,
    fontWeight: '600',
  },
  laundryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#fed7aa',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  laundryButtonText: {
    color: '#fb923c',
    fontSize: 12,
    fontWeight: '600',
  },
  regenerateButton: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#e9d5ff',
    backgroundColor: '#fdf4ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  regenerateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  regenerateButtonPressed: {
    backgroundColor: '#f5f3ff',
  },
  regenerateButtonDisabled: {
    opacity: 0.75,
  },
  regenerateButtonText: {
    color: '#7c3aed',
    fontWeight: '600',
  },
  actions: {
    gap: 12,
  },
  helperText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  generationContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 48,
  },
  generationCard: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ede9fe',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: '#fff',
  },
  sparklesOrb: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 4,
    backgroundColor: '#ede9fe',
  },
  generationTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  generationDescription: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
  },
  progressWrapper: {
    width: '100%',
    gap: 8,
  },
  progressStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
  },
  progressLabel: {
    color: '#7c3aed',
    fontSize: 14,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  modalDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  alternativeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  alternativeCard: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ede9fe',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  alternativeImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  alternativeImageFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#a855f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alternativeOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  alternativeName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    padding: 8,
  },
});
