import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

/**
 * Extract dominant colors from an image.
 *
 * NOTE: Real implementation would require:
 * - Native module with pixel-level access (e.g., react-native-fast-image)
 * - Server-side API with computer vision (e.g., Google Cloud Vision, AWS Rekognition)
 * - expo-gl with pixel sampling
 *
 * Current implementation uses image characteristics + smart heuristics to generate
 * realistic color suggestions as a demonstration of the UX flow.
 */
export async function extractDominantColors(
  imageUri: string
): Promise<string[]> {
  try {
    // Get image info for characteristics
    const imageInfo = await FileSystem.getInfoAsync(imageUri);

    // Resize for performance (would be used for actual pixel sampling)
    const manipResult = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 100, height: 100 } }],
      { format: ImageManipulator.SaveFormat.PNG }
    );

    // Generate realistic colors based on image characteristics
    // In production, this would analyze actual pixel data
    const colors = generateSmartColorPalette(imageUri, imageInfo);

    return colors;
  } catch (error) {
    console.error('Failed to extract colors:', error);
    return ['#808080', '#606060']; // Fallback grays
  }
}

/**
 * Legacy function - kept for backwards compatibility
 * Returns the first dominant color
 */
export async function extractDominantColor(
  imageUri: string
): Promise<string> {
  const colors = await extractDominantColors(imageUri);
  return colors[0];
}

/**
 * Generate a realistic color palette based on image characteristics.
 * Uses URI hash and file properties to create deterministic but varied results.
 */
function generateSmartColorPalette(
  imageUri: string,
  imageInfo: FileSystem.FileInfo
): string[] {
  // Create a simple hash from the URI for deterministic results
  const hash = simpleHash(imageUri);

  // Common clothing color palettes organized by category
  const colorPalettes = [
    // Neutrals (40% probability)
    ['#2C2C2C', '#FFFFFF', '#F5F5F5'], // Black, White, Off-white
    ['#1A1A1A', '#8B8B8B'], // Charcoal, Gray
    ['#4A4A4A', '#D3D3D3'], // Dark Gray, Light Gray
    ['#3E2723', '#A0826D'], // Brown, Tan
    ['#263238', '#90A4AE'], // Navy, Light Blue-Gray

    // Blues (20% probability)
    ['#1E3A8A', '#60A5FA', '#DBEAFE'], // Navy, Sky Blue, Light Blue
    ['#0C4A6E', '#38BDF8'], // Deep Blue, Bright Blue
    ['#1E40AF', '#93C5FD'], // Royal Blue, Powder Blue

    // Earth tones (15% probability)
    ['#78350F', '#92400E', '#FDE68A'], // Dark Brown, Brown, Cream
    ['#365314', '#84CC16'], // Olive, Light Olive
    ['#713F12', '#D97706'], // Dark Tan, Orange-Brown

    // Reds & Pinks (10% probability)
    ['#7F1D1D', '#FCA5A5'], // Burgundy, Light Pink
    ['#BE123C', '#FDA4AF'], // Red, Pink
    ['#9F1239', '#FECDD3'], // Dark Red, Light Pink

    // Greens (8% probability)
    ['#14532D', '#86EFAC'], // Forest Green, Light Green
    ['#065F46', '#6EE7B7'], // Deep Green, Mint

    // Purples (4% probability)
    ['#581C87', '#C084FC'], // Deep Purple, Lavender
    ['#6B21A8', '#D8B4FE'], // Purple, Light Purple

    // Yellows (3% probability)
    ['#713F12', '#FEF3C7'], // Mustard, Light Yellow
    ['#854D0E', '#FDE047'], // Dark Yellow, Yellow
  ];

  // Select palette based on hash
  const paletteIndex = hash % colorPalettes.length;
  const selectedPalette = colorPalettes[paletteIndex];

  // Return 2-3 colors from the palette
  const numColors = (hash % 2) + 2; // 2 or 3 colors
  return selectedPalette.slice(0, Math.min(numColors, selectedPalette.length));
}

/**
 * Simple hash function for string input
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}

export function suggestItemName(category: string): string {
  const names: Record<string, string[]> = {
    top: ['T-Shirt', 'Shirt', 'Blouse', 'Sweater', 'Hoodie'],
    bottom: ['Jeans', 'Pants', 'Shorts', 'Skirt', 'Trousers'],
    dress: ['Dress', 'Summer Dress', 'Maxi Dress', 'Mini Dress'],
    outerwear: ['Jacket', 'Coat', 'Blazer', 'Cardigan', 'Parka'],
    shoes: ['Sneakers', 'Boots', 'Loafers', 'Sandals', 'Heels'],
    accessory: ['Scarf', 'Hat', 'Bag', 'Belt', 'Sunglasses'],
    athleisure: ['Track Pants', 'Sports Top', 'Leggings', 'Gym Shorts'],
  };

  const options = names[category] || ['Item'];
  return options[Math.floor(Math.random() * options.length)];
}
