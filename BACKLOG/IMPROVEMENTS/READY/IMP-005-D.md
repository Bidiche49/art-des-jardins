# IMP-005-D: Historique connexions et revocation devices

**Type:** Improvement
**Statut:** A faire
**Priorite:** Moyenne
**Complexite:** S
**Tags:** security, auth, api
**Parent:** IMP-005
**Date creation:** 2026-02-03
**Automatisable:** OUI

---

## Description

Creer les endpoints API pour que l'utilisateur puisse voir son historique de connexions (devices connus) et revoquer manuellement des devices depuis son profil.

## Scope limite

- Endpoints CRUD pour KnownDevices de l'utilisateur connecte
- Liste des devices avec pagination
- Revocation individuelle d'un device
- PAS d'interface frontend (sera fait dans un ticket PWA)

## Criteres d'acceptation

- [ ] GET /auth/devices - Liste des devices de l'utilisateur connecte
- [ ] GET /auth/devices/:id - Detail d'un device
- [ ] DELETE /auth/devices/:id - Revoquer un device specifique
- [ ] Impossible de revoquer le device actuel (erreur 400)
- [ ] Revocation supprime aussi les refresh tokens associes
- [ ] Pagination sur la liste (limit, offset)
- [ ] Tests e2e pour tous les endpoints

## Fichiers concernes

- `apps/api/src/modules/auth/auth.controller.ts`
- `apps/api/src/modules/auth/device-tracking.service.ts`
- `apps/api/src/modules/auth/dto/device.dto.ts` (nouveau)

## Analyse technique

```typescript
// GET /auth/devices
interface DeviceListResponse {
  devices: DeviceDto[];
  total: number;
}

interface DeviceDto {
  id: string;
  name: string;         // "Chrome sur Windows"
  lastIp: string;
  lastCountry?: string;
  lastCity?: string;
  lastUsedAt: Date;
  trustedAt?: Date;
  isCurrent: boolean;   // true si c'est le device de la requete actuelle
  createdAt: Date;
}
```

Pour determiner le device actuel: comparer fingerprint de la requete avec les devices.

---

## SECTION AUTOMATISATION

**Score:** 95/100
**Risque:** Faible - CRUD standard

### Prompt d'execution

```
Tu dois implementer les endpoints de gestion des devices pour IMP-005-D.

PRE-REQUIS: IMP-005-A, B, C doivent etre completes.

ETAPE 1 - DTOs:
- Creer apps/api/src/modules/auth/dto/device.dto.ts
- DeviceDto avec tous les champs + isCurrent
- DeviceListQueryDto avec limit (default 20), offset (default 0)
- DeviceListResponseDto avec devices[] et total

ETAPE 2 - Service methods:
- Dans DeviceTrackingService, ajouter:
  - async getDevices(userId, query): Promise<{ devices, total }>
  - async getDevice(userId, deviceId): Promise<KnownDevice | null>
  - async revokeDevice(userId, deviceId, currentFingerprint): Promise<void>
    - Verifier que deviceId != device actuel
    - Supprimer le device
    - Supprimer les refresh tokens lies a ce device (si tracking)

ETAPE 3 - Controller endpoints:
- Dans AuthController:
- @Get('devices') @UseGuards(JwtAuthGuard)
  - Extraire userId du token
  - Appeler getDevices avec query params
  - Ajouter isCurrent = true si fingerprint match
- @Get('devices/:id') @UseGuards(JwtAuthGuard)
  - Verifier que le device appartient a l'utilisateur
- @Delete('devices/:id') @UseGuards(JwtAuthGuard)
  - Verifier ownership
  - Verifier pas le device actuel (400 "Cannot revoke current device")
  - Appeler revokeDevice

ETAPE 4 - Tests:
- Test e2e: GET /auth/devices retourne liste
- Test e2e: pagination fonctionne
- Test e2e: DELETE revoque le device
- Test e2e: DELETE sur device actuel retourne 400
- Test e2e: impossible d'acceder aux devices d'un autre user

VERIFICATION: npm run test:e2e -- --grep "devices"
```

### Criteres de succes automatises

```bash
# Tests passent
npm run test:e2e -- --grep -i "devices"

# Endpoints existent (compilation OK)
npx tsc --noEmit
```
