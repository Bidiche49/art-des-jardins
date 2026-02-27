# FEAT-126: Page /realisations/ dediee avec filtres et projets

**Type:** Feature
**Statut:** Fait
**Priorite:** Haute
**Complexite:** M
**Tags:** vitrine, seo, cro, ux
**Date creation:** 2026-02-27

---

## Description

La galerie de realisations est actuellement enfouie dans la homepage (max 8 images). Il n'existe pas de page `/realisations/` dediee, indexable, avec tous les projets et des filtres.

Une page dediee :
1. **SEO** : capture les recherches "realisations paysagiste angers", "exemples amenagement jardin"
2. **CRO** : convainc les visiteurs hesitants en montrant l'etendue du travail
3. **UX** : permet aux visiteurs de voir tous les projets sans noyer la homepage

### Structure proposee

```
/realisations/
├── Hero: "Nos realisations"
├── Filtres: Tout | Amenagement | Entretien | Elagage | Abattage | Terrasse
├── Galerie masonry (toutes les photos)
├── Before/After section
├── CTA: "Votre projet peut etre le prochain"
└── Lien Instagram
```

### SEO
- Title: "Realisations Paysagiste Angers - Avant/Apres | Art des Jardins"
- Description optimisee
- Schema ImageGallery ou CollectionPage
- BreadcrumbList

## User Story
**En tant que** visiteur
**Je veux** voir toutes les realisations du paysagiste
**Afin de** evaluer la qualite du travail avant de demander un devis

## Criteres d'acceptation
- [ ] Page /realisations/ accessible depuis la navigation
- [ ] Tous les projets affiches (pas seulement 8)
- [ ] Filtres par categorie fonctionnels
- [ ] Lightbox pour voir les photos en grand
- [ ] Before/After inclus
- [ ] CTA apres la galerie
- [ ] Metadata SEO complete
- [ ] Lien dans le menu header et footer
- [ ] Ajout dans le sitemap

## Fichiers concernes
- Nouveau : `apps/vitrine/src/app/realisations/page.tsx`
- `apps/vitrine/src/components/layout/Header.tsx` (nav)
- `apps/vitrine/src/components/layout/Footer.tsx` (nav)
- `apps/vitrine/src/app/sitemap.ts`
