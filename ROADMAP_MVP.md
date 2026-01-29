# ROADMAP MVP - Art & Jardin

> Plan d'execution complet pour livrer le MVP sans iterations inutiles.
> Chaque phase doit etre terminee avant de passer a la suivante.

---

## ETAT ACTUEL (Post-Audit)

| Composant | Avancement | Bloqueurs |
|-----------|------------|-----------|
| API NestJS | 75% | Pas de DB reelle, pas de S3, pas de PDF |
| PWA React | 15% | Pas de pages, pas de forms, pas de sync |
| Site Vitrine | 20% | Pas de pages SEO, pas de contact |
| Infrastructure | 10% | Pas de Docker prod, pas de CI/CD |
| Tests | 85% | Mockes, pas de vraie DB |

---

## PHASE 0 : FONDATIONS (Bloquant)

> Sans cette phase, RIEN ne peut fonctionner en production.

### P0-001 : Migrations Prisma
- [ ] Executer `prisma migrate dev` pour creer les migrations
- [ ] Verifier que toutes les tables sont creees
- [ ] Creer seed.ts avec donnees de test (1 patron, 1 employe, 5 clients)
- **Validation** : `pnpm db:migrate && pnpm db:seed` sans erreur

### P0-002 : Variables d'environnement
- [ ] Creer `.env.development`, `.env.test`, `.env.production`
- [ ] Ajouter validation avec `@nestjs/config` + Joi
- [ ] Generer JWT_SECRET securise pour prod
- [ ] Documenter toutes les variables dans README
- **Validation** : API refuse de demarrer si variable manquante

### P0-003 : Docker Production
- [ ] `docker/api/Dockerfile` - Multi-stage build Node 20
- [ ] `docker/vitrine/Dockerfile` - Next.js standalone
- [ ] `docker/pwa/Dockerfile` - Nginx + Vite build
- [ ] `docker-compose.prod.yml` - Tous services + volumes
- [ ] `docker/nginx/nginx.conf` - Reverse proxy + SSL ready
- **Validation** : `docker compose -f docker-compose.prod.yml up` demarre tout

### P0-004 : CI/CD GitHub Actions
- [ ] `.github/workflows/test.yml` - Tests sur PR
- [ ] `.github/workflows/build.yml` - Build Docker images
- [ ] `.github/workflows/deploy.yml` - Deploy sur VPS (manuel)
- **Validation** : PR declenche tests automatiques

**Duree estimee Phase 0 : 2-3 jours**

---

## PHASE 1 : API COMPLETE

> API prete pour la production avec toutes les fonctionnalites.

### P1-001 : Swagger/OpenAPI
- [ ] Configurer `@nestjs/swagger` dans main.ts
- [ ] Ajouter `@ApiOperation`, `@ApiResponse` sur tous les endpoints
- [ ] Ajouter `@ApiProperty` sur tous les DTOs
- [ ] Generer swagger.json
- **Validation** : `/api/docs` affiche documentation complete

### P1-002 : Exception Filters
- [ ] Creer `AllExceptionsFilter` global
- [ ] Format uniforme : `{ status, message, error, timestamp, path }`
- [ ] Logger les erreurs 500 avec stack trace
- [ ] Ne pas exposer les details internes en prod
- **Validation** : Toutes les erreurs ont le meme format JSON

### P1-003 : Rate Limiting
- [ ] Installer `@nestjs/throttler`
- [ ] Configurer : 100 req/min par IP (general), 5 req/min (login)
- [ ] Ajouter headers `X-RateLimit-*`
- **Validation** : 6eme tentative login retourne 429

### P1-004 : Logging Structure
- [ ] Installer `nestjs-pino` ou `winston`
- [ ] Format JSON en prod, pretty en dev
- [ ] Inclure : timestamp, requestId, userId, action
- [ ] Logger toutes les requetes entrantes/sortantes
- **Validation** : Logs JSON parsables avec jq

### P1-005 : S3 Upload Service
- [ ] Creer `StorageModule` avec `StorageService`
- [ ] Implementer upload vers S3-compatible (MinIO local, Scaleway prod)
- [ ] Endpoints : `POST /upload/image`, `DELETE /upload/:key`
- [ ] Validation : type MIME, taille max 10MB
- [ ] Retourner URL publique
- **Validation** : Upload image retourne URL accessible

