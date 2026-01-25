# FEAT-005-D: Module Interventions - CRUD avec pointage

**Type:** Feature
**Statut:** READY
**Priorite:** Critique
**Complexite:** S
**Tags:** api, data, models
**Parent:** FEAT-005
**Date creation:** 2025-01-25

---

## Description
Implementer le module NestJS pour l'entite Intervention (pointage terrain).
L'intervention represente une session de travail sur un chantier.

## Scope limite
- Module interventions uniquement
- Gestion des heures (debut, fin, duree)
- Pas de gestion multi-employes (sera une evolution)
- Pas de photos/notes (sera une evolution)
- Suivre le pattern du module clients

## Criteres d'acceptation
- [ ] `interventions.module.ts` cree et exporte
- [ ] `interventions.service.ts` avec CRUD + calcul duree
- [ ] `interventions.controller.ts` avec endpoints REST
- [ ] `dto/create-intervention.dto.ts` avec validation
- [ ] `dto/update-intervention.dto.ts`
- [ ] `dto/intervention-filters.dto.ts` (par chantier, date, user)
- [ ] Calcul automatique de la duree
- [ ] Module ajoute dans `app.module.ts`
- [ ] Tests unitaires et integration

## Fichiers a creer
- `apps/api/src/modules/interventions/interventions.module.ts`
- `apps/api/src/modules/interventions/interventions.service.ts`
- `apps/api/src/modules/interventions/interventions.controller.ts`
- `apps/api/src/modules/interventions/dto/create-intervention.dto.ts`
- `apps/api/src/modules/interventions/dto/update-intervention.dto.ts`
- `apps/api/src/modules/interventions/dto/intervention-filters.dto.ts`

## Contexte technique
- Schema Prisma existe avec Intervention
- Lie a un Chantier et un User (l'employe)
- Contient: dateDebut, dateFin, dureeMinutes, description

## SECTION AUTOMATISATION
**Score:** 90/100

### Prompt d'execution
```
Tu dois creer le module NestJS "interventions" pour l'API.

MODELE A SUIVRE:
Lis d'abord le module clients existant:
- apps/api/src/modules/clients/

SCHEMA PRISMA:
Lis packages/database/prisma/schema.prisma pour voir l'entite Intervention.

ETAPES:
1. Creer le dossier apps/api/src/modules/interventions/
2. Creer interventions.module.ts
3. Creer interventions.service.ts avec:
   - create(dto, userId): Creer intervention pour user connecte
   - findAll(filters): Filtrer par chantier, user, dateRange
   - findOne(id): Include chantier, user
   - update(id, dto): Mettre a jour (recalculer duree si dates changent)
   - delete(id): Supprimer
   - startIntervention(chantierId, userId): Demarrer pointage (dateDebut = now)
   - stopIntervention(id): Arreter pointage (dateFin = now, calcul duree)
   - calculerDuree(dateDebut, dateFin): Helper
4. Creer interventions.controller.ts avec:
   - GET /interventions
   - GET /interventions/:id
   - POST /interventions
   - POST /interventions/start/:chantierId (pointage rapide)
   - POST /interventions/:id/stop (arreter pointage)
   - PUT /interventions/:id
   - DELETE /interventions/:id
5. Creer les DTOs avec validation:
   - CreateInterventionDto: chantierId, dateDebut, dateFin?, description?
   - dateDebut et dateFin sont des ISO strings
6. Ajouter InterventionsModule dans app.module.ts
7. Tests unitaires et integration

LOGIQUE METIER:
- dureeMinutes = (dateFin - dateDebut) en minutes
- Si dateFin null = intervention en cours
- Endpoint start/stop pour pointage rapide depuis PWA
- Filtrer par user pour voir ses propres interventions

VALIDATION:
- pnpm test
- pnpm build
```

## Tests de validation
- [ ] POST /interventions cree une intervention
- [ ] POST /interventions/start/:chantierId demarre pointage
- [ ] POST /interventions/:id/stop arrete et calcule duree
- [ ] Duree calculee correctement
- [ ] GET /interventions filtre par chantier et user
- [ ] Tests passent
