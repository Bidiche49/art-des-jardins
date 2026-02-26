# FEAT-124: Section "Nos chantiers en action" sur le site vitrine

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** M
**Tags:** vitrine, seo, ux, images, conversion
**Date creation:** 2026-02-26
**Bloque par:** IMP-054 (renommage images)

---

## Description

Creer une section dediee aux photos de chantier en cours (equipes au travail, materiels, jardins "avant" intervention). Objectif : montrer le savoir-faire en action sans melanger avec les realisations finies, qui restent le premier argument visuel.

### Pourquoi c'est important (SEO + UX)

**SEO:**
- Contenu unique supplementaire = meilleur crawl
- Alt text cibles ("elagueur professionnel Angers", "chantier elagage arbre Angers")
- Schema.org ImageGallery enrichi
- Potentiel keywords longue traine : "equipe elagage Angers", "chantier paysagiste Angers"

**UX / Conversion:**
- Photos action avec EPI = confiance securite (argument massue pour elagage/abattage)
- Humanise l'entreprise (on voit les equipes, pas juste des jardins vides)
- Photos "avant" montrent les problemes que les prospects reconnaissent chez eux = identification
- Differenciation concurrence (la plupart ne montrent que les resultats)

**Separation realisations / chantier:**
- Les realisations = portfolio "resultat parfait" -> premiere impression
- Les chantiers = credibilite "on sait faire" -> deuxieme couche de confiance
- Un prospect ne doit JAMAIS tomber d'abord sur un jardin en friche

## Photos disponibles (8)

### En action (5)
| Photo | Contenu | Impact UX |
|-------|---------|-----------|
| Chantier_elagage_1 | Elagueur tronconneuse sur nacelle, EPI complet, vue panoramique | Professionnalisme, securite |
| Chantier_elagage_2 | Grimpeur-elagueur dans l'arbre, harnais | Expertise technique |
| Chantier_elagage_3 | Elagueur perche en haut d'un arbre | Competence hauteur |
| Chantier_elagage_4 | Camion benne + intervention en cours | Moyens materiels |
| Chantier_creation_1 | Mini-pelle sur terrain, chateau en arriere-plan | Gros chantier, prestige |

> **ATTENTION:** Chantier_elagage_4 montre un vehicule avec logo "KB" (prestataire/loueur?). A confirmer avec le client si on garde cette photo ou non.

### Avant intervention (3)
| Photo | Contenu | Impact UX |
|-------|---------|-----------|
| Chantier_avant_1 | Jardin completement envahi de vegetation | "Vous reconnaissez votre jardin?" |
| Chantier_avant_2 | Jardin desordonne avec allee paves | Identification prospect |
| Chantier_avant_3 | Jardin avec cabanon, haie envahie, pelouse seche | Identification prospect |

> **Note:** Pas de vraies paires avant/apres pour le moment. Ces photos "avant" seront affichees seules avec un texte invitant a imaginer la transformation. Quand de vrais "apres" seront disponibles, on pourra enrichir le BeforeAfterSection existant.

## User Story

**En tant que** visiteur du site (prospect)
**Je veux** voir les equipes au travail et des exemples de jardins avant intervention
**Afin de** me rassurer sur le professionnalisme et m'identifier a des situations similaires

## Approche technique

### 1. Pipeline images
- Ajouter les 8 photos au IMAGE_CATALOG avec category "chantier"
- Sous-categories via tags: ["action", "elagage"] ou ["avant", "debroussaillage"]
- Alt text SEO geo-localises

### 2. Composant ChantierGallery
- Section distincte de PhotoGallery (pas le meme composant pour eviter melange)
- Layout adapte : grille 2 ou 3 colonnes
- Photos "en action" mises en avant avec overlay texte court ("Elagage securise", "Debut de chantier")
- Photos "avant" avec badge "Avant intervention" et CTA "Imaginez la transformation"
- Lightbox navigation comme PhotoGallery existante
- Lazy loading + blur placeholder (comme le reste du site)

### 3. Integration pages
- **Page elagage-angers**: section "Notre equipe en action" avec les 4 photos elagage (argument securite fort)
- **Page paysagiste-angers**: Chantier_creation_1 (mini-pelle) + photos "avant"
- **Page abattage-angers**: reutiliser photos elagage action (elagueur nacelle pertinent)
- **Homepage**: possibilite d'un bandeau "Nos equipes sur le terrain" avec 3-4 photos selectionnees

### 4. SEO
- Schema.org ImageGallery pour la section
- Alt text: "Elagueur professionnel en securite a Angers", "Chantier amenagement paysager Angers"
- Heading structure: h2 "Nos equipes en action" (ou equivalent)

## Criteres d'acceptation
- [ ] 8 photos chantier dans le pipeline (category "chantier")
- [ ] Section visuellement distincte des realisations
- [ ] Photos "avant" clairement identifiees (badge/overlay)
- [ ] Integration page elagage-angers (prioritaire - argument securite)
- [ ] Integration page paysagiste-angers
- [ ] Responsive mobile impeccable
- [ ] Schema.org ImageGallery
- [ ] Alt text SEO geo-localises
- [ ] Aucune regression Lighthouse (perf, SEO, a11y)
- [ ] CTA vers devis apres la section

## Fichiers concernes
- `apps/vitrine/scripts/optimize-images.mjs` (ajout chantier au catalogue)
- `apps/vitrine/src/components/ui/ChantierGallery.tsx` (nouveau composant)
- `apps/vitrine/src/app/elagage-angers/page.tsx`
- `apps/vitrine/src/app/paysagiste-angers/page.tsx`
- `apps/vitrine/src/app/abattage-angers/page.tsx`
- `apps/vitrine/src/app/page.tsx` (homepage, optionnel)
- `apps/vitrine/src/lib/images-manifest.ts` (auto-genere)

## Tests de validation
- [ ] Build reussi
- [ ] Variantes webp generees pour les 8 photos
- [ ] Section chantier visible sur elagage-angers et paysagiste-angers
- [ ] Lightbox fonctionne
- [ ] Mobile : grille 1 col, images bien recadrees
- [ ] Lighthouse SEO >= 95, Performance >= 90
- [ ] Pas de melange chantier/realisations dans la galerie principale
