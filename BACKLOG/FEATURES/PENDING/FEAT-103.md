# FEAT-103: Ajouter favicon et og-image vitrine

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** XS
**Tags:** vitrine, seo, ui
**Date creation:** 2026-02-12

---

## Description

La vitrine Next.js n'a pas encore de favicon ni d'image Open Graph personnalisees. Ces assets sont indispensables pour le branding (onglet navigateur, partage reseaux sociaux, apercu Google).

## User Story

**En tant que** visiteur du site Art des Jardins
**Je veux** voir un favicon professionnel dans l'onglet et une belle image d'apercu quand le site est partage
**Afin de** reconnaitre la marque et avoir confiance dans le professionnalisme de l'entreprise

## Criteres d'acceptation

- [ ] Favicon genere en multi-tailles (16x16, 32x32, 180x180 apple-touch-icon, 192x192, 512x512)
- [ ] Fichier `favicon.ico` present dans `apps/vitrine/public/`
- [ ] Fichier `apple-touch-icon.png` (180x180) dans `apps/vitrine/public/`
- [ ] Fichier `og-image.jpg` (1200x630 min) dans `apps/vitrine/public/`
- [ ] Meta tags Open Graph references dans `apps/vitrine/src/app/layout.tsx`
- [ ] Tester l'apercu avec https://www.opengraph.xyz/ apres deploiement
- [ ] Build Next.js passe sans erreur

## Fichiers concernes

- `apps/vitrine/public/favicon.ico`
- `apps/vitrine/public/apple-touch-icon.png`
- `apps/vitrine/public/og-image.jpg`
- `apps/vitrine/src/app/layout.tsx` (meta tags icons/og)

## Analyse / Approche

### Option A : Logo existant
Si Art des Jardins a un logo, l'utiliser pour generer le favicon avec https://realfavicongenerator.net/

### Option B : Generer un logo temporaire
Creer un logo minimaliste (initiale "AJ" ou pictogramme feuille/arbre) en SVG puis generer les tailles.

### Pour og-image.jpg
- Idealement : photo reelle d'un chantier (smartphone OK, bonne lumiere)
- Temporaire : image stock libre de droits (Unsplash) d'un jardin paysage + texte "Art des Jardins - Paysagiste Angers"
- Format : 1200x630px, JPEG optimise < 200KB

## Tests de validation

- [ ] `ls apps/vitrine/public/favicon.ico` existe
- [ ] `ls apps/vitrine/public/og-image.jpg` existe
- [ ] Build vitrine OK : `cd apps/vitrine && pnpm build`
- [ ] Inspecter la page dans le navigateur : favicon visible dans l'onglet
- [ ] Partager l'URL sur un reseau social ou tester avec opengraph.xyz
