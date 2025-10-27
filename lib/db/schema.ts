export const SCHEMA_VERSION = 1;

export const CREATE_ITEMS_TABLE = `
  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    name TEXT NOT NULL,
    photo_uri TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    colors TEXT NOT NULL,
    fabric TEXT,
    warmth INTEGER,
    waterproof INTEGER DEFAULT 0,
    windproof INTEGER DEFAULT 0,
    tags TEXT,
    last_worn INTEGER,
    archived INTEGER DEFAULT 0
  );
`;

export const CREATE_PREFERENCES_TABLE = `
  CREATE TABLE IF NOT EXISTS preferences (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    style_preference TEXT NOT NULL,
    fit TEXT NOT NULL,
    dress_codes TEXT NOT NULL,
    avoid_tags TEXT,
    units TEXT NOT NULL DEFAULT 'metric'
  );
`;

export const CREATE_WEATHER_TABLE = `
  CREATE TABLE IF NOT EXISTS weather (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    taken_at INTEGER NOT NULL,
    lat REAL NOT NULL,
    lon REAL NOT NULL,
    city TEXT,
    temp_c REAL NOT NULL,
    temp_min_c REAL NOT NULL,
    temp_max_c REAL NOT NULL,
    feels_like_c REAL NOT NULL,
    wind_kph REAL NOT NULL,
    precip_mm REAL NOT NULL,
    condition TEXT NOT NULL
  );
`;

export const CREATE_OUTFITS_TABLE = `
  CREATE TABLE IF NOT EXISTS outfits (
    id TEXT PRIMARY KEY NOT NULL,
    created_at INTEGER NOT NULL,
    explanation TEXT NOT NULL,
    items TEXT NOT NULL,
    weather TEXT NOT NULL
  );
`;

export const CREATE_SETTINGS_TABLE = `
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    use_cloud_ai INTEGER DEFAULT 0,
    location_mode TEXT NOT NULL DEFAULT 'gps',
    manual_city TEXT,
    onboarding_completed INTEGER DEFAULT 0
  );
`;

export const ALL_TABLES = [
  CREATE_ITEMS_TABLE,
  CREATE_PREFERENCES_TABLE,
  CREATE_WEATHER_TABLE,
  CREATE_OUTFITS_TABLE,
  CREATE_SETTINGS_TABLE,
];
