import { Socket } from 'socket.io';

/**
 * Authenticated WebSocket client with user info
 */
export interface AuthenticatedSocket extends Socket {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Payload interfaces for WebSocket events
 * Only minimal, non-sensitive data should be included
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
  duration: number; // in minutes
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
