import {
  Item,
  Preferences,
  WeatherSnapshot,
  Outfit,
  OutfitItem,
  Category,
} from '@/lib/types';

interface ScoredItem {
  item: Item;
  score: number;
}

export function recommendOutfit(
  items: Item[],
  prefs: Preferences,
  weather: WeatherSnapshot
): Outfit {
  const availableItems = items.filter((item) => !item.archived);

  if (availableItems.length === 0) {
    throw new Error('No items available in wardrobe');
  }

  const outfitItems: OutfitItem[] = [];
  const usedIds = new Set<string>();
  const explanationParts: string[] = [];

  const tempC = weather.tempC;
  const hasPrecip = weather.precipMm >= 1;
  const hasWind = weather.windKph >= 25;

  explanationParts.push(
    `Based on ${tempC}°C weather${hasPrecip ? ' with rain' : ''}${hasWind ? ' and wind' : ''}:`
  );

  const requiredWarmth = getRequiredWarmth(tempC);
  let needsOuterwear = tempC < 16;

  if (hasPrecip) {
    const waterproofOuterwear = findBestMatch(
      availableItems.filter(
        (i) => i.category === 'outerwear' && i.waterproof
      ),
      prefs,
      weather,
      usedIds,
      requiredWarmth
    );

    if (waterproofOuterwear) {
      outfitItems.push({ slot: 'outerwear', itemId: waterproofOuterwear.id });
      usedIds.add(waterproofOuterwear.id);
      explanationParts.push(
        `- ${waterproofOuterwear.name} for rain protection`
      );
      needsOuterwear = false;
    }
  }

  if (needsOuterwear && hasWind) {
    const windproofOuterwear = findBestMatch(
      availableItems.filter(
        (i) => i.category === 'outerwear' && i.windproof
      ),
      prefs,
      weather,
      usedIds,
      requiredWarmth
    );

    if (windproofOuterwear) {
      outfitItems.push({ slot: 'outerwear', itemId: windproofOuterwear.id });
      usedIds.add(windproofOuterwear.id);
      explanationParts.push(
        `- ${windproofOuterwear.name} for wind protection`
      );
      needsOuterwear = false;
    }
  }

  if (needsOuterwear && tempC < 16) {
    const outerwear = findBestMatch(
      availableItems.filter(
        (i) =>
          i.category === 'outerwear' &&
          (i.warmth ?? 0) >= requiredWarmth &&
          !usedIds.has(i.id)
      ),
      prefs,
      weather,
      usedIds,
      requiredWarmth
    );

    if (outerwear) {
      outfitItems.push({ slot: 'outerwear', itemId: outerwear.id });
      usedIds.add(outerwear.id);
      explanationParts.push(`- ${outerwear.name} for warmth`);
    }
  }

  const dress = findBestMatch(
    availableItems.filter((i) => i.category === 'dress' && !usedIds.has(i.id)),
    prefs,
    weather,
    usedIds,
    requiredWarmth
  );

  if (dress) {
    outfitItems.push({ slot: 'dress', itemId: dress.id });
    usedIds.add(dress.id);
    explanationParts.push(`- ${dress.name} as main piece`);
  } else {
    const top = findBestMatch(
      availableItems.filter((i) => i.category === 'top' && !usedIds.has(i.id)),
      prefs,
      weather,
      usedIds,
      requiredWarmth
    );

    if (top) {
      outfitItems.push({ slot: 'top', itemId: top.id });
      usedIds.add(top.id);
      explanationParts.push(`- ${top.name}`);
    }

    const bottom = findBestMatch(
      availableItems.filter(
        (i) => i.category === 'bottom' && !usedIds.has(i.id)
      ),
      prefs,
      weather,
      usedIds,
      requiredWarmth
    );

    if (bottom) {
      outfitItems.push({ slot: 'bottom', itemId: bottom.id });
      usedIds.add(bottom.id);
      explanationParts.push(`- ${bottom.name}`);
    }
  }

  const shoes = findBestMatch(
    availableItems.filter(
      (i) =>
        i.category === 'shoes' &&
        !usedIds.has(i.id) &&
        (!hasPrecip || i.waterproof)
    ),
    prefs,
    weather,
    usedIds,
    requiredWarmth
  );

  if (shoes) {
    outfitItems.push({ slot: 'shoes', itemId: shoes.id });
    usedIds.add(shoes.id);
    explanationParts.push(`- ${shoes.name}${hasPrecip ? ' (water-resistant)' : ''}`);
  }

  const accessory = findBestMatch(
    availableItems.filter(
      (i) => i.category === 'accessory' && !usedIds.has(i.id)
    ),
    prefs,
    weather,
    usedIds,
    requiredWarmth
  );

  if (accessory) {
    outfitItems.push({ slot: 'accessory', itemId: accessory.id });
    usedIds.add(accessory.id);
  }

  if (outfitItems.length === 0) {
    throw new Error('Could not build a complete outfit');
  }

  return {
    id: generateId(),
    createdAt: Date.now(),
    explanation: explanationParts.join('\n'),
    items: outfitItems,
    weather,
  };
}

function getRequiredWarmth(tempC: number): number {
  if (tempC >= 24) return 0;
  if (tempC >= 16) return 0;
  if (tempC >= 8) return 1;
  return 3;
}

function findBestMatch(
  candidates: Item[],
  prefs: Preferences,
  weather: WeatherSnapshot,
  usedIds: Set<string>,
  requiredWarmth: number
): Item | null {
  if (candidates.length === 0) return null;

  const scored = candidates.map((item) => ({
    item,
    score: scoreItem(item, prefs, weather, usedIds, requiredWarmth),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored[0].item;
}

function scoreItem(
  item: Item,
  prefs: Preferences,
  weather: WeatherSnapshot,
  usedIds: Set<string>,
  requiredWarmth: number
): number {
  let score = 100;

  const daysAgo = item.lastWorn
    ? (Date.now() - item.lastWorn) / (1000 * 60 * 60 * 24)
    : 999;

  if (daysAgo < 7) {
    score -= (7 - daysAgo) * 10;
  }

  if (item.tags) {
    const hasAvoidTag = item.tags.some((tag) =>
      prefs.avoidTags?.includes(tag)
    );
    if (hasAvoidTag) {
      score -= 50;
    }
  }

  if (item.warmth !== undefined) {
    if (item.warmth >= requiredWarmth) {
      score += 10;
    } else {
      score -= 20;
    }
  }

  return score;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
