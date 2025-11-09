# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SuitUp is a React Native Expo app for wardrobe management and weather-based outfit recommendations. It's an offline-first mobile app (iOS/Android) that catalogs clothing items and uses a heuristic algorithm to suggest daily outfits based on weather, style preferences, and personal wardrobe.

**Tech Stack**: Expo SDK 54, React Native, TypeScript, Expo Router (file-based routing), Zustand (state), TanStack Query, Expo SQLite, Supabase (optional cloud sync), NativeWind (Tailwind CSS), Lucide Icons, Open-Meteo API, Langfuse (LLM observability), Promptfoo (prompt testing).

## Project Tooling

- **Turborepo**: orchestration des builds avec cache intelligent
- **pnpm workspaces (recommandé)**: gestion des dépendances multi-packages
- **Changesets**: versioning automatique et génération des changelogs
- **Docker Compose**: base de données locale (PostgreSQL, Redis, etc.)
- **Concurrently**: lancer plusieurs processus en développement
- **Prisma**: ORM
- **Zod**: validation de schémas
- **tRPC**: API type-safe de bout en bout
- **Playwright**: tests E2E
- **GitHub Actions**: CI/CD
- **Turborepo Remote Cache**: cache distribué pour les builds
- **Supabase**: base PostgreSQL managée
- **react-native-mmkv**: cache mobile haute performance
- **Fastlane**: automatisation mobile (iOS/Android)
- **Docker**: containerisation de l'API
- **GitHub Container Registry**: distribution des images Docker
- **Sentry**: error tracking (front + back)
- **R2 Cloudflare**: CDN management
- **Supabase Auth**: gestion de l'authentification
- **Upstash**: Redis cache backend
- **LogRocket**: monitoring
- **Mixpanel**: analytics produit

## Notion Documentation Hub

