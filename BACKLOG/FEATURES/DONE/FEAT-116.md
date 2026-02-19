# FEAT-116: Bouton WhatsApp Business flottant

**Type:** Feature
**Statut:** Fait
**Priorite:** Moyenne
**Complexite:** XS
**Tags:** vitrine, ui, conversion
**Date creation:** 2026-02-13

---

## Description

WhatsApp est le canal de communication prefere de nombreux particuliers pour contacter un artisan. Un bouton WhatsApp flottant permet de demarrer une conversation instantanee, plus naturelle qu'un formulaire email. Le taux de conversion via WhatsApp est generalement 2-3x superieur au formulaire classique pour les artisans.

## User Story

**En tant que** particulier sur mobile
**Je veux** contacter le paysagiste via WhatsApp
**Afin de** avoir une reponse rapide et envoyer facilement des photos

## Fichiers concernes

- Nouveau : `apps/vitrine/src/components/ui/WhatsAppButton.tsx`
- `apps/vitrine/src/app/layout.tsx` - Inclure le composant

## Approche

```tsx
export function WhatsAppButton() {
  const phone = '33781160737'; // sans + ni espaces
  const message = encodeURIComponent(
    'Bonjour, je souhaite un devis pour un projet de jardin. Pouvez-vous me contacter ?'
  );
  const url = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 bg-[#25D366] text-white rounded-full p-3 shadow-lg hover:bg-[#20BA5C] transition-colors"
      aria-label="Contacter via WhatsApp"
    >
      <WhatsAppIcon className="w-6 h-6" />
    </a>
  );
}
```

- **Position** : fixed, bottom-left (pour ne pas chevaucher le bouton Appeler en bottom-right)
- **Visibilite** : toujours visible (desktop + mobile)
- **Couleur** : vert WhatsApp officiel (#25D366)
- **Pre-rempli** : message d'introduction automatique
- **Pre-requis** : Verifier que le numero a un compte WhatsApp Business

## Criteres d'acceptation

- [ ] Bouton WhatsApp visible sur toutes les pages
- [ ] Clic ouvre WhatsApp avec message pre-rempli
- [ ] Fonctionne sur mobile (ouvre l'app) et desktop (ouvre WhatsApp Web)
- [ ] Ne chevauche pas les autres boutons flottants
- [ ] aria-label pour accessibilite

## Tests de validation

- [ ] Test sur mobile (ouverture de l'app WhatsApp)
- [ ] Test sur desktop (ouverture WhatsApp Web)
- [ ] Verifier le message pre-rempli
