# FEAT-029: Emails signature devis

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** email, signature, notifications
**Date creation:** 2026-01-29
**Phase:** 5.1

---

## Description

Implementer les emails lies au workflow de signature : envoi du lien, confirmation, notification au patron.

## User Story

**En tant que** patron
**Je veux** etre notifie quand un client signe un devis
**Afin de** pouvoir planifier le chantier rapidement

## Criteres d'acceptation

- [ ] Email au client avec lien de signature
- [ ] Email de confirmation au client apres signature
- [ ] Email de notification au patron apres signature
- [ ] Relance automatique J+3 si non signe (optionnel, configurable)
- [ ] Templates emails professionnels et responsive

## Fichiers concernes

- `apps/api/src/modules/mail/templates/signature-request.hbs`
- `apps/api/src/modules/mail/templates/signature-confirmation.hbs`
- `apps/api/src/modules/mail/templates/signature-notification.hbs`
- `apps/api/src/modules/mail/mail.service.ts`

## Templates emails

### Email demande signature
```
Objet: Devis N° D-2024-0042 - Art & Jardin

Bonjour [Prenom],

Veuillez trouver ci-joint votre devis pour [description chantier].

Montant total: [total] € TTC

Pour accepter ce devis, cliquez sur le bouton ci-dessous
et signez electroniquement :

[SIGNER LE DEVIS]

Ce lien est valable 7 jours.

Cordialement,
L'equipe Art & Jardin
```

### Email confirmation
```
Objet: Confirmation signature - Devis N° D-2024-0042

Bonjour [Prenom],

Nous avons bien recu votre signature electronique.

Devis: D-2024-0042
Montant: [total] € TTC
Date signature: [date]

Vous trouverez le devis signe en piece jointe.

Nous vous contacterons prochainement pour
planifier l'intervention.

Cordialement,
L'equipe Art & Jardin
```

## Tests de validation

- [ ] Email demande recu avec bon lien
- [ ] Email confirmation recu avec PDF attache
- [ ] Email patron recu apres signature
- [ ] Emails responsive (mobile)

## Dependencies

- FEAT-026 (backend signature)
- FEAT-028 (PDF avec signature)
