# FEAT-071-A: Modeles de donnees rentabilite (TimeEntry, MaterialUsage)

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** data, api
**Date creation:** 2026-02-03
**Parent:** FEAT-071

---

## Description

Creer les modeles Prisma pour le suivi de rentabilite : TimeEntry (heures par employe par intervention) et MaterialUsage (materiaux utilises par chantier). Ajouter egalement le champ taux horaire sur User.

## Scope limite

- Schema Prisma uniquement
- Migration de base de donnees
- Pas d'API dans ce ticket

## Criteres d'acceptation

- [ ] Model TimeEntry cree avec relations (Intervention, User)
- [ ] Model MaterialUsage cree avec relation Chantier
- [ ] Champ hourlyRate (Decimal) ajoute sur User
- [ ] Migration generee et appliquee
- [ ] Tests schema valides (prisma validate)

## Fichiers concernes

- `packages/database/prisma/schema.prisma`

## Analyse technique

```prisma
model TimeEntry {
  id              String       @id @default(uuid())
  interventionId  String
  intervention    Intervention @relation(fields: [interventionId], references: [id], onDelete: Cascade)
  userId          String
  user            User         @relation(fields: [userId], references: [id])
  hours           Decimal      @db.Decimal(5, 2)
  date            DateTime     @db.Date
  description     String?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
}

model MaterialUsage {
  id          String   @id @default(uuid())
  chantierId  String
  chantier    Chantier @relation(fields: [chantierId], references: [id], onDelete: Cascade)
  name        String
  quantity    Decimal  @db.Decimal(10, 2)
  unitCost    Decimal  @db.Decimal(10, 2)
  totalCost   Decimal  @db.Decimal(10, 2)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Ajouter sur User:
model User {
  // ... champs existants
  hourlyRate    Decimal?  @db.Decimal(10, 2) // Cout horaire entreprise
  timeEntries   TimeEntry[]
}
```

## SECTION AUTOMATISATION

**Score:** 90/100
**Automatisable:** OUI

### Raison du score
- Schema Prisma bien defini
- Patterns existants dans le projet
- Verification simple (prisma validate)

### Prompt d'execution

```
TICKET: FEAT-071-A - Modeles de donnees rentabilite

MISSION: Ajouter les modeles TimeEntry et MaterialUsage au schema Prisma

ETAPES:
1. Lire packages/database/prisma/schema.prisma
2. Identifier les modeles User, Intervention, Chantier existants
3. Ajouter le champ hourlyRate sur User
4. Ajouter le model TimeEntry avec relations
5. Ajouter le model MaterialUsage avec relations
6. Ajouter les relations inverses sur User, Intervention, Chantier
7. Executer: pnpm --filter @art-et-jardin/database prisma validate
8. Generer migration: pnpm --filter @art-et-jardin/database prisma migrate dev --name add_rentabilite_models
9. Verifier que la migration passe

VALIDATION:
- prisma validate OK
- Migration creee et appliquee
- Pas d'erreur de relation
```

### Criteres de succes automatises

- [ ] `pnpm --filter @art-et-jardin/database prisma validate` retourne 0
- [ ] Migration generee sans erreur
- [ ] Les 2 nouveaux modeles presents dans schema.prisma

## Tests de validation

- [ ] Schema Prisma valide
- [ ] Migration appliquee
- [ ] Champ hourlyRate sur User
- [ ] TimeEntry lie a Intervention et User
- [ ] MaterialUsage lie a Chantier
