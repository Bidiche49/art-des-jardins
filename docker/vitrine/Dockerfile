# ===========================================
# Art & Jardin - Site Vitrine Dockerfile
# Next.js standalone build
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

# Copy package.json files
COPY apps/vitrine/package.json ./apps/vitrine/
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
COPY --from=deps /app/apps/vitrine/node_modules ./apps/vitrine/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules

# Copy source
COPY . .

# Build shared package
RUN pnpm --filter shared build

# Build Next.js with standalone output
ENV NEXT_TELEMETRY_DISABLED=1
ENV DOCKER_BUILD=true
RUN pnpm --filter vitrine build

# -----------------------------
# Stage 3: Runner
# -----------------------------
FROM node:20-alpine AS runner

RUN apk add --no-cache dumb-init

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static files
COPY --from=builder /app/apps/vitrine/public ./public

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/apps/vitrine/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/vitrine/.next/static ./apps/vitrine/.next/static

USER nextjs

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

CMD ["dumb-init", "node", "apps/vitrine/server.js"]
