# FEAT-117: Section credit d'impot / CESU sur pages entretien

**Type:** Feature
**Statut:** Fait
**Priorite:** Haute
**Complexite:** S
**Tags:** vitrine, seo, contenu, conversion
**Date creation:** 2026-02-13

---

## Description

Les particuliers peuvent beneficier d'un **credit d'impot de 50%** pour les travaux de jardinage (tonte, taille, desherbage) via le dispositif des services a la personne (CESU). C'est un **argument de vente majeur** que le site ne mentionne absolument pas. Les concurrents qui le mettent en avant ont un avantage conversion significatif.

Ce sujet est aussi un excellent mot-cle SEO : "credit impot jardinage", "CESU jardinier", "avantage fiscal entretien jardin".

## User Story

**En tant que** particulier soucieux de mon budget
**Je veux** savoir si je peux beneficier d'une reduction fiscale
**Afin de** m'engager plus facilement pour un contrat d'entretien

## Fichiers concernes

- `apps/vitrine/src/app/entretien-jardin-angers/page.tsx` - Ajouter section
- `apps/vitrine/src/lib/services-data.ts` - Enrichir la FAQ entretien
- `apps/vitrine/src/app/services/[slug]/page.tsx` - Afficher la section pour le service entretien
- Potentiellement un article blog (FEAT-113)

## Approche

### 1. Section dediee sur les pages entretien
```tsx
<section className="py-16 bg-blue-50">
  <div className="container-custom max-w-4xl">
    <h2 className="text-3xl font-bold mb-6">
      Credit d'impot : 50% de reduction sur l'entretien de jardin
    </h2>
    <div className="prose prose-lg text-gray-600">
      <p>
        Les travaux d'entretien de jardin realises par un professionnel agree
        ouvrent droit a un <strong>credit d'impot de 50%</strong> dans le cadre
        des services a la personne (article 199 sexdecies du CGI).
      </p>
      <p><strong>Exemple :</strong> Pour un contrat annuel de 1 200€,
      vous ne payez reellement que 600€ apres credit d'impot.</p>
    </div>
    <!-- Tableau recapitulatif -->
    <div className="grid md:grid-cols-3 gap-4 mt-8">
      <div className="bg-white rounded-xl p-6 text-center">
        <p className="text-3xl font-bold text-primary-600">50%</p>
        <p className="text-gray-600">Credit d'impot</p>
      </div>
      <div className="bg-white rounded-xl p-6 text-center">
        <p className="text-3xl font-bold text-primary-600">12 000€</p>
        <p className="text-gray-600">Plafond annuel</p>
      </div>
      <div className="bg-white rounded-xl p-6 text-center">
        <p className="text-3xl font-bold text-primary-600">CESU</p>
        <p className="text-gray-600">Paiement accepte</p>
      </div>
    </div>
  </div>
</section>
```

### 2. FAQ enrichie
Ajouter dans la FAQ du service entretien :
- "Puis-je beneficier du credit d'impot pour l'entretien de jardin ?"
- "Quels travaux sont eligibles au credit d'impot jardinage ?"
- "Acceptez-vous les CESU ?"

### 3. Travaux eligibles a mentionner
- Tonte de pelouse
- Taille de haie (< 3.5m)
- Desherbage
- Ramassage de feuilles
- Bechage
- Debroussaillage

### 4. Travaux NON eligibles (attention)
- Elagage (arbres > 3.5m)
- Abattage
- Amenagement paysager / creation

**Pre-requis** : Verifier que l'entreprise est bien agreee services a la personne (ou faire la demande d'agrement).

## Criteres d'acceptation

- [ ] Section credit d'impot visible sur les pages entretien
- [ ] Montant et conditions correctes (verifier la legislation 2026)
- [ ] FAQ enrichie avec questions fiscales
- [ ] Distinction claire entre travaux eligibles et non eligibles
- [ ] CTA renforce ("Profitez de 50% de credit d'impot")

## Tests de validation

- [ ] Informations fiscales verifiees et a jour
- [ ] Section affichee uniquement sur les pages entretien (pas elagage/abattage)
- [ ] Responsive mobile
