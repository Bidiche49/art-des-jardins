# FEAT-031: Abonnement Push dans la PWA

**Type:** Feature
**Statut:** Fait
**Priorite:** Haute
**Complexite:** S
**Tags:** notifications, push, pwa, frontend
**Date creation:** 2026-01-29
**Date completion:** 2026-01-29
**Phase:** 5.2

---

## Description

Permettre aux utilisateurs de s'abonner aux notifications push depuis la PWA.

## User Story

**En tant que** utilisateur de la PWA
**Je veux** pouvoir activer/desactiver les notifications
**Afin de** controler quand je recois des alertes

## Criteres d'acceptation

- [x] Demande de permission au premier login
- [x] Toggle notifications dans le header (icone cloche)
- [x] Subscription envoyee au backend automatiquement
- [x] Indicateur visuel du statut (active/inactive)
- [x] Gestion du refus de permission

## Fichiers crees/modifies

- `apps/pwa/src/api/notifications.ts` - API client pour notifications
- `apps/pwa/src/stores/notifications.ts` - Store Zustand pour l'etat
- `apps/pwa/src/components/NotificationToggle.tsx` - Composant toggle (compact/full)
- `apps/pwa/src/hooks/usePushPermission.tsx` - Hook demande permission 1er login
- `apps/pwa/src/components/layout/Layout.tsx` - Integration toggle dans header
- `apps/pwa/src/pages/Dashboard.tsx` - Hook permission au chargement
- `apps/pwa/src/api/index.ts` - Export du nouveau service
- `apps/pwa/src/stores/index.ts` - Export du nouveau store
- `apps/pwa/src/hooks/index.ts` - Export du nouveau hook

## Implementation

### Service API (`api/notifications.ts`)
- `getVapidPublicKey()` - Recupere la cle publique VAPID
- `subscribe(subscription)` - Enregistre la subscription au backend
- `unsubscribe(endpoint)` - Supprime la subscription
- `getStatus()` - Verifie l'etat de l'abonnement
- `sendTest()` - Envoie une notification de test

### Store Zustand (`stores/notifications.ts`)
- `permission`: 'default' | 'granted' | 'denied' | 'unsupported'
- `isSubscribed`: boolean
- `subscription`: PushSubscription | null
- `hasAskedPermission`: boolean (persiste pour ne pas redemander)
- Actions: checkSupport, checkPermission, requestPermission, subscribe, unsubscribe

### Composant Toggle (`components/NotificationToggle.tsx`)
- Mode compact (icone cloche dans header)
- Mode full (toggle switch avec description)
- Bouton "Envoyer notification de test" quand actif
- Gestion des etats: unsupported, denied, inactive, active

### Hook Permission (`hooks/usePushPermission.tsx`)
- Affiche un toast 2s apres le login si jamais sollicite
- Propose "Activer" ou "Plus tard"
- Persiste hasAskedPermission pour ne pas redemander

## Tests de validation

- [x] 11 tests unitaires pour le store notifications
- [x] Permission demandee correctement (toast interactif)
- [x] Subscription enregistree au backend
- [x] Toggle fonctionne (on/off)
- [x] Gestion navigateur non supporte
- [x] Gestion permission refusee

## Dependencies

- FEAT-030 (Backend notifications) - DONE
