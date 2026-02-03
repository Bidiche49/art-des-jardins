# FEAT-071-C: API CRUD materiaux utilises (MaterialUsage)

**Type:** Feature
**Statut:** Fait
**Priorite:** Haute
**Complexite:** S
**Tags:** api
**Date creation:** 2026-02-03
**Parent:** FEAT-071
**Depend de:** FEAT-071-A

---

## Description

Creer le module API NestJS pour la gestion des MaterialUsage (materiaux utilises par chantier). CRUD complet avec calcul automatique du cout total.

## Scope limite

- Module NestJS material-usages
- Controller, Service, DTOs
- Calcul automatique totalCost = quantity * unitCost
- Pas d'interface PWA dans ce ticket

## Criteres d'acceptation

- [x] POST /api/v1/chantiers/:id/materials (creer)
- [x] GET /api/v1/chantiers/:id/materials (lister par chantier)
- [x] GET /api/v1/materials/:id (detail)
- [x] PUT /api/v1/materials/:id (modifier)
- [x] DELETE /api/v1/materials/:id (supprimer)
- [x] Calcul automatique totalCost
- [x] Validation des donnees (quantity > 0, unitCost >= 0)
- [x] Tests unitaires service

## Fichiers concernes

- `apps/api/src/modules/material-usages/` (nouveau module)
  - `material-usages.module.ts`
  - `material-usages.controller.ts`
  - `material-usages.service.ts`
  - `dto/create-material-usage.dto.ts`
  - `dto/update-material-usage.dto.ts`

## Analyse technique

```typescript
// create-material-usage.dto.ts
export class CreateMaterialUsageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name: string;

  @IsNumber()
  @Min(0.01)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitCost: number;

  // totalCost calcule automatiquement dans le service
}

// Service
async create(chantierId: string, dto: CreateMaterialUsageDto) {
  const totalCost = dto.quantity * dto.unitCost;
  return this.prisma.materialUsage.create({
    data: { ...dto, chantierId, totalCost }
  });
}
```

## SECTION AUTOMATISATION

**Score:** 85/100
**Automatisable:** OUI

### Raison du score
- Pattern CRUD identique a FEAT-071-B
- Logique metier simple (calcul totalCost)
- Tests patterns connus

### Prompt d'execution

```
TICKET: FEAT-071-C - API CRUD MaterialUsage

PREREQUIS: FEAT-071-A doit etre termine (modeles Prisma)

MISSION: Creer le module NestJS pour la gestion des MaterialUsage

ETAPES:
1. Lire le module time-entries comme reference (si disponible) ou interventions
2. Creer le dossier apps/api/src/modules/material-usages/
3. Creer material-usages.module.ts
4. Creer les DTOs: create-material-usage.dto.ts, update-material-usage.dto.ts
5. Creer material-usages.service.ts avec:
   - create(chantierId, dto) - CALCULER totalCost = quantity * unitCost
   - findByChantier(chantierId)
   - findOne(id)
   - update(id, dto) - RECALCULER totalCost si quantity ou unitCost change
   - remove(id)
6. Creer material-usages.controller.ts avec les 5 endpoints
7. Enregistrer le module dans app.module.ts
8. Ecrire les tests unitaires: material-usages.service.spec.ts
9. Executer: pnpm --filter @art-et-jardin/api test material-usages

VALIDATION:
- Les 5 endpoints repondent
- totalCost calcule automatiquement
- Tests unitaires passent
```

### Criteres de succes automatises

- [x] Module material-usages cree et enregistre
- [x] `pnpm --filter @art-et-jardin/api test material-usages` passe
- [x] `pnpm --filter @art-et-jardin/api build` sans erreur

## Tests de validation

- [x] POST cree un materiau avec totalCost calcule
- [x] GET liste les materiaux d'un chantier
- [x] PUT modifie et recalcule totalCost
- [x] DELETE supprime un materiau
- [x] Validation rejette quantity <= 0
- [x] totalCost = quantity * unitCost toujours vrai
