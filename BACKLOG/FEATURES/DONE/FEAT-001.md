# FEAT-001: Initialiser le projet monorepo avec tooling

**Type:** Feature
**Statut:** A faire
**Priorite:** Critique
**Complexite:** M
**Tags:** setup, infra
**Date creation:** 2025-01-25

---

## Description
Mettre en place la structure monorepo complete avec tous les outils de dev necessaires.

## User Story
**En tant que** developpeur
**Je veux** une structure de projet propre et configuree
**Afin de** pouvoir developper efficacement les differentes apps

## Criteres d'acceptation
- [ ] pnpm workspaces configure
- [ ] TypeScript configure (tsconfig base + extends)
- [ ] ESLint + Prettier configures
- [ ] Husky + lint-staged pour pre-commit hooks
- [ ] Docker Compose pour PostgreSQL dev
- [ ] Structure apps/ et packages/ creee
- [ ] Scripts npm fonctionnels

## Fichiers concernes
- `package.json`
- `pnpm-workspace.yaml`
- `tsconfig.json`
- `.eslintrc.js`
- `.prettierrc`
- `docker-compose.yml`

## Analyse / Approche
1. Configurer TypeScript avec path aliases
2. ESLint avec regles strictes TypeScript
3. Prettier integre avec ESLint
4. Docker Compose avec PostgreSQL 16 + adminer
5. Variables d'environnement (.env.example)

## Tests de validation
- [ ] `pnpm install` fonctionne
- [ ] `pnpm lint` fonctionne
- [ ] `pnpm format` fonctionne
- [ ] `docker compose up` demarre PostgreSQL
