# FEAT-063-C: Seed Templates Prestations par Defaut

**Type:** Feature
**Statut:** A faire
**Priorite:** Moyenne
**Complexite:** XS
**Tags:** data
**Parent:** FEAT-063
**Date creation:** 2026-02-04
**Dependances:** FEAT-063-A

---

## Description

Creer un script de seed pour populer la base avec les templates de prestations standards d'une entreprise de paysage.

## Scope

- Script de seed Prisma
- 6-10 templates standards de paysagiste
- Marques comme globaux (isGlobal: true)

## Criteres d'acceptation

- [ ] Script seed cree ou enrichi
- [ ] Templates standards inseres:
  - Tonte pelouse - 0.50 euro/m2
  - Taille haie - 8 euro/ml
  - Elagage leger - 45 euro/h
  - Desherbage manuel - 35 euro/h
  - Evacuation dechets - 80 euro/m3
  - Plantation arbuste - 25 euro/unite
- [ ] Tous marques isGlobal: true
- [ ] Seed idempotent (upsert ou check existence)

## Fichiers concernes

- `packages/database/prisma/seed.ts`

## Analyse technique

```typescript
const defaultTemplates = [
  {
    name: 'Tonte pelouse',
    description: 'Tonte de gazon avec ramassage',
    category: 'entretien',
    unit: 'm2',
    unitPriceHT: 0.50,
    tvaRate: 20,
    isGlobal: true,
  },
  {
    name: 'Taille haie',
    description: 'Taille de haie avec evacuation',
    category: 'entretien',
    unit: 'ml',
    unitPriceHT: 8,
    tvaRate: 20,
    isGlobal: true,
  },
  // ... etc
];

// Upsert pour idempotence
for (const template of defaultTemplates) {
  await prisma.prestationTemplate.upsert({
    where: { name: template.name },
    update: template,
    create: template,
  });
}
```

## SECTION AUTOMATISATION

**Score:** 95/100
**Raison:** Donnees fixes, script simple, idempotent

### Prompt d'execution

```
TICKET: FEAT-063-C - Seed Templates par Defaut

PREREQUIS: FEAT-063-A (schema Prisma) doit etre complete

CONTEXTE:
- Prisma seed dans packages/database/prisma/seed.ts
- TVA standard France: 20%

TACHE:
1. Lire le fichier seed.ts existant
2. Ajouter une section pour les templates prestations
3. Creer les templates par defaut (isGlobal: true):
   | Nom | Category | Unit | Prix HT |
   |-----|----------|------|---------|
   | Tonte pelouse | entretien | m2 | 0.50 |
   | Taille haie | entretien | ml | 8.00 |
   | Elagage leger | elagage | h | 45.00 |
   | Desherbage manuel | entretien | h | 35.00 |
   | Evacuation dechets verts | divers | m3 | 80.00 |
   | Plantation arbuste | creation | unite | 25.00 |
   | Creation massif | creation | m2 | 45.00 |
   | Engazonnement | creation | m2 | 8.00 |
4. Utiliser upsert pour idempotence (par nom)
5. Executer: pnpm db:seed

VALIDATION:
- [ ] Seed execute sans erreur
- [ ] Templates visibles en base
- [ ] Re-execution ne cree pas de doublons
```

## Tests de validation

- [ ] `pnpm db:seed` reussit
- [ ] Verification en base: 8 templates globaux presents
- [ ] Re-seed: pas de doublons
