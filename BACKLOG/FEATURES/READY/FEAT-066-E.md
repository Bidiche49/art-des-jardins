# FEAT-066-E: Integration et tests end-to-end conflits

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** ux, pwa, offline, tests
**Date creation:** 2026-02-03
**Parent:** FEAT-066
**Depends:** FEAT-066-A, FEAT-066-B, FEAT-066-C, FEAT-066-D

---

## Description

Integrer tous les composants de resolution de conflits dans l'application, connecter le flow complet, et ecrire les tests d'integration pour valider le scenario end-to-end.

## Scope

- Integration ConflictQueue dans App.tsx (global provider)
- Connection entre sync service et ConflictQueue
- Tests E2E du flow complet
- Documentation utilisateur du flow

## Criteres d'acceptation

- [ ] ConflictQueue monte au niveau App
- [ ] Quand conflit detecte -> modal s'ouvre automatiquement
- [ ] Resolution appliquee correctement (local ou serveur)
- [ ] Sync reprend apres resolution
- [ ] Test E2E: scenario offline -> conflit -> resolution
- [ ] Pas de regression sur sync existante

## Fichiers a modifier

- `apps/pwa/src/App.tsx` (ajouter ConflictQueue provider)
- `apps/pwa/src/services/sync.service.ts` (trigger modal)
- Tests E2E dans `apps/pwa/src/__tests__/` ou `apps/pwa/e2e/`

## SECTION AUTOMATISATION
**Score:** 75/100
**Risque:** Moyen - Integration necessite comprehension du flow existant

### Prompt d'execution

```
Integrer le systeme de conflits et ecrire les tests E2E (FEAT-066-E).

Pre-requis: FEAT-066-A/B/C/D doivent etre faits.

1. Lire le code existant:
   - apps/pwa/src/App.tsx (structure actuelle)
   - apps/pwa/src/services/sync.service.ts (flow de sync)

2. Modifier `apps/pwa/src/App.tsx`:

```tsx
import { ConflictQueue } from './components/SyncConflict/ConflictQueue';

function App() {
  return (
    <Providers>
      {/* Autres providers */}
      <ConflictQueue />  {/* Ecoute le store et affiche modals */}
      <RouterProvider />
    </Providers>
  );
}
```

3. Modifier sync.service.ts pour trigger l'UI:
   - Quand conflit detecte, ajouter au store
   - Le ConflictQueue ecoute et affiche automatiquement
   - Quand resolution choisie, appliquer et continuer sync

4. Ecrire test E2E complet:

```typescript
describe('Conflict Resolution E2E', () => {
  it('should detect and resolve conflict when coming back online', async () => {
    // 1. Creer une intervention
    // 2. Passer offline (mock)
    // 3. Modifier l'intervention localement
    // 4. Simuler modification serveur
    // 5. Revenir online
    // 6. Verifier modal conflit s'ouvre
    // 7. Choisir "Garder ma version"
    // 8. Verifier version locale appliquee
  });

  it('should handle multiple conflicts in queue', async () => {
    // Test avec 3 conflits simultanes
  });

  it('should apply session preference automatically', async () => {
    // Test "Toujours garder ma version"
  });
});
```

5. Tester manuellement:
   - Ouvrir 2 onglets
   - Modifier meme entite dans les 2
   - Passer un onglet offline
   - Verifier conflit detecte

6. Verifier: pnpm test apps/pwa && pnpm test:e2e
```

## Tests de validation

- [ ] ConflictQueue present dans App
- [ ] Modal s'ouvre quand conflit detecte
- [ ] Resolution "garder local" applique version locale
- [ ] Resolution "garder serveur" applique version serveur
- [ ] Fusion manuelle sauvegarde donnees editees
- [ ] Sync continue apres resolution
- [ ] Pas de regression sur sync normale
