# CAHIER DES CHARGES TECHNIQUE

## Digitalisation complète d’une entreprise de paysage (Angers)

---

## 1. Contexte et objectifs

### 1.1 Contexte

* Entreprise de paysage en création
* Localisation : Angers et communes périphériques
* 2 associés fondateurs
* Activités principales :

  * Paysagisme
  * Entretien de jardins
  * Élagage / abattage
  * Contrats récurrents (particuliers, entreprises, syndics)

### 1.2 Objectifs globaux

* Créer un **écosystème digital propriétaire**, robuste et pérenne
* Centraliser l’intégralité de l’activité (commerciale, opérationnelle, administrative)
* Maximiser :

  * performance
  * résilience
  * contrôle des données
  * réversibilité (export total à tout moment)
* Offrir une **expérience premium** aux associés, employés et clients
* Optimiser le **SEO local** pour générer des leads qualifiés

---

## 2. Hypothèses et contraintes majeures

### 2.1 Hypothèses

* Volume initial faible (peu d’utilisateurs, peu de données)
* Croissance progressive (clients, employés, chantiers)
* Usage terrain important (mobile, tablette)
* Connexion réseau parfois absente ou instable

### 2.2 Contraintes non négociables

* ❗ Toutes les données critiques doivent être **exportables en 1 clic**
* ❗ Fonctionnement **offline-first** pour les associés
* ❗ Aucun no-code / low-code
* ❗ Stack maîtrisable long terme (pas de lock-in type Firebase)
* ❗ Coûts d’infrastructure maîtrisés (~15–30€/mois)
* ❗ Séparation claire site vitrine / outil métier
* ❗ Sécurité backend-first (RBAC, audit)

---

## 3. Architecture globale

### 3.1 Vue d’ensemble

```
[ Site vitrine SEO ]
        |
        | (formulaire devis)
        v
[ API Backend ] <--> [ PostgreSQL ]
        |
        |<--> [ Object Storage S3 ]
        |
[ App React PWA ]
```

---

## 4. Choix techniques

### 4.1 Frontend

#### 4.1.1 Site vitrine

* Framework : **Next.js (SSG / ISR)**
* Hébergement : **Cloudflare Pages (CDN, gratuit)**
* Objectif :

  * SEO maximal
  * Performance maximale
  * Découplage total du backend métier

#### 4.1.2 Application métier (CRM + app associés)

* Framework : **React + TypeScript**
* Format : **PWA**
* Cibles :

  * Mobile (iOS / Android)
  * Tablette
  * Desktop
* Fonctionnalités :

  * Offline-first
  * IndexedDB
  * Service Workers
  * Icône écran d’accueil (iOS & Android)

---

### 4.2 Backend

* Runtime : **Node.js**
* Framework : **NestJS** (ou Express structuré équivalent)
* API : REST (JSON)
* Authentification :

  * JWT + Refresh tokens
* Architecture :

  * Monorepo possible
  * Docker obligatoire

---

### 4.3 Base de données

* SGBD : **PostgreSQL**
* Justification :

  * Relations complexes
  * Transactions
  * Exports natifs
  * Auditabilité
  * Robustesse

---

### 4.4 Stockage fichiers

* Type : **Object Storage S3-compatible**
* Données stockées :

  * Photos chantiers
  * PDF devis/factures
  * Exports ZIP
* Fournisseurs compatibles :

  * Scaleway
  * OVH
  * MinIO (auto-hébergé si besoin)

---

### 4.5 Infrastructure

* VPS unique

  * 2 vCPU / 4 Go RAM minimum
* Docker Compose
* Services :

  * API
  * PostgreSQL
  * Reverse proxy (Nginx)
* Sauvegardes :

  * Dump PostgreSQL quotidien
  * Snapshot VPS
  * Versioning stockage objets

---

## 5. Découpage fonctionnel

---

## PHASE 1 — Site vitrine SEO (Lead generation)

### 5.1 Pages obligatoires

* Accueil
* Pages services géolocalisées :

  * `/paysagiste-angers`
  * `/elagage-angers`
  * `/entretien-jardin-angers`
  * Pages par communes périphériques
