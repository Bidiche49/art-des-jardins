# FEAT-115: Section avant/apres par service avec slider

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** M
**Tags:** vitrine, ui, conversion, seo
**Date creation:** 2026-02-13

---

## Description

Rien ne convainc mieux un prospect que de voir le resultat concret du travail. Une section "Avant / Apres" avec un slider interactif (curseur glissant entre les deux images) est un element de conversion tres puissant pour un paysagiste. C'est souvent le facteur decisif dans le choix d'un prestataire.

## User Story

**En tant que** prospect hesitant
**Je veux** voir des exemples concrets de transformations
**Afin de** me projeter et etre convaincu de la qualite du travail

## Fichiers concernes

- Nouveau : `apps/vitrine/src/components/ui/BeforeAfterSlider.tsx`
- `apps/vitrine/src/app/page.tsx` - Ajouter section sur la homepage
- `apps/vitrine/src/app/paysagiste-angers/page.tsx` - Ajouter section
- `apps/vitrine/src/app/services/[slug]/page.tsx` - Ajouter section par service

## Approche

### Composant BeforeAfterSlider
Un composant qui affiche deux images superposees avec un curseur horizontal deplacable :
- Image "avant" a gauche
- Image "apres" a droite
- Curseur central glissant (drag ou click)
- Labels "Avant" / "Apres"
- Fonctionne au touch sur mobile

```tsx
interface BeforeAfterSliderProps {
  before: { src: string; alt: string };
  after: { src: string; alt: string };
  title?: string;
  location?: string;
}
```

### Implementation
- Pas de librairie externe (garder le bundle leger)
- Utiliser `onMouseMove` / `onTouchMove` pour deplacer le clip-path
- CSS `clip-path: inset(0 50% 0 0)` pour reveler/cacher
- Animation fluide

### Donnees
Ajouter dans images-manifest ou un fichier dedie :
```typescript
export const beforeAfterProjects = [
  {
    title: 'Creation de jardin',
    location: 'Angers - Quartier Roseraie',
    before: { src: '/images/avant-apres/jardin-1-avant.webp', alt: 'Terrain nu avant amenagement' },
    after: { src: '/images/avant-apres/jardin-1-apres.webp', alt: 'Jardin amenage avec terrasse et massifs' },
    service: 'paysagisme',
  },
  // ...
];
```

**Pre-requis** : Obtenir des photos avant/apres reelles de chantiers.

## Criteres d'acceptation

- [ ] Composant slider fonctionnel (desktop + mobile touch)
- [ ] Section visible sur la homepage
- [ ] Au moins 3 projets avant/apres
- [ ] Labels "Avant" / "Apres" visibles
- [ ] Alt text descriptifs sur les images
- [ ] Responsive et performant
- [ ] Pas de librairie externe lourde

## Tests de validation

- [ ] Test du slider sur desktop (souris)
- [ ] Test du slider sur mobile (touch)
- [ ] Performance : pas de lag au deplacement
- [ ] Accessibilite : navigable au clavier
