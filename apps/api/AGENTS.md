# Backend API - AI Agent Guide

**Stack**: Node.js 18+ + Fastify 5.x + TypeScript (ESM)

This guide provides architecture and coding context for AI agents working on the SuitUp backend API.

## 🗺️ Navigation

- **← [Root Agent Guide](../../AGENTS.md)** - Monorepo overview & global conventions
- **[Mobile App Architecture](../mobile/AGENTS.md)** - Client app context (useful for API design)
- **[Mobile System Architecture](../mobile/agents/architecture.md)** - Full system design (includes future backend plans)

## 📋 Current API Status

### ✅ What's Implemented

- **Fastify 5.2.0 server** with TypeScript
- **Health check endpoint** (`GET /health`)
- **Structured logging** (Fastify logger)
- **Environment-based configuration**
- **Hot reload** (tsx watch mode)

### 🚧 What's NOT Implemented Yet

This is a **minimal starter API**. The mobile app currently operates **offline-first** and doesn't call this backend.

**Future endpoints** (see [mobile/agents/architecture.md](../mobile/agents/architecture.md) for full specs):
- `POST /v1/garments` - Upload wardrobe items
- `GET /v1/garments` - List items with filters
- `POST /v1/recommendations:generate` - Generate outfits (LLM-powered)
- `POST /v1/feedback` - Collect user feedback
- `GET /v1/context/weather` - Weather proxy

## 🏗️ Current API Architecture

### File Structure

```
apps/api/
├── src/
│   └── index.ts           # Main server file (everything's here for now)
├── package.json
├── tsconfig.json
└── AGENTS.md             # 👈 You are here
```

### Current Code

```typescript
// src/index.ts
import Fastify from 'fastify';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  };
});

// Root endpoint
fastify.get('/', async (request, reply) => {
  return {
    message: 'SuitUp API - Welcome! 👔',
    version: '1.0.0',
    endpoints: {
      health: '/health',
    },
  };
});

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`🚀 Server ready at http://${HOST}:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
```

## 🎯 Architectural Patterns to Follow

### 1. Project Structure (When Adding Features)

```
apps/api/
├── src/
│   ├── index.ts              # Server setup & plugin registration
│   ├── routes/               # Route handlers
│   │   ├── health.ts
│   │   ├── garments/
│   │   │   ├── index.ts      # GET /garments, POST /garments
│   │   │   └── schema.ts     # Zod schemas
│   │   └── recommendations/
│   │       ├── index.ts
│   │       └── schema.ts
│   ├── services/             # Business logic
│   │   ├── wardrobe.service.ts
│   │   ├── recommendation.service.ts
│   │   └── weather.service.ts
│   ├── models/               # Data models & types
│   │   └── garment.ts
│   ├── lib/                  # Shared utilities
│   │   ├── db.ts            # Database connection
│   │   ├── logger.ts        # Logging setup
│   │   └── validation.ts    # Shared validators
│   └── types/                # TypeScript type definitions
│       └── index.ts
├── tests/                    # Tests
│   ├── unit/
│   └── integration/
└── package.json
```

### 2. Fastify Plugin Pattern

When adding routes, use Fastify plugins:

```typescript
// src/routes/garments/index.ts
import { FastifyInstance } from 'fastify';
import { createGarmentSchema, GarmentResponse } from './schema';

export default async function garmentRoutes(fastify: FastifyInstance) {
  // POST /garments
  fastify.post('/garments', {
    schema: {
      body: createGarmentSchema,
      response: {
        201: GarmentResponse,
      },
    },
  }, async (request, reply) => {
    const garment = request.body;
    // Business logic here or call service
    reply.code(201).send({ id: 'garment-123', ...garment });
  });

  // GET /garments
  fastify.get('/garments', async (request, reply) => {
    // ...
  });
}

// src/index.ts
import garmentRoutes from './routes/garments';
await fastify.register(garmentRoutes, { prefix: '/v1' });
```

### 3. Schema Validation (Fastify + Zod)

Use Zod for runtime validation, JSON Schema for Fastify:

```typescript
// src/routes/garments/schema.ts
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Zod schema
export const createGarmentSchema = z.object({
  category: z.enum(['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessory']),
  colors: z.array(z.string()),
  warmth: z.number().min(-2).max(5),
});

