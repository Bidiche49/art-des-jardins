# FEAT-005-A: Module Chantiers - CRUD complet

**Type:** Feature
**Statut:** READY
**Priorite:** Critique
**Complexite:** S
**Tags:** api, data, models
**Parent:** FEAT-005
**Date creation:** 2025-01-25

---

## Description
Implementer le module NestJS pour l'entite Chantier avec CRUD complet.
Le chantier est lie a un client et represente un projet/lieu d'intervention.

## Scope limite
- Module chantiers uniquement
- Pas de liaison avec devis/factures (sera fait dans leurs modules respectifs)
- Suivre exactement le pattern du module clients existant

## Criteres d'acceptation
- [ ] `chantiers.module.ts` cree et exporte
- [ ] `chantiers.service.ts` avec CRUD (create, findAll, findOne, update, delete)
- [ ] `chantiers.controller.ts` avec endpoints REST
- [ ] `dto/create-chantier.dto.ts` avec validation class-validator
- [ ] `dto/update-chantier.dto.ts` (PartialType)
- [ ] `dto/chantier-filters.dto.ts` pour filtrage (par client, statut)
- [ ] Module ajoute dans `app.module.ts`
- [ ] Tests unitaires service
- [ ] Tests integration controller

## Fichiers a creer
- `apps/api/src/modules/chantiers/chantiers.module.ts`
- `apps/api/src/modules/chantiers/chantiers.service.ts`
- `apps/api/src/modules/chantiers/chantiers.controller.ts`
- `apps/api/src/modules/chantiers/dto/create-chantier.dto.ts`
- `apps/api/src/modules/chantiers/dto/update-chantier.dto.ts`
- `apps/api/src/modules/chantiers/dto/chantier-filters.dto.ts`

## Contexte technique
- Schema Prisma existe deja avec l'entite Chantier
- Module clients existe comme modele (copier la structure)
- Types partages dans `packages/shared/src/types/`

## SECTION AUTOMATISATION
**Score:** 90/100

### Prompt d'execution
```
Tu dois creer le module NestJS "chantiers" pour l'API.

MODELE A SUIVRE:
Lis d'abord le module clients existant:
- apps/api/src/modules/clients/clients.module.ts
- apps/api/src/modules/clients/clients.service.ts
- apps/api/src/modules/clients/clients.controller.ts
- apps/api/src/modules/clients/dto/*.ts

SCHEMA PRISMA:
Lis packages/database/prisma/schema.prisma pour voir l'entite Chantier.

ETAPES:
1. Creer le dossier apps/api/src/modules/chantiers/
2. Creer chantiers.module.ts (importer PrismaModule)
3. Creer chantiers.service.ts avec:
   - create(dto): Prisma create
   - findAll(filters): Prisma findMany avec filtres (clientId, statut)
   - findOne(id): Prisma findUnique avec include client
   - update(id, dto): Prisma update
   - delete(id): Prisma delete
4. Creer chantiers.controller.ts avec:
   - GET /chantiers (query params pour filtres)
   - GET /chantiers/:id
   - POST /chantiers
   - PUT /chantiers/:id
   - DELETE /chantiers/:id
5. Creer les DTOs avec class-validator
6. Ajouter ChantiersModule dans app.module.ts
7. Creer les tests unitaires et integration

VALIDATION:
- pnpm test (doit passer)
- pnpm build (doit compiler)
```

## Tests de validation
- [ ] POST /chantiers cree un chantier lie a un client
- [ ] GET /chantiers retourne la liste filtrable
- [ ] GET /chantiers/:id retourne le detail avec client
- [ ] PUT /chantiers/:id met a jour
- [ ] DELETE /chantiers/:id supprime
- [ ] Tests unitaires passent
- [ ] Tests integration passent
