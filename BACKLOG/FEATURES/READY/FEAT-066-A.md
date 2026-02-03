# FEAT-066-A: Types et store pour conflits de sync

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** XS
**Tags:** ux, pwa, offline
**Date creation:** 2026-02-03
**Parent:** FEAT-066

---

## Description

Creer les types TypeScript et le store Zustand pour gerer les conflits de synchronisation. Ce sous-ticket pose les fondations pour les autres composants.

## Scope

- Interface `SyncConflict` avec toutes les proprietes
- Type `ConflictResolution` pour les choix utilisateur
- Store `conflictStore` avec etat et actions basiques
- Pas d'UI, pas de logique de detection

## Criteres d'acceptation

- [ ] Interface `SyncConflict` definie dans `apps/pwa/src/types/sync.types.ts`
- [ ] Type `ConflictResolution = 'keep_local' | 'keep_server' | 'merge'`
- [ ] Store `conflictStore` avec: `conflicts[]`, `addConflict()`, `removeConflict()`, `resolveConflict()`
- [ ] Export depuis index des types

## Fichiers a creer/modifier

- `apps/pwa/src/types/sync.types.ts` (creer)
- `apps/pwa/src/stores/conflictStore.ts` (creer)

## SECTION AUTOMATISATION
**Score:** 95/100
**Risque:** Tres faible - Uniquement des definitions de types et store basique

### Prompt d'execution

```
Implementer les types et le store pour les conflits de sync (FEAT-066-A).

1. Creer `apps/pwa/src/types/sync.types.ts`:

```typescript
export interface SyncConflict {
  id: string;
  entityType: 'intervention' | 'devis' | 'client' | 'chantier';
  entityId: string;
  entityLabel: string; // Ex: "Intervention #123"
  localVersion: Record<string, any>;
  serverVersion: Record<string, any>;
  localTimestamp: Date;
  serverTimestamp: Date;
  conflictingFields: string[];
}

export type ConflictResolution = 'keep_local' | 'keep_server' | 'merge';

export interface ConflictResolutionResult {
  conflictId: string;
  resolution: ConflictResolution;
  mergedData?: Record<string, any>;
  timestamp: Date;
}
```

2. Creer `apps/pwa/src/stores/conflictStore.ts` avec Zustand:
- State: conflicts[], sessionPreference (null | 'always_local' | 'always_server')
- Actions: addConflict, removeConflict, resolveConflict, clearAll, setSessionPreference
- Persist optionnel pour l'historique

3. Ecrire les tests unitaires pour le store

4. Verifier: pnpm test apps/pwa
```

## Tests de validation

- [ ] Types exportes correctement
- [ ] Store cree et fonctionnel
- [ ] Actions add/remove/resolve testees
- [ ] Pas d'erreur TypeScript
