# Mobile App - AI Agent Guide

**Stack**: React Native 0.81.4 + Expo SDK 54 + TypeScript

This guide provides practical architecture and coding context for AI agents working on the SuitUp mobile application.

## 🗺️ Navigation

- **← [Root Agent Guide](../../AGENTS.md)** - Monorepo overview & global conventions
- **[CLAUDE.md](./CLAUDE.md)** - **PRIMARY REFERENCE** - Comprehensive app context, tooling, specs
- **[FIGMA.md](./FIGMA.md)** - Design system & UI guidelines
- **[agents/architecture.md](./agents/architecture.md)** - Full system architecture & future plans

## 📋 When to Use Each Doc

| Document | Use When |
|----------|----------|
| **This file (AGENTS.md)** | Quick reference for current mobile app architecture & patterns |
| **[CLAUDE.md](./CLAUDE.md)** | Need comprehensive context, tooling policies, or reconciling specs vs code |
| **[FIGMA.md](./FIGMA.md)** | Implementing UI components, need design tokens or styling patterns |
| **[agents/architecture.md](./agents/architecture.md)** | Planning new features, understanding full system design (includes backend/future) |

## 🏗️ Current Mobile App Architecture

### Core Stack (What's Actually Implemented)

```
React Native 0.81.4
└── Expo SDK 54 (managed workflow)
    ├── Expo Router 6.x (file-based routing)
    ├── SQLite (expo-sqlite) - Local database
    ├── Zustand 5.x - Global state
    ├── TanStack Query 5.x - Server state & caching
    └── NativeWind 4.x - Tailwind CSS for React Native
```

### File Structure

```
apps/mobile/
├── app/                    # Expo Router routes (file-based)
│   ├── (tabs)/            # Tab navigator screens
│   │   ├── index.tsx      # Home (outfit generation)
│   │   ├── wardrobe.tsx   # Wardrobe management
│   │   ├── preferences.tsx # Style preferences
│   │   └── settings.tsx   # App settings
│   ├── item/
│   │   ├── [id].tsx       # Item detail (dynamic route)
│   │   └── new.tsx        # Add item modal
│   ├── outfit/[id].tsx    # Outfit detail
│   ├── onboarding.tsx     # First-time setup
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
├── lib/                   # Business logic & utilities
│   ├── db/               # SQLite database layer
│   │   ├── schema.ts     # Table definitions
│   │   ├── repo/         # Data access repositories
│   │   └── seed.ts       # Sample data
│   ├── ai/               # Recommendation & LLM
│   │   ├── heuristics.ts # Current outfit algorithm
│   │   └── langfuse.ts   # LLM observability (future)
│   ├── weather/          # Weather API client
│   ├── supabase/         # Cloud sync (optional)
│   ├── styles/           # Design tokens
│   └── types/            # TypeScript definitions
├── state/                # Zustand stores
│   ├── useWardrobe.ts   # Items state
│   ├── usePreferences.ts # User preferences
│   └── useSettings.ts    # App settings
└── hooks/                # Custom React hooks
```

## 🎯 Key Architectural Patterns

### 1. Database Layer (SQLite)

**Pattern**: Repository Pattern
**Location**: `lib/db/`

```typescript
// Schema definition
// lib/db/schema.ts
export const SCHEMA_VERSION = 3;
export const tables = {
  items: `CREATE TABLE IF NOT EXISTS items (...)`,
  preferences: `CREATE TABLE IF NOT EXISTS preferences (...)`,
  // ...
};

// Repository pattern
// lib/db/repo/items.ts
export async function getAllItems(): Promise<Item[]> {
  const db = getDatabase();
  const rows = await db.getAllAsync<ItemRow>('SELECT * FROM items');
  return rows.map(rowToItem);
}
```

**Key Points**:
- Database initialized in `app/_layout.tsx` on app startup (blocking)
- All repos use `getDatabase()` which throws if DB not ready
- Arrays/objects stored as JSON strings (must serialize/deserialize)
- Booleans stored as 0/1 (SQLite has no boolean type)
- Three singleton tables use id=1: `preferences`, `weather`, `settings`

### 2. State Management (Zustand)

**Pattern**: Multiple isolated stores
**Location**: `state/`

```typescript
// state/useWardrobe.ts
export const useWardrobe = create<WardobeState>((set) => ({
  items: [],
  loading: false,
  error: null,

  loadItems: async () => {
    set({ loading: true });
    const items = await itemsRepo.getAllItems();
    set({ items, loading: false });
  },

  addItem: async (item) => {
    await itemsRepo.createItem(item);
    // Optimistic update
    set((state) => ({ items: [...state.items, item] }));
  },
}));
```

**Stores**:
- `useWardrobe` - Items CRUD, search, filters
- `usePreferences` - Style preferences (singleton)
- `useSettings` - App config (singleton, includes onboarding status)

