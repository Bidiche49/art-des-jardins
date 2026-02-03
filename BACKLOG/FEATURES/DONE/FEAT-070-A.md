# FEAT-070-A: Gateway WebSocket NestJS de base

**Type:** Feature
**Statut:** Fait
**Priorite:** Moyenne
**Complexite:** S
**Tags:** api, websocket
**Date creation:** 2026-02-03
**Parent:** FEAT-070

---

## Description

Creer la structure de base du gateway WebSocket NestJS avec le module @nestjs/websockets et socket.io. Cette etape pose les fondations sans authentification.

## Scope limite

- Installation des dependances (@nestjs/websockets, @nestjs/platform-socket.io, socket.io)
- Creation du module WebSocket
- Gateway basique avec handleConnection/handleDisconnect
- Configuration CORS pour le gateway
- Tests de connexion basiques

## Criteres d'acceptation

- [x] Dependances @nestjs/websockets et socket.io installees
- [x] Module WebsocketModule cree dans apps/api/src/modules/websocket/
- [x] EventsGateway avec @WebSocketGateway decorator
- [x] Logging des connexions/deconnexions
- [x] Tests unitaires du gateway (connexion/deconnexion)
- [x] Le serveur WebSocket demarre sur /socket.io

## Fichiers a creer

- `apps/api/src/modules/websocket/websocket.module.ts`
- `apps/api/src/modules/websocket/events.gateway.ts`
- `apps/api/src/modules/websocket/events.gateway.spec.ts`

## SECTION AUTOMATISATION

**Score:** 90/100
**Automatisable:** OUI

### Prompt d'execution

```
TICKET: FEAT-070-A - Gateway WebSocket NestJS de base

MISSION:
1. Installer les dependances WebSocket dans apps/api:
   cd apps/api && pnpm add @nestjs/websockets @nestjs/platform-socket.io socket.io

2. Creer le module websocket:
   - apps/api/src/modules/websocket/websocket.module.ts
   - apps/api/src/modules/websocket/events.gateway.ts

3. Implementer EventsGateway:
   ```typescript
   @WebSocketGateway({
     cors: { origin: '*' },
     namespace: '/'
   })
   export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
     private readonly logger = new Logger(EventsGateway.name);

     @WebSocketServer()
     server: Server;

     afterInit(server: Server) {
       this.logger.log('WebSocket Gateway initialized');
     }

     handleConnection(client: Socket) {
       this.logger.log(`Client connected: ${client.id}`);
     }

     handleDisconnect(client: Socket) {
       this.logger.log(`Client disconnected: ${client.id}`);
     }
   }
   ```

4. Importer WebsocketModule dans AppModule

5. Ecrire tests unitaires pour le gateway

6. Verifier que le serveur demarre: pnpm dev:api et tester connexion WS

CRITERES DE SUCCES:
- pnpm build:api passe
- pnpm test apps/api -- --testPathPattern=events.gateway passe
- Connexion WebSocket possible sur ws://localhost:3000/socket.io
```

## Tests de validation

- [x] `pnpm build:api` sans erreur
- [x] Tests unitaires passent (9 tests)
- [x] Connexion WS testable manuellement
