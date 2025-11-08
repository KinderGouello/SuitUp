import { Item, Outfit } from '@/lib/types';
import * as itemsRepo from './repo/items';
import * as outfitsRepo from './repo/outfits';

export const SEED_ITEMS: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'White Cotton T-Shirt',
    photoUri: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg',
    labelPhotoUri: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg',
    category: 'top',
    subcategory: 'tee',
    brand: 'Uniqlo',
    size: 'M',
    colors: ['#FFFFFF'],
    fabric: 'cotton',
    warmth: 0,
    waterproof: false,
    windproof: false,
    formalLevel: 1,
    seasons: ['spring', 'summer', 'fall'],
    tags: ['casual', 'basic'],
    notes: 'Perfect for layering or wearing on its own',
    archived: false,
  },
  {
    name: 'Blue Oxford Shirt',
    photoUri: 'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg',
    labelPhotoUri: 'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg',
    category: 'top',
    subcategory: 'shirt',
    brand: 'Brooks Brothers',
    size: 'L',
    colors: ['#4A90E2'],
    fabric: 'cotton',
    warmth: 0,
    waterproof: false,
    windproof: false,
    formalLevel: 2,
    seasons: ['spring', 'summer', 'fall'],
    tags: ['smart casual'],
    notes: 'Great for office or semi-formal occasions',
    archived: false,
  },
  {
    name: 'Gray Hoodie',
    photoUri: 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg',
    category: 'top',
    subcategory: 'hoodie',
    colors: ['#808080'],
    fabric: 'cotton',
    warmth: 1,
    waterproof: false,
    windproof: false,
    formalLevel: 1,
    seasons: ['fall', 'winter', 'spring'],
    tags: ['casual', 'comfortable'],
    archived: false,
  },
  {
    name: 'Denim Jacket',
    photoUri: 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg',
    labelPhotoUri: 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg',
    category: 'outerwear',
    subcategory: 'jacket',
    brand: "Levi's",
    size: 'M',
    colors: ['#4169E1'],
    fabric: 'denim',
    warmth: 1,
    waterproof: false,
    windproof: true,
    formalLevel: 1,
    seasons: ['spring', 'fall'],
    tags: ['casual'],
    archived: false,
  },
  {
    name: 'Black Trench Coat',
    photoUri: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
    category: 'outerwear',
    subcategory: 'coat',
    colors: ['#000000'],
    fabric: 'cotton',
    warmth: 2,
    waterproof: true,
    windproof: true,
    formalLevel: 2,
    seasons: ['fall', 'spring'],
    tags: ['elegant'],
    archived: false,
  },
  {
    name: 'Wool Coat',
    photoUri: 'https://images.pexels.com/photos/3755021/pexels-photo-3755021.jpeg',
    category: 'outerwear',
    subcategory: 'coat',
    colors: ['#654321'],
    fabric: 'wool',
    warmth: 3,
    waterproof: false,
    windproof: true,
    formalLevel: 2,
    seasons: ['winter'],
    tags: ['warm', 'formal'],
    archived: false,
  },
  {
    name: 'Blue Jeans',
    photoUri: 'https://images.pexels.com/photos/1082526/pexels-photo-1082526.jpeg',
    category: 'bottom',
    subcategory: 'jeans',
    colors: ['#1E3A8A'],
    fabric: 'denim',
    warmth: 0,
    waterproof: false,
    windproof: false,
    formalLevel: 1,
    seasons: ['spring', 'summer', 'fall', 'winter'],
    tags: ['casual', 'versatile'],
    archived: false,
  },
  {
    name: 'Beige Chinos',
    photoUri: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg',
    category: 'bottom',
    subcategory: 'chinos',
    colors: ['#F5DEB3'],
    fabric: 'cotton',
    warmth: 0,
    waterproof: false,
    windproof: false,
    formalLevel: 2,
    seasons: ['spring', 'summer', 'fall'],
    tags: ['smart casual'],
    archived: false,
  },
  {
    name: 'Khaki Shorts',
    photoUri: 'https://images.pexels.com/photos/1261422/pexels-photo-1261422.jpeg',
    category: 'bottom',
    subcategory: 'shorts',
    colors: ['#C3B091'],
    fabric: 'cotton',
    warmth: 0,
    waterproof: false,
    windproof: false,
    formalLevel: 1,
    seasons: ['summer'],
    tags: ['casual', 'summer'],
    archived: false,
  },
  {
    name: 'White Sneakers',
    photoUri: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg',
    category: 'shoes',
    subcategory: 'sneakers',
    colors: ['#FFFFFF'],
    fabric: 'synthetic',
    warmth: 0,
    waterproof: false,
    windproof: false,
    formalLevel: 1,
    seasons: ['spring', 'summer', 'fall'],
    tags: ['casual', 'comfortable'],
    archived: false,
  },
  {
    name: 'Brown Leather Boots',
    photoUri: 'https://images.pexels.com/photos/1460838/pexels-photo-1460838.jpeg',
    labelPhotoUri: 'https://images.pexels.com/photos/1460838/pexels-photo-1460838.jpeg',
    category: 'shoes',
    subcategory: 'boots',
    brand: 'Clarks',
    size: '10',
    colors: ['#8B4513'],
    fabric: 'leather',
    warmth: 1,
    waterproof: true,
    windproof: false,
    formalLevel: 2,
    seasons: ['fall', 'winter'],
    tags: ['durable'],
    notes: 'Comfortable for all-day wear, great traction',
    archived: false,
  },
  {
    name: 'Black Leather Belt',
    photoUri: 'https://images.pexels.com/photos/2562878/pexels-photo-2562878.jpeg',
    category: 'accessory',
    subcategory: 'belt',
    colors: ['#000000'],
    fabric: 'leather',
    warmth: 0,
    waterproof: false,
    windproof: false,
    formalLevel: 2,
    seasons: ['spring', 'summer', 'fall', 'winter'],
    tags: ['accessory'],
    archived: false,
  },
];

