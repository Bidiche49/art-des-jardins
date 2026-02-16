# FEAT-121: Widget avis Google (Google Places API)

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** vitrine, seo, conversion, ux
**Date creation:** 2026-02-16

---

## Description

Afficher les vrais avis Google sur la homepage et la page contact, avec la note globale et un lien vers la fiche Google Business. Remplace la section de faux temoignages qui a ete supprimee (risque penalite Google + pratique commerciale trompeuse).

## Pre-requis

- Fiche Google Business Profile creee et verifiee pour "Art des Jardins"
- Quelques vrais avis clients sur Google (minimum 3-5)
- Cle API Google Places (gratuit dans les quotas normaux)

## User Story

**En tant que** visiteur du site
**Je veux** voir les vrais avis Google des clients precedents
**Afin de** etre rassure par des temoignages verifiables avant de demander un devis

## Approche

### Option A - Google Places API (recommande)

1. Creer une cle API Google Cloud (Places API)
2. Composant serveur Next.js qui fetch les avis (ISR, revalidation 24h)
3. Afficher : note globale, nombre d'avis, 3-6 derniers avis
4. Badge "Avis Google" avec lien vers la fiche
5. Schema.org AggregateRating avec les vraies donnees

```tsx
// Composant GoogleReviews
- Fetch server-side via Places API (pas d'exposition cle cote client)
- Cache ISR 24h (revalidate: 86400)
- Fallback si API indisponible : lien vers fiche Google
- Badge "Voir tous les avis sur Google" en bas
```

### Option B - Widget tiers (fallback)

Si la complexite API est trop importante :
- Elfsight Google Reviews widget (gratuit jusqu'a 200 vues/mois)
- Widget embed simple, pas de maintenance

### Schema.org

```json
{
  "@type": "AggregateRating",
  "ratingValue": "4.8",
  "reviewCount": "23",
  "bestRating": "5"
}
```

Uniquement avec les VRAIES donnees Google, jamais de valeurs inventees.

## Fichiers concernes

- Nouveau : `apps/vitrine/src/components/GoogleReviews.tsx`
- `apps/vitrine/src/app/page.tsx` - Integrer le composant
- `apps/vitrine/src/app/contact/page.tsx` - Optionnel, note globale dans sidebar
- `.env.local` - GOOGLE_PLACES_API_KEY

## Criteres d'acceptation

- [ ] Avis affiches sont les vrais avis Google (pas inventes)
- [ ] Note globale correspond a la vraie note Google
- [ ] Lien vers la fiche Google Business
- [ ] Schema AggregateRating avec donnees reelles
- [ ] Cle API non exposee cote client (server-side only)
- [ ] Fallback propre si l'API est indisponible
- [ ] Cache ISR pour ne pas appeler l'API a chaque visite

## Tests de validation

- [ ] Verifier que les avis correspondent a ceux sur Google
- [ ] Verifier le schema sur schema.org validator
- [ ] Tester le fallback en coupant la cle API
- [ ] Verifier que la cle n'apparait pas dans le JS client
