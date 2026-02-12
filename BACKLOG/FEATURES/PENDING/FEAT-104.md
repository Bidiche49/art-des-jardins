# FEAT-104: Configurer formulaire contact Web3Forms

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** vitrine, api, ui
**Date creation:** 2026-02-12

---

## Description

Le formulaire de contact de la vitrine utilise Web3Forms pour envoyer les emails sans backend. La cle API n'est pas encore configuree — le formulaire ne fonctionne pas actuellement.

## User Story

**En tant que** prospect visitant le site Art des Jardins
**Je veux** envoyer une demande de devis ou un message via le formulaire de contact
**Afin de** obtenir un rendez-vous ou des informations sur les prestations

## Criteres d'acceptation

- [ ] Compte Web3Forms cree sur https://web3forms.com/ avec artdesjardins49@gmail.com
- [ ] Cle API (access_key) recuperee depuis le dashboard Web3Forms
- [ ] Variable d'environnement `NEXT_PUBLIC_WEB3FORMS_KEY` configuree
- [ ] Formulaire de contact envoie un email a artdesjardins49@gmail.com
- [ ] Message de confirmation affiche apres envoi reussi
- [ ] Message d'erreur affiche en cas d'echec
- [ ] Protection anti-spam (honeypot Web3Forms) active
- [ ] Tester un envoi reel et verifier la reception dans la boite mail

## Fichiers concernes

- `apps/vitrine/src/components/ContactForm.tsx` (utilise deja Web3Forms)
- `apps/vitrine/.env.local` (ou `.env.production`) pour la cle
- Cloudflare Pages environment variables (pour prod)

## Analyse / Approche

### Etapes

1. **Creer le compte** : https://web3forms.com/ → "Create your Access Key" avec artdesjardins49@gmail.com
2. **Recuperer la cle** : copier l'access_key depuis le mail de confirmation ou le dashboard
3. **Configurer en local** :
   ```bash
   echo "NEXT_PUBLIC_WEB3FORMS_KEY=votre-cle-ici" >> apps/vitrine/.env.local
   ```
4. **Verifier le composant ContactForm.tsx** : s'assurer qu'il utilise `process.env.NEXT_PUBLIC_WEB3FORMS_KEY`
5. **Tester** : lancer la vitrine en dev, envoyer un message test
6. **Configurer en prod** : ajouter la variable dans Cloudflare Pages > Settings > Environment variables

### Notes techniques

- Web3Forms plan gratuit = 250 soumissions/mois (largement suffisant pour demarrer)
- Pas de backend necessaire, tout se fait cote client
- Le honeypot anti-spam est integre dans Web3Forms (champ cache `botcheck`)

## Tests de validation

- [ ] `grep NEXT_PUBLIC_WEB3FORMS_KEY apps/vitrine/.env.local` retourne la cle
- [ ] En dev : soumettre le formulaire → email recu dans artdesjardins49@gmail.com
- [ ] Champs obligatoires valides (nom, email, message)
- [ ] Message de succes affiche apres soumission
- [ ] Gestion d'erreur si la cle est invalide
- [ ] Build OK : `cd apps/vitrine && pnpm build`