**Important**: Stores cache data loaded at specific times. They do NOT auto-sync with DB.

### 3. Routing (Expo Router)

**Pattern**: File-based routing
**Location**: `app/`

```typescript
// Dynamic route: app/item/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function ItemDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // ...
}

// Navigation
import { useRouter } from 'expo-router';
const router = useRouter();
router.push('/item/new');
router.back();
```

**Route Types** (auto-generated):
- `.expo/types/router.d.ts` - TypeScript types for all routes
- Enabled via `experiments.typedRoutes: true` in `app.json`

### 4. Styling (NativeWind)

**Pattern**: Tailwind CSS classes via `className` prop
**Location**: `tailwind.config.js`, `lib/styles/tokens.ts`

```typescript
// Custom design system: "Luxe Minimal - Dark Sapphire"
<View className="bg-primary-600 p-md rounded-lg">
  <Text className="text-h2 text-white">Hello</Text>
</View>
```

**Design Tokens**:
- Primary: `#13315C` (dark sapphire) with shades 50-900
- Typography: Custom font scale (hero, display, h1-h3, title, body, caption)
- Spacing: Custom scale (micro, xs, sm, md, lg, xl, xxl, jumbo)
- Border radius: xs/sm/md/lg/xl/pill

**Important**: For non-NativeWind contexts, import from `lib/styles/tokens.ts`.

### 5. Outfit Recommendation Algorithm

**Pattern**: Heuristic slot-filling algorithm
**Location**: `lib/ai/heuristics.ts`

```typescript
export function recommendOutfit(
  items: Item[],
  prefs: Preferences,
  weather: WeatherSnapshot
): Outfit {
  // 1. Determine warmth level from temperature
  // 2. Weather-first selection (rain/wind priority)
  // 3. Sequential slot filling: dress OR (top + bottom), shoes, accessory
  // 4. Score items: recently worn penalty, avoid tags, warmth bonus
  // 5. Return outfit with explanation
}
```

**Scoring** (`scoreItem` function):
- Base: 100
- Last 7 days worn: -10 per day
- Avoided tags: -50
- Adequate warmth: +10
- Insufficient warmth: -20

**Weather Thresholds**:
- ≥24°C → warmth 0 (summer)
- 16-23°C → warmth 0 (light layers)
- 8-15°C → warmth 1 (jacket)
- ≤7°C → warmth 3 (coat)

**Future**: LLM-powered recommendations (infrastructure ready via Langfuse/Promptfoo)

## 🔧 Agent Instructions - Mobile-Specific

### Adding a New Screen

1. Create file in `app/` following Expo Router conventions:
   ```bash
   # Static route
   touch app/my-screen.tsx

   # Dynamic route
   touch app/my-screen/[id].tsx

   # Modal
   touch app/my-modal.tsx  # Add modal: true in route options
   ```

2. Screen template:
   ```typescript
   import { View, Text } from 'react-native';
   import { Stack } from 'expo-router';

   export default function MyScreen() {
     return (
       <>
         <Stack.Screen options={{ title: 'My Screen' }} />
         <View className="flex-1 bg-background p-lg">
           <Text className="text-h1">My Screen</Text>
         </View>
       </>
     );
   }
   ```

### Adding a New Database Table

1. Update `lib/db/schema.ts`:
   ```typescript
   export const SCHEMA_VERSION = 4; // Increment

   export const tables = {
     // ... existing tables
     my_table: `CREATE TABLE IF NOT EXISTS my_table (
       id TEXT PRIMARY KEY,
       data TEXT,
       created_at INTEGER
     )`,
   };
   ```

2. Create migration in `initDatabase()` if needed
3. Create repository in `lib/db/repo/my-table.ts`
4. Add TypeScript types in `lib/types/index.ts`

### Adding a Component

1. Create in `components/MyComponent.tsx`
2. Use NativeWind for styling
3. Export default component
4. Keep components pure (no direct DB access)

```typescript
import { View, Text, Pressable } from 'react-native';
import type { ReactNode } from 'react';

interface MyComponentProps {
  title: string;
  onPress?: () => void;
  children?: ReactNode;
}

export default function MyComponent({ title, onPress, children }: MyComponentProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-surface p-md rounded-lg"
    >
      <Text className="text-title">{title}</Text>
      {children}
    </Pressable>
  );
}
```

### Accessing Data

**Use Zustand stores, NOT direct repo calls in components**:

```typescript
// ❌ WRONG
import { getAllItems } from '@/lib/db/repo/items';
const items = await getAllItems(); // Don't call repos directly

// ✅ CORRECT
import { useWardrobe } from '@/state/useWardrobe';
const { items, loading, loadItems } = useWardrobe();

useEffect(() => {
  loadItems();
}, []);
```

