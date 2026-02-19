# FEAT-114: Upload photo dans le formulaire de devis

**Type:** Feature
**Statut:** Fait
**Priorite:** Haute
**Complexite:** M
**Tags:** vitrine, ui, conversion
**Date creation:** 2026-02-13

---

## Description

Les prospects contactent un paysagiste souvent avec un projet en tete et des photos de leur jardin actuel. Permettre l'upload de photos directement dans le formulaire de contact :
- Accelere la qualification du lead
- Permet un devis plus precis des le premier contact
- Reduit les allers-retours par email
- Augmente le taux de conversion (l'utilisateur est plus engage)

## User Story

**En tant que** proprietaire souhaitant un devis
**Je veux** envoyer des photos de mon jardin avec ma demande
**Afin que** le paysagiste comprenne mon projet des le premier contact

## Fichiers concernes

- `apps/vitrine/src/components/ContactForm.tsx`

## Approche

### Option A - Web3Forms avec piece jointe (recommande)
Web3Forms supporte les fichiers joints via `FormData` au lieu de JSON :
```typescript
const formDataObj = new FormData();
formDataObj.append('access_key', key);
formDataObj.append('name', formData.name);
// ... autres champs
for (const file of selectedFiles) {
  formDataObj.append('attachment', file);
}
```

### Interface utilisateur
```tsx
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Photos de votre jardin (optionnel)
  </label>
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
    <input
      type="file"
      accept="image/*"
      multiple
      max={3}
      onChange={handleFileChange}
      className="hidden"
      id="photos"
    />
    <label htmlFor="photos" className="cursor-pointer">
      <CameraIcon />
      <p>Cliquez ou glissez vos photos (max 3, 5MB chacune)</p>
    </label>
    {/* Preview des images selectionnees */}
  </div>
</div>
```

### Contraintes
- Max 3 photos
- Max 5 MB par photo
- Formats acceptes : JPG, PNG, WebP
- Preview miniature avant envoi
- Bouton pour supprimer une photo selectionnee
- Compression cote client si trop lourd (optionnel)

## Criteres d'acceptation

- [ ] Zone d'upload visible dans le formulaire
- [ ] Preview des photos selectionnees
- [ ] Limite de 3 photos et 5 MB/photo
- [ ] Message d'erreur si fichier trop lourd
- [ ] Photos jointes dans l'email recu
- [ ] Fonctionne sur mobile (acces camera)
- [ ] Champ optionnel (le formulaire fonctionne sans photo)

## Tests de validation

- [ ] Upload 1, 2, 3 photos puis envoi
- [ ] Test avec photo trop lourde (> 5 MB)
- [ ] Test sans photo (le formulaire fonctionne)
- [ ] Test sur mobile (prise de photo directe)
- [ ] Verification de la reception des photos par email
