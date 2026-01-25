# FEAT-006: RBAC et Audit Logs

**Type:** Feature
**Statut:** READY
**Priorite:** Haute
**Complexite:** M
**Tags:** security, auth, rbac
**Date creation:** 2025-01-25

---

## Description
Implementer le systeme de roles et permissions avec audit trail.
Note: Les guards et decorators de base existent deja. Ajouter l'interceptor audit et le module audit.

## User Story
**En tant que** patron
**Je veux** controler qui peut faire quoi
**Afin de** securiser les donnees de l'entreprise

## Criteres d'acceptation
- [x] Roles: Patron, Employe - DEJA FAIT (enum dans Prisma + decorators)
- [x] Decorator @Roles() pour endpoints - DEJA FAIT
- [x] Guard RBAC - DEJA FAIT (RolesGuard)
- [ ] Module Audit avec service
- [ ] Interceptor AuditLog pour logging automatique
- [ ] Endpoint GET /audit-logs (patron only)
- [ ] Endpoint GET /audit-logs/export (CSV)

## Fichiers concernes
- `apps/api/src/modules/audit/audit.module.ts`
- `apps/api/src/modules/audit/audit.service.ts`
- `apps/api/src/modules/audit/audit.controller.ts`
- `apps/api/src/common/interceptors/audit.interceptor.ts`

## Analyse / Approche
1. Creer module audit avec service utilisant Prisma AuditLog
2. Creer interceptor qui log les actions POST/PUT/DELETE
3. Appliquer l'interceptor globalement ou par controller
4. Endpoints pour consulter et exporter les logs

## Contexte technique
- Table audit_logs existe dans schema Prisma
- RolesGuard et @Roles decorator existent
- UserRole enum: patron, employe

## Tests de validation
- [ ] Actions POST/PUT/DELETE loguees
- [ ] GET /audit-logs retourne les logs (patron)
- [ ] Employe n'a pas acces aux logs
- [ ] Export CSV fonctionne
