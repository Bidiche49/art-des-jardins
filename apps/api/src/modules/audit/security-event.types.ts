/**
 * Types pour les événements de sécurité
 * SecurityAuditService utilise ces types pour logger les événements de sécurité
 */

/**
 * Types d'événements de sécurité
 */
export enum SecurityEventType {
  // Authentification
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',

  // 2FA
  TWO_FACTOR_ENABLED = '2FA_ENABLED',
  TWO_FACTOR_DISABLED = '2FA_DISABLED',
  TWO_FACTOR_FAILED = '2FA_FAILED',

  // Mots de passe
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  PASSWORD_RESET_REQUESTED = 'PASSWORD_RESET_REQUESTED',

  // Tokens
  TOKEN_REFRESH = 'TOKEN_REFRESH',
  TOKEN_REVOKED = 'TOKEN_REVOKED',

  // Sécurité
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
}

/**
 * Niveau de sévérité d'un événement de sécurité
 */
export type SecuritySeverity = 'info' | 'warning' | 'critical';

/**
 * Interface pour un événement de sécurité
 */
export interface SecurityEvent {
  /** Type de l'événement */
  type: SecurityEventType;

  /** ID de l'utilisateur concerné (peut être null pour les événements anonymes) */
  userId?: string;

  /** Adresse IP de la requête */
  ip: string;

  /** User-Agent du navigateur */
  userAgent: string;

  /** Métadonnées additionnelles (détails spécifiques à l'événement) */
  metadata?: Record<string, unknown>;

  /** Niveau de sévérité */
  severity: SecuritySeverity;

  /** Timestamp de l'événement */
  timestamp: Date;
}

/**
 * Input pour créer un événement de sécurité
 * Le timestamp est automatiquement renseigné par le service
 */
export type CreateSecurityEventInput = Omit<SecurityEvent, 'timestamp'> & {
  timestamp?: Date;
};

/**
 * Mapping des types d'événements vers leur sévérité par défaut
 */
export const DEFAULT_SEVERITY_MAP: Record<SecurityEventType, SecuritySeverity> = {
  [SecurityEventType.LOGIN_SUCCESS]: 'info',
  [SecurityEventType.LOGIN_FAILED]: 'warning',
  [SecurityEventType.LOGOUT]: 'info',
  [SecurityEventType.TWO_FACTOR_ENABLED]: 'info',
  [SecurityEventType.TWO_FACTOR_DISABLED]: 'warning',
  [SecurityEventType.TWO_FACTOR_FAILED]: 'warning',
  [SecurityEventType.PASSWORD_CHANGED]: 'info',
  [SecurityEventType.PASSWORD_RESET_REQUESTED]: 'info',
  [SecurityEventType.TOKEN_REFRESH]: 'info',
  [SecurityEventType.TOKEN_REVOKED]: 'info',
  [SecurityEventType.PERMISSION_DENIED]: 'warning',
  [SecurityEventType.RATE_LIMIT_EXCEEDED]: 'warning',
  [SecurityEventType.SUSPICIOUS_ACTIVITY]: 'critical',
};
