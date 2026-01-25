# FEAT-002: Backend NestJS - Setup initial

**Type:** Feature
**Statut:** A faire
**Priorite:** Critique
**Complexite:** M
**Tags:** api, backend, nestjs
**Date creation:** 2025-01-25

---

## Description
Creer l'application NestJS avec la configuration de base, auth JWT, et connexion PostgreSQL.

## User Story
**En tant que** developpeur
**Je veux** un backend NestJS fonctionnel
**Afin de** pouvoir creer les endpoints API

## Criteres d'acceptation
- [ ] NestJS installe et configure
- [ ] TypeORM ou Prisma configure avec PostgreSQL
- [ ] Module Auth avec JWT + Refresh tokens
- [ ] Swagger/OpenAPI configure
- [ ] Health check endpoint
- [ ] Configuration par environnement
- [ ] Tests unitaires setup (Jest)

## Fichiers concernes
- `apps/api/`
- `packages/database/`

## Analyse / Approche
1. `nest new api --package-manager pnpm`
2. Installer et configurer TypeORM
3. Module Auth avec Passport + JWT
4. Decorateurs custom pour roles
5. Global exception filter
6. Validation pipes (class-validator)

## Tests de validation
- [ ] `pnpm dev:api` demarre le serveur
- [ ] `/health` retourne 200
- [ ] `/api/docs` affiche Swagger
- [ ] Tests unitaires passent
