# FEAT-051: Copie automatique email entreprise (BCC)

**Type:** Feature
**Statut:** A faire
**Priorite:** Critique
**Complexite:** S
**Tags:** email, backup, resilience, zero-perte
**Date creation:** 2026-01-30

---

## Description

**REGLE BUSINESS CRITIQUE:** Aucune perte de donnees acceptable.

A chaque envoi d'email (devis, facture, signature), une copie doit etre automatiquement envoyee a l'entreprise. Cela garantit que meme si le client perd l'email, l'entreprise a toujours une trace.

## User Story

**En tant que** gerant d'Art & Jardin
**Je veux** recevoir une copie de tous les documents envoyes aux clients
**Afin de** avoir une archive complete et ne jamais perdre de document

## Criteres d'acceptation

- [ ] Chaque email client a une copie BCC vers email entreprise
- [ ] L'email entreprise est configurable (.env)
- [ ] Copie pour: devis envoye, facture envoyee, signature confirmee
- [ ] Log des emails envoyes en base (audit trail)
- [ ] Possibilite de configurer plusieurs emails destinataires

## Fichiers concernes

- `apps/api/src/modules/mail/mail.service.ts`
- `.env.example` (COMPANY_EMAIL, COMPANY_BCC)

## Implementation

```typescript
// Dans MailService
private readonly companyBcc: string[];

async sendMail(options: SendMailOptions) {
  // Ajouter BCC automatique
  const bcc = this.companyBcc;
  // ...
}
```

## Tests de validation

- [ ] Chaque email au client genere une copie BCC
- [ ] Les emails BCC sont configurables
- [ ] Verification en testant l'envoi d'un devis
