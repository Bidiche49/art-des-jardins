# ROADMAP Phase 5 - Evolutions Post-MVP

> Plan d'execution pour les fonctionnalites avancees apres validation du MVP en production.

---

## PREREQUIS

Avant de commencer la Phase 5 :
- [ ] MVP deploye en production
- [ ] Feedback utilisateur collecte (minimum 2 semaines d'usage)
- [ ] Bugs critiques corriges
- [ ] Backups fonctionnels et testes

---

## VUE D'ENSEMBLE

| Sous-phase | Theme | Priorite | Complexite |
|------------|-------|----------|------------|
| 5.1 | Signature electronique | Critique | M |
| 5.2 | Notifications & Rappels | Haute | M |
| 5.3 | Calendrier equipe | Haute | L |
| 5.4 | Portail client | Moyenne | L |
| 5.5 | Reporting & Analytics | Moyenne | M |
| 5.6 | Paiement en ligne | Basse | M |

**Duree estimee totale : 4-6 semaines**

---

## PHASE 5.1 : SIGNATURE ELECTRONIQUE (Critique)

> Permet aux clients de signer les devis en ligne. Gain de temps enorme.

### P5.1-001 : Backend signature
- [ ] Installer `@signaturit/sdk` ou solution open-source
- [ ] Endpoint `POST /devis/:id/send-for-signature`
- [ ] Generer lien unique de signature (token JWT 7 jours)
- [ ] Endpoint `GET /signature/:token` - Page publique de signature
- [ ] Endpoint `POST /signature/:token/sign` - Enregistrer signature
- [ ] Stocker signature (image base64 + timestamp + IP + user-agent)
- [ ] Mettre a jour statut devis automatiquement
- **Validation** : Devis signe via lien unique

### P5.1-002 : Page signature client
- [ ] Page publique `/signer/:token` (Next.js vitrine ou route API)
- [ ] Affichage devis en lecture seule
- [ ] Canvas signature tactile (mobile-friendly)
- [ ] Checkbox acceptation CGV
- [ ] Confirmation + telechargement PDF signe
- **Validation** : Client peut signer sur mobile

### P5.1-003 : PDF avec signature
- [ ] Modifier template PDF devis
- [ ] Inclure image signature
- [ ] Inclure date/heure signature
- [ ] Inclure mention "Signe electroniquement"
- [ ] Horodatage certifie (optionnel)
- **Validation** : PDF signe telechargeble

### P5.1-004 : Notifications signature
- [ ] Email au client avec lien de signature
- [ ] Email de confirmation apres signature
- [ ] Email au patron quand devis signe
- [ ] Relance automatique J+3 si non signe (optionnel)
- **Validation** : Emails envoyes correctement

**Complexite : M (3-5 jours)**

---

## PHASE 5.2 : NOTIFICATIONS & RAPPELS (Haute)

> Push notifications PWA + rappels automatiques.

### P5.2-001 : Service Worker Push
- [ ] Configurer Web Push API
- [ ] Generer VAPID keys
- [ ] Endpoint `POST /notifications/subscribe` (stocker subscription)
- [ ] Endpoint `POST /notifications/send` (admin)
- [ ] Service `NotificationsService` avec web-push
- **Validation** : Push notification recue sur mobile

### P5.2-002 : Abonnement PWA
- [ ] Demander permission notification au login
- [ ] Stocker subscription par utilisateur
- [ ] Gerer desabonnement
- [ ] UI toggle notifications dans profil
- **Validation** : User peut activer/desactiver les notifs

### P5.2-003 : Rappels interventions
- [ ] Job cron quotidien (8h)
- [ ] Notifier interventions du jour
- [ ] Notifier interventions du lendemain (veille)
- [ ] Inclure details : client, adresse, heure
- **Validation** : Rappels recus chaque matin

### P5.2-004 : Alertes metier
- [ ] Notification nouveau devis signe
- [ ] Notification facture impayee > 30 jours
- [ ] Notification nouveau message client (si portail)
- [ ] Configuration alertes par utilisateur
- **Validation** : Alertes recues en temps reel

**Complexite : M (3-4 jours)**

---

## PHASE 5.3 : CALENDRIER EQUIPE (Haute)

> Vue calendrier des interventions, drag & drop, planning equipe.

### P5.3-001 : API Calendrier
- [ ] Endpoint `GET /interventions/calendar?start=&end=`
- [ ] Format compatible FullCalendar
- [ ] Filtres : par employe, par statut, par client
- [ ] Include : client, chantier, adresse
- **Validation** : API retourne events format iCal-like

### P5.3-002 : Composant Calendrier
- [ ] Installer `@fullcalendar/react`
- [ ] Vue mois / semaine / jour
- [ ] Couleurs par statut (planifie, en cours, termine)
- [ ] Couleurs par employe
- [ ] Click sur event = modal details
- **Validation** : Calendrier affiche interventions

### P5.3-003 : Drag & Drop
- [ ] Deplacer intervention = modifier date
- [ ] Redimensionner = modifier duree
- [ ] Confirmation avant modification
- [ ] Sync API en temps reel
- **Validation** : Modification drag & drop fonctionne

### P5.3-004 : Planning employes
- [ ] Vue "ressources" (lignes par employe)
- [ ] Assigner intervention a un employe
- [ ] Voir charge par employe
- [ ] Detecter conflits (2 interventions meme heure)
- **Validation** : Planning multi-employes fonctionnel

### P5.3-005 : Synchronisation externe (optionnel)
- [ ] Export iCal (.ics)
- [ ] Sync Google Calendar (OAuth)
- [ ] Sync Outlook (OAuth)
- **Validation** : Interventions visibles dans Google Calendar

**Complexite : L (5-7 jours)**

---

## PHASE 5.4 : PORTAIL CLIENT (Moyenne)

> Espace client pour consulter devis, factures, historique.

### P5.4-001 : Authentification client
- [ ] Nouveau role `CLIENT` dans RBAC
- [ ] Endpoint `POST /auth/client/magic-link`
- [ ] Envoi email avec lien connexion (token 24h)
- [ ] Pas de mot de passe (magic link only)
- [ ] Session client separee (JWT different)
- **Validation** : Client peut se connecter via email

### P5.4-002 : API Client-facing
- [ ] `GET /portal/me` - Infos client
- [ ] `GET /portal/devis` - Ses devis uniquement
- [ ] `GET /portal/factures` - Ses factures uniquement
- [ ] `GET /portal/chantiers` - Ses chantiers uniquement
- [ ] Middleware : filtrer par client connecte
- **Validation** : Client ne voit QUE ses donnees

### P5.4-003 : Interface portail
- [ ] Nouvelle app ou section dans vitrine
- [ ] Dashboard : devis en attente, factures impayees
- [ ] Liste devis avec statuts
- [ ] Liste factures avec statuts
- [ ] Historique chantiers avec photos
- [ ] Telechargement PDF
- **Validation** : Portail fonctionnel et securise

### P5.4-004 : Messagerie simple
- [ ] Table `messages` (client <-> entreprise)
- [ ] Endpoint `POST /portal/messages`
- [ ] Notification email nouveau message
- [ ] Vue conversation dans PWA (cote entreprise)
- **Validation** : Echange messages bidirectionnel

**Complexite : L (5-7 jours)**

---

## PHASE 5.5 : REPORTING & ANALYTICS (Moyenne)

> Tableaux de bord, graphiques, KPIs metier.

### P5.5-001 : KPIs Dashboard
- [ ] CA mensuel / annuel
- [ ] Taux de conversion devis
- [ ] Delai moyen paiement factures
- [ ] Nombre interventions par mois
- [ ] Top 10 clients par CA
- **Validation** : KPIs affiches sur dashboard

### P5.5-002 : Graphiques
- [ ] Installer `recharts` ou `chart.js`
- [ ] Graphique CA evolution (12 mois)
- [ ] Graphique repartition par type de service
- [ ] Graphique statuts devis (pie chart)
- [ ] Graphique statuts factures (pie chart)
- **Validation** : Graphiques interactifs

### P5.5-003 : Rapports PDF
- [ ] Rapport mensuel automatique
- [ ] Rapport annuel
- [ ] Export PDF avec graphiques
- [ ] Envoi email automatique (1er du mois)
- **Validation** : Rapport PDF genere et envoye

### P5.5-004 : Filtres avances
- [ ] Filtre par periode
- [ ] Filtre par client
- [ ] Filtre par type de service
- [ ] Comparaison periodes (N vs N-1)
- **Validation** : Filtres fonctionnels

**Complexite : M (3-5 jours)**

---

## PHASE 5.6 : PAIEMENT EN LIGNE (Basse)

> Permettre aux clients de payer leurs factures en ligne.

### P5.6-001 : Integration Stripe
- [ ] Creer compte Stripe
- [ ] Installer `@stripe/stripe-js` + `stripe`
- [ ] Endpoint `POST /factures/:id/payment-link`
- [ ] Generer Checkout Session
- [ ] Webhook `payment_intent.succeeded`
- [ ] Marquer facture payee automatiquement
- **Validation** : Paiement CB fonctionne

### P5.6-002 : Lien paiement
- [ ] Bouton "Payer en ligne" sur facture PDF
- [ ] Page paiement securisee
- [ ] Confirmation paiement
- [ ] Email recu de paiement
- **Validation** : Client peut payer depuis email

### P5.6-003 : Portail - Paiement
- [ ] Bouton payer dans portail client
- [ ] Historique paiements
- [ ] Telechargement recus
- **Validation** : Paiement depuis portail

**Complexite : M (3-4 jours)**

---

## HORS SCOPE PHASE 5

Ces elements restent pour plus tard :

- Multi-entreprise / SaaS
- GraphQL (REST suffit)
- App native iOS/Android (PWA suffit)
- Geolocalisation temps reel
- Comptabilite avancee (export FEC)

---

## ORDRE D'EXECUTION RECOMMANDE

```
Semaine 1-2:
└── Phase 5.1 (Signature electronique) ← PRIORITE ABSOLUE

Semaine 3:
└── Phase 5.2 (Notifications)

Semaine 4-5:
└── Phase 5.3 (Calendrier equipe)

Semaine 6+:
├── Phase 5.4 (Portail client)
├── Phase 5.5 (Reporting)
└── Phase 5.6 (Paiement) - si besoin
```

---

## VALIDATION PHASE 5

Avant de considerer la Phase 5 complete :

- [ ] Signature electronique operationnelle
- [ ] Notifications push fonctionnelles
- [ ] Calendrier equipe utilisable
- [ ] Portail client accessible
- [ ] Dashboard avec KPIs
- [ ] Documentation mise a jour
- [ ] Tests de non-regression passes
