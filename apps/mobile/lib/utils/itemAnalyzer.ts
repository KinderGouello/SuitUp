import { extractDominantColors } from './colorExtractor';
import { analyzeLabelPhoto, LabelOCRResult } from './labelOCR';
import { Category, Warmth } from '../types';

/**
 * Complete analysis result for a clothing item
 */
export interface ItemAnalysisResult {
  // From color extraction
  colors: string[];

  // From label OCR
  brand?: string;
  size?: string;
  fabric?: string;
  careInstructions?: string[];

  // Inferred attributes
  suggestedCategory: Category;
  warmth: Warmth;
  waterproof: boolean;
  windproof: boolean;

  // Metadata
  confidence: number; // Overall confidence 0-1
  processingTime: number; // milliseconds
}

/**
 * Analyze both item photo and label photo to extract and infer all item attributes.
 * This is the main orchestration function that combines color extraction, OCR,
 * and intelligent inference of clothing properties.
 *
 * @param itemPhotoUri - URI of the main item photo
 * @param labelPhotoUri - URI of the clothing label photo
 * @returns Complete analysis with colors, label data, and inferred attributes
 */
export async function analyzeItem(
  itemPhotoUri: string,
  labelPhotoUri: string
): Promise<ItemAnalysisResult> {
  const startTime = Date.now();

  try {
    // Run color extraction and OCR in parallel
    const [colors, labelData] = await Promise.all([
      extractDominantColors(itemPhotoUri),
      analyzeLabelPhoto(labelPhotoUri),
    ]);

    // Infer category from fabric and other clues
    const suggestedCategory = inferCategory(labelData, colors);

    // Infer warmth from fabric composition
    const warmth = inferWarmth(labelData.fabric, suggestedCategory);

    // Infer weather properties from fabric
    const waterproof = inferWaterproof(labelData.fabric);
    const windproof = inferWindproof(labelData.fabric);

    const processingTime = Date.now() - startTime;

    return {
      colors,
      brand: labelData.brand,
      size: labelData.size,
      fabric: labelData.fabric,
      careInstructions: labelData.careInstructions,
      suggestedCategory,
      warmth,
      waterproof,
      windproof,
      confidence: labelData.confidence,
      processingTime,
    };
  } catch (error) {
    console.error('Failed to analyze item:', error);

    // Return minimal fallback result
    return {
      colors: ['#808080'],
      suggestedCategory: 'top',
      warmth: 2,
      waterproof: false,
      windproof: false,
      confidence: 0,
      processingTime: Date.now() - startTime,
    };
  }
}

/**
 * Infer the most likely category based on fabric type, colors, and other clues.
 * In a real implementation, this would use ML or more sophisticated heuristics.
 */
function inferCategory(
  labelData: LabelOCRResult,
  colors: string[]
): Category {
  const fabric = (labelData.fabric || '').toLowerCase();
  const brand = (labelData.brand || '').toLowerCase();

  // Athleisure indicators
  if (
    fabric.includes('polyester') ||
    fabric.includes('spandex') ||
    fabric.includes('elastane') ||
    fabric.includes('nylon') ||
    brand.includes('nike') ||
    brand.includes('adidas')
  ) {
    return 'athleisure';
  }

  // Outerwear indicators
  if (
    fabric.includes('wool') ||
    fabric.includes('fleece') ||
    fabric.includes('down') ||
    brand.includes('north face') ||
    brand.includes('patagonia')
  ) {
    return 'outerwear';
  }

  // Dress indicators (typically lighter, flowy fabrics)
  if (
    fabric.includes('silk') ||
    fabric.includes('chiffon') ||
    fabric.includes('rayon') ||
    fabric.includes('modal')
  ) {
    // Could be dress or top
    return Math.random() > 0.5 ? 'dress' : 'top';
  }

  // Denim = bottom
  if (fabric.includes('denim') || brand.includes('levi')) {
    return 'bottom';
  }

  // Default to top (most common)
  return 'top';
}

/**
 * Infer warmth level (0-5) based on fabric composition and category.
 *
 * Warmth scale:
 * 0 - Very light (summer tank tops, silk)
 * 1 - Light (t-shirts, light cotton)
 * 2 - Medium (regular shirts, light sweaters)
 * 3 - Warm (sweaters, hoodies, fleece)
 * 4 - Very warm (thick wool, insulated jackets)
 * 5 - Extra warm (heavy coats, down jackets)
 */
