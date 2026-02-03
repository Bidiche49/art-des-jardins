# FEAT-071: Calcul rentabilite chantier

**Type:** Feature
**Statut:** Split
**Priorite:** Haute
**Complexite:** M
**Tags:** api, data, ux
**Date creation:** 2026-02-03
**Date split:** 2026-02-03
**Phase:** 15

---

## Description

Calculer et afficher la rentabilite de chaque chantier en comparant le devis (prevu) aux couts reels (heures, materiaux).

## User Story

**En tant que** patron
**Je veux** voir la rentabilite de chaque chantier
**Afin de** identifier les chantiers rentables et ajuster mes prix

## Split en sous-tickets

Ce ticket a ete decoupe en 5 sous-tickets pour une execution incrementale:

| Sous-ticket | Description | Complexite | Dependances |
|-------------|-------------|------------|-------------|
| **FEAT-071-A** | Modeles Prisma (TimeEntry, MaterialUsage, hourlyRate) | S | - |
| **FEAT-071-B** | API CRUD TimeEntry (saisie heures) | S | A |
| **FEAT-071-C** | API CRUD MaterialUsage (materiaux utilises) | S | A |
| **FEAT-071-D** | Service calcul rentabilite + alertes | S | A, B, C |
| **FEAT-071-E** | Interface PWA (RentabiliteCard, page detail) | S | D |

### Ordre d'execution recommande

```
FEAT-071-A (modeles BDD)
     |
     +---> FEAT-071-B (API heures)
     |
     +---> FEAT-071-C (API materiaux)
     |
     v
FEAT-071-D (service calcul)
     |
     v
FEAT-071-E (interface PWA)
```

## Criteres d'acceptation (originaux)

- [ ] Saisie heures par employe par intervention -> FEAT-071-B
- [ ] Taux horaire par employe (cout entreprise, pas salaire) -> FEAT-071-A
- [ ] Saisie materiaux utilises (optionnel) -> FEAT-071-C
- [ ] Calcul automatique cout reel -> FEAT-071-D
- [ ] Affichage marge brute et % -> FEAT-071-E
- [ ] Alerte si marge < seuil configurable -> FEAT-071-D
- [ ] Rapport rentabilite par periode -> FEAT-071-D
- [ ] Comparaison devis similaires -> (hors scope initial, ticket futur)

---

*Ce ticket parent a ete split le 2026-02-03. Voir les sous-tickets FEAT-071-A a FEAT-071-E dans READY/.*
