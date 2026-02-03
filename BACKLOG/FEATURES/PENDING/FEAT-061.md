# FEAT-061: Export FEC comptable

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** M
**Tags:** api, data, export
**Date creation:** 2026-02-03
**Phase:** 11
**Automatisable:** NON

---

## ⚠️ WARNING - NON AUTOMATISABLE ⚠️

> **RISQUE LEGAL ET FINANCIER**
>
> Le FEC (Fichier des Ecritures Comptables) est un document **LEGAL OBLIGATOIRE**
> soumis a l'Article A47 A-1 du Livre des Procedures Fiscales.
>
> **Pourquoi ce ticket n'est PAS automatisable:**
> 1. Le format est extremement strict (18 colonnes, encodage ISO-8859-15)
> 2. Une erreur = rejet par l'administration fiscale
> 3. Le mapping comptable (comptes 411, 706, 512...) depend de VOTRE plan comptable
> 4. Validation obligatoire par un expert-comptable avant mise en production
>
> **Action requise:**
> - Consulter votre expert-comptable pour le plan comptable
> - Tester avec l'outil de validation FEC de l'administration
> - Faire valider le premier export avant deploiement

---

## Description

Generer un Fichier des Ecritures Comptables (FEC) conforme aux normes francaises pour faciliter la transmission au comptable.

## User Story

**En tant que** patron
**Je veux** exporter un fichier FEC
**Afin de** transmettre mes donnees comptables a mon expert-comptable sans ressaisie

## Contexte

Le FEC est obligatoire en France pour toute entreprise tenant une comptabilite informatisee. Format normalise (Article A47 A-1 du LPF) avec 18 colonnes obligatoires.

## Criteres d'acceptation

- [ ] Endpoint GET /api/v1/export/fec?year=2026
- [ ] Format CSV avec separateur tabulation
- [ ] 18 colonnes obligatoires du FEC
- [ ] Encodage ISO-8859-15 (obligatoire FEC)
- [ ] Nom fichier: {SIREN}FEC{YYYYMMDD}.txt
- [ ] Mapping factures -> ecritures comptables
- [ ] Mapping reglements -> ecritures comptables
- [ ] Validation conformite avant export

## Fichiers concernes

- `apps/api/src/modules/export/fec.service.ts` (nouveau)
- `apps/api/src/modules/export/export.controller.ts`

## Analyse / Approche

Colonnes FEC obligatoires:
1. JournalCode
2. JournalLib
3. EcritureNum
4. EcritureDate
5. CompteNum
6. CompteLib
7. CompAuxNum
8. CompAuxLib
9. PieceRef
10. PieceDate
11. EcritureLib
12. Debit
13. Credit
14. EcritureLet
15. DateLet
16. ValidDate
17. Montantdevise
18. Idevise

Plan comptable simplifie:
- 411xxx: Clients
- 706xxx: Prestations de services
- 512xxx: Banque
- 44571: TVA collectee

## Tests de validation

- [ ] Export genere un fichier valide
- [ ] Toutes les factures sont converties
- [ ] Equilibre debit/credit sur chaque ecriture
- [ ] Encodage ISO-8859-15 verifie
- [ ] Validation avec outil FEC de l'administration