### P1-006 : PDF Generation
- [ ] Installer `@react-pdf/renderer` ou `pdfkit`
- [ ] Templates : Devis, Facture (header entreprise, lignes, totaux, CGV)
- [ ] Endpoint : `GET /devis/:id/pdf`, `GET /factures/:id/pdf`
- [ ] Stocker PDF genere sur S3
- **Validation** : PDF telecharge avec mise en page correcte

### P1-007 : Email Service
- [ ] Creer `MailModule` avec `MailService`
- [ ] Configurer SMTP (Brevo/Mailjet/Resend)
- [ ] Templates : Devis envoye, Facture envoyee, Relance
- [ ] Endpoints : `POST /devis/:id/send`, `POST /factures/:id/send`
- **Validation** : Email recu avec PDF en piece jointe

### P1-008 : Tests E2E avec vraie DB
- [ ] Configurer PostgreSQL de test (docker ou in-memory)
- [ ] Remplacer mocks par vraie DB dans tests e2e
- [ ] Setup/teardown : truncate tables entre tests
- [ ] Seed donnees de test avant chaque suite
- **Validation** : `pnpm test:e2e` passe avec vraie DB

**Duree estimee Phase 1 : 4-5 jours**

---

## PHASE 2 : PWA COMPLETE

> Application metier utilisable par le patron et les employes.

### P2-001 : HTTP Client + Auth
- [ ] Creer `api/client.ts` avec axios instance
- [ ] Interceptor : injecter JWT dans headers
- [ ] Interceptor : refresh token si 401
- [ ] Interceptor : redirect login si refresh fail
- [ ] Types pour toutes les responses API
- **Validation** : Appel API authentifie fonctionne

### P2-002 : Stores Zustand complets
- [ ] `stores/auth.ts` - login, logout, user, tokens
- [ ] `stores/clients.ts` - CRUD + cache
- [ ] `stores/chantiers.ts` - CRUD + cache
- [ ] `stores/devis.ts` - CRUD + cache
- [ ] `stores/factures.ts` - CRUD + cache
- [ ] `stores/interventions.ts` - CRUD + cache
- [ ] `stores/ui.ts` - sidebar, modals, notifications
- **Validation** : Stores persistent entre refresh (si token valide)

### P2-003 : Pages Liste
- [ ] `pages/Clients.tsx` - Liste + search + filters + pagination
- [ ] `pages/Chantiers.tsx` - Liste + search + filters + pagination
- [ ] `pages/Devis.tsx` - Liste + status badges + actions
- [ ] `pages/Factures.tsx` - Liste + status badges + actions
- [ ] `pages/Interventions.tsx` - Liste calendrier + liste
- [ ] `pages/Audit.tsx` - Timeline des actions (patron only)
- **Validation** : Chaque page affiche donnees de l'API

### P2-004 : Formulaires CRUD
- [ ] Installer `react-hook-form` + `zod`
- [ ] `forms/ClientForm.tsx` - Create/Edit client
- [ ] `forms/ChantierForm.tsx` - Create/Edit chantier + select client
- [ ] `forms/InterventionForm.tsx` - Create/Edit + select chantier + date
- [ ] Modals pour create/edit
- [ ] Validation temps reel + erreurs API
- **Validation** : CRUD complet fonctionne pour chaque entite

### P2-005 : Devis Builder
- [ ] `pages/DevisBuilder.tsx` - Interface creation devis
- [ ] Select client + chantier
- [ ] Ajouter/supprimer lignes (designation, quantite, prix unitaire)
- [ ] Calcul automatique HT, TVA, TTC
- [ ] Preview avant envoi
- [ ] Actions : Enregistrer brouillon, Envoyer au client
- **Validation** : Creer devis complet avec lignes et l'envoyer

### P2-006 : Facture Generator
- [ ] `pages/FactureFromDevis.tsx` - Convertir devis accepte en facture
- [ ] Copie automatique des lignes
- [ ] Numero auto-genere
- [ ] Actions : Generer PDF, Envoyer, Marquer payee
- **Validation** : Facture generee depuis devis avec PDF

