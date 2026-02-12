# FEAT-108: Automatiser backups BDD avec cron/container

**Type:** Feature
**Statut:** A faire
**Priorite:** Critique
**Complexite:** S
**Tags:** infra, data, security
**Date creation:** 2026-02-12

---

## Description

Le script de backup `docker/postgres/backup.sh` existe mais n'est jamais execute automatiquement. En cas d'incident (crash serveur, corruption BDD, erreur humaine), toutes les donnees sont perdues. C'est le risque #1 du projet en production.

## User Story

**En tant que** gerant d'Art des Jardins
**Je veux** que les donnees soient sauvegardees automatiquement chaque jour
**Afin de** pouvoir restaurer en cas de probleme sans perdre plus de 24h de donnees

## Criteres d'acceptation

- [ ] Backup automatique quotidien a 2h du matin
- [ ] Retention : 7 jours de backups quotidiens, 4 semaines, 3 mois
- [ ] Rotation automatique (suppression des vieux backups)
- [ ] Notification en cas d'echec du backup
- [ ] Test de restauration documente et valide
- [ ] Backup chiffre (cf IMP-016)

## Fichiers concernes

- `docker/postgres/backup.sh` - script existant
- `docker-compose.prod.yml` - ajouter container ou cron
- `.env.example` - documenter variables backup

## Analyse / Approche

### Option A : Container dedie dans docker-compose

```yaml
postgres-backup:
  image: postgres:16-alpine
  restart: always
  depends_on:
    - postgres
  environment:
    - POSTGRES_USER=${POSTGRES_USER}
    - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    - POSTGRES_DB=${POSTGRES_DB}
    - PGHOST=postgres
  volumes:
    - ./docker/postgres:/scripts
    - ./backups:/backup
  entrypoint: /bin/sh
  command: -c 'while true; do /scripts/backup.sh && sleep 86400; done'
```

### Option B : Cron sur le host

```bash
# /etc/cron.d/artjardin-backup
0 2 * * * root docker exec artjardin_db /backup/backup.sh >> /var/log/artjardin-backup.log 2>&1
```

### Rotation

```bash
# Garder 7 jours, supprimer les plus vieux
find /backup -name "*.sql.gz*" -mtime +7 -delete
```

## Tests de validation

- [ ] Backup se lance automatiquement a 2h
- [ ] Fichier backup genere dans le dossier prevu
- [ ] Restore depuis le backup → donnees intactes
- [ ] Vieux backups supprimes automatiquement (>7 jours)
- [ ] Echec backup → notification (log ou email)
