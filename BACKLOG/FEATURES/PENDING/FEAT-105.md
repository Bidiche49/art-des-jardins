# FEAT-105: Deployer la vitrine sur VPS

**Type:** Feature
**Statut:** A faire
**Priorite:** Critique
**Complexite:** S
**Tags:** vitrine, infra, seo
**Date creation:** 2026-02-12

---

## Description

Deployer le site vitrine Art des Jardins sur un VPS pour le rendre accessible au public. Le SEO local prend des mois a porter ses fruits — chaque jour de retard est un jour perdu de referencement.

Le choix du provider VPS n'est pas encore arrete (OVH, Scaleway, Hetzner, etc.). Le ticket couvre le deploiement quel que soit le provider choisi.

## User Story

**En tant que** gerant d'Art des Jardins
**Je veux** que le site vitrine soit accessible en ligne sur un nom de domaine professionnel
**Afin de** commencer a generer des leads via le SEO local sur Angers

## Pre-requis

- [x] Build vitrine fonctionnel (`pnpm build` OK - 55 pages statiques)
- [x] Infos reelles injectees (nom, tel, adresse, mentions legales)
- [ ] Hebergeur choisi (VPS provider)
- [ ] IMP-009 : Renseigner hebergeur dans mentions legales
- [ ] FEAT-103 : Favicon et og-image (recommande mais non bloquant)
- [ ] FEAT-104 : Web3Forms configure (recommande mais non bloquant)

## Criteres d'acceptation

- [ ] VPS provisionne et accessible en SSH
- [ ] Nom de domaine achete et DNS configure (ex: artdesjardins49.fr)
- [ ] HTTPS actif (Let's Encrypt / Certbot)
- [ ] Next.js deploye (SSG export statique ou Node.js server)
- [ ] Reverse proxy configure (Nginx ou Caddy)
- [ ] Deploiement automatise (script ou CI/CD)
- [ ] Site accessible sur le domaine configure
- [ ] Tester toutes les pages cles : accueil, services, contact, mentions legales
- [ ] Verifier les Schema.org avec https://validator.schema.org/
- [ ] Soumettre le sitemap a Google Search Console
- [ ] Mettre a jour les mentions legales avec les infos hebergeur (IMP-009)

## Fichiers concernes

- `apps/vitrine/next.config.js` (output config)
- `apps/vitrine/package.json` (scripts build)
- `apps/vitrine/src/app/mentions-legales/page.tsx` (section hebergeur a remplir)
- `docker/` (optionnel : Dockerfile vitrine)
- `.github/workflows/` (optionnel : CI/CD)

## Analyse / Approche

### Option A : Export statique + Nginx (recommande pour vitrine)

Le site vitrine est 100% statique (SSG, 55 pages). Un simple Nginx suffit.

```bash
# Build
cd apps/vitrine && pnpm build
# Si output: 'export' dans next.config.js → genere /out/
# Sinon utiliser next export ou servir via Node

# Sur le VPS
scp -r apps/vitrine/out/ user@vps:/var/www/artdesjardins/

# Nginx config
server {
    listen 443 ssl;
    server_name artdesjardins49.fr www.artdesjardins49.fr;
    root /var/www/artdesjardins;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri.html $uri/ /index.html;
    }

    # Cache assets
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SSL Let's Encrypt
    ssl_certificate /etc/letsencrypt/live/artdesjardins49.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/artdesjardins49.fr/privkey.pem;
}
```

### Option B : Docker + Caddy (si stack Docker deja en place)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY apps/vitrine/ ./
RUN pnpm install && pnpm build

FROM caddy:alpine
COPY --from=builder /app/out /srv
COPY Caddyfile /etc/caddy/Caddyfile
```

### Option C : Node.js server (si SSR necessaire plus tard)

```bash
cd apps/vitrine && pnpm build && pnpm start
# Derriere Nginx en reverse proxy sur port 3000
```

### Configuration DNS

1. Acheter un domaine (ex: artdesjardins49.fr)
2. Configurer les enregistrements DNS :
   - `A artdesjardins49.fr → IP_VPS`
   - `A www.artdesjardins49.fr → IP_VPS`
3. Installer Certbot : `certbot --nginx -d artdesjardins49.fr -d www.artdesjardins49.fr`

### Post-deploiement

1. **Google Search Console** : ajouter la propriete, soumettre le sitemap
2. **Google My Business** : ajouter l'URL du site sur la fiche GMB
3. **Pages Jaunes / Annuaires** : mettre a jour l'URL partout
4. **Reseaux sociaux** : partager le site (signal social pour Google)

## Tests de validation

- [ ] Le site repond en HTTPS sur le domaine configure
- [ ] Redirect HTTP → HTTPS fonctionne
- [ ] Redirect www → non-www (ou inverse) fonctionne
- [ ] Page d'accueil charge correctement (pas de 404, pas d'erreur console)
- [ ] Navigation entre les pages fonctionne
- [ ] Pages SEO locales accessibles : /paysagiste-angers, /elagage-angers, etc.
- [ ] Formulaire de contact visible (meme si cle pas encore configuree)
- [ ] Mentions legales, CGV, politique de confidentialite accessibles
- [ ] Schema.org valide (tester avec https://validator.schema.org/)
- [ ] Performance Lighthouse > 90 (Performance, SEO, Accessibility)
- [ ] Mobile responsive (tester sur smartphone)
- [ ] Open Graph preview correct (tester avec https://www.opengraph.xyz/)
- [ ] sitemap.xml accessible et valide
- [ ] robots.txt accessible
