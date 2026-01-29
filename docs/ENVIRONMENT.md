# Variables d'Environnement - Art & Jardin

## Fichiers d'environnement

| Fichier | Usage | Git |
|---------|-------|-----|
| `.env.example` | Template avec documentation | Commité |
| `.env.development` | Developpement local | Commité |
| `.env.test` | Tests automatises | Commité |
| `.env.production` | Production (secrets) | **JAMAIS commité** |
| `.env` | Override local | Ignoré |
| `.env.local` | Override local | Ignoré |

## Chargement des variables

L'API charge les fichiers dans cet ordre (le premier trouvé gagne) :
1. `.env.{NODE_ENV}` (ex: `.env.development`)
2. `.env.local`
3. `.env`

---

## Variables requises

### Base de donnees

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de connexion PostgreSQL | `postgresql://user:pass@localhost:5432/db` |

### Authentification

| Variable | Description | Exemple |
|----------|-------------|---------|
| `JWT_SECRET` | Cle secrete JWT (min 32 chars) | `openssl rand -base64 48` |
| `JWT_EXPIRES_IN` | Duree token access | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Duree refresh token | `7d` |

---

## Variables optionnelles

### Serveur API

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environnement | `development` |
| `API_PORT` | Port API | `3000` |
| `API_HOST` | Host API | `0.0.0.0` |

### Stockage S3

| Variable | Description | Exemple |
|----------|-------------|---------|
| `S3_ENDPOINT` | Endpoint S3 | `https://s3.fr-par.scw.cloud` |
| `S3_ACCESS_KEY` | Cle d'acces | - |
| `S3_SECRET_KEY` | Cle secrete | - |
| `S3_BUCKET` | Nom du bucket | `art-et-jardin` |
| `S3_REGION` | Region | `fr-par` |

### Email SMTP

| Variable | Description | Exemple |
|----------|-------------|---------|
| `SMTP_HOST` | Serveur SMTP | `smtp-relay.brevo.com` |
| `SMTP_PORT` | Port SMTP | `587` |
| `SMTP_USER` | Utilisateur | - |
| `SMTP_PASSWORD` | Mot de passe | - |
| `SMTP_FROM` | Expediteur | `contact@artjardin.fr` |

### Logging

| Variable | Description | Default |
|----------|-------------|---------|
| `LOG_LEVEL` | Niveau de log | `info` |

### Rate Limiting

| Variable | Description | Default |
|----------|-------------|---------|
| `THROTTLE_TTL` | Fenetre (secondes) | `60` |
| `THROTTLE_LIMIT` | Max requetes | `100` |

### CORS

| Variable | Description | Default |
|----------|-------------|---------|
| `CORS_ORIGINS` | Origines autorisees | `http://localhost:3001` |

---

## Validation

L'API valide toutes les variables au demarrage avec Joi.

Si une variable requise manque ou est invalide, l'API refuse de demarrer avec un message d'erreur explicite.

### Exemple d'erreur

```
Error: Config validation error: "JWT_SECRET" is required. Generate with: openssl rand -base64 48
```

---

## Securite

### Regles critiques

1. **JAMAIS** committer `.env.production`
2. **JAMAIS** utiliser les secrets de dev en production
3. **TOUJOURS** generer un nouveau `JWT_SECRET` pour chaque environnement
4. **TOUJOURS** utiliser des mots de passe forts en production

### Generer un JWT_SECRET securise

```bash
openssl rand -base64 48
```

### Rotation des secrets

1. Generer un nouveau secret
2. Deployer avec le nouveau secret
3. Les anciens tokens seront invalides (utilisateurs devront se reconnecter)

---

## Docker

Pour Docker Compose, les variables sont lues depuis `.env` a la racine.

```yaml
# docker-compose.yml
services:
  api:
    env_file:
      - .env.${NODE_ENV:-development}
```
