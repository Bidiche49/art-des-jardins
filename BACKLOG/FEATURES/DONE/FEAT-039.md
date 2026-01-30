# FEAT-039: Consultation devis et factures client

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** M
**Tags:** ui, api, portail-client, pdf
**Date creation:** 2026-01-30

---

## Description

Pages permettant aux clients de consulter leurs devis et factures, avec possibilité de télécharger les PDF et de signer les devis en attente directement depuis le portail.

---

## User Story

**En tant que** client connecté au portail
**Je veux** consulter mes devis et factures et télécharger les PDF
**Afin de** avoir accès à mes documents commerciaux à tout moment

---

## Criteres d'acceptation

- [ ] Page `/client/devis` listant tous les devis du client
- [ ] Page `/client/devis/:id` avec détail du devis
- [ ] Bouton télécharger PDF sur chaque devis
- [ ] Bouton "Signer ce devis" si statut = envoyé (intégration FEAT-027)
- [ ] Page `/client/factures` listant toutes les factures
- [ ] Page `/client/factures/:id` avec détail de la facture
- [ ] Bouton télécharger PDF sur chaque facture
- [ ] Filtres par statut et période
- [ ] Endpoints API dédiés avec scope client
- [ ] Tests unitaires et e2e
- [ ] Tests de non-regression passes

---

## Fichiers concernes

- `apps/api/src/modules/client-portal/devis-client.controller.ts`
- `apps/api/src/modules/client-portal/factures-client.controller.ts`
- `apps/pwa/src/pages/client/DevisList.tsx`
- `apps/pwa/src/pages/client/DevisDetail.tsx`
- `apps/pwa/src/pages/client/FacturesList.tsx`
- `apps/pwa/src/pages/client/FactureDetail.tsx`

---

## Approche proposee

1. Controllers dédiés dans client-portal (réutilisent les services existants)
2. Filtrage automatique par client_id du token JWT
3. Réutilisation des composants PDF existants
4. Intégration avec le système de signature existant

---

## Tests de validation

- [ ] Client voit uniquement SES devis/factures
- [ ] PDF téléchargeable et valide
- [ ] Signature devis fonctionne depuis le portail
- [ ] Filtres fonctionnent correctement
- [ ] Pagination si beaucoup de documents
