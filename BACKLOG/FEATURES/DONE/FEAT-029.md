# FEAT-029: Emails signature devis

**Type:** Feature
**Statut:** Fait
**Priorite:** Haute
**Complexite:** S
**Tags:** email, signature, notifications
**Date creation:** 2026-01-29
**Date cloture:** 2026-01-29
**Phase:** 5.1

---

## Description

Implementer les emails lies au workflow de signature : envoi du lien, confirmation avec PDF, notification au patron.

## User Story

**En tant que** patron
**Je veux** etre notifie quand un client signe un devis
**Afin de** pouvoir planifier le chantier rapidement

## Criteres d'acceptation

- [x] Email au client avec lien de signature (fait dans FEAT-026)
- [x] Email de confirmation au client apres signature avec PDF signe en piece jointe
- [x] Email de notification au patron apres signature
- [ ] Relance automatique J+3 si non signe (optionnel, non implemente)
- [x] Templates emails professionnels et responsive

## Implementation

### Fichiers modifies

- `apps/api/src/modules/mail/mail.service.ts` - Ajout methodes sendSignatureConfirmation et sendSignatureNotification
- `apps/api/src/modules/signature/signature.service.ts` - Integration PDF et envoi emails
- `apps/api/src/modules/signature/signature.module.ts` - Import PdfModule
- `apps/api/src/modules/signature/signature.service.spec.ts` - Mise a jour tests

### Nouvelles methodes MailService

1. `sendSignatureConfirmation(to, clientName, devisNumero, montantTTC, signedAt, pdfBuffer)`
   - Email de confirmation HTML responsive
   - PDF signe en piece jointe
   - Design moderne avec icone succes

2. `sendSignatureNotification(patronEmail, clientName, devisNumero, montantTTC, signedAt, chantierDescription)`
   - Notification au patron
   - Resume des infos importantes
   - Rappel de contacter le client

### Configuration requise

Variable d'environnement `PATRON_EMAIL` pour recevoir les notifications.

## Tests de validation

- [x] Email demande recu avec bon lien (fait dans FEAT-026)
- [x] Email confirmation recu avec PDF attache
- [x] Email patron recu apres signature
- [x] Emails responsive (templates HTML)

## Dependencies

- FEAT-026 (backend signature) - OK
- FEAT-028 (PDF avec signature) - OK
