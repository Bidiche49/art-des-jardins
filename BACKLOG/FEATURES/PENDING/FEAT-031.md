# FEAT-031: Abonnement Push dans la PWA

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** notifications, push, pwa, frontend
**Date creation:** 2026-01-29
**Phase:** 5.2

---

## Description

Permettre aux utilisateurs de s'abonner aux notifications push depuis la PWA.

## User Story

**En tant que** utilisateur de la PWA
**Je veux** pouvoir activer/desactiver les notifications
**Afin de** controler quand je recois des alertes

## Criteres d'acceptation

- [ ] Demande de permission au premier login
- [ ] Toggle notifications dans la page profil/parametres
- [ ] Subscription envoyee au backend automatiquement
- [ ] Indicateur visuel du statut (active/inactive)
- [ ] Gestion du refus de permission

## Fichiers concernes

- `apps/pwa/src/services/notifications.ts` - Service push
- `apps/pwa/src/components/NotificationToggle.tsx` - Composant toggle
- `apps/pwa/src/pages/Settings.tsx` ou `Profile.tsx` - Integration

## Analyse / Approche

1. Verifier si le navigateur supporte les push notifications
2. Demander la permission `Notification.requestPermission()`
3. Obtenir la subscription via `registration.pushManager.subscribe()`
4. Envoyer la subscription au backend `/notifications/subscribe`
5. Stocker l'etat dans le localStorage + store

## Tests de validation

- [ ] Permission demandee correctement
- [ ] Subscription enregistree au backend
- [ ] Toggle fonctionne (on/off)
- [ ] Gestion navigateur non supporte
- [ ] Gestion permission refusee

## Dependencies

- FEAT-030 (Backend notifications)
