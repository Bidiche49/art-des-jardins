# Configuration SMTP Brevo (ex-Sendinblue)

> Guide pas-a-pas pour configurer l'envoi d'emails en production.

---

## 1. Creer un compte Brevo

1. Aller sur [https://app.brevo.com/account/register](https://app.brevo.com/account/register)
2. Creer un compte avec l'email `artdesjardins49@gmail.com`
3. Plan gratuit : **300 emails/jour** (largement suffisant)

---

## 2. Obtenir les credentials SMTP

1. Aller dans **Transactional > Settings > SMTP & API**
2. Ou directement : [https://app.brevo.com/settings/keys/smtp](https://app.brevo.com/settings/keys/smtp)
3. Noter :
   - **SMTP Server** : `smtp-relay.brevo.com`
   - **Port** : `587`
   - **Login** : votre email Brevo (ou cle API)
   - **Password** : mot de passe SMTP (genere par Brevo, different du mot de passe du compte)

---

## 3. Configurer le domaine expediteur

### 3.1 Ajouter le domaine dans Brevo

1. **Settings > Senders, Domains & Dedicated IPs > Domains**
2. Ajouter `artdesjardins.fr`
3. Brevo fournira les records DNS a ajouter

### 3.2 Ajouter les records DNS

Chez votre registrar DNS (OVH, Gandi, Cloudflare...), ajouter :

**SPF** (TXT record sur `artdesjardins.fr`) :
```
v=spf1 include:sendinblue.com ~all
```

> Si un record SPF existe deja, ajouter `include:sendinblue.com` avant le `~all`.

**DKIM** (TXT record) :
```
Nom:    mail._domainkey.artdesjardins.fr
Valeur: (fourni par Brevo - longue chaine)
```

**DMARC** (optionnel mais recommande) :
```
Nom:    _dmarc.artdesjardins.fr
Valeur: v=DMARC1; p=quarantine; rua=mailto:artdesjardins49@gmail.com
```

### 3.3 Valider dans Brevo

1. Retourner dans Brevo > Domains
2. Cliquer "Verify" pour chaque record
3. Attendre la propagation DNS (peut prendre jusqu'a 24h)

---

## 4. Configurer les variables d'environnement

Dans `.env` (sur le serveur de production) :

```bash
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=<votre_login_brevo>
SMTP_PASSWORD=<mot_de_passe_smtp_brevo>
SMTP_FROM="Art des Jardins <contact@artdesjardins.fr>"
COMPANY_BCC_EMAIL=artdesjardins49@gmail.com
CONTACT_RECIPIENT_EMAIL=artdesjardins49@gmail.com
```

---

## 5. Tester

### Test rapide via curl

```bash
# Depuis le serveur, tester le formulaire contact
curl -X POST http://localhost:3000/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Deploiement",
    "email": "artdesjardins49@gmail.com",
    "phone": "0600000000",
    "message": "Test email production Brevo"
  }'
```

### Verifications

- [ ] Email recu dans `artdesjardins49@gmail.com` (pas dans spam)
- [ ] Headers SPF : `pass`
- [ ] Headers DKIM : `pass`
- [ ] Expediteur affiche : `Art des Jardins <contact@artdesjardins.fr>`
- [ ] BCC fonctionne (copie recue)

### Verifier les headers dans Gmail

1. Ouvrir l'email recu
2. Menu ⋮ > "Afficher l'original"
3. Verifier :
   - `SPF: PASS`
   - `DKIM: PASS`
   - `DMARC: PASS`

---

## 6. Monitoring

- Dashboard Brevo : [https://app.brevo.com/statistics](https://app.brevo.com/statistics)
- Quota journalier visible dans les settings
- Alertes automatiques si le quota approche

---

## Troubleshooting

| Probleme | Solution |
|----------|----------|
| Email en spam | Verifier SPF/DKIM/DMARC |
| Connection refused | Verifier port 587 ouvert (firewall VPS) |
| Auth failed | Regenerer le mot de passe SMTP dans Brevo |
| Rate limit | Plan gratuit = 300/jour, upgrader si besoin |

---

## Cout

- **Plan gratuit Brevo** : 300 emails/jour, 0€/mois
- Largement suffisant pour une entreprise de paysage
- Upgrade si besoin : Starter 9€/mois pour 20k emails/mois
