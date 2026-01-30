# FEAT-040: Suivi chantiers temps réel

**Type:** Feature
**Statut:** A faire
**Priorite:** Moyenne
**Complexite:** M
**Tags:** ui, api, portail-client, realtime
**Date creation:** 2026-01-30

---

## Description

Page permettant aux clients de suivre l'avancement de leurs chantiers en temps réel : statut, interventions planifiées et réalisées, photos de progression.

---

## User Story

**En tant que** client connecté au portail
**Je veux** suivre l'avancement de mes chantiers en temps réel
**Afin de** être informé de la progression des travaux sans avoir à appeler l'entreprise

---

## Criteres d'acceptation

- [ ] Page `/client/chantiers` listant les chantiers du client
- [ ] Page `/client/chantiers/:id` avec détail et timeline
- [ ] Timeline visuelle des interventions (passées et à venir)
- [ ] Statut du chantier clairement affiché (en cours, terminé, en pause)
- [ ] Galerie photos des interventions (si photos attachées)
- [ ] Notification lors de mise à jour du chantier (via push si activé)
- [ ] Endpoints API dédiés avec scope client
- [ ] Tests unitaires et e2e
- [ ] Tests de non-regression passes

---

## Fichiers concernes

- `apps/api/src/modules/client-portal/chantiers-client.controller.ts`
- `apps/pwa/src/pages/client/ChantiersList.tsx`
- `apps/pwa/src/pages/client/ChantierDetail.tsx`
- `apps/pwa/src/components/client/ChantierTimeline.tsx`
- `apps/pwa/src/components/client/PhotoGallery.tsx`

---

## Approche proposee

1. Controller dédié filtrant par client_id
2. Endpoint timeline avec interventions ordonnées
3. Composant timeline réutilisable
4. Galerie photos avec lightbox
5. Intégration notifications push existantes

---

## Tests de validation

- [ ] Client voit uniquement SES chantiers
- [ ] Timeline affiche interventions dans l'ordre chronologique
- [ ] Photos s'affichent correctement
- [ ] Statut chantier reflète la réalité
- [ ] Notifications envoyées lors de mise à jour
