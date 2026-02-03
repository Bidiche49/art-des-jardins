export type AlertType = 'SERVICE_DOWN' | 'BACKUP_FAILED' | 'EMAIL_FAILURES' | 'SERVICE_RECOVERED';

export interface Alert {
  type: AlertType;
  service?: string;
  message: string;
  error?: string;
  timestamp: Date;
}

export interface AlertConfig {
  enabled: boolean;
  email: string;
  serviceDownThresholdMs: number;
}

export interface ServiceDownTracker {
  service: string;
  downSince: Date;
  lastError?: string;
  alertSent: boolean;
}
