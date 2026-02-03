# FEAT-076: Signature electronique avancee (eIDAS)

**Type:** Feature
**Statut:** A faire
**Priorite:** Basse
**Complexite:** L
**Tags:** api, integration, security
**Date creation:** 2026-02-03
**Phase:** 16
**Automatisable:** NON

---

## ⚠️ NON AUTOMATISABLE - CONTRAT COMMERCIAL REQUIS ⚠️

> **Souscription a un service de signature electronique payant**
>
> La signature eIDAS qualifiee necessite un prestataire certifie:
>
> **Yousign (recommande, francais):**
> 1. Creer un compte sur https://yousign.com
> 2. Souscrire a une offre (a partir de ~25€/mois)
> 3. Signer le contrat de service
> 4. Obtenir les cles API
>
> **DocuSign (alternative internationale):**
> - Plus cher, processus commercial plus long
>
> **Couts Yousign (indicatifs):**
> - Signature avancee: ~2€/signature
> - Signature qualifiee: ~10€/signature
> - Abonnement mensuel selon volume
>
> **Variables d'environnement:**
> - YOUSIGN_API_KEY
> - YOUSIGN_WEBHOOK_SECRET

---

## Description

Implementer une signature electronique qualifiee conforme eIDAS pour les devis et contrats importants.

## User Story

**En tant que** patron
**Je veux** faire signer electroniquement mes gros devis
**Afin de** avoir une valeur juridique equivalente a la signature manuscrite

## Contexte

FEAT-026/027/028 implementent une signature simple (dessin + OTP). Pour les gros chantiers, une signature qualifiee eIDAS offre:
- Valeur juridique renforcee
- Non-repudiation
- Horodatage certifie
- Archivage legal

Niveaux eIDAS:
1. **Simple**: ce qu'on a deja (dessin + OTP)
2. **Avancee**: identification renforcee (ce ticket)
3. **Qualifiee**: certificat delivre par autorite (via prestataire)

## Criteres d'acceptation

- [ ] Integration prestataire eIDAS (Yousign, DocuSign, Universign)
- [ ] Choix niveau signature par devis
- [ ] Workflow signature avancee:
  - Envoi email avec lien securise
  - Verification identite (SMS OTP + piece identite optionnel)
  - Signature avec certificat du prestataire
  - Horodatage certifie
- [ ] Cachet electronique entreprise (optionnel)
- [ ] Archivage conforme (10 ans minimum)
- [ ] Fichier preuve (audit trail)
- [ ] Verification validite signature

## Fichiers concernes

- `apps/api/src/modules/signature/eidas.service.ts` (nouveau)
- `apps/api/src/modules/signature/providers/` (yousign, docusign...)
- `apps/api/src/modules/devis/devis.service.ts` (modification)
- `apps/pwa/src/pages/devis/[id]/signature-eidas.tsx` (nouveau)

## Analyse / Approche

Recommandation: **Yousign** (francais, tarifs accessibles, API simple)

Tarifs Yousign (indicatifs):
- Signature avancee: ~2€/signature
- Signature qualifiee: ~10€/signature

```typescript
// Integration Yousign
import { YousignClient } from './providers/yousign';

interface EidasSignatureRequest {
  devisId: string;
  level: 'advanced' | 'qualified';
  signers: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
  }[];
  document: Buffer;
}

async initiateEidasSignature(request: EidasSignatureRequest) {
  // 1. Creer procedure Yousign
  const procedure = await this.yousign.createProcedure({
    name: `Devis ${request.devisId}`,
    description: 'Signature devis Art & Jardin',
  });

  // 2. Ajouter document
  const file = await this.yousign.addFile(procedure.id, {
    name: 'devis.pdf',
    content: request.document.toString('base64'),
  });

  // 3. Ajouter signataires
  for (const signer of request.signers) {
    await this.yousign.addMember(procedure.id, {
      ...signer,
      fileObjects: [{
        file: file.id,
        position: '350,50,550,150', // Zone signature
        page: 1,
      }],
    });
  }

  // 4. Demarrer procedure
  await this.yousign.startProcedure(procedure.id);

  return { procedureId: procedure.id };
}
```

Webhooks Yousign pour notifications:
- `procedure.started`
- `member.finished`
- `procedure.finished`
- `procedure.refused`

## Tests de validation

- [ ] Creation procedure Yousign
- [ ] Email envoye au signataire
- [ ] Signature completee correctement
- [ ] Document signe recupere
- [ ] Webhook traite
- [ ] Fichier preuve stocke
