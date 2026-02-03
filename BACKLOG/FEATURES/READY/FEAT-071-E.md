# FEAT-071-E: Interface PWA rentabilite chantier

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** ui, ux
**Date creation:** 2026-02-03
**Parent:** FEAT-071
**Depend de:** FEAT-071-D

---

## Description

Creer l'interface PWA pour afficher la rentabilite d'un chantier : composant RentabiliteCard, page de detail rentabilite, et indicateurs visuels (couleurs selon status).

## Scope limite

- Composant RentabiliteCard (resume)
- Page /chantiers/:id/rentabilite (detail)
- Indicateurs visuels couleur selon status
- Integration avec l'API FEAT-071-D
- Pas de saisie heures/materiaux (autres tickets)

## Criteres d'acceptation

- [ ] RentabiliteCard affiche marge et pourcentage
- [ ] Couleurs: vert (profitable), orange (limite), rouge (perte)
- [ ] Page detail avec breakdown complet
- [ ] Affichage prevu vs reel
- [ ] Liste heures par employe
- [ ] Liste materiaux avec couts
- [ ] Responsive mobile
- [ ] Tests composants

## Fichiers concernes

- `apps/pwa/src/components/rentabilite/RentabiliteCard.tsx` (nouveau)
- `apps/pwa/src/components/rentabilite/RentabiliteDetail.tsx` (nouveau)
- `apps/pwa/src/pages/chantiers/[id]/rentabilite.tsx` (nouveau)
- `apps/pwa/src/hooks/useRentabilite.ts` (nouveau)
- `apps/pwa/src/services/rentabilite.service.ts` (nouveau)

## Analyse technique

```typescript
// RentabiliteCard.tsx
interface RentabiliteCardProps {
  chantierId: string;
  compact?: boolean;
}

const STATUS_COLORS = {
  profitable: 'bg-green-100 text-green-800 border-green-300',
  limite: 'bg-orange-100 text-orange-800 border-orange-300',
  perte: 'bg-red-100 text-red-800 border-red-300',
};

// Affichage compact pour liste chantiers
// - Marge: 2 500 EUR (32%)
// - Badge couleur selon status

// Page detail /chantiers/[id]/rentabilite
// - Section Prevu (devis)
// - Section Reel (heures + materiaux)
// - Barre visuelle comparaison
// - Liste detaillee heures par employe
// - Liste detaillee materiaux
```

## SECTION AUTOMATISATION

**Score:** 80/100
**Automatisable:** OUI

### Raison du score
- Composants React patterns connus
- Design system existant dans le projet
- API bien definie (FEAT-071-D)

### Prompt d'execution

```
TICKET: FEAT-071-E - Interface PWA rentabilite

PREREQUIS: FEAT-071-D doit etre termine (API rentabilite)

MISSION: Creer l'interface PWA pour afficher la rentabilite

ETAPES:
1. Lire les composants existants pour comprendre le design system
2. Creer apps/pwa/src/services/rentabilite.service.ts:
   - getRentabilite(chantierId): Promise<RentabiliteDto>
3. Creer apps/pwa/src/hooks/useRentabilite.ts:
   - Hook React Query pour fetch rentabilite
4. Creer apps/pwa/src/components/rentabilite/RentabiliteCard.tsx:
   - Props: chantierId, compact?
   - Affiche marge (montant + %)
   - Badge couleur selon status (vert/orange/rouge)
   - Lien vers page detail
5. Creer apps/pwa/src/components/rentabilite/RentabiliteDetail.tsx:
   - Section Prevu: montant devis HT
   - Section Reel: cout heures + cout materiaux
   - Barre de progression visuelle
   - Tableau heures par employe
   - Tableau materiaux
6. Creer apps/pwa/src/pages/chantiers/[id]/rentabilite.tsx:
   - Page utilisant RentabiliteDetail
   - Breadcrumb retour chantier
7. Ecrire tests: RentabiliteCard.test.tsx
8. Executer: pnpm --filter @art-et-jardin/pwa test

COULEURS STATUS:
- profitable (>30%): vert (green-500)
- limite (15-30%): orange (orange-500)
- perte (<15%): rouge (red-500)

VALIDATION:
- Composants s'affichent sans erreur
- Couleurs correctes selon status
- Tests passent
```

### Criteres de succes automatises

- [ ] `pnpm --filter @art-et-jardin/pwa test` passe
- [ ] `pnpm --filter @art-et-jardin/pwa build` sans erreur
- [ ] Composants RentabiliteCard et RentabiliteDetail exportes

## Tests de validation

- [ ] RentabiliteCard affiche la marge formatee
- [ ] Couleur verte si status = profitable
- [ ] Couleur orange si status = limite
- [ ] Couleur rouge si status = perte
- [ ] Page detail affiche breakdown complet
- [ ] Responsive sur mobile (320px)
- [ ] Loading state pendant fetch
- [ ] Error state si API echoue
