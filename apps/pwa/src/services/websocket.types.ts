/**
 * WebSocket types for PWA real-time updates
 */

export type ConnectionState = 'connected' | 'disconnected' | 'reconnecting' | 'fallback';

export interface WebSocketConfig {
  url: string;
  token: string;
}

/**
 * WebSocket event constants - mirrored from API
 */
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

export type WsEventType = (typeof WS_EVENTS)[keyof typeof WS_EVENTS];

/**
 * Payload interfaces for WebSocket events
 */
export interface DevisCreatedPayload {
  id: string;
  numero: string;
  clientName: string;
  amount: number;
}

export interface DevisSignedPayload {
  id: string;
  numero: string;
  clientName: string;
}

export interface DevisRejectedPayload {
  id: string;
  numero: string;
  clientName: string;
  reason?: string;
}

export interface FactureCreatedPayload {
  id: string;
  numero: string;
  clientName: string;
  amount: number;
}

export interface FacturePaidPayload {
  id: string;
  numero: string;
  clientName: string;
  amount: number;
}

export interface InterventionStartedPayload {
  id: string;
  address: string;
  assignee: string;
}

export interface InterventionCompletedPayload {
  id: string;
  address: string;
  duration: number;
}

export interface ClientCreatedPayload {
  id: string;
  name: string;
  type: string;
}

export type WsEventPayload =
  | DevisCreatedPayload
  | DevisSignedPayload
  | DevisRejectedPayload
  | FactureCreatedPayload
  | FacturePaidPayload
  | InterventionStartedPayload
  | InterventionCompletedPayload
  | ClientCreatedPayload;

export type StateChangeCallback = (state: ConnectionState) => void;
