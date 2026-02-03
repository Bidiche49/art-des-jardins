/**
 * WebSocket event constants for real-time notifications
 */
export const WS_EVENTS = {
  // Devis events
  DEVIS_CREATED: 'devis:created',
  DEVIS_SIGNED: 'devis:signed',
  DEVIS_REJECTED: 'devis:rejected',

  // Facture events
  FACTURE_CREATED: 'facture:created',
  FACTURE_PAID: 'facture:paid',

  // Intervention events
  INTERVENTION_STARTED: 'intervention:started',
  INTERVENTION_COMPLETED: 'intervention:completed',

  // Client events
  CLIENT_CREATED: 'client:created',
} as const;

export type WsEventType = (typeof WS_EVENTS)[keyof typeof WS_EVENTS];
