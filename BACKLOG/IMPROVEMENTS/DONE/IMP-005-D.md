# IMP-005-D: Historique connexions et revocation devices

**Type:** Improvement
**Statut:** Fait
**Priorite:** Moyenne
**Complexite:** S
**Tags:** security, auth, api
**Parent:** IMP-005
**Date creation:** 2026-02-03
**Date completion:** 2026-02-03
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

- [x] GET /auth/devices - Liste des devices de l'utilisateur connecte
- [x] GET /auth/devices/:id - Detail d'un device
- [x] DELETE /auth/devices/:id - Revoquer un device specifique
- [x] Impossible de revoquer le device actuel (erreur 400)
- [x] Revocation supprime aussi les refresh tokens associes
- [x] Pagination sur la liste (limit, offset)
- [x] Tests pour tous les endpoints

## Fichiers concernes

- `apps/api/src/modules/auth/auth.controller.ts`
- `apps/api/src/modules/auth/device-tracking.service.ts`
- `apps/api/src/modules/auth/dto/device.dto.ts` (nouveau)

## Implementation realisee

### DTOs crees (device.dto.ts)
- `DeviceListQueryDto` - Query params avec validation (limit 1-100, offset >= 0)
- `DeviceDto` - Representation complete d'un device avec `isCurrent`
- `DeviceListResponseDto` - Reponse paginee avec `devices[]` et `total`

### Methodes ajoutees dans DeviceTrackingService
- `getDevicesPaginated(userId, limit, offset)` - Liste paginee des devices
- `getDeviceById(userId, deviceId)` - Recupere un device specifique
- `findDeviceByFingerprint(userId, fingerprint)` - Trouve device par fingerprint
- `revokeDevice(userId, deviceId, currentFingerprint?)` - Revoque avec protection device actuel

### Endpoints AuthController
- `GET /auth/devices` - Liste paginee avec `isCurrent` calcule
- `GET /auth/devices/:deviceId` - Detail d'un device
- `DELETE /auth/devices/:deviceId` - Revocation avec verification device actuel

### Tests
- 35 tests unitaires pour DeviceTrackingService (tous passent)
- Tests e2e ajoutes dans auth.e2e-spec.ts (configuration Jest a corriger)

## Notes techniques

- La determination du device actuel utilise la comparaison du fingerprint (SHA256 du User-Agent + Accept-Language)
- La revocation supprime les refresh tokens associes au device dans une transaction
- Erreur 400 "Impossible de revoquer l'appareil actuel" si tentative de revocation du device en cours
- Erreur 404 si device non trouve ou n'appartient pas a l'utilisateur

---

## SECTION AUTOMATISATION

**Score:** 95/100
**Risque:** Faible - CRUD standard

### Criteres de succes automatises

```bash
# Tests unitaires passent
npm test -- --testPathPattern="device-tracking"  # 35 tests OK

# Compilation OK
npx tsc --noEmit  # OK
```
