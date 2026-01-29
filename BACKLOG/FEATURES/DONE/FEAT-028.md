# FEAT-028: PDF devis avec signature integree

**Type:** Feature
**Statut:** Fait
**Priorite:** Haute
**Complexite:** S
**Tags:** pdf, signature, devis
**Date creation:** 2026-01-29
**Date cloture:** 2026-01-29
**Phase:** 5.1

---

## Description

Modifier le template PDF des devis pour inclure la signature electronique quand le devis est signe.

## User Story

**En tant que** patron ou client
**Je veux** telecharger le devis signe en PDF
**Afin de** conserver une preuve de l'accord

## Criteres d'acceptation

- [x] PDF inclut image de la signature
- [x] PDF inclut date et heure de signature
- [x] PDF inclut mention "Document signe electroniquement"
- [x] PDF inclut IP et horodatage (petit texte)
- [x] PDF genere a la demande (pas stocke)
- [x] Endpoint `GET /devis/:id/pdf` retourne PDF signe si applicable

## Implementation

### Fichiers modifies

- `apps/api/src/modules/pdf/pdf.service.ts` - Ajout interface SignatureData et methode addElectronicSignature
- `apps/api/src/modules/devis/devis.service.ts` - Recuperation des infos signature dans findOneWithDetails
- `apps/api/src/modules/devis/devis.controller.ts` - Passage signature au PDF, nom fichier "-signe" si signe

### Fichiers crees

- `apps/api/src/modules/pdf/pdf.service.spec.ts` - 10 tests unitaires

### Section signature dans le PDF

```
----------------------------------------
SIGNATURE ELECTRONIQUE

[Image signature]

Signe le 29/01/2026 a 14:32:15
Document signe electroniquement conformement
aux articles 1366 et 1367 du Code civil.
Ref: SIG-xxxx | IP: xxx.xxx.xxx.xxx
----------------------------------------
```

## Tests de validation

- [x] PDF sans signature (devis non signe) - affiche zone signature manuelle
- [x] PDF avec signature (devis signe) - affiche section signature electronique
- [x] Image signature lisible dans le PDF
- [x] Informations legales presentes (art. 1366-1367 Code civil)
- [x] 10 tests unitaires passent

## Dependencies

- FEAT-026 (backend signature) - OK
