# FEAT-030: Service Worker Push Notifications

**Type:** Feature
**Statut:** Fait
**Priorite:** Haute
**Complexite:** M
**Tags:** notifications, push, pwa, backend
**Date creation:** 2026-01-29
**Date cloture:** 2026-01-29
**Phase:** 5.2

---

## Description

Configurer l'infrastructure backend pour envoyer des push notifications vers la PWA.

## User Story

**En tant que** patron ou employe
**Je veux** recevoir des notifications push sur mon telephone
**Afin de** etre informe en temps reel des evenements importants

## Criteres d'acceptation

- [x] VAPID keys configures (via .env)
- [x] Endpoint `POST /notifications/subscribe` pour enregistrer une subscription
- [x] Endpoint `DELETE /notifications/unsubscribe` pour se desabonner
- [x] Service `NotificationsService` avec la librairie web-push
- [x] Table `push_subscriptions` dans Prisma schema
- [x] Endpoint `GET /notifications/vapid-public-key` pour le client
- [x] Endpoint `POST /notifications/send/test` pour test
- [x] 7 tests unitaires passent

## Implementation

### Fichiers crees

- `apps/api/src/modules/notifications/notifications.module.ts`
- `apps/api/src/modules/notifications/notifications.service.ts`
- `apps/api/src/modules/notifications/notifications.controller.ts`
- `apps/api/src/modules/notifications/notifications.service.spec.ts`
- `apps/api/src/modules/notifications/dto/subscribe.dto.ts`
- `apps/api/src/modules/notifications/dto/index.ts`

### Schema Prisma

```prisma
model PushSubscription {
  id        String   @id @default(uuid())
  userId    String
  endpoint  String   @unique
  p256dh    String
  auth      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(...)
}
```

### Variables d'environnement requises

```
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:contact@artjardin.fr
```

Generer avec: `npx web-push generate-vapid-keys`

## Tests de validation

- [x] Subscription enregistree en base
- [x] Desabonnement fonctionne
- [x] 7 tests unitaires passent

## Dependencies

Aucune
