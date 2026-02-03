# IMP-004-C: Systeme d'alertes securite

**Type:** Improvement
**Statut:** Fait
**Priorite:** Haute
**Date completion:** 2026-02-03
**Complexite:** S
**Tags:** security, api, alerts
**Parent:** IMP-004
**Depends:** IMP-004-A, IMP-004-B

## Description

Implementer la detection de patterns suspects et l'envoi d'alertes email pour les evenements de securite critiques.

## Scope

- SecurityAlertService avec detection de patterns
- Detection bruteforce: > 5 LOGIN_FAILED en 10 min pour meme user
- Detection suspicious: patterns configures
- Envoi d'alerte email via MailService
- Configuration des seuils via env

## Criteres d'acceptation

- [x] SecurityAlertService avec methode checkAndAlert(event: SecurityEvent)
- [x] Detection bruteforce: compte les LOGIN_FAILED par user sur sliding window 10 min
- [x] Alerte email envoyee si seuil depasse (5 par defaut)
- [x] Log SUSPICIOUS_ACTIVITY cree quand pattern detecte
- [x] Seuils configurables: SECURITY_ALERT_THRESHOLD, SECURITY_ALERT_WINDOW_MINUTES
- [x] Tests unitaires avec mocks

## Fichiers a creer/modifier

- `apps/api/src/modules/alerts/security-alert.service.ts` (nouveau)
- `apps/api/src/modules/alerts/security-alert.service.spec.ts` (nouveau)
- `apps/api/src/modules/alerts/alerts.module.ts` (modifier)
- `apps/api/src/modules/audit/security-audit.service.ts` (appeler SecurityAlertService)
- `apps/api/src/config/env.validation.ts` (ajouter variables)

## SECTION AUTOMATISATION

**Score:** 80/100
**Raison:** Logique de detection, integration avec mail existant

### Prompt d'execution

```
Tu implementes IMP-004-C: Systeme d'alertes securite.

Prerequis: IMP-004-A et IMP-004-B doivent etre faits.

1. Ajoute les variables d'env dans config/env.validation.ts:
   - SECURITY_ALERT_THRESHOLD (default: 5)
   - SECURITY_ALERT_WINDOW_MINUTES (default: 10)
   - SECURITY_ALERT_EMAIL (email admin)

2. Cree apps/api/src/modules/alerts/security-alert.service.ts:
   - Injectable, injecte PrismaService, MailService, ConfigService
   - checkAndAlert(event: SecurityEvent): Promise<void>
   - Pour LOGIN_FAILED: compte les events du meme userId dans les X dernières minutes
   - Si > seuil: envoie email alerte et log SUSPICIOUS_ACTIVITY

3. Modifie alerts.module.ts:
   - Exporte SecurityAlertService
   - Import MailModule

4. Modifie security-audit.service.ts:
   - Injecte SecurityAlertService
   - Appelle checkAndAlert() apres chaque logSecurityEvent()

5. Cree les tests security-alert.service.spec.ts:
   - Mock PrismaService.auditLog.count()
   - Test qu'aucune alerte si < seuil
   - Test alerte envoyee si >= seuil

6. Lance: pnpm test apps/api/src/modules/alerts/

Commit: feat(api): add security alert system with bruteforce detection
```

## Tests de validation

- [x] `pnpm test apps/api/src/modules/alerts/security-alert.service.spec.ts` passe
- [x] 4 LOGIN_FAILED = pas d'alerte
- [x] 5 LOGIN_FAILED en 10 min = alerte email
- [x] Log SUSPICIOUS_ACTIVITY cree lors de l'alerte

## Notes d'implementation

- Le ticket mentionnait `security-audit.service.ts` mais ce fichier n'existe pas. L'integration a ete faite dans `audit.service.ts` (le seul service d'audit existant).
- La detection par IP utilise un seuil double (10) car plusieurs users peuvent etre derriere un NAT.
- L'appel a `checkAndAlert()` est fait de maniere asynchrone pour ne pas bloquer l'audit log.
