# FEAT-074: OCR documents fournisseurs

**Type:** Feature
**Statut:** A faire
**Priorite:** Basse
**Complexite:** L
**Tags:** api, integration, data
**Date creation:** 2026-02-03
**Phase:** 16
**Automatisable:** NON

---

## ⚠️ NON AUTOMATISABLE - COMPTE CLOUD + FACTURATION ⚠️

> **Service cloud payant avec configuration billing requise**
>
> L'OCR de qualite necessite un service cloud payant:
>
> **Google Cloud Vision (recommande):**
> 1. Creer un compte Google Cloud Platform
> 2. Activer la facturation (carte bancaire requise)
> 3. Activer l'API Cloud Vision
> 4. Creer une cle de service (JSON)
> 5. Configurer les quotas et alertes budget
>
> **Couts estimes:**
> - ~1.50€ / 1000 pages scannees
> - Document AI (factures): ~0.10€ / page
>
> **Alternative gratuite (moins precise):**
> - Tesseract.js (local, pas de compte requis)
> - Mais precision nettement inferieure sur factures
>
> **Variables d'environnement:**
> - GOOGLE_APPLICATION_CREDENTIALS (chemin vers JSON)

---

## Description

Scanner et extraire automatiquement les informations des factures fournisseurs et bons de livraison via OCR.

## User Story

**En tant que** patron
**Je veux** scanner mes factures fournisseurs
**Afin de** eviter la saisie manuelle et suivre mes depenses

## Contexte

Les factures fournisseurs (pepinieriste, materiaux, carburant...) arrivent en papier ou PDF. La saisie manuelle est fastidieuse et source d'erreurs.

L'OCR permet d'extraire automatiquement:
- Nom fournisseur
- Date facture
- Numero facture
- Montant HT/TTC/TVA
- Lignes de detail

## Criteres d'acceptation

- [ ] Upload PDF ou image (photo smartphone)
- [ ] Extraction automatique via OCR (Tesseract ou Google Vision)
- [ ] Detection champs structurés (montant, date, numero)
- [ ] Interface de validation/correction
- [ ] Lien avec chantier (imputation)
- [ ] Stockage document original
- [ ] Rapport depenses fournisseurs
- [ ] Export pour comptabilite

## Fichiers concernes

- `apps/api/src/modules/ocr/ocr.service.ts` (nouveau)
- `apps/api/src/modules/suppliers/` (nouveau)
- `apps/pwa/src/pages/depenses/scan.tsx` (nouveau)
- `apps/pwa/src/components/OCRValidation.tsx` (nouveau)

## Analyse / Approche

Options OCR:
1. **Tesseract.js** - Gratuit, local, moins precis
2. **Google Cloud Vision** - Payant, tres precis, structure detectee
3. **AWS Textract** - Payant, specialise factures

Recommandation: Google Cloud Vision avec Document AI pour les factures.

```typescript
interface ExtractedInvoice {
  confidence: number; // 0-1
  vendor: string;
  invoiceNumber: string;
  date: Date;
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  lineItems: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  rawText: string;
  originalFileUrl: string;
}

// Workflow
1. User upload image/PDF
2. Envoi a Google Vision
3. Parsing reponse structuree
4. Affichage formulaire pre-rempli
5. User valide/corrige
6. Sauvegarde en BDD
```

## Tests de validation

- [ ] Upload PDF fonctionne
- [ ] Upload image fonctionne
- [ ] Extraction montants correcte
- [ ] Extraction date correcte
- [ ] Validation UI permet correction
- [ ] Document stocke
