# FEAT-077-A: Schema BDD WebAuthnCredential + Migration

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** XS
**Tags:** security, auth, database
**Parent:** FEAT-077
**Date creation:** 2026-02-03

---

## Description

Creer le modele Prisma `WebAuthnCredential` pour stocker les credentials WebAuthn (cles publiques) des utilisateurs. Ce modele permet l'authentification biometrique multi-devices.

## Scope limite

- Ajout du modele `WebAuthnCredential` dans le schema Prisma
- Relation avec `User` (un user peut avoir plusieurs credentials)
- Generation et execution de la migration

## Criteres d'acceptation

- [ ] Modele `WebAuthnCredential` ajoute dans `schema.prisma`
- [ ] Champs: id, userId, credentialId, publicKey, counter, deviceName, deviceType, transports, lastUsedAt, createdAt
- [ ] Index sur `userId` pour les lookups rapides
- [ ] Contrainte unique sur `credentialId`
- [ ] Relation `User.webAuthnCredentials` ajoutee
- [ ] Migration generee et appliquee sans erreur
- [ ] Tests: verification que le modele est accessible via Prisma Client

## Fichiers concernes

- `packages/database/prisma/schema.prisma`
- `packages/database/prisma/migrations/` (nouvelle migration)

## SECTION AUTOMATISATION

**Score:** 95/100

### Raison du score
- Schema Prisma clairement defini dans le ticket parent
- Aucune ambiguite sur les champs
- Migration automatique

### Prompt d'execution

```
Tu dois ajouter le modele WebAuthnCredential au schema Prisma.

1. Ouvre `packages/database/prisma/schema.prisma`

2. Ajoute ce modele:

model WebAuthnCredential {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  credentialId    String   @unique
  publicKey       String
  counter         Int      @default(0)
  deviceName      String?
  deviceType      String?  // "platform" ou "cross-platform"
  transports      String[] // ["internal", "usb", "nfc", "ble"]
  lastUsedAt      DateTime?
  createdAt       DateTime @default(now())

  @@index([userId])
}

3. Ajoute la relation inverse dans le modele User:
   webAuthnCredentials WebAuthnCredential[]

4. Execute:
   cd packages/database
   npx prisma migrate dev --name add_webauthn_credentials
   npx prisma generate

5. Verifie que le client Prisma est regenere sans erreur

6. Cree un test simple dans `packages/database/src/__tests__/webauthn-credential.test.ts`:
   - Test que le modele existe dans PrismaClient
   - Test create/read/delete basique
```

### Criteres de succes automatises

- `npx prisma validate` passe
- Migration appliquee sans erreur
- Tests passent
