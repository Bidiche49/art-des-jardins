export type ServiceStatus = 'up' | 'down' | 'degraded';
export type OverallStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface ServiceHealth {
  status: ServiceStatus;
  latencyMs: number;
  lastCheck: Date;
  error?: string;
}

export interface HealthStatus {
  status: OverallStatus;
  services: {
    database: ServiceHealth;
    storage: ServiceHealth;
    smtp: ServiceHealth;
  };
  timestamp: Date;
  uptime: number;
  version: string;
}

export interface AlertConfig {
  enabled: boolean;
  email: string;
  serviceDownThresholdMs: number;
  checkIntervalMs: number;
}

export interface ServiceDownEvent {
  service: string;
  downSince: Date;
  error?: string;
  alerted: boolean;
}
