# Tests Manuels - Checklist Validation

> Checklist des tests manuels a effectuer pour valider les 8 phases du projet.

---

## Phase 1 - Setup Monorepo

- [ ] `pnpm install` fonctionne sans erreur
- [ ] `pnpm dev` lance les 3 apps (vitrine, pwa, api)
- [ ] Structure monorepo correcte (apps/, packages/)

---

## Phase 2 - Backend NestJS

### Authentification
- [ ] POST /auth/login avec credentials valides retourne tokens
- [ ] POST /auth/login avec mauvais password retourne 401
- [ ] POST /auth/refresh avec token valide retourne nouveaux tokens
- [ ] Routes protegees retournent 401 sans token

### CRUD Clients
- [ ] GET /clients retourne la liste paginee
- [ ] POST /clients cree un nouveau client
- [ ] GET /clients/:id retourne le detail
- [ ] PUT /clients/:id met a jour
- [ ] DELETE /clients/:id supprime (patron only)

### CRUD Chantiers
- [ ] GET /chantiers retourne la liste
- [ ] POST /chantiers cree un chantier lie a un client
- [ ] Filtrage par clientId fonctionne
- [ ] Filtrage par statut fonctionne

### Devis
- [ ] Creation devis avec lignes
- [ ] Calcul automatique TTC
- [ ] Generation numero sequentiel (DEV-YYYYMM-XXX)
- [ ] Changement statut (brouillon -> envoye -> accepte)

### Factures
- [ ] Creation depuis devis accepte
- [ ] Generation numero sequentiel (FAC-YYYYMM-XXX)
- [ ] Marquage paye avec date

### Interventions
- [ ] Creation intervention liee a chantier
- [ ] Validation par patron
- [ ] Calcul duree automatique

---

## Phase 3 - Site Vitrine Next.js

- [ ] Page accueil se charge
- [ ] Pages services SEO (/paysagiste-angers, etc.)
- [ ] Formulaire contact fonctionne
- [ ] Meta tags et Schema.org presents
- [ ] Responsive mobile

### Formulaire de contact (hybride API + Web3Forms)
- [ ] Soumission via API fonctionne (verifier en BDD `SELECT * FROM contact_requests`)
- [ ] Email de notification recu par le paysagiste
- [ ] Honeypot : soumettre avec champ `website` rempli → success silencieux, rien en BDD
- [ ] Rate limiting : 6e soumission en 1 min → erreur 429 (pas de fallback)
- [ ] Fallback Web3Forms : couper l'API → soumission → passe par Web3Forms
- [ ] Erreur 400 (champ manquant) → message d'erreur affiche, PAS de fallback
- [ ] Upload photos (max 3) → stockees en S3, keys en BDD
- [ ] Timeout API (8s) → fallback automatique vers Web3Forms

---

## Phase 4 - PWA React

### Navigation
- [ ] Login fonctionne
- [ ] Navigation entre pages fluide
- [ ] Deconnexion redirige vers login

### Clients
- [ ] Liste clients avec recherche
- [ ] Creation nouveau client
- [ ] Detail client avec chantiers lies

### Chantiers
- [ ] Liste avec filtres statut
- [ ] Creation chantier
- [ ] Detail avec interventions

### Devis
- [ ] Builder devis avec ajout lignes
- [ ] Apercu avant envoi
- [ ] Envoi par email

---

## Phase 5.1 - Signature Electronique

- [ ] Lien signature recu par email client
- [ ] Page signature s'affiche avec devis
- [ ] Canvas signature tactile fonctionne
- [ ] Validation enregistre signature + horodatage
- [ ] PDF regenere avec signature
- [ ] Email confirmation envoye

---

## Phase 5.2 - Notifications Push

- [ ] Demande permission push s'affiche
- [ ] Accepter active les notifications
- [ ] Rappel intervention J-1 recu
- [ ] Notification nouveau devis signe recue

---

## Phase 5.3 - Calendrier Equipe

- [ ] Vue calendrier avec interventions
- [ ] Navigation mois/semaine/jour
- [ ] Drag & drop pour replanifier
- [ ] Gestion absences employes
- [ ] Export iCal fonctionne

---

## Phase 6 - Portail Client

### Authentification Magic Link
- [ ] Saisie email client envoie lien
- [ ] Clic sur lien connecte le client
- [ ] Token expire apres 15 min
- [ ] Token usage unique

### Dashboard Client
- [ ] Affiche resume (chantiers, devis, factures)
- [ ] Navigation vers sections

### Consultation Documents
- [ ] Liste devis avec statuts
- [ ] Liste factures avec statuts
- [ ] Telechargement PDF

### Suivi Chantier
- [ ] Timeline des interventions
- [ ] Photos des travaux
- [ ] Statut en temps reel

### Messagerie
- [ ] Creation nouvelle conversation
- [ ] Envoi message
- [ ] Reception reponse entreprise
- [ ] Compteur non-lus

---

## Phase 7 - Reporting/Analytics

### Dashboard KPI
- [ ] Total clients, chantiers, devis, factures
- [ ] CA devis vs CA facture
- [ ] Taux conversion devis

### Rapports Financiers
- [ ] Rapport mensuel
- [ ] Rapport trimestriel
- [ ] Rapport annuel
- [ ] Liste factures impayees

### Exports
- [ ] Export CSV factures
- [ ] Export JSON devis
- [ ] Filtrage par periode

---

## Phase 8 - Offline-first PWA

### Service Worker
- [ ] App se charge sans connexion (apres 1er chargement)
- [ ] Assets servis depuis cache
- [ ] Indicateur offline visible

### IndexedDB
- [ ] Donnees clients disponibles offline
- [ ] Donnees chantiers disponibles offline
- [ ] Persistance apres fermeture app

### Sync Queue
- [ ] Creation offline stockee dans queue
- [ ] Badge "X en attente" affiche
- [ ] Sync automatique au retour online
- [ ] Notification succes sync

### Mode Sombre
- [ ] Toggle dans parametres
- [ ] Mode auto suit systeme
- [ ] Persistance du choix
- [ ] Tous composants adaptes

---

## Tests Automatises Existants

### Tests Unitaires API (59 tests)
```bash
cd apps/api && pnpm test
```

### Tests E2E API
```bash
cd apps/api && pnpm test:e2e
```

Fichiers:
- auth.e2e-spec.ts
- clients.e2e-spec.ts
- chantiers.e2e-spec.ts
- devis.e2e-spec.ts
- factures.e2e-spec.ts
- interventions.e2e-spec.ts
- audit.e2e-spec.ts
- export.e2e-spec.ts
- client-auth.e2e-spec.ts
- client-portal.e2e-spec.ts
- messaging.e2e-spec.ts
- analytics.e2e-spec.ts
- integration/full-flow.e2e-spec.ts

---

## Environnement de Test

```bash
# Lancer tous les services
pnpm dev

# API: http://localhost:3000
# PWA: http://localhost:5173
# Vitrine: http://localhost:3001

# Utilisateur test
# Email: patron@artjardin.fr
# Password: password123
```

---

*Derniere mise a jour: 2026-01-30*
