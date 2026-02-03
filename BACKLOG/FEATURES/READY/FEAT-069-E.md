# FEAT-069-E: Composant PhotoGallery et comparaison avant/apres

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** pwa, ux, ui
**Parent:** FEAT-069
**Date creation:** 2026-02-03

---

## Description

Creer le composant PhotoGallery pour afficher les photos d'une intervention avec vue grille, filtrage par type, et comparaison avant/apres cote-a-cote.

## Criteres d'acceptation

- [ ] Composant PhotoGallery cree
- [ ] Vue grille des photos
- [ ] Filtres par type (Avant/Pendant/Apres/Tous)
- [ ] Lightbox pour zoom sur photo
- [ ] Mode comparaison avant/apres (slider ou cote-a-cote)
- [ ] Affichage metadonnees (date, GPS)
- [ ] Suppression photo (avec confirmation)
- [ ] Tests du composant

## Fichiers concernes

- `apps/pwa/src/components/PhotoGallery.tsx` (nouveau)
- `apps/pwa/src/components/PhotoCompare.tsx` (nouveau)
- `apps/pwa/src/components/PhotoGallery.spec.tsx` (nouveau)
- `apps/pwa/src/pages/InterventionDetail.tsx` (modification)

## Analyse / Approche

```tsx
// PhotoGallery.tsx
interface PhotoGalleryProps {
  interventionId: string;
  photos: PhotoResponseDto[];
  onDelete?: (photoId: string) => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, onDelete }) => {
  const [filter, setFilter] = useState<PhotoType | 'ALL'>('ALL');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoResponseDto | null>(null);
  const [compareMode, setCompareMode] = useState(false);

  // Filtrage
  const filteredPhotos = filter === 'ALL'
    ? photos
    : photos.filter(p => p.type === filter);

  // Groupement pour comparaison
  const beforePhotos = photos.filter(p => p.type === 'BEFORE');
  const afterPhotos = photos.filter(p => p.type === 'AFTER');
};

// PhotoCompare.tsx
interface PhotoCompareProps {
  before: PhotoResponseDto;
  after: PhotoResponseDto;
}
// Slider interactif ou vue cote-a-cote
```

## SECTION AUTOMATISATION
**Score:** 85/100

### Prompt d'execution
```
Tu travailles sur le ticket FEAT-069-E: Composant PhotoGallery.

PRE-REQUIS: FEAT-069-B doit etre termine (API photos)

TACHES:
1. Cree apps/pwa/src/components/PhotoGallery.tsx avec:
   - Props: photos array, onDelete callback
   - Filtres: chips Tous/Avant/Pendant/Apres
   - Grille responsive (2 cols mobile, 3 cols tablet, 4 cols desktop)
   - Thumbnail cliquable -> lightbox
   - Badge type sur chaque photo
   - Bouton supprimer (avec dialog confirmation)
   - Bouton "Comparer avant/apres" si photos des 2 types
2. Cree apps/pwa/src/components/PhotoCompare.tsx:
   - Affichage cote-a-cote (mobile: vertical, desktop: horizontal)
   - Ou slider interactif (optionnel)
   - Affiche date de chaque photo
3. Integre dans InterventionDetail.tsx:
   - Fetch photos via API
   - Affiche PhotoGallery sous les infos intervention
4. Cree PhotoGallery.spec.tsx:
   - Test affichage grille
   - Test filtrage par type
   - Test mode comparaison

VALIDATION:
- Galerie affiche les photos
- Filtres fonctionnent
- Comparaison s'affiche

Commit: git add -A && git commit -m 'feat(pwa): add PhotoGallery with compare view [FEAT-069-E]'
```

## Tests de validation

- [ ] Galerie affiche photos en grille
- [ ] Filtres changent les photos affichees
- [ ] Lightbox zoom fonctionne
- [ ] Comparaison avant/apres visible
- [ ] Suppression fonctionne
