# FEAT-038: Dashboard client personnel

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** M
**Tags:** ui, api, portail-client
**Date creation:** 2026-01-30

---

## Description

Page d'accueil personnalisée pour les clients connectés au portail. Affiche un résumé de leurs devis, factures, chantiers en cours et messages non lus.

---

## User Story

**En tant que** client connecté au portail
**Je veux** voir un tableau de bord avec un résumé de mon activité
**Afin de** avoir une vue d'ensemble rapide de mes projets et documents

---

## Criteres d'acceptation

- [ ] Page `/client/dashboard` accessible après authentification client
- [ ] Widget "Mes devis" (en attente, acceptés, total)
- [ ] Widget "Mes factures" (à payer, payées, montant dû)
- [ ] Widget "Chantiers en cours" (liste avec statut)
- [ ] Widget "Messages non lus" (compteur + aperçu)
- [ ] Endpoint API `GET /api/v1/client/dashboard` retournant les données agrégées
- [ ] Design responsive (mobile-first)
- [ ] Tests unitaires et e2e
- [ ] Tests de non-regression passes

---

## Fichiers concernes

- `apps/api/src/modules/client-portal/client-portal.controller.ts`
- `apps/api/src/modules/client-portal/client-portal.service.ts`
- `apps/pwa/src/pages/client/Dashboard.tsx`
- `apps/pwa/src/components/client/DashboardWidgets.tsx`

---

## Approche proposee

1. Créer le module `client-portal` dans l'API
2. Endpoint agrégé pour les stats client
3. Composants widgets réutilisables
4. Layout dédié pour les pages client

---

## Tests de validation

- [ ] Dashboard affiche les bonnes données pour le client connecté
- [ ] Client A ne voit pas les données de Client B
- [ ] Widgets cliquables redirigent vers les bonnes pages
- [ ] Responsive sur mobile/tablet/desktop
