# Checklist de Deploiement - Art & Jardin

> Checklist rapide pour configurer l'environnement de production.
> Pour le guide detaille, voir [DEPLOIEMENT.md](./DEPLOIEMENT.md).

---

## 1. Generer les secrets cryptographiques

```bash
# JWT Secret (64 chars min)
echo "JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')"

# Mot de passe PostgreSQL
echo "POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d '\n')"

# Cle chiffrement 2FA
echo "TWO_FACTOR_ENCRYPTION_KEY=$(openssl rand -base64 32 | tr -d '\n')"

# Cle chiffrement backups
echo "BACKUP_ENCRYPTION_KEY=$(openssl rand -base64 32 | tr -d '\n')"

# Secret device tracking
echo "DEVICE_ACTION_SECRET=$(openssl rand -base64 32 | tr -d '\n')"
```

- [ ] Copier chaque valeur dans `.env`
- [ ] Verifier qu'aucun secret n'est `<PLACEHOLDER>` ou vide

---

## 2. Configurer le fichier .env

```bash
cp .env.production.example .env
nano .env
```

### Variables critiques a remplir

| Variable | Comment l'obtenir |
|----------|-------------------|
| `DATABASE_URL` | Construire avec POSTGRES_USER/PASSWORD/DB |
| `JWT_SECRET` | `openssl rand -base64 64` |
| `TWO_FACTOR_ENCRYPTION_KEY` | `openssl rand -base64 32` |
| `DEVICE_ACTION_SECRET` | `openssl rand -base64 32` |
| `BACKUP_ENCRYPTION_KEY` | `openssl rand -base64 32` |
| `CORS_ORIGINS` | Domaines separes par virgule |
| `SMTP_USER` / `SMTP_PASSWORD` | Console Brevo > SMTP & API |
| `S3_ACCESS_KEY` / `S3_SECRET_KEY` | Console Scaleway > IAM |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | web3forms.com > Dashboard |

- [ ] Toutes les variables `[REQUIRED]` sont remplies
- [ ] `DATABASE_URL` correspond aux credentials postgres
- [ ] `CORS_ORIGINS` ne contient PAS `localhost`
- [ ] `NODE_ENV=production`

---

## 3. Verifier la securite

- [ ] `.env` n'est PAS dans git : `git status` ne montre pas `.env`
- [ ] `.env.production` est dans `.gitignore`
- [ ] Aucun secret hardcode dans le code source
- [ ] `JWT_SECRET` fait au moins 64 caracteres
- [ ] `CORS_ORIGINS` liste uniquement les domaines de production
- [ ] `LOG_LEVEL` est `warn` ou `error` (pas `debug`)

---

## 4. Services externes

### Brevo (SMTP)
- [ ] Compte Brevo cree
- [ ] Domaine `artjardin.fr` verifie (SPF + DKIM)
- [ ] Cle SMTP generee et reportee dans `.env`
- [ ] Email test envoye avec succes

### Scaleway S3
- [ ] Bucket `artjardin-prod` cree (region fr-par)
- [ ] Bucket `artjardin-backups` cree
- [ ] API Key IAM creee avec acces Object Storage
- [ ] CORS configure sur le bucket (cf. DEPLOIEMENT.md)
- [ ] Upload test reussi

### VAPID (Push Notifications) - optionnel
- [ ] `npx web-push generate-vapid-keys` execute
- [ ] Cles reportees dans `.env`

---

## 5. Lancer la stack

```bash
# Build
docker compose build

# Demarrer
docker compose up -d

# Verifier les logs
docker compose logs -f api
```

- [ ] `docker compose ps` montre tous les services `healthy`
- [ ] Les migrations Prisma se sont executees (visible dans les logs)
- [ ] `curl localhost:3000/api/v1/health` retourne `{"status":"ok"}`

---

## 6. Validation post-deploiement

### Endpoints
- [ ] `https://artjardin.fr` — Site vitrine charge
- [ ] `https://api.artjardin.fr/api/v1/health` — API repond 200
- [ ] `https://api.artjardin.fr/api/docs` — Swagger accessible
- [ ] SSL valide sur tous les domaines

### Fonctionnel
- [ ] Login patron fonctionne
- [ ] Creation client OK
- [ ] Creation devis OK
- [ ] Upload photo OK
- [ ] Email de contact recus

### Securite post-deploy
- [ ] Rate limiting actif (tester avec curl en boucle)
- [ ] CORS bloque les origines non autorisees
- [ ] Endpoints proteges renvoient 401 sans token

---

## 7. Backups

```bash
# Cron: backup quotidien a 2h
crontab -e
# 0 2 * * * docker exec artjardin_db /backup/backup.sh >> /var/log/artjardin-backup.log 2>&1
```

- [ ] Backup manuel execute avec succes
- [ ] Cron configure
- [ ] Restauration testee sur un environnement de test

---

## Commandes utiles

```bash
# Etat des services
docker compose ps

# Logs d'un service
docker compose logs -f api

# Entrer dans le conteneur API
docker compose exec api sh

# Redemarrer l'API
docker compose restart api

# Mise a jour
git pull && docker compose build && docker compose up -d
```
