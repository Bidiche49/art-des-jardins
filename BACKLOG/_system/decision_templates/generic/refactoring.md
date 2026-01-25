# Template de Decisions - Refactoring (Generic)

> Questions pour tickets de refactoring, renommage, et amelioration de code.
> Ce template est generique et s'applique a toutes les stacks.

---

## Quand utiliser ce template

- Renommage de classe/fonction/variable
- Extraction de code commun
- Simplification de logique complexe
- Migration vers un nouveau pattern
- Suppression de code mort

---

## Questions

### 1. Strategie de renommage

**Question:** Comment gerer le renommage ?

**Options typiques:**
- Renommer directement (IDE refactor)
- Creer nouveau + deprecate ancien
- Alias temporaire pendant migration
- Wrapper de compatibilite

**Impact:** Breaking change, effort de migration

---

### 2. Migration des usages

**Question:** Migrer tous les usages existants maintenant ?

**Options typiques:**
- Migration complete immediate
- Migration progressive (fichier par fichier)
- Migration opportuniste (au fur et a mesure)
- Pas de migration (nouveau code seulement)

**Impact:** Effort, risque de regression

---

### 3. Tests de non-regression

**Question:** Quels tests de non-regression sont requis ?

**Options typiques:**
- Tests existants suffisants
- Ajouter tests avant refactoring
- Tests de caracterisation (snapshot du comportement)
- Tests d'integration du flux

**Impact:** Confiance, securite du refactoring

---

### 4. Scope du refactoring

**Question:** Quel est le scope acceptable pour ce refactoring ?

**Options typiques:**
- Fichier unique
- Module/feature (plusieurs fichiers lies)
- Transversal (impact global)
- Decouper en plusieurs tickets

**Impact:** Risque, complexite de review

---

### 5. Gestion des deprecations

**Question:** Comment signaler les deprecations ?

**Options typiques:**
- Annotation @deprecated avec message
- Commentaire TODO avec date limite
- Documentation dans CHANGELOG
- Pas de deprecation (suppression directe)

**Impact:** Communication, planning de suppression

---

### 6. Verification du refactoring

**Question:** Comment verifier que le refactoring est correct ?

**Options typiques:**
- Tests unitaires passent
- Analyse statique clean
- Review manuelle des changements
- Tests manuels des flux impactes

**Impact:** Qualite, confiance

---

## Checklist pre-refactoring

- [ ] Tous les tests passent AVANT le refactoring
- [ ] Le code a refactorer est compris
- [ ] Les usages sont identifies (grep/find references)
- [ ] Le scope est defini et limite
- [ ] Un backup/commit existe avant de commencer

---

## Checklist post-refactoring

- [ ] Tous les tests passent APRES
- [ ] Analyse statique = 0 erreur
- [ ] Pas de code mort laisse
- [ ] Imports nettoyes
- [ ] Documentation mise a jour si necessaire

---

## Notes

- Preferer les petits refactorings frequents aux gros refactorings rares
- Un refactoring ne devrait pas changer le comportement (par definition)
- Committer souvent pendant un refactoring complexe
- Si le scope grandit, creer un nouveau ticket
