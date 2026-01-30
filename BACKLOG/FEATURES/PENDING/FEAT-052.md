# FEAT-052: Envoi automatique documents a chaque etape

**Type:** Feature
**Statut:** A faire
**Priorite:** Critique
**Complexite:** M
**Tags:** email, workflow, auto-send, zero-perte
**Date creation:** 2026-01-30

---

## Description

**REGLE BUSINESS CRITIQUE:** Tous les documents doivent etre envoyes automatiquement par email a chaque etape du workflow, sans action manuelle requise.

## Workflow des envois automatiques

| Evenement | Email client | Email entreprise |
|-----------|--------------|------------------|
| Devis cree | Non (brouillon) | Copie PDF |
| Devis valide/finalise | PDF complet | Copie PDF |
| Devis envoye client | PDF + lien signature | Copie |
| Devis signe | Confirmation + PDF signe | Notification + PDF |
| Devis refuse | Notification | Notification |
| Facture creee | PDF facture | Copie PDF |
| Facture envoyee | PDF + conditions | Copie |
| Facture payee | Confirmation paiement | Notification |
| Relance auto | Email relance | Copie |

## User Story

**En tant que** gerant
**Je veux** que tous les documents soient envoyes automatiquement
**Afin de** garantir que le client ET l'entreprise ont toujours une copie

## Criteres d'acceptation

- [ ] Email automatique a la finalisation d'un devis
- [ ] Email automatique a la creation d'une facture
- [ ] Email automatique a chaque changement de statut
- [ ] Notifications entreprise pour chaque evenement
- [ ] Configuration par type d'evenement (activer/desactiver)
- [ ] Historique des emails envoyes en base

## Fichiers concernes

- `apps/api/src/modules/devis/devis.service.ts`
- `apps/api/src/modules/factures/factures.service.ts`
- `apps/api/src/modules/mail/mail.service.ts`
- `apps/api/src/entities/email-log.entity.ts` (a creer)

## Tests de validation

- [ ] Creation devis → email entreprise
- [ ] Validation devis → email client + entreprise
- [ ] Signature → emails automatiques
- [ ] Creation facture → emails automatiques
