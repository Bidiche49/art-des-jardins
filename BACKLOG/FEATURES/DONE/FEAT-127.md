# FEAT-127: Page /faq/ dediee autonome

**Type:** Feature
**Statut:** Fait
**Priorite:** Moyenne
**Complexite:** S
**Tags:** vitrine, seo, ux
**Date creation:** 2026-02-27

---

## Description

Les FAQ sont uniquement embarquees dans la homepage (HomeFAQ avec 7 questions) et dans les pages services (3-4 questions chacune). Il n'existe pas de page `/faq/` autonome.

Une page FAQ dediee :
1. **SEO** : capture les requetes longue traine ("comment choisir paysagiste angers", "prix elagage maine et loire", "quand tailler haie 49")
2. **UX** : point d'entree unique pour toutes les questions
3. **Featured Snippets** : maximise les chances d'apparaitre en position 0 Google

### Structure proposee

```
/faq/
├── Hero: "Questions frequentes"
├── Categories filtrees:
│   ├── General (7 questions homepage)
│   ├── Amenagement (3 questions)
│   ├── Entretien (4 questions + credit impot)
│   ├── Elagage (4 questions)
│   ├── Abattage (4 questions)
│   └── Pratique (devis, zones, paiement, delais)
├── Total: 25-30 questions
├── CTA final
└── Schema FAQPage complet
```

### SEO
- Title: "FAQ Paysagiste Angers - Questions Reponses | Art des Jardins"
- FAQPage schema avec TOUTES les questions
- BreadcrumbList schema
- Liens internes vers services concernes dans chaque reponse

## Criteres d'acceptation
- [ ] Page /faq/ creee avec toutes les FAQ du site
- [ ] Accordeon par categorie
- [ ] FAQPage schema JSON-LD complet
- [ ] Liens internes dans les reponses
- [ ] CTA "Autre question ? Contactez-nous"
- [ ] Lien dans le footer
- [ ] Ajout dans le sitemap

## Fichiers concernes
- Nouveau : `apps/vitrine/src/app/faq/page.tsx`
- `apps/vitrine/src/components/layout/Footer.tsx` (ajouter lien)
- `apps/vitrine/src/app/sitemap.ts`
