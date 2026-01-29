# Guide de Deploiement - Art & Jardin

> Guide complet pour deployer Art & Jardin sur un VPS.

---

## Pre-requis

### VPS

- **OS**: Ubuntu 22.04 LTS ou Debian 12
- **RAM**: 4 GB minimum
- **CPU**: 2 vCPU minimum
- **Stockage**: 40 GB SSD
- **Fournisseurs recommandes**: Scaleway, OVH, Hetzner

### Domaines

Configurer les DNS chez votre registrar :

```
artjardin.fr          A     <IP_VPS>
www.artjardin.fr      A     <IP_VPS>
api.artjardin.fr      A     <IP_VPS>
app.artjardin.fr      A     <IP_VPS>
status.artjardin.fr   A     <IP_VPS>
traefik.artjardin.fr  A     <IP_VPS>
```

---

## 1. Configuration du VPS

### 1.1 Connexion initiale

```bash
ssh root@<IP_VPS>
```

### 1.2 Mise a jour systeme

```bash
apt update && apt upgrade -y
apt install -y curl git htop ufw fail2ban
```

### 1.3 Creer utilisateur non-root

```bash
adduser artjardin
usermod -aG sudo artjardin
# Copier cle SSH
mkdir -p /home/artjardin/.ssh
cp ~/.ssh/authorized_keys /home/artjardin/.ssh/
chown -R artjardin:artjardin /home/artjardin/.ssh
chmod 700 /home/artjardin/.ssh
chmod 600 /home/artjardin/.ssh/authorized_keys
```

### 1.4 Configurer SSH (securite)

```bash
nano /etc/ssh/sshd_config
```

Modifier :
```
PermitRootLogin no
PasswordAuthentication no
Port 22
```

Redemarrer SSH :
```bash
systemctl restart sshd
```

### 1.5 Configurer firewall

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
```

### 1.6 Configurer fail2ban

```bash
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
systemctl enable fail2ban
systemctl start fail2ban
```

---

## 2. Installer Docker

### 2.1 Installation

```bash
# En tant qu'utilisateur artjardin
su - artjardin

# Installer Docker
curl -fsSL https://get.docker.com | sh

# Ajouter utilisateur au groupe docker
sudo usermod -aG docker $USER

# Se deconnecter/reconnecter pour appliquer
exit
ssh artjardin@<IP_VPS>

# Verifier
docker --version
docker compose version
```

---

## 3. Deployer l'application

### 3.1 Cloner le projet

```bash
cd ~
git clone https://github.com/votre-repo/art_et_jardin.git
cd art_et_jardin
```

### 3.2 Configurer les variables d'environnement

```bash
cp .env.production.example .env
nano .env
```

Remplir toutes les variables :

```bash
# Generer JWT_SECRET
openssl rand -base64 64

# Generer mot de passe PostgreSQL
openssl rand -base64 32

# Generer hash pour Traefik dashboard
# Installer htpasswd si necessaire: apt install apache2-utils
htpasswd -nb admin votremotdepasse
```

### 3.3 Creer les dossiers necessaires

```bash
mkdir -p docker/postgres/backup
chmod +x docker/postgres/backup.sh
chmod +x docker/postgres/restore.sh
```

### 3.4 Builder et lancer

```bash
# Premier build (peut prendre plusieurs minutes)
docker compose -f docker-compose.prod.yml build

# Lancer les services
docker compose -f docker-compose.prod.yml up -d

# Verifier les logs
docker compose -f docker-compose.prod.yml logs -f

# Verifier que tout fonctionne
docker compose -f docker-compose.prod.yml ps
```

---

## 4. Migrations et donnees initiales

### 4.1 Executer les migrations Prisma

```bash
# Entrer dans le conteneur API
docker compose -f docker-compose.prod.yml exec api sh

# Executer les migrations
npx prisma migrate deploy

# Quitter
exit
```

### 4.2 Creer le compte patron

```bash
docker compose -f docker-compose.prod.yml exec api sh

# Creer le premier utilisateur (adapter selon votre seed)
npx prisma db seed

