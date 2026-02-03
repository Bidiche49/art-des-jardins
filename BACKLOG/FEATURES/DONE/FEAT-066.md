# FEAT-066: UI resolution conflits sync offline

**Type:** Feature
**Statut:** Split
**Priorite:** Haute
**Complexite:** M
**Tags:** ux, pwa, offline
**Date creation:** 2026-02-03
**Date split:** 2026-02-03
**Phase:** 14

---

## Note de split

Ce ticket a ete decoupe en 5 sous-tickets plus petits pour faciliter l'implementation incrementale:

| Sous-ticket | Description | Complexite |
|-------------|-------------|------------|
| FEAT-066-A | Types et store pour conflits | XS |
| FEAT-066-B | Detection des conflits dans sync service | S |
| FEAT-066-C | Composant ConflictModal avec comparaison | S |
| FEAT-066-D | ConflictQueue et preferences de session | S |
| FEAT-066-E | Integration et tests end-to-end | S |

**Ordre d'execution:** A -> B -> C -> D -> E (avec dependances)

---

## Description originale

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

- [ ] Detection des conflits a la sync (version/timestamp) -> FEAT-066-B
- [ ] Modal de resolution avec comparaison cote-a-cote -> FEAT-066-C
- [ ] Options: Garder ma version / Garder serveur / Fusionner manuellement -> FEAT-066-C
- [ ] Highlight des champs differents -> FEAT-066-C
- [ ] File des conflits si plusieurs -> FEAT-066-D
- [ ] Option "Toujours garder ma version" (session) -> FEAT-066-D
- [ ] Historique des resolutions -> FEAT-066-D

## Fichiers concernes

- `apps/pwa/src/components/SyncConflict/` (nouveau)
- `apps/pwa/src/services/sync.service.ts`
- `apps/pwa/src/stores/conflictStore.ts`
