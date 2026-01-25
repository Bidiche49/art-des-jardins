# FEAT-003: Site vitrine Next.js - Setup initial

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** M
**Tags:** vitrine, nextjs, seo
**Date creation:** 2025-01-25

---

## Description
Creer le site vitrine Next.js avec SSG pour SEO optimal.

## User Story
**En tant que** prospect
**Je veux** trouver l'entreprise sur Google
**Afin de** demander un devis

## Criteres d'acceptation
- [ ] Next.js 14+ avec App Router
- [ ] SSG active (static export)
- [ ] Tailwind CSS configure
- [ ] Structure pages SEO
- [ ] Composants de base (Header, Footer, Layout)
- [ ] Meta tags dynamiques
- [ ] Sitemap.xml genere

## Fichiers concernes
- `apps/vitrine/`

## Analyse / Approche
1. `npx create-next-app@latest vitrine`
2. Configurer pour export statique
3. Tailwind + design systeme
4. Pages: accueil, services, contact
5. Schema.org LocalBusiness

## Tests de validation
- [ ] `pnpm dev:vitrine` fonctionne
- [ ] Build statique genere
- [ ] Lighthouse SEO > 90
- [ ] Core Web Vitals verts
