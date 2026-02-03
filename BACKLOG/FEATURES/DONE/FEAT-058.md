# FEAT-058: Soft delete pour toutes les entités

**Type:** Feature
**Statut:** Fait
**Priorite:** Haute
**Complexite:** M
**Tags:** data, resilience, audit, zero-perte
**Date creation:** 2026-01-30
**Date resolution:** 2026-02-02

---

## Description

Implémenter le soft delete sur toutes les entités critiques pour ne jamais perdre de données. Les suppressions marquent `deletedAt` au lieu de supprimer réellement.

## User Story

**En tant que** patron
**Je veux** pouvoir restaurer des données supprimées par erreur
**Afin de** ne jamais perdre d'informations métier importantes

## Criteres d'acceptation

- [x] Champ `deletedAt` sur: Client, Chantier, Devis, Facture, Intervention
- [x] Service TrashService pour gérer les éléments supprimés
- [x] Endpoint admin `/admin/trash/stats` pour les stats
- [x] Endpoint admin `/admin/trash/:entity` pour lister les supprimés
- [x] Endpoint admin `POST /admin/trash/:entity/:id/restore` pour restaurer
- [x] Endpoint admin `DELETE /admin/trash/:entity/:id/purge` pour supprimer définitivement
- [x] Rétention 90 jours avant purge automatique (cron quotidien 3h)
- [x] Cascade soft delete (client -> chantiers -> devis/interventions)
- [x] Audit log pour chaque suppression/restauration

## Fichiers créés/modifiés

- `packages/database/prisma/schema.prisma` (deletedAt sur 5 entités)
- `apps/api/src/modules/trash/trash.module.ts` (nouveau)
- `apps/api/src/modules/trash/trash.service.ts` (nouveau)
- `apps/api/src/modules/trash/trash.controller.ts` (nouveau)
- `apps/api/src/modules/trash/trash.types.ts` (nouveau)
- `apps/api/src/modules/trash/trash.service.spec.ts` (nouveau - 13 tests)
- `apps/api/src/app.module.ts` (import TrashModule)
- `apps/api/src/config/env.validation.ts` (SOFT_DELETE_RETENTION_DAYS)

## Variables d'environnement

```env
SOFT_DELETE_RETENTION_DAYS=90
```

## Endpoints API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /admin/trash/stats | Statistiques de la corbeille |
| GET | /admin/trash/:entity | Liste les éléments supprimés |
| GET | /admin/trash/:entity/:id | Détail d'un élément supprimé |
| POST | /admin/trash/:entity/:id/restore | Restaurer un élément |
| DELETE | /admin/trash/:entity/:id/purge | Supprimer définitivement |
| POST | /admin/trash/auto-purge | Déclencher purge manuelle |

Entités supportées: `client`, `chantier`, `devis`, `facture`, `intervention`

## Tests de validation

- [x] Test unitaire: listDeleted avec pagination
- [x] Test unitaire: getDeleted, NotFoundException
- [x] Test unitaire: restore, audit log
- [x] Test unitaire: purge, audit log
- [x] Test unitaire: getStats
- [x] Test unitaire: softDelete, NotFoundException, already deleted
- [x] Test unitaire: cascade soft delete
- [x] Test unitaire: autoPurge

**Total: 13 tests unitaires**
