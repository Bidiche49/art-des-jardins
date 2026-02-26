# Configuration Scaleway Object Storage (S3)

> Guide pas-a-pas pour configurer le stockage S3 en production.

---

## 1. Creer un compte Scaleway

1. Aller sur [https://console.scaleway.com/register](https://console.scaleway.com/register)
2. Creer un compte et valider l'identite
3. Ajouter un moyen de paiement

---

## 2. Creer les buckets

### 2.1 Bucket principal (photos, documents)

1. **Object Storage > Buckets > Create Bucket**
2. Configuration :
   - **Name** : `art-et-jardin-prod`
   - **Region** : `fr-par` (Paris)
   - **Visibility** : Private

### 2.2 Bucket backups (sauvegardes BDD)

1. **Create Bucket**
2. Configuration :
   - **Name** : `art-et-jardin-backups`
   - **Region** : `fr-par`
   - **Visibility** : Private

### 2.3 Bucket archives (optionnel)

1. **Create Bucket**
2. Configuration :
   - **Name** : `art-et-jardin-archives`
   - **Region** : `fr-par`
   - **Visibility** : Private

---

## 3. Creer une API Key IAM

1. **IAM > API Keys > Generate API Key**
2. Configuration :
   - **Description** : `art-et-jardin-prod-s3`
   - **Scope** : Project (limiter au projet)
3. **IMPORTANT** : Copier immediatement le `Secret Key` (affiche une seule fois)
4. Noter :
   - **Access Key** : `SCW...`
   - **Secret Key** : `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

---

## 4. Configurer CORS sur le bucket

Sur le bucket `art-et-jardin-prod`, configurer CORS pour permettre les uploads depuis l'app :

Via la console Scaleway > Bucket > Settings > CORS :

```json
[
  {
    "AllowedOrigins": [
      "https://artdesjardins.fr",
      "https://app.artdesjardins.fr"
    ],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

Ou via CLI `aws` (avec credentials Scaleway) :

```bash
aws s3api put-bucket-cors \
  --bucket art-et-jardin-prod \
  --cors-configuration '{
    "CORSRules": [{
      "AllowedOrigins": ["https://artdesjardins.fr", "https://app.artdesjardins.fr"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3600
    }]
  }' \
  --endpoint-url https://s3.fr-par.scw.cloud
```

---

## 5. Configurer les variables d'environnement

Dans `.env` (sur le serveur de production) :

```bash
S3_ENDPOINT=https://s3.fr-par.scw.cloud
S3_ACCESS_KEY=<SCALEWAY_ACCESS_KEY>
S3_SECRET_KEY=<SCALEWAY_SECRET_KEY>
S3_BUCKET=art-et-jardin-prod
S3_REGION=fr-par
BACKUP_BUCKET=art-et-jardin-backups
ARCHIVE_BUCKET=art-et-jardin-archives
```

---

## 6. Tester

### Test de connexion

```bash
# Depuis le conteneur API
docker compose exec api sh

# Verifier que le service est configure
# Le health check devrait montrer storage: connected
curl http://localhost:3000/api/v1/health/ready
```

### Test d'upload via formulaire contact

```bash
# Upload avec photo
curl -X POST http://localhost:3000/api/v1/contact \
  -F "name=Test S3" \
  -F "email=test@test.com" \
  -F "phone=0600000000" \
  -F "message=Test upload S3" \
  -F "photos=@/tmp/test-photo.jpg"
```

### Verifier dans Scaleway

1. Console > Object Storage > `art-et-jardin-prod`
2. Le fichier uploade doit apparaitre dans le bucket

### Verifications

- [ ] `storage.isConfigured()` retourne `true` (visible dans health check)
- [ ] `storage.checkConnection()` reussit (bucket accessible)
- [ ] Upload photo OK
- [ ] Download via signed URL OK
- [ ] Backup BDD stocke dans `art-et-jardin-backups`

---

## 7. Lifecycle (optionnel)

Pour reduire les couts, configurer une politique d'archivage :

Sur le bucket `art-et-jardin-archives` :
- Objets > 90 jours → Glacier (stockage froid, ~0.002€/Go/mois)

Via la console Scaleway > Bucket > Lifecycle Rules.

---

## Cout estime

| Poste | Volume estime | Cout |
|-------|---------------|------|
| Stockage Standard | < 10 Go (debut) | ~0.10€/mois |
| Stockage Backups | < 5 Go | ~0.05€/mois |
| Transfert sortant | < 5 Go/mois | Gratuit (75 Go free tier) |
| **Total** | | **~0.15€/mois** |

> Scaleway offre 75 Go de stockage gratuit. Le cout reel sera quasi nul au debut.

---

## Troubleshooting

| Probleme | Solution |
|----------|----------|
| Access Denied | Verifier API Key + scope IAM |
| Bucket not found | Verifier region (`fr-par`) et nom exact |
| CORS error | Configurer CORS sur le bucket |
| Timeout | Verifier endpoint (`https://s3.fr-par.scw.cloud`) |
| File too large | Limite API : 10 Mo (configurable dans storage.service.ts) |
