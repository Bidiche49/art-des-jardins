# FEAT-096: [Flutter] Phase 13 - WebSocket temps reel

**Type:** Feature
**Statut:** A faire
**Priorite:** Moyenne
**Complexite:** M
**Tags:** mobile, flutter, websocket, realtime
**Date creation:** 2026-02-10

---

## Description

Service WebSocket socket.io avec reconnexion auto, 8 evenements temps reel qui invalidate les providers Riverpod et affichent des snackbars.

## User Story

**En tant que** employe/patron
**Je veux** voir les mises a jour en temps reel (nouveau devis, signature, etc.)
**Afin de** rester informe sans rafraichir manuellement

## Criteres d'acceptation

- [ ] socket_io_client avec auth token
- [ ] Reconnexion auto (3 tentatives, backoff exponentiel)
- [ ] 8 evenements geres (devis, factures, interventions, clients)
- [ ] Invalidation providers Riverpod par evenement
- [ ] Snackbar avec message contextualisé
- [ ] `flutter test` passe, `flutter analyze` propre

## Tests obligatoires

### Unit tests RealtimeService - connexion (~8 tests)
- [ ] connect() avec token valide -> connecte
- [ ] connect() sans token -> pas de connexion
- [ ] disconnect() ferme proprement
- [ ] Reconnexion auto apres deconnexion inattendue
- [ ] 3 tentatives max de reconnexion
- [ ] Backoff exponentiel entre tentatives
- [ ] Apres 3 echecs -> etat disconnected
- [ ] Retour online -> reconnexion

### Unit tests evenements (~16 tests, 8 events x 2)
Pour CHAQUE evenement (devis:created, devis:signed, devis:rejected, facture:created, facture:paid, intervention:started, intervention:completed, client:created) :
- [ ] Event recu -> provider invalide
- [ ] Event recu -> snackbar avec bon message

### Unit tests edge cases (~6 tests)
- [ ] Event avec payload malformed -> ignore sans crash
- [ ] Event inconnu -> ignore
- [ ] Deconnexion pendant reception event -> pas de crash
- [ ] Multiple events rapides -> tous traites
- [ ] App en background -> events bufferises
- [ ] Dispose -> listeners retires

**Total attendu : ~30 tests**

## Fichiers concernes

- `lib/services/realtime/realtime_service.dart`
- `lib/services/realtime/realtime_providers.dart`
