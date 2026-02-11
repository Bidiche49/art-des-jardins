# FEAT-091: [Flutter] Phase 9A - Devis Builder

**Type:** Feature
**Statut:** A faire
**Priorite:** Critique
**Complexite:** L
**Tags:** mobile, flutter, devis, calcul, templates
**Date creation:** 2026-02-10

---

## Description

Builder de devis : selection chantier, ajout/suppression lignes, calculs temps reel (HT, TVA, TTC), import templates, sauvegarde brouillon, envoi, PDF.

## User Story

**En tant que** patron
**Je veux** creer et modifier des devis depuis l'app mobile
**Afin de** envoyer rapidement des propositions aux clients

## Criteres d'acceptation

- [ ] Selection chantier -> client affiche automatiquement
- [ ] Ajout/suppression lignes de devis
- [ ] Calcul temps reel : montantHT, TVA, TTC par ligne et totaux
- [ ] Import depuis PrestationTemplate
- [ ] Sauvegarde brouillon + envoi
- [ ] Transformation dateValidite -> validiteJours pour API
- [ ] Telechargement PDF + visualisation
- [ ] `flutter test` passe, `flutter analyze` propre

## Tests obligatoires

### Unit tests DevisBuilderNotifier (~16 tests)
- [ ] Etat initial : devis vide, 0 lignes
- [ ] addLigne -> nouvelle ligne ajoutee
- [ ] removeLigne(index) -> ligne supprimee
- [ ] updateLigne -> valeurs mises a jour
- [ ] Calcul montantHT = quantite * prixUnitaireHT
- [ ] Calcul montantTTC = montantHT * (1 + tva/100)
- [ ] Total HT = somme des montantHT de toutes les lignes
- [ ] Total TVA = somme des (montantTTC - montantHT)
- [ ] Total TTC = Total HT + Total TVA
- [ ] Ajout 5 lignes -> totaux corrects
- [ ] Modification quantite -> totaux recalcules
- [ ] Modification prix -> totaux recalcules
- [ ] Suppression ligne -> totaux recalcules
- [ ] TVA 0% -> TTC = HT
- [ ] TVA 20% -> montants corrects
- [ ] TVA 10% -> montants corrects

### Unit tests calculs precision (~8 tests)
- [ ] Pas d'erreur d'arrondi float (1.1 + 2.2 != 3.3000000004)
- [ ] Arrondi a 2 decimales pour affichage
- [ ] Quantite decimale (2.5 m2) -> calcul correct
- [ ] Prix 0.01 EUR -> calcul correct
- [ ] Tres gros montant (100 000 EUR) -> pas d'overflow
- [ ] Ligne avec quantite 0 -> montant 0
- [ ] Ligne avec prix 0 -> montant 0
- [ ] Devis vide (0 lignes) -> totaux = 0

### Unit tests templates import (~6 tests)
- [ ] Import template -> ajoute une ligne pre-remplie
- [ ] Import multiple templates -> toutes les lignes ajoutees
- [ ] Template avec TVA -> TVA appliquee
- [ ] Template : description, unite, prix corrects
- [ ] Ligne importee modifiable apres import
- [ ] Template non trouve -> erreur

### Unit tests sauvegarde/envoi (~8 tests)
- [ ] Sauvegarde brouillon online -> POST API
- [ ] Sauvegarde brouillon offline -> addToQueue
- [ ] Envoi devis -> PATCH statut 'envoye'
- [ ] Envoi sans lignes -> erreur
- [ ] Transformation dateValidite -> validiteJours
- [ ] Mode edition : charge devis existant
- [ ] Mode edition : modifications sauvegardees
- [ ] PDF : download URL correcte

### Widget tests DevisBuilderPage (~10 tests)
- [ ] Dropdown chantier affiche la liste
- [ ] Selection chantier -> client affiche
- [ ] Bouton "Ajouter ligne" fonctionne
- [ ] Bouton "Supprimer ligne" fonctionne
- [ ] Champs ligne : description, qte, unite, prix, tva
- [ ] Totaux affiches en bas (HT, TVA, TTC)
- [ ] Bouton "Sauvegarder brouillon"
- [ ] Bouton "Envoyer"
- [ ] Import template via bouton
- [ ] Bouton PDF visible si devis sauvegarde

**Total attendu : ~48 tests**

## Fichiers concernes

- `lib/features/devis/`
