# FEAT-110: Valider migrations Prisma dans CI

**Type:** Feature
**Statut:** A faire
**Priorite:** Moyenne
**Complexite:** XS
**Tags:** infra, data
**Date creation:** 2026-02-12

---

## Description

Les migrations Prisma sont generees mais jamais validees dans le pipeline CI. Le schema et les migrations peuvent etre desynchronises sans que personne ne s'en apercoive. Risque de deploiement avec migrations cassees.

## User Story

**En tant que** developpeur
**Je veux** que la CI valide automatiquement le schema Prisma et les migrations
**Afin de** ne pas deployer de migrations cassees en production

## Criteres d'acceptation

- [ ] `prisma validate` dans le pipeline CI
- [ ] `prisma migrate diff` detecte les desynchronisations schema/migrations
- [ ] CI echoue si le schema est invalide
- [ ] CI avertit si des migrations sont manquantes

## Fichiers concernes

- `.github/workflows/test.yml` - ajouter steps Prisma
- `packages/database/prisma/schema.prisma` - schema valide

## Analyse / Approche

```yaml
# .github/workflows/test.yml
- name: Validate Prisma schema
  run: pnpm --filter database exec prisma validate

- name: Check migrations status
  run: pnpm --filter database exec prisma migrate diff --from-migrations ./prisma/migrations --to-schema-datamodel ./prisma/schema.prisma --exit-code
  continue-on-error: true
```

## Tests de validation

- [ ] Schema valide → CI passe
- [ ] Schema invalide → CI echoue
- [ ] Migration manquante → CI avertit
