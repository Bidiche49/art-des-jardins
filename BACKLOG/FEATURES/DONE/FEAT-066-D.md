# FEAT-066-D: ConflictQueue et preferences de session

**Type:** Feature
**Statut:** Fait
**Priorite:** Haute
**Complexite:** S
**Tags:** ux, pwa, offline
**Date creation:** 2026-02-03
**Parent:** FEAT-066
**Depends:** FEAT-066-A, FEAT-066-C

---

## Description

Gerer les cas ou plusieurs conflits surviennent en meme temps. Implementer une file d'attente avec indicateur de progression (1/5), et une option "Toujours garder ma version" pour la session courante.

## Scope

- Composant `ConflictQueue` wrapper du modal
- Indicateur de progression "Conflit 2/5"
- Option "Appliquer a tous" dans le modal
- Preference de session "Toujours garder local"
- Historique des resolutions (localStorage)

## Criteres d'acceptation

- [x] Affiche "Conflit 1/N" quand plusieurs conflits
- [x] Navigation suivant/precedent si > 1 conflit
- [x] Checkbox "Appliquer ce choix aux conflits restants"
- [x] Option "Toujours garder ma version cette session"
- [x] Historique des resolutions accessible
- [ ] Badge notification sur icone sync si conflits en attente (non implemente - hors scope minimal)

## Fichiers a creer/modifier

- `apps/pwa/src/components/SyncConflict/ConflictQueue.tsx` (modifie)
- `apps/pwa/src/components/SyncConflict/ConflictHistory.tsx` (cree)
- `apps/pwa/src/components/SyncConflict/ConflictModal.tsx` (refactorise - export ConflictModalContent)
- `apps/pwa/src/stores/conflicts.ts` (enrichi)

## Implementation

### Store enrichi (conflicts.ts)
- `currentIndex` pour navigation entre conflits
- `sessionPreference` pour auto-resolution
- `nextConflict()` / `prevConflict()` pour navigation
- `getCurrentConflict()` getter
- `setSessionPreference()` / `clearSessionPreference()`
- `resolveAll(resolution)` pour resoudre tous les conflits restants
- `addToHistory()` / `clearHistory()`

### ConflictQueue.tsx
- Indicateur de progression "Conflit X / Y"
- Boutons navigation Precedent/Suivant
- Checkbox "Appliquer ce choix aux N conflits restants"
- Boutons session preference "Toujours garder ma version" / "Toujours garder serveur"
- Auto-resolution basee sur sessionPreference

### ConflictHistory.tsx
- Affichage de l'historique des resolutions
- Stats (total, local, serveur, fusion)
- Filtre par type de resolution
- Option effacer l'historique

## Tests de validation

- [x] Indicateur "1/N" affiche correctement
- [x] Navigation prev/next fonctionne
- [x] "Appliquer a tous" resout les conflits restants
- [x] Preference session memorisee
- [x] Historique persiste en localStorage
- [ ] Badge notification visible (non implemente)

## Tests ajoutes

- 33 tests unitaires pour le store (conflicts.test.ts)
- 18 tests pour ConflictQueue (ConflictQueue.test.tsx)
- Tous les 312 tests PWA passent
