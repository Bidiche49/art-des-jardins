/**
 * Types for sync conflict resolution
 */

export interface SyncConflict {
  id: string;
  entityType: 'intervention' | 'devis' | 'client' | 'chantier';
  entityId: string;
  entityLabel: string;
  localVersion: Record<string, unknown>;
  serverVersion: Record<string, unknown>;
  localTimestamp: Date;
  serverTimestamp: Date;
  conflictingFields: string[];
}

export type ConflictResolution = 'keep_local' | 'keep_server' | 'merge';

export interface ConflictResolutionResult {
  conflictId: string;
  resolution: ConflictResolution;
  mergedData?: Record<string, unknown>;
  timestamp: Date;
}
