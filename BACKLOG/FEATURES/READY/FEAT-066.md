# FEAT-066: UI resolution conflits sync offline

**Type:** Feature
**Statut:** Pret
**Priorite:** Haute
**Complexite:** M
**Tags:** ux, pwa, offline
**Date creation:** 2026-02-03
**Phase:** 14

---

## Description

Creer une interface utilisateur claire pour resoudre les conflits de synchronisation quand des modifications offline entrent en conflit avec des modifications serveur.

## User Story

**En tant que** utilisateur terrain
**Je veux** comprendre et resoudre facilement les conflits de sync
**Afin de** ne pas perdre mon travail fait hors connexion

## Contexte

Scenario typique:
1. Employe A modifie une intervention offline
2. Patron modifie la meme intervention depuis le bureau
3. Employe A revient en ligne -> CONFLIT

Actuellement, la strategie "last write wins" peut perdre des donnees. Il faut une UI pour laisser l'utilisateur choisir.

## Criteres d'acceptation

- [ ] Detection des conflits a la sync (version/timestamp)
- [ ] Modal de resolution avec comparaison cote-a-cote
- [ ] Options: Garder ma version / Garder serveur / Fusionner manuellement
- [ ] Highlight des champs differents
- [ ] File des conflits si plusieurs
- [ ] Option "Toujours garder ma version" (session)
- [ ] Historique des resolutions

## Fichiers concernes

- `apps/pwa/src/components/SyncConflict/` (nouveau)
- `apps/pwa/src/services/sync.service.ts`
- `apps/pwa/src/stores/syncStore.ts`

## Analyse / Approche

```typescript
interface SyncConflict {
  id: string;
  entityType: 'intervention' | 'devis' | 'client';
  entityId: string;
  localVersion: Record<string, any>;
  serverVersion: Record<string, any>;
  localTimestamp: Date;
  serverTimestamp: Date;
  conflictingFields: string[];
}

// Detection conflit
const hasConflict = (local: Entity, server: Entity): boolean => {
  return local.updatedAt < server.updatedAt &&
         local.version !== server.version;
};

// Resolution
type Resolution = 'keep_local' | 'keep_server' | 'merge';
```

UI comparaison:
```
┌─────────────────────────────────────────┐
│ Conflit sur Intervention #123           │
├───────────────────┬─────────────────────┤
│ Votre version     │ Version serveur     │
│ (il y a 2h)       │ (il y a 30min)      │
├───────────────────┼─────────────────────┤
│ Notes:            │ Notes:              │
│ "Taille haie OK"  │ "Taille haie + tonte│
│                   │  demandee client"   │
├───────────────────┴─────────────────────┤
│ [Garder la mienne] [Garder serveur]     │
│           [Fusionner manuellement]      │
└─────────────────────────────────────────┘
```

## Tests de validation

- [ ] Conflit detecte correctement
- [ ] Modal affiche les deux versions
- [ ] Champs differents highlights
- [ ] Resolution "garder local" appliquee
- [ ] Resolution "garder serveur" appliquee
- [ ] Fusion manuelle permet edition
