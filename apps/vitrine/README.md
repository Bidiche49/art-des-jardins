# Art & Jardin - Site Vitrine

Site vitrine SEO pour Art & Jardin, paysagiste a Angers.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Deploiement**: Cloudflare Pages (export statique) ou Docker (standalone)

## Developpement

```bash
pnpm dev        # http://localhost:3001
pnpm build      # Build production
pnpm start      # Serveur production
```

## Structure

```
src/
├── app/                    # Pages (App Router)
│   ├── page.tsx           # Homepage
│   ├── services/          # Pages services
│   ├── contact/           # Formulaire contact
│   ├── [serviceCity]/     # Pages SEO dynamiques
│   ├── *-angers/          # Pages SEO principales
│   ├── mentions-legales/
│   ├── politique-confidentialite/
│   ├── cgv/
│   ├── sitemap.ts         # Sitemap dynamique
│   └── robots.ts          # robots.txt
├── components/
│   ├── layout/            # Header, Footer
│   ├── seo/               # Schemas JSON-LD
│   ├── ContactForm.tsx
│   ├── Testimonials.tsx
│   └── Analytics.tsx
└── lib/
    ├── services-data.ts   # Donnees services
    └── cities-data.ts     # Donnees villes SEO
```

## Pages generees (55 pages)

- `/` - Homepage
- `/services/` - Liste services
- `/services/[slug]/` - Detail service (4 pages)
- `/paysagiste-angers/`, `/elagage-angers/`, etc. - Pages SEO principales (4)
- `/paysagiste-[ville]/`, etc. - Pages SEO villes (36 combinaisons)
- `/contact/` - Formulaire
- `/mentions-legales/`, `/politique-confidentialite/`, `/cgv/`

## Configuration avant production

### 1. Variables d'environnement

Creer `.env.production`:

```env
# Formulaire contact (Web3Forms - gratuit)
# Inscription: https://web3forms.com
NEXT_PUBLIC_WEB3FORMS_KEY=your_access_key

# Analytics (Plausible - payant ou self-hosted)
# https://plausible.io
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=art-et-jardin.fr

# OU Umami (self-hosted, gratuit)
# NEXT_PUBLIC_UMAMI_WEBSITE_ID=xxx
# NEXT_PUBLIC_UMAMI_URL=https://analytics.example.com

# URL du site
NEXT_PUBLIC_SITE_URL=https://art-et-jardin.fr
```

### 2. Informations legales

Remplacer les placeholders `[...]` dans:
- `src/app/mentions-legales/page.tsx`
- `src/app/politique-confidentialite/page.tsx`
- `src/app/cgv/page.tsx`

Informations requises:
- Raison sociale et forme juridique
- Adresse complete
- Numero SIRET
- Capital social
- Nom du gerant
- Coordonnees hebergeur
- Coordonnees mediateur consommation

### 3. Assets

Ajouter dans `public/`:
- `og-image.jpg` (1200x630) - Image OpenGraph
- `favicon.ico` - Favicon
- Optionnel: images pour les realisations

### 4. Coordonnees

Mettre a jour le numero de telephone et email dans:
- `src/components/layout/Footer.tsx`
- `src/components/seo/LocalBusinessSchema.tsx`
- Pages contact et services

### 5. Google Search Console

1. Deployer le site
2. Ajouter le site dans Google Search Console
3. Recuperer le code de verification
4. Ajouter dans `src/app/layout.tsx`:
   ```ts
   verification: {
     google: 'votre-code-verification',
   },
   ```
5. Soumettre le sitemap: `https://art-et-jardin.fr/sitemap.xml`

## SEO

### Schema.org implementes

- `LocalBusiness` - Homepage et pages villes
- `Service` - Pages services
- `FAQPage` - FAQ sur pages services
- `AggregateRating` + `Review` - Temoignages

### Sitemap

Genere automatiquement avec toutes les pages.
URL: `/sitemap.xml`

### Robots.txt

Genere automatiquement.
URL: `/robots.txt`

## Deploiement

### Cloudflare Pages (recommande)

```bash
# Build statique
pnpm build
# Output dans `out/`
```

### Docker

```bash
# Build avec mode standalone
DOCKER_BUILD=true pnpm build
```

## Notes

- Le formulaire de contact utilise Web3Forms (gratuit, RGPD-friendly)
- Analytics avec Plausible (pas de cookies, RGPD-friendly)
- Toutes les pages sont pre-rendues (SSG) pour performances optimales
