# BACKLOG - art_et_jardin

> Source de verite pour le suivi des tickets (bugs, features, improvements).

---

## Prochains IDs

| Type | Prochain ID |
|------|-------------|
| BUG | BUG-001 |
| FEAT | FEAT-046 |
| IMP | IMP-001 |

---

## Statistiques

| Type | Pending | Ready | Done | Total |
|------|---------|-------|------|-------|
| Bugs | 0 | 0 | 0 | 0 |
| Features | 0 | 0 | 45 | 45 |
| Improvements | 0 | 0 | 0 | 0 |
| **Total** | **0** | **0** | **45** | **45** |

---

## Roadmap MVP

| Ordre | Ticket | Description | Statut |
|-------|--------|-------------|--------|
| 1 | FEAT-001 | Setup monorepo | DONE |
| 2 | FEAT-002 | Backend NestJS | DONE |
| 3 | FEAT-003 | Site vitrine Next.js | DONE |
| 4 | FEAT-004 | PWA React | DONE |
| 5 | FEAT-005 | Entites metier | DONE |
| 6 | FEAT-006 | RBAC & Audit | DONE |
| 7 | FEAT-007 | Exports | DONE |

---

## Roadmap Tests (Phase 2)

| Ordre | Ticket | Description | Statut |
|-------|--------|-------------|--------|
| 1 | FEAT-008 | Configuration Jest + setup tests | DONE |
| 2 | FEAT-009 | Tests unitaires AuthService | DONE |
| 3 | FEAT-010 | Tests unitaires ClientsService | DONE |
| 4 | FEAT-011 | Tests unitaires ChantiersService | DONE |
| 5 | FEAT-012 | Tests unitaires DevisService | DONE |
| 6 | FEAT-013 | Tests unitaires FacturesService | DONE |
| 7 | FEAT-014 | Tests unitaires InterventionsService | DONE |
| 8 | FEAT-015 | Tests unitaires AuditService | DONE |
| 9 | FEAT-016 | Tests unitaires ExportService | DONE |
| 10 | FEAT-017 | Tests e2e Auth flow | DONE |
| 11 | FEAT-018 | Tests e2e CRUD Clients | DONE |
| 12 | FEAT-019 | Tests e2e CRUD Chantiers | DONE |
| 13 | FEAT-020 | Tests e2e Devis workflow | DONE |
| 14 | FEAT-021 | Tests e2e Factures workflow | DONE |
| 15 | FEAT-022 | Tests e2e Interventions | DONE |
| 16 | FEAT-023 | Tests e2e Audit logging | DONE |
| 17 | FEAT-024 | Tests e2e Export | DONE |
| 18 | FEAT-025 | Tests integration flow complet | DONE |

---

## Roadmap Phase 5.1 - Signature electronique (COMPLETE)

| Ordre | Ticket | Description | Statut |
|-------|--------|-------------|--------|
| 1 | FEAT-026 | Backend signature electronique | DONE |
| 2 | FEAT-027 | Page signature client | DONE |
| 3 | FEAT-028 | PDF avec signature | DONE |
| 4 | FEAT-029 | Emails signature | DONE |

> Phase 5.1 terminee le 2026-01-29.

---

## Roadmap Phase 5.2 - Notifications Push (COMPLETE)

| Ordre | Ticket | Description | Statut |
|-------|--------|-------------|--------|
| 1 | FEAT-030 | Backend push notifications | DONE |
| 2 | FEAT-031 | Abonnement push PWA | DONE |
| 3 | FEAT-032 | Rappels interventions | DONE |

> Phase 5.2 terminee le 2026-01-29.

---

## Roadmap Phase 5.3 - Calendrier equipe (COMPLETE)

| Ordre | Ticket | Description | Statut |
|-------|--------|-------------|--------|
| 1 | FEAT-033 | Vue calendrier interventions | DONE |
| 2 | FEAT-034 | Drag & drop planification | DONE |
| 3 | FEAT-035 | Gestion disponibilites employes | DONE |
| 4 | FEAT-036 | Export calendrier iCal | DONE |

> Phase 5.3 terminee le 2026-01-29.

---

## Roadmap Phase 6 - Portail Client

| Ordre | Ticket | Description | Statut |
|-------|--------|-------------|--------|
| 1 | FEAT-037 | Authentification client portail | DONE |
| 2 | FEAT-038 | Dashboard client personnel | PENDING |
| 3 | FEAT-039 | Consultation devis et factures | PENDING |
| 4 | FEAT-040 | Suivi chantiers temps reel | PENDING |
| 5 | FEAT-041 | Messagerie client-entreprise | PENDING |

---

## Roadmap Phase 7 - Reporting/Analytics

| Ordre | Ticket | Description | Statut |
|-------|--------|-------------|--------|
| 1 | FEAT-042 | Dashboard analytics KPI | PENDING |
| 2 | FEAT-043 | Rapports financiers | PENDING |
| 3 | FEAT-044 | Rapports d'activite | PENDING |
| 4 | FEAT-045 | Exports statistiques avances | PENDING |

---

## Features

### Pending (8)

