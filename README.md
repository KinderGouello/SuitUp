# Suit up! - Personal Wardrobe & Outfit Recommendation App

A modern React Native Expo app that helps you catalog your wardrobe and get daily outfit recommendations based on weather, style preferences, and your own items.

## Features

- **Wardrobe Catalog**: Add clothing items with photos, categories, colors, fabrics, and metadata
- **Weather-Aware Recommendations**: Get outfit suggestions based on current weather conditions
- **Style Preferences**: Customize your style profile with preferences for formality, color palette, fit, and dress codes
- **Offline-First**: All data stored locally using SQLite; works without internet connection
- **Smart Algorithm**: Heuristic-based outfit recommendation considering temperature, precipitation, wind, and personal style
- **Cost Per Wear**: Track when items were last worn and calculate cost per wear

## Tech Stack

- **Expo SDK 54** with React Native
- **TypeScript** for type safety
- **Expo Router** for file-based navigation
- **Zustand** for state management
- **TanStack Query** for async operations
- **Expo SQLite** for local database
- **NativeWind** (Tailwind for RN) for styling
- **Lucide Icons** for consistent iconography
- **Open-Meteo** for weather data (no API key required)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI

### Installation

\`\`\`bash
npm install
\`\`\`

### Running the App

\`\`\`bash
# Start development server
npm run dev

# Run on iOS simulator
npm run dev
# Then press 'i'

# Run on Android emulator
npm run dev
# Then press 'a'

# Run on web (Note: SQLite not supported on web)
npm run dev
# Then press 'w'
\`\`\`

### Environment Variables

Create a `.env` file with:

\`\`\`
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
\`\`\`

## Project Structure

\`\`\`
app/
  (tabs)/           # Tab-based navigation screens
    index.tsx       # Home screen with weather & recommendations
    wardrobe.tsx    # Browse wardrobe items
    preferences.tsx # Style preference settings
    settings.tsx    # App settings
  item/
    new.tsx         # Add new item wizard
    [id].tsx        # Item detail view
  outfit/
    [id].tsx        # Outfit detail view
  onboarding.tsx    # First-time setup

components/        # Reusable UI components
  Button.tsx
  ItemCard.tsx
  OutfitCard.tsx
  WeatherBadge.tsx
  Tag.tsx

lib/
  ai/
    heuristics.ts   # Outfit recommendation algorithm
  db/
    schema.ts       # SQLite schema
    init.ts         # Database initialization
    seed.ts         # Sample data seeder
    repo/           # Data access layer
  types/
    index.ts        # TypeScript type definitions
  weather/
    client.ts       # Weather API client
  utils/
    colorExtractor.ts # Image color analysis

state/             # Zustand stores
  useWardrobe.ts
  usePreferences.ts
  useSettings.ts
\`\`\`

## Outfit Recommendation Algorithm

The app uses a heuristic-based algorithm that considers:

### Temperature-Based Layering

- ≥24°C: Light summer clothing
- 16-23°C: T-shirt + light layers
- 8-15°C: Long sleeves + jacket
- ≤7°C: Warm knits + coat

### Weather Conditions

- **Rain (≥1mm)**: Waterproof outerwear & shoes
- **Wind (≥25 kph)**: Windproof layers
- **Current season**: Matches items tagged for the season

### Style Preferences

- Formal level matching (1=casual, 3=formal)
- Color palette preferences (neutral, light, dark, vivid, earthy)
- Fit preferences (regular, oversized, slim)
- Dress code constraints (office, business formal, smart casual, weekend, workout)

### Smart Features

- **Repeat cooldown**: Avoids re-using items worn recently (configurable days)
- **Tag avoidance**: Skip items with avoided tags
- **Color harmony**: Prefers combinations within your color palette

## Data Model

### Item
- Photo, name, category, subcategory
- Colors (array of hex codes)
- Fabric, warmth level (0-3), formal level (1-3)
- Waterproof/windproof flags
- Seasons (spring/summer/fall/winter)
- Tags, last worn date, cost

### Preferences
- Style weights (minimalist, casual, formal, sporty, street, chic, edgy, boho)
- Color palette, fit preference
- Dress codes, avoided tags
- Repeat cooldown days

### WeatherSnapshot
- Temperature (current, min, max, feels like)
- Wind speed, precipitation
- Condition description
- Location (lat/lon or city)

### Outfit
- Array of items (with slot assignments)
- Weather snapshot at creation time
- Explanation of why items were chosen

## Seed Data

The app includes 12 sample items:
- White cotton t-shirt
- Blue oxford shirt
- Gray hoodie
- Denim jacket
- Black trench coat
- Wool coat
- Blue jeans
- Beige chinos
- Khaki shorts
- White sneakers
- Brown leather boots
- Black leather belt

## Testing

\`\`\`bash
# Type checking
npm run typecheck

# Linting
npm run lint
\`\`\`

## Known Limitations

- **Web platform**: SQLite is not supported on web. The app is designed for iOS and Android.
- **AI features**: Cloud AI is stubbed out and not implemented (on-device heuristics work)
- **Image color extraction**: Currently returns a placeholder gray; full implementation requires native modules
- **Export/Import**: Currently logs to console instead of file system export

## Future Enhancements

- Calendar view of outfit history
- Multi-wardrobe support (e.g., for partners)
- Enhanced color extraction from photos
- Cloud AI integration for smarter recommendations
- Tag suggestions from AI
- Cost per wear analytics
- Wear frequency tracking

## License

MIT

## Author

Built with Expo and React Native