### P2-007 : Dashboard
- [ ] `pages/Dashboard.tsx` - Vue d'ensemble
- [ ] Widgets : CA du mois, Devis en attente, Factures impayees
- [ ] Interventions du jour/semaine
- [ ] Graphique CA sur 6 mois
- [ ] Raccourcis actions frequentes
- **Validation** : Dashboard affiche metriques reelles

### P2-008 : Upload Photos
- [ ] Composant `ImageUploader.tsx`
- [ ] Upload vers S3 via API
- [ ] Preview + suppression
- [ ] Integration dans Chantier et Intervention
- **Validation** : Photo uploadee visible dans fiche chantier

### P2-009 : Service Worker + Offline
- [ ] Configurer `vite-plugin-pwa` completement
- [ ] Cache : pages, assets, API responses (GET)
- [ ] Detecter mode offline
- [ ] Queue les mutations (POST/PUT/DELETE) quand offline
- [ ] Sync automatique au retour online
- [ ] UI : indicateur online/offline + pending sync count
- **Validation** : Creer client offline, sync quand online

### P2-010 : PWA Install + Update
- [ ] `manifest.json` complet (icons, colors, name)
- [ ] Prompt d'installation
- [ ] Detection nouvelle version
- [ ] UI : "Nouvelle version disponible, recharger"
- **Validation** : App installable sur mobile, update fonctionne

### P2-011 : UI/UX Polish
- [ ] Installer Tailwind CSS
- [ ] Design system : colors, typography, spacing
- [ ] Composants : Button, Input, Select, Modal, Card, Badge, Table
- [ ] Responsive : mobile-first
- [ ] Loading states, empty states, error states
- [ ] Toasts pour feedback actions
- **Validation** : App utilisable et agreable sur mobile

### P2-012 : Tests PWA
- [ ] Configurer Vitest + Testing Library
- [ ] Tests composants critiques
- [ ] Tests stores
- [ ] Tests integration (mock API)
- **Validation** : `pnpm test` passe dans apps/pwa

**Duree estimee Phase 2 : 7-10 jours**

---

## PHASE 3 : SITE VITRINE SEO

> Site generant des leads via SEO local.

### P3-001 : Pages Services
- [ ] `/services` - Liste tous les services
- [ ] `/services/paysagisme` - Detail + gallery
- [ ] `/services/entretien-jardin` - Detail + gallery
- [ ] `/services/elagage` - Detail + gallery
- [ ] `/services/abattage` - Detail + gallery
- [ ] Schema.org Service sur chaque page
- **Validation** : Pages indexables avec contenu unique

### P3-002 : Pages SEO Multi-Villes
- [ ] `/paysagiste-angers` - Page principale ville
- [ ] `/elagage-angers`
- [ ] `/entretien-jardin-angers`
- [ ] Pages communes peripheriques (10-15 pages)
- [ ] Contenu unique par page (pas de duplicate)
- [ ] Schema.org LocalBusiness avec zone
- **Validation** : Chaque page a contenu unique >500 mots

### P3-003 : Page Contact
- [ ] `/contact` - Coordonnees + map + formulaire
- [ ] Formulaire : nom, email, tel, message, service interesse
- [ ] Envoi email a contact@artjardin.fr
- [ ] Confirmation visuelle + email auto
- [ ] Honeypot anti-spam
- **Validation** : Formulaire envoie email reel

### P3-004 : Pages Legales
- [ ] `/mentions-legales`
- [ ] `/politique-confidentialite`
- [ ] `/cgv` (si applicable)
- **Validation** : Pages accessibles depuis footer

### P3-005 : Temoignages
- [ ] Section temoignages sur homepage
- [ ] Schema.org Review
- [ ] 5-10 temoignages avec nom, ville, note
- **Validation** : Rich snippets visibles dans Google

### P3-006 : SEO Technique
- [ ] `sitemap.xml` dynamique
- [ ] `robots.txt`
- [ ] Balises meta optimisees par page
- [ ] Images optimisees (Next/Image, WebP)
- [ ] Core Web Vitals >90
- **Validation** : Lighthouse SEO >95

