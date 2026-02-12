# FEAT-086: [Flutter] Phase 6A - Sync Engine Queue + Retry

**Type:** Feature
**Statut:** A faire
**Priorite:** Critique
**Complexite:** L
**Tags:** mobile, flutter, offline, sync
**Date creation:** 2026-02-10

---

## Description

Moteur de synchronisation offline : queue d'operations en attente, retry avec backoff exponentiel, auto-sync au retour en ligne. Port de `apps/pwa/src/db/sync.ts`.

## User Story

**En tant que** employe terrain sans connexion
**Je veux** que mes modifications soient mises en queue et synchronisees automatiquement
**Afin de** ne jamais perdre de donnees meme offline

## Criteres d'acceptation

- [ ] `addToQueue(operation, entity, data, entityId)` insere dans sync_queue Drift
- [ ] `syncAll()` traite les items pending par timestamp, avec detection conflits
- [ ] Backoff exponentiel (1s, 2s, 4s), max 3 retries
- [ ] `retryFailed()` reset failed -> pending + resync
- [ ] Auto-sync quand connectivity_plus detecte retour online
- [ ] Provider `pendingSyncCountProvider` (stream reactive)
- [ ] `flutter test` passe, `flutter analyze` propre

## Tests obligatoires

### Unit tests SyncService - addToQueue (~6 tests)
- [ ] addToQueue insere dans Drift avec status 'pending'
- [ ] addToQueue genere un timestamp croissant
- [ ] addToQueue avec operation create/update/delete
- [ ] addToQueue serialise correctement les data JSON
- [ ] addToQueue pour differentes entites (client, chantier, etc.)
- [ ] Plusieurs items en queue -> tries par timestamp

### Unit tests SyncService - syncAll (~18 tests)
- [ ] syncAll traite les items en ordre de timestamp
- [ ] Item pending -> status passe a 'syncing'
- [ ] Sync create OK -> item supprime de la queue
- [ ] Sync update OK -> item supprime de la queue
- [ ] Sync delete OK -> item supprime de la queue
- [ ] Sync echoue (500) -> retryCount incremente, status 'pending'
- [ ] Sync echoue (network) -> retryCount incremente
- [ ] Backoff exponentiel : 1s apres 1er echec, 2s apres 2e, 4s apres 3e
- [ ] Max retries atteint (3) -> status 'failed'
- [ ] HTTP 409 (conflit) -> cree un SyncConflict, item reste pending
- [ ] Update : compare version serveur avant push
- [ ] Version serveur > version locale -> conflit detecte
- [ ] Sync queue vide -> syncAll retourne immediatement
- [ ] Erreur sur 1 item -> continue avec les suivants
- [ ] Items 'syncing' en cours -> pas retraites
- [ ] Succes -> met a jour le cache Drift local
- [ ] 5 items en queue -> tous traites sequentiellement
- [ ] syncAll appele 2 fois simultanement -> pas de doublon

### Unit tests SyncService - retryFailed (~5 tests)
- [ ] retryFailed reset tous les items 'failed' a 'pending'
- [ ] retryFailed reset retryCount a 0
- [ ] retryFailed declenche syncAll
- [ ] Aucun item failed -> retryFailed no-op
- [ ] Items pending non affectes par retryFailed

### Unit tests auto-sync connectivity (~6 tests)
- [ ] Retour online -> syncAll declenche automatiquement
- [ ] Passage offline -> sync stoppe
- [ ] Fluctuation rapide online/offline -> debounce, pas de spam sync
- [ ] Sync en cours quand offline -> requetes echouent, retry au retour
- [ ] App demarre online -> sync initial
- [ ] App demarre offline -> pas de sync, attend online

### Unit tests pendingSyncCountProvider (~4 tests)
- [ ] Count initial = 0 si queue vide
- [ ] Count augmente quand addToQueue
- [ ] Count diminue quand sync reussi
- [ ] Stream emet a chaque changement

**Total attendu : ~39 tests**

## Fichiers concernes

- `lib/services/sync/sync_service.dart`
- `lib/services/sync/sync_providers.dart`
