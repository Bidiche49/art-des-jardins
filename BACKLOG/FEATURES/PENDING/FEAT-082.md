# FEAT-082: [Flutter] Phase 3 - Base de donnees locale Drift

**Type:** Feature
**Statut:** A faire
**Priorite:** Critique
**Complexite:** M
**Tags:** mobile, flutter, database, offline
**Date creation:** 2026-02-10

---

## Description

Base SQLite avec Drift : 8 tables (clients, chantiers, interventions, devis, factures, syncQueue, syncMeta, photoQueue) et DAOs avec methodes CRUD + queries specifiques.

## User Story

**En tant que** app mobile offline-first
**Je veux** une base de donnees locale structuree avec des DAOs type-safe
**Afin de** stocker et requeter les donnees localement meme sans connexion

## Criteres d'acceptation

- [ ] 8 tables creees avec index corrects
- [ ] 1 DAO par table avec methodes CRUD
- [ ] Queries specifiques (getChantiersByClient, getPendingSyncItems, etc.)
- [ ] `build_runner build` genere sans erreur
- [ ] `flutter test` passe, `flutter analyze` propre

## Tests obligatoires (tous avec base in-memory)

### Tests CRUD par table (~40 tests, 8 tables x 5)
Pour CHAQUE table :
- [ ] Insert -> Read retourne l'entite inseree
- [ ] Insert multiple -> getAll retourne toutes les entites
- [ ] Update -> Read retourne les valeurs mises a jour
- [ ] Delete -> Read retourne null
- [ ] Insert doublon PK -> erreur ou replace

### Tests queries specifiques (~20 tests)
- [ ] `getClientsByType('particulier')` retourne seulement les particuliers
- [ ] `getChantiersByClient(clientId)` filtre correctement
- [ ] `getChantiersByStatut('en_cours')` filtre correctement
- [ ] `getInterventionsByChantier(chantierId)` filtre correctement
- [ ] `getInterventionsByDate(date)` filtre correctement
- [ ] `getDevisByClient(clientId)` filtre correctement
- [ ] `getDevisByStatut('brouillon')` filtre correctement
- [ ] `getFacturesByClient(clientId)` filtre correctement
- [ ] `getFacturesEnRetard()` retourne celles dont echeance < now
- [ ] `getPendingSyncItems()` retourne status='pending' tries par timestamp
- [ ] `getFailedSyncItems()` retourne status='failed'
- [ ] `getSyncItemsByEntity('client')` filtre correctement
- [ ] `getSyncMeta('client')` retourne la meta correcte
- [ ] `getPendingPhotos()` retourne les photos non uploadees
- [ ] `getPhotosByIntervention(id)` filtre correctement

### Tests index et performance (~5 tests)
- [ ] Insert 100 clients puis recherche par nom -> resultat rapide
- [ ] Insert 100 chantiers puis filtre par statut -> resultat correct
- [ ] syncedAt index utilise pour diff sync

### Tests cascade et integrite (~8 tests)
- [ ] Suppression client -> comportement attendu sur chantiers lies
- [ ] Insertion chantier avec clientId inexistant -> erreur ou OK (selon schema)
- [ ] SyncQueue : incrementer retryCount
- [ ] SyncQueue : update status pending -> syncing -> failed
- [ ] SyncQueue : delete apres sync reussi
- [ ] PhotoQueue : update attempts + status
- [ ] Transaction : insert multiple dans une transaction
- [ ] Transaction : rollback si erreur dans la transaction

### Tests reactive streams (~5 tests)
- [ ] Watch clients emet quand un client est insere
- [ ] Watch clients emet quand un client est modifie
- [ ] Watch sync queue emet sur changement de status
- [ ] Stream ferme proprement sur dispose
- [ ] Watch avec filtre ne re-emet pas si le filtre ne matche plus

**Total attendu : ~78 tests**

## Fichiers concernes

- `lib/data/local/database/app_database.dart`
- `lib/data/local/database/tables/*.dart`
- `lib/data/local/database/daos/*.dart`
