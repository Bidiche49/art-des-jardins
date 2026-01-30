# FEAT-046: Service Worker et cache offline

**Type:** Feature
**Statut:** Fait
**Priorite:** Critique
**Complexite:** L
**Tags:** pwa, offline, service-worker, cache
**Date creation:** 2026-01-30

---

## Description

Implementer un Service Worker complet pour la PWA permettant le fonctionnement hors ligne. Le Service Worker doit gerer le cache des assets statiques, des donnees API, et permettre la navigation offline.

## User Story

**En tant qu'** employe sur un chantier sans connexion
**Je veux** pouvoir consulter mes interventions et infos clients
**Afin de** continuer a travailler meme sans reseau

## Criteres d'acceptation

- [ ] Service Worker enregistre et actif
- [ ] Cache des assets statiques (JS, CSS, images)
- [ ] Cache des pages de l'application (shell)
- [ ] Strategie cache-first pour les assets
- [ ] Strategie stale-while-revalidate pour les donnees API
- [ ] Indicateur visuel du mode offline
- [ ] Pre-cache des routes principales au premier chargement
- [ ] Mise a jour automatique du SW avec notification utilisateur

## Fichiers concernes

- `apps/pwa/public/sw.js` (a creer)
- `apps/pwa/src/main.tsx` (enregistrement SW)
- `apps/pwa/vite.config.ts` (plugin workbox)
- `apps/pwa/src/stores/ui.ts` (etat online/offline)

## Analyse / Approche

1. Utiliser Workbox via vite-plugin-pwa pour generer le SW
2. Configurer les strategies de cache appropriees
3. Pre-cacher les routes critiques
4. Gerer les evenements online/offline

## Tests de validation

- [ ] L'app se charge sans connexion apres premier chargement
- [ ] Les assets sont servis depuis le cache
- [ ] L'indicateur offline s'affiche correctement
- [ ] La navigation fonctionne en mode offline
