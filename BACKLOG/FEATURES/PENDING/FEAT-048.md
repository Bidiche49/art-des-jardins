# FEAT-048: Synchronisation des actions offline

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** XL
**Tags:** pwa, offline, sync, queue
**Date creation:** 2026-01-30

---

## Description

Permettre aux utilisateurs de creer/modifier des donnees en mode offline. Les actions sont mises en file d'attente et synchronisees automatiquement au retour de la connexion.

## User Story

**En tant qu'** employe sur un chantier sans connexion
**Je veux** pouvoir valider une intervention ou ajouter des notes
**Afin que** mon travail soit enregistre automatiquement quand le reseau revient

## Criteres d'acceptation

- [ ] File d'attente des actions offline (IndexedDB)
- [ ] Support creation intervention offline
- [ ] Support modification intervention offline
- [ ] Support ajout notes/photos offline
- [ ] Sync automatique au retour online
- [ ] Gestion des conflits (last-write-wins ou merge)
- [ ] Retry avec backoff exponentiel
- [ ] Notification utilisateur du statut sync
- [ ] Badge/compteur actions en attente

## Fichiers concernes

- `apps/pwa/src/db/syncQueue.ts` (a creer)
- `apps/pwa/src/hooks/useOfflineAction.ts` (a creer)
- `apps/pwa/src/stores/ui.ts` (pendingSyncCount)
- `apps/pwa/src/components/SyncStatus.tsx` (a creer)

## Analyse / Approche

1. Implementer une queue persistante dans IndexedDB
2. Intercepter les mutations API
3. Stocker les actions avec timestamp et retry count
4. Background sync au retour online
5. UI pour visualiser et gerer la queue

## Tests de validation

- [ ] Action creee offline est stockee dans la queue
- [ ] Sync automatique au retour online
- [ ] Les conflits sont geres correctement
- [ ] L'utilisateur voit le nombre d'actions en attente
