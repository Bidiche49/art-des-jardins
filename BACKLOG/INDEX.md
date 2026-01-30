# BACKLOG - art_et_jardin

> Source de verite pour le suivi des tickets (bugs, features, improvements).

---

## Prochains IDs

| Type | Prochain ID |
|------|-------------|
| BUG | BUG-001 |
| FEAT | FEAT-056 |
| IMP | IMP-001 |

---

## Statistiques

| Type | Pending | Ready | Done | Total |
|------|---------|-------|------|-------|
| Bugs | 0 | 0 | 0 | 0 |
| Features | 5 | 0 | 50 | 55 |
| Improvements | 0 | 0 | 0 | 0 |
| **Total** | **5** | **0** | **50** | **55** |

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

## Roadmap Phase 6 - Portail Client (COMPLETE)

| Ordre | Ticket | Description | Statut |
|-------|--------|-------------|--------|
| 1 | FEAT-037 | Authentification client portail | DONE |
| 2 | FEAT-038 | Dashboard client personnel | DONE |
| 3 | FEAT-039 | Consultation devis et factures | DONE |
| 4 | FEAT-040 | Suivi chantiers temps reel | DONE |
| 5 | FEAT-041 | Messagerie client-entreprise | DONE |

> Phase 6 terminee le 2026-01-30.

---

## Roadmap Phase 7 - Reporting/Analytics (COMPLETE)

| Ordre | Ticket | Description | Statut |
|-------|--------|-------------|--------|
| 1 | FEAT-042 | Dashboard analytics KPI | DONE |
| 2 | FEAT-043 | Rapports financiers | DONE |
| 3 | FEAT-044 | Rapports d'activite | DONE |
| 4 | FEAT-045 | Exports statistiques avances | DONE |

> Phase 7 terminee le 2026-01-30.

---

## Roadmap Phase 8 - Offline-first PWA (COMPLETE)

| Ordre | Ticket | Description | Statut |
|-------|--------|-------------|--------|
| 1 | FEAT-046 | Service Worker et cache offline | DONE |
| 2 | FEAT-047 | IndexedDB pour stockage local | DONE |
| 3 | FEAT-048 | Synchronisation des actions offline | DONE |
| 4 | FEAT-049 | Tests e2e Portail Client et Analytics | DONE |
| 5 | FEAT-050 | Mode sombre PWA | DONE |

> Phase 8 terminee le 2026-01-30.

---

## Roadmap Phase 9 - Zero Perte / Resilience (CRITIQUE)

> **REGLE BUSINESS:** Aucune perte de donnees acceptable. Documents toujours accessibles.

| Ordre | Ticket | Description | Statut |
|-------|--------|-------------|--------|
| 1 | FEAT-051 | Copie automatique email entreprise (BCC) | PENDING |
| 2 | FEAT-052 | Envoi automatique documents a chaque etape | PENDING |
| 3 | FEAT-053 | Backup automatique quotidien BDD | PENDING |
| 4 | FEAT-054 | Archivage automatique PDFs sur S3 | PENDING |
| 5 | FEAT-055 | Historique complet des emails envoyes | PENDING |

---

## Features

### Pending (5)

| ID | Titre | Priorite | Complexite | Tags |
|----|-------|----------|------------|------|
| FEAT-051 | Copie automatique email entreprise (BCC) | Critique | S | email, backup, resilience, zero-perte |
| FEAT-052 | Envoi automatique documents a chaque etape | Critique | M | email, workflow, auto-send, zero-perte |
| FEAT-053 | Backup automatique quotidien BDD | Critique | M | backup, resilience, database, zero-perte |
| FEAT-054 | Archivage automatique PDFs sur S3 | Critique | M | s3, archive, pdf, zero-perte |
| FEAT-055 | Historique complet des emails envoyes | Haute | M | email, audit, historique, zero-perte |

### Ready (0)

| ID | Titre | Priorite | Complexite | Tags |
|----|-------|----------|------------|------|

### Done (50)

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
| FEAT-038 | Dashboard client personnel | Haute | 2026-01-30 |
| FEAT-039 | Consultation devis et factures | Haute | 2026-01-30 |
| FEAT-040 | Suivi chantiers temps reel | Moyenne | 2026-01-30 |
| FEAT-041 | Messagerie client-entreprise | Moyenne | 2026-01-30 |
| FEAT-042 | Dashboard analytics KPI | Haute | 2026-01-30 |
| FEAT-043 | Rapports financiers | Haute | 2026-01-30 |
| FEAT-044 | Rapports d'activite | Moyenne | 2026-01-30 |
| FEAT-045 | Exports statistiques avances | Moyenne | 2026-01-30 |
| FEAT-046 | Service Worker et cache offline | Critique | 2026-01-30 |
| FEAT-047 | IndexedDB pour stockage local | Critique | 2026-01-30 |
| FEAT-048 | Synchronisation des actions offline | Haute | 2026-01-30 |
| FEAT-049 | Tests e2e Portail Client et Analytics | Haute | 2026-01-30 |
| FEAT-050 | Mode sombre PWA | Basse | 2026-01-30 |

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
