# FEAT-027: Page signature client (frontend)

**Type:** Feature
**Statut:** Fait
**Priorite:** Critique
**Complexite:** M
**Tags:** ui, signature, pwa
**Date creation:** 2026-01-29
**Date completion:** 2026-01-29
**Phase:** 5.1

---

## Description

Creer la page publique permettant aux clients de visualiser et signer un devis. Page accessible via lien unique sans authentification.

**Note:** Page deplacee de la vitrine (SSG) vers la PWA (SPA) car la vitrine est en mode export statique incompatible avec les routes dynamiques.

## User Story

**En tant que** client
**Je veux** signer un devis sur mon telephone
**Afin de** valider rapidement sans imprimer

## Criteres d'acceptation

- [x] Page `/signer/:token` accessible publiquement
- [x] Affichage devis complet en lecture seule
- [x] Canvas signature tactile (fonctionne sur mobile)
- [x] Bouton "Effacer" pour recommencer
- [x] Checkbox "J'accepte les CGV" obligatoire
- [x] Bouton "Signer" disabled tant que signature vide ou CGV non cochee
- [x] Confirmation visuelle apres signature
- [ ] Telechargement PDF signe (FEAT-028)
- [x] Page erreur si token expire ou invalide

## Fichiers crees

- `apps/pwa/src/pages/SignerDevis.tsx` - Page principale
- `apps/pwa/src/components/signature/SignatureCanvas.tsx` - Canvas signature tactile
- `apps/pwa/src/components/signature/DevisReadOnly.tsx` - Affichage devis
- `apps/pwa/src/components/signature/DevisReadOnly.test.tsx` - Tests

## Analyse / Approche

1. ~~Utiliser `signature_pad` ou `react-signature-canvas` pour le canvas~~ signature_pad v5.1.3
2. ~~Page Next.js dynamique avec SSR~~ Page React Router dans PWA (route publique)
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
- [x] Test token expire (affiche erreur) - code implemente
- [x] Test devis deja signe (affiche confirmation) - code implemente

## Tests unitaires

- 10 tests pour DevisReadOnly (affichage, formatage, conditions)

## Dependencies

- FEAT-026 (backend signature) - DONE
