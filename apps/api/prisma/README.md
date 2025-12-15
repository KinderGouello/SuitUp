# Prisma Database Guide

This directory contains the Prisma ORM configuration for the SuitUp API backend.

## Overview

- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma 6.x
- **Schema**: `schema.prisma`
- **Migrations**: `migrations/` directory
- **Seed data**: `seed.ts`

---

## Quick Start

### 1. Setup Environment Variables

Create a `.env` file in `apps/api/` with your database connection string:

```bash
# Supabase PostgreSQL connection
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

**Important**: Use different databases for different environments:
- **Development**: Local PostgreSQL or Supabase dev project
- **Staging**: Supabase staging project
- **Production**: Supabase production project

### 2. Generate Prisma Client

```bash
pnpm db:generate
```

This creates the Prisma Client based on your schema.

### 3. Run Migrations

```bash
# Apply pending migrations
pnpm db:migrate

# Or push schema directly (for development)
pnpm db:push
```

### 4. Seed Database (Optional)

```bash
pnpm db:seed
```

This populates the database with sample data for testing.

---

## Database Schema

### Models

#### User
- Represents app users
- Has one-to-one relationships with `Preferences` and `Settings`
- Has one-to-many relationships with `Item` and `Outfit`

#### Preferences
- Stores user style preferences
- Fields: `styleArchetype`, `colorPalette`, `formalityLevel`, `avoidedTags`, etc.

#### Settings
- App configuration per user
- Fields: `locationMode`, `temperatureUnit`, `onboardingCompleted`, etc.

#### Item
- Represents a wardrobe item
- Fields: `name`, `category`, `colors`, `warmth`, `waterproof`, etc.
- Tracks usage: `lastWornAt`, `timesWorn`

#### Outfit
- Generated outfit recommendations
- Contains multiple items via `OutfitItem` junction table
- Stores weather context when created

#### OutfitItem
- Many-to-many join table between `Outfit` and `Item`
- Tracks which slot each item occupies (e.g., "top", "bottom")

#### WeatherSnapshot
- Caches weather data
- Includes location, temperature, precipitation, wind, etc.

---

## Common Commands

### Development Workflow

```bash
# Generate Prisma Client (after schema changes)
pnpm db:generate

# Create a migration (after schema changes)
pnpm db:migrate

# Push schema without creating migration (quick development)
pnpm db:push

# Reset database (WARNING: deletes all data)
pnpm db:reset

# Seed database with test data
pnpm db:seed

# Open Prisma Studio (visual database browser)
pnpm db:studio
```

### Production Deployment

```bash
# Apply migrations in production
pnpm db:migrate:deploy
```

**Note**: Always test migrations in staging before production!

---

## Making Schema Changes

### Workflow

1. **Edit `schema.prisma`**
   - Add/modify models, fields, or relations
   - Update enums, indexes, or constraints

2. **Generate migration**
   ```bash
   pnpm db:migrate
   ```
   - Prisma will prompt for a migration name
   - Use descriptive names: `add_user_favorites`, `update_item_schema`

3. **Review migration SQL**
   - Check `migrations/[timestamp]_[name]/migration.sql`
   - Verify SQL is correct and safe

4. **Test migration**
   - Apply migration to dev database
   - Run tests to ensure nothing broke
   - Test with seed data

5. **Commit**
   ```bash
   git add prisma/schema.prisma prisma/migrations/
   git commit -m "feat(db): add user favorites feature"
   ```

### Example: Adding a New Field

```prisma
model Item {
  // ... existing fields
  isFavorite Boolean @default(false) // NEW FIELD
}
```

Then run:
```bash
pnpm db:migrate
# Name: add_item_favorite_field
```

---

## Migrations

### Directory Structure

```
migrations/
├── 20250115_init/
│   └── migration.sql          # Initial schema
├── 20250116_add_favorites/
│   └── migration.sql          # Add favorites feature
└── migration_lock.toml        # Lock file (don't edit)
```

### Migration Best Practices

✅ **DO**:
- Create descriptive migration names
- Review migration SQL before applying
- Test migrations in development first
- Backup production data before migrations
- Keep migrations small and focused

❌ **DON'T**:
- Edit existing migration files
- Delete migration files
- Skip migrations (use `db:migrate:deploy` in sequence)
- Make breaking changes without a plan

### Rolling Back Migrations

Prisma doesn't support automatic rollbacks. To rollback:

1. **Reset database** (loses all data):
   ```bash
   pnpm db:reset
   ```

2. **Manual rollback** (preserves data):
   - Remove the migration folder
   - Manually write SQL to undo changes
   - Apply with raw SQL or Prisma

3. **Forward-fix** (recommended):
   - Create a new migration that fixes the issue
   - Safer for production

---

## Seeding

### Seed Script

The `seed.ts` file creates sample data:
- 1 test user
- User preferences and settings
- 4 sample wardrobe items
- 1 sample outfit
- 1 weather snapshot

### Running Seeds

```bash
# Run seed script
pnpm db:seed

