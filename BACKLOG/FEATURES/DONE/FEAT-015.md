# FEAT-015: Tests unitaires AuditService

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** tests, api, audit, security
**Date creation:** 2026-01-25

---

## Description

Tests unitaires complets pour AuditService : logging, sanitization, filtres, export CSV.

## Criteres d'acceptation

### Logging
- [ ] Test log action CREATE avec entité et ID
- [ ] Test log action UPDATE avec details
- [ ] Test log action DELETE
- [ ] Test log avec userId, IP, userAgent
- [ ] Test sanitization password (remplacé par ***)
- [ ] Test sanitization token/refreshToken
- [ ] Test sanitization passwordHash

### Filtres
- [ ] Test findAll avec pagination
- [ ] Test findAll filtre par userId
- [ ] Test findAll filtre par action (CREATE, UPDATE, DELETE)
- [ ] Test findAll filtre par entité (Client, Devis, etc.)
- [ ] Test findAll filtre par date range

### Export
- [ ] Test export CSV format correct
- [ ] Test export CSV headers
- [ ] Test export CSV échappement virgules/guillemets
- [ ] Test export CSV dates ISO format
- [ ] Coverage > 90%

## Fichiers concernes

- `apps/api/src/modules/audit/audit.service.spec.ts`

## Analyse / Approche

1. Mock PrismaService
2. Tester la fonction de sanitization isolément
3. Vérifier format CSV généré
4. Tester tous les filtres combinés

## Tests de validation

- [ ] Tous les tests passent
- [ ] Données sensibles jamais dans les logs
- [ ] Coverage audit module > 90%
