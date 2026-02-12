# FEAT-107: Ajouter audit securite dependances en CI

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** XS
**Tags:** security, infra
**Date creation:** 2026-02-12

---

## Description

Aucun `pnpm audit` dans le pipeline CI. Les vulnerabilites connues dans les dependances ne sont pas detectees automatiquement. Un package avec CVE critique peut etre deploye en production.

## User Story

**En tant que** developpeur
**Je veux** etre alerte des vulnerabilites dans les dependances
**Afin de** ne pas deployer de code avec des failles connues

## Criteres d'acceptation

- [ ] Step `pnpm audit` ajoute dans le workflow CI
- [ ] Niveau high/critical bloque le build
- [ ] Niveau moderate genere un warning
- [ ] Resultats visibles dans les logs CI

## Fichiers concernes

- `.github/workflows/test.yml` - ajouter step audit

## Analyse / Approche

```yaml
- name: Security audit
  run: pnpm audit --audit-level=high
  continue-on-error: false
```

Si trop de faux positifs, utiliser `pnpm audit --audit-level=critical` dans un premier temps.

## Tests de validation

- [ ] CI execute `pnpm audit`
- [ ] Dependance avec CVE haute → CI echoue
- [ ] Pas de CVE → CI passe
