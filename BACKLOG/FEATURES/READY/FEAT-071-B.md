# FEAT-071-B: API CRUD saisie heures (TimeEntry)

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** api
**Date creation:** 2026-02-03
**Parent:** FEAT-071
**Depend de:** FEAT-071-A

---

## Description

Creer le module API NestJS pour la gestion des TimeEntry (saisie des heures par employe par intervention). CRUD complet avec validation.

## Scope limite

- Module NestJS time-entries
- Controller, Service, DTOs
- Pas d'interface PWA dans ce ticket

## Criteres d'acceptation

- [ ] POST /api/v1/interventions/:id/time-entries (creer)
- [ ] GET /api/v1/interventions/:id/time-entries (lister par intervention)
- [ ] GET /api/v1/time-entries/:id (detail)
- [ ] PUT /api/v1/time-entries/:id (modifier)
- [ ] DELETE /api/v1/time-entries/:id (supprimer)
- [ ] Validation des donnees (hours > 0, date valide)
- [ ] Tests unitaires service

## Fichiers concernes

- `apps/api/src/modules/time-entries/` (nouveau module)
  - `time-entries.module.ts`
  - `time-entries.controller.ts`
  - `time-entries.service.ts`
  - `dto/create-time-entry.dto.ts`
  - `dto/update-time-entry.dto.ts`

## Analyse technique

```typescript
// create-time-entry.dto.ts
export class CreateTimeEntryDto {
  @IsUUID()
  userId: string;

  @IsNumber()
  @Min(0.25)
  @Max(24)
  hours: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

// Endpoints
POST   /api/v1/interventions/:interventionId/time-entries
GET    /api/v1/interventions/:interventionId/time-entries
GET    /api/v1/time-entries/:id
PUT    /api/v1/time-entries/:id
DELETE /api/v1/time-entries/:id
```

## SECTION AUTOMATISATION

**Score:** 85/100
**Automatisable:** OUI

### Raison du score
- Pattern CRUD standard NestJS
- Modules similaires existants (interventions, chantiers)
- Tests unitaires patterns connus

### Prompt d'execution

```
TICKET: FEAT-071-B - API CRUD TimeEntry

PREREQUIS: FEAT-071-A doit etre termine (modeles Prisma)

MISSION: Creer le module NestJS pour la gestion des TimeEntry

ETAPES:
1. Lire un module existant comme reference (ex: apps/api/src/modules/interventions/)
2. Creer le dossier apps/api/src/modules/time-entries/
3. Creer time-entries.module.ts
4. Creer les DTOs: create-time-entry.dto.ts, update-time-entry.dto.ts
5. Creer time-entries.service.ts avec:
   - create(interventionId, dto)
   - findByIntervention(interventionId)
   - findOne(id)
   - update(id, dto)
   - remove(id)
6. Creer time-entries.controller.ts avec les 5 endpoints
7. Enregistrer le module dans app.module.ts
8. Ecrire les tests unitaires: time-entries.service.spec.ts
9. Executer: pnpm --filter @art-et-jardin/api test time-entries

VALIDATION:
- Les 5 endpoints repondent
- Tests unitaires passent
- Validation DTO fonctionne
```

### Criteres de succes automatises

- [ ] Module time-entries cree et enregistre
- [ ] `pnpm --filter @art-et-jardin/api test time-entries` passe
- [ ] `pnpm --filter @art-et-jardin/api build` sans erreur

## Tests de validation

- [ ] POST cree une entree avec les bonnes donnees
- [ ] GET liste les entrees d'une intervention
- [ ] PUT modifie une entree existante
- [ ] DELETE supprime une entree
- [ ] Validation rejette hours < 0
- [ ] Validation rejette date invalide
