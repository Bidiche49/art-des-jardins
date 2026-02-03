# FEAT-066-D: ConflictQueue et preferences de session

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** ux, pwa, offline
**Date creation:** 2026-02-03
**Parent:** FEAT-066
**Depends:** FEAT-066-A, FEAT-066-C

---

## Description

Gerer les cas ou plusieurs conflits surviennent en meme temps. Implementer une file d'attente avec indicateur de progression (1/5), et une option "Toujours garder ma version" pour la session courante.

## Scope

- Composant `ConflictQueue` wrapper du modal
- Indicateur de progression "Conflit 2/5"
- Option "Appliquer a tous" dans le modal
- Preference de session "Toujours garder local"
- Historique des resolutions (localStorage)

## Criteres d'acceptation

- [ ] Affiche "Conflit 1/N" quand plusieurs conflits
- [ ] Navigation suivant/precedent si > 1 conflit
- [ ] Checkbox "Appliquer ce choix aux conflits restants"
- [ ] Option "Toujours garder ma version cette session"
- [ ] Historique des resolutions accessible
- [ ] Badge notification sur icone sync si conflits en attente

## Fichiers a creer/modifier

- `apps/pwa/src/components/SyncConflict/ConflictQueue.tsx` (creer)
- `apps/pwa/src/components/SyncConflict/ConflictHistory.tsx` (creer)
- `apps/pwa/src/stores/conflictStore.ts` (enrichir)

## SECTION AUTOMATISATION
**Score:** 80/100
**Risque:** Faible - Logique UI standard, store deja en place

### Prompt d'execution

```
Implementer la file de conflits et preferences (FEAT-066-D).

Pre-requis: FEAT-066-A (store), FEAT-066-C (modal) doivent etre faits.

1. Enrichir `apps/pwa/src/stores/conflictStore.ts`:

```typescript
interface ConflictStore {
  conflicts: SyncConflict[];
  currentIndex: number;
  sessionPreference: 'always_local' | 'always_server' | null;
  resolutionHistory: ConflictResolutionResult[];

  // Nouvelles actions
  nextConflict: () => void;
  prevConflict: () => void;
  resolveAll: (resolution: ConflictResolution) => void;
  setSessionPreference: (pref: 'always_local' | 'always_server' | null) => void;
  addToHistory: (result: ConflictResolutionResult) => void;
}
```

2. Creer `apps/pwa/src/components/SyncConflict/ConflictQueue.tsx`:

```tsx
// Affiche le modal actuel + navigation
// Si sessionPreference set, auto-resoud sans modal
// Progress: "Conflit {currentIndex + 1} / {conflicts.length}"
// Buttons: [< Precedent] [Suivant >]
// Checkbox: "Appliquer a tous les conflits restants"
```

3. Creer `apps/pwa/src/components/SyncConflict/ConflictHistory.tsx`:
   - Liste des resolutions passees
   - Filtrable par date/type
   - Option "Annuler" si possible

4. Ajouter badge sur l'icone de sync dans le header si conflits en attente

5. Tests:
   - Navigation entre conflits
   - "Appliquer a tous" resout tous les conflits
   - Session preference auto-resout
   - Historique sauvegarde

6. Verifier: pnpm test apps/pwa
```

## Tests de validation

- [ ] Indicateur "1/N" affiche correctement
- [ ] Navigation prev/next fonctionne
- [ ] "Appliquer a tous" resout les conflits restants
- [ ] Preference session memorisee
- [ ] Historique persiste en localStorage
- [ ] Badge notification visible
