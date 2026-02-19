# FEAT-111: Page "A propos" avec photos equipe et histoire

**Type:** Feature
**Statut:** Fait
**Priorite:** Haute
**Complexite:** M
**Tags:** vitrine, seo, ui, conversion
**Date creation:** 2026-02-13

---

## Description

Le site n'a aucune page "A propos" ou "Qui sommes-nous". Pour un artisan, montrer les visages de l'equipe et raconter l'histoire de l'entreprise est **fondamental pour la confiance**. Google valorise aussi le E-E-A-T (Experience, Expertise) - une page a propos renforce l'autorite.

## User Story

**En tant que** prospect qui compare des paysagistes
**Je veux** voir qui sont les personnes derriere l'entreprise
**Afin de** me sentir en confiance avant de les contacter

## Fichiers concernes

- Nouveau : `apps/vitrine/src/app/a-propos/page.tsx`
- `apps/vitrine/src/components/layout/Header.tsx` - Ajouter lien navigation
- `apps/vitrine/src/app/sitemap.ts` - Ajouter la page
- `apps/vitrine/src/components/layout/Footer.tsx` - Ajouter lien

## Approche

### Structure de la page

1. **Hero** : Photo d'equipe + "Decouvrez l'equipe Art des Jardins"
2. **Section histoire** :
   - Annee de creation
   - Parcours des associes
   - Valeurs de l'entreprise
   - Pourquoi ce metier
3. **Section equipe** :
   - Photo de chaque associe
   - Nom, role, specialite
   - Courte bio (2-3 phrases)
4. **Section chiffres cles** :
   - Annees d'experience cumulees (16 ans)
   - Nombre de chantiers realises
   - Satisfaction client
   - Zone d'intervention
5. **Section valeurs** :
   - Qualite artisanale
   - Respect de l'environnement
   - Proximite et ecoute
   - Prix justes
6. **CTA final** : Devis gratuit

### Metadata SEO
```typescript
export const metadata: Metadata = {
  title: 'A Propos - Votre Equipe Paysagiste',
  description: 'Decouvrez l\'equipe Art des Jardins : deux associes passionnes avec plus de 16 ans d\'experience cumulee en amenagement paysager a Angers.',
};
```

### Navigation
Ajouter "A propos" dans la navigation du header entre "Services" et "Nos zones".

**Pre-requis** : Obtenir les photos de l'equipe, leur bio, les chiffres reels.

## Criteres d'acceptation

- [ ] Page /a-propos/ creee et accessible
- [ ] Lien dans la navigation header et footer
- [ ] Meta title et description optimises
- [ ] Page ajoutee au sitemap
- [ ] Au moins une photo de l'equipe
- [ ] Chiffres cles affiches
- [ ] Schema Person pour chaque membre de l'equipe
- [ ] CTA devis gratuit en fin de page

## Tests de validation

- [ ] Navigation vers la page depuis le header
- [ ] Meta tags corrects dans le code source
- [ ] Page indexable (pas de noindex)
- [ ] Responsivite mobile
