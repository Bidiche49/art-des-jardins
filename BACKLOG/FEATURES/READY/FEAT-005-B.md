# FEAT-005-B: Module Devis - CRUD complet avec lignes

**Type:** Feature
**Statut:** READY
**Priorite:** Critique
**Complexite:** S
**Tags:** api, data, models
**Parent:** FEAT-005
**Date creation:** 2025-01-25

---

## Description
Implementer le module NestJS pour l'entite Devis avec gestion des lignes de devis.
Le devis est lie a un client et optionnellement a un chantier.

## Scope limite
- Module devis uniquement
- Gestion des lignes de devis (LigneDevis) incluse
- Pas de generation PDF (sera une feature separee)
- Suivre le pattern du module clients

## Criteres d'acceptation
- [ ] `devis.module.ts` cree et exporte
- [ ] `devis.service.ts` avec CRUD + gestion lignes
- [ ] `devis.controller.ts` avec endpoints REST
- [ ] `dto/create-devis.dto.ts` avec validation (incluant lignes)
- [ ] `dto/update-devis.dto.ts` (PartialType)
- [ ] `dto/devis-filters.dto.ts` pour filtrage (par client, statut, date)
- [ ] `dto/create-ligne-devis.dto.ts`
- [ ] Calcul automatique des totaux (HT, TVA, TTC)
- [ ] Module ajoute dans `app.module.ts`
- [ ] Tests unitaires et integration

## Fichiers a creer
- `apps/api/src/modules/devis/devis.module.ts`
- `apps/api/src/modules/devis/devis.service.ts`
- `apps/api/src/modules/devis/devis.controller.ts`
- `apps/api/src/modules/devis/dto/create-devis.dto.ts`
- `apps/api/src/modules/devis/dto/update-devis.dto.ts`
- `apps/api/src/modules/devis/dto/devis-filters.dto.ts`
- `apps/api/src/modules/devis/dto/create-ligne-devis.dto.ts`

## Contexte technique
- Schema Prisma existe avec Devis et LigneDevis
- Statuts devis: BROUILLON, ENVOYE, ACCEPTE, REFUSE, EXPIRE
- Lignes contiennent: description, quantite, unite, prixUnitaire, tva

## SECTION AUTOMATISATION
**Score:** 85/100

### Prompt d'execution
```
Tu dois creer le module NestJS "devis" pour l'API.

MODELE A SUIVRE:
Lis d'abord le module clients existant:
- apps/api/src/modules/clients/

SCHEMA PRISMA:
Lis packages/database/prisma/schema.prisma pour voir les entites Devis et LigneDevis.

ETAPES:
1. Creer le dossier apps/api/src/modules/devis/
2. Creer devis.module.ts
3. Creer devis.service.ts avec:
   - create(dto): Creer devis avec lignes (transaction Prisma)
   - findAll(filters): Filtrer par client, statut, dateRange
   - findOne(id): Include client, chantier, lignes
   - update(id, dto): Mettre a jour devis et lignes
   - delete(id): Supprimer avec cascade lignes
   - updateStatut(id, statut): Changer le statut
   - calculerTotaux(lignes): Helper pour calcul HT/TVA/TTC
4. Creer devis.controller.ts avec:
   - GET /devis (avec filtres query)
   - GET /devis/:id
   - POST /devis
   - PUT /devis/:id
   - DELETE /devis/:id
   - PATCH /devis/:id/statut
5. Creer les DTOs avec validation:
   - CreateDevisDto: clientId, chantierId?, lignes[], validiteJours
   - CreateLigneDevisDto: description, quantite, unite, prixUnitaire, tauxTva
6. Ajouter DevisModule dans app.module.ts
7. Tests unitaires et integration

LOGIQUE METIER:
- Numero devis auto-genere: DEV-YYYYMM-XXX
- Date validite = date creation + validiteJours
- Total HT = somme(quantite * prixUnitaire)
- Total TVA = somme(montantHT * tauxTva)
- Total TTC = Total HT + Total TVA

VALIDATION:
- pnpm test
- pnpm build
```

## Tests de validation
- [ ] POST /devis cree un devis avec lignes
- [ ] Totaux calcules automatiquement
- [ ] GET /devis filtre par statut et client
- [ ] PATCH /devis/:id/statut change le statut
- [ ] Numero devis auto-genere correctement
- [ ] Tests passent
