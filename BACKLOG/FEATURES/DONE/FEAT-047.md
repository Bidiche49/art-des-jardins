# FEAT-047: IndexedDB pour stockage local

**Type:** Feature
**Statut:** Fait
**Priorite:** Critique
**Complexite:** L
**Tags:** pwa, offline, indexeddb, storage
**Date creation:** 2026-01-30

---

## Description

Implementer le stockage local avec IndexedDB pour persister les donnees metier (clients, chantiers, interventions) localement. Permettre la consultation des donnees hors ligne.

## User Story

**En tant qu'** employe sur un chantier
**Je veux** consulter les infos client et chantier meme sans connexion
**Afin de** ne pas etre bloque par un manque de reseau

## Criteres d'acceptation

- [ ] Base IndexedDB creee avec schema versionne
- [ ] Tables pour: clients, chantiers, interventions, devis
- [ ] Synchronisation initiale des donnees au login
- [ ] Lecture depuis IndexedDB quand offline
- [ ] Indicateur de dernier sync timestamp
- [ ] Pagination/limite pour eviter surcharge memoire
- [ ] API abstraite (meme interface online/offline)

## Fichiers concernes

- `apps/pwa/src/db/index.ts` (a creer)
- `apps/pwa/src/db/schema.ts` (a creer)
- `apps/pwa/src/db/sync.ts` (a creer)
- `apps/pwa/src/api/*.ts` (wrapper offline)

## Analyse / Approche

1. Utiliser Dexie.js (wrapper IndexedDB)
2. Creer les stores pour chaque entite
3. Implementer sync au login
4. Wrapper les appels API pour fallback IndexedDB

## Tests de validation

- [ ] Les donnees sont stockees dans IndexedDB
- [ ] La lecture fonctionne sans connexion
- [ ] Le sync initial charge les donnees necessaires
- [ ] Les donnees persistent apres fermeture app
