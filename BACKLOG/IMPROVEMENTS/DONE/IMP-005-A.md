# IMP-005-A: Modele KnownDevice et tracking fingerprint

**Type:** Improvement
**Statut:** Fait
**Date completion:** 2026-02-03
**Priorite:** Moyenne
**Complexite:** S
**Tags:** security, auth, database
**Parent:** IMP-005
**Date creation:** 2026-02-03
**Automatisable:** OUI

---

## Description

Creer le modele Prisma `KnownDevice` et le service de tracking des devices. A chaque connexion, generer un fingerprint basique (User-Agent + Accept-Language) et l'associer a l'utilisateur.

## Scope limite

- Schema Prisma KnownDevice uniquement
- Service DeviceTrackingService avec methode registerDevice()
- Integration dans AuthService.login() pour enregistrer le device
- PAS de geolocalisation (ticket suivant)
- PAS d'email d'alerte (ticket suivant)

## Criteres d'acceptation

- [ ] Model KnownDevice dans schema.prisma avec migration
- [ ] DeviceTrackingService cree avec generateFingerprint() et registerDevice()
- [ ] AuthService.login() appelle registerDevice() apres login reussi
- [ ] Tests unitaires pour generateFingerprint()
- [ ] Tests unitaires pour registerDevice()
- [ ] Test e2e: login cree un KnownDevice en BDD

## Fichiers concernes

- `packages/database/prisma/schema.prisma`
- `apps/api/src/modules/auth/device-tracking.service.ts` (nouveau)
- `apps/api/src/modules/auth/auth.service.ts`
- `apps/api/src/modules/auth/auth.module.ts`

## Analyse technique

```prisma
model KnownDevice {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  fingerprint String   // Hash SHA256 de User-Agent + Accept-Language
  name        String?  // Deduit du User-Agent: "Chrome sur Windows"
  lastIp      String
  lastCountry String?  // Rempli par IMP-005-B
  lastCity    String?  // Rempli par IMP-005-B
  lastUsedAt  DateTime @updatedAt
  trustedAt   DateTime?
  createdAt   DateTime @default(now())

  @@unique([userId, fingerprint])
  @@index([userId])
}
```

Fingerprint = SHA256(User-Agent + Accept-Language)

---

## SECTION AUTOMATISATION

**Score:** 95/100
**Risque:** Faible - travail de schema et service standard

### Prompt d'execution

```
Tu dois implementer le tracking des devices pour IMP-005-A.

ETAPE 1 - Schema Prisma:
- Ajouter model KnownDevice dans packages/database/prisma/schema.prisma
- Ajouter relation dans model User: knownDevices KnownDevice[]
- Generer migration: cd packages/database && npx prisma migrate dev --name add_known_devices

ETAPE 2 - DeviceTrackingService:
- Creer apps/api/src/modules/auth/device-tracking.service.ts
- Methode generateFingerprint(request: Request): string
  - Extraire User-Agent et Accept-Language des headers
  - Retourner SHA256 hash (utiliser crypto de Node.js)
- Methode parseDeviceName(userAgent: string): string
  - Parser User-Agent pour retourner "Chrome sur Windows" etc.
- Methode async registerDevice(userId: string, request: Request): Promise<{device: KnownDevice, isNew: boolean}>
  - Generer fingerprint
  - Upsert dans KnownDevice
  - Retourner si c'est un nouveau device ou pas

ETAPE 3 - Integration AuthService:
- Modifier apps/api/src/modules/auth/auth.service.ts
- Dans la methode login(), apres verification credentials:
  - Appeler deviceTrackingService.registerDevice()
  - Logger si nouveau device (pour futur email)

ETAPE 4 - Tests:
- Tests unitaires pour generateFingerprint() et parseDeviceName()
- Test e2e: POST /auth/login cree un KnownDevice

VERIFICATION: npm run test && npm run test:e2e
```

### Criteres de succes automatises

```bash
# Schema migre
npx prisma migrate status | grep -q "applied"

# Tests passent
npm run test -- --grep "DeviceTracking"
npm run test:e2e -- --grep "login.*device"
```
