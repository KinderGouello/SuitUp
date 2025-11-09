# SuitUp Monorepo

Wardrobe management and weather-based outfit recommendations - Full-stack application.

## 📦 Structure

```
suitup/
├── apps/
│   ├── mobile/          # React Native Expo app (iOS/Android)
│   └── api/             # Node.js Fastify backend
├── packages/
│   ├── eslint-config/   # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
└── .changeset/          # Changesets for versioning
```

## 🚀 Quick Start

### Installation

```bash
pnpm install
```

### Development

```bash
# Start both mobile and API in parallel
pnpm dev

# Or start individually:
pnpm dev:mobile   # Start Expo dev server
pnpm dev:api      # Start Fastify API server
```

### Build

```bash
# Build all apps
pnpm build

# Or build individually:
pnpm build:mobile   # Build mobile app for web
pnpm build:api      # Build API to dist/
```

### Other Commands

```bash
pnpm lint           # Lint all packages
pnpm typecheck      # Type-check all packages
pnpm clean          # Clean all build artifacts
pnpm format         # Format code with Prettier
```

## 📝 Versioning with Changesets

```bash
# Create a changeset (describe your changes)
pnpm changeset

# Version packages (updates package.json versions)
pnpm version-packages

# Publish packages (after versioning)
pnpm release
```

## 🏗️ Tech Stack

### Mobile App (`apps/mobile`)
- **Framework**: Expo SDK 54, React Native 0.81.4
- **Routing**: Expo Router (file-based)
- **State**: Zustand, TanStack Query
- **Database**: Expo SQLite
- **Styling**: NativeWind (Tailwind CSS)
- **Icons**: Lucide React Native

### API (`apps/api`)
- **Framework**: Fastify 5.x
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Dev Tool**: tsx (watch mode)

### Shared Packages
- **Build System**: Turborepo
- **Package Manager**: pnpm 9.15.0
- **Versioning**: Changesets

## 📱 Mobile Development

After running `pnpm dev:mobile`, press:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web browser

## 🔌 API Endpoints

When running `pnpm dev:api`, the API is available at `http://localhost:3000`:

- `GET /` - API welcome message
- `GET /health` - Health check endpoint

## 🧪 Testing

```bash
# Run prompt tests (LLM evaluation)
cd apps/mobile
pnpm test:prompts
pnpm test:prompts:ui    # Open web UI
```

## 📚 Documentation

- Mobile App: See `apps/mobile/CLAUDE.md`
- Architecture: See `apps/mobile/context/ARCHITECTURE.md`
- Design System: See `apps/mobile/FIGMA.md`

## ⚙️ Environment Variables

Copy `.env.example` to `.env` in each app directory and fill in your credentials.

### Mobile (`apps/mobile/.env`)
```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
EXPO_PUBLIC_LANGFUSE_PUBLIC_KEY=your_langfuse_key
```

### API (`apps/api/.env`)
```bash
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```

## 🛠️ Development Workflow

1. **Create a new feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make your changes**
   - Edit code in `apps/mobile` or `apps/api`
   - Hot reload works automatically

3. **Create a changeset**
   ```bash
   pnpm changeset
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add my feature"
   git push
   ```

## 📦 Adding Dependencies

### Workspace dependencies (shared configs)
```bash
# In apps/mobile or apps/api
pnpm add @suitup/eslint-config@workspace:* -D
```

### External dependencies
```bash
# Mobile
pnpm --filter @suitup/mobile add package-name

# API
pnpm --filter @suitup/api add package-name
```

## 🏗️ Turborepo Cache

Turborepo caches build outputs for faster rebuilds. To clear the cache:

```bash
turbo clean
```

## 📄 License

Private - All rights reserved
