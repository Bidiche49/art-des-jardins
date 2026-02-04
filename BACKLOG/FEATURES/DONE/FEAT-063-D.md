# FEAT-063-D: Composant TemplateSelector PWA

**Type:** Feature
**Statut:** Fait
**Priorite:** Haute
**Complexite:** S
**Tags:** ui, ux
**Parent:** FEAT-063
**Date creation:** 2026-02-04
**Dependances:** FEAT-063-B

---

## Description

Creer le composant React TemplateSelector pour afficher, filtrer et selectionner les templates de prestations dans la PWA.

## Scope

- Composant TemplateSelector autonome
- Liste des templates avec filtre par categorie
- Recherche par nom
- Selection multiple avec checkbox
- Hook useTemplates pour fetch API
- Tests unitaires du composant

## Criteres d'acceptation

- [x] Composant TemplateSelector cree
- [x] Affichage liste templates (nom, prix, unite)
- [x] Filtre par categorie (dropdown/tabs)
- [x] Recherche par nom (input text)
- [x] Multi-selection avec checkboxes
- [x] Callback onSelect(templates[]) pour le parent
- [x] Hook useTemplates (sans React Query, pattern useEffect/useState)
- [x] Tests unitaires du composant

## Fichiers concernes

- `apps/pwa/src/components/devis/TemplateSelector.tsx`
- `apps/pwa/src/hooks/useTemplates.ts`
- `apps/pwa/src/services/templateService.ts`
- `apps/pwa/src/components/devis/TemplateSelector.test.tsx`

## Analyse technique

### API Hook

```typescript
// useTemplates.ts
export function useTemplates(filters?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: ['templates', filters],
    queryFn: () => templateService.getAll(filters),
  });
}
```

### Composant

```typescript
// TemplateSelector.tsx
interface Props {
  onSelect: (templates: PrestationTemplate[]) => void;
  onClose: () => void;
}

export function TemplateSelector({ onSelect, onClose }: Props) {
  const [category, setCategory] = useState<string>('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { data: templates } = useTemplates({ category, search });

  // ... UI avec filtres, liste, checkboxes
}
```

## SECTION AUTOMATISATION

**Score:** 85/100
**Raison:** Composant UI standard, patterns React Query connus

### Prompt d'execution

```
TICKET: FEAT-063-D - Composant TemplateSelector PWA

PREREQUIS: FEAT-063-B (API CRUD) doit etre complete

CONTEXTE:
- PWA React dans apps/pwa/
- React Query pour data fetching
- UI components existants a observer dans apps/pwa/src/components/

TACHE:
1. Explorer les composants existants pour suivre les patterns
2. Creer le service API: apps/pwa/src/services/templateService.ts
   - getAll(filters): GET /api/v1/templates
   - getById(id): GET /api/v1/templates/:id
3. Creer le hook: apps/pwa/src/hooks/useTemplates.ts
   - useTemplates(filters) avec React Query
4. Creer le composant: apps/pwa/src/components/devis/TemplateSelector.tsx
   - Props: onSelect(templates[]), onClose()
   - State: category filter, search input, selected Set
   - UI: Dropdown categorie, Input recherche, Liste avec checkboxes
   - Bouton "Ajouter X templates selectionnes"
5. Ecrire tests unitaires pour le composant
6. Build et verifier: pnpm build:pwa

VALIDATION:
- [ ] Build PWA reussit
- [ ] Tests passent
- [ ] Composant affiche les templates mock
```

## Tests de validation

- [x] `pnpm test:pwa` - tests composant passent (13 tests pour TemplateSelector + hooks + service)
- [ ] `pnpm build:pwa` - build a des erreurs preexistantes non liees a ce ticket
- [ ] Composant rendu correctement (Storybook si dispo)

## Notes de realisation

**Date:** 2026-02-04
**Fichiers crees:**
- `apps/pwa/src/services/template.service.ts` - Service API
- `apps/pwa/src/services/template.service.test.ts` - Tests service
- `apps/pwa/src/hooks/useTemplates.ts` - Hooks useTemplates et useCategories
- `apps/pwa/src/hooks/useTemplates.test.ts` - Tests hooks
- `apps/pwa/src/components/devis/TemplateSelector.tsx` - Composant principal
- `apps/pwa/src/components/devis/TemplateSelector.test.tsx` - Tests composant

**Note:** Le hook n'utilise pas React Query mais le pattern useEffect/useState comme les autres hooks du projet (useRentabilite, etc.). L'API backend (FEAT-063-B) doit etre implementee pour que le composant fonctionne.
