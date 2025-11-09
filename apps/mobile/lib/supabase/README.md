# Supabase Integration

This directory contains the Supabase integration for SuitUp, enabling cloud backup and sync capabilities while maintaining the offline-first architecture.

## Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key from the project settings

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Create Database Tables

Run the following SQL in your Supabase SQL Editor to create the required tables:

```sql
-- Items table
CREATE TABLE items (
  id TEXT PRIMARY KEY NOT NULL,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
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
  last_worn BIGINT,
  archived INTEGER DEFAULT 0
);

-- Preferences table (singleton)
CREATE TABLE preferences (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  style_preference TEXT NOT NULL,
  fit TEXT NOT NULL,
  dress_codes TEXT NOT NULL,
  avoid_tags TEXT,
  units TEXT NOT NULL DEFAULT 'metric'
);

-- Outfits table
CREATE TABLE outfits (
  id TEXT PRIMARY KEY NOT NULL,
  created_at BIGINT NOT NULL,
  explanation TEXT NOT NULL,
  items TEXT NOT NULL,
  weather TEXT NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (adjust as needed)
CREATE POLICY "Users can view their own items"
  ON items FOR SELECT
  USING (auth.uid()::text = id);

CREATE POLICY "Users can insert their own items"
  ON items FOR INSERT
  WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Users can update their own items"
  ON items FOR UPDATE
  USING (auth.uid()::text = id);

CREATE POLICY "Users can view their preferences"
  ON preferences FOR SELECT
  USING (true);

CREATE POLICY "Users can update their preferences"
  ON preferences FOR ALL
  USING (true);

CREATE POLICY "Users can view their outfits"
  ON outfits FOR SELECT
  USING (auth.uid()::text = id);

CREATE POLICY "Users can insert their outfits"
  ON outfits FOR INSERT
  WITH CHECK (auth.uid()::text = id);
```

**Note:** The RLS policies above are basic examples. You should adjust them based on your authentication strategy and security requirements.

## Usage

### Check if Supabase is Configured

```typescript
import { isSupabaseConfigured } from './lib/supabase/client';

if (isSupabaseConfigured()) {
  // Supabase is available
}
```

### Sync Data to Cloud

```typescript
import { syncAllToCloud } from './lib/supabase/sync';
import { useWardrobe } from './state/wardrobe';
import { usePreferences } from './state/preferences';

const items = useWardrobe.getState().items;
const preferences = usePreferences.getState().preferences;

const result = await syncAllToCloud({
  items,
  preferences,
  outfits: [],
});

if (result.status === 'success') {
  console.log('Sync successful!');
}
```

### Fetch Data from Cloud

```typescript
import { fetchItemsFromCloud } from './lib/supabase/sync';

const items = await fetchItemsFromCloud();
// Use these items to update local state
```

## Architecture

### Offline-First Design

The app uses SQLite as the primary database and Supabase as an optional cloud backup:

1. **All operations write to SQLite first** - The local database is the source of truth
2. **Sync is explicit and manual** - Users control when data is synced to the cloud
3. **No automatic background sync** - This prevents conflicts and respects user control
4. **Graceful degradation** - The app works fully without Supabase configured

### Sync Strategy

The current implementation uses a simple "last write wins" strategy:

- `syncToCloud()` functions upload local data to Supabase
- `fetchFromCloud()` functions download data from Supabase
- Conflict resolution is not implemented (local always overwrites cloud)

For production use, consider implementing:
- Timestamp-based conflict resolution
- Change tracking (dirty flags)
- Background sync with connectivity checks
- Merge strategies for conflicts

## Security Considerations

### Row Level Security (RLS)

The example SQL above includes basic RLS policies. You should:

1. **Enable authentication** - Implement user auth before enabling cloud sync
2. **Scope data by user** - Use `auth.uid()` to ensure users only access their data
3. **Test policies** - Verify users cannot access other users' data

### Image Storage

Currently, `photo_uri` contains local file paths which won't work across devices. For cloud sync to be fully functional:

1. Upload images to Supabase Storage
2. Store the public URL in `photo_uri`
3. Download images when syncing from cloud

Example:

```typescript
import { supabase } from './lib/supabase/client';

// Upload image
const { data, error } = await supabase!.storage
  .from('wardrobe-photos')
  .upload(`${userId}/${itemId}.jpg`, file);

// Get public URL
const { data: { publicUrl } } = supabase!.storage
  .from('wardrobe-photos')
  .getPublicUrl(`${userId}/${itemId}.jpg`);
```

## Future Enhancements

- [ ] User authentication integration
- [ ] Image upload to Supabase Storage
- [ ] Automatic background sync
- [ ] Conflict resolution for concurrent edits
- [ ] Real-time subscriptions for multi-device sync
- [ ] Selective sync (e.g., only sync non-archived items)
- [ ] Sync status UI in settings screen
