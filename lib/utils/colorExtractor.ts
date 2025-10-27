import * as ImageManipulator from 'expo-image-manipulator';

export async function extractDominantColor(
  imageUri: string
): Promise<string> {
  try {
    const manipResult = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 50, height: 50 } }],
      { format: ImageManipulator.SaveFormat.PNG }
    );

    return '#808080';
  } catch (error) {
    console.error('Failed to extract color:', error);
    return '#808080';
  }
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
