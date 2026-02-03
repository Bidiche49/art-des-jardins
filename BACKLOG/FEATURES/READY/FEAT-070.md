# FEAT-070: Dashboard temps reel WebSocket

**Type:** Feature
**Statut:** Pret
**Priorite:** Moyenne
**Complexite:** L
**Tags:** api, pwa, ux
**Date creation:** 2026-02-03
**Phase:** 15

---

## Description

Implementer un dashboard temps reel avec WebSocket pour voir les mises a jour instantanees (nouvelles interventions, devis signes, etc.).

## User Story

**En tant que** patron
**Je veux** voir les mises a jour en temps reel
**Afin de** suivre l'activite de mon entreprise sans rafraichir

## Contexte

Actuellement le dashboard se met a jour au chargement ou par pull-to-refresh. Avec WebSocket:
- Nouveau devis signe -> notification instantanee
- Intervention terminee -> mise a jour immediate
- Nouveau message client -> alerte temps reel

## Criteres d'acceptation

- [ ] Gateway WebSocket NestJS (@nestjs/websockets)
- [ ] Authentification JWT sur WebSocket
- [ ] Rooms par entreprise (multi-tenant ready)
- [ ] Events emis:
  - devis:created, devis:signed, devis:rejected
  - facture:created, facture:paid
  - intervention:started, intervention:completed
  - client:created
  - message:received
- [ ] Reconnexion automatique avec backoff
- [ ] Fallback polling si WS indisponible
- [ ] Indicateur connexion temps reel

## Fichiers concernes

- `apps/api/src/modules/websocket/` (nouveau)
- `apps/api/src/modules/*/` (emit events)
- `apps/pwa/src/services/websocket.service.ts` (nouveau)
- `apps/pwa/src/hooks/useRealtimeUpdates.ts` (nouveau)

## Analyse / Approche

```typescript
// Backend Gateway
@WebSocketGateway({ cors: true })
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    const user = this.authService.verifyToken(token);
    client.join(`company:${user.companyId}`);
  }

  broadcastToCompany(companyId: string, event: string, data: any) {
    this.server.to(`company:${companyId}`).emit(event, data);
  }
}

// Dans DevisService
async signDevis(id: string) {
  const devis = await this.update(id, { status: 'signed' });
  this.eventsGateway.broadcastToCompany(
    devis.companyId,
    'devis:signed',
    { id: devis.id, clientName: devis.client.name }
  );
  return devis;
}
```

Frontend:
```typescript
const useRealtimeUpdates = () => {
  const socket = useSocket();

  useEffect(() => {
    socket.on('devis:signed', (data) => {
      toast.success(`Devis signe par ${data.clientName}!`);
      queryClient.invalidateQueries(['devis']);
    });
  }, [socket]);
};
```

## Tests de validation

- [ ] Connexion WS authentifiee
- [ ] Event recu en temps reel
- [ ] Reconnexion apres deconnexion
- [ ] Fallback polling fonctionne
- [ ] Multi-onglets gere (pas de doublons)
