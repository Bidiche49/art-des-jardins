# IMP-004-B: Integration des events securite dans AuthService

**Type:** Improvement
**Statut:** Fait
**Priorite:** Haute
**Date completion:** 2026-02-03
**Complexite:** S
**Tags:** security, api, auth
**Parent:** IMP-004
**Depends:** IMP-004-A

## Description

Integrer le SecurityAuditService dans auth.service.ts pour logger tous les evenements de securite lies a l'authentification.

## Scope

- Injecter SecurityAuditService dans AuthService
- Logger LOGIN_SUCCESS et LOGIN_FAILED
- Logger 2FA_ENABLED, 2FA_DISABLED, 2FA_FAILED
- Logger PASSWORD_CHANGED, PASSWORD_RESET_REQUESTED
- Logger TOKEN_REFRESH, TOKEN_REVOKED
- Extraire IP et User-Agent depuis Request

## Criteres d'acceptation

- [x] AuthService injecte SecurityAuditService
- [x] login() log LOGIN_SUCCESS ou LOGIN_FAILED avec IP/UA
- [x] enable2FA() log 2FA_ENABLED (via verify2FASetup)
- [x] disable2FA() log 2FA_DISABLED
- [x] verify2FA() log 2FA_FAILED sur echec
- [ ] changePassword() log PASSWORD_CHANGED (methode non existante)
- [ ] requestPasswordReset() log PASSWORD_RESET_REQUESTED (methode non existante)
- [x] refreshToken() log TOKEN_REFRESH
- [x] logout() log TOKEN_REVOKED
- [x] Tests d'integration verifient les logs

## Fichiers a modifier

- `apps/api/src/modules/auth/auth.service.ts`
- `apps/api/src/modules/auth/auth.module.ts` (import AuditModule)
- `apps/api/src/modules/auth/auth.service.spec.ts`
- `apps/api/src/modules/auth/two-factor.service.ts`

## SECTION AUTOMATISATION

**Score:** 85/100
**Raison:** Integration dans code existant, necessite lecture prealable

### Prompt d'execution

```
Tu implementes IMP-004-B: Integration SecurityAuditService dans AuthService.

Prerequis: IMP-004-A doit etre fait (SecurityAuditService existe).

1. Lis apps/api/src/modules/auth/auth.service.ts pour comprendre la structure

2. Modifie auth.module.ts:
   - Import AuditModule

3. Modifie auth.service.ts:
   - Injecte SecurityAuditService dans le constructeur
   - Dans login(): log LOGIN_SUCCESS ou LOGIN_FAILED
   - Dans refreshToken(): log TOKEN_REFRESH
   - Dans logout(): log TOKEN_REVOKED
   - Dans changePassword(): log PASSWORD_CHANGED
   - Dans requestPasswordReset(): log PASSWORD_RESET_REQUESTED
   - Extraire IP via request.ip et UA via request.headers['user-agent']

4. Modifie two-factor.service.ts:
   - Injecte SecurityAuditService
   - enable2FA(): log 2FA_ENABLED
   - disable2FA(): log 2FA_DISABLED
   - verify(): log 2FA_FAILED sur echec

5. Met a jour les tests pour mocker SecurityAuditService

6. Lance: pnpm test apps/api/src/modules/auth/

Commit: feat(api): integrate security audit logging in auth
```

## Tests de validation

- [x] `pnpm test apps/api/src/modules/auth/` passe
- [x] Un login reussi cree un log LOGIN_SUCCESS en base
- [x] Un login echoue cree un log LOGIN_FAILED
- [x] Les logs contiennent IP et User-Agent

## Notes d'implementation

Les methodes `changePassword()` et `requestPasswordReset()` n'existent pas encore dans AuthService.
L'audit pour ces methodes sera ajoute quand elles seront implementees (probablement dans un ticket separe).
