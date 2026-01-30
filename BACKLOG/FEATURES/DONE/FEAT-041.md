# FEAT-041: Messagerie client-entreprise

**Type:** Feature
**Statut:** A faire
**Priorite:** Moyenne
**Complexite:** L
**Tags:** ui, api, portail-client, messaging
**Date creation:** 2026-01-30

---

## Description

Système de messagerie intégré permettant aux clients d'échanger avec l'entreprise directement depuis le portail. Conversations liées aux chantiers ou questions générales.

---

## User Story

**En tant que** client connecté au portail
**Je veux** envoyer des messages à l'entreprise et recevoir des réponses
**Afin de** communiquer facilement sans passer par email ou téléphone

---

## Criteres d'acceptation

- [ ] Page `/client/messages` listant les conversations
- [ ] Page `/client/messages/:id` pour une conversation
- [ ] Création nouvelle conversation (sujet libre ou lié à un chantier)
- [ ] Envoi de messages texte
- [ ] Pièces jointes (photos, documents)
- [ ] Indicateur messages non lus
- [ ] Notification push pour nouveau message
- [ ] Côté admin : vue des conversations dans la PWA métier
- [ ] Endpoints API CRUD conversations et messages
- [ ] Tests unitaires et e2e
- [ ] Tests de non-regression passes

---

## Fichiers concernes

- `packages/database/prisma/schema.prisma` (modèles Conversation, Message)
- `apps/api/src/modules/messaging/`
- `apps/pwa/src/pages/client/MessagesList.tsx`
- `apps/pwa/src/pages/client/Conversation.tsx`
- `apps/pwa/src/pages/Messages.tsx` (côté admin)
- `apps/pwa/src/components/messaging/`

---

## Approche proposee

1. Modèles Prisma : Conversation (client_id, chantier_id?, subject) et Message (conversation_id, sender_type, content, attachments)
2. Module messaging avec controllers client et admin
3. Upload pièces jointes vers S3
4. Composants chat réutilisables
5. Intégration notifications push

---

## Tests de validation

- [ ] Client peut créer une conversation
- [ ] Messages s'affichent en temps réel
- [ ] Pièces jointes uploadées et téléchargeables
- [ ] Admin voit et répond aux messages
- [ ] Notifications push fonctionnent
- [ ] Historique complet préservé
