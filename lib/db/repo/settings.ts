import { getDatabase } from '../init';
import { AppSettings } from '@/lib/types';

const DEFAULT_SETTINGS: AppSettings = {
  useCloudAI: false,
  locationMode: 'gps',
  manualCity: undefined,
  onboardingCompleted: false,
};

function rowToSettings(row: any): AppSettings {
  return {
    useCloudAI: Boolean(row.use_cloud_ai),
    locationMode: row.location_mode,
    manualCity: row.manual_city,
    onboardingCompleted: Boolean(row.onboarding_completed),
  };
}

export async function getSettings(): Promise<AppSettings> {
  const db = getDatabase();
  const row = await db.getFirstAsync('SELECT * FROM settings WHERE id = 1');

  if (!row) {
    await saveSettings(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }

  return rowToSettings(row);
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    `INSERT OR REPLACE INTO settings (
      id, use_cloud_ai, location_mode, manual_city, onboarding_completed
    ) VALUES (1, ?, ?, ?, ?)`,
    [
      settings.useCloudAI ? 1 : 0,
      settings.locationMode,
      settings.manualCity ?? null,
      settings.onboardingCompleted ? 1 : 0,
    ]
  );
}
