# SuitUp Monorepo - AI Agent Guide

**Welcome, AI Agent!** This document provides a quick navigation guide to help you understand and work with the SuitUp monorepo efficiently.

## 🗺️ Quick Navigation

### Application-Specific Documentation
- **[Mobile App Agent Guide](apps/mobile/AGENTS.md)** - React Native Expo app architecture & conventions
- **[Backend API Agent Guide](apps/api/AGENTS.md)** - Node.js Fastify backend architecture & patterns

### General Documentation
- **[README.md](README.md)** - Monorepo overview, commands, and workflows
- **[MIGRATION.md](MIGRATION.md)** - Technical migration details from single-repo to monorepo
- **[Mobile App Context](apps/mobile/CLAUDE.md)** - Comprehensive mobile app documentation
- **[Design System](apps/mobile/FIGMA.md)** - UI/UX design guidelines

## 📦 Monorepo Structure

```
suitup/
├── apps/
│   ├── mobile/          # React Native Expo app (iOS/Android)
│   │   └── AGENTS.md    # 👈 Mobile-specific agent guide
│   └── api/             # Node.js Fastify backend
│       └── AGENTS.md    # 👈 API-specific agent guide
├── packages/
│   ├── eslint-config/   # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
└── AGENTS.md           # 👈 You are here
```

## 🎯 Global Conventions

### Package Manager & Build System
- **pnpm workspaces** - Multi-package dependency management (see [.npmrc](.npmrc:1) for React Native/Expo-specific hoisting)
- **Turborepo** - Intelligent build caching and task orchestration
- **Changesets** - Automated versioning and changelog generation

### Workspace Naming
All packages use `@suitup/*` scope:
- `@suitup/mobile` - Mobile application
- `@suitup/api` - Backend API
- `@suitup/eslint-config` - Shared ESLint rules
- `@suitup/typescript-config` - Shared TypeScript configs

### Development Workflow
```bash
# Start both mobile and API
pnpm dev

# Or individually
pnpm dev:mobile   # React Native Expo
pnpm dev:api      # Fastify server

# Quality checks
pnpm lint         # All packages
pnpm typecheck    # All packages
pnpm build        # All packages
```

## 🧭 Where to Start?

### Working on Mobile Features
→ Start with **[apps/mobile/AGENTS.md](apps/mobile/AGENTS.md)**

**Key topics:**
- React Native architecture
- Expo Router navigation
- SQLite database patterns
- Zustand state management
- NativeWind styling

**Important:** Also reference [apps/mobile/CLAUDE.md](apps/mobile/CLAUDE.md) as the single source of truth for mobile app context, tooling policies, and links to supporting docs (design, specs, architecture).

### Working on Backend/API
→ Start with **[apps/api/AGENTS.md](apps/api/AGENTS.md)**

**Key topics:**
- Fastify server structure
- Route organization
- TypeScript patterns
- API endpoint conventions

### Shared Code/Configuration
→ Check **[packages/](packages/)**

Currently contains:
- ESLint configuration (Expo & Node.js variants)
- TypeScript configuration (base, expo, node)

## 📝 Agent Instructions - General Guidelines

### File Operations
1. **Prefer editing over creating** - Minimize file proliferation
2. **Read before modifying** - Always use Read tool before Edit/Write
3. **Preserve Git history** - Use `git mv` for file moves

### Code Style
1. **TypeScript strict mode** - All code is type-safe
2. **No emojis** - Unless explicitly requested
3. **ESLint compliance** - Follow shared config rules

### Documentation
1. **Update docs with code** - Keep documentation in sync
2. **Reference existing patterns** - Check similar files before creating new ones
3. **Cross-reference related docs** - Link between AGENTS.md, CLAUDE.md, etc.

### Monorepo-Specific
1. **Workspace dependencies** - Use `workspace:*` protocol
2. **Filter commands** - Use `--filter` for package-specific commands
3. **Cache awareness** - Turborepo caches build outputs

## 🔗 Cross-References

### For Mobile Development
```
AGENTS.md (this file)
    ↓
apps/mobile/AGENTS.md (architecture & patterns)
    ↓
apps/mobile/CLAUDE.md (comprehensive context - single source of truth)
    ↓
apps/mobile/FIGMA.md (design system)
```

### For Backend Development
```
AGENTS.md (this file)
    ↓
apps/api/AGENTS.md (architecture & patterns)
```

### For Infrastructure/Tooling
```
AGENTS.md (this file)
    ↓
README.md (monorepo commands)
    ↓
MIGRATION.md (technical details)
```

## 🚀 Common Tasks

### Adding a New Dependency

**Mobile:**
```bash
pnpm --filter @suitup/mobile add package-name
```

**API:**
```bash
pnpm --filter @suitup/api add package-name
```

### Creating a New Shared Package

```bash
mkdir -p packages/my-package/src
# Create package.json with name "@suitup/my-package"
# Create src/index.ts
pnpm install  # Refresh workspace
```

### Running Package-Specific Commands

```bash
# Mobile-only
pnpm --filter @suitup/mobile dev

# API-only
pnpm --filter @suitup/api build
```

## ⚠️ Important Notes

### Known Issues
- **TypeScript errors in mobile** - Some pre-existing errors (non-blocking)
- **Figma directory excluded** - `apps/mobile/figma/` not type-checked
- **React Native New Architecture** - Expo SDK 54 uses bleeding-edge features

### Platform-Specific
- **Mobile** - iOS/Android only (web build available but SQLite unsupported)
- **API** - Node.js 18+ required

## 📚 Additional Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces Guide](https://pnpm.io/workspaces)
- [Expo Documentation](https://docs.expo.dev)
- [Fastify Documentation](https://fastify.dev)

---

**Ready to code?** Navigate to the appropriate `AGENTS.md` file based on what you're working on! 🎯
