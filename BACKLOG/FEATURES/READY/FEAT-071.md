# FEAT-071: Calcul rentabilite chantier

**Type:** Feature
**Statut:** Pret
**Priorite:** Haute
**Complexite:** M
**Tags:** api, data, ux
**Date creation:** 2026-02-03
**Phase:** 15

---

## Description

Calculer et afficher la rentabilite de chaque chantier en comparant le devis (prevu) aux couts reels (heures, materiaux).

## User Story

**En tant que** patron
**Je veux** voir la rentabilite de chaque chantier
**Afin de** identifier les chantiers rentables et ajuster mes prix

## Contexte

Sans suivi de rentabilite, on ne sait pas si un chantier a ete profitable. Il faut comparer:
- **Prevu (devis)**: prix de vente HT
- **Reel**: heures x taux horaire + materiaux + frais

Marge = Prevu - Reel

## Criteres d'acceptation

- [ ] Saisie heures par employe par intervention
- [ ] Taux horaire par employe (cout entreprise, pas salaire)
- [ ] Saisie materiaux utilises (optionnel)
- [ ] Calcul automatique cout reel
- [ ] Affichage marge brute et %
- [ ] Alerte si marge < seuil configurable
- [ ] Rapport rentabilite par periode
- [ ] Comparaison devis similaires

## Fichiers concernes

- `packages/database/prisma/schema.prisma` (TimeEntry, Material)
- `apps/api/src/modules/rentabilite/` (nouveau)
- `apps/pwa/src/pages/chantiers/[id]/rentabilite.tsx` (nouveau)
- `apps/pwa/src/components/RentabiliteCard.tsx` (nouveau)

## Analyse / Approche

```prisma
model TimeEntry {
  id              String   @id @default(uuid())
  interventionId  String
  intervention    Intervention @relation(...)
  userId          String
  user            User     @relation(...)
  hours           Decimal
  date            DateTime
  description     String?
  createdAt       DateTime @default(now())
}

model MaterialUsage {
  id              String   @id @default(uuid())
  chantierId      String
  chantier        Chantier @relation(...)
  name            String
  quantity        Decimal
  unitCost        Decimal
  totalCost       Decimal
  createdAt       DateTime @default(now())
}
```

Calcul rentabilite:
```typescript
interface Rentabilite {
  chantierId: string;
  prevu: {
    montantHT: number;
    heuresEstimees: number;
  };
  reel: {
    heures: number;
    coutHeures: number; // heures x taux horaire
    coutMateriaux: number;
    coutTotal: number;
  };
  marge: {
    montant: number; // prevu - reel
    pourcentage: number; // (marge / prevu) * 100
  };
  status: 'profitable' | 'limite' | 'perte';
}
```

Seuils par defaut:
- Profitable: marge > 30%
- Limite: 15% < marge < 30%
- Perte: marge < 15%

## Tests de validation

- [ ] Saisie heures fonctionne
- [ ] Calcul cout reel correct
- [ ] Marge calculee correctement
- [ ] Alerte si marge faible
- [ ] Rapport par periode
