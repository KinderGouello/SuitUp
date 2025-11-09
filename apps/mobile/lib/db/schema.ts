export const SCHEMA_VERSION = 1;

export const CREATE_ITEMS_TABLE = `
  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    name TEXT NOT NULL,
    photo_uri TEXT NOT NULL,
    label_photo_uri TEXT,
    category TEXT NOT NULL,
    subcategory TEXT,
    brand TEXT,
    size TEXT,
    colors TEXT NOT NULL,
    fabric TEXT,
    warmth INTEGER,
    waterproof INTEGER DEFAULT 0,
    windproof INTEGER DEFAULT 0,
    tags TEXT,
    seasons TEXT,
    formal_level INTEGER,
    cost REAL,
    notes TEXT,
    last_worn INTEGER,
    archived INTEGER DEFAULT 0
  );
`;

export const CREATE_PREFERENCES_TABLE = `
  CREATE TABLE IF NOT EXISTS preferences (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    location TEXT NOT NULL DEFAULT '',
    style_preference TEXT NOT NULL,
    color_palette TEXT NOT NULL DEFAULT 'neutral',
    formality_level INTEGER NOT NULL DEFAULT 3,
    units TEXT NOT NULL DEFAULT 'metric',
    daily_suggestion INTEGER DEFAULT 1,
    weather_based INTEGER DEFAULT 1,
    occasion_based INTEGER DEFAULT 0,
    enable_notifications INTEGER DEFAULT 1,
    outfit_reminder INTEGER DEFAULT 1,
    weather_alerts INTEGER DEFAULT 1
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
