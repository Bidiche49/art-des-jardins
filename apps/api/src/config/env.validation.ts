import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // General
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),

  // Database
  DATABASE_URL: Joi.string().uri().required().messages({
    'any.required': 'DATABASE_URL is required. Example: postgresql://user:pass@localhost:5432/db',
    'string.uri': 'DATABASE_URL must be a valid PostgreSQL connection string',
  }),

  // API Server
  API_PORT: Joi.number().default(3000),
  API_HOST: Joi.string().default('0.0.0.0'),

  // JWT - Required in all environments
  JWT_SECRET: Joi.string().min(32).required().messages({
    'any.required': 'JWT_SECRET is required. Generate with: openssl rand -base64 48',
    'string.min': 'JWT_SECRET must be at least 32 characters for security',
  }),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  // S3 Storage - Optional in development
  S3_ENDPOINT: Joi.string().uri().allow('').optional(),
  S3_ACCESS_KEY: Joi.string().allow('').optional(),
  S3_SECRET_KEY: Joi.string().allow('').optional(),
  S3_BUCKET: Joi.string().default('art-et-jardin'),
  S3_REGION: Joi.string().default('fr-par'),

  // Email - Optional in development
  SMTP_HOST: Joi.string().allow('').optional(),
  SMTP_PORT: Joi.number().allow('').default(587),
  SMTP_USER: Joi.string().allow('').optional(),
  SMTP_PASSWORD: Joi.string().allow('').optional(),
  SMTP_FROM: Joi.string().email({ tlds: false }).default('noreply@artjardin.fr'),

  // Logging
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info'),

  // Rate Limiting
  THROTTLE_TTL: Joi.number().default(60),
  THROTTLE_LIMIT: Joi.number().default(100),

  // CORS
  CORS_ORIGINS: Joi.string().default('http://localhost:3001'),

  // Relances automatiques
  RELANCE_ENABLED: Joi.string().valid('true', 'false').default('false'),
  RELANCE_J1: Joi.number().default(30),
  RELANCE_J2: Joi.number().default(45),
  RELANCE_J3: Joi.number().default(60),

  // BCC email pour copie automatique
  COMPANY_BCC_EMAIL: Joi.string().email({ tlds: false }).allow('').optional(),

  // Backup
  BACKUP_ENABLED: Joi.string().valid('true', 'false').default('false'),
  BACKUP_BUCKET: Joi.string().default('art-et-jardin-backups'),
  BACKUP_RETENTION_DAYS: Joi.number().default(30),

  // Alertes
  ALERTS_ENABLED: Joi.string().valid('true', 'false').default('false'),
  ALERTS_EMAIL: Joi.string().email({ tlds: false }).allow('').optional(),
  SERVICE_DOWN_THRESHOLD: Joi.number().default(300000), // 5 minutes

  // Soft delete
  SOFT_DELETE_RETENTION_DAYS: Joi.number().default(90),

  // 2FA
  TWO_FACTOR_ENCRYPTION_KEY: Joi.string().min(16).allow('').optional(),
  TWO_FACTOR_REQUIRED_ROLES: Joi.string().default('patron'),

  // Security Alerts
  SECURITY_ALERT_THRESHOLD: Joi.number().default(5),
  SECURITY_ALERT_WINDOW_MINUTES: Joi.number().default(10),
  SECURITY_ALERT_EMAIL: Joi.string().email({ tlds: false }).allow('').optional(),
});

export interface EnvConfig {
  NODE_ENV: 'development' | 'test' | 'production';
  DATABASE_URL: string;
  API_PORT: number;
  API_HOST: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  S3_ENDPOINT?: string;
  S3_ACCESS_KEY?: string;
  S3_SECRET_KEY?: string;
  S3_BUCKET: string;
  S3_REGION: string;
  SMTP_HOST?: string;
  SMTP_PORT: number;
  SMTP_USER?: string;
  SMTP_PASSWORD?: string;
  SMTP_FROM: string;
  LOG_LEVEL: 'error' | 'warn' | 'info' | 'debug';
  THROTTLE_TTL: number;
  THROTTLE_LIMIT: number;
  CORS_ORIGINS: string;
  RELANCE_ENABLED: 'true' | 'false';
  RELANCE_J1: number;
  RELANCE_J2: number;
  RELANCE_J3: number;
  COMPANY_BCC_EMAIL?: string;
  BACKUP_ENABLED: 'true' | 'false';
  BACKUP_BUCKET: string;
  BACKUP_RETENTION_DAYS: number;
  ALERTS_ENABLED: 'true' | 'false';
  ALERTS_EMAIL?: string;
  SERVICE_DOWN_THRESHOLD: number;
  SOFT_DELETE_RETENTION_DAYS: number;
  TWO_FACTOR_ENCRYPTION_KEY?: string;
  TWO_FACTOR_REQUIRED_ROLES: string;
  SECURITY_ALERT_THRESHOLD: number;
  SECURITY_ALERT_WINDOW_MINUTES: number;
  SECURITY_ALERT_EMAIL?: string;
}
