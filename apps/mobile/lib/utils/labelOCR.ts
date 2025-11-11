import * as FileSystem from 'expo-file-system';

/**
 * OCR result from analyzing a clothing label photo
 */
export interface LabelOCRResult {
  brand?: string;
  size?: string;
  fabric?: string;
  careInstructions?: string[];
  confidence: number; // 0-1 score
  rawText?: string; // Full extracted text (for future use)
}

/**
 * Extract text and structured data from a clothing label photo using OCR.
 *
 * NOTE: Real implementation would require:
 * - Native OCR library (e.g., react-native-text-recognition, Google ML Kit Vision)
 * - Server-side OCR API (e.g., Google Cloud Vision, AWS Textract, Azure Computer Vision)
 * - expo-barcode-scanner for QR codes on labels
 *
 * Current implementation generates realistic mock data based on image characteristics
 * to demonstrate the UX flow. The data is deterministic per image for consistency.
 */
export async function analyzeLabelPhoto(
  labelPhotoUri: string
): Promise<LabelOCRResult> {
  try {
    // Get image info for characteristics
    const imageInfo = await FileSystem.getInfoAsync(labelPhotoUri);

    // In production, this would:
    // 1. Send image to OCR API or use native OCR library
    // 2. Parse extracted text for clothing-specific patterns
    // 3. Return structured data with confidence scores

    // Generate realistic mock data based on image URI
    const mockResult = generateMockLabelData(labelPhotoUri, imageInfo);

    // Simulate processing delay (OCR typically takes 1-3 seconds)
    await new Promise((resolve) => setTimeout(resolve, 800));

    return mockResult;
  } catch (error) {
    console.error('Failed to analyze label:', error);
    return {
      confidence: 0,
      careInstructions: [],
    };
  }
}

/**
 * Generate realistic mock label data based on image characteristics.
 * Uses URI hash to create deterministic but varied results.
 */
function generateMockLabelData(
  labelPhotoUri: string,
  imageInfo: FileSystem.FileInfo
): LabelOCRResult {
  const hash = simpleHash(labelPhotoUri);

  // Common clothing brands
  const brands = [
    'Uniqlo',
    'H&M',
    'Zara',
    'Nike',
    'Adidas',
    'Gap',
    'Levi\'s',
    'Calvin Klein',
    'Ralph Lauren',
    'The North Face',
    'Patagonia',
    'Banana Republic',
    'J.Crew',
    'Everlane',
    'Madewell',
    'COS',
    'Muji',
    null, // 10% chance of no brand detected
  ];

  // Common sizes
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40'];

  // Common fabrics and blends
  const fabrics = [
    '100% Cotton',
    '100% Polyester',
    '100% Wool',
    '100% Linen',
    '95% Cotton, 5% Elastane',
    '80% Cotton, 20% Polyester',
    '70% Polyester, 30% Cotton',
    '60% Cotton, 40% Polyester',
    '50% Cotton, 50% Modal',
    'Cotton Blend',
    'Polyester Blend',
    'Nylon Blend',
  ];

  // Care instruction sets (realistic combinations)
  const careInstructionSets = [
    ['Machine wash cold', 'Tumble dry low', 'Do not bleach'],
    ['Machine wash warm', 'Tumble dry medium', 'Iron if needed'],
    ['Hand wash cold', 'Lay flat to dry', 'Do not bleach'],
    ['Dry clean only', 'Do not wash', 'Store hanging'],
    ['Machine wash cold', 'Hang to dry', 'Do not iron'],
    ['Cold water', 'Gentle cycle', 'Do not tumble dry'],
    ['Wash separately', 'Cold water', 'Tumble dry low'],
  ];

  // Select data based on hash for determinism
  const brandIndex = hash % brands.length;
  const sizeIndex = (hash * 7) % sizes.length;
  const fabricIndex = (hash * 13) % fabrics.length;
  const careIndex = (hash * 19) % careInstructionSets.length;

  // Confidence score (0.75 - 0.95 range for mock data)
  const confidence = 0.75 + ((hash % 20) / 100);

  return {
    brand: brands[brandIndex] || undefined,
    size: sizes[sizeIndex],
    fabric: fabrics[fabricIndex],
    careInstructions: careInstructionSets[careIndex],
    confidence: Math.min(confidence, 0.95),
    rawText: `Mock OCR text for ${labelPhotoUri.split('/').pop()}`,
  };
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

/**
 * Extract specific clothing attributes from raw OCR text.
 * This helper would be used with real OCR output to parse structured data.
 *
 * Pattern matching examples:
 * - Brand: Look for known brand names in first few lines
 * - Size: Match patterns like "SIZE: M", "S", "32W", etc.
 * - Fabric: Match percentage patterns like "100% Cotton" or "80% Polyester, 20% Cotton"
 * - Care: Look for washing symbols and care instruction keywords
 */
export function parseOCRText(rawText: string): Partial<LabelOCRResult> {
  const lines = rawText.split('\n').map((line) => line.trim());

  // This would contain regex patterns and NLP logic in a real implementation
  // For now, return empty partial result
  return {
    rawText,
    confidence: 0.5,
  };
}
