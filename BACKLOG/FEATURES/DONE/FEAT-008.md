# FEAT-008: Configuration Jest et setup tests API

**Type:** Feature
**Statut:** A faire
**Priorite:** Critique
**Complexite:** S
**Tags:** tests, api, setup
**Date creation:** 2026-01-25

---

## Description

Configurer Jest pour l'API NestJS avec ts-jest, créer la structure de tests, et ajouter les utilitaires de tests (mocks Prisma, helpers).

## Criteres d'acceptation

- [ ] jest.config.js créé avec configuration ts-jest
- [ ] test/jest-e2e.json créé pour tests e2e
- [ ] test/setup.ts avec configuration globale
- [ ] test/mocks/prisma.mock.ts pour mocker PrismaService
- [ ] test/helpers/test-utils.ts avec helpers (createMockUser, createMockClient, etc.)
- [ ] test/helpers/jwt.helper.ts pour générer tokens de test
- [ ] Script npm test:unit et test:e2e fonctionnels
- [ ] Premier test sanity check passant

## Fichiers concernes

- `apps/api/jest.config.js`
- `apps/api/test/jest-e2e.json`
- `apps/api/test/setup.ts`
- `apps/api/test/mocks/prisma.mock.ts`
- `apps/api/test/helpers/test-utils.ts`
- `apps/api/test/helpers/jwt.helper.ts`
- `apps/api/package.json`

## Analyse / Approche

1. Créer jest.config.js avec preset ts-jest
2. Configurer moduleNameMapper pour les paths
3. Créer les mocks de base pour PrismaService
4. Créer helpers pour générer données de test
5. Ajouter test sanity check (health.controller.spec.ts)

## Tests de validation

- [ ] `pnpm test` dans apps/api fonctionne
- [ ] `pnpm test:e2e` dans apps/api fonctionne
- [ ] Coverage report généré correctement
