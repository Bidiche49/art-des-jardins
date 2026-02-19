# FEAT-113: Blog / Conseils SEO pour capturer la longue traine

**Type:** Feature
**Statut:** Fait
**Priorite:** Haute
**Complexite:** L
**Tags:** seo, vitrine, contenu
**Date creation:** 2026-02-13

---

## Description

Le site ne capture aucun trafic **informationnel** (requetes de type "comment", "quand", "prix", "quel"). Ce trafic represente 60-80% des recherches et constitue le haut du tunnel de conversion. Un blog avec des articles optimises SEO permettrait de :
- Attirer du trafic qualifie
- Demontrer l'expertise (E-E-A-T)
- Generer des backlinks naturels
- Creer du contenu frais (signal de fraicheur Google)

## User Story

**En tant que** proprietaire cherchant des conseils jardin
**Je veux** trouver des articles de qualite sur l'entretien de jardin
**Afin de** faire confiance a l'entreprise et eventuellement demander un devis

## Fichiers concernes

- Nouveau : `apps/vitrine/src/app/conseils/page.tsx` - Page listing des articles
- Nouveau : `apps/vitrine/src/app/conseils/[slug]/page.tsx` - Page article
- Nouveau : `apps/vitrine/src/lib/blog-data.ts` - Donnees des articles
- `apps/vitrine/src/app/sitemap.ts` - Ajouter les articles
- `apps/vitrine/src/components/layout/Header.tsx` - Ajouter "Conseils" dans la nav

## Approche

### Architecture
- Route : `/conseils/` pour le listing, `/conseils/[slug]/` pour les articles
- Donnees statiques dans `blog-data.ts` (pas de CMS, coherent avec l'approche SSG)
- Articles en contenu TypeScript (comme services-data.ts)

### Structure d'un article
```typescript
interface BlogArticle {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  content: string; // Markdown ou HTML
  category: 'entretien' | 'amenagement' | 'elagage' | 'abattage' | 'conseils';
  publishedAt: string;
  updatedAt?: string;
  readTime: number; // minutes
  tags: string[];
}
```

### Articles prioritaires (mots-cles a cibler)

| Article | Mot-cle cible | Volume estime |
|---------|---------------|---------------|
| "Quand elaguer ses arbres ? Guide complet par espece" | quand elaguer | Moyen |
| "Prix paysagiste : combien coute un amenagement de jardin ?" | prix paysagiste | Fort |
| "Entretien de jardin : le calendrier mois par mois" | entretien jardin calendrier | Moyen |
| "Taille de haie : quand et comment tailler ?" | taille haie quand | Fort |
| "Abattage d'arbre : reglementation et autorisation" | abattage arbre autorisation | Moyen |
| "Comment creer un jardin sans entretien ?" | jardin sans entretien | Fort |
| "Pelouse abimee : comment refaire son gazon ?" | refaire pelouse | Moyen |
| "Credit d'impot jardinage : tout savoir en 2026" | credit impot jardinage | Fort |
| "Les meilleurs arbres pour un jardin angevin" | arbre jardin angers | Faible |
| "Quel budget pour l'entretien annuel d'un jardin ?" | budget entretien jardin | Moyen |

### Schema markup
- `Article` schema sur chaque article
- `BreadcrumbList` (Accueil > Conseils > Article)
- `FAQPage` si l'article contient des questions/reponses

### Rythme recommande
- Lancement avec 5 articles fondamentaux
- Puis 2 articles/mois

## Criteres d'acceptation

- [ ] Page `/conseils/` avec listing des articles
- [ ] Pages `/conseils/[slug]/` avec contenu complet
- [ ] Minimum 5 articles au lancement
- [ ] Meta title et description optimises par article
- [ ] Schema Article sur chaque page
- [ ] Lien "Conseils" dans la navigation
- [ ] Articles ajoutes au sitemap
- [ ] CTA devis en fin de chaque article
- [ ] Temps de lecture affiche
- [ ] Design responsive et agreable a lire

## Tests de validation

- [ ] Navigation complete du blog
- [ ] Build production reussit avec tous les articles
- [ ] Schemas valides
- [ ] Sitemap inclut les articles
