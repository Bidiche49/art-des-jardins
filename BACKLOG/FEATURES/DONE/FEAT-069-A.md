# FEAT-069-A: Modele Prisma Photo et migration

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** XS
**Tags:** data, database
**Parent:** FEAT-069
**Date creation:** 2026-02-03

---

## Description

Creer le modele Prisma `Photo` pour stocker les metadonnees des photos d'intervention (geolocalisation, horodatage, type avant/pendant/apres).

## Criteres d'acceptation

- [ ] Modele Photo ajoute dans schema.prisma
- [ ] Relation avec Intervention configuree
- [ ] Index sur (interventionId, type)
- [ ] Migration generee et applicable
- [ ] Enum PhotoType pour before/during/after

## Fichiers concernes

- `packages/database/prisma/schema.prisma`

## Analyse / Approche

```prisma
enum PhotoType {
  BEFORE
  DURING
  AFTER
}

model Photo {
  id              String    @id @default(uuid())
  interventionId  String
  intervention    Intervention @relation(fields: [interventionId], references: [id], onDelete: Cascade)
  type            PhotoType
  filename        String
  s3Key           String
  mimeType        String
  size            Int
  width           Int
  height          Int
  latitude        Float?
  longitude       Float?
  takenAt         DateTime
  uploadedAt      DateTime  @default(now())
  uploadedBy      String
  user            User      @relation(fields: [uploadedBy], references: [id])

  @@index([interventionId, type])
  @@index([uploadedBy])
}
```

## SECTION AUTOMATISATION
**Score:** 95/100

### Prompt d'execution
```
Tu travailles sur le ticket FEAT-069-A: Modele Prisma Photo.

TACHES:
1. Ouvre packages/database/prisma/schema.prisma
2. Ajoute l'enum PhotoType (BEFORE, DURING, AFTER)
3. Ajoute le modele Photo avec tous les champs:
   - id (uuid), interventionId, type, filename, s3Key
   - mimeType, size, width, height
   - latitude (optional), longitude (optional)
   - takenAt, uploadedAt, uploadedBy
4. Configure les relations (Intervention, User)
5. Ajoute les index sur (interventionId, type) et uploadedBy
6. Ajoute la relation photos: Photo[] dans le modele Intervention
7. Ajoute la relation photos: Photo[] dans le modele User
8. Execute: pnpm prisma format
9. Execute: pnpm prisma migrate dev --name add-photo-model

VALIDATION:
- La migration doit s'appliquer sans erreur
- pnpm prisma validate doit passer

Commit: git add -A && git commit -m 'feat(database): add Photo model for intervention photos [FEAT-069-A]'
```

## Tests de validation

- [ ] pnpm prisma validate passe
- [ ] Migration appliquee sans erreur
- [ ] Modele Photo visible dans Prisma Studio
