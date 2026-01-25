# Template de Decisions - Bug Logique (Generic)

> Questions pour bugs de logique metier, gestion d'erreurs, et comportements inattendus.
> Ce template est generique et s'applique a toutes les stacks.

---

## Quand utiliser ce template

- Bug dans la logique metier
- Comportement inattendu d'une fonction
- Gestion d'erreurs incorrecte
- Probleme de flux de donnees

---

## Questions

### 1. Comportement attendu

**Question:** Quel est le comportement attendu quand cette condition se produit ?

**Options typiques:**
- Retourner une valeur par defaut
- Lever une exception / erreur
- Ignorer silencieusement (avec log)
- Afficher un message utilisateur

**Impact:** Experience utilisateur, debuggabilite

---

### 2. Valeur par defaut

**Question:** Quelle valeur par defaut utiliser si la donnee est null/invalide ?

**Options typiques:**
- Valeur neutre (0, "", [], false)
- Valeur de fallback metier (ex: "Utilisateur anonyme")
- null (propagation explicite)
- Erreur (fail fast)

**Impact:** Robustesse, comportement en cas d'erreur

---

### 3. Strategie d'erreur

**Question:** Comment gerer l'erreur : logger, propager, ou ignorer ?

**Options typiques:**
- Logger + continuer (erreur non bloquante)
- Logger + propager (erreur importante)
- Propager sans log (erreur attendue)
- Ignorer (cas vraiment negligeable)

**Impact:** Observabilite, debuggabilite

---

### 4. Cas limites

**Question:** Quels cas limites doivent etre geres explicitement ?

**Cas typiques a considerer:**
- Liste vide / null
- Valeur negative / zero
- String vide / trop longue
- Timeout / deconnexion
- Donnees corrompues

**Impact:** Robustesse, prevention de crash

---

### 5. Impact sur l'etat

**Question:** Cette correction doit-elle modifier l'etat de l'application ?

**Options typiques:**
- Aucun changement d'etat (pure function)
- Mise a jour locale (composant/module)
- Reset de l'etat (retour a un etat sain)
- Notification aux autres composants

**Impact:** Coherence de l'etat, side effects

---

### 6. Regression

**Question:** Quel test ecrire pour prevenir une regression ?

**Options typiques:**
- Test unitaire specifique au cas
- Test d'integration du flux complet
- Test de snapshot
- Pas de test automatise (justifier)

**Impact:** Prevention de regression, confiance

---

## Notes

- Toujours reproduire le bug avant de le corriger
- Documenter le cas qui a cause le bug
- Verifier que le fix ne casse pas d'autres cas
