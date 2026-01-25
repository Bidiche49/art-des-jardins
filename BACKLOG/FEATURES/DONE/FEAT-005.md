# FEAT-005: Entites metier - Client, Chantier, Devis, Facture

**Type:** Feature
**Statut:** SPLIT
**Priorite:** Critique
**Complexite:** L
**Tags:** api, data, models
**Date creation:** 2025-01-25
**Date cloture:** 2025-01-25

---

## TICKET SPLITTE

Ce ticket a ete decoupe en 4 sous-tickets plus atomiques:

| Sous-ticket | Description | Complexite |
|-------------|-------------|------------|
| [FEAT-005-A](../READY/FEAT-005-A.md) | Module Chantiers - CRUD complet | S |
| [FEAT-005-B](../READY/FEAT-005-B.md) | Module Devis - CRUD avec lignes | S |
| [FEAT-005-C](../READY/FEAT-005-C.md) | Module Factures - CRUD lie aux devis | S |
| [FEAT-005-D](../READY/FEAT-005-D.md) | Module Interventions - CRUD avec pointage | S |

**Raison du split:** Ticket trop large (complexite L) pour une seule session.
Chaque sous-ticket est maintenant executable en une session Claude.

---

## Description originale
Implementer les entites principales du CRM avec CRUD complet.
Note: Client est deja fait. Reste: Chantier, Devis, Facture, Intervention.

## User Story
**En tant que** associe
**Je veux** gerer mes clients et chantiers
**Afin de** suivre mon activite commerciale

## Criteres d'acceptation (originaux)
- [x] Entity Client (particulier/pro/syndic) - DEJA FAIT
- [ ] Entity Chantier (lie a client) -> FEAT-005-A
- [ ] Entity Devis (lignes, montants, statut) -> FEAT-005-B
- [ ] Entity Facture (lie a devis) -> FEAT-005-C
- [ ] Entity Intervention (pointage) -> FEAT-005-D
- [ ] Relations correctes entre entites
- [ ] Endpoints CRUD pour chaque entite
- [ ] DTOs avec validation
- [ ] Tests unitaires et integration
