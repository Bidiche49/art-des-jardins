# Template de Decisions - Architecture (Generic)

> Questions pour tickets d'architecture, choix de patterns, et decisions techniques structurantes.
> Ce template est generique et s'applique a toutes les stacks.

---

## Quand utiliser ce template

- Choix de pattern ou librairie
- Ajout d'une nouvelle abstraction
- Modification de l'architecture existante
- Integration d'un nouveau service

---

## Questions

### 1. Pattern a utiliser

**Question:** Plusieurs patterns existent dans le projet pour ce type de probleme. Lequel utiliser ?

**Options typiques:**
- Pattern A (utilise dans `<fichierA>`)
- Pattern B (utilise dans `<fichierB>`)
- Nouveau pattern (justifier)

**Impact:** Coherence du codebase, maintenabilite

---

### 2. Strategie d'implementation

**Question:** Proceder en une seule fois ou decouper le changement en plusieurs etapes ?

**Options typiques:**
- En une fois (changement atomique)
- En plusieurs PRs (migration progressive)
- Feature flag (activation controlee)

**Impact:** Risque de regression, facilite de review

---

### 3. Niveau d'abstraction

**Question:** Creer une abstraction generique ou ecrire du code direct pour ce cas specifique ?

**Options typiques:**
- Abstraction (interface/classe abstraite)
- Code direct (implementation concrete)
- Composition (mixin/extension/trait)

**Impact:** Reutilisabilite vs complexite

---

### 4. Gestion des breaking changes

**Question:** Breaking change acceptable ou retrocompatibilite requise ?

**Options typiques:**
- Breaking change OK (migration immediate)
- Deprecation + migration (periode de transition)
- Retrocompatibilite stricte (wrapper/adapter)

**Impact:** Effort de migration, risque pour les usages existants

---

### 5. Gestion des dependances

**Question:** Comment gerer les dependances de ce composant ?

**Options typiques:**
- Injection de dependances (constructeur)
- Service locator / Container IoC
- Singleton (a eviter generalement)

**Impact:** Testabilite, couplage

---

### 6. Strategie de test

**Question:** Quel niveau de test pour cette architecture ?

**Options typiques:**
- Tests unitaires uniquement
- Tests unitaires + integration
- Tests de contrat / snapshot tests

**Impact:** Confiance, temps d'implementation

---

## Notes

- Toujours verifier les patterns existants avant d'en introduire un nouveau
- Documenter les decisions dans le ticket pour reference future
- Preferer la simplicite a l'over-engineering
