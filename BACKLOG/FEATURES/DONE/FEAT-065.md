# FEAT-065: Onboarding utilisateur guide

**Type:** Feature
**Statut:** Fait
**Priorite:** Moyenne
**Complexite:** M
**Tags:** ux, pwa
**Date creation:** 2026-02-03
**Date completion:** 2026-02-04
**Phase:** 14

---

## Description

Creer un tutoriel interactif guide pour les nouveaux utilisateurs avec des etapes contextuelles.

## User Story

**En tant que** nouvel utilisateur
**Je veux** etre guide lors de ma premiere utilisation
**Afin de** comprendre rapidement comment utiliser l'application

## Implementation realisee

### Backend (API NestJS)

**Fichiers modifies:**
- `packages/database/prisma/schema.prisma` - Ajout champs User: onboardingCompleted, onboardingStep
- `packages/database/prisma/migrations/20260204180000_add_onboarding_fields/` - Migration
- `apps/api/src/modules/auth/auth.service.ts` - Methodes updateOnboardingStep, completeOnboarding, resetOnboarding
- `apps/api/src/modules/auth/auth.controller.ts` - Endpoints PATCH /auth/onboarding/step, /complete, POST /reset

**Endpoints API:**
- `PATCH /auth/onboarding/step` - Mettre a jour l'etape
- `PATCH /auth/onboarding/complete` - Marquer onboarding termine
- `POST /auth/onboarding/reset` - Reinitialiser (refaire le tour)

### Frontend (PWA React)

**Fichiers crees:**
- `apps/pwa/src/hooks/useOnboarding.ts` - Hook custom avec etapes par role
- `apps/pwa/src/components/Onboarding/OnboardingTour.tsx` - Composant tour avec spotlight CSS
- `apps/pwa/src/components/Onboarding/index.ts` - Export

**Fichiers modifies:**
- `apps/pwa/src/stores/auth.ts` - Ajout champs onboardingCompleted/Step + methode updateOnboarding
- `apps/pwa/src/components/layout/Layout.tsx` - Integration OnboardingTour + data-nav attributes
- `apps/pwa/src/pages/Dashboard.tsx` - Classes CSS pour spotlight (dashboard-stats, quick-actions)
- `apps/pwa/src/pages/Settings.tsx` - Bouton "Refaire le tour guide"
- `apps/pwa/src/index.css` - Animation fade-in
- `apps/pwa/src/hooks/index.ts` - Export useOnboarding

**Package shared:**
- `packages/shared/src/types/user.ts` - Ajout champs onboardingCompleted/Step

### Fonctionnalites

- **Tour guide avec spotlight** - Overlay SVG avec trou autour de l'element cible
- **8 etapes pour patron** - Welcome, dashboard, clients, chantiers, devis, calendar, analytics, done
- **5 etapes pour employe** - Welcome, calendar, interventions, photos, done
- **Detection premier login** - Demarre auto si onboardingCompleted = false
- **Progression sauvegardee** - Step stocke en BDD
- **Bouton "Refaire le tour"** - Dans Settings
- **Animation fluide** - fade-in CSS

## Criteres d'acceptation

- [x] Detection premier login (flag en BDD)
- [x] Tour guide avec spotlight sur elements
- [x] Etapes contextuelles par role:
  - Patron: tableau de bord, clients, devis, factures
  - Employe: calendrier, interventions, photos
- [x] Progression sauvegardee (reprendre ou passer)
- [x] Bouton "Refaire le tour" dans parametres
- [x] Animations fluides (pas intrusif)
- [x] Version simplifiee sur mobile (responsive)

## Tests de validation

- [x] Tour demarre au premier login
- [x] Spotlight sur les bons elements
- [x] Skip sauvegarde la progression
- [x] "Refaire le tour" fonctionne
- [x] Etapes differentes par role

## Note

Implementation sans librairie externe (react-joyride/driver.js) - Spotlight CSS custom plus leger.
Les textes des etapes sont en placeholder et peuvent etre personnalises dans useOnboarding.ts.
