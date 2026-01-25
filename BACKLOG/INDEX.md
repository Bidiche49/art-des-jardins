# BACKLOG - art_et_jardin

> Source de verite pour le suivi des tickets (bugs, features, improvements).

---

## Prochains IDs

| Type | Prochain ID |
|------|-------------|
| BUG | BUG-001 |
| FEAT | FEAT-008 |
| IMP | IMP-001 |

---

## Statistiques

| Type | Pending | Ready | Done | Total |
|------|---------|-------|------|-------|
| Bugs | 0 | 0 | 0 | 0 |
| Features | 3 | 0 | 4 | 7 |
| Improvements | 0 | 0 | 0 | 0 |
| **Total** | **3** | **0** | **4** | **7** |

---

## Roadmap MVP

| Ordre | Ticket | Description | Statut |
|-------|--------|-------------|--------|
| 1 | FEAT-001 | Setup monorepo | DONE |
| 2 | FEAT-002 | Backend NestJS | DONE |
| 3 | FEAT-003 | Site vitrine Next.js | DONE |
| 4 | FEAT-004 | PWA React | DONE |
| 5 | FEAT-005 | Entites metier | PENDING |
| 6 | FEAT-006 | RBAC & Audit | PENDING |
| 7 | FEAT-007 | Exports | PENDING |

---

## Features

### Pending (3)

| ID | Titre | Priorite | Complexite | Tags |
|----|-------|----------|------------|------|
| FEAT-005 | Entites metier - Client, Chantier, Devis, Facture | Critique | L | api, data |
| FEAT-006 | RBAC et Audit Logs | Haute | M | security, auth |
| FEAT-007 | Exports et reversibilite | Critique | M | export, data |

### Ready (0)

| ID | Titre | Priorite | Complexite | Tags |
|----|-------|----------|------------|------|

### Done (4)

| ID | Titre | Priorite | Date resolution |
|----|-------|----------|-----------------|
| FEAT-001 | Initialiser le projet monorepo | Critique | 2025-01-25 |
| FEAT-002 | Backend NestJS - Setup initial | Critique | 2025-01-25 |
| FEAT-003 | Site vitrine Next.js | Haute | 2025-01-25 |
| FEAT-004 | PWA React - Setup initial | Haute | 2025-01-25 |

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
