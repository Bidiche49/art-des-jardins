# FEAT-122: Ajouter service API NestJS dans docker-compose

**Type:** Feature
**Statut:** A faire
**Priorite:** Critique
**Complexite:** S
**Tags:** infra, api, docker
**Date creation:** 2026-02-24

---

## Description
Le Dockerfile multi-stage de l'API existe deja (`docker/api/Dockerfile`) mais le service n'est pas declare dans `docker-compose.yml`. Il faut l'ajouter avec la gestion des migrations Prisma au demarrage.

## User Story
**En tant que** developpeur/ops
**Je veux** lancer toute la stack (postgres + API) avec un seul `docker-compose up`
**Afin de** deployer et tester l'API en conditions reelles

## Criteres d'acceptation
- [ ] Service `api` ajoute dans `docker-compose.yml`
- [ ] Build depuis `docker/api/Dockerfile` avec contexte monorepo root
- [ ] Depends_on postgres (healthcheck)
- [ ] Variables d'environnement via `.env` (DATABASE_URL, JWT_SECRET, etc.)
- [ ] Commande d'entrypoint qui lance `prisma migrate deploy` puis `node main.js`
- [ ] Port 3000 expose (mappable)
- [ ] Health check sur `/health`
- [ ] `docker-compose up` demarre toute la stack sans intervention manuelle

## Fichiers concernes
- `docker-compose.yml` — ajouter service api
- `docker/api/Dockerfile` — verifier entrypoint (deja multi-stage)
- `docker/api/entrypoint.sh` — creer (migrate + start)

## Analyse / Approche
1. Creer `docker/api/entrypoint.sh` :
   ```bash
   #!/bin/sh
   npx prisma migrate deploy --schema=./prisma/schema.prisma
   node dist/main.js
   ```
2. Ajouter dans docker-compose.yml :
   ```yaml
   api:
     build:
       context: .
       dockerfile: docker/api/Dockerfile
     depends_on:
       postgres:
         condition: service_healthy
     env_file: .env
     ports:
       - '3000:3000'
     healthcheck:
       test: ['CMD', 'wget', '-qO-', 'http://localhost:3000/health']
       interval: 30s
       timeout: 10s
       retries: 3
   ```

## Tests de validation
- [ ] `docker-compose build api` reussit sans erreur
- [ ] `docker-compose up` demarre postgres puis api
- [ ] Les migrations Prisma s'executent au demarrage
- [ ] `curl localhost:3000/health` repond 200
- [ ] `curl localhost:3000/api/docs` affiche Swagger
