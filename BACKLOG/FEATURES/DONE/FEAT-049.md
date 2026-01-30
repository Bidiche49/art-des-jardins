# FEAT-049: Tests e2e Portail Client et Analytics

**Type:** Feature
**Statut:** Fait
**Priorite:** Haute
**Complexite:** L
**Tags:** tests, e2e, portail-client, analytics
**Date creation:** 2026-01-30

---

## Description

Ajouter les tests e2e pour les modules Phase 6 (Portail Client) et Phase 7 (Analytics) implementes recemment. Couvrir les flows principaux d'authentification client, consultation et messagerie.

## User Story

**En tant que** developpeur
**Je veux** avoir une couverture de tests e2e sur les nouveaux modules
**Afin de** garantir la non-regression lors des evolutions futures

## Criteres d'acceptation

- [ ] Test e2e auth client magic link flow
- [ ] Test e2e dashboard client
- [ ] Test e2e consultation devis/factures
- [ ] Test e2e suivi chantier avec timeline
- [ ] Test e2e messagerie (creation, envoi, lecture)
- [ ] Test e2e dashboard analytics
- [ ] Test e2e rapports financiers
- [ ] Tous les tests passent en CI

## Fichiers concernes

- `apps/api/test/client-auth.e2e-spec.ts` (a creer)
- `apps/api/test/client-portal.e2e-spec.ts` (a creer)
- `apps/api/test/messaging.e2e-spec.ts` (a creer)
- `apps/api/test/analytics.e2e-spec.ts` (a creer)

## Analyse / Approche

1. Creer fixtures pour clients et tokens
2. Tester le flow complet magic link
3. Tester les endpoints client-portal
4. Tester la messagerie bidirectionnelle
5. Tester les agregations analytics

## Tests de validation

- [ ] `pnpm test:e2e` passe avec tous les nouveaux tests
- [ ] Couverture > 80% sur les nouveaux modules
