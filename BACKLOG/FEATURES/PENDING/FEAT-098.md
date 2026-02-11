# FEAT-098: [Flutter] Phase 15 - Onboarding tour

**Type:** Feature
**Statut:** A faire
**Priorite:** Basse
**Complexite:** M
**Tags:** mobile, flutter, onboarding, ux
**Date creation:** 2026-02-10

---

## Description

Tour guide avec spotlight par role (patron 8 steps, employe 5 steps), overlay avec masque, tooltip, barre de progression, persistance API.

## User Story

**En tant que** nouvel utilisateur
**Je veux** un guide interactif qui me montre les fonctions principales
**Afin de** prendre l'app en main rapidement

## Criteres d'acceptation

- [ ] Overlay spotlight autour de l'element cible
- [ ] Steps par role : patron (8), employe (5)
- [ ] Tooltip positionne (haut/bas) avec titre + description
- [ ] Barre de progression
- [ ] Navigation : Passer / Retour / Suivant / Terminer
- [ ] Persistance API : PATCH /auth/onboarding/step et /complete
- [ ] `flutter test` passe, `flutter analyze` propre

## Tests obligatoires

### Unit tests OnboardingProvider (~10 tests)
- [ ] Patron : 8 steps charges
- [ ] Employe : 5 steps charges
- [ ] Step initial = 0 (ou dernier step vu)
- [ ] nextStep incremente correctement
- [ ] previousStep decremente correctement
- [ ] skipAll marque comme complete
- [ ] Complete au dernier step -> appel API
- [ ] Appel API PATCH step a chaque avancement
- [ ] Onboarding deja complete -> pas de re-affichage
- [ ] Erreur API save step -> continue sans bloquer

### Widget tests OnboardingOverlay (~8 tests)
- [ ] Overlay masque visible
- [ ] Element spotlight non-masque
- [ ] Tooltip affiche titre + description
- [ ] Tooltip positionne correctement (haut si bas de page, etc.)
- [ ] Barre de progression affiche X/N
- [ ] Bouton Suivant visible
- [ ] Bouton Passer visible
- [ ] Bouton Retour visible (sauf step 0)

### Widget tests navigation (~6 tests)
- [ ] Tap Suivant -> step suivant
- [ ] Tap Retour -> step precedent
- [ ] Tap Passer -> ferme l'onboarding
- [ ] Dernier step -> bouton "Terminer"
- [ ] Terminer -> ferme + appel API complete
- [ ] Overlay ferme proprement sans fuite memoire

**Total attendu : ~24 tests**

## Fichiers concernes

- `lib/features/onboarding/`
