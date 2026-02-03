# FEAT-066-B: Detection des conflits dans sync service

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** ux, pwa, offline
**Date creation:** 2026-02-03
**Parent:** FEAT-066
**Depends:** FEAT-066-A

---

## Description

Implementer la logique de detection des conflits dans le service de synchronisation. Quand une entite locale est pushee et que le serveur a une version plus recente avec des modifications differentes, un conflit doit etre detecte et ajoute au store.

## Scope

- Fonction `detectConflict()` dans sync service
- Comparaison version/timestamp local vs serveur
- Identification des champs en conflit
- Ajout au `conflictStore` quand detecte
- Pas d'UI (geree par autre ticket)

## Criteres d'acceptation

- [ ] Fonction `hasConflict(local, server)` retourne boolean
- [ ] Fonction `detectConflictingFields(local, server)` retourne string[]
- [ ] Fonction `createConflict()` cree un SyncConflict complet
- [ ] Integration dans le flow de sync existant
- [ ] Conflit ajoute au store au lieu de "last write wins"

## Fichiers a modifier

- `apps/pwa/src/services/sync.service.ts`
- Eventuellement `apps/pwa/src/services/api.service.ts`

## SECTION AUTOMATISATION
**Score:** 85/100
**Risque:** Faible - Logique metier claire, necessite comprehension du sync existant

### Prompt d'execution

```
Implementer la detection des conflits de sync (FEAT-066-B).

Pre-requis: FEAT-066-A doit etre fait (types et store).

1. Lire d'abord:
   - apps/pwa/src/services/sync.service.ts (comprendre le flow actuel)
   - apps/pwa/src/stores/conflictStore.ts (store cree en 066-A)

2. Ajouter dans sync.service.ts:

```typescript
import { SyncConflict } from '../types/sync.types';
import { useConflictStore } from '../stores/conflictStore';

// Detection de conflit
const hasConflict = (local: { version: number; updatedAt: Date }, server: { version: number; updatedAt: Date }): boolean => {
  // Conflit si: version locale < serveur ET timestamps differents
  return local.version < server.version &&
         local.updatedAt.getTime() !== server.updatedAt.getTime();
};

// Trouver les champs differents
const detectConflictingFields = (local: Record<string, any>, server: Record<string, any>): string[] => {
  const fields = new Set([...Object.keys(local), ...Object.keys(server)]);
  const conflicting: string[] = [];

  for (const field of fields) {
    if (JSON.stringify(local[field]) !== JSON.stringify(server[field])) {
      conflicting.push(field);
    }
  }

  // Ignorer les champs techniques
  return conflicting.filter(f => !['id', 'version', 'updatedAt', 'createdAt'].includes(f));
};

// Creer l'objet conflit
const createSyncConflict = (entityType, entityId, local, server): SyncConflict => {
  return {
    id: `conflict-${entityType}-${entityId}-${Date.now()}`,
    entityType,
    entityId,
    entityLabel: generateEntityLabel(entityType, local),
    localVersion: local,
    serverVersion: server,
    localTimestamp: new Date(local.updatedAt),
    serverTimestamp: new Date(server.updatedAt),
    conflictingFields: detectConflictingFields(local, server)
  };
};
```

3. Modifier le flow de push pour:
   - Avant d'ecraser, verifier hasConflict()
   - Si conflit, ajouter au store et NE PAS ecraser
   - Retourner un status 'conflict' au lieu de 'success'

4. Ecrire tests unitaires pour hasConflict et detectConflictingFields

5. Verifier: pnpm test apps/pwa
```

## Tests de validation

- [ ] hasConflict retourne true quand version serveur > locale
- [ ] hasConflict retourne false quand versions egales
- [ ] detectConflictingFields trouve les bons champs
- [ ] createSyncConflict genere un objet valide
- [ ] Flow de sync ajoute conflit au store
