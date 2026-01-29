#!/bin/bash
# ===========================================
# Art & Jardin - PostgreSQL Backup Script
# ===========================================
# Usage: ./backup.sh
# Cron: 0 2 * * * /path/to/backup.sh >> /var/log/artjardin-backup.log 2>&1
# ===========================================

set -e

# Configuration
BACKUP_DIR="/backup"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/artjardin_${DATE}.sql.gz"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "=========================================="
echo "PostgreSQL Backup - $(date)"
echo "=========================================="

# Create backup directory if not exists
mkdir -p ${BACKUP_DIR}

# Perform backup
echo "Creating backup: ${BACKUP_FILE}"
pg_dump -U ${POSTGRES_USER} ${POSTGRES_DB} | gzip > ${BACKUP_FILE}

# Verify backup
if [ -f "${BACKUP_FILE}" ] && [ -s "${BACKUP_FILE}" ]; then
    SIZE=$(du -h ${BACKUP_FILE} | cut -f1)
    echo -e "${GREEN}Backup successful: ${BACKUP_FILE} (${SIZE})${NC}"
else
    echo -e "${RED}Backup failed!${NC}"
    exit 1
fi

# Cleanup old backups
echo "Cleaning up backups older than ${RETENTION_DAYS} days..."
find ${BACKUP_DIR} -name "artjardin_*.sql.gz" -type f -mtime +${RETENTION_DAYS} -delete
REMAINING=$(ls -1 ${BACKUP_DIR}/artjardin_*.sql.gz 2>/dev/null | wc -l)
echo "Remaining backups: ${REMAINING}"

# List recent backups
echo ""
echo "Recent backups:"
ls -lh ${BACKUP_DIR}/artjardin_*.sql.gz 2>/dev/null | tail -5

echo ""
echo "=========================================="
echo "Backup completed at $(date)"
echo "=========================================="