* Contact
* Mentions légales

### 5.2 SEO technique

* HTML statique
* Core Web Vitals optimisés
* Images WebP / AVIF
* Schema.org :

  * LocalBusiness
  * Service
  * FAQ

### 5.3 Formulaire devis

* Champs :

  * Type client
  * Type prestation
  * Surface / fréquence
  * Adresse (géolocalisée)
  * Photos upload
* Traitement :

  * POST API
  * Création automatique d’un lead

---

## PHASE 2 — CRM & cœur métier (MVP)

### 6.1 Entités principales

#### 6.1.1 Client

* id
* type (particulier / pro / syndic)
* coordonnées
* historique

#### 6.1.2 Chantier

* client_id
* adresse
* statut
* dates
* responsables

#### 6.1.3 Devis

* chantier_id
* lignes
* montant
* statut
* PDF généré

#### 6.1.4 Facture

* devis_id
* statut (brouillon / envoyée / payée)
* PDF

#### 6.1.5 Intervention

* chantier_id
* date
* temps passé
* employé

---

### 6.2 Pipeline commercial

1. Lead entrant
2. Visite à planifier
3. Devis envoyé
4. Accepté / refusé
5. Chantier planifié
6. Terminé
7. Facturé

---

## PHASE 3 — Application associés (offline-first)

### 7.1 Fonctionnalités

* Consultation chantiers assignés
* Ajout photos avant / après
* Notes texte / vocales
* Validation fin de chantier
* Pointage temps

### 7.2 Offline

* Cache IndexedDB :

  * clients
  * chantiers récents
  * devis/factures
  * photos compressées
* Stratégie LRU / FIFO
* Mode dégradé explicite

---

## PHASE 4 — Gestion des rôles et sécurité

### 8.1 Rôles

* Patron
* Employé
* (futur : chef d’équipe, comptable)

### 8.2 RBAC

* Middleware backend
* Permissions par endpoint
* UI conditionnée par droits

### 8.3 Audit

* Table `audit_logs`
* Log :

  * utilisateur
  * action
  * entité
  * timestamp
* Exportable

---

## PHASE 5 — Notifications

### 9.1 Types d’événements

* Nouveau devis
* Devis accepté
* Chantier terminé
* Facture envoyée

### 9.2 Canaux

* Push PWA
* Email transactionnel (fallback)

### 9.3 Limites iOS

* Push non temps réel garanti
* Pas de silent push
* Acceptation explicite requise

---

## PHASE 6 — Exports & réversibilité (CRITIQUE)

### 10.1 Exports disponibles

* CSV par table
* PDF documents
* ZIP par chantier :

  * client.json
  * devis.pdf
  * facture.pdf
  * photos/
  * notes.txt

### 10.2 Accès

* UI “Exporter”
* API dédiée `/export/*`
* Téléchargement
* Envoi email
* Dépôt cloud automatique

---

## PHASE 7 — Portail client (évolution)

### 11.1 Fonctionnalités

* Accès planning
* Historique interventions
* Photos après passage
* Factures / contrats
* Messagerie simple

---

## 12. Sécurité

* HTTPS obligatoire
* JWT courts + refresh
* Hash mots de passe (bcrypt)
* Protection CSRF
* Validation stricte des entrées
* Rate limiting API

---

## 13. Performance & scalabilité

* CDN pour site vitrine
* Cache HTTP API
* Index DB
* Pagination systématique
* Aucune dépendance bloquante externe

---

## 14. Maintenance & exploitation

* Logs centralisés
* Monitoring basique
* Backups testés
* Procédure de restauration documentée
* Documentation API

---

## 15. Priorisation

### MVP indispensable

* Site vitrine SEO
* CRM
* App associés
* Offline
* Exports

### Évolutions

* Portail client
* App native si besoin
* Reporting avancé
* BI

---

## 16. Conclusion

Ce document définit **l’intégralité du périmètre fonctionnel et technique** du projet.
Toute fonctionnalité non décrite ici est **hors périmètre**.

Le système doit être :

* maîtrisé
* résilient
* exportable
* premium
* scalable

Ce cahier des charges constitue la **référence unique d’implémentation**.
