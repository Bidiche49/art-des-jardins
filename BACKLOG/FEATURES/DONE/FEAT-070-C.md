# FEAT-070-C: Emission des events temps reel depuis les services

**Type:** Feature
**Statut:** Fait
**Priorite:** Moyenne
**Date completion:** 2026-02-03
**Complexite:** S
**Tags:** api, websocket, events
**Date creation:** 2026-02-03
**Parent:** FEAT-070
**Depend de:** FEAT-070-B

---

## Description

Integrer l'emission d'events WebSocket dans les services metier existants (Devis, Facture, Intervention, Client, Message).

## Scope limite

- Injection du EventsGateway dans les services concernes
- Emission des events apres les operations CRUD
- Definition des types d'events et payloads

## Events a implementer

| Event | Declencheur | Payload |
|-------|-------------|---------|
| devis:created | Nouveau devis | { id, clientName, amount } |
| devis:signed | Signature devis | { id, clientName } |
| devis:rejected | Refus devis | { id, clientName, reason } |
| facture:created | Nouvelle facture | { id, clientName, amount } |
| facture:paid | Paiement facture | { id, clientName, amount } |
| intervention:started | Debut intervention | { id, address, assignee } |
| intervention:completed | Fin intervention | { id, address, duration } |
| client:created | Nouveau client | { id, name, type } |

## Criteres d'acceptation

- [x] Types d'events definis dans websocket.types.ts
- [x] EventsGateway injecte dans DevisService, FactureService, InterventionService, ClientService
- [x] Events emis correctement apres chaque operation
- [x] Tests unitaires verifiant l'emission des events
- [x] Payloads minimalistes (pas de donnees sensibles)

## Fichiers concernes

- `apps/api/src/modules/websocket/websocket.types.ts` (modifier)
- `apps/api/src/modules/websocket/websocket.events.ts` (creer)
- `apps/api/src/modules/devis/devis.service.ts` (modifier)
- `apps/api/src/modules/factures/factures.service.ts` (modifier)
- `apps/api/src/modules/interventions/interventions.service.ts` (modifier)
- `apps/api/src/modules/clients/clients.service.ts` (modifier)

## SECTION AUTOMATISATION

**Score:** 80/100
**Automatisable:** OUI

### Prompt d'execution

```
TICKET: FEAT-070-C - Emission des events temps reel depuis les services

PREREQUIS: FEAT-070-B complete (Auth WebSocket fonctionne)

MISSION:
1. Definir les constantes d'events:
   - apps/api/src/modules/websocket/websocket.events.ts
   ```typescript
   export const WS_EVENTS = {
     DEVIS_CREATED: 'devis:created',
     DEVIS_SIGNED: 'devis:signed',
     DEVIS_REJECTED: 'devis:rejected',
     FACTURE_CREATED: 'facture:created',
     FACTURE_PAID: 'facture:paid',
     INTERVENTION_STARTED: 'intervention:started',
     INTERVENTION_COMPLETED: 'intervention:completed',
     CLIENT_CREATED: 'client:created',
   } as const;
   ```

2. Definir les interfaces de payload dans websocket.types.ts

3. Modifier chaque service pour injecter et utiliser EventsGateway:
   Exemple DevisService:
   ```typescript
   constructor(
     private readonly eventsGateway: EventsGateway,
     // ... autres deps
   ) {}

   async signDevis(id: string) {
     const devis = await this.update(id, { status: 'signed' });
     this.eventsGateway.broadcastToCompany(
       devis.companyId,
       WS_EVENTS.DEVIS_SIGNED,
       { id: devis.id, clientName: devis.client.name }
     );
     return devis;
   }
   ```

4. Repeter pour: FactureService, InterventionService, ClientService

5. Ajouter tests unitaires verifiant les appels a broadcastToCompany

6. Verifier: pnpm test apps/api

CRITERES DE SUCCES:
- Tous les tests passent
- Chaque operation metier emet son event
- Pas de donnees sensibles dans les payloads
```

## Tests de validation

- [x] Event devis:signed emis apres signature
- [x] Event facture:paid emis apres paiement
- [x] Event intervention:completed emis apres cloture
- [x] Event client:created emis apres creation

## Notes d'implementation

- Le module WebSocket a ete cree de zero (FEAT-070-A et FEAT-070-B etaient des prerequis non completes)
- WebsocketModule est @Global pour permettre l'injection de EventsGateway partout
- L'authentification JWT est requise pour les connexions WebSocket
- Les users rejoignent automatiquement une room `user:{userId}` pour les messages cibles
- Tous les 638 tests unitaires passent
