# FEAT-063: Templates prestations devis

**Type:** Feature
**Statut:** Pret
**Priorite:** Haute
**Complexite:** M
**Tags:** ux, api, data
**Date creation:** 2026-02-03
**Phase:** 11

---

## Description

Creer un systeme de templates de prestations reutilisables pour accelerer la creation des devis (tonte pelouse, taille haie, elagage...).

## User Story

**En tant que** utilisateur
**Je veux** selectionner des prestations predefinies
**Afin de** creer mes devis plus rapidement sans ressaisir les memes lignes

## Contexte

Une entreprise de paysage propose souvent les memes prestations:
- Tonte pelouse (au m² ou forfait)
- Taille de haie (au ml)
- Elagage (a l'heure ou forfait)
- Desherbage (au m²)
- Evacuation dechets verts

Avoir des templates permet de gagner du temps et d'assurer la coherence des prix.

## Criteres d'acceptation

- [ ] CRUD templates prestations
- [ ] Champs: nom, description, unite (m², ml, h, forfait), prix_unitaire_ht, tva
- [ ] Categories de prestations (entretien, creation, elagage...)
- [ ] Templates globaux (entreprise) et par utilisateur
- [ ] Import rapide dans un devis (multi-selection)
- [ ] Modification du prix/quantite apres import
- [ ] Recherche/filtre dans les templates

## Fichiers concernes

- `packages/database/prisma/schema.prisma` (nouveau modele)
- `apps/api/src/modules/templates/` (nouveau module)
- `apps/pwa/src/pages/devis/TemplateSelector.tsx` (nouveau)

## Analyse / Approche

```prisma
model PrestationTemplate {
  id            String   @id @default(uuid())
  name          String
  description   String?
  category      String
  unit          String   // m2, ml, h, forfait
  unitPriceHT   Decimal
  tvaRate       Decimal  @default(20)
  isGlobal      Boolean  @default(false)
  createdBy     String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

Templates par defaut a creer:
- Tonte pelouse - 0.50€/m² HT
- Taille haie - 8€/ml HT
- Elagage leger - 45€/h HT
- Desherbage manuel - 35€/h HT
- Evacuation dechets - 80€/m³ HT
- Plantation arbuste - 25€/unite HT

## Tests de validation

- [ ] CRUD templates fonctionne
- [ ] Import template dans devis
- [ ] Modification prix apres import n'affecte pas le template
- [ ] Filtre par categorie
- [ ] Templates globaux visibles par tous
