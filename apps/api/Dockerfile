# Multi-stage Dockerfile for SuitUp Backend API
# Optimized for production deployment with minimal image size

# ============================================
# Stage 1: Base - Setup pnpm
# ============================================
FROM node:18-alpine AS base

# Enable corepack for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# ============================================
# Stage 2: Dependencies - Install all deps
# ============================================
FROM base AS deps

# Copy workspace configuration
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# Copy package.json files for all workspaces needed by the API
COPY apps/api/package.json ./apps/api/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/

# Install dependencies (including devDependencies for build)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ============================================
# Stage 3: Build - Compile TypeScript
# ============================================
FROM deps AS build

# Copy source code and config files
COPY apps/api ./apps/api
COPY packages/typescript-config ./packages/typescript-config
COPY packages/eslint-config ./packages/eslint-config
COPY turbo.json ./

# Generate Prisma Client
RUN pnpm --filter=@suitup/api db:generate

# Build the API
RUN pnpm --filter=@suitup/api build

# ============================================
# Stage 4: Production - Minimal runtime
# ============================================
FROM base AS production

# Install production dependencies only
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/api/package.json ./apps/api/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --prod --frozen-lockfile

# Copy built artifacts from build stage
COPY --from=build /app/apps/api/dist ./apps/api/dist

# Copy Prisma Client and schema
COPY --from=build /app/apps/api/prisma ./apps/api/prisma

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port (default 3000, can be overridden by env var)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Set working directory for API
WORKDIR /app/apps/api

# Start the server
CMD ["node", "dist/index.js"]
