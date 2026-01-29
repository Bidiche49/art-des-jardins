# Docker - Art & Jardin

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Internet                                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Nginx (Reverse Proxy)                         │
│                      Port 80 / 443                               │
└─────┬─────────────────────┬─────────────────────┬───────────────┘
      │                     │                     │
      ▼                     ▼                     ▼
┌───────────┐         ┌───────────┐         ┌───────────┐
│  Vitrine  │         │    PWA    │         │    API    │
│  (Next.js)│         │  (Nginx)  │         │ (NestJS)  │
│  :3001    │         │   :80     │         │  :3000    │
└───────────┘         └───────────┘         └─────┬─────┘
                                                  │
                                                  ▼
                                            ┌───────────┐
                                            │ PostgreSQL│
                                            │   :5432   │
                                            └───────────┘
```

## Services

| Service | Image | Port interne | Description |
|---------|-------|--------------|-------------|
| postgres | postgres:16-alpine | 5432 | Base de donnees |
| api | Custom (NestJS) | 3000 | API REST |
| vitrine | Custom (Next.js) | 3001 | Site vitrine SSR |
| pwa | Custom (Nginx) | 80 | App PWA (SPA) |
| nginx | nginx:alpine | 80, 443 | Reverse proxy |

---

## Developpement

```bash
# Demarrer uniquement PostgreSQL + Adminer
docker compose up -d

# Acceder a Adminer
open http://localhost:8080
```

---

## Production

### Prerequisites

1. Copier et configurer `.env.production`
2. Configurer les DNS (api.artjardin.fr, app.artjardin.fr, artjardin.fr)

### Build & Deploy

```bash
# Build toutes les images
docker compose -f docker-compose.prod.yml build

# Demarrer en production
docker compose -f docker-compose.prod.yml up -d

# Voir les logs
docker compose -f docker-compose.prod.yml logs -f

# Arreter
docker compose -f docker-compose.prod.yml down
```

### Migrations en production

```bash
# Executer les migrations
docker compose -f docker-compose.prod.yml exec api npx prisma migrate deploy
```

---

## Domaines

| Domaine | Service | Description |
|---------|---------|-------------|
| artjardin.fr | vitrine | Site vitrine SEO |
| www.artjardin.fr | redirect | Redirige vers artjardin.fr |
| app.artjardin.fr | pwa | Application metier |
| api.artjardin.fr | api | API REST |

---

## SSL/HTTPS

### Option 1: Certbot (Let's Encrypt)

```bash
# Installer certbot
docker run -it --rm \
  -v ./docker/nginx/ssl:/etc/letsencrypt \
  -v ./docker/nginx/certbot:/var/www/certbot \
  certbot/certbot certonly \
  --webroot -w /var/www/certbot \
  -d artjardin.fr -d www.artjardin.fr \
  -d api.artjardin.fr -d app.artjardin.fr
```

### Option 2: Traefik (recommande)

Remplacer nginx par Traefik pour SSL automatique.

---

## Commandes utiles

```bash
# Voir les containers
docker compose -f docker-compose.prod.yml ps

# Logs d'un service
docker compose -f docker-compose.prod.yml logs -f api

# Shell dans un container
docker compose -f docker-compose.prod.yml exec api sh

# Rebuild un service
docker compose -f docker-compose.prod.yml build api
docker compose -f docker-compose.prod.yml up -d api

# Nettoyer les images inutilisees
docker image prune -a
```

---

## Healthchecks

Tous les services ont des healthchecks configures :

| Service | Endpoint | Interval |
|---------|----------|----------|
| postgres | pg_isready | 10s |
| api | /health | 30s |
| vitrine | / | 30s |
| pwa | /health | 30s |

---

## Volumes

| Volume | Usage |
|--------|-------|
| postgres_data | Donnees PostgreSQL persistantes |

---

## Troubleshooting

### Container ne demarre pas

```bash
# Voir les logs detailles
docker compose -f docker-compose.prod.yml logs api

# Verifier la configuration
docker compose -f docker-compose.prod.yml config
```

### Probleme de connexion DB

```bash
# Verifier que postgres est healthy
docker compose -f docker-compose.prod.yml ps postgres

# Tester la connexion
docker compose -f docker-compose.prod.yml exec postgres psql -U artjardin -d artjardin
```

### Rebuild complet

```bash
# Supprimer tout et reconstruire
docker compose -f docker-compose.prod.yml down -v
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```