const OUTFIT_SEEDS = [
  {
    name: 'Casual Cloudy Day',
    explanation:
      "Light layers to stay comfy in today's mild, partly cloudy weather.",
    weather: {
      takenAt: Date.now(),
      lat: 48.8566,
      lon: 2.3522,
      city: 'Paris',
      tempC: 22,
      tempMinC: 19,
      tempMaxC: 24,
      feelsLikeC: 23,
      windKph: 8,
      precipMm: 1,
      condition: 'Partly Cloudy',
    },
    slots: [
      { slot: 'top', itemName: 'White Cotton T-Shirt' },
      { slot: 'outerwear', itemName: 'Denim Jacket' },
      { slot: 'bottom', itemName: 'Blue Jeans' },
      { slot: 'shoes', itemName: 'White Sneakers' },
    ],
  },
  {
    name: 'Smart Casual Rain Check',
    explanation:
      'A polished combo that keeps you dry and ready for drizzly meetings.',
    weather: {
      takenAt: Date.now(),
      lat: 40.7128,
      lon: -74.006,
      city: 'New York',
      tempC: 16,
      tempMinC: 14,
      tempMaxC: 18,
      feelsLikeC: 15,
      windKph: 12,
      precipMm: 6,
      condition: 'Light Rain',
    },
    slots: [
      { slot: 'top', itemName: 'Blue Oxford Shirt' },
      { slot: 'outerwear', itemName: 'Black Trench Coat' },
      { slot: 'bottom', itemName: 'Beige Chinos' },
      { slot: 'shoes', itemName: 'Brown Leather Boots' },
      { slot: 'accessory', itemName: 'Black Leather Belt' },
    ],
  },
];

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

async function seedItemsIfNeeded(): Promise<Item[]> {
  const existingItems = await itemsRepo.getAllItems();

  if (existingItems.length > 0) {
    console.log('Items already seeded');
    return existingItems;
  }

  for (const seedItem of SEED_ITEMS) {
    const item: Item = {
      ...seedItem,
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await itemsRepo.createItem(item);
  }

  console.log(`Seeded ${SEED_ITEMS.length} items`);
  return itemsRepo.getAllItems();
}

async function seedOutfitsIfNeeded(items: Item[]) {
  const existingOutfits = await outfitsRepo.getAllOutfits();
  if (existingOutfits.length > 0) {
    console.log('Outfits already seeded');
    return;
  }

  const itemsByName = new Map(items.map((item) => [item.name, item]));

  for (const outfitSeed of OUTFIT_SEEDS) {
    const resolvedItems = outfitSeed.slots
      .map(({ slot, itemName }) => {
        const item = itemsByName.get(itemName);
        if (!item) {
          console.warn(
            `Skipping ${outfitSeed.name}: missing item "${itemName}" in wardrobe seed`
          );
          return null;
        }
        return { slot, itemId: item.id };
      })
      .filter(Boolean) as Outfit['items'];

    if (resolvedItems.length !== outfitSeed.slots.length) {
      continue;
    }

    const outfit: Outfit = {
      id: generateId(),
      createdAt: Date.now(),
      explanation: outfitSeed.explanation,
      items: resolvedItems,
      weather: outfitSeed.weather,
    };

    await outfitsRepo.createOutfit(outfit);
  }

  console.log(`Seeded ${OUTFIT_SEEDS.length} outfits`);
}

export async function seedDatabase(): Promise<void> {
  try {
    const items = await seedItemsIfNeeded();
    await seedOutfitsIfNeeded(items);
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
}
