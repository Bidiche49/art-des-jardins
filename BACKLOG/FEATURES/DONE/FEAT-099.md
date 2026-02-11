# FEAT-099: [Flutter] Phase 16 - Push Notifications FCM

**Type:** Feature
**Statut:** Fait
**Priorite:** Moyenne
**Complexite:** M
**Tags:** mobile, flutter, notifications, firebase
**Date creation:** 2026-02-10

---

## Description

Notifications push via Firebase Cloud Messaging : setup Firebase, envoi token au backend, gestion 3 etats (foreground, background, terminated). Modification backend minimale.

## User Story

**En tant que** employe/patron
**Je veux** recevoir des notifications push (nouveau devis signe, facture payee, etc.)
**Afin de** rester informe meme quand l'app est fermee

## Criteres d'acceptation

- [ ] firebase_core + firebase_messaging configures
- [ ] Token FCM envoye au backend a chaque login
- [ ] Foreground : snackbar via flutter_local_notifications
- [ ] Background : notification systeme
- [ ] Terminated : notification systeme + deep link au tap
- [ ] Backend : champ `platform` + `fcmToken` dans PushSubscription
- [ ] `flutter test` passe, `flutter analyze` propre

## Tests obligatoires

### Unit tests NotificationService (~12 tests)
- [ ] Init FCM -> token obtenu
- [ ] Token envoye au backend apres login
- [ ] Token refresh -> re-envoye au backend
- [ ] Foreground message -> snackbar affiche
- [ ] Background message -> notification systeme creee
- [ ] Tap notification -> deep link resolu
- [ ] Deep link navigation correcte (/devis/:id, /factures/:id, etc.)
- [ ] Notification sans deep link -> ouvre l'app
- [ ] Permission demandee a l'utilisateur
- [ ] Permission refusee -> fonctionne sans push
- [ ] Logout -> desabonne le token
- [ ] Token null -> pas d'envoi au backend

### Unit tests backend (NestJS) (~6 tests)
- [ ] POST /notifications/subscribe avec platform='ios' + fcmToken
- [ ] POST /notifications/subscribe avec platform='android' + fcmToken
- [ ] POST /notifications/subscribe avec platform='web' (existant non casse)
- [ ] Envoi notification -> route vers FCM si platform mobile
- [ ] Envoi notification -> route vers Web Push si platform web
- [ ] Token invalide FCM -> error handler, pas de crash

### Widget tests (~4 tests)
- [ ] Snackbar notification visible en foreground
- [ ] Tap snackbar -> navigation
- [ ] Permission dialog affiche
- [ ] Settings : toggle notifications visible

**Total attendu : ~22 tests**

## Fichiers concernes

- `lib/services/notifications/notification_service.dart`
- `apps/api/src/modules/notifications/` (modification backend)
