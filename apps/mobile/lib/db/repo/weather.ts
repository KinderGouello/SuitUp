import { getDatabase } from '../init';
import { WeatherSnapshot } from '@/lib/types';

const CACHE_EXPIRY_MS = 60 * 60 * 1000;

function rowToWeather(row: any): WeatherSnapshot {
  return {
    takenAt: row.taken_at,
    lat: row.lat,
    lon: row.lon,
    city: row.city,
    tempC: row.temp_c,
    tempMinC: row.temp_min_c,
    tempMaxC: row.temp_max_c,
    feelsLikeC: row.feels_like_c,
    windKph: row.wind_kph,
    precipMm: row.precip_mm,
    condition: row.condition,
  };
}

export async function getWeather(): Promise<WeatherSnapshot | null> {
  const db = getDatabase();
  const row = await db.getFirstAsync('SELECT * FROM weather WHERE id = 1');

  if (!row) {
    return null;
  }

  const weather = rowToWeather(row);

  if (Date.now() - weather.takenAt > CACHE_EXPIRY_MS) {
    return null;
  }

  return weather;
}

export async function saveWeather(weather: WeatherSnapshot): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    `INSERT OR REPLACE INTO weather (
      id, taken_at, lat, lon, city, temp_c, temp_min_c, temp_max_c,
      feels_like_c, wind_kph, precip_mm, condition
    ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      weather.takenAt,
      weather.lat,
      weather.lon,
      weather.city ?? null,
      weather.tempC,
      weather.tempMinC,
      weather.tempMaxC,
      weather.feelsLikeC,
      weather.windKph,
      weather.precipMm,
      weather.condition,
    ]
  );
}
