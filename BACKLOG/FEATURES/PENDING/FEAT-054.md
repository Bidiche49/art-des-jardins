# FEAT-054: Archivage automatique PDFs sur S3

**Type:** Feature
**Statut:** A faire
**Priorite:** Critique
**Complexite:** M
**Tags:** s3, archive, pdf, zero-perte
**Date creation:** 2026-01-30

---

## Description

**REGLE BUSINESS CRITIQUE:** Tous les documents PDF generes doivent etre archives automatiquement sur un stockage externe (S3) independant de la base de donnees.

Meme si la BDD et le serveur crashent completement, les documents doivent etre recuperables depuis S3.

## User Story

**En tant que** gerant
**Je veux** que tous les PDFs soient archives automatiquement
**Afin de** pouvoir les recuperer meme si tout le systeme crash

## Documents a archiver

- Devis generes (chaque version)
- Devis signes (avec signature)
- Factures generees
- Factures acquittees
- Exports (zip clients, etc.)

## Criteres d'acceptation

- [ ] Upload S3 automatique a chaque generation PDF
- [ ] Structure de stockage organisee: `/annee/mois/type/document.pdf`
- [ ] Metadata S3 (client_id, document_type, numero)
- [ ] Reference S3 stockee en BDD (s3_key, s3_url)
- [ ] Endpoint pour recuperer depuis S3 si cache local manquant
- [ ] Retention illimitee (documents legaux)
- [ ] Chiffrement at-rest sur S3

## Structure S3

```
s3://artjardin-documents/
├── 2026/
│   ├── 01/
│   │   ├── devis/
│   │   │   ├── D-2026-001.pdf
│   │   │   └── D-2026-001-signe.pdf
│   │   └── factures/
│   │       └── F-2026-001.pdf
│   └── 02/
│       └── ...
```

## Fichiers concernes

- `apps/api/src/modules/storage/storage.service.ts` (modifier)
- `apps/api/src/modules/devis/devis.service.ts`
- `apps/api/src/modules/factures/factures.service.ts`
- `packages/database/prisma/schema.prisma` (champ s3_key)

## Tests de validation

- [ ] Generation devis → upload S3 automatique
- [ ] Generation facture → upload S3 automatique
- [ ] Recuperation depuis S3 si local manquant
- [ ] Verification integrite fichiers
