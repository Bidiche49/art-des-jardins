# Base de Donnees - Art & Jardin

## Stack

- **PostgreSQL 16** - Base de donnees relationnelle
- **Prisma** - ORM TypeScript
- **Docker Compose** - Environnement local

---

## Quick Start

### 1. Demarrer PostgreSQL

```bash
# Demarrer les services Docker (PostgreSQL + Adminer)
pnpm docker:up

# Verifier que PostgreSQL est up
docker compose ps
```

### 2. Initialiser la base de donnees

```bash
# Generer le client Prisma + executer migrations + seed
pnpm db:init
```

Cette commande execute dans l'ordre :
1. `pnpm db:generate` - Genere le client Prisma
2. `pnpm db:migrate` - Applique les migrations
3. `pnpm db:seed` - Insere les donnees de test

### 3. Acceder a la base

- **Adminer** : http://localhost:8080
  - Systeme: PostgreSQL
  - Serveur: postgres
  - Utilisateur: artjardin
  - Mot de passe: artjardin_dev
  - Base: artjardin

- **Prisma Studio** : `pnpm db:studio`
  - Interface graphique pour explorer les donnees

---

## Commandes disponibles

| Commande | Description |
|----------|-------------|
| `pnpm docker:up` | Demarrer PostgreSQL et Adminer |
| `pnpm docker:down` | Arreter les services Docker |
| `pnpm db:init` | Initialisation complete (generate + migrate + seed) |
| `pnpm db:generate` | Regenerer le client Prisma |
| `pnpm db:migrate` | Appliquer les migrations en dev |
| `pnpm db:migrate:prod` | Appliquer les migrations en prod |
| `pnpm db:seed` | Executer le seed (donnees de test) |
| `pnpm db:reset` | Reset complet (drop + migrate + seed) |
| `pnpm db:studio` | Ouvrir Prisma Studio |

---

## Schema

Le schema Prisma est dans `packages/database/prisma/schema.prisma`.

### Entites principales

| Table | Description |
|-------|-------------|
| `users` | Utilisateurs (patron, employes) |
| `clients` | Clients (particuliers, pros, syndics) |
| `chantiers` | Projets/sites lies aux clients |
| `devis` | Devis avec lignes de detail |
| `factures` | Factures generees depuis devis |
| `interventions` | Interventions terrain |
| `audit_logs` | Journal des actions |
| `sequences` | Numerotation devis/factures |

### Enums

- `UserRole` : patron, employe
- `ClientType` : particulier, professionnel, syndic
- `ChantierStatut` : lead, visite_planifiee, devis_envoye, accepte, planifie, en_cours, termine, facture, annule
- `DevisStatut` : brouillon, envoye, accepte, refuse, expire
- `FactureStatut` : brouillon, envoyee, payee, annulee
- `TypePrestation` : paysagisme, entretien, elagage, abattage, tonte, taille, autre
- `ModePaiement` : virement, cheque, especes, carte

---

## Donnees de test (Seed)

Apres le seed, les donnees suivantes sont disponibles :

### Utilisateurs

| Email | Mot de passe | Role |
|-------|--------------|------|
| patron@artjardin.fr | password123 | patron |
| pierre.martin@artjardin.fr | password123 | employe |
| lucas.bernard@artjardin.fr | password123 | employe |

### Clients

- 2 particuliers (Marie Durand, Philippe Moreau)
- 2 professionnels (Lefebvre SARL, Restaurant Le Petit Jardin)
- 1 syndic (GIA - Syndic)

### Chantiers

- 3 chantiers exemples avec differents statuts

---

## Migrations

### Creer une nouvelle migration

```bash
# Apres modification du schema.prisma
cd packages/database
pnpm prisma migrate dev --name nom_de_la_migration
```

### Appliquer en production

```bash
pnpm db:migrate:prod
```

---

## Troubleshooting

### "Can't reach database server"

```bash
# Verifier que Docker est demarre
docker compose ps

# Redemarrer PostgreSQL
docker compose restart postgres
```

### "Migration failed"

```bash
# Reset complet (ATTENTION: perd toutes les donnees)
pnpm db:reset
```

### Regenerer le client Prisma

```bash
pnpm db:generate
```
