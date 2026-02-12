# FEAT-109: Ajouter tests vitrine Next.js

**Type:** Feature
**Statut:** A faire
**Priorite:** Moyenne
**Complexite:** S
**Tags:** vitrine, test
**Date creation:** 2026-02-12

---

## Description

La vitrine Next.js n'a aucun test bien qu'elle ait un script `test` et vitest en devDependencies. Les regressions SEO (meta tags, Schema.org, liens casses) ne sont pas detectees.

## User Story

**En tant que** developpeur
**Je veux** des tests automatises sur les pages critiques de la vitrine
**Afin de** detecter les regressions SEO et de contenu avant deploiement

## Criteres d'acceptation

- [ ] Config vitest creee pour Next.js
- [ ] Tests meta tags (title, description) sur chaque page
- [ ] Tests Schema.org (JSON-LD valide) sur pages SEO
- [ ] Tests liens internes (pas de 404)
- [ ] Tests coherence infos entreprise (tel, email identiques partout)
- [ ] Tests integres dans CI

## Fichiers concernes

- `apps/vitrine/vitest.config.ts` - CREER
- `apps/vitrine/test/` - CREER
- `.github/workflows/test.yml` - ajouter step vitrine

## Analyse / Approche

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
});

// test/seo.test.ts - exemple
describe('SEO Meta Tags', () => {
  it('homepage has correct title', () => {
    // Verifier que metadata.title contient "Art des Jardins"
  });

  it('all pages have canonical URL', () => {
    // Verifier chaque page
  });
});
```

## Tests de validation

- [ ] `cd apps/vitrine && pnpm test` passe
- [ ] Tests detectent si un meta tag est supprime
- [ ] CI execute les tests vitrine
