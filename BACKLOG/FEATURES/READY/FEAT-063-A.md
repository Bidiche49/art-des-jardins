# FEAT-063-A: Schema Prisma PrestationTemplate + Migration

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** XS
**Tags:** data, api
**Parent:** FEAT-063
**Date creation:** 2026-02-04

---

## Description

Creer le modele Prisma `PrestationTemplate` pour stocker les templates de prestations reutilisables dans les devis.

## Scope

- Ajout du modele dans schema.prisma
- Generation et application de la migration
- Validation que le schema compile sans erreur

## Criteres d'acceptation

- [ ] Modele PrestationTemplate ajoute a schema.prisma
- [ ] Champs: id, name, description, category, unit, unitPriceHT, tvaRate, isGlobal, createdBy, createdAt, updatedAt
- [ ] Migration generee et appliquee
- [ ] `pnpm db:generate` passe sans erreur

## Fichiers concernes

- `packages/database/prisma/schema.prisma`

## Analyse technique

```prisma
model PrestationTemplate {
  id            String   @id @default(uuid())
  name          String
  description   String?
  category      String   // entretien, creation, elagage, divers
  unit          String   // m2, ml, h, forfait, m3, unite
  unitPriceHT   Decimal  @db.Decimal(10, 2)
  tvaRate       Decimal  @default(20) @db.Decimal(5, 2)
  isGlobal      Boolean  @default(false)
  createdBy     String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@map("prestation_templates")
}
```

## SECTION AUTOMATISATION

**Score:** 95/100
**Raison:** Schema Prisma bien defini, tache isolee et verifiable

### Prompt d'execution

```
TICKET: FEAT-063-A - Schema Prisma PrestationTemplate

CONTEXTE:
- Projet Art & Jardin - PWA metier paysagiste
- Schema Prisma dans packages/database/prisma/schema.prisma

TACHE:
1. Lire le schema Prisma actuel
2. Ajouter le modele PrestationTemplate avec les champs:
   - id: UUID primary key
   - name: String required
   - description: String optional
   - category: String (entretien, creation, elagage, divers)
   - unit: String (m2, ml, h, forfait, m3, unite)
   - unitPriceHT: Decimal(10,2)
   - tvaRate: Decimal(5,2) default 20
   - isGlobal: Boolean default false
   - createdBy: String optional (userId)
   - timestamps (createdAt, updatedAt)
3. Mapper sur table "prestation_templates"
4. Generer la migration: pnpm db:migrate --name add-prestation-templates
5. Verifier compilation: pnpm db:generate

VALIDATION:
- [ ] Schema compile sans erreur
- [ ] Migration generee
- [ ] Client Prisma regenere
```

## Tests de validation

- [ ] `pnpm db:generate` reussit
- [ ] Migration presente dans prisma/migrations/
