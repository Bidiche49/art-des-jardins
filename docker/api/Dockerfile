# ===========================================
# Art & Jardin - API Dockerfile
# Multi-stage build for production
# ===========================================

# -----------------------------
# Stage 1: Dependencies
# -----------------------------
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat openssl
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

RUN apk add --no-cache libc6-compat openssl
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

# Build shared packages first, then API
RUN pnpm --filter shared build
RUN pnpm --filter database build
RUN pnpm --filter api build

# -----------------------------
# Stage 3: Runner
# Preserves monorepo structure so pnpm symlinks work
# -----------------------------
FROM node:20-alpine AS runner

RUN apk add --no-cache dumb-init openssl

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy node_modules (includes all deps with generated Prisma client)
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules

# Copy built API + its node_modules (pnpm symlinks to root node_modules)
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/node_modules ./apps/api/node_modules

# Copy workspace packages (built output + package.json for module resolution)
COPY --from=builder --chown=nestjs:nodejs /app/packages/database/dist ./packages/database/dist
COPY --from=builder --chown=nestjs:nodejs /app/packages/database/package.json ./packages/database/package.json
COPY --from=builder --chown=nestjs:nodejs /app/packages/database/node_modules ./packages/database/node_modules
COPY --from=builder --chown=nestjs:nodejs /app/packages/database/prisma ./packages/database/prisma
COPY --from=builder --chown=nestjs:nodejs /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder --chown=nestjs:nodejs /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder --chown=nestjs:nodejs /app/packages/shared/node_modules ./packages/shared/node_modules

# Copy entrypoint
COPY --chown=nestjs:nodejs docker/api/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

USER nestjs

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["./entrypoint.sh"]
