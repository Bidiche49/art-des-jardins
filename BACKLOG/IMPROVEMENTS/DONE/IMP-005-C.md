# IMP-005-C: Email alerte nouveau device + actions

**Type:** Improvement
**Statut:** Fait
**Priorite:** Moyenne
**Date completion:** 2026-02-03
**Complexite:** S
**Tags:** security, auth, mail
**Parent:** IMP-005
**Date creation:** 2026-02-03
**Automatisable:** OUI

---

## Description

Envoyer un email d'alerte quand un utilisateur se connecte depuis un nouveau device. L'email contient les infos de connexion et deux actions: "C'etait moi" (valide le device) et "Ce n'etait pas moi" (revoque les sessions).

## Scope limite

- Template email new-login-alert
- Envoi email si nouveau device detecte
- Endpoints pour actions "c'etait moi" / "pas moi"
- Tokens securises pour les actions email
- PAS d'interface utilisateur (ticket suivant)

## Criteres d'acceptation

- [x] Template email new-login-alert.hbs avec infos device/localisation
- [x] Email envoye uniquement si registerDevice() retourne isNew=true
- [x] Token JWT signe pour les liens d'action (expire 24h)
- [x] GET /auth/device/trust/:token valide le device (trustedAt = now)
- [x] GET /auth/device/revoke/:token revoque toutes les sessions sauf actuelle
- [x] Tests unitaires pour generation/validation tokens
- [x] Test e2e: nouveau device declenche email

## Fichiers concernes

- `apps/api/src/modules/mail/templates/new-login-alert.hbs` (nouveau)
- `apps/api/src/modules/auth/device-tracking.service.ts`
- `apps/api/src/modules/auth/auth.controller.ts`
- `apps/api/src/modules/auth/auth.service.ts`

## Analyse technique

Template email:
```
Nouvelle connexion detectee

Bonjour {{userName}},

Une connexion a votre compte a ete detectee depuis un nouvel appareil:

- Appareil: {{deviceName}}
- IP: {{ip}}
- Localisation: {{city}}, {{country}}
- Date: {{date}}

C'etait vous? [C'etait moi] [Ce n'etait pas moi]

Si vous n'etes pas a l'origine de cette connexion, cliquez sur
"Ce n'etait pas moi" pour securiser votre compte.
```

Token action: JWT avec { userId, deviceId, action: 'trust' | 'revoke', exp: 24h }

---

## SECTION AUTOMATISATION

**Score:** 85/100
**Risque:** Moyen - integration mail, mais patterns existants

### Prompt d'execution

```
Tu dois implementer les alertes email pour IMP-005-C.

PRE-REQUIS: IMP-005-A et IMP-005-B doivent etre completes.

ETAPE 1 - Template email:
- Creer apps/api/src/modules/mail/templates/new-login-alert.hbs
- Variables: userName, deviceName, ip, city, country, date
- Liens: trustUrl, revokeUrl
- Style coherent avec autres templates existants

ETAPE 2 - Generation tokens action:
- Dans DeviceTrackingService, ajouter:
  - generateActionToken(userId, deviceId, action): string
  - validateActionToken(token): { userId, deviceId, action } | null
- Utiliser JWT avec secret dedie (DEVICE_ACTION_SECRET dans .env)
- Expiration 24h

ETAPE 3 - Envoi email:
- Dans registerDevice(), si isNew === true:
  - Generer tokens trust et revoke
  - Construire URLs: {APP_URL}/auth/device/trust/{token}
  - Appeler mailService.sendNewLoginAlert(user, device, geoLocation, urls)

ETAPE 4 - Endpoints actions:
- GET /auth/device/trust/:token
  - Valider token
  - Update KnownDevice.trustedAt = now()
  - Redirect vers page de confirmation
- GET /auth/device/revoke/:token
  - Valider token
  - Supprimer toutes les sessions de l'utilisateur (refresh tokens)
  - Supprimer le device non trusted
  - Redirect vers page login

ETAPE 5 - Tests:
- Test unitaire: generateActionToken/validateActionToken
- Test: token expire apres 24h
- Test e2e: nouveau device envoie email (mock SMTP)
- Test e2e: /trust valide le device
- Test e2e: /revoke supprime sessions

VERIFICATION: npm run test -- --grep "device" && npm run test:e2e -- --grep "device"
```

### Criteres de succes automatises

```bash
# Tests passent
npm run test -- --grep -i "device.*token\|alert"
npm run test:e2e -- --grep -i "device"

# Template existe
test -f apps/api/src/modules/mail/templates/new-login-alert.hbs
```
