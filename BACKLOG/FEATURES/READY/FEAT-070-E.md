# FEAT-070-E: Hook useRealtimeUpdates et indicateur UI

**Type:** Feature
**Statut:** A faire
**Priorite:** Moyenne
**Complexite:** S
**Tags:** pwa, ux, websocket
**Date creation:** 2026-02-03
**Parent:** FEAT-070
**Depend de:** FEAT-070-C, FEAT-070-D

---

## Description

Creer le hook React useRealtimeUpdates qui ecoute les events WebSocket, affiche des toasts de notification, et invalide le cache React Query. Ajouter un indicateur visuel de connexion temps reel.

## Scope limite

- Hook useRealtimeUpdates pour ecouter tous les events
- Toast notifications pour chaque type d'event
- Invalidation React Query pour rafraichir les donnees
- Indicateur visuel de connexion (vert/orange/rouge)
- Gestion multi-onglets (eviter les doublons)

## Criteres d'acceptation

- [ ] Hook useRealtimeUpdates cree et fonctionnel
- [ ] Toast affiche pour devis:signed, facture:paid, etc.
- [ ] React Query invalide les queries concernees
- [ ] Indicateur connexion visible dans le header
- [ ] Multi-onglets: un seul onglet ecoute (leader election)
- [ ] Tests unitaires du hook

## Fichiers a creer

- `apps/pwa/src/hooks/useRealtimeUpdates.ts`
- `apps/pwa/src/hooks/useRealtimeUpdates.test.ts`
- `apps/pwa/src/components/ui/ConnectionIndicator.tsx`

## Fichiers a modifier

- `apps/pwa/src/components/layout/Header.tsx` (ajouter indicateur)
- `apps/pwa/src/App.tsx` (initialiser hook)

## SECTION AUTOMATISATION

**Score:** 80/100
**Automatisable:** OUI

### Prompt d'execution

```
TICKET: FEAT-070-E - Hook useRealtimeUpdates et indicateur UI

PREREQUIS: FEAT-070-C et FEAT-070-D completes

MISSION:
1. Creer le hook useRealtimeUpdates:
   - apps/pwa/src/hooks/useRealtimeUpdates.ts
   ```typescript
   import { useEffect } from 'react';
   import { useQueryClient } from '@tanstack/react-query';
   import { toast } from 'sonner';
   import { websocketService } from '../services/websocket.service';
   import { WS_EVENTS } from '../services/websocket.types';

   export const useRealtimeUpdates = () => {
     const queryClient = useQueryClient();

     useEffect(() => {
       // Devis events
       websocketService.on(WS_EVENTS.DEVIS_SIGNED, (data) => {
         toast.success(`Devis signe par ${data.clientName}`);
         queryClient.invalidateQueries({ queryKey: ['devis'] });
       });

       websocketService.on(WS_EVENTS.FACTURE_PAID, (data) => {
         toast.success(`Facture payee: ${data.amount}€`);
         queryClient.invalidateQueries({ queryKey: ['factures'] });
       });

       websocketService.on(WS_EVENTS.INTERVENTION_COMPLETED, (data) => {
         toast.info(`Intervention terminee: ${data.address}`);
         queryClient.invalidateQueries({ queryKey: ['interventions'] });
       });

       websocketService.on(WS_EVENTS.CLIENT_CREATED, (data) => {
         toast.info(`Nouveau client: ${data.name}`);
         queryClient.invalidateQueries({ queryKey: ['clients'] });
       });

       return () => {
         websocketService.off(WS_EVENTS.DEVIS_SIGNED);
         websocketService.off(WS_EVENTS.FACTURE_PAID);
         websocketService.off(WS_EVENTS.INTERVENTION_COMPLETED);
         websocketService.off(WS_EVENTS.CLIENT_CREATED);
       };
     }, [queryClient]);
   };
   ```

2. Creer ConnectionIndicator:
   - apps/pwa/src/components/ui/ConnectionIndicator.tsx
   ```typescript
   export const ConnectionIndicator = () => {
     const [state, setState] = useState<ConnectionState>('disconnected');

     useEffect(() => {
       websocketService.onStateChange(setState);
     }, []);

     const colors = {
       connected: 'bg-green-500',
       reconnecting: 'bg-yellow-500',
       disconnected: 'bg-red-500',
       fallback: 'bg-orange-500',
     };

     return (
       <div className="flex items-center gap-2">
         <div className={`w-2 h-2 rounded-full ${colors[state]}`} />
         <span className="text-xs text-muted-foreground">
           {state === 'connected' ? 'Temps reel' : state}
         </span>
       </div>
     );
   };
   ```

3. Ajouter ConnectionIndicator dans Header

4. Initialiser useRealtimeUpdates dans App.tsx

5. Implementer leader election pour multi-onglets (localStorage lock)

6. Ecrire tests unitaires

CRITERES DE SUCCES:
- Hook ecoute et reagit aux events
- Toasts s'affichent correctement
- Indicateur visible et reactif
- Tests passent
```

## Tests de validation

- [ ] Toast affiche sur event recu
- [ ] React Query invalide correctement
- [ ] Indicateur change de couleur selon etat
- [ ] Multi-onglets: pas de toast duplique
