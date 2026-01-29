# FEAT-028: PDF devis avec signature integree

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** pdf, signature, devis
**Date creation:** 2026-01-29
**Phase:** 5.1

---

## Description

Modifier le template PDF des devis pour inclure la signature electronique quand le devis est signe.

## User Story

**En tant que** patron ou client
**Je veux** telecharger le devis signe en PDF
**Afin de** conserver une preuve de l'accord

## Criteres d'acceptation

- [ ] PDF inclut image de la signature
- [ ] PDF inclut date et heure de signature
- [ ] PDF inclut mention "Document signe electroniquement"
- [ ] PDF inclut IP et horodatage (petit texte)
- [ ] PDF genere a la demande (pas stocke)
- [ ] Endpoint `GET /devis/:id/pdf` retourne PDF signe si applicable

## Fichiers concernes

- `apps/api/src/modules/pdf/templates/devis.template.ts`
- `apps/api/src/modules/pdf/pdf.service.ts`

## Analyse / Approche

1. Modifier le template PDF existant
2. Ajouter section signature en bas du document :
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
3. Conditionnel : n'afficher que si devis signe

## Tests de validation

- [ ] PDF sans signature (devis non signe)
- [ ] PDF avec signature (devis signe)
- [ ] Image signature lisible
- [ ] Informations legales presentes

## Dependencies

- FEAT-026 (backend signature)
