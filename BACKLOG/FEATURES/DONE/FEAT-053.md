# FEAT-053: Backup automatique quotidien BDD

**Type:** Feature
**Statut:** A faire
**Priorite:** Critique
**Complexite:** M
**Tags:** backup, resilience, database, zero-perte
**Date creation:** 2026-01-30

---

## Description

**REGLE BUSINESS CRITIQUE:** Les donnees doivent etre sauvegardees automatiquement et recuperables meme en cas de crash complet du service.

Mettre en place un systeme de backup automatique quotidien de la base PostgreSQL avec:
- Backup local
- Upload vers stockage externe (S3/Scaleway)
- Retention configurable
- Alertes en cas d'echec

## User Story

**En tant que** gerant
**Je veux** que mes donnees soient sauvegardees automatiquement
**Afin de** pouvoir tout recuperer meme si le serveur crash

## Criteres d'acceptation

- [ ] Backup automatique quotidien (cron)
- [ ] Backup avant chaque migration/deploiement
- [ ] Upload vers stockage externe S3
- [ ] Retention 30 jours minimum
- [ ] Compression des dumps (gzip)
- [ ] Notification email si backup echoue
- [ ] Script de restauration teste
- [ ] Documentation de la procedure de restauration

## Fichiers concernes

- `docker/backup/backup.sh` (a creer)
- `docker/backup/restore.sh` (a creer)
- `docker/docker-compose.yml` (service backup)
- `.env.example` (S3_BACKUP_*)

## Implementation

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
DUMP_FILE="backup_$DATE.sql.gz"

# Dump PostgreSQL
pg_dump $DATABASE_URL | gzip > /backups/$DUMP_FILE

# Upload to S3
aws s3 cp /backups/$DUMP_FILE s3://$BUCKET/backups/

# Cleanup old backups (keep 30 days)
find /backups -mtime +30 -delete

# Alert if failed
if [ $? -ne 0 ]; then
  curl -X POST $SLACK_WEBHOOK -d '{"text":"BACKUP FAILED!"}'
fi
```

## Tests de validation

- [ ] Backup quotidien s'execute sans erreur
- [ ] Fichiers uploades sur S3
- [ ] Restauration testee et fonctionnelle
- [ ] Alertes fonctionnelles en cas d'echec