### Path Aliases

Use `@/*` for imports from app root:

```typescript
import { Item } from '@/lib/types';
import { useWardrobe } from '@/state/useWardrobe';
import Button from '@/components/Button';
```

## ⚠️ Known Limitations & Gotchas

### Current Implementation Gaps

**Compare to [agents/architecture.md](./agents/architecture.md) for full specs**:

| Feature | Spec | Current Reality |
|---------|------|-----------------|
| Wardrobe capture | Batch import, background removal, auto-tagging | Single photo, manual entry only |
| Preferences | Multi-select weights, fit constraints | Single archetype, simple sliders |
| Outfit generation | Multiple suggestions, confidence scores | Single outfit, basic explanation |
| Weather | Forecast range, UV index | Single snapshot only |
| Data export | Full import/restore | Console JSON dump only |
| Cloud sync | Supabase helpers exist | Not wired into UI |

**See [CLAUDE.md § Known Limitations](./CLAUDE.md#known-limitations--stubs) for complete list**

### TypeScript Issues

Some pre-existing type errors (non-blocking):
- `app/(tabs)/_layout.tsx:23` - `sceneContainerStyle` prop
- `components/BrandHeader.tsx:119` - Missing `gray600` color
- `components/WeatherBadge.tsx:80` - Missing `humidity` property
- `hooks/useFrameworkReady.ts:11` - `window` undefined

**These existed before monorepo migration. Fix in separate PR.**

### Platform Support

- **iOS/Android**: Full support
- **Web**: Build works but SQLite unsupported (database will fail)

## 📝 Code Conventions

### TypeScript

- Strict mode enabled
- No `any` types
- Prefer interfaces for objects, types for unions
- Export types from `lib/types/index.ts`

### Components

- Functional components only (no class components)
- Use hooks for side effects
- Props interface always defined
- Default export for components

### File Naming

- Components: PascalCase (`MyComponent.tsx`)
- Utilities: camelCase (`myUtil.ts`)
- Types: singular (`types.ts` not `types.d.ts`)
- Repos: plural (`items.ts` not `item.ts`)

### Imports Order

```typescript
// 1. React & React Native
import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

// 2. Third-party
import { useRouter } from 'expo-router';

// 3. Internal (@/* aliases)
import { Item } from '@/lib/types';
import { useWardrobe } from '@/state/useWardrobe';
import Button from '@/components/Button';
```

## 🔗 Cross-References

### Full Documentation Chain

```
../../AGENTS.md (monorepo guide)
    ↓
AGENTS.md (this file - mobile quick reference)
    ↓
CLAUDE.md (mobile comprehensive context)
    ├→ FIGMA.md (design system)
    └→ agents/architecture.md (full system architecture)
        ├→ context/ARCHITECTURE.md (older architecture doc)
        └→ context/SPECS.md (product specifications)
```

### When Adding Features

1. **Check specs**: [agents/architecture.md](./agents/architecture.md) or [context/SPECS.md](./context/SPECS.md)
2. **Check existing code**: [CLAUDE.md § Current Feature Snapshot](./CLAUDE.md#current-feature-snapshot-code-reality)
3. **Check design**: [FIGMA.md](./FIGMA.md)
4. **Implement using patterns** from this guide
5. **Update docs** if architecture changes

## 🚀 Common Agent Tasks

### Task: Add a new wardrobe item category

1. Update `lib/types/index.ts`:
   ```typescript
   export type Category =
     | 'top' | 'bottom' | 'dress' | 'outerwear'
     | 'shoes' | 'accessory' | 'athleisure'
     | 'my-new-category'; // Add here
   ```

2. Update `lib/ai/heuristics.ts` if needed for outfit algorithm
3. Update UI forms in `app/item/new.tsx`

### Task: Add a new preference setting

1. Update `lib/types/index.ts` (Preferences interface)
2. Update `lib/db/schema.ts` (preferences table)
3. Increment `SCHEMA_VERSION`
4. Update `app/(tabs)/preferences.tsx` UI
5. Update `state/usePreferences.ts` if needed

### Task: Modify outfit recommendation logic

1. Edit `lib/ai/heuristics.ts` → `recommendOutfit()`
2. Test with various weather/preference combinations
3. Update explanation text generation
4. Consider adding tests (see `prompts/` for LLM prompt testing)

## 📚 Additional Mobile Resources

- [Expo Documentation](https://docs.expo.dev)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [NativeWind Docs](https://www.nativewind.dev/)
- [Zustand Guide](https://docs.pmnd.rs/zustand)
- [TanStack Query](https://tanstack.com/query/latest)

---

**Questions?** Check [CLAUDE.md](./CLAUDE.md) for comprehensive context or [Root AGENTS.md](../../AGENTS.md) for monorepo-wide conventions.
