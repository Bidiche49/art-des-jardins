# FEAT-119: Mega-menu services dans le header navigation

**Type:** Feature
**Statut:** A faire
**Priorite:** Basse
**Complexite:** S
**Tags:** vitrine, ui, ux, seo
**Date creation:** 2026-02-13

---

## Description

Le lien "Services" dans la navigation pointe vers `/services` mais ne donne aucune visibilite sur les services disponibles. Un mega-menu (dropdown au survol) affichant les 4 services avec icone et courte description :
- Ameliore la navigation (acces direct)
- Renforce le maillage interne (liens depuis le header)
- Ameliore l'UX (moins de clics)

## User Story

**En tant que** visiteur
**Je veux** voir rapidement tous les services proposes
**Afin de** acceder directement au service qui m'interesse

## Fichiers concernes

- `apps/vitrine/src/components/layout/Header.tsx`

## Approche

Au survol (desktop) ou au clic (mobile) sur "Services", afficher un dropdown :

```
+-------------------------------------------+
| Amenagement paysager    | Entretien       |
| Creation de jardin      | Tonte, taille   |
| sur mesure              | desherbage      |
|                         |                 |
| Elagage                 | Abattage        |
| Taille d'arbres         | Abattage,       |
| professionnelle         | dessouchage     |
+-------------------------------------------+
| > Voir tous nos services                  |
+-------------------------------------------+
```

- Desktop : apparait au hover avec transition
- Mobile : s'integre dans le menu hamburger en accordion
- Chaque service a un lien vers `/services/[slug]/`
- Lien "Voir tous les services" en bas

## Criteres d'acceptation

- [ ] Mega-menu fonctionnel au survol sur desktop
- [ ] Accordion dans le menu mobile
- [ ] Liens vers les 4 pages services
- [ ] Lien vers la page services listing
- [ ] Animation de transition fluide
- [ ] Se ferme quand on clique ailleurs

## Tests de validation

- [ ] Test hover desktop
- [ ] Test clic mobile
- [ ] Navigation vers chaque service
- [ ] Accessibilite clavier (Tab, Enter, Escape)
