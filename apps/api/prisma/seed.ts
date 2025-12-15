import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'test@suitup.app' },
    update: {},
    create: {
      email: 'test@suitup.app',
      name: 'Test User',
    },
  });

  console.log('✅ Created user:', user.email);

  // Create user preferences
  const preferences = await prisma.preferences.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      styleArchetype: 'minimal',
      colorPalette: 'neutral',
      formalityLevel: 6,
      avoidedTags: ['loud', 'neon'],
      preferredSeasons: ['spring', 'fall'],
    },
  });

  console.log('✅ Created preferences for user');

  // Create user settings
  const settings = await prisma.settings.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      locationMode: 'manual',
      manualCity: 'San Francisco',
      manualCountry: 'USA',
      temperatureUnit: 'celsius',
      onboardingCompleted: true,
    },
  });

  console.log('✅ Created settings for user');

  // Create sample wardrobe items
  const items = await Promise.all([
    prisma.item.create({
      data: {
        userId: user.id,
        name: 'White Oxford Shirt',
        category: 'top',
        colors: ['#FFFFFF'],
        brand: 'J.Crew',
        warmth: 1,
        waterproof: false,
        windproof: false,
        formality: 8,
        tags: ['work', 'formal', 'classic'],
        seasons: ['spring', 'summer', 'fall'],
        timesWorn: 12,
      },
    }),
    prisma.item.create({
      data: {
        userId: user.id,
        name: 'Dark Denim Jeans',
        category: 'bottom',
        colors: ['#1B2845'],
        brand: 'Levi\'s',
        warmth: 2,
        waterproof: false,
        windproof: false,
        formality: 5,
        tags: ['casual', 'versatile'],
        seasons: ['spring', 'fall', 'winter'],
        timesWorn: 25,
      },
    }),
    prisma.item.create({
      data: {
        userId: user.id,
        name: 'Navy Blazer',
        category: 'outerwear',
        colors: ['#000080'],
        brand: 'Suit Supply',
        warmth: 3,
        waterproof: false,
        windproof: true,
        formality: 9,
        tags: ['work', 'formal', 'smart'],
        seasons: ['spring', 'fall', 'winter'],
        timesWorn: 8,
      },
    }),
    prisma.item.create({
      data: {
        userId: user.id,
        name: 'Brown Leather Shoes',
        category: 'shoes',
        colors: ['#8B4513'],
        brand: 'Allen Edmonds',
        warmth: 1,
        waterproof: false,
        windproof: false,
        formality: 8,
        tags: ['formal', 'classic'],
        seasons: ['spring', 'summer', 'fall', 'winter'],
        timesWorn: 15,
      },
    }),
  ]);

  console.log(`✅ Created ${items.length} wardrobe items`);

  // Create a sample outfit
  const outfit = await prisma.outfit.create({
    data: {
      userId: user.id,
      name: 'Business Casual Look',
      occasion: 'work',
      explanation: 'A classic business casual outfit perfect for office days',
      temperature: 18.5,
      weather: 'partly_cloudy',
      items: {
        create: [
          { itemId: items[0].id, slot: 'top' },
          { itemId: items[1].id, slot: 'bottom' },
          { itemId: items[2].id, slot: 'outerwear' },
          { itemId: items[3].id, slot: 'shoes' },
        ],
      },
    },
    include: {
      items: true,
    },
  });

  console.log('✅ Created sample outfit:', outfit.name);

  // Create a weather snapshot
  const weather = await prisma.weatherSnapshot.create({
    data: {
      city: 'San Francisco',
      country: 'USA',
      latitude: 37.7749,
      longitude: -122.4194,
      temperature: 18.5,
      feelsLike: 17.2,
      humidity: 65,
      precipitation: 0,
      precipProbability: 10,
      windSpeed: 12,
      cloudCover: 40,
      description: 'Partly cloudy',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    },
  });

  console.log('✅ Created weather snapshot for', weather.city);

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
