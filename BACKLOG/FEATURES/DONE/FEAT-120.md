# FEAT-120: Schema AggregateOffer avec fourchettes de prix

**Type:** Feature
**Statut:** Fait
**Priorite:** Basse
**Complexite:** S
**Tags:** seo, vitrine, schema
**Date creation:** 2026-02-13

---

## Description

Ajouter un schema `AggregateOffer` sur les pages services pour afficher des fourchettes de prix dans les resultats Google. Les rich snippets avec prix attirent plus de clics et aident Google a comprendre le positionnement tarifaire de l'entreprise.

## User Story

**En tant que** moteur de recherche
**Je veux** connaitre les fourchettes de prix des services
**Afin de** afficher des rich snippets informatifs dans les SERP

## Fichiers concernes

- `apps/vitrine/src/lib/services-data.ts` - Ajouter les fourchettes de prix
- `apps/vitrine/src/app/services/[slug]/page.tsx` - Ajouter le schema

## Approche

### 1. Ajouter les prix dans services-data.ts
```typescript
interface ServiceData {
  // ... champs existants
  priceRange?: {
    low: number;
    high: number;
    unit: string; // 'forfait', 'm2', 'arbre', 'heure'
  };
}
```

Fourchettes indicatives :
- **Amenagement** : 50 - 150 €/m2
- **Entretien** : 30 - 60 €/heure (ou 150 - 400€/mois en contrat)
- **Elagage** : 100 - 800 €/arbre
- **Abattage** : 300 - 2000 €/arbre

### 2. Schema AggregateOffer
```typescript
{
  '@type': 'AggregateOffer',
  priceCurrency: 'EUR',
  lowPrice: service.priceRange.low,
  highPrice: service.priceRange.high,
  offerCount: 1,
}
```

### 3. Affichage visible
Ajouter une section "Tarifs indicatifs" sur chaque page service avec disclaimer :
> "Les prix varient selon la surface, la complexite et l'acces. Devis gratuit et personnalise."

**Pre-requis** : Valider les fourchettes de prix avec le client.

## Criteres d'acceptation

- [ ] Fourchettes de prix definies pour chaque service
- [ ] Schema AggregateOffer ajoute sur les pages services
- [ ] Section tarifs indicatifs visible
- [ ] Disclaimer "prix indicatifs, devis gratuit"
- [ ] Schema valide sur Rich Results Test

## Tests de validation

- [ ] Rich Results Test affiche les prix
- [ ] Schema validator sans erreur
- [ ] Prix affiches correctement sur les pages
