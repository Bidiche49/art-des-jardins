import { RelanceLevel } from '@art-et-jardin/database';

export interface RelanceConfig {
  enabled: boolean;
  j1: number;
  j2: number;
  j3: number;
}

export interface FactureToRelance {
  id: string;
  numero: string;
  dateEcheance: Date;
  totalTTC: number;
  joursRetard: number;
  client: {
    id: string;
    nom: string;
    prenom: string | null;
    email: string;
    excludeRelance: boolean;
  };
  lastRelance: {
    level: RelanceLevel;
    sentAt: Date;
  } | null;
}

export interface RelanceResult {
  success: boolean;
  emailId?: string;
  error?: string;
}

export interface RelanceStats {
  total: number;
  byLevel: Record<string, number>;
  last30Days: {
    success: number;
    failed: number;
  };
  planned: number;
  config: RelanceConfig;
}

export interface TriggerResult {
  processed: number;
  sent: number;
  skipped: number;
  errors: number;
  details: Array<{
    factureNumero: string;
    level: string;
    success: boolean;
    error?: string;
  }>;
}
