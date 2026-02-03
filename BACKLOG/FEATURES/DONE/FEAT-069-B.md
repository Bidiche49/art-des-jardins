# FEAT-069-B: Module API photos NestJS

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** api, data
**Parent:** FEAT-069
**Date creation:** 2026-02-03

---

## Description

Creer le module NestJS complet pour la gestion des photos: CRUD, upload vers S3, et endpoints REST.

## Criteres d'acceptation

- [ ] Module photos cree (controller, service, DTOs)
- [ ] Endpoint POST /interventions/:id/photos (upload)
- [ ] Endpoint GET /interventions/:id/photos (liste)
- [ ] Endpoint GET /photos/:id (detail)
- [ ] Endpoint DELETE /photos/:id
- [ ] Integration S3 pour stockage
- [ ] Validation des fichiers (type, taille max)
- [ ] Tests unitaires du service

## Fichiers concernes

- `apps/api/src/modules/photos/photos.module.ts` (nouveau)
- `apps/api/src/modules/photos/photos.controller.ts` (nouveau)
- `apps/api/src/modules/photos/photos.service.ts` (nouveau)
- `apps/api/src/modules/photos/dto/` (nouveau)
- `apps/api/src/modules/photos/photos.service.spec.ts` (nouveau)

## Analyse / Approche

DTOs:
```typescript
// create-photo.dto.ts
export class CreatePhotoDto {
  type: PhotoType;
  latitude?: number;
  longitude?: number;
  takenAt: Date;
}

// photo-response.dto.ts
export class PhotoResponseDto {
  id: string;
  interventionId: string;
  type: PhotoType;
  url: string; // presigned URL
  thumbnailUrl?: string;
  latitude?: number;
  longitude?: number;
  takenAt: Date;
  uploadedAt: Date;
}
```

Service:
```typescript
async uploadPhoto(
  interventionId: string,
  file: Express.Multer.File,
  dto: CreatePhotoDto,
  userId: string
): Promise<PhotoResponseDto>

async getPhotosByIntervention(interventionId: string): Promise<PhotoResponseDto[]>

async deletePhoto(id: string): Promise<void>
```

## SECTION AUTOMATISATION
**Score:** 85/100

### Prompt d'execution
```
Tu travailles sur le ticket FEAT-069-B: Module API photos.

PRE-REQUIS: FEAT-069-A doit etre termine (modele Photo existe)

TACHES:
1. Cree le dossier apps/api/src/modules/photos/
2. Cree photos.module.ts avec imports necessaires
3. Cree le dossier dto/ avec:
   - create-photo.dto.ts (type, latitude, longitude, takenAt)
   - photo-response.dto.ts
4. Cree photos.service.ts avec:
   - uploadPhoto(): upload vers S3, cree entree BDD
   - getPhotosByIntervention(): liste photos
   - getPhotoById(): detail avec presigned URL
   - deletePhoto(): supprime S3 + BDD
   - generatePresignedUrl(): URL temporaire
5. Cree photos.controller.ts avec:
   - POST /interventions/:interventionId/photos (multipart)
   - GET /interventions/:interventionId/photos
   - GET /photos/:id
   - DELETE /photos/:id
6. Ajoute validation fichier (max 10MB, image/*)
7. Ajoute PhotosModule aux imports de AppModule
8. Cree photos.service.spec.ts avec tests unitaires

VALIDATION:
- pnpm test apps/api doit passer
- Les endpoints sont accessibles

Commit: git add -A && git commit -m 'feat(api): add photos module with S3 upload [FEAT-069-B]'
```

## Tests de validation

- [ ] POST upload fonctionne avec fichier image
- [ ] GET liste retourne les photos
- [ ] DELETE supprime photo S3 + BDD
- [ ] Tests unitaires passent
