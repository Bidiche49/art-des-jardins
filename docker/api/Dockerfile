# ===========================================
# Art & Jardin - API Dockerfile
# Multi-stage build for production
# ===========================================

# -----------------------------
# Stage 1: Dependencies
# -----------------------------
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace config
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./

# Copy package.json files for all packages
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

# -----------------------------
# Stage 2: Builder
# -----------------------------
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/database/node_modules ./packages/database/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules

# Copy source
COPY . .

# Generate Prisma client
RUN pnpm --filter database generate

# Build shared packages first
RUN pnpm --filter shared build
RUN pnpm --filter database build

# Build API
RUN pnpm --filter api build

# Prune dev dependencies
RUN pnpm prune --prod

# -----------------------------
# Stage 3: Runner
# -----------------------------
FROM node:20-alpine AS runner

RUN apk add --no-cache dumb-init

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/packages/database/dist ./node_modules/@art-et-jardin/database/dist
COPY --from=builder --chown=nestjs:nodejs /app/packages/shared/dist ./node_modules/@art-et-jardin/shared/dist

# Copy Prisma client
COPY --from=builder --chown=nestjs:nodejs /app/node_modules/.pnpm/@prisma+client*/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nestjs:nodejs /app/packages/database/prisma ./prisma

USER nestjs

EXPOSE 3000

# Use dumb-init to handle signals properly
CMD ["dumb-init", "node", "dist/main.js"]
