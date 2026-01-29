# FEAT-026: Backend signature electronique devis

**Type:** Feature
**Statut:** A faire
**Priorite:** Critique
**Complexite:** M
**Tags:** api, signature, devis
**Date creation:** 2026-01-29
**Phase:** 5.1

---

## Description

Implementer le backend pour la signature electronique des devis. Permet aux clients de signer un devis via un lien unique envoye par email.

## User Story

**En tant que** patron
**Je veux** envoyer un devis a signer electroniquement
**Afin de** gagner du temps et professionnaliser le processus

## Criteres d'acceptation

- [ ] Endpoint `POST /devis/:id/send-for-signature` envoie email avec lien
- [ ] Lien unique avec token JWT (validite 7 jours)
- [ ] Endpoint `GET /signature/:token` retourne devis en lecture seule
- [ ] Endpoint `POST /signature/:token/sign` enregistre la signature
- [ ] Signature stockee : image base64, timestamp, IP, user-agent
- [ ] Statut devis passe automatiquement a "SIGNE"
- [ ] Audit log de la signature

## Fichiers concernes

- `apps/api/src/modules/devis/devis.controller.ts`
- `apps/api/src/modules/devis/devis.service.ts`
- `apps/api/src/modules/signature/` (nouveau module)
- `packages/database/prisma/schema.prisma` (table signatures)

## Analyse / Approche

1. Creer module `SignatureModule` dans l'API
2. Ajouter table `Signature` dans Prisma :
   ```prisma
   model Signature {
     id          String   @id @default(cuid())
     devisId     String   @unique
     devis       Devis    @relation(fields: [devisId], references: [id])
     imageBase64 String   @db.Text
     signedAt    DateTime @default(now())
     ipAddress   String
     userAgent   String
     token       String   @unique
     expiresAt   DateTime
   }
   ```
3. Service : generer token JWT, verifier expiration, stocker signature
4. Controller : endpoints publics (pas d'auth) pour signature

## Tests de validation

- [ ] Test unitaire SignatureService
- [ ] Test e2e flow complet signature
- [ ] Test expiration token (7 jours)
- [ ] Test signature deja effectuee (erreur)

## Dependencies

- Aucune (premier ticket de la phase)
