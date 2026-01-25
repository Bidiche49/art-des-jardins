# Template de Decisions - Ecriture de Tests (Generic)

> Questions pour tickets d'ajout ou amelioration de tests.
> Ce template est generique et s'applique a toutes les stacks.

---

## Quand utiliser ce template

- Ajout de tests pour une feature existante
- Augmentation de la couverture
- Ecriture de tests de regression
- Mise en place de tests d'integration

---

## Questions

### 1. Type de tests

**Question:** Quels types de tests ecrire pour ce composant ?

**Options typiques:**
- Tests unitaires (logique isolee)
- Tests de composant/widget (UI + interactions)
- Tests d'integration (flux complet)
- Tests de snapshot (visuels ou donnees)

**Impact:** Couverture, temps d'execution

---

### 2. Strategie de mock

**Question:** Comment gerer les dependances externes ?

**Options typiques:**
- Mocks (librairie de mocking)
- Fakes (implementations simplifiees)
- Stubs (reponses fixes)
- Vraies implementations (tests d'integration)

**Impact:** Isolation, realisme des tests

---

### 3. Edge cases a couvrir

**Question:** Quels cas limites doivent etre testes ?

**Cas typiques:**
- Valeurs nulles / vides
- Valeurs extremes (0, MAX)
- Erreurs reseau / timeout
- Etats de chargement
- Permissions refusees
- Donnees corrompues

**Impact:** Robustesse, confiance

---

### 4. Couverture cible

**Question:** Quel niveau de couverture viser ?

**Options typiques:**
- Critique (> 90%) - code critique
- Standard (70-90%) - code normal
- Minimum (50-70%) - code legacy
- Best effort (< 50%) - code difficile a tester

**Impact:** Effort, ROI

---

### 5. Organisation des tests

**Question:** Comment organiser les fichiers de tests ?

**Options typiques:**
- Miroir de la structure source (test/unit/, test/integration/)
- Par feature (test/features/auth/)
- Par type (test/mocks/, test/helpers/)
- Mix des approches

**Impact:** Maintenabilite, discoverabilite

---

### 6. Setup et teardown

**Question:** Quelle infrastructure de test mettre en place ?

**Options typiques:**
- setUp/tearDown simples
- Fixtures partagees
- Test containers (pour DB)
- Mock server (pour API)

**Impact:** Isolation, performance

---

## Pattern AAA obligatoire

```
test('description claire et specifique', () {
  // ============================================================
  // ARRANGE - Preparer les donnees et mocks
  // ============================================================
  // Setup du contexte de test

  // ============================================================
  // ACT - Executer l'action a tester
  // ============================================================
  // Appel de la fonction/methode

  // ============================================================
  // ASSERT - Verifier le resultat
  // ============================================================
  // Assertions sur le resultat et les effets
});
```

---

## Notes

- Un test = un comportement
- Noms de tests descriptifs (should_X_when_Y)
- Eviter la logique dans les tests
- Tests deterministes (pas de random, dates fixes)
- Nettoyer apres les tests d'integration
