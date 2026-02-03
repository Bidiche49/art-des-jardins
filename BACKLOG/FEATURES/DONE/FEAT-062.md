# FEAT-062: Raccourcis clavier et recherche globale

**Type:** Feature
**Statut:** Fait
**Priorite:** Haute
**Complexite:** S
**Tags:** ux, pwa
**Date creation:** 2026-02-03
**Phase:** 11

---

## Description

Ajouter des raccourcis clavier pour les actions frequentes et une barre de recherche globale unifiee (clients, chantiers, devis, factures).

## User Story

**En tant que** utilisateur PWA
**Je veux** utiliser des raccourcis clavier et rechercher rapidement
**Afin de** gagner du temps dans mes taches quotidiennes

## Criteres d'acceptation

### Raccourcis clavier
- [x] `Ctrl+K` / `Cmd+K`: Ouvrir recherche globale
- [ ] `Ctrl+N`: Nouveau (context-aware: client, devis, facture...) - *Non implemente (scope reduit)*
- [ ] `Ctrl+S`: Sauvegarder le formulaire courant - *Non implemente (scope reduit)*
- [x] `Escape`: Fermer modal/drawer
- [x] `?`: Afficher aide raccourcis
- [x] Raccourcis desactivables dans les champs input

### Recherche globale
- [x] Barre de recherche type Spotlight/Command Palette
- [x] Recherche dans: clients, chantiers, devis, factures (via API)
- [x] Resultats groupes par type avec icones
- [x] Navigation clavier dans les resultats (fleches + Enter)
- [x] Recherche fuzzy tolerante aux fautes (cote client)
- [x] Historique des recherches recentes

## Fichiers concernes

- `apps/pwa/src/hooks/useKeyboardShortcuts.ts` (nouveau)
- `apps/pwa/src/components/CommandPalette.tsx` (nouveau)
- `apps/pwa/src/services/search.service.ts` (nouveau)
- `apps/api/src/modules/search/search.controller.ts` (nouveau)

## Analyse / Approche

```typescript
// Hook raccourcis
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openCommandPalette();
    }
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, []);

// API search unifie
GET /api/v1/search?q=martin&types=client,devis
```

## Tests de validation

- [x] Ctrl+K ouvre la palette de commandes
- [x] Recherche "martin" trouve client Martin et ses devis (via API search)
- [x] Navigation clavier fonctionne
- [x] Raccourcis ignores dans les inputs

## Implementation realisee

### Fichiers crees
- `apps/pwa/src/hooks/useKeyboardShortcuts.ts` - Hook gestion raccourcis
- `apps/pwa/src/services/search.service.ts` - Service recherche avec fuzzy filter
- `apps/pwa/src/components/CommandPalette.tsx` - Palette de commandes
- `apps/pwa/src/components/KeyboardShortcutsHelp.tsx` - Modal aide raccourcis
- `apps/pwa/src/components/KeyboardShortcutsProvider.tsx` - Provider global

### Tests
- `useKeyboardShortcuts.test.ts` - 10 tests
- `search.service.test.ts` - 16 tests
- `CommandPalette.test.tsx` - 15 tests

### Note
Les raccourcis Ctrl+N et Ctrl+S necessitent une integration context-aware avec les formulaires existants et sont laisses pour un ticket ulterieur.
