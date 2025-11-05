export type UUID = string;

export type Category =
  | 'top'
  | 'bottom'
  | 'dress'
  | 'outerwear'
  | 'shoes'
  | 'accessory'
  | 'athleisure';

export type Warmth = 0 | 1 | 2 | 3 | 4 | 5;

export interface Item {
  id: UUID;
  createdAt: number;
  updatedAt: number;
  name: string;
  photoUri: string;
  category: Category;
  subcategory?: string;
  colors: string[];
  fabric?: string;
  warmth?: Warmth;
  waterproof?: boolean;
  windproof?: boolean;
  tags?: string[];
  seasons?: string[];
  formalLevel?: number;
  cost?: number;
  lastWorn?: number;
  archived?: boolean;
}

export type StylePreference =
  | 'minimalist'
  | 'casual'
  | 'formal'
  | 'sporty'
  | 'street'
  | 'chic'
  | 'edgy'
  | 'boho';

export type Fit = 'regular' | 'oversized' | 'slim';

export type DressCode =
  | 'office'
  | 'business_formal'
  | 'smart_casual'
  | 'weekend'
  | 'workout';

export interface Preferences {
  stylePreference: StylePreference;
  fit: Fit;
  dressCodes: DressCode[];
  avoidTags?: string[];
  units: 'metric' | 'imperial';
}

export interface WeatherSnapshot {
  takenAt: number;
  lat: number;
  lon: number;
  city?: string;
  tempC: number;
  tempMinC: number;
  tempMaxC: number;
  feelsLikeC: number;
  windKph: number;
  precipMm: number;
  condition: string;
}

export type OutfitSlot =
  | 'top'
  | 'bottom'
  | 'dress'
  | 'outerwear'
  | 'shoes'
  | 'accessory';

export interface OutfitItem {
  slot: OutfitSlot;
  itemId: UUID;
}

export interface Outfit {
  id: UUID;
  createdAt: number;
  explanation: string;
  items: OutfitItem[];
  weather: WeatherSnapshot;
}

export interface AppSettings {
  useCloudAI: boolean;
  locationMode: 'gps' | 'manual';
  manualCity?: string;
  onboardingCompleted: boolean;
}
