# CLAUDE.md - Art & Jardin

## Projet

Digitalisation complete d'une entreprise de paysage (Angers).

**Stack technique:**
- **Site vitrine**: Next.js (SSG/ISR) sur Cloudflare Pages
- **App metier**: React + TypeScript (PWA, offline-first)
- **Backend**: NestJS (Node.js), REST API, JWT auth
- **BDD**: PostgreSQL
- **Stockage**: S3-compatible (Scaleway/OVH/MinIO)
- **Infra**: Docker Compose sur VPS

---

## Structure du projet

```
art_et_jardin/
├── apps/
│   ├── vitrine/          # Next.js - Site SEO
│   ├── pwa/              # React PWA - App metier
│   └── api/              # NestJS - Backend
├── packages/
│   ├── shared/           # Types, utils partages
│   └── database/         # Prisma/TypeORM schemas
├── docker/
└── docs/
```

---

## Phases du projet

| Phase | Description | Priorite |
|-------|-------------|----------|
| 1 | Site vitrine SEO (lead generation) | MVP |
| 2 | CRM & coeur metier | MVP |
| 3 | App associes (offline-first) | MVP |
| 4 | Gestion roles et securite (RBAC) | MVP |
| 5 | Notifications (Push PWA, Email) | Evolution |
| 6 | Exports & reversibilite | MVP |
| 7 | Portail client | Evolution |

---

## Contraintes non negociables

- **Export 1 clic** : Toutes les donnees critiques exportables
- **Offline-first** : PWA avec IndexedDB, Service Workers
- **Pas de no-code/low-code**
- **Pas de lock-in** (pas Firebase)
- **Couts maitrises** : ~15-30€/mois infra
- **Separation vitrine / outil metier**
- **Securite backend-first** : RBAC, audit logs

---

## Conventions de code

### TypeScript (Frontend + Backend)

```typescript
// Nommage
interface Client { }           // PascalCase pour types/interfaces
const getClientById = () => {} // camelCase pour fonctions
const CLIENT_STATUS = {}       // SCREAMING_SNAKE pour constantes

// Fichiers
client.service.ts              // kebab-case pour fichiers
client.controller.ts
client.entity.ts
client.dto.ts
```

### API REST

```
GET    /api/v1/clients
GET    /api/v1/clients/:id
POST   /api/v1/clients
PUT    /api/v1/clients/:id
DELETE /api/v1/clients/:id
```

### Commits

```
feat(api): add client CRUD endpoints
fix(pwa): resolve offline sync issue
docs: update API documentation
test: add integration tests for auth
```

---

## Entites principales

| Entite | Description |
|--------|-------------|
| Client | particulier / pro / syndic |
| Chantier | Projet lie a un client |
| Devis | Proposition commerciale |
| Facture | Document de facturation |
| Intervention | Execution terrain |
| User | Associe, employe |

---

## 3. STRATEGIE DE TESTS - REGLE CAPITALE

**Les tests sont la PIERRE ANGULAIRE de la qualite du projet. Sans tests exhaustifs, le projet ne peut pas avancer sereinement.**

## Objectif: MAXIMUM de tests UTILES

**A chaque feature/fix, tu DOIS ecrire:**

1. **Tests unitaires** - Modeles, utils, logique metier
2. **Tests de providers** - State management, getters, mutations
3. **Tests de widgets** - UI, interactions, etats visuels
4. **Tests edge cases** - Valeurs limites, cas vides, erreurs
5. **Tests d'integrite** - IDs uniques, donnees valides, contraintes
6. **Tests d'integration de flow** - Flow COMPLET de bout en bout

### TESTS D'INTEGRATION DE FLOW (CRITIQUE)

> **Les tests unitaires ne suffisent PAS.**
> 1500+ tests unitaires peuvent passer alors que le jeu ne fonctionne pas.
> Les tests unitaires verifient les pieces, pas l'assemblage.

**RAPPEL: Si tu ne peux pas prouver que ca marche avec des tests, ca ne marche pas.**

---

## Commandes utiles

```bash
# Dev
pnpm dev                    # Lancer tous les services
pnpm dev:vitrine            # Site vitrine seul
pnpm dev:pwa                # App PWA seule
pnpm dev:api                # Backend seul

# Tests
pnpm test                   # Tous les tests
pnpm test:unit              # Tests unitaires
pnpm test:e2e               # Tests end-to-end
pnpm test:coverage          # Avec couverture

# Build
pnpm build                  # Build production
pnpm docker:up              # Docker compose up
pnpm docker:down            # Docker compose down

# Database
pnpm db:migrate             # Migrations
pnpm db:seed                # Seed data
pnpm db:reset               # Reset + seed
```

---

## SEO Local (Phase 1)

Pages geolocalises obligatoires:
- `/paysagiste-angers`
- `/elagage-angers`
- `/entretien-jardin-angers`
- Pages communes peripheriques

Schema.org requis:
- LocalBusiness
- Service
- FAQ

---

## Securite

- HTTPS obligatoire
- JWT courts + refresh tokens
- bcrypt pour mots de passe
- Protection CSRF
- Validation stricte inputs (class-validator)
- Rate limiting API
- Audit logs sur toutes les actions sensibles

---

## Workflow tickets

Utiliser le systeme BACKLOG/ pour toutes les taches:
- `/backlog:bug` pour les bugs
- `/backlog:feat` pour les features
- `/backlog:imp` pour les ameliorations
- `/backlog:status` pour les stats

---

*Reference: cahier_des_charges.md*
