# IMP-004-A: SecurityAuditService - Types et service de base

**Type:** Improvement
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** security, api
**Parent:** IMP-004

## Description

Creer le service de base pour les audit logs securite: enum des types d'evenements, interface SecurityEvent, et service d'enregistrement.

## Scope

- Enum `SecurityEventType` avec tous les types d'evenements
- Interface `SecurityEvent` avec metadata
- `SecurityAuditService` avec methode `logSecurityEvent()`
- Extension du schema Prisma pour le type SECURITY dans AuditLog
- Tests unitaires du service

## Criteres d'acceptation

- [ ] Enum SecurityEventType: LOGIN_SUCCESS, LOGIN_FAILED, 2FA_ENABLED, 2FA_DISABLED, 2FA_FAILED, PASSWORD_CHANGED, PASSWORD_RESET_REQUESTED, TOKEN_REFRESH, TOKEN_REVOKED, PERMISSION_DENIED, RATE_LIMIT_EXCEEDED, SUSPICIOUS_ACTIVITY
- [ ] Interface SecurityEvent avec: type, userId?, ip, userAgent, metadata, severity (info|warning|critical), timestamp
- [ ] SecurityAuditService injectable avec logSecurityEvent()
- [ ] Enregistrement en base via AuditLog avec type=SECURITY
- [ ] Tests unitaires avec > 80% coverage

## Fichiers a creer/modifier

- `apps/api/src/modules/audit/security-event.types.ts` (nouveau)
- `apps/api/src/modules/audit/security-audit.service.ts` (nouveau)
- `apps/api/src/modules/audit/security-audit.service.spec.ts` (nouveau)
- `apps/api/src/modules/audit/audit.module.ts` (modifier pour exporter)
- `packages/database/prisma/schema.prisma` (si besoin d'etendre AuditLogType)

## SECTION AUTOMATISATION

**Score:** 90/100
**Raison:** Code nouveau, types clairs, pas de dependances externes complexes

### Prompt d'execution

```
Tu implementes IMP-004-A: SecurityAuditService de base.

1. Cree apps/api/src/modules/audit/security-event.types.ts:
   - Enum SecurityEventType avec les 12 types d'events
   - Interface SecurityEvent avec tous les champs
   - Type SecuritySeverity = 'info' | 'warning' | 'critical'

2. Cree apps/api/src/modules/audit/security-audit.service.ts:
   - Injectable, injecte PrismaService
   - Methode logSecurityEvent(event: Partial<SecurityEvent>): Promise<void>
   - Renseigne automatiquement timestamp
   - Stocke dans AuditLog avec type SECURITY

3. Cree les tests unitaires security-audit.service.spec.ts:
   - Test logSecurityEvent cree bien un AuditLog
   - Test les differents types d'events
   - Mock PrismaService

4. Modifie audit.module.ts pour exporter SecurityAuditService

5. Lance les tests: pnpm test apps/api/src/modules/audit/

Commit: feat(api): add SecurityAuditService with event types
```

## Tests de validation

- [ ] `pnpm test apps/api/src/modules/audit/security-audit.service.spec.ts` passe
- [ ] SecurityAuditService est injectable dans d'autres modules
- [ ] Un appel a logSecurityEvent() cree bien un enregistrement en base
