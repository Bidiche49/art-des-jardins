# FEAT-090: [Flutter] Phase 8B - Interventions + Photos

**Type:** Feature
**Statut:** Fait
**Priorite:** Haute
**Complexite:** L
**Tags:** mobile, flutter, crud, interventions, photos, gps, offline
**Date creation:** 2026-02-10

---

## Description

Interventions CRUD avec vue semaine, systeme de capture photo avec GPS, compression en isolate, queue offline pour upload.

## User Story

**En tant que** employe terrain
**Je veux** enregistrer mes interventions avec photos geolocalisees
**Afin de** documenter le travail effectue sur chaque chantier

## Criteres d'acceptation

- [ ] Vue semaine (lundi-dimanche) avec navigation precedent/suivant
- [ ] Creation intervention via modal
- [ ] Capture photo : selecteur type (Avant/Pendant/Apres), camera, GPS
- [ ] Compression photo dans un isolate
- [ ] Online : upload multipart direct
- [ ] Offline : fichier local + metadata dans photo_queue Drift
- [ ] Galerie : GridView avec CachedNetworkImage, filtre par type
- [ ] Comparaison avant/apres side-by-side
- [ ] `flutter test` passe, `flutter analyze` propre

## Tests obligatoires

### Unit tests InterventionsRepository (~12 tests)
- [ ] CRUD online/offline (meme pattern Clients, 12 tests)

### Unit tests PhotoService (~14 tests)
- [ ] capturePhoto retourne le fichier image
- [ ] getGpsCoordinates retourne lat/lng
- [ ] getGpsCoordinates sans permission -> erreur claire
- [ ] compressPhoto reduit la taille (mock isolate)
- [ ] compressPhoto maintient la qualite acceptable
- [ ] uploadPhoto online -> POST multipart OK
- [ ] uploadPhoto offline -> enqueue dans photo_queue
- [ ] photoQueue traite les photos pending au retour online
- [ ] photoQueue retry si upload echoue (max 3)
- [ ] photoQueue supprime fichier local apres upload OK
- [ ] getPhotosForIntervention retourne les bonnes photos
- [ ] filterByType('before') filtre correctement
- [ ] Metadata photo : type, lat, lng, takenAt correctes
- [ ] Transformation date+heure -> ISO datetime pour API

### Unit tests WeekView (~8 tests)
- [ ] Semaine affichee = lundi a dimanche
- [ ] Navigation semaine precedente -> bonnes dates
- [ ] Navigation semaine suivante -> bonnes dates
- [ ] Interventions du jour affichees dans la bonne colonne
- [ ] Jour courant surligné
- [ ] Tap sur jour vide -> ouvre creation
- [ ] Tap sur intervention -> ouvre detail
- [ ] Semaine sans intervention -> affiche vide

### Widget tests (~10 tests)
- [ ] InterventionForm : champs date, duree, type, notes
- [ ] InterventionForm : selection chantier
- [ ] PhotoCapture : selecteur type Avant/Pendant/Apres avec couleurs
- [ ] PhotoGallery : GridView avec photos
- [ ] PhotoGallery : filtre par type
- [ ] PhotoCompare : side-by-side avant/apres
- [ ] Badge nombre de photos sur intervention card
- [ ] Upload indicator visible pendant upload
- [ ] Offline indicator sur photos en attente
- [ ] Empty state quand pas de photos

**Total attendu : ~44 tests**

## Fichiers concernes

- `lib/features/interventions/`
- `lib/services/photo/photo_service.dart`
- `lib/services/photo/photo_queue_service.dart`
