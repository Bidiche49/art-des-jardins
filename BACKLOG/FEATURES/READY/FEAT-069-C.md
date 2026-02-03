# FEAT-069-C: Service photo PWA avec compression et offline

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** pwa, ux, mobile
**Parent:** FEAT-069
**Date creation:** 2026-02-03

---

## Description

Creer le service photo PWA gerant la capture, compression, geolocalisation et queue offline pour upload differe.

## Criteres d'acceptation

- [ ] Service PhotoService cree
- [ ] Compression image (max 1920px, qualite 80%)
- [ ] Recuperation geolocalisation
- [ ] Horodatage automatique
- [ ] Queue offline avec IndexedDB
- [ ] Sync automatique quand online
- [ ] Tests unitaires

## Fichiers concernes

- `apps/pwa/src/services/photo.service.ts` (nouveau)
- `apps/pwa/src/services/photo.service.spec.ts` (nouveau)
- `apps/pwa/src/stores/photoQueue.store.ts` (nouveau)

## Analyse / Approche

```typescript
// photo.service.ts
interface PhotoData {
  file: File;
  type: 'BEFORE' | 'DURING' | 'AFTER';
  latitude?: number;
  longitude?: number;
  takenAt: Date;
  interventionId: string;
}

class PhotoService {
  // Compression
  async compressImage(file: File): Promise<Blob>

  // Geolocalisation
  async getCurrentPosition(): Promise<{lat: number, lng: number} | null>

  // Capture complete
  async capturePhoto(
    file: File,
    type: PhotoType,
    interventionId: string
  ): Promise<PhotoData>

  // Upload ou queue
  async uploadOrQueue(photo: PhotoData): Promise<void>

  // Sync queue offline
  async syncOfflineQueue(): Promise<void>
}
```

Store offline queue:
```typescript
// photoQueue.store.ts
interface QueuedPhoto {
  id: string;
  data: PhotoData;
  attempts: number;
  lastAttempt?: Date;
}

// Utiliser IndexedDB via idb ou dexie
```

## SECTION AUTOMATISATION
**Score:** 85/100

### Prompt d'execution
```
Tu travailles sur le ticket FEAT-069-C: Service photo PWA.

PRE-REQUIS: Aucun (peut etre fait en parallele de B)

TACHES:
1. Installe les deps si necessaire: pnpm add browser-image-compression idb
2. Cree apps/pwa/src/services/photo.service.ts avec:
   - compressImage(): utilise browser-image-compression
     - maxWidthOrHeight: 1920
     - maxSizeMB: 2
     - useWebWorker: true
   - getCurrentPosition(): wrapper navigator.geolocation
   - capturePhoto(): combine compression + geoloc + timestamp
   - uploadOrQueue(): tente upload, sinon queue
   - syncOfflineQueue(): traite la queue
3. Cree apps/pwa/src/stores/photoQueue.store.ts:
   - Interface QueuedPhoto
   - Fonctions: addToQueue, getQueue, removeFromQueue
   - Utilise IndexedDB via idb
4. Ajoute listener online pour trigger sync
5. Cree photo.service.spec.ts avec tests:
   - Test compression reduit la taille
   - Test queue ajoute/retire correctement
   - Test sync appelle upload pour chaque item

VALIDATION:
- pnpm test apps/pwa doit passer
- La compression fonctionne

Commit: git add -A && git commit -m 'feat(pwa): add photo service with compression and offline queue [FEAT-069-C]'
```

## Tests de validation

- [ ] Compression reduit une image > 3MB sous 2MB
- [ ] Geolocalisation recuperee
- [ ] Photo ajoutee a la queue offline
- [ ] Sync vide la queue quand online
