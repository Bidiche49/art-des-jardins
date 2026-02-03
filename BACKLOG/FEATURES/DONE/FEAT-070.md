# FEAT-070: Dashboard temps reel WebSocket

**Type:** Feature
**Statut:** Split
**Priorite:** Moyenne
**Complexite:** L
**Tags:** api, pwa, ux
**Date creation:** 2026-02-03
**Date split:** 2026-02-03
**Phase:** 15

---

## SPLIT EN SOUS-TICKETS

Ce ticket a ete decoupe en 5 sous-tickets de complexite S:

| Sous-ticket | Description | Complexite | Dependances |
|-------------|-------------|------------|-------------|
| **FEAT-070-A** | Gateway WebSocket NestJS de base | S | - |
| **FEAT-070-B** | Authentification JWT et Rooms WebSocket | S | FEAT-070-A |
| **FEAT-070-C** | Emission des events depuis les services | S | FEAT-070-B |
| **FEAT-070-D** | Service WebSocket frontend PWA | S | FEAT-070-B |
| **FEAT-070-E** | Hook useRealtimeUpdates et indicateur UI | S | FEAT-070-C, FEAT-070-D |

### Ordre d'execution recommande

```
FEAT-070-A (Backend Gateway base)
     |
     v
FEAT-070-B (Auth JWT + Rooms)
     |
     +---> FEAT-070-C (Events services)
     |          |
     +---> FEAT-070-D (Frontend service)
                |          |
                +----+-----+
                     |
                     v
              FEAT-070-E (Hook + UI)
```

---

## Description originale

Implementer un dashboard temps reel avec WebSocket pour voir les mises a jour instantanees (nouvelles interventions, devis signes, etc.).

## User Story

**En tant que** patron
**Je veux** voir les mises a jour en temps reel
**Afin de** suivre l'activite de mon entreprise sans rafraichir

## Criteres d'acceptation originaux

- [ ] Gateway WebSocket NestJS (@nestjs/websockets) → **FEAT-070-A**
- [ ] Authentification JWT sur WebSocket → **FEAT-070-B**
- [ ] Rooms par entreprise (multi-tenant ready) → **FEAT-070-B**
- [ ] Events emis → **FEAT-070-C**
- [ ] Reconnexion automatique avec backoff → **FEAT-070-D**
- [ ] Fallback polling si WS indisponible → **FEAT-070-D**
- [ ] Indicateur connexion temps reel → **FEAT-070-E**
