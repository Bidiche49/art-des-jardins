# FEAT-071-D: Service calcul rentabilite chantier

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** api, data
**Date creation:** 2026-02-03
**Parent:** FEAT-071
**Depend de:** FEAT-071-A, FEAT-071-B, FEAT-071-C

---

## Description

Creer le service de calcul de rentabilite qui agregue les donnees (heures, materiaux, devis) et calcule la marge brute et le pourcentage. Inclut les alertes sur seuils configurables.

## Scope limite

- Service RentabiliteService
- Endpoint GET /api/v1/chantiers/:id/rentabilite
- Endpoint GET /api/v1/rentabilite/rapport (par periode)
- Configuration seuils alertes
- Pas d'interface PWA dans ce ticket

## Criteres d'acceptation

- [ ] Calcul cout heures = somme(heures * taux horaire employe)
- [ ] Calcul cout materiaux = somme(totalCost MaterialUsage)
- [ ] Calcul marge = montant devis HT - cout total
- [ ] Calcul pourcentage marge = (marge / devis HT) * 100
- [ ] Status: profitable (>30%), limite (15-30%), perte (<15%)
- [ ] Endpoint rentabilite par chantier
- [ ] Endpoint rapport par periode (date debut, date fin)
- [ ] Tests unitaires calculs

## Fichiers concernes

- `apps/api/src/modules/rentabilite/` (nouveau module)
  - `rentabilite.module.ts`
  - `rentabilite.controller.ts`
  - `rentabilite.service.ts`
  - `dto/rentabilite.dto.ts`
  - `dto/rapport-filter.dto.ts`

## Analyse technique

```typescript
// rentabilite.dto.ts
export interface RentabiliteDto {
  chantierId: string;
  chantierNom: string;
  prevu: {
    montantHT: number;
    heuresEstimees: number | null;
  };
  reel: {
    heures: number;
    coutHeures: number;
    coutMateriaux: number;
    coutTotal: number;
  };
  marge: {
    montant: number;
    pourcentage: number;
  };
  status: 'profitable' | 'limite' | 'perte';
}

// Service
async calculerRentabilite(chantierId: string): Promise<RentabiliteDto> {
  // 1. Recuperer le chantier avec son devis
  // 2. Recuperer toutes les TimeEntry des interventions du chantier
  // 3. Pour chaque TimeEntry, multiplier heures * user.hourlyRate
  // 4. Recuperer tous les MaterialUsage du chantier
  // 5. Sommer les couts
  // 6. Calculer marge et pourcentage
  // 7. Determiner status selon seuils
}

// Seuils configurables (env ou settings)
const SEUILS = {
  PROFITABLE: 30,  // marge > 30%
  LIMITE: 15,      // 15% < marge < 30%
  // marge < 15% = perte
};
```

## SECTION AUTOMATISATION

**Score:** 80/100
**Automatisable:** OUI

### Raison du score
- Logique metier bien definie
- Calculs mathematiques verifiables
- Dependances claires (TimeEntry, MaterialUsage, Devis)

### Prompt d'execution

```
TICKET: FEAT-071-D - Service calcul rentabilite

PREREQUIS: FEAT-071-A, B, C doivent etre termines

MISSION: Creer le service de calcul de rentabilite par chantier

ETAPES:
1. Creer le dossier apps/api/src/modules/rentabilite/
2. Creer rentabilite.module.ts (importer PrismaModule)
3. Creer les DTOs:
   - rentabilite.dto.ts (structure reponse)
   - rapport-filter.dto.ts (dateDebut, dateFin optionnels)
4. Creer rentabilite.service.ts avec:
   - calculerRentabilite(chantierId): RentabiliteDto
     * Recuperer chantier + devis
     * Agreger TimeEntry de toutes les interventions
     * Calculer cout heures (heures * user.hourlyRate)
     * Agreger MaterialUsage
     * Calculer marge et pourcentage
     * Determiner status (profitable/limite/perte)
   - genererRapport(dateDebut?, dateFin?): RentabiliteDto[]
     * Filtrer chantiers par periode
     * Calculer rentabilite pour chaque chantier
5. Creer rentabilite.controller.ts:
   - GET /api/v1/chantiers/:chantierId/rentabilite
   - GET /api/v1/rentabilite/rapport?dateDebut=&dateFin=
6. Enregistrer le module
7. Ecrire les tests unitaires (calculs mathematiques)
8. Executer: pnpm --filter @art-et-jardin/api test rentabilite

SEUILS:
- profitable: marge > 30%
- limite: 15% <= marge <= 30%
- perte: marge < 15%

VALIDATION:
- Calculs mathematiques corrects
- Tests passent
- Endpoints repondent avec bonne structure
```

### Criteres de succes automatises

- [ ] Module rentabilite cree et enregistre
- [ ] `pnpm --filter @art-et-jardin/api test rentabilite` passe
- [ ] GET /chantiers/:id/rentabilite retourne la structure RentabiliteDto

## Tests de validation

- [ ] Marge = devisHT - (coutHeures + coutMateriaux)
- [ ] Pourcentage = (marge / devisHT) * 100
- [ ] Status 'profitable' si marge > 30%
- [ ] Status 'limite' si 15% <= marge <= 30%
- [ ] Status 'perte' si marge < 15%
- [ ] Rapport filtre par dates
- [ ] Gestion chantier sans devis (marge = null ou 0)