exit
```

---

## 5. Configurer les backups

### 5.1 Backup manuel

```bash
docker compose -f docker-compose.prod.yml exec postgres /backup/backup.sh
```

### 5.2 Backup automatique (cron)

```bash
crontab -e
```

Ajouter :
```
# Backup PostgreSQL tous les jours a 2h du matin
0 2 * * * docker exec artjardin_db /backup/backup.sh >> /var/log/artjardin-backup.log 2>&1
```

### 5.3 Restaurer un backup

```bash
# Lister les backups
ls -la docker/postgres/backup/

# Restaurer (ATTENTION: efface les donnees actuelles!)
docker compose -f docker-compose.prod.yml exec postgres /backup/restore.sh /backup/<fichier.sql.gz>
```

---

## 6. Configurer Uptime Kuma

1. Acceder a `https://status.artjardin.fr`
2. Creer un compte admin
3. Ajouter les monitors :
   - **API Health**: `https://api.artjardin.fr/health` (HTTP, interval 60s)
   - **Site Vitrine**: `https://artjardin.fr` (HTTP, interval 60s)
   - **PWA**: `https://app.artjardin.fr` (HTTP, interval 60s)
4. Configurer les notifications (email, Telegram, etc.)

---

## 7. Configurer S3 (Scaleway)

1. Creer un bucket sur Scaleway Object Storage
2. Configurer les acces :
   - Creer une API Key (IAM)
   - Noter ACCESS_KEY et SECRET_KEY
3. Configurer CORS sur le bucket :

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://app.artjardin.fr"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3600
    }
  ]
}
```

---

## 8. Verification finale

### Checklist

- [ ] `https://artjardin.fr` - Site vitrine accessible
- [ ] `https://app.artjardin.fr` - PWA accessible
- [ ] `https://api.artjardin.fr/health` - API repond "OK"
- [ ] `https://api.artjardin.fr/api/docs` - Swagger accessible
- [ ] `https://status.artjardin.fr` - Uptime Kuma accessible
- [ ] SSL valide sur tous les domaines (cadenas vert)
- [ ] Login patron fonctionne sur la PWA
- [ ] Upload photo fonctionne
- [ ] Backup PostgreSQL execute sans erreur

### Tests fonctionnels

1. **Login** : Se connecter avec le compte patron
2. **CRUD Client** : Creer, modifier, supprimer un client test
3. **Devis** : Creer un devis avec lignes
4. **Upload** : Ajouter une photo a un chantier

---

## 9. Maintenance

### Mise a jour de l'application

```bash
cd ~/art_et_jardin
git pull origin main

# Rebuild et redemarrer
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

# Migrations si necessaire
docker compose -f docker-compose.prod.yml exec api npx prisma migrate deploy
```

### Voir les logs

```bash
# Tous les services
docker compose -f docker-compose.prod.yml logs -f

# Un service specifique
docker compose -f docker-compose.prod.yml logs -f api
docker compose -f docker-compose.prod.yml logs -f traefik
```

### Redemarrer un service

```bash
docker compose -f docker-compose.prod.yml restart api
```

### Arreter tout

```bash
docker compose -f docker-compose.prod.yml down
```

---

## 10. Troubleshooting

### Certificat SSL ne se genere pas

```bash
# Verifier les logs Traefik
docker compose -f docker-compose.prod.yml logs traefik

# Verifier que le domaine pointe vers le VPS
dig artjardin.fr +short
```

### Base de donnees inaccessible

```bash
# Verifier le statut
docker compose -f docker-compose.prod.yml ps postgres

# Verifier les logs
docker compose -f docker-compose.prod.yml logs postgres
```

### API ne demarre pas

```bash
# Verifier les logs
docker compose -f docker-compose.prod.yml logs api

# Verifier les variables d'environnement
docker compose -f docker-compose.prod.yml exec api env
```

### Espace disque

```bash
# Verifier l'espace
df -h

# Nettoyer les images Docker non utilisees
docker system prune -a
```

---

## Architecture finale

```
                    Internet
                        |
                   [Traefik]
                  /    |    \
                 /     |     \
              [API]  [PWA]  [Vitrine]
                |
          [PostgreSQL]
```

**URLs de production :**
- Site vitrine : `https://artjardin.fr`
- Application : `https://app.artjardin.fr`
- API : `https://api.artjardin.fr`
- Status : `https://status.artjardin.fr`
- Traefik : `https://traefik.artjardin.fr` (admin only)
