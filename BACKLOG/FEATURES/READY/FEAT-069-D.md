# FEAT-069-D: Composant PhotoCapture pour intervention

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** pwa, ux, ui, mobile
**Parent:** FEAT-069
**Date creation:** 2026-02-03

---

## Description

Creer le composant React PhotoCapture permettant de prendre des photos depuis la page intervention avec selection du type (avant/pendant/apres) et preview avant upload.

## Criteres d'acceptation

- [ ] Composant PhotoCapture cree
- [ ] Bouton capture photo dans page intervention
- [ ] Selection type: Avant / Pendant / Apres
- [ ] Preview de la photo avant confirmation
- [ ] Indicateur geolocalisation
- [ ] Feedback upload (progress, succes, erreur)
- [ ] Integration avec PhotoService
- [ ] Tests du composant

## Fichiers concernes

- `apps/pwa/src/components/PhotoCapture.tsx` (nouveau)
- `apps/pwa/src/components/PhotoCapture.spec.tsx` (nouveau)
- `apps/pwa/src/pages/InterventionDetail.tsx` (modification)

## Analyse / Approche

```tsx
// PhotoCapture.tsx
interface PhotoCaptureProps {
  interventionId: string;
  onPhotoTaken: (photo: PhotoData) => void;
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({ interventionId, onPhotoTaken }) => {
  const [selectedType, setSelectedType] = useState<PhotoType>('BEFORE');
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [geoStatus, setGeoStatus] = useState<'pending' | 'success' | 'denied'>('pending');

  // Input file avec capture="environment" pour camera arriere
  // Preview avec option annuler/confirmer
  // Progress bar pendant upload
};
```

UI:
1. Bouton "Prendre une photo"
2. Modal/Sheet avec:
   - Selecteur type (chips: Avant | Pendant | Apres)
   - Input file camera
   - Preview image
   - Indicateur GPS
   - Boutons Annuler / Confirmer

## SECTION AUTOMATISATION
**Score:** 85/100

### Prompt d'execution
```
Tu travailles sur le ticket FEAT-069-D: Composant PhotoCapture.

PRE-REQUIS: FEAT-069-C doit etre termine (PhotoService existe)

TACHES:
1. Cree apps/pwa/src/components/PhotoCapture.tsx avec:
   - Props: interventionId, onPhotoTaken callback
   - State: selectedType, preview, isUploading, geoStatus
   - Input type="file" accept="image/*" capture="environment"
   - Selecteur type avec 3 chips (Avant/Pendant/Apres)
   - Preview de l'image capturee
   - Indicateur GPS (icon check/warning)
   - Boutons Annuler et Confirmer
   - Progress bar pendant upload
   - Utilise PhotoService.capturePhoto() et uploadOrQueue()
2. Style avec Tailwind (responsive, mobile-first)
3. Integre le composant dans InterventionDetail.tsx:
   - Ajoute bouton "Ajouter photo"
   - Ouvre PhotoCapture dans un modal/drawer
   - Rafraichit la liste photos apres upload
4. Cree PhotoCapture.spec.tsx:
   - Test render du composant
   - Test selection de type
   - Test preview apres selection fichier

VALIDATION:
- Composant s'affiche sur page intervention
- Capture photo fonctionne
- Tests passent

Commit: git add -A && git commit -m 'feat(pwa): add PhotoCapture component with preview [FEAT-069-D]'
```

## Tests de validation

- [ ] Bouton photo visible sur intervention
- [ ] Selection type fonctionne
- [ ] Preview s'affiche
- [ ] Upload avec progress
- [ ] Feedback succes/erreur
