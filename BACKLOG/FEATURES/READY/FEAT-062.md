# FEAT-062: Raccourcis clavier et recherche globale

**Type:** Feature
**Statut:** Pret
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
- [ ] `Ctrl+K` / `Cmd+K`: Ouvrir recherche globale
- [ ] `Ctrl+N`: Nouveau (context-aware: client, devis, facture...)
- [ ] `Ctrl+S`: Sauvegarder le formulaire courant
- [ ] `Escape`: Fermer modal/drawer
- [ ] `?`: Afficher aide raccourcis
- [ ] Raccourcis desactivables dans les champs input

### Recherche globale
- [ ] Barre de recherche type Spotlight/Command Palette
- [ ] Recherche dans: clients, chantiers, devis, factures
- [ ] Resultats groupes par type avec icones
- [ ] Navigation clavier dans les resultats (fleches + Enter)
- [ ] Recherche fuzzy tolerante aux fautes
- [ ] Historique des recherches recentes

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

- [ ] Ctrl+K ouvre la palette de commandes
- [ ] Recherche "martin" trouve client Martin et ses devis
- [ ] Navigation clavier fonctionne
- [ ] Raccourcis ignores dans les inputs