### P3-007 : Analytics
- [ ] Installer Plausible ou Umami (RGPD-friendly)
- [ ] Tracker : pages vues, sources, conversions contact
- [ ] Dashboard analytics accessible
- **Validation** : Stats visibles apres 24h

**Duree estimee Phase 3 : 3-4 jours**

---

## PHASE 4 : DEPLOIEMENT PRODUCTION

> Mise en ligne sur VPS.

### P4-001 : Serveur VPS
- [ ] Commander VPS (Scaleway/OVH) - 4GB RAM, 2 vCPU
- [ ] Configurer SSH, firewall (ufw), fail2ban
- [ ] Installer Docker + Docker Compose
- [ ] Configurer DNS : api.artjardin.fr, app.artjardin.fr, artjardin.fr
- **Validation** : SSH accessible, Docker fonctionne

### P4-002 : SSL/HTTPS
- [ ] Installer Traefik ou Caddy comme reverse proxy
- [ ] Configurer Let's Encrypt auto-renew
- [ ] Redirection HTTP -> HTTPS
- **Validation** : Tous les domaines en HTTPS valide

### P4-003 : Base de donnees Production
- [ ] PostgreSQL sur VPS ou managed (Scaleway)
- [ ] Backups automatiques quotidiens
- [ ] Retention 30 jours
- [ ] Script restore teste
- **Validation** : Backup + restore fonctionnel

### P4-004 : Stockage S3
- [ ] Configurer bucket S3 (Scaleway Object Storage)
- [ ] Configurer CORS pour uploads
- [ ] CDN pour assets statiques (optionnel)
- **Validation** : Upload image depuis PWA vers S3

### P4-005 : Monitoring
- [ ] Installer Uptime Kuma ou equivalent
- [ ] Alertes : API down, DB down, SSL expire
- [ ] Dashboard sante services
- **Validation** : Alerte recue si service down

### P4-006 : Deploy Initial
- [ ] Build et push images Docker
- [ ] Deploy via docker-compose sur VPS
- [ ] Executer migrations prod
- [ ] Creer compte patron initial
- [ ] Verifier tous les services
- **Validation** : App accessible et fonctionnelle en prod

**Duree estimee Phase 4 : 2-3 jours**

---

## RECAPITULATIF

| Phase | Description | Duree | Dependances |
|-------|-------------|-------|-------------|
| **Phase 0** | Fondations | 2-3j | - |
| **Phase 1** | API Complete | 4-5j | Phase 0 |
| **Phase 2** | PWA Complete | 7-10j | Phase 1 |
| **Phase 3** | Site Vitrine | 3-4j | Phase 0 |
| **Phase 4** | Deploiement | 2-3j | Phase 1, 2, 3 |

**Total estime : 18-25 jours de travail**

---

## ORDRE D'EXECUTION OPTIMAL

```
Semaine 1:
├── Phase 0 (Fondations)
└── Phase 1 (API) en parallele fin de semaine

Semaine 2:
├── Phase 1 (fin)
└── Phase 2 (PWA debut)

Semaine 3:
├── Phase 2 (PWA suite)
└── Phase 3 (Vitrine) en parallele

Semaine 4:
├── Phase 2 (PWA fin)
├── Phase 3 (Vitrine fin)
└── Phase 4 (Deploiement)
```

---

## REGLES D'EXECUTION

1. **Pas de phase suivante sans validation** - Chaque checkbox doit etre cochee
2. **Commit atomique par tache** - 1 tache = 1 commit
3. **Tests avant merge** - Rien ne passe sans tests verts
4. **Documentation au fil de l'eau** - README mis a jour a chaque feature
5. **Review avant prod** - Checklist securite avant deploiement

---

## HORS SCOPE MVP (Phase 5+)

Ces elements sont volontairement exclus du MVP :

- [ ] Notifications push PWA
- [ ] Portail client (acces devis/factures)
- [ ] Multi-entreprise / SaaS
- [ ] GraphQL
- [ ] App native iOS/Android
- [ ] Signature electronique devis
- [ ] Paiement en ligne
- [ ] Calendrier partage equipe
- [ ] Geolocalisation interventions
- [ ] Reporting avance / BI

A planifier apres validation MVP en production.
