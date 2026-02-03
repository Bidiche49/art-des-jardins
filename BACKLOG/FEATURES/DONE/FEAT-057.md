# FEAT-057: Health checks avancés et alertes

**Type:** Feature
**Statut:** Fait
**Priorite:** Critique
**Complexite:** M
**Tags:** monitoring, alertes, health, ops, resilience
**Date creation:** 2026-01-30
**Date resolution:** 2026-02-02

---

## Description

Implémenter des health checks complets pour tous les services critiques (BDD, S3, SMTP) avec système d'alertes en cas de défaillance.

## User Story

**En tant que** patron
**Je veux** être alerté immédiatement si un service critique tombe
**Afin de** réagir rapidement et éviter les pertes de données

## Criteres d'acceptation

- [x] Health check PostgreSQL (connexion + query simple)
- [x] Health check S3 (HeadBucket)
- [x] Health check SMTP (verification config)
- [x] Endpoint `/health/detailed` avec état de chaque service
- [x] Endpoint `/health/ready` pour Kubernetes readiness
- [x] Endpoint `/health/live` pour Kubernetes liveness
- [x] Alerte email si un service est DOWN depuis > 5 min
- [x] Alerte si backup a échoué
- [x] Alerte si emails en échec > 10 en 1h
- [x] Cron toutes les minutes pour vérifier

## Fichiers créés/modifiés

- `apps/api/src/modules/health/health.service.ts` (nouveau)
- `apps/api/src/modules/health/health.types.ts` (nouveau)
- `apps/api/src/modules/health/health.controller.ts` (enrichi)
- `apps/api/src/modules/health/health.module.ts` (enrichi)
- `apps/api/src/modules/health/health.service.spec.ts` (nouveau - 14 tests)
- `apps/api/src/modules/health/health.controller.spec.ts` (enrichi - 7 tests)
- `apps/api/src/modules/alerts/alerts.module.ts` (nouveau)
- `apps/api/src/modules/alerts/alerts.service.ts` (nouveau)
- `apps/api/src/modules/alerts/alerts.cron.ts` (nouveau)
- `apps/api/src/modules/alerts/alerts.controller.ts` (nouveau)
- `apps/api/src/modules/alerts/alerts.types.ts` (nouveau)
- `apps/api/src/modules/alerts/alerts.service.spec.ts` (nouveau - 11 tests)
- `apps/api/src/modules/storage/storage.service.ts` (ajout checkConnection)
- `apps/api/src/app.module.ts` (import AlertsModule)
- `apps/api/src/config/env.validation.ts` (ALERTS_* vars)

## Variables d'environnement

```env
ALERTS_ENABLED=true
ALERTS_EMAIL=alerts@artjardin.fr
SERVICE_DOWN_THRESHOLD=300000  # 5 minutes
```

## Endpoints API

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Basic health check |
| GET | /health/live | Liveness probe (Kubernetes) |
| GET | /health/ready | Readiness probe (Kubernetes) |
| GET | /health/detailed | État détaillé de tous les services |

### Alerts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /alerts/stats | Statistiques et services down |
| GET | /alerts/config | Configuration actuelle |
| POST | /alerts/trigger | Déclencher vérification manuelle |
| POST | /alerts/test | Envoyer alerte de test |

## Tests de validation

- [x] Test unitaire: health check database (2 tests)
- [x] Test unitaire: health check S3 (3 tests)
- [x] Test unitaire: health check SMTP (2 tests)
- [x] Test unitaire: getDetailedHealth (4 tests)
- [x] Test unitaire: liveness/readiness (3 tests)
- [x] Test unitaire: alert service (11 tests)

**Total: 28 nouveaux tests unitaires**
