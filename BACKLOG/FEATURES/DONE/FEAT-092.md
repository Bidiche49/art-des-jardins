# FEAT-092: [Flutter] Phase 9B - Factures + Signature publique

**Type:** Feature
**Statut:** Fait
**Priorite:** Haute
**Complexite:** M
**Tags:** mobile, flutter, factures, signature
**Date creation:** 2026-02-10

---

## Description

Liste factures read-only avec filtres et detection retard. Page de signature publique de devis (route sans auth).

## User Story

**En tant que** patron
**Je veux** voir les factures et permettre aux clients de signer les devis
**Afin de** suivre la facturation et obtenir les signatures

## Criteres d'acceptation

- [ ] Liste factures avec filtres par statut
- [ ] Detection retard (echeance passee) avec badge
- [ ] Page signature publique /signer/:token (sans auth)
- [ ] Widget Signature pour dessin
- [ ] Checkbox CGV obligatoire
- [ ] Etats : loading, ready, signing, success, error, expired, already_signed
- [ ] Utilise publicDio (pas d'intercepteur auth)
- [ ] `flutter test` passe, `flutter analyze` propre

## Tests obligatoires

### Unit tests FacturesRepository (~8 tests)
- [ ] getAll online -> API + cache
- [ ] getAll offline -> cache
- [ ] Filtre par statut (brouillon, envoyee, payee, annulee)
- [ ] Detection retard : dateEcheance < now + statut != payee
- [ ] Comptage factures en retard
- [ ] Tri par date emission
- [ ] Recherche par numero
- [ ] Total montants par statut

### Unit tests SignatureService (~12 tests)
- [ ] loadDevis(token) -> GET /signature/:token OK
- [ ] loadDevis(token invalide) -> erreur
- [ ] loadDevis(token expire) -> erreur specifique 'expired'
- [ ] loadDevis(devis deja signe) -> erreur specifique 'already_signed'
- [ ] signDevis(token, signatureBase64) -> POST OK
- [ ] signDevis sans CGV acceptees -> erreur
- [ ] signDevis avec signature vide -> erreur
- [ ] Utilise publicDio (verifie pas d'auth header)
- [ ] Etat loading pendant chargement
- [ ] Etat ready apres chargement OK
- [ ] Etat signing pendant envoi signature
- [ ] Etat success apres signature OK

### Widget tests FacturesListPage (~6 tests)
- [ ] Affiche liste avec numero, montant, statut
- [ ] Badge retard rouge sur factures en retard
- [ ] Filtre par statut fonctionne
- [ ] Montant formate en EUR
- [ ] Liste vide -> empty state
- [ ] Tap sur facture -> detail (ou rien si read-only)

### Widget tests SignerDevisPage (~10 tests)
- [ ] Loading : spinner affiche
- [ ] Ready : devis affiche (numero, client, lignes, totaux)
- [ ] Lignes devis affichees correctement
- [ ] Totaux (HT, TVA, TTC) affiches
- [ ] Widget Signature pour dessin visible
- [ ] Checkbox CGV non cochee par defaut
- [ ] Bouton signer desactive si CGV non cochee
- [ ] Bouton signer active si CGV cochee + signature dessinee
- [ ] Success : message de confirmation
- [ ] Expired : message d'expiration

**Total attendu : ~36 tests**

## Fichiers concernes

- `lib/features/factures/`
- `lib/features/signature/`
