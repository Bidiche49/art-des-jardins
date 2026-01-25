# FEAT-004: PWA React - Setup initial

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** M
**Tags:** pwa, react, offline
**Date creation:** 2025-01-25

---

## Description
Creer l'application React PWA pour les associes avec support offline-first.

## User Story
**En tant que** associe
**Je veux** une app installable sur mon telephone
**Afin de** gerer mes chantiers meme sans connexion

## Criteres d'acceptation
- [ ] React + Vite configure
- [ ] PWA manifest et service worker
- [ ] IndexedDB setup (Dexie.js)
- [ ] Installable sur iOS et Android
- [ ] Routing (React Router)
- [ ] State management (Zustand ou TanStack Query)

## Fichiers concernes
- `apps/pwa/`

## Analyse / Approche
1. `pnpm create vite pwa --template react-ts`
2. vite-plugin-pwa pour SW
3. Dexie.js pour IndexedDB
4. Workbox strategies pour cache
5. Design mobile-first

## Tests de validation
- [ ] `pnpm dev:pwa` fonctionne
- [ ] Installable en PWA
- [ ] Fonctionne offline (pages cachees)
- [ ] IndexedDB operationnel
