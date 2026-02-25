#!/bin/sh
set -e

SCHEMA_PATH=./packages/database/prisma/schema.prisma

echo "Running Prisma migrations..."
node ./node_modules/.pnpm/prisma@*/node_modules/prisma/build/index.js migrate deploy --schema=$SCHEMA_PATH

echo "Starting API server..."
exec node apps/api/dist/main.js
