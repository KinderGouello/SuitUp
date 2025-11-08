import { getDatabase } from '../init';
import { Preferences } from '@/lib/types';

const DEFAULT_PREFERENCES: Preferences = {
  // Profile Information
  location: '',

  // Style Preferences
  stylePreference: 'casual',
  colorPalette: 'neutral',
  formalityLevel: 3,
  units: 'metric',

  // Outfit Suggestions
  dailySuggestion: true,
  weatherBased: true,

  // Notifications
  enableNotifications: true,
};

function rowToPreferences(row: any): Preferences {
  return {
    // Profile Information
    location: row.location || '',

    // Style Preferences
    stylePreference: row.style_preference,
    colorPalette: row.color_palette || 'neutral',
    formalityLevel: row.formality_level || 3,
    units: row.units,

    // Outfit Suggestions (convert 0/1 to boolean)
    dailySuggestion: Boolean(row.daily_suggestion),
    weatherBased: Boolean(row.weather_based),

    // Notifications (convert 0/1 to boolean)
    enableNotifications: Boolean(row.enable_notifications),
  };
}

export async function getPreferences(): Promise<Preferences> {
  const db = getDatabase();
  const row = await db.getFirstAsync('SELECT * FROM preferences WHERE id = 1');

  if (!row) {
    await savePreferences(DEFAULT_PREFERENCES);
    return DEFAULT_PREFERENCES;
  }

  return rowToPreferences(row);
}

export async function savePreferences(prefs: Preferences): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    `INSERT OR REPLACE INTO preferences (
      id,
      location,
      style_preference,
      color_palette,
      formality_level,
      units,
      daily_suggestion,
      weather_based,
      enable_notifications
    ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      prefs.location,
      prefs.stylePreference,
      prefs.colorPalette || 'neutral',
      prefs.formalityLevel || 3,
      prefs.units,
      prefs.dailySuggestion ? 1 : 0,
      prefs.weatherBased ? 1 : 0,
      prefs.enableNotifications ? 1 : 0,
    ]
  );
}
