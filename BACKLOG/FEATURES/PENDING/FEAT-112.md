# FEAT-112: Ajouter 7+ communes peripheriques manquantes

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** M
**Tags:** seo, vitrine, contenu
**Date creation:** 2026-02-13

---

## Description

Le site couvre actuellement 10 communes (Angers + 9 peripheriques). Plusieurs communes importantes de la zone d'intervention (30 km autour d'Angers) manquent. Chaque commune ajoutee genere 4 pages SEO (paysagiste-X, elagage-X, entretien-jardin-X, abattage-X), soit un fort potentiel de trafic longue traine.

## Communes actuelles (10)

Angers, Avrille, Beaucouze, Bouchemaine, Saint-Barthelemy-d'Anjou, Trelaze, Les Ponts-de-Ce, Ecouflant, Cantenay-Epinard, Murs-Erigne

## Communes a ajouter (minimum 7)

| Commune | Code postal | Population | Distance | Justification |
|---------|-------------|------------|----------|---------------|
| **Sainte-Gemmes-sur-Loire** | 49130 | 4 000 | 8 km | Commune residentielle, forte demande paysagiste |
| **Montreuil-Juigne** | 49460 | 8 500 | 8 km | Grande commune, beaucoup de jardins |
| **Saint-Jean-de-Linieres** | 49070 | 2 300 | 10 km | Zone pavillonnaire en expansion |
| **Briollay** | 49125 | 3 000 | 12 km | Commune verte, bords de Sarthe |
| **Savennieres** | 49170 | 1 500 | 12 km | Commune viticole, grands jardins |
| **Sainte-Gemmes-d'Andigne** | 49220 | 2 000 | 15 km | Zone rurale, grands terrains |
| **Saint-Sylvain-d'Anjou** | 49480 | 5 500 | 6 km | Commune residentielle en croissance |
| **Soulaines-sur-Aubance** | 49610 | 3 200 | 12 km | Zone viticole, beaux jardins |
| **Loire-Authion** | 49630 | 16 000 | 15 km | Commune nouvelle, grosse population |
| **Longuenee-en-Anjou** | 49770 | 8 000 | 12 km | Commune nouvelle, beaucoup de pavillons |

## Fichiers concernes

- `apps/vitrine/src/lib/cities-data.ts` - Ajouter les villes avec description, quartiers, contenu specifique

## Approche

Pour chaque commune ajoutee dans `cities-data.ts`, fournir :
1. **slug** : nom en kebab-case sans accents
2. **name** : nom complet avec accents
3. **postalCode** : code postal
4. **population** : estimation
5. **distance** : distance depuis Angers
6. **description** : 2-3 phrases sur la commune (geographie, caractere)
7. **specificContent** : 3 paragraphes uniques decrivant :
   - Les specificites de la commune (sol, climat, vegetation, urbanisme)
   - Les types de jardins et besoins locaux
   - Comment Art des Jardins intervient localement
8. **neighborhoods** : quartiers principaux (si pertinent)

**IMPORTANT** : Le contenu doit etre **UNIQUE par ville**. Pas de copier-coller entre villes. Mentionner des specificites reelles (sol, vegetation, patrimoine).

Les pages seront automatiquement generees par le composant `[serviceCity]/page.tsx` existant.

## Impact SEO

- 7 communes x 4 services = **28 nouvelles pages** indexables
- Chaque page cible un mot-cle longue traine specifique (ex: "paysagiste Montreuil-Juigne")
- Competition quasi nulle sur ces mots-cles locaux

## Criteres d'acceptation

- [ ] Minimum 7 nouvelles communes ajoutees dans cities-data.ts
- [ ] Chaque commune a un contenu unique (description + specificContent)
- [ ] Le build genere les nouvelles pages sans erreur
- [ ] Le sitemap inclut les nouvelles pages
- [ ] Les maillages inter-villes fonctionnent avec les nouvelles villes

## Tests de validation

- [ ] Build production reussit
- [ ] Naviguer vers chaque nouvelle page /[service]-[ville]/
- [ ] Verifier le sitemap XML contient les nouvelles URLs
- [ ] Verifier les meta title/description de chaque page
