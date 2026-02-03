# FEAT-069: Photos geolocalisees avant/apres

**Type:** Feature
**Statut:** Split
**Priorite:** Haute
**Complexite:** M
**Tags:** ux, pwa, mobile, data
**Date creation:** 2026-02-03
**Date split:** 2026-02-03
**Phase:** 14

---

## SPLIT EN SOUS-TICKETS

Ce ticket a ete decoupe en 5 sous-tickets de complexite S/XS:

| Sous-ticket | Description | Complexite |
|-------------|-------------|------------|
| FEAT-069-A | Modele Prisma Photo et migration | XS |
| FEAT-069-B | Module API photos NestJS | S |
| FEAT-069-C | Service photo PWA (compression, offline) | S |
| FEAT-069-D | Composant PhotoCapture | S |
| FEAT-069-E | Composant PhotoGallery et comparaison | S |

### Ordre d'execution recommande:
1. FEAT-069-A (prerequis pour B)
2. FEAT-069-B et FEAT-069-C (peuvent etre faits en parallele)
3. FEAT-069-D (necessite C)
4. FEAT-069-E (necessite B)

### Note
Le critere "Export pour client (watermark optionnel)" n'a pas ete inclus dans les sous-tickets car il constitue une feature separee qui pourra etre traitee ulterieurement.

---

## Description originale

Permettre aux employes de prendre des photos avant/apres intervention avec geolocalisation et horodatage automatiques.

## User Story

**En tant que** employe
**Je veux** prendre des photos avant et apres mon intervention
**Afin de** documenter le travail effectue et prouver la realisation

## Contexte

Les photos avant/apres sont essentielles pour:
- Prouver le travail effectue au client
- Documenter l'etat initial (litiges)
- Montrer la qualite du travail (portfolio)
- Suivi des chantiers dans le temps

## Criteres d'acceptation

- [ ] Bouton photo dans page intervention
- [ ] Choix: Avant / Apres / Pendant
- [ ] Geolocalisation automatique (EXIF + BDD)
- [ ] Horodatage automatique
- [ ] Preview avant upload
- [ ] Compression automatique (qualite/taille)
- [ ] Upload differe si offline (queue)
- [ ] Galerie par intervention
- [ ] Comparaison avant/apres cote-a-cote
- [ ] Export pour client (watermark optionnel)

## Fichiers concernes

- `packages/database/prisma/schema.prisma` (Photo model)
- `apps/api/src/modules/photos/` (nouveau)
- `apps/pwa/src/components/PhotoCapture.tsx` (nouveau)
- `apps/pwa/src/components/PhotoGallery.tsx` (nouveau)
- `apps/pwa/src/services/photo.service.ts` (nouveau)
