# FEAT-088: [Flutter] Phase 7 - Clients CRUD complet

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** L
**Tags:** mobile, flutter, crud, clients, offline
**Date creation:** 2026-02-10

---

## Description

Premier CRUD complet offline-first : Clients (liste, detail, formulaire). Pattern de reference pour tous les CRUD suivants.

## User Story

**En tant que** employe
**Je veux** consulter, creer et modifier des clients depuis l'app mobile
**Afin de** gerer les clients meme sans connexion

## Criteres d'acceptation

- [ ] Liste clients avec recherche et filtres par type
- [ ] Detail client avec infos completes
- [ ] Formulaire CRUD avec champs conditionnels selon type
- [ ] Repository offline-first (API + cache Drift, queue sync si offline)
- [ ] IDs temporaires "temp-{timestamp}" en mode offline
- [ ] Layout 2 colonnes sur tablette
- [ ] `flutter test` passe, `flutter analyze` propre

## Tests obligatoires

### Unit tests ClientsRepository offline-first (~16 tests)
- [ ] getAll online -> appel API + cache Drift
- [ ] getAll offline -> retourne cache Drift
- [ ] getById online -> appel API + cache
- [ ] getById offline -> retourne cache
- [ ] create online -> POST API + insert Drift
- [ ] create offline -> insert Drift + addToQueue avec id "temp-*"
- [ ] update online -> PUT API + update Drift
- [ ] update offline -> update Drift + addToQueue
- [ ] delete online -> DELETE API + delete Drift
- [ ] delete offline -> delete Drift + addToQueue
- [ ] getAll retourne donnees API quand online (pas le cache stale)
- [ ] Cache mis a jour apres getAll API
- [ ] ID temporaire remplace par ID serveur apres sync
- [ ] Erreur API 500 en online -> fallback sur cache
- [ ] Filtrage par type dans le cache
- [ ] Recherche par nom dans le cache

### Unit tests ClientsListNotifier (~8 tests)
- [ ] Chargement initial -> loading puis data
- [ ] Refresh -> recharge depuis API/cache
- [ ] Filtre par type applique correctement
- [ ] Recherche filtre par nom/email
- [ ] Liste vide -> state data avec liste vide
- [ ] Erreur -> state error
- [ ] Ajout client -> liste mise a jour
- [ ] Suppression client -> liste mise a jour

### Unit tests ClientDetailNotifier (~6 tests)
- [ ] Chargement par ID -> data avec le client
- [ ] Client inexistant -> erreur
- [ ] Update client -> data mise a jour
- [ ] Delete client -> navigation retour
- [ ] Refresh -> recharge le client
- [ ] Erreur reseau -> state error

### Widget tests ClientForm (~14 tests)
- [ ] Type selector : 3 chips (particulier/pro/syndic)
- [ ] Particulier selectionne -> champ prenom visible
- [ ] Particulier selectionne -> champ raisonSociale cache
- [ ] Pro selectionne -> champ raisonSociale visible
- [ ] Pro selectionne -> champ prenom cache
- [ ] Syndic selectionne -> champ raisonSociale visible
- [ ] Validation email invalide -> erreur affichee
- [ ] Validation email valide -> pas d'erreur
- [ ] Validation telephone FR invalide -> erreur
- [ ] Validation code postal != 5 chars -> erreur
- [ ] Champs required vides -> erreur
- [ ] Formulaire valide -> submit OK
- [ ] Mode edition : pre-remplissage des champs
- [ ] Mode creation : champs vides

### Widget tests ClientsListPage (~8 tests)
- [ ] Affiche la liste de clients (cards)
- [ ] Chaque card affiche nom, type, email
- [ ] Tap sur card -> navigation vers detail
- [ ] Bouton FAB "+" visible
- [ ] Tap FAB -> ouvre formulaire creation
- [ ] Champ recherche filtre la liste
- [ ] Chips filtre par type
- [ ] Liste vide -> AejEmptyState

**Total attendu : ~52 tests**

## Fichiers concernes

- `lib/features/clients/domain/clients_repository.dart`
- `lib/features/clients/data/clients_repository_impl.dart`
- `lib/features/clients/data/clients_remote_datasource.dart`
- `lib/features/clients/presentation/providers/`
- `lib/features/clients/presentation/pages/clients_list_page.dart`
- `lib/features/clients/presentation/pages/client_detail_page.dart`
- `lib/features/clients/presentation/widgets/client_card.dart`
- `lib/features/clients/presentation/widgets/client_form.dart`
- `lib/features/clients/presentation/widgets/client_filters.dart`
