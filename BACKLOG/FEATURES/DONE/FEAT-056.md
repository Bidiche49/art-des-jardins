# FEAT-056: Relances automatiques factures impayées

**Type:** Feature
**Statut:** Fait
**Priorite:** Critique
**Complexite:** M
**Tags:** email, cron, facturation, automatisation, zero-perte
**Date creation:** 2026-01-30
**Date resolution:** 2026-02-02

---

## Description

Implémenter un système de relances automatiques pour les factures impayées avec escalade progressive (J+30, J+45, J+60).

## User Story

**En tant que** patron
**Je veux** que les factures impayées soient relancées automatiquement
**Afin de** réduire les impayés sans intervention manuelle

## Criteres d'acceptation

- [x] Cron job quotidien vérifiant les factures en retard
- [x] Relance niveau 1 à J+30 (rappel amical)
- [x] Relance niveau 2 à J+45 (rappel ferme)
- [x] Relance niveau 3 à J+60 (mise en demeure)
- [x] Templates emails distincts pour chaque niveau
- [x] Table `RelanceHistory` pour tracker les relances envoyées
- [x] Ne pas relancer si facture exclue
- [x] Option pour exclure certains clients (VIP, litige)
- [x] Endpoint admin pour voir les relances planifiées
- [x] Endpoint admin pour forcer/annuler une relance
- [x] Logs audit pour chaque relance

## Fichiers créés/modifiés

- `apps/api/src/modules/relances/relances.module.ts` (nouveau)
- `apps/api/src/modules/relances/relances.service.ts` (nouveau)
- `apps/api/src/modules/relances/relances.cron.ts` (nouveau)
- `apps/api/src/modules/relances/relances.controller.ts` (nouveau)
- `apps/api/src/modules/relances/relances.types.ts` (nouveau)
- `apps/api/src/modules/relances/dto/force-relance.dto.ts` (nouveau)
- `apps/api/src/modules/relances/relances.service.spec.ts` (nouveau - 25 tests)
- `packages/database/prisma/schema.prisma` (RelanceHistory, RelanceLevel, excludeRelance)
- `apps/api/src/app.module.ts` (import RelancesModule)
- `apps/api/src/config/env.validation.ts` (RELANCE_* vars)

## Variables d'environnement

```env
RELANCE_ENABLED=true
RELANCE_J1=30  # Premier rappel
RELANCE_J2=45  # Deuxième rappel
RELANCE_J3=60  # Mise en demeure
```

## Endpoints API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /relances/stats | Statistiques des relances |
| GET | /relances/config | Configuration actuelle |
| GET | /relances/planned | Relances planifiées |
| GET | /relances/unpaid | Factures en retard |
| GET | /relances/facture/:id/history | Historique d'une facture |
| POST | /relances/facture/:id/send | Envoyer relance manuellement |
| POST | /relances/facture/:id/cancel | Désactiver relances auto |
| POST | /relances/facture/:id/enable | Réactiver relances auto |
| POST | /relances/trigger | Déclencher manuellement le cron |

## Tests de validation

- [x] Test unitaire: calcul jours de retard (3 tests)
- [x] Test unitaire: détermination niveau relance (8 tests)
- [x] Test unitaire: exclusion clients VIP
- [x] Test unitaire: sendRelance (5 tests)
- [x] Test unitaire: cancelRelances, enableRelances
- [x] Test unitaire: getStats

**Total: 25 tests unitaires**
