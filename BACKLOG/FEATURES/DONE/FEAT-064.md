# FEAT-064: Notifications in-app

**Type:** Feature
**Statut:** Pret
**Priorite:** Moyenne
**Complexite:** S
**Tags:** ux, pwa
**Date creation:** 2026-02-03
**Phase:** 13

---

## Description

Ajouter un centre de notifications dans la PWA avec badge, dropdown et historique.

## User Story

**En tant que** utilisateur
**Je veux** voir mes notifications dans l'app
**Afin de** ne pas dependre uniquement des push notifications (qui peuvent etre desactivees)

## Contexte

Les push notifications sont utiles mais:
- Peuvent etre desactivees par l'utilisateur
- Ne gardent pas d'historique
- Pas de contexte detaille

Un centre de notifications in-app complete les push.

## Criteres d'acceptation

- [ ] Icone cloche dans le header avec badge compteur
- [ ] Dropdown au clic avec liste des notifications
- [ ] Types: info, warning, success, action_required
- [ ] Notifications cliquables (lien vers la ressource)
- [ ] Marquer comme lu (individuel et "tout marquer lu")
- [ ] Historique des 30 derniers jours
- [ ] Preferences: activer/desactiver par type
- [ ] Sync avec push notifications

## Fichiers concernes

- `packages/database/prisma/schema.prisma` (Notification model)
- `apps/api/src/modules/notifications/` (nouveau)
- `apps/pwa/src/components/NotificationCenter.tsx` (nouveau)
- `apps/pwa/src/components/NotificationBell.tsx` (nouveau)

## Analyse / Approche

```prisma
model Notification {
  id          String    @id @default(uuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  type        String    // info, warning, success, action_required
  title       String
  message     String
  link        String?   // /devis/123
  readAt      DateTime?
  createdAt   DateTime  @default(now())

  @@index([userId, readAt])
}
```

Notifications generees automatiquement:
- Nouveau devis signe -> patron
- Facture en retard -> patron
- Intervention demain -> employe
- Nouveau message client -> concerne

## Tests de validation

- [ ] Badge affiche le bon compteur
- [ ] Clic ouvre dropdown
- [ ] Notification cliquable navigue
- [ ] Marquer lu decremente badge
- [ ] Preferences respectees
