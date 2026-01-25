# Template de Decisions - Bug UI (Generic)

> Questions pour bugs d'interface utilisateur, layout, et rendu visuel.
> Ce template est generique et s'applique a toutes les stacks.
> Note: La plupart des bugs UI necessitent une validation visuelle et ne sont pas automatisables.

---

## Quand utiliser ce template

- Probleme de layout (overflow, espacement)
- Bug d'affichage (couleurs, polices)
- Probleme responsive
- Animation defectueuse

---

## Evaluation automatisabilite

**Ce bug est-il automatisable ?**

| Critere | Automatisable | Non automatisable |
|---------|---------------|-------------------|
| Overflow detecte par le framework | Oui | - |
| Probleme de contraintes/layout | Oui | - |
| Positionnement precis requis | - | Non |
| Validation "ca a l'air bien" | - | Non |
| Couleurs/styles corrects | - | Non |

---

## Questions (si automatisable)

### 1. Strategie d'overflow

**Question:** Comment gerer l'overflow du contenu ?

**Options typiques:**
- Scroll (vertical ou horizontal)
- Contraindre les dimensions max
- Truncate avec indicateur (ellipsis)
- Resize dynamique du contenu
- Reorganiser le layout

**Impact:** UX, performance

---

### 2. Breakpoints responsive

**Question:** A quels breakpoints adapter le layout ?

**Options typiques:**
- Mobile small (< 360px)
- Mobile standard (360-414px)
- Mobile large (> 414px)
- Tablet (> 600px)
- Desktop (> 1024px)

**Impact:** Compatibilite devices

---

### 3. Comportement sur espace insuffisant

**Question:** Que faire si l'espace disponible est insuffisant ?

**Options typiques:**
- Reduire les marges/paddings
- Reduire la taille de police
- Cacher des elements secondaires
- Activer le scroll
- Afficher une version compacte

**Impact:** Lisibilite, UX

---

### 4. Animation

**Question:** Quelle duree et courbe d'animation utiliser ?

**Options typiques:**
- Rapide (150-200ms) - feedback immediat
- Standard (300ms) - transition fluide
- Lente (500ms+) - emphase
- Courbe: ease-out, ease-in-out, bounce

**Impact:** Perception de reactivite

---

### 5. Fallback visuel

**Question:** Quel fallback si le composant principal ne peut pas s'afficher ?

**Options typiques:**
- Placeholder (skeleton, shimmer)
- Message d'erreur discret
- Composant alternatif compact
- Espace vide

**Impact:** Robustesse visuelle

---

## Questions supplementaires (si non automatisable)

### Pour documentation manuelle

- Screenshot du bug actuel ?
- Screenshot du resultat attendu ?
- Device/resolution pour reproduire ?
- Etapes de reproduction exactes ?

---

## Notes

- Verifier sur plusieurs tailles d'ecran
- Tester en mode portrait ET paysage si applicable
- Utiliser les dev tools du framework pour debugger les contraintes
- Les bugs UI complexes devraient aller dans NON_AUTOMATABLE/