**Primary Documentation**: [Suit Up! Notion Page](https://www.notion.so/2a2f1561e5c2803993a0cfd3b24bb039)

This Notion workspace serves as the central hub for all product-level documentation:

### Product Documentation (In Notion)
- [📋 Product Requirements](https://www.notion.so/2a2f1561e5c281849237c61be49288f1)
  - [Vision & Goals](https://www.notion.so/2a2f1561e5c2812ba099e090020cfb7c) ✅ _Migrated_
  - [Target Users & Personas](https://www.notion.so/2a2f1561e5c281e38f15e7c250a64e9b) ✅ _Migrated_
- [🎨 Design System](https://www.notion.so/2a2f1561e5c2819da53ee3f54ba93bae) _Coming soon_
- [🗺️ Roadmap](https://www.notion.so/2a2f1561e5c281afab97c2ec9a9d1ace) _Coming soon_

### Technical Documentation (In Codebase)
- Architecture: See `context/ARCHITECTURE.md`
- Prompt-ready architecture context (for agents): See `agents/architecture.md`
- API Contracts: See `context/SPECS.md` (sections 10-12)
- Database: See `lib/db/schema.ts` and this file's Database Layer section
- Supabase Integration: See `lib/supabase/README.md`
- AI & LLM Tooling: See `lib/ai/README.md`

**Note**: Product specifications are being progressively migrated from `context/SPECS.md` to Notion. Technical implementation details remain in the codebase.

Use Notion MCP tools to query and update product documentation when needed.

## Linear MCP Usage

- The Linear workspace already has a `Suit Up!` project; always scope Linear MCP requests (listing, creating, updating issues) to this project by passing `project: "Suit Up!"`.
- When creating new tickets, ensure they land in the `Suit Up!` project backlog unless the user explicitly requests a different destination.
- If you need a project context reminder, the canonical reference is this file plus `agents/architecture.md`; keep both linked in any downstream prompts or handoffs.

### Current Feature Snapshot (code reality)

Use this list whenever you need to reconcile Notion specs with the shipped app:
- **Wardrobe capture**: Single-item flow with optional label photo. No batch import, background removal, or computer-vision auto-tagging. Dominant color extraction is stubbed to `#808080`.
- **Preferences**: Users pick one style archetype, one color palette, and a numeric formality slider. No multi-select weights, occasion presets, fit constraints, or notification granularity yet.
- **Outfit generation**: `recommendOutfit` returns exactly one outfit per request using heuristic slot-filling (weather-aware filtering, last-worn penalty). No confidence score, multiple suggestions, occasion handling, or swap/lock tooling.
- **Weather context**: Single snapshot fetched via GPS or manual city and cached in SQLite. No forecast range, UV index, or activity-aware adjustments.
- **Data management**: “Export Data” logs JSON to the console; there is no import/restore UI. Supabase sync helpers exist but are not wired into the app.
- **Onboarding**: Collects only location preference (GPS vs manual city) and marks onboarding complete. No style questionnaire or wardrobe seeding wizard.

## Documentation Lookup Policy

**IMPORTANT**: When answering questions about libraries, packages, APIs, or frameworks used in this project, you MUST use Context7 MCP tools to fetch the latest documentation.

### Required Workflow for Documentation Queries:

1. **Always use Context7 first** for any question about:
   - React Native, Expo, or Expo SDK APIs
   - TypeScript features or syntax
   - NativeWind/Tailwind CSS usage
   - Zustand state management
   - TanStack Query (React Query)
   - Expo Router routing patterns
   - Supabase client libraries
   - Any other npm package or library

2. **Two-step process**:
   - First: Call `resolve-library-id` with the library name (e.g., "expo", "react-native", "zustand")
   - Second: Call `get-library-docs` with the resolved library ID and relevant topic

3. **Examples**:
   - For Expo Router questions: Resolve "expo-router" → Get docs with topic "navigation" or "routing"
   - For NativeWind questions: Resolve "nativewind" → Get docs with topic "styling" or specific class names
   - For Zustand questions: Resolve "zustand" → Get docs with topic "store" or "state management"

4. **Exception**: Only skip Context7 if:
   - The question is purely about this codebase's custom code (not library usage)
   - The answer is definitively in the project files (CLAUDE.md, FIGMA.md, etc.)

**Rationale**: Context7 provides the most up-to-date, accurate documentation for all external dependencies. This ensures recommendations align with current best practices and API changes.

## Development Commands

```bash
# Start development server
pnpm dev

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Build for web (note: SQLite not supported on web)
pnpm build:web

# Prompt testing (requires LLM API keys in .env)
pnpm test:prompts           # Run all prompt tests
pnpm test:prompts:ui        # Run tests and open web UI
pnpm test:prompts:watch     # Watch mode for test development
```

After `pnpm dev`, press 'i' for iOS simulator, 'a' for Android emulator, or 'w' for web.

## Architecture

### Database Layer (SQLite)

**Initialization Flow**: `app/_layout.tsx` calls `initDatabase()` then `seedDatabase()` on app startup. Database initialization is blocking - the app shows a loading spinner until complete.

**Schema** (`lib/db/schema.ts`): Five tables with `SCHEMA_VERSION` for migrations:
- `items`: Wardrobe items with JSON-serialized arrays (colors, tags, seasons)
- `preferences`: Singleton table (id=1) for style preferences
- `weather`: Singleton table (id=1) for cached weather snapshot
- `outfits`: Generated outfit history with JSON-serialized items and weather
- `settings`: Singleton table (id=1) for app configuration

**Data Access Layer** (`lib/db/repo/`): Repository pattern - each entity has a repo file (items.ts, preferences.ts, outfits.ts, weather.ts, settings.ts). All repos use `getDatabase()` which throws if DB not initialized. Row-to-type mapping functions handle JSON deserialization and boolean conversion (SQLite uses 0/1).

**Important**: Arrays and objects in SQLite are stored as JSON strings and must be serialized/deserialized. Booleans are stored as integers (0/1).

### State Management (Zustand)

Three global stores in `state/`:
- `useWardrobe`: Items CRUD, search, loading/error states
- `usePreferences`: Style preferences singleton
- `useSettings`: App settings singleton (location mode, cloud AI toggle, onboarding status)

Stores wrap repo calls and maintain optimistic UI updates. The stores are NOT synced with DB automatically - they cache data loaded at specific times.

### Routing (Expo Router)

File-based routing under `app/`:
- `(tabs)/` - Tab navigator with 4 screens: index (home), wardrobe, preferences, settings
- `item/new.tsx` - Modal for adding items
- `item/[id].tsx` - Item detail view
- `outfit/[id].tsx` - Outfit detail view
- `onboarding.tsx` - First-time setup flow

Navigation uses `expo-router`: `useRouter()` for navigation, `useLocalSearchParams()` for route params.

### Outfit Recommendation Algorithm

**Location**: `lib/ai/heuristics.ts`

**Core function**: `recommendOutfit(items, prefs, weather)` returns an `Outfit` object.

**Algorithm logic**:
1. Filter available (non-archived) items
2. Determine required warmth level based on temperature thresholds:
   - ≥24°C → warmth 0 (summer)
   - 16-23°C → warmth 0 (light layers)
   - 8-15°C → warmth 1 (jacket)
   - ≤7°C → warmth 3 (coat)
3. **Weather-first selection**:
   - If rain (≥1mm precip): prioritize waterproof outerwear
   - If wind (≥25 kph): prioritize windproof outerwear
   - If cold (<16°C): require outerwear with adequate warmth
4. **Outfit construction** (sequential slot filling):
   - Try to find a dress first (if found, skip top/bottom)
   - Otherwise, find top then bottom
   - Find shoes (waterproof if raining)
   - Optionally find accessory
5. **Item scoring** (`scoreItem` function):
   - Base score: 100
   - Penalty for recently worn items (last 7 days): -10 per day
   - Penalty for avoided tags: -50
   - Bonus for adequate warmth: +10
   - Penalty for insufficient warmth: -20

**Important**: The algorithm uses `findBestMatch` which scores all candidates and picks the highest score. Candidates are pre-filtered by category and weather requirements.

### Type System

**Central types** (`lib/types/index.ts`):
- `Item`: Wardrobe item with photo, category, colors (hex array), warmth (0-5), waterproof/windproof booleans, seasons, tags, lastWorn timestamp
- `Preferences`: Style weights, fit, dress codes, avoided tags, units
- `WeatherSnapshot`: Temperature, wind, precipitation, location
- `Outfit`: Array of `OutfitItem` slots, weather snapshot, explanation text
- `Category`: Union type of valid categories (top, bottom, dress, outerwear, shoes, accessory, athleisure)

**Important**: `colors` is an array of hex strings, not a single color. `seasons` is also an array. Both are JSON-serialized in SQLite.

### Styling (NativeWind/Tailwind)

**Configuration**: `tailwind.config.js` has a custom "Luxe Minimal - Dark Sapphire" design system:
- Primary color: `#13315C` (dark sapphire) with shades 50-900
- Extended palette: sapphire variants, neutral grays, semantic colors (success/warning/error)
- Custom font sizes with line heights and letter spacing (hero, display-lg, h1, h2, title, subtitle, body, caption, etc.)
- Custom spacing scale (micro/xs/sm/md/lg/xl/xxl/jumbo)
- Custom border radius (xs/sm/md/lg/xl/pill)

**Usage**: Apply Tailwind classes via `className` prop. NativeWind translates them to React Native styles.

**Token reference**: `lib/styles/tokens.ts` exports constant values matching the Tailwind theme for use in non-NativeWind contexts.

## Data Flow Patterns

### Adding a new item:
1. User navigates to `item/new` (modal presentation)
2. Form captures photo via `expo-image-picker`, extracts colors (currently stubbed), collects metadata
3. On submit, `useWardrobe.addItem()` is called
4. Store calls `itemsRepo.createItem()` → SQLite insert
5. Store optimistically updates `items` array
6. Router navigates back to wardrobe screen

### Generating an outfit:
1. Home screen (`app/(tabs)/index.tsx`) loads weather via `lib/weather/client.ts`
2. User taps "Generate Outfit"
3. App calls `recommendOutfit()` with items from `useWardrobe`, prefs from `usePreferences`, and current weather
4. Algorithm returns `Outfit` object with selected items and explanation
5. Outfit is saved to DB via `outfitsRepo.createOutfit()`
6. Selected items have `lastWorn` updated via `itemsRepo.markItemWornToday()`
7. UI displays outfit with explanation text

### Onboarding flow:
1. On first launch, `settings.onboardingCompleted` is false
2. `app/_layout.tsx` or root screen checks this flag and redirects to `onboarding.tsx`
3. Onboarding wizard collects location permission, style preferences, initial items (optional)
4. On completion, `settingsRepo.updateSettings({ onboardingCompleted: true })`
5. App redirects to home screen

## Key Patterns & Conventions

### Database Singletons
Three tables use singleton pattern (id=1): `preferences`, `weather`, `settings`. Repos use "upsert" logic - they check if row exists, then UPDATE or INSERT.

### ID Generation
Items and outfits use timestamp-based UUIDs: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

### Timestamps
All timestamps are Unix milliseconds (JavaScript `Date.now()`), stored as INTEGER in SQLite.

### Image Storage
Photos are stored as file URIs (local filesystem paths from `expo-image-picker`). The `photoUri` field is a string path, not a base64 blob.

### Async Initialization
The app uses a two-phase initialization in `app/_layout.tsx`:
1. `useFrameworkReady()` hook ensures Expo framework is ready
2. `initDatabase()` + `seedDatabase()` run in useEffect
3. Loading screen blocks until `isDbReady === true`

### Error Handling
- Repo functions throw errors (do not return null/undefined on failure)
- Zustand stores catch errors and set `error` state
- UI components should check store `loading` and `error` states

## Spec vs Implementation Gaps

Use this checklist when updating Notion or drafting new work items.

- **Wardrobe capture (Notion §4.1)**: No batch import, background removal, auto-tagging, or item-state machine. Current flow is single photo → manual edits → immediate save as active item.
- **Preferences & constraints (Notion §4.2)**: Only single-select style archetype, single color palette, formality slider, and two toggles are implemented. Fit constraints, dress-code presets, dislikes, and trust sliders are future work.
- **Context ingestion (Notion §4.3)**: Weather only. There is no UI for occasion, activity, or commute inputs.
- **Outfit generation (Notion §4.4)**: Single heuristic outfit with basic explanation. No multiple suggestions, confidence scoring, comfort bands, swaps/locks, or “regenerate except locked slots.”
- **Save/share/history (Notion §4.5)**: Outfits save automatically post-generation; there is no accept/reject step, share sheet, packing list, or collage export.
- **Privacy & permissions (Notion §4.6)**: Data lives in local SQLite without deletion/export flows besides the console JSON dump. No analytics or model-improvement opt-in toggles.

## Known Limitations & Stubs

- **Web platform**: SQLite doesn't work on web. App is designed for iOS/Android only.
- **Cloud AI**: `useCloudAI` setting exists but is not fully implemented. All recommendations currently use heuristics. LLM infrastructure (Langfuse, Promptfoo) is ready for integration.
- **Color extraction**: `lib/utils/colorExtractor.ts` returns placeholder gray. Full implementation requires native modules or web APIs.
- **Export/Import**: Settings screen has export/import buttons but they only log to console. Implement with `expo-file-system` and `expo-sharing`.
- **Single-outfit flow**: Users can only generate one outfit at a time and are routed to the detail view immediately; multi-look carousels described in specs are not implemented.
- **Preferences fidelity**: No dress-code presets, fit constraints, dislikes, or “avoid together” tagging despite references in `context/SPECS.md`.
- **Onboarding scope**: Current onboarding screens do not request wardrobe items, preferences, or analytics consent.
- **Supabase sync**: Client helpers exist but there is no UI or background job that triggers them.

## Cloud Sync (Supabase)

**Location**: `lib/supabase/`

The app supports optional cloud backup and sync via Supabase while maintaining offline-first architecture.

**Setup**: See `lib/supabase/README.md` for detailed setup instructions including:
1. Creating a Supabase project
2. Configuring environment variables
3. Creating database tables with SQL
4. Setting up Row Level Security policies

**Key files**:
- `client.ts`: Supabase client configuration
- `sync.ts`: Sync functions for uploading/downloading data
- `test.ts`: Connection testing utility

**Sync strategy**: Manual, explicit sync. Local SQLite is always the source of truth. Sync functions:
- `syncAllToCloud()`: Upload all local data to Supabase
- `fetchItemsFromCloud()`: Download items from Supabase
- `syncItemsToCloud()`: Upload specific items
- Similar functions exist for preferences and outfits

**Important**: Current implementation uses "last write wins" - no conflict resolution. Images are stored as local URIs and won't sync across devices without implementing Supabase Storage upload.

## LLM Tooling (Langfuse & Promptfoo)

**Location**: `lib/ai/`

The project includes infrastructure for developing and deploying LLM-powered features (future Cloud AI).

### Langfuse (Observability)

**Purpose**: LLM tracing, metrics, and user feedback collection.

**Setup**: See [lib/ai/README.md](lib/ai/README.md:1#langfuse-integration) for detailed setup instructions.

**Key features**:
- Trace LLM API calls with inputs/outputs
- Track costs and latency
- Collect user feedback on AI recommendations
- Compare prompt versions

**Usage**:
```typescript
import { initLangfuse, trackOutfitRecommendation } from '@/lib/ai/langfuse';

// Initialize once at app startup
initLangfuse();

// Track recommendation
await trackOutfitRecommendation(userId, weather, preferences, outfit);
```

### Promptfoo (Testing)

**Purpose**: Automated testing and evaluation of LLM prompts.

**Configuration**: [.promptfooconfig.yaml](.promptfooconfig.yaml:1)

**Test prompts**: `prompts/` directory contains prompt templates
- `outfit-recommendation.txt` - JSON-based approach
- `outfit-recommendation-v2.txt` - Structured reasoning approach

**Running tests**:
```bash
npm run test:prompts        # Run tests
npm run test:prompts:ui     # Run with web UI
npm run test:prompts:watch  # Watch mode
```

**Test scenarios** included:
- Sunny summer day (light clothing)
- Rainy cold day (waterproof layers)
- Business meeting (formal attire)
- Gym workout (athletic wear)

**Why this matters**: Before implementing Cloud AI, use Promptfoo to:
1. Design and test prompts offline
2. Compare different prompt approaches
3. Test across multiple LLM providers (OpenAI, Anthropic)
4. Ensure consistent quality before production

## Environment Variables

**Supabase** (optional - for cloud sync):
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Langfuse** (optional - for LLM observability):
```
EXPO_PUBLIC_LANGFUSE_PUBLIC_KEY=your_langfuse_public_key
EXPO_PUBLIC_LANGFUSE_SECRET_KEY=your_langfuse_secret_key
EXPO_PUBLIC_LANGFUSE_BASE_URL=https://cloud.langfuse.com
```

**LLM API Keys** (optional - for Cloud AI and prompt testing):
```
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

Copy `.env.example` to `.env` and fill in your credentials. The app works fully without these configured. See [lib/ai/README.md](lib/ai/README.md:1) for setup instructions.

## Database Seed Data

`lib/db/seed.ts` inserts 12 sample items on first run (checks if items table is empty). Includes basic wardrobe staples across all categories. Safe to call multiple times - it's idempotent.
