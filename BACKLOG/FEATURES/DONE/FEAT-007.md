# FEAT-007: Exports et reversibilite

**Type:** Feature
**Statut:** READY
**Priorite:** Critique
**Complexite:** M
**Tags:** export, data, backup
**Date creation:** 2025-01-25

---

## Description
Implementer les exports de donnees pour garantir la reversibilite.

## User Story
**En tant que** patron
**Je veux** exporter toutes mes donnees en 1 clic
**Afin de** ne jamais etre bloque par le systeme

## Criteres d'acceptation
- [ ] Export CSV par table (clients, chantiers, devis, factures)
- [ ] Export ZIP complet avec toutes les donnees
- [ ] Endpoint /export/csv/:table
- [ ] Endpoint /export/full (ZIP)
- [ ] Securise (patron only)

## Fichiers concernes
- `apps/api/src/modules/export/export.module.ts`
- `apps/api/src/modules/export/export.service.ts`
- `apps/api/src/modules/export/export.controller.ts`

## Analyse / Approche
1. Creer module export
2. Service avec methodes: exportCsv(table), exportFull()
3. Utiliser json2csv pour CSV
4. Utiliser archiver pour ZIP
5. Controller avec endpoints securises @Roles(patron)

## Contexte technique
- Prisma client disponible via PrismaService
- @Roles decorator existe
- Tables: clients, chantiers, devis, factures, interventions

## Tests de validation
- [ ] GET /export/csv/clients retourne CSV valide
- [ ] GET /export/full retourne ZIP avec tous les CSV
- [ ] Employe n'a pas acces (403)
