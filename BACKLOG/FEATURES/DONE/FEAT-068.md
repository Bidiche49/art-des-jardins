# FEAT-068: Scan QR code chantier

**Type:** Feature
**Statut:** Pret
**Priorite:** Moyenne
**Complexite:** S
**Tags:** ux, pwa, mobile
**Date creation:** 2026-02-03
**Phase:** 14

---

## Description

Generer un QR code unique par chantier que l'employe peut scanner pour acceder directement aux informations.

## User Story

**En tant que** employe
**Je veux** scanner un QR code en arrivant sur un chantier
**Afin de** acceder immediatement aux informations sans chercher

## Contexte

Actuellement pour voir un chantier:
1. Ouvrir l'app
2. Aller dans Interventions ou Chantiers
3. Chercher le bon chantier
4. Ouvrir

Avec QR code:
1. Scanner le QR (affiche sur le devis/fiche chantier imprimee)
2. Arrive directement sur le chantier

## Criteres d'acceptation

- [ ] Generation QR code unique par chantier
- [ ] QR code inclus dans PDF devis/fiche chantier
- [ ] Scanner integre dans la PWA (camera)
- [ ] Scan ouvre directement la page chantier
- [ ] Fonctionne offline (QR contient l'ID, pas d'URL externe)
- [ ] Option imprimer QR code separement (etiquette)
- [ ] Historique des scans (qui, quand)

## Fichiers concernes

- `apps/api/src/modules/chantiers/qrcode.service.ts` (nouveau)
- `apps/pwa/src/components/QRScanner.tsx` (nouveau)
- `apps/pwa/src/pages/scan/index.tsx` (nouveau)
- `apps/api/src/modules/pdf/` (ajout QR dans templates)

## Analyse / Approche

Format QR code:
```
aej://chantier/{uuid}
```

`aej://` = schema custom pour l'app (evite URLs externes)

```typescript
// Generation QR
import QRCode from 'qrcode';

async generateChantierQR(chantierId: string): Promise<Buffer> {
  const data = `aej://chantier/${chantierId}`;
  return QRCode.toBuffer(data, {
    errorCorrectionLevel: 'M',
    width: 200,
    margin: 2,
  });
}

// Scanner PWA
import { Html5Qrcode } from 'html5-qrcode';

const onScan = (decodedText: string) => {
  const match = decodedText.match(/^aej:\/\/chantier\/(.+)$/);
  if (match) {
    navigate(`/chantiers/${match[1]}`);
  }
};
```

## Tests de validation

- [ ] QR genere pour chaque chantier
- [ ] QR present dans PDF
- [ ] Scanner detecte le QR
- [ ] Navigation vers bon chantier
- [ ] Fonctionne offline
