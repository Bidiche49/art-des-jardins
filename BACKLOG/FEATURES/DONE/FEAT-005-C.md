# FEAT-005-C: Module Factures - CRUD lie aux devis

**Type:** Feature
**Statut:** READY
**Priorite:** Critique
**Complexite:** S
**Tags:** api, data, models
**Parent:** FEAT-005
**Date creation:** 2025-01-25

---

## Description
Implementer le module NestJS pour l'entite Facture.
La facture est generee a partir d'un devis accepte et reprend ses lignes.

## Scope limite
- Module factures uniquement
- Creation a partir d'un devis (copie des lignes)
- Pas de generation PDF (sera une feature separee)
- Pas de gestion des paiements (sera une feature separee)
- Suivre le pattern du module clients

## Criteres d'acceptation
- [ ] `factures.module.ts` cree et exporte
- [ ] `factures.service.ts` avec CRUD + creation depuis devis
- [ ] `factures.controller.ts` avec endpoints REST
- [ ] `dto/create-facture.dto.ts` avec validation
- [ ] `dto/update-facture.dto.ts`
- [ ] `dto/facture-filters.dto.ts` pour filtrage
- [ ] Endpoint POST /factures/from-devis/:devisId
- [ ] Module ajoute dans `app.module.ts`
- [ ] Tests unitaires et integration

## Fichiers a creer
- `apps/api/src/modules/factures/factures.module.ts`
- `apps/api/src/modules/factures/factures.service.ts`
- `apps/api/src/modules/factures/factures.controller.ts`
- `apps/api/src/modules/factures/dto/create-facture.dto.ts`
- `apps/api/src/modules/factures/dto/update-facture.dto.ts`
- `apps/api/src/modules/factures/dto/facture-filters.dto.ts`

## Contexte technique
- Schema Prisma existe avec Facture et LigneFacture
- Statuts facture: BROUILLON, ENVOYEE, PAYEE, PARTIELLEMENT_PAYEE, EN_RETARD, ANNULEE
- Facture herite les lignes du devis source

## SECTION AUTOMATISATION
**Score:** 85/100

### Prompt d'execution
```
Tu dois creer le module NestJS "factures" pour l'API.

MODELE A SUIVRE:
Lis d'abord le module clients et le module devis (si existant):
- apps/api/src/modules/clients/
- apps/api/src/modules/devis/ (si existe)

SCHEMA PRISMA:
Lis packages/database/prisma/schema.prisma pour voir Facture et LigneFacture.

ETAPES:
1. Creer le dossier apps/api/src/modules/factures/
2. Creer factures.module.ts (importer DevisModule si necessaire)
3. Creer factures.service.ts avec:
   - createFromDevis(devisId): Creer facture depuis devis accepte
   - create(dto): Creation manuelle (rare)
   - findAll(filters): Filtrer par client, statut, date, montant
   - findOne(id): Include client, devis, lignes
   - update(id, dto): Mettre a jour
   - delete(id): Supprimer (soft delete prefere)
   - updateStatut(id, statut): Changer le statut
4. Creer factures.controller.ts avec:
   - GET /factures
   - GET /factures/:id
   - POST /factures
   - POST /factures/from-devis/:devisId (IMPORTANT)
   - PUT /factures/:id
   - DELETE /factures/:id
   - PATCH /factures/:id/statut
5. Creer les DTOs avec validation
6. Ajouter FacturesModule dans app.module.ts
7. Tests unitaires et integration

LOGIQUE METIER:
- Numero facture auto-genere: FAC-YYYYMM-XXX
- Date echeance = date emission + delai paiement (30j par defaut)
- createFromDevis:
  1. Verifier que devis existe et statut = ACCEPTE
  2. Copier les lignes du devis vers lignes facture
  3. Copier les montants (HT, TVA, TTC)
  4. Lier la facture au devis source
  5. Statut initial = BROUILLON

VALIDATION:
- pnpm test
- pnpm build
```

## Tests de validation
- [ ] POST /factures/from-devis/:id cree facture depuis devis
- [ ] Lignes copiees correctement du devis
- [ ] Refuse si devis non accepte
- [ ] GET /factures filtre correctement
- [ ] Numero facture auto-genere
- [ ] Tests passent
