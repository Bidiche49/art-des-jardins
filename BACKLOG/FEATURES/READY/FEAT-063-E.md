# FEAT-063-E: Integration Templates dans Formulaire Devis

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** ui, ux
**Parent:** FEAT-063
**Date creation:** 2026-02-04
**Dependances:** FEAT-063-D

---

## Description

Integrer le TemplateSelector dans le formulaire de creation/edition de devis pour permettre l'import rapide de prestations.

## Scope

- Bouton "Ajouter depuis templates" dans le formulaire devis
- Modal/drawer avec TemplateSelector
- Conversion template -> ligne de devis
- Prix/quantite modifiables apres import
- Ne pas modifier le template original

## Criteres d'acceptation

- [ ] Bouton "Importer templates" dans formulaire devis
- [ ] Ouverture modal/drawer avec TemplateSelector
- [ ] Selection et import de templates
- [ ] Conversion en lignes de devis avec champs editables
- [ ] Quantite par defaut: 1
- [ ] Prix modifiable sans affecter le template
- [ ] Tests integration du flow complet

## Fichiers concernes

- `apps/pwa/src/pages/devis/DevisForm.tsx` (ou equivalent)
- `apps/pwa/src/pages/devis/DevisLigneForm.tsx` (ou equivalent)
- `apps/pwa/src/types/devis.ts`

## Analyse technique

### Conversion template -> ligne devis

```typescript
function templateToDevisLigne(template: PrestationTemplate): DevisLigne {
  return {
    id: crypto.randomUUID(),
    designation: template.name,
    description: template.description,
    unite: template.unit,
    quantite: 1,
    prixUnitaireHT: template.unitPriceHT,
    tauxTVA: template.tvaRate,
    // Calcule automatiquement:
    // montantHT = quantite * prixUnitaireHT
    // montantTVA = montantHT * tauxTVA / 100
    // montantTTC = montantHT + montantTVA
  };
}
```

### Integration

```typescript
// Dans DevisForm.tsx
const handleImportTemplates = (templates: PrestationTemplate[]) => {
  const newLignes = templates.map(templateToDevisLigne);
  setLignes([...lignes, ...newLignes]);
  setShowTemplateSelector(false);
};
```

## SECTION AUTOMATISATION

**Score:** 80/100
**Raison:** Integration dans code existant, necessite comprehension du formulaire devis

### Prompt d'execution

```
TICKET: FEAT-063-E - Integration Templates dans Devis

PREREQUIS: FEAT-063-D (TemplateSelector) doit etre complete

CONTEXTE:
- Formulaire devis existant dans apps/pwa/
- Chercher: DevisForm, DevisCreate, DevisEdit...

TACHE:
1. Explorer le formulaire de devis existant
2. Identifier la structure des lignes de devis (DevisLigne)
3. Ajouter un bouton "Importer depuis templates"
4. Integrer TemplateSelector dans une modal/drawer
5. Creer fonction templateToDevisLigne() pour conversion:
   - designation = template.name
   - description = template.description
   - unite = template.unit
   - quantite = 1 (defaut)
   - prixUnitaireHT = template.unitPriceHT
   - tauxTVA = template.tvaRate
6. Ajouter les lignes converties au formulaire
7. Verifier que les lignes sont editables apres import
8. Tester le flow complet

VALIDATION:
- [ ] Bouton visible dans formulaire devis
- [ ] Modal s'ouvre avec templates
- [ ] Selection et import fonctionnent
- [ ] Lignes editables apres import
- [ ] Modification ne touche pas au template original
```

## Tests de validation

- [ ] Test E2E: ouvrir devis, importer template, modifier quantite, sauvegarder
- [ ] Verification: template original inchange
- [ ] Build: `pnpm build:pwa` reussit
