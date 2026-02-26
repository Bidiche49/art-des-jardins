# FEAT-123: docker-compose.prod.yml avec reverse proxy HTTPS (Caddy)

**Type:** Feature
**Statut:** Fait
**Priorite:** Critique
**Complexite:** M
**Tags:** infra, security, docker, deploy
**Date creation:** 2026-02-24

---

## Description
Creer une configuration Docker Compose de production avec un reverse proxy Caddy pour la terminaison SSL automatique (Let's Encrypt). La stack prod doit exposer l'API sur HTTPS et servir la vitrine Next.js exportee en statique.

## User Story
**En tant que** ops
**Je veux** deployer toute la stack prod avec HTTPS automatique
**Afin de** mettre en production de maniere securisee sur le VPS

## Criteres d'acceptation
- [ ] Fichier `docker-compose.prod.yml` cree (override de docker-compose.yml)
- [ ] Service Caddy avec auto-SSL Let's Encrypt
- [ ] API NestJS derriere Caddy (reverse proxy /api/*)
- [ ] Vitrine Next.js servie en statique par Caddy
- [ ] Postgres non expose sur le reseau public (port 5432 interne seulement)
- [ ] Adminer desactive en prod
- [ ] Volumes persistants pour certificats Caddy et data postgres
- [ ] Restart policies `unless-stopped` sur tous les services
- [ ] Logs centralises (stdout/stderr)

## Fichiers concernes
- `docker-compose.prod.yml` — creer
- `docker/caddy/Caddyfile` — config reverse proxy
- `docker/caddy/Dockerfile` — optionnel si custom build
- `.env.production.example` — mettre a jour avec domaines

## Analyse / Approche
Caddyfile :
```
artdesjardins.fr {
    handle /api/* {
        reverse_proxy api:3000
    }
    handle {
        root * /srv/vitrine
        file_server
        try_files {path} /index.html
    }
}
```

Stack prod :
- caddy (ports 80, 443)
- api (interne, port 3000)
- postgres (interne, port 5432)

## Tests de validation
- [ ] `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up` demarre
- [ ] HTTPS fonctionne avec certificat Let's Encrypt
- [ ] `https://artdesjardins.fr/api/health` repond 200
- [ ] `https://artdesjardins.fr/` sert la vitrine
- [ ] Postgres inaccessible depuis l'exterieur
- [ ] Adminer non present dans la stack prod
