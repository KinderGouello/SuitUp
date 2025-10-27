import { getDatabase } from '../init';
import { Preferences } from '@/lib/types';

const DEFAULT_PREFERENCES: Preferences = {
  stylePreference: 'casual',
  fit: 'regular',
  dressCodes: ['smart_casual', 'weekend'],
  avoidTags: [],
  units: 'metric',
};

function rowToPreferences(row: any): Preferences {
  return {
    stylePreference: row.style_preference,
    fit: row.fit,
    dressCodes: JSON.parse(row.dress_codes),
    avoidTags: row.avoid_tags ? JSON.parse(row.avoid_tags) : undefined,
    units: row.units,
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
      id, style_preference, fit, dress_codes, avoid_tags, units
    ) VALUES (1, ?, ?, ?, ?, ?)`,
    [
      prefs.stylePreference,
      prefs.fit,
      JSON.stringify(prefs.dressCodes),
      prefs.avoidTags ? JSON.stringify(prefs.avoidTags) : null,
      prefs.units,
    ]
  );
}
