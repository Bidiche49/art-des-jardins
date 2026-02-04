# FEAT-063-B: Module API CRUD Templates Prestations

**Type:** Feature
**Statut:** Fait
**Date completion:** 2026-02-04
**Priorite:** Haute
**Complexite:** S
**Tags:** api
**Parent:** FEAT-063
**Date creation:** 2026-02-04
**Dependances:** FEAT-063-A

---

## Description

Creer le module NestJS complet pour la gestion des templates de prestations: controller, service, DTOs avec validation.

## Scope

- Module NestJS templates dans apps/api
- CRUD complet (Create, Read, Update, Delete)
- DTOs avec class-validator
- Filtrage par categorie et recherche par nom
- Tests unitaires du service

## Criteres d'acceptation

- [x] Module templates cree et enregistre
- [x] Endpoints REST fonctionnels:
  - GET /api/v1/templates (liste avec filtres)
  - GET /api/v1/templates/:id
  - POST /api/v1/templates
  - PUT /api/v1/templates/:id
  - DELETE /api/v1/templates/:id
- [x] DTOs avec validation (class-validator)
- [x] Filtre par category en query param
- [x] Recherche par nom (search=xxx)
- [x] Tests unitaires du service

## Fichiers concernes

- `apps/api/src/modules/templates/templates.module.ts`
- `apps/api/src/modules/templates/templates.controller.ts`
- `apps/api/src/modules/templates/templates.service.ts`
- `apps/api/src/modules/templates/dto/`
- `apps/api/src/modules/templates/templates.service.spec.ts`

## Analyse technique

### Structure endpoints

```typescript
// GET /api/v1/templates?category=entretien&search=tonte
// GET /api/v1/templates/:id
// POST /api/v1/templates
// PUT /api/v1/templates/:id
// DELETE /api/v1/templates/:id
```

### DTOs

```typescript
// create-template.dto.ts
class CreateTemplateDto {
  name: string;          // @IsNotEmpty()
  description?: string;
  category: string;      // @IsIn(['entretien', 'creation', 'elagage', 'divers'])
  unit: string;          // @IsIn(['m2', 'ml', 'h', 'forfait', 'm3', 'unite'])
  unitPriceHT: number;   // @IsPositive()
  tvaRate?: number;      // @IsOptional(), @Min(0), @Max(100)
  isGlobal?: boolean;
}
```

## SECTION AUTOMATISATION

**Score:** 90/100
**Raison:** Pattern CRUD standard NestJS, bien documente

### Prompt d'execution

```
TICKET: FEAT-063-B - Module API CRUD Templates

PREREQUIS: FEAT-063-A (schema Prisma) doit etre complete

CONTEXTE:
- API NestJS dans apps/api/
- Pattern existant a suivre: regarder un module existant (clients, devis...)
- Prisma pour ORM

TACHE:
1. Explorer la structure d'un module existant dans apps/api/src/modules/
2. Creer apps/api/src/modules/templates/ avec:
   - templates.module.ts
   - templates.controller.ts (CRUD REST)
   - templates.service.ts (logique metier)
   - dto/create-template.dto.ts
   - dto/update-template.dto.ts
   - dto/query-template.dto.ts (filtres)
3. Implementer:
   - GET /api/v1/templates avec filtres (category, search)
   - GET /api/v1/templates/:id
   - POST /api/v1/templates
   - PUT /api/v1/templates/:id
   - DELETE /api/v1/templates/:id
4. Ajouter validation class-validator sur DTOs
5. Enregistrer le module dans app.module.ts
6. Ecrire tests unitaires pour le service
7. Tester avec curl ou via Swagger si disponible

VALIDATION:
- [ ] Build API reussit
- [ ] Tests unitaires passent
- [ ] Endpoints accessibles
```

## Tests de validation

- [x] `pnpm test:api` - tests unitaires passent (18 tests)
- [x] `pnpm build:api` - build reussit
- [ ] Endpoints testables via curl/Swagger (requiert API running)