| ID | Titre | Priorite | Complexite | Tags |
|----|-------|----------|------------|------|
| FEAT-038 | Dashboard client personnel | Haute | M | ui, api, portail-client |
| FEAT-039 | Consultation devis et factures | Haute | M | ui, api, portail-client, pdf |
| FEAT-040 | Suivi chantiers temps reel | Moyenne | M | ui, api, portail-client, realtime |
| FEAT-041 | Messagerie client-entreprise | Moyenne | L | ui, api, portail-client, messaging |
| FEAT-042 | Dashboard analytics KPI | Haute | L | ui, api, analytics, dashboard |
| FEAT-043 | Rapports financiers | Haute | M | api, analytics, finance, export |
| FEAT-044 | Rapports d'activite | Moyenne | M | api, analytics, activity |
| FEAT-045 | Exports statistiques avances | Moyenne | S | api, analytics, export |

### Ready (0)

| ID | Titre | Priorite | Complexite | Tags |
|----|-------|----------|------------|------|

### Done (37)

| ID | Titre | Priorite | Date resolution |
|----|-------|----------|-----------------|
| FEAT-001 | Initialiser le projet monorepo | Critique | 2025-01-25 |
| FEAT-002 | Backend NestJS - Setup initial | Critique | 2025-01-25 |
| FEAT-003 | Site vitrine Next.js | Haute | 2025-01-25 |
| FEAT-004 | PWA React - Setup initial | Haute | 2025-01-25 |
| FEAT-005 | Entites metier - Tous modules | Critique | 2026-01-25 |
| FEAT-006 | RBAC et Audit Logs | Haute | 2026-01-25 |
| FEAT-007 | Exports et reversibilite | Critique | 2026-01-25 |
| FEAT-008 | Configuration Jest et setup tests API | Critique | 2026-01-29 |
| FEAT-009 | Tests unitaires AuthService | Critique | 2026-01-29 |
| FEAT-010 | Tests unitaires ClientsService | Haute | 2026-01-29 |
| FEAT-011 | Tests unitaires ChantiersService | Haute | 2026-01-29 |
| FEAT-012 | Tests unitaires DevisService | Critique | 2026-01-29 |
| FEAT-013 | Tests unitaires FacturesService | Critique | 2026-01-29 |
| FEAT-014 | Tests unitaires InterventionsService | Haute | 2026-01-29 |
| FEAT-015 | Tests unitaires AuditService | Haute | 2026-01-29 |
| FEAT-016 | Tests unitaires ExportService | Haute | 2026-01-29 |
| FEAT-017 | Tests e2e Auth flow | Critique | 2026-01-29 |
| FEAT-018 | Tests e2e CRUD Clients | Haute | 2026-01-29 |
| FEAT-019 | Tests e2e CRUD Chantiers | Haute | 2026-01-29 |
| FEAT-020 | Tests e2e Devis workflow | Critique | 2026-01-29 |
| FEAT-021 | Tests e2e Factures workflow | Critique | 2026-01-29 |
| FEAT-022 | Tests e2e Interventions | Haute | 2026-01-29 |
| FEAT-023 | Tests e2e Audit logging | Haute | 2026-01-29 |
| FEAT-024 | Tests e2e Export | Haute | 2026-01-29 |
| FEAT-025 | Tests integration flow complet | Critique | 2026-01-29 |
| FEAT-026 | Backend signature electronique | Critique | 2026-01-29 |
| FEAT-027 | Page signature client | Critique | 2026-01-29 |
| FEAT-028 | PDF devis avec signature | Haute | 2026-01-29 |
| FEAT-029 | Emails signature devis | Haute | 2026-01-29 |
| FEAT-030 | Backend push notifications | Haute | 2026-01-29 |
| FEAT-031 | Abonnement push PWA | Haute | 2026-01-29 |
| FEAT-032 | Rappels interventions | Haute | 2026-01-29 |
| FEAT-033 | Vue calendrier interventions | Haute | 2026-01-29 |
| FEAT-034 | Drag & drop planification | Haute | 2026-01-29 |
| FEAT-035 | Gestion disponibilites employes | Moyenne | 2026-01-29 |
| FEAT-036 | Export calendrier iCal | Basse | 2026-01-29 |
| FEAT-037 | Authentification client portail | Haute | 2026-01-30 |

---

## Bugs

### Pending (0)

| ID | Titre | Priorite | Complexite | Tags |
|----|-------|----------|------------|------|

### Ready (0)

| ID | Titre | Priorite | Complexite | Tags |
|----|-------|----------|------------|------|

### Done (0)

| ID | Titre | Priorite | Date resolution |
|----|-------|----------|-----------------|

---

## Improvements

### Pending (0)

| ID | Titre | Priorite | Complexite | Tags |
|----|-------|----------|------------|------|

### Ready (0)

| ID | Titre | Priorite | Complexite | Tags |
|----|-------|----------|------------|------|

### Done (0)

| ID | Titre | Priorite | Date resolution |
|----|-------|----------|-----------------|

---

## Conventions

### Priorites

| Priorite | Quand |
|----------|-------|
| Critique | Bloquant, prod down, securite |
| Haute | Important, impact utilisateur |
| Moyenne | Normal, planifiable |
| Basse | Nice-to-have, cosmetique |

### Complexite

| Complexite | Estimation |
|------------|------------|
| XS | < 1h, trivial |
| S | 1-4h, simple |
| M | 1-2j, modere |
| L | 3-5j, complexe |
| XL | > 1 semaine, majeur |

### Workflow des tickets

```
PENDING → (prepare) → READY → (run) → DONE
                ↘ NON_AUTOMATABLE (si non automatisable)
```
