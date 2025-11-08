import { supabase, isSupabaseConfigured } from './client';
import type { Item, Preferences, Outfit, WeatherSnapshot } from '../types';

/**
 * Sync service for syncing local SQLite data with Supabase
 * This maintains the offline-first architecture while enabling cloud backup
 */

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export interface SyncResult {
  status: SyncStatus;
  message?: string;
  error?: Error;
}

/**
 * Upload local items to Supabase
 */
export async function syncItemsToCloud(items: Item[]): Promise<SyncResult> {
  if (!isSupabaseConfigured()) {
    return {
      status: 'error',
      message: 'Supabase not configured',
    };
  }

  try {
    const { error } = await supabase!
      .from('items')
      .upsert(items.map(item => ({
        id: item.id,
        created_at: item.createdAt,
        updated_at: item.updatedAt,
        name: item.name,
        photo_uri: item.photoUri,
        category: item.category,
        subcategory: item.subcategory,
        colors: JSON.stringify(item.colors),
        fabric: item.fabric,
        warmth: item.warmth,
        waterproof: item.waterproof ? 1 : 0,
        windproof: item.windproof ? 1 : 0,
        tags: JSON.stringify(item.tags),
        last_worn: item.lastWorn,
        archived: item.archived ? 1 : 0,
      })));

    if (error) throw error;

    return {
      status: 'success',
      message: `Successfully synced ${items.length} items to cloud`,
    };
  } catch (error) {
    console.error('Error syncing items to cloud:', error);
    return {
      status: 'error',
      message: 'Failed to sync items to cloud',
      error: error as Error,
    };
  }
}

/**
 * Download items from Supabase and return them
 * Does not modify local database - caller is responsible for that
 */
export async function fetchItemsFromCloud(): Promise<Item[]> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase!
    .from('items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(row => ({
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    name: row.name,
    photoUri: row.photo_uri,
    category: row.category,
    subcategory: row.subcategory,
    colors: JSON.parse(row.colors),
    fabric: row.fabric,
    warmth: row.warmth,
    waterproof: row.waterproof === 1,
    windproof: row.windproof === 1,
    tags: JSON.parse(row.tags || '[]'),
    lastWorn: row.last_worn,
    archived: row.archived === 1,
  }));
}

/**
 * Upload preferences to Supabase
 */
export async function syncPreferencesToCloud(preferences: Preferences): Promise<SyncResult> {
  if (!isSupabaseConfigured()) {
    return {
      status: 'error',
      message: 'Supabase not configured',
    };
  }

  try {
    const { error } = await supabase!
      .from('preferences')
      .upsert({
        id: 1,
        location: preferences.location,
        style_preference: preferences.stylePreference,
        color_palette: preferences.colorPalette,
        formality_level: preferences.formalityLevel,
        units: preferences.units,
        daily_suggestion: preferences.dailySuggestion,
        weather_based: preferences.weatherBased,
        enable_notifications: preferences.enableNotifications,
      });

    if (error) throw error;

    return {
      status: 'success',
      message: 'Successfully synced preferences to cloud',
    };
  } catch (error) {
    console.error('Error syncing preferences to cloud:', error);
    return {
      status: 'error',
      message: 'Failed to sync preferences to cloud',
      error: error as Error,
    };
  }
}

/**
 * Download preferences from Supabase
 */
export async function fetchPreferencesFromCloud(): Promise<Preferences | null> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase!
    .from('preferences')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No preferences found
      return null;
    }
    throw error;
  }

  return {
    location: data.location || '',
    stylePreference: data.style_preference,
    colorPalette: data.color_palette || 'neutral',
    formalityLevel: data.formality_level || 3,
    units: data.units,
    dailySuggestion: Boolean(data.daily_suggestion),
    weatherBased: Boolean(data.weather_based),
    enableNotifications: Boolean(data.enable_notifications),
  };
}

/**
 * Upload outfits to Supabase
 */
export async function syncOutfitsToCloud(outfits: Outfit[]): Promise<SyncResult> {
  if (!isSupabaseConfigured()) {
    return {
      status: 'error',
      message: 'Supabase not configured',
    };
  }

  try {
    const { error } = await supabase!
      .from('outfits')
      .upsert(outfits.map(outfit => ({
        id: outfit.id,
        created_at: outfit.createdAt,
        explanation: outfit.explanation,
        items: JSON.stringify(outfit.items),
        weather: JSON.stringify(outfit.weather),
      })));

    if (error) throw error;

    return {
      status: 'success',
      message: `Successfully synced ${outfits.length} outfits to cloud`,
    };
  } catch (error) {
    console.error('Error syncing outfits to cloud:', error);
    return {
      status: 'error',
      message: 'Failed to sync outfits to cloud',
      error: error as Error,
    };
  }
}

/**
 * Download outfits from Supabase
 */
export async function fetchOutfitsFromCloud(): Promise<Outfit[]> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase!
    .from('outfits')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(row => ({
    id: row.id,
    createdAt: row.created_at,
    explanation: row.explanation,
    items: JSON.parse(row.items),
    weather: JSON.parse(row.weather),
  }));
}

/**
 * Perform a full sync of all data to cloud
 */
export async function syncAllToCloud(data: {
  items: Item[];
  preferences: Preferences | null;
  outfits: Outfit[];
}): Promise<SyncResult> {
  if (!isSupabaseConfigured()) {
    return {
      status: 'error',
      message: 'Supabase not configured',
    };
  }

  try {
    const results = await Promise.all([
      syncItemsToCloud(data.items),
      data.preferences ? syncPreferencesToCloud(data.preferences) : Promise.resolve({ status: 'success' as SyncStatus }),
      syncOutfitsToCloud(data.outfits),
    ]);

    const hasError = results.some(r => r.status === 'error');
    if (hasError) {
      return {
        status: 'error',
        message: 'Some data failed to sync',
      };
    }

    return {
      status: 'success',
      message: 'Successfully synced all data to cloud',
    };
  } catch (error) {
    console.error('Error syncing all data to cloud:', error);
    return {
      status: 'error',
      message: 'Failed to sync data to cloud',
      error: error as Error,
    };
  }
}
