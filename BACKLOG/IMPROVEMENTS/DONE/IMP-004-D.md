# IMP-004-D: Dashboard securite et export CSV

**Type:** Improvement
**Statut:** Fait
**Priorite:** Haute
**Date completion:** 2026-02-03
**Complexite:** S
**Tags:** security, api, admin
**Parent:** IMP-004
**Depends:** IMP-004-A, IMP-004-B

## Description

Creer les endpoints API pour le dashboard securite admin: liste des logs securite avec filtres, statistiques, et export CSV.

## Scope

- Endpoint GET /api/v1/admin/security-logs avec pagination et filtres
- Endpoint GET /api/v1/admin/security-logs/stats pour statistiques
- Endpoint GET /api/v1/admin/security-logs/export pour CSV
- Filtres: type, userId, dateRange, severity
- Reserve aux admins (guard)

## Criteres d'acceptation

- [x] GET /admin/security-logs retourne les logs pagines
- [x] Filtres: ?type=LOGIN_FAILED&userId=xxx&from=date&to=date&severity=warning
- [x] GET /admin/security-logs/stats retourne: total par type, top users avec echecs, tendance
- [x] GET /admin/security-logs/export retourne CSV avec tous les champs
- [x] Endpoints proteges par AdminGuard (RolesGuard avec role patron)
- [x] Tests unitaires (44 tests passent)

## Fichiers a creer/modifier

- `apps/api/src/modules/audit/security-logs.controller.ts` (nouveau)
- `apps/api/src/modules/audit/security-logs.controller.spec.ts` (nouveau)
- `apps/api/src/modules/audit/dto/security-logs-query.dto.ts` (nouveau)
- `apps/api/src/modules/audit/audit.module.ts` (ajouter controller)

## SECTION AUTOMATISATION

**Score:** 85/100
**Raison:** CRUD classique, CSV standard

### Prompt d'execution

```
Tu implementes IMP-004-D: Dashboard securite et export CSV.

Prerequis: IMP-004-A doit etre fait (logs securite existent en base).

1. Cree apps/api/src/modules/audit/dto/security-logs-query.dto.ts:
   - SecurityLogsQueryDto avec: type?, userId?, from?, to?, severity?, page, limit
   - Validation avec class-validator

2. Cree apps/api/src/modules/audit/security-logs.controller.ts:
   - @Controller('admin/security-logs')
   - @UseGuards(AdminGuard) sur tout le controller

   Endpoints:
   - GET / : liste paginee avec filtres
   - GET /stats : { totalByType: {}, topFailedUsers: [], dailyTrend: [] }
   - GET /export : Response CSV (text/csv)

3. Implemente la logique dans SecurityAuditService:
   - findSecurityLogs(query: SecurityLogsQueryDto): Promise<PaginatedResult>
   - getSecurityStats(from?: Date, to?: Date): Promise<SecurityStats>
   - exportToCsv(query: SecurityLogsQueryDto): Promise<string>

4. Modifie audit.module.ts:
   - Ajoute SecurityLogsController aux controllers

5. Cree les tests security-logs.controller.spec.ts:
   - Test GET / retourne liste paginee
   - Test filtres fonctionnent
   - Test /stats retourne les stats
   - Test /export retourne CSV valide
   - Test protection admin (401 sans auth, 403 si pas admin)

6. Lance: pnpm test apps/api/src/modules/audit/security-logs

Commit: feat(api): add security logs dashboard endpoints with CSV export
```

## Tests de validation

- [x] `pnpm test apps/api/src/modules/audit/security-logs.controller.spec.ts` passe (10 tests)
- [x] Tests unitaires service security logs (34 tests nouveaux dans audit.service.spec.ts)
- [x] Guards JwtAuthGuard et RolesGuard appliques
- [x] Role patron requis (teste)
- [x] Export CSV genere avec headers corrects