# Reset database and re-seed
pnpm db:reset
```

### Customizing Seeds

Edit `prisma/seed.ts` to add your own test data.

---

## Prisma Studio

Visual database browser for exploring and editing data:

```bash
pnpm db:studio
```

Opens at `http://localhost:5555`

**Features**:
- Browse all tables
- Filter and sort data
- Edit records directly
- View relationships

---

## Prisma Client Usage

### Basic Queries

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
  },
});

// Find
const users = await prisma.user.findMany({
  where: { email: { contains: '@example.com' } },
  include: { items: true },
});

// Update
const updated = await prisma.user.update({
  where: { id: userId },
  data: { name: 'Jane Doe' },
});

// Delete
await prisma.user.delete({
  where: { id: userId },
});
```

### Relations

```typescript
// Create user with nested relations
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    preferences: {
      create: {
        styleArchetype: 'minimal',
        formalityLevel: 6,
      },
    },
    items: {
      create: [
        { name: 'Blue Shirt', category: 'top' },
        { name: 'Jeans', category: 'bottom' },
      ],
    },
  },
  include: {
    preferences: true,
    items: true,
  },
});
```

---

## Troubleshooting

### "Prisma Client did not initialize yet"

**Solution**: Run `pnpm db:generate`

### "Migration failed"

**Causes**:
- Database connection issue
- Conflicting schema changes
- Invalid SQL in migration

**Solution**:
1. Check `DATABASE_URL` in `.env`
2. Review migration SQL
3. Reset database if necessary: `pnpm db:reset`

### "Can't reach database server"

**Solution**:
1. Verify Supabase project is active
2. Check database connection string
3. Ensure IP is whitelisted in Supabase (if applicable)
4. Test connection: `psql $DATABASE_URL`

### Tests failing with database errors

**Solution**:
1. Ensure test database is set up (CI uses PostgreSQL service)
2. Check `DATABASE_URL` env var is set in tests
3. Generate Prisma Client: `pnpm db:generate`

---

## Environment-Specific Databases

### Development

Use local PostgreSQL or Supabase dev project:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/suitup_dev"
```

### Testing (CI)

CI uses ephemeral PostgreSQL (see `.github/workflows/ci.yml`):

```bash
DATABASE_URL="postgresql://test:test@localhost:5432/suitup_test"
```

### Staging

Use dedicated Supabase staging project:

```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@[STAGING-HOST]:5432/postgres"
```

### Production

Use Supabase production project:

```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROD-HOST]:5432/postgres"
```

**Important**: Never use the same database for multiple environments!

---

## Resources

- **Prisma Docs**: https://www.prisma.io/docs
- **Prisma Schema Reference**: https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference
- **Supabase Docs**: https://supabase.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

---

## Next Steps

1. ✅ Review the schema in `schema.prisma`
2. ✅ Set up your `DATABASE_URL` in `.env`
3. ✅ Run `pnpm db:generate` to create Prisma Client
4. ✅ Run `pnpm db:push` to sync schema to database
5. ✅ Run `pnpm db:seed` to populate test data
6. ✅ Start building your API!
