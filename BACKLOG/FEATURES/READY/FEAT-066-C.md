# FEAT-066-C: Composant ConflictModal avec comparaison

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** ux, pwa, offline, ui
**Date creation:** 2026-02-03
**Parent:** FEAT-066
**Depends:** FEAT-066-A

---

## Description

Creer le composant modal principal pour afficher un conflit de synchronisation avec comparaison cote-a-cote des versions locale et serveur, mise en evidence des champs differents, et boutons de resolution.

## Scope

- Composant `ConflictModal` avec comparaison visuelle
- Highlight des champs en conflit
- 3 boutons: Garder ma version / Garder serveur / Fusionner
- Mode fusion avec edition des champs
- Pas de gestion de file (autre ticket)

## Criteres d'acceptation

- [ ] Modal affiche les deux versions cote-a-cote
- [ ] Champs differents highlights en couleur (rouge/vert)
- [ ] Bouton "Garder ma version" ferme et applique local
- [ ] Bouton "Garder serveur" ferme et applique serveur
- [ ] Bouton "Fusionner" ouvre mode edition
- [ ] Mode fusion permet editer chaque champ
- [ ] Affichage timestamps relatifs ("il y a 2h")
- [ ] Responsive mobile

## Fichiers a creer

- `apps/pwa/src/components/SyncConflict/ConflictModal.tsx`
- `apps/pwa/src/components/SyncConflict/ConflictField.tsx`
- `apps/pwa/src/components/SyncConflict/ConflictModal.test.tsx`

## SECTION AUTOMATISATION
**Score:** 80/100
**Risque:** Faible - UI standard, patterns existants dans le projet

### Prompt d'execution

```
Implementer le composant ConflictModal (FEAT-066-C).

Pre-requis: FEAT-066-A (types) doit etre fait.

1. Lire les patterns UI existants:
   - apps/pwa/src/components/ (voir style des modals existants)
   - Utiliser les composants UI du projet (Modal, Button, etc.)

2. Creer `apps/pwa/src/components/SyncConflict/ConflictModal.tsx`:

```tsx
interface ConflictModalProps {
  conflict: SyncConflict;
  onResolve: (resolution: ConflictResolution, mergedData?: Record<string, any>) => void;
  onCancel?: () => void;
}

// Structure:
// - Header: "Conflit sur [entityLabel]"
// - Two columns: "Votre version (il y a X)" | "Version serveur (il y a Y)"
// - List of conflicting fields with values side by side
// - Highlight: local en bleu/vert, server en orange/rouge
// - Footer: 3 buttons
// - If merge mode: editable fields
```

3. Creer `apps/pwa/src/components/SyncConflict/ConflictField.tsx`:
   - Affiche un champ avec sa valeur locale et serveur
   - Highlight si different
   - Mode edit si fusion

4. Utiliser date-fns ou similar pour "il y a X temps"

5. Styles avec Tailwind (ou le systeme CSS du projet)

6. Tests:
   - Rendu avec conflit simple
   - Click sur chaque bouton
   - Mode fusion fonctionne

7. Verifier: pnpm test apps/pwa
```

## Maquette UI

```
┌─────────────────────────────────────────────────┐
│ ⚠️ Conflit sur Intervention #123         [X]    │
├────────────────────┬────────────────────────────┤
│ 📱 Votre version   │ 🖥️ Version serveur         │
│ il y a 2 heures    │ il y a 30 minutes          │
├────────────────────┼────────────────────────────┤
│ Notes:             │ Notes:                     │
│ ▌"Taille haie OK"  │ ▌"Taille + tonte demandee" │
│ (different)        │ (different)                │
├────────────────────┼────────────────────────────┤
│ Statut:            │ Statut:                    │
│ En cours           │ En cours                   │
├────────────────────┴────────────────────────────┤
│  [Garder la mienne]  [Garder serveur]           │
│            [Fusionner manuellement]             │
└─────────────────────────────────────────────────┘
```

## Tests de validation

- [ ] Modal s'affiche correctement
- [ ] Comparaison cote-a-cote visible
- [ ] Champs differents visuellement distincts
- [ ] 3 boutons fonctionnels
- [ ] Mode fusion permet edition
- [ ] Responsive sur mobile