// Convert to JSON Schema for Fastify
export const CreateGarmentJsonSchema = zodToJsonSchema(createGarmentSchema);

// TypeScript type
export type CreateGarment = z.infer<typeof createGarmentSchema>;
```

### 4. Service Layer Pattern

Keep business logic separate from routes:

```typescript
// src/services/wardrobe.service.ts
import type { CreateGarment, Garment } from '@/types';

export class WardrobeService {
  async createGarment(data: CreateGarment): Promise<Garment> {
    // Validate, process, save to DB
    const garment = {
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
    };

    // await db.insert(garment);
    return garment;
  }

  async getGarments(filters?: GarmentFilters): Promise<Garment[]> {
    // Query DB with filters
    return [];
  }
}

// src/routes/garments/index.ts
import { WardrobeService } from '@/services/wardrobe.service';

const wardrobeService = new WardrobeService();

fastify.post('/garments', async (request, reply) => {
  const garment = await wardrobeService.createGarment(request.body);
  reply.code(201).send(garment);
});
```

### 5. Error Handling

Use Fastify's error handling:

```typescript
// Custom error class
class NotFoundError extends Error {
  statusCode = 404;
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

// In route
fastify.get('/garments/:id', async (request, reply) => {
  const garment = await wardrobeService.getGarment(request.params.id);

  if (!garment) {
    throw new NotFoundError(`Garment ${request.params.id} not found`);
  }

  return garment;
});

// Global error handler
fastify.setErrorHandler((error, request, reply) => {
  request.log.error(error);

  const statusCode = error.statusCode || 500;
  reply.status(statusCode).send({
    error: error.name,
    message: error.message,
    statusCode,
  });
});
```

## 🔧 Agent Instructions - API-Specific

### Adding a New Endpoint

1. **Create route file** in `src/routes/<feature>/index.ts`
2. **Define Zod schemas** in `src/routes/<feature>/schema.ts`
3. **Create service** (if needed) in `src/services/<feature>.service.ts`
4. **Register plugin** in `src/index.ts`:
   ```typescript
   import myRoutes from './routes/my-feature';
   await fastify.register(myRoutes, { prefix: '/v1' });
   ```
5. **Add types** to `src/types/index.ts`

### Adding Environment Variables

1. Add to `.env.example`:
   ```bash
   # New feature config
   MY_API_KEY=your_key_here
   MY_TIMEOUT_MS=5000
   ```

2. Access in code:
   ```typescript
   const apiKey = process.env.MY_API_KEY;
   if (!apiKey) {
     throw new Error('MY_API_KEY is required');
   }
   ```

3. **Document** in README.md environment variables section

### Database Integration (Future)

When adding a database:

```typescript
// src/lib/db.ts
import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// src/index.ts
import { pool } from './lib/db';

fastify.addHook('onClose', async () => {
  await pool.end();
});
```

### Testing

```typescript
// tests/unit/services/wardrobe.test.ts
import { describe, it, expect } from 'vitest';
import { WardrobeService } from '@/services/wardrobe.service';

describe('WardrobeService', () => {
  it('creates a garment', async () => {
    const service = new WardrobeService();
    const garment = await service.createGarment({
      category: 'top',
      colors: ['#000000'],
      warmth: 1,
    });

    expect(garment.id).toBeDefined();
    expect(garment.category).toBe('top');
  });
});
```

## 📝 Code Conventions

### TypeScript

- **ESM modules** (`"type": "module"` in package.json)
- **Strict mode** enabled
- No `any` types
- Prefer interfaces for objects, types for unions

### File Naming

- Routes: lowercase kebab-case (`garments.ts`, `my-feature.ts`)
- Services: PascalCase + `.service.ts` (`WardrobeService.service.ts`)
- Types: singular (`types.ts`)
- Tests: `*.test.ts` or `*.spec.ts`

### Imports

Use TypeScript path aliases (configured in `tsconfig.json`):

```typescript
import { Garment } from '@/types';
import { WardrobeService } from '@/services/wardrobe.service';
import { logger } from '@/lib/logger';
```

*Note: Currently no path aliases configured. Add to `tsconfig.json`:*
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Logging

Use Fastify's built-in logger:

```typescript
// In routes
fastify.get('/garments', async (request, reply) => {
  request.log.info('Fetching garments');
  // ...
});

// Outside routes
import { fastify } from './index';
fastify.log.error('Something went wrong');
```

### Environment Variables

Standard names (from [mobile/agents/architecture.md](../mobile/agents/architecture.md) § 13):

```bash
# Authentication
AUTH_JWT_SECRET=secret

# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Storage
S3_ENDPOINT=
S3_ACCESS_KEY=
S3_SECRET=

# External APIs
WEATHER_API_KEY=
LLM_PROVIDER=openai
LLM_MODEL=gpt-4
LLM_TIMEOUT_MS=10000
LLM_MAX_TOKENS=1000

# App Config
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
LOG_LEVEL=info
```

## 🔗 Cross-References

### API Design Guidelines

For future endpoints, follow specs in:
- **[mobile/agents/architecture.md § 6](../mobile/agents/architecture.md#6-api-contracts-openapi-cues)** - REST API contracts
- **[mobile/agents/architecture.md § 10](../mobile/agents/architecture.md#10-backend-services-nestjs-dddhex)** - Service architecture
- **[mobile/agents/architecture.md § 7](../mobile/agents/architecture.md#7-llm-agent-context--tools)** - LLM integration patterns

### Mobile App Context

Understand the client to design better APIs:
- **[mobile/AGENTS.md](../mobile/AGENTS.md)** - Mobile app architecture
- **[mobile/CLAUDE.md](../mobile/CLAUDE.md)** - Comprehensive mobile context

## 🚀 Common Agent Tasks

### Task: Add Garments CRUD Endpoints

1. Create `src/routes/garments/index.ts` with plugin
2. Define schemas in `src/routes/garments/schema.ts`:
   ```typescript
   import { z } from 'zod';

