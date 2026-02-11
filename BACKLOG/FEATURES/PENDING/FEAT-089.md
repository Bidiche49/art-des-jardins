# FEAT-089: [Flutter] Phase 8A - Chantiers + Rentabilite

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** L
**Tags:** mobile, flutter, crud, chantiers, charts
**Date creation:** 2026-02-10

---

## Description

Chantiers CRUD offline-first (meme pattern que Clients) + page de rentabilite avec graphiques fl_chart.

## User Story

**En tant que** patron/employe
**Je veux** gerer les chantiers et voir leur rentabilite
**Afin de** suivre l'activite et optimiser la marge

## Criteres d'acceptation

- [ ] CRUD chantiers offline-first (meme pattern que Clients)
- [ ] Multi-select TypePrestation (checkboxes)
- [ ] Status badge couleur (9 statuts)
- [ ] Changement statut inline dans le detail
- [ ] Page rentabilite avec graphiques fl_chart
- [ ] `flutter test` passe, `flutter analyze` propre

## Tests obligatoires

### Unit tests ChantiersRepository (~12 tests)
- [ ] getAll/getById online/offline (6 tests, meme pattern Clients)
- [ ] create/update/delete online/offline (6 tests)

### Unit tests ChantierForm (~10 tests)
- [ ] Selection client dans dropdown
- [ ] Multi-select TypePrestation (checkboxes Wrap)
- [ ] Validation adresse required
- [ ] Validation dates debut/fin coherentes (fin >= debut)
- [ ] Changement de statut inline
- [ ] 9 statuts disponibles avec couleurs correctes
- [ ] Statut badge affiche la bonne couleur
- [ ] Mode creation : champs vides + statut 'lead'
- [ ] Mode edition : pre-remplissage
- [ ] Formulaire valide -> submit OK

### Unit tests RentabiliteCalculation (~10 tests)
- [ ] CA = somme devis acceptes
- [ ] Couts = somme interventions (heures x taux)
- [ ] Marge = CA - Couts
- [ ] Taux marge = Marge / CA * 100
- [ ] Chantier sans devis -> CA = 0
- [ ] Chantier sans intervention -> Couts = 0
- [ ] Chantier vide -> marge 0%
- [ ] Donnees correctes pour graphique camembert
- [ ] Donnees correctes pour graphique barres
- [ ] Arrondi a 2 decimales

### Widget tests (~10 tests)
- [ ] ChantiersListPage : affiche cards avec statut badge
- [ ] ChantierDetailPage : affiche toutes les infos
- [ ] ChantierDetailPage : bouton rentabilite visible
- [ ] RentabilitePage : affiche graphiques
- [ ] RentabilitePage : affiche marge en %
- [ ] Filtre par statut fonctionne
- [ ] Recherche par nom/adresse
- [ ] Liste vide -> empty state
- [ ] Navigation chantier -> detail -> rentabilite
- [ ] Retour navigation fonctionne

**Total attendu : ~42 tests**

## Fichiers concernes

- `lib/features/chantiers/` (meme structure que clients)
