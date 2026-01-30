# FEAT-050: Mode sombre PWA

**Type:** Feature
**Statut:** Fait
**Priorite:** Basse
**Complexite:** M
**Tags:** pwa, ui, theme, dark-mode
**Date creation:** 2026-01-30

---

## Description

Implementer un mode sombre pour la PWA. Le theme doit pouvoir suivre les preferences systeme ou etre force par l'utilisateur.

## User Story

**En tant qu'** utilisateur travaillant le soir
**Je veux** pouvoir activer un mode sombre
**Afin de** reduire la fatigue visuelle

## Criteres d'acceptation

- [ ] Mode sombre avec palette coherente
- [ ] Toggle dans les parametres utilisateur
- [ ] Option "Automatique" (suit le systeme)
- [ ] Persistance du choix en localStorage
- [ ] Transition fluide entre les modes
- [ ] Tous les composants adaptes

## Fichiers concernes

- `apps/pwa/src/stores/ui.ts` (theme state)
- `apps/pwa/src/App.tsx` (provider)
- `apps/pwa/tailwind.config.js` (dark mode)
- `apps/pwa/src/pages/Settings.tsx` (a creer)

## Analyse / Approche

1. Configurer Tailwind en mode `class`
2. Creer les variables CSS pour dark mode
3. Ajouter le toggle dans UI store
4. Appliquer la classe `dark` au root

## Tests de validation

- [ ] Le toggle fonctionne
- [ ] Les preferences sont persistees
- [ ] Tous les composants s'affichent correctement en dark
- [ ] Le mode auto detecte les prefs systeme
