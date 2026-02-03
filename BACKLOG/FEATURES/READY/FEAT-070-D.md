# FEAT-070-D: Service WebSocket frontend PWA

**Type:** Feature
**Statut:** A faire
**Priorite:** Moyenne
**Complexite:** S
**Tags:** pwa, websocket
**Date creation:** 2026-02-03
**Parent:** FEAT-070
**Depend de:** FEAT-070-B

---

## Description

Creer le service WebSocket cote frontend PWA avec gestion de la connexion, reconnexion automatique avec backoff exponentiel, et fallback polling.

## Scope limite

- Installation socket.io-client
- Service singleton de connexion WebSocket
- Reconnexion automatique avec exponential backoff
- Detection etat connexion (connected/disconnected/reconnecting)
- Fallback polling si WebSocket echoue 3 fois

## Criteres d'acceptation

- [ ] socket.io-client installe dans apps/pwa
- [ ] WebSocketService singleton avec methodes connect/disconnect
- [ ] Authentification par token JWT a la connexion
- [ ] Reconnexion automatique (backoff: 1s, 2s, 4s, 8s, max 30s)
- [ ] Fallback polling apres 3 echecs WS consecutifs
- [ ] Etat de connexion observable (React state)
- [ ] Tests unitaires du service

## Fichiers a creer

- `apps/pwa/src/services/websocket.service.ts`
- `apps/pwa/src/services/websocket.service.test.ts`
- `apps/pwa/src/services/websocket.types.ts`

## SECTION AUTOMATISATION

**Score:** 85/100
**Automatisable:** OUI

### Prompt d'execution

```
TICKET: FEAT-070-D - Service WebSocket frontend PWA

PREREQUIS: Backend WebSocket fonctionnel (FEAT-070-A/B)

MISSION:
1. Installer socket.io-client:
   cd apps/pwa && pnpm add socket.io-client

2. Creer les types:
   - apps/pwa/src/services/websocket.types.ts
   ```typescript
   export type ConnectionState = 'connected' | 'disconnected' | 'reconnecting' | 'fallback';

   export interface WebSocketConfig {
     url: string;
     token: string;
     onStateChange?: (state: ConnectionState) => void;
   }
   ```

3. Creer WebSocketService:
   - apps/pwa/src/services/websocket.service.ts
   ```typescript
   class WebSocketService {
     private socket: Socket | null = null;
     private reconnectAttempts = 0;
     private maxReconnectAttempts = 3;
     private state: ConnectionState = 'disconnected';

     connect(config: WebSocketConfig) {
       this.socket = io(config.url, {
         auth: { token: config.token },
         reconnection: true,
         reconnectionDelay: 1000,
         reconnectionDelayMax: 30000,
         reconnectionAttempts: this.maxReconnectAttempts,
       });

       this.socket.on('connect', () => this.setState('connected'));
       this.socket.on('disconnect', () => this.setState('disconnected'));
       this.socket.on('reconnect_attempt', () => this.setState('reconnecting'));
       this.socket.on('reconnect_failed', () => this.enableFallbackPolling());
     }

     on<T>(event: string, callback: (data: T) => void) {
       this.socket?.on(event, callback);
     }

     off(event: string) {
       this.socket?.off(event);
     }

     disconnect() {
       this.socket?.disconnect();
       this.socket = null;
     }

     private enableFallbackPolling() {
       this.setState('fallback');
       // Activer le polling via React Query refetch interval
     }
   }

   export const websocketService = new WebSocketService();
   ```

4. Ecrire tests unitaires avec mocks socket.io

5. Verifier: pnpm test apps/pwa

CRITERES DE SUCCES:
- Tests unitaires passent
- Service se connecte avec token
- Reconnexion automatique fonctionne
- Fallback s'active apres 3 echecs
```

## Tests de validation

- [ ] Connexion reussie avec token valide
- [ ] Deconnexion propre
- [ ] Reconnexion automatique testee
- [ ] Fallback polling active apres echecs
