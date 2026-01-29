#!/bin/bash
# ===========================================
# Art & Jardin - PostgreSQL Restore Script
# ===========================================
# Usage: ./restore.sh <backup_file.sql.gz>
# ===========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check arguments
if [ -z "$1" ]; then
    echo -e "${RED}Usage: $0 <backup_file.sql.gz>${NC}"
    echo ""
    echo "Available backups:"
    ls -lh /backup/artjardin_*.sql.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

BACKUP_FILE=$1

# Verify backup file exists
if [ ! -f "${BACKUP_FILE}" ]; then
    echo -e "${RED}Backup file not found: ${BACKUP_FILE}${NC}"
    exit 1
fi

echo "=========================================="
echo "PostgreSQL Restore - $(date)"
echo "=========================================="
echo "Backup file: ${BACKUP_FILE}"
echo ""

# Confirm restore
echo -e "${YELLOW}WARNING: This will drop and recreate the database!${NC}"
echo -e "${YELLOW}All existing data will be lost!${NC}"
echo ""
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

echo ""
echo "Starting restore..."

# Drop existing connections
echo "Terminating existing connections..."
psql -U ${POSTGRES_USER} -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${POSTGRES_DB}' AND pid <> pg_backend_pid();" || true

# Drop and recreate database
echo "Dropping database: ${POSTGRES_DB}"
dropdb -U ${POSTGRES_USER} --if-exists ${POSTGRES_DB}

echo "Creating database: ${POSTGRES_DB}"
createdb -U ${POSTGRES_USER} ${POSTGRES_DB}

# Restore backup
echo "Restoring from backup..."
gunzip -c ${BACKUP_FILE} | psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}

# Verify restore
TABLE_COUNT=$(psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';")

echo ""
echo -e "${GREEN}Restore completed successfully!${NC}"
echo "Tables restored: ${TABLE_COUNT}"
echo ""
echo "=========================================="
echo "Restore completed at $(date)"
echo "=========================================="
