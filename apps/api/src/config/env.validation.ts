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
}