function inferWarmth(fabric: string | undefined, category: Category): Warmth {
  if (!fabric) return 2; // Default medium

  const fabricLower = fabric.toLowerCase();

  // Very warm fabrics
  if (
    fabricLower.includes('wool') ||
    fabricLower.includes('cashmere') ||
    fabricLower.includes('down') ||
    fabricLower.includes('fleece')
  ) {
    return category === 'outerwear' ? 5 : 4;
  }

  // Light fabrics
  if (
    fabricLower.includes('linen') ||
    fabricLower.includes('silk') ||
    fabricLower.includes('rayon') ||
    fabricLower.includes('modal')
  ) {
    return 1;
  }

  // Athletic/synthetic (usually light to medium)
  if (
    fabricLower.includes('polyester') ||
    fabricLower.includes('nylon') ||
    fabricLower.includes('spandex')
  ) {
    return category === 'outerwear' ? 3 : 1;
  }

  // Cotton (most common, medium warmth)
  if (fabricLower.includes('cotton')) {
    return 2;
  }

  // Denim (medium-warm)
  if (fabricLower.includes('denim')) {
    return 2;
  }

  // Default
  return 2;
}

/**
 * Infer if item is waterproof based on fabric composition.
 */
function inferWaterproof(fabric: string | undefined): boolean {
  if (!fabric) return false;

  const fabricLower = fabric.toLowerCase();

  // Waterproof indicators
  return (
    fabricLower.includes('polyester') ||
    fabricLower.includes('nylon') ||
    fabricLower.includes('gore-tex') ||
    fabricLower.includes('waterproof') ||
    fabricLower.includes('water-resistant')
  );
}

/**
 * Infer if item is windproof based on fabric composition.
 */
function inferWindproof(fabric: string | undefined): boolean {
  if (!fabric) return false;

  const fabricLower = fabric.toLowerCase();

  // Windproof indicators
  return (
    fabricLower.includes('nylon') ||
    fabricLower.includes('polyester') ||
    fabricLower.includes('windproof') ||
    fabricLower.includes('wind-resistant') ||
    fabricLower.includes('fleece')
  );
}

/**
 * Generate a suggested item name based on category and analysis.
 * More intelligent than random selection - considers fabric and brand.
 */
export function suggestItemName(
  category: Category,
  analysisResult: Partial<ItemAnalysisResult>
): string {
  const fabric = (analysisResult.fabric || '').toLowerCase();
  const brand = analysisResult.brand || '';

  // Category-specific suggestions with fabric consideration
  switch (category) {
    case 'top':
      if (fabric.includes('cotton')) return 'Cotton Shirt';
      if (fabric.includes('linen')) return 'Linen Shirt';
      if (fabric.includes('silk')) return 'Silk Blouse';
      if (fabric.includes('wool')) return 'Wool Sweater';
      return 'Shirt';

    case 'bottom':
      if (fabric.includes('denim')) return 'Jeans';
      if (fabric.includes('cotton')) return 'Cotton Pants';
      if (fabric.includes('linen')) return 'Linen Trousers';
      return 'Pants';

    case 'dress':
      if (fabric.includes('silk')) return 'Silk Dress';
      if (fabric.includes('cotton')) return 'Cotton Dress';
      if (fabric.includes('linen')) return 'Linen Dress';
      return 'Dress';

    case 'outerwear':
      if (fabric.includes('wool')) return 'Wool Coat';
      if (fabric.includes('down')) return 'Down Jacket';
      if (fabric.includes('fleece')) return 'Fleece Jacket';
      if (fabric.includes('denim')) return 'Denim Jacket';
      return 'Jacket';

    case 'shoes':
      if (brand.toLowerCase().includes('nike')) return 'Nike Sneakers';
      if (brand.toLowerCase().includes('adidas')) return 'Adidas Sneakers';
      return 'Shoes';

    case 'accessory':
      if (fabric.includes('wool')) return 'Wool Scarf';
      if (fabric.includes('silk')) return 'Silk Scarf';
      return 'Accessory';

    case 'athleisure':
      if (brand) return `${brand} Athletic Wear`;
      return 'Athletic Wear';

    default:
      return 'Item';
  }
}
