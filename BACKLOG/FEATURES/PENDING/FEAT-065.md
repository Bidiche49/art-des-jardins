# FEAT-065: Onboarding utilisateur guide

**Type:** Feature
**Statut:** A faire
**Priorite:** Moyenne
**Complexite:** M
**Tags:** ux, pwa
**Date creation:** 2026-02-03
**Phase:** 14
**Automatisable:** NON

---

## ⚠️ NON AUTOMATISABLE - DECISIONS HUMAINES REQUISES ⚠️

> **Contenu et parcours utilisateur a definir**
>
> L'onboarding necessite des decisions humaines sur:
> - Le contenu des textes explicatifs
> - L'ordre des etapes du parcours
> - Les elements a mettre en avant par role
> - Le ton et la pedagogie
>
> **Action requise:**
> - Definir le parcours onboarding avec le client/metier
> - Rediger les textes de chaque etape
> - Valider l'ordre et la pertinence avec des utilisateurs test

---

## Description

Creer un tutoriel interactif guide pour les nouveaux utilisateurs avec des etapes contextuelles.

## User Story

**En tant que** nouvel utilisateur
**Je veux** etre guide lors de ma premiere utilisation
**Afin de** comprendre rapidement comment utiliser l'application

## Contexte

Sans onboarding, les utilisateurs:
- Ne decouvrent pas toutes les fonctionnalites
- Font des erreurs evitables
- Abandonnent par frustration

Un onboarding bien fait augmente l'adoption et reduit le support.

## Criteres d'acceptation

- [ ] Detection premier login (flag en BDD)
- [ ] Tour guide avec spotlight sur elements
- [ ] Etapes contextuelles par role:
  - Patron: tableau de bord, clients, devis, factures
  - Employe: calendrier, interventions, photos
- [ ] Progression sauvegardee (reprendre ou passer)
- [ ] Bouton "Refaire le tour" dans parametres
- [ ] Animations fluides (pas intrusif)
- [ ] Version simplifiee sur mobile

## Fichiers concernes

- `apps/pwa/src/components/Onboarding/` (nouveau dossier)
- `apps/pwa/src/hooks/useOnboarding.ts` (nouveau)
- `packages/database/prisma/schema.prisma` (flag onboardingCompleted)

## Analyse / Approche

Utiliser une lib comme `react-joyride` ou `driver.js` pour le tour guide.

```typescript
const steps: Step[] = [
  {
    target: '.dashboard-stats',
    content: 'Voici votre tableau de bord avec les indicateurs cles',
    placement: 'bottom',
  },
  {
    target: '.nav-clients',
    content: 'Gerez vos clients ici. Commencez par en creer un!',
    placement: 'right',
  },
  {
    target: '.quick-actions',
    content: 'Actions rapides: nouveau devis, nouvelle intervention...',
    placement: 'bottom',
  },
];

// Etapes par role
const stepsByRole = {
  patron: [...commonSteps, ...patronSteps],
  employe: [...commonSteps, ...employeSteps],
  client: clientPortalSteps,
};
```

## Tests de validation

- [ ] Tour demarre au premier login
- [ ] Spotlight sur les bons elements
- [ ] Skip sauvegarde la progression
- [ ] "Refaire le tour" fonctionne
- [ ] Etapes differentes par role
