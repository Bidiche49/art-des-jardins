# FEAT-069: Photos geolocalisees avant/apres

**Type:** Feature
**Statut:** Pret
**Priorite:** Haute
**Complexite:** M
**Tags:** ux, pwa, mobile, data
**Date creation:** 2026-02-03
**Phase:** 14

---

## Description

Permettre aux employes de prendre des photos avant/apres intervention avec geolocalisation et horodatage automatiques.

## User Story

**En tant que** employe
**Je veux** prendre des photos avant et apres mon intervention
**Afin de** documenter le travail effectue et prouver la realisation

## Contexte

Les photos avant/apres sont essentielles pour:
- Prouver le travail effectue au client
- Documenter l'etat initial (litiges)
- Montrer la qualite du travail (portfolio)
- Suivi des chantiers dans le temps

## Criteres d'acceptation

- [ ] Bouton photo dans page intervention
- [ ] Choix: Avant / Apres / Pendant
- [ ] Geolocalisation automatique (EXIF + BDD)
- [ ] Horodatage automatique
- [ ] Preview avant upload
- [ ] Compression automatique (qualite/taille)
- [ ] Upload differe si offline (queue)
- [ ] Galerie par intervention
- [ ] Comparaison avant/apres cote-a-cote
- [ ] Export pour client (watermark optionnel)

## Fichiers concernes

- `packages/database/prisma/schema.prisma` (Photo model)
- `apps/api/src/modules/photos/` (nouveau)
- `apps/pwa/src/components/PhotoCapture.tsx` (nouveau)
- `apps/pwa/src/components/PhotoGallery.tsx` (nouveau)
- `apps/pwa/src/services/photo.service.ts` (nouveau)

## Analyse / Approche

```prisma
model Photo {
  id              String   @id @default(uuid())
  interventionId  String
  intervention    Intervention @relation(fields: [interventionId], references: [id])
  type            String   // before, during, after
  filename        String
  s3Key           String
  mimeType        String
  size            Int
  width           Int
  height          Int
  latitude        Float?
  longitude       Float?
  takenAt         DateTime
  uploadedAt      DateTime @default(now())
  uploadedBy      String

  @@index([interventionId, type])
}
```

Compression:
- Max 1920px cote le plus long
- Qualite JPEG 80%
- Conserver EXIF (GPS, date)

```typescript
// Capture photo avec geoloc
const capturePhoto = async (type: 'before' | 'during' | 'after') => {
  const position = await getCurrentPosition();
  const photo = await camera.capture({
    quality: 80,
    maxWidth: 1920,
    maxHeight: 1920,
  });

  return {
    ...photo,
    type,
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    takenAt: new Date(),
  };
};
```

## Tests de validation

- [ ] Capture photo fonctionne
- [ ] Geolocalisation enregistree
- [ ] Horodatage correct
- [ ] Compression effective
- [ ] Upload offline puis sync
- [ ] Galerie affiche les photos
- [ ] Comparaison avant/apres
