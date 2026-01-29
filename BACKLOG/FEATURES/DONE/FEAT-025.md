# FEAT-025: Tests integration flow complet

**Type:** Feature
**Statut:** A faire
**Priorite:** Critique
**Complexite:** XL
**Tags:** tests, integration, e2e, flow
**Date creation:** 2026-01-25

---

## Description

Tests d'intégration de bout en bout simulant un flow métier complet : de la création client jusqu'au paiement de la facture.

**CRITIQUE:** Les tests unitaires ne suffisent PAS. Ce test vérifie que l'assemblage complet fonctionne.

## Criteres d'acceptation

### Flow 1: Nouveau client → Chantier → Devis → Facture → Paiement
- [ ] 1. Login patron → obtenir token
- [ ] 2. Créer client professionnel
- [ ] 3. Créer chantier pour ce client
- [ ] 4. Créer devis avec 3 lignes
- [ ] 5. Vérifier calculs totaux corrects
- [ ] 6. Passer devis en "envoyé"
- [ ] 7. Passer devis en "accepté"
- [ ] 8. Créer facture depuis devis
- [ ] 9. Vérifier lignes copiées
- [ ] 10. Marquer facture payée
- [ ] 11. Vérifier statut final

### Flow 2: Intervention terrain
- [ ] 1. Login employé → obtenir token
- [ ] 2. Démarrer intervention sur chantier
- [ ] 3. Vérifier getEnCours retourne l'intervention
- [ ] 4. Attendre X secondes
- [ ] 5. Arrêter intervention
- [ ] 6. Vérifier durée calculée
- [ ] 7. Login patron → valider intervention

### Flow 3: Audit trail
- [ ] 1. Effectuer le flow 1
- [ ] 2. Consulter les logs d'audit
- [ ] 3. Vérifier que chaque action est tracée
- [ ] 4. Vérifier que les passwords sont sanitizés

### Flow 4: Export reversibilité
- [ ] 1. Après flows 1-3, exporter ZIP complet
- [ ] 2. Vérifier que toutes les données sont présentes
- [ ] 3. Vérifier intégrité des relations

### Edge cases
- [ ] Tentative suppression client avec chantiers → erreur ou cascade
- [ ] Tentative modification devis accepté → erreur
- [ ] Tentative suppression facture payée → erreur
- [ ] 2 interventions en cours même employé → erreur
- [ ] Employé stoppe intervention d'un autre → erreur

## Fichiers concernes

- `apps/api/test/integration/full-flow.e2e-spec.ts`

## Analyse / Approche

1. Créer fichier de test dédié à l'intégration
2. Exécuter flows séquentiellement
3. Utiliser données créées dans étapes précédentes
4. Tester les edge cases en fin de suite

## Tests de validation

- [ ] Flow complet exécutable sans erreur
- [ ] Données cohérentes à chaque étape
- [ ] Edge cases correctement bloqués
