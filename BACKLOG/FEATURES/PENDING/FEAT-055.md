# FEAT-055: Historique complet des emails envoyes

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** M
**Tags:** email, audit, historique, zero-perte
**Date creation:** 2026-01-30

---

## Description

**REGLE BUSINESS:** Tracabilite complete de tous les emails envoyes.

Conserver un historique complet de tous les emails envoyes avec possibilite de renvoyer un email en cas de besoin.

## User Story

**En tant que** gerant
**Je veux** voir l'historique de tous les emails envoyes
**Afin de** verifier ce qui a ete envoye et renvoyer si besoin

## Criteres d'acceptation

- [ ] Table EmailLog en base de donnees
- [ ] Log de chaque email: destinataire, sujet, date, statut, type
- [ ] Reference vers document lie (devis_id, facture_id)
- [ ] Stockage du contenu HTML (optionnel, pour renvoi)
- [ ] Interface admin pour consulter l'historique
- [ ] Possibilite de renvoyer un email depuis l'historique
- [ ] Filtres par client, type, date

## Schema EmailLog

```prisma
model EmailLog {
  id          String   @id @default(uuid())
  to          String
  subject     String
  type        EmailType // DEVIS, FACTURE, SIGNATURE, RELANCE...
  status      EmailStatus // SENT, FAILED, PENDING
  documentId  String?
  documentType String? // devis, facture
  htmlContent String?  @db.Text
  sentAt      DateTime?
  errorMessage String?
  createdAt   DateTime @default(now())
}
```

## Fichiers concernes

- `packages/database/prisma/schema.prisma`
- `apps/api/src/modules/mail/mail.service.ts`
- `apps/api/src/modules/mail/email-log.entity.ts` (a creer)
- `apps/pwa/src/pages/admin/EmailHistory.tsx` (a creer)

## Tests de validation

- [ ] Chaque email envoye cree un log
- [ ] Les echecs sont loggues avec le message d'erreur
- [ ] L'interface affiche l'historique correctement
- [ ] Le renvoi fonctionne
