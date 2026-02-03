# FEAT-070-B: Authentification JWT et Rooms WebSocket

**Type:** Feature
**Statut:** A faire
**Priorite:** Moyenne
**Complexite:** S
**Tags:** api, websocket, auth
**Date creation:** 2026-02-03
**Parent:** FEAT-070
**Depend de:** FEAT-070-A

---

## Description

Ajouter l'authentification JWT sur les connexions WebSocket et implementer le systeme de rooms par entreprise (multi-tenant).

## Scope limite

- Verification du token JWT a la connexion WebSocket
- Rejet des connexions non authentifiees
- Jointure automatique a la room de l'entreprise
- Methode broadcastToCompany pour emettre vers une entreprise

## Criteres d'acceptation

- [ ] Token JWT valide requis pour connexion WS (via handshake.auth.token)
- [ ] Connexion refusee si token invalide/expire
- [ ] Client rejoint automatiquement room `company:{companyId}`
- [ ] Methode broadcastToCompany(companyId, event, data) fonctionnelle
- [ ] Tests unitaires avec mocks d'authentification
- [ ] Isolation des rooms verifiee (multi-tenant)

## Fichiers concernes

- `apps/api/src/modules/websocket/events.gateway.ts` (modifier)
- `apps/api/src/modules/websocket/events.gateway.spec.ts` (modifier)
- `apps/api/src/modules/websocket/websocket.types.ts` (creer)

## SECTION AUTOMATISATION

**Score:** 85/100
**Automatisable:** OUI

### Prompt d'execution

```
TICKET: FEAT-070-B - Authentification JWT et Rooms WebSocket

PREREQUIS: FEAT-070-A complete (Gateway de base existe)

MISSION:
1. Creer les types WebSocket:
   - apps/api/src/modules/websocket/websocket.types.ts
   ```typescript
   export interface AuthenticatedSocket extends Socket {
     user: { id: string; companyId: string; email: string };
   }
   ```

2. Modifier EventsGateway pour l'authentification:
   ```typescript
   constructor(private readonly authService: AuthService) {}

   async handleConnection(client: Socket) {
     try {
       const token = client.handshake.auth?.token;
       if (!token) {
         client.disconnect();
         return;
       }
       const user = await this.authService.verifyToken(token);
       (client as AuthenticatedSocket).user = user;
       client.join(`company:${user.companyId}`);
       this.logger.log(`Client ${client.id} joined company:${user.companyId}`);
     } catch (error) {
       this.logger.warn(`Auth failed for client ${client.id}`);
       client.disconnect();
     }
   }

   broadcastToCompany(companyId: string, event: string, data: any) {
     this.server.to(`company:${companyId}`).emit(event, data);
   }
   ```

3. Mettre a jour WebsocketModule pour injecter AuthService

4. Ecrire tests unitaires:
   - Connexion avec token valide -> OK
   - Connexion sans token -> Deconnexion
   - Connexion token invalide -> Deconnexion
   - broadcastToCompany n'atteint que la bonne room

5. Verifier: pnpm test apps/api -- --testPathPattern=events.gateway

CRITERES DE SUCCES:
- Tous les tests passent
- Connexion sans token = deconnexion immediate
- Isolation multi-tenant verifiee par tests
```

## Tests de validation

- [ ] Test connexion avec JWT valide
- [ ] Test rejet sans token
- [ ] Test rejet token expire
- [ ] Test isolation des rooms