   export const CreateGarmentSchema = z.object({
     category: z.enum(['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessory']),
     colors: z.array(z.string()),
     warmth: z.number().min(-2).max(5),
     // ... other fields
   });

   export const GarmentSchema = CreateGarmentSchema.extend({
     id: z.string().uuid(),
     userId: z.string().uuid(),
     createdAt: z.string().datetime(),
   });
   ```
3. Create `src/services/wardrobe.service.ts`
4. Register in `src/index.ts`
5. Test with `curl` or Postman

### Task: Add Weather Proxy Endpoint

1. Create `src/routes/weather/index.ts`
2. Use `fetch` to call Open-Meteo API
3. Cache responses in Redis (or in-memory for now)
4. Return normalized `WeatherSnapshot` format (see mobile types)

### Task: Add LLM-Powered Outfit Recommendations

1. Review **[mobile/agents/architecture.md § 7](../mobile/agents/architecture.md#7-llm-agent-context--tools)** for LLM patterns
2. Create `src/services/recommendation.service.ts`
3. Integrate OpenAI/Anthropic SDK
4. Validate response against `OutfitResponse` schema (§ 6 in architecture doc)
5. Add auto-repair loop (max 1 retry)
6. Return structured JSON to client

## ⚠️ Important Notes

### Current Limitations

- **No database** - Everything is in-memory (lost on restart)
- **No authentication** - All endpoints are public
- **No rate limiting** - Can be abused
- **No tests** - No test suite yet
- **No deployment config** - Local dev only

### Before Production

Checklist for production-ready API:
- [ ] Add database (PostgreSQL + Prisma)
- [ ] Add authentication (JWT)
- [ ] Add rate limiting (fastify-rate-limit)
- [ ] Add CORS configuration
- [ ] Add Helmet for security headers
- [ ] Add request logging (Pino)
- [ ] Add error tracking (Sentry)
- [ ] Add health checks (database, Redis, etc.)
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add tests (unit + integration)
- [ ] Add Docker configuration
- [ ] Add CI/CD pipeline

## 📚 Additional Resources

- [Fastify Documentation](https://fastify.dev)
- [Fastify Best Practices](https://fastify.dev/docs/latest/Guides/Getting-Started/#your-first-plugin)
- [Zod Documentation](https://zod.dev)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Questions?** Check [Root AGENTS.md](../../AGENTS.md) for monorepo conventions or [Mobile AGENTS.md](../mobile/AGENTS.md) for client context.
