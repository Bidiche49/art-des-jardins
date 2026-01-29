# FEAT-027: Page signature client (frontend)

**Type:** Feature
**Statut:** A faire
**Priorite:** Critique
**Complexite:** M
**Tags:** ui, signature, vitrine
**Date creation:** 2026-01-29
**Phase:** 5.1

---

## Description

Creer la page publique permettant aux clients de visualiser et signer un devis. Page accessible via lien unique sans authentification.

## User Story

**En tant que** client
**Je veux** signer un devis sur mon telephone
**Afin de** valider rapidement sans imprimer

## Criteres d'acceptation

- [ ] Page `/signer/:token` accessible publiquement
- [ ] Affichage devis complet en lecture seule
- [ ] Canvas signature tactile (fonctionne sur mobile)
- [ ] Bouton "Effacer" pour recommencer
- [ ] Checkbox "J'accepte les CGV" obligatoire
- [ ] Bouton "Signer" disabled tant que signature vide ou CGV non cochee
- [ ] Confirmation visuelle apres signature
- [ ] Telechargement PDF signe
- [ ] Page erreur si token expire ou invalide

## Fichiers concernes

- `apps/vitrine/src/app/signer/[token]/page.tsx` (nouvelle page)
- `apps/vitrine/src/components/SignatureCanvas.tsx` (nouveau composant)
- `apps/vitrine/src/components/DevisReadOnly.tsx` (nouveau composant)

## Analyse / Approche

1. Utiliser `signature_pad` ou `react-signature-canvas` pour le canvas
2. Page Next.js dynamique avec SSR pour charger le devis
3. Design responsive mobile-first
4. Animation de confirmation apres signature

## Maquette simplifiee

```
+----------------------------------+
|        DEVIS N° D-2024-0042      |
|----------------------------------|
|  Client: M. Dupont               |
|  Date: 29/01/2026                |
|----------------------------------|
|  Ligne 1: Taille haie    150€    |
|  Ligne 2: Evacuation      50€    |
|----------------------------------|
|  Total TTC: 200€                 |
+----------------------------------+
|                                  |
|   [    Zone signature    ]       |
|                                  |
|   [Effacer]                      |
|                                  |
|   [ ] J'accepte les CGV          |
|                                  |
|   [    SIGNER LE DEVIS    ]      |
+----------------------------------+
```

## Tests de validation

- [ ] Test sur iPhone Safari
- [ ] Test sur Android Chrome
- [ ] Test sur desktop
- [ ] Test token expire (affiche erreur)
- [ ] Test devis deja signe (affiche confirmation)

## Dependencies

- FEAT-026 (backend signature)
