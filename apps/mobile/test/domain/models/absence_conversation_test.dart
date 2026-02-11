import 'package:art_et_jardin/domain/enums/absence_type.dart';
import 'package:art_et_jardin/domain/enums/notification_type.dart';
import 'package:art_et_jardin/domain/enums/sender_type.dart';
import 'package:art_et_jardin/domain/models/absence.dart';
import 'package:art_et_jardin/domain/models/conversation.dart';
import 'package:art_et_jardin/domain/models/in_app_notification.dart';
import 'package:art_et_jardin/domain/models/message.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  Map<String, dynamic> fullAbsenceJson() => {
        'id': 'a1-uuid',
        'userId': 'u1-uuid',
        'dateDebut': '2026-02-01T00:00:00.000Z',
        'dateFin': '2026-02-05T00:00:00.000Z',
        'type': 'conge',
        'motif': null,
        'validee': true,
        'createdAt': '2026-01-15T10:30:00.000Z',
        'updatedAt': '2026-01-15T10:30:00.000Z',
      };

  Map<String, dynamic> fullConversationJson() => {
        'id': 'conv1-uuid',
        'clientId': 'c1-uuid',
        'chantierId': 'ch1-uuid',
        'subject': 'Question devis',
        'lastMessageAt': '2026-01-15T10:30:00.000Z',
        'unreadByClient': false,
        'unreadByAdmin': true,
        'createdAt': '2026-01-15T10:30:00.000Z',
        'updatedAt': '2026-01-15T10:30:00.000Z',
      };

  Map<String, dynamic> fullMessageJson() => {
        'id': 'msg1-uuid',
        'conversationId': 'conv1-uuid',
        'senderType': 'client',
        'senderId': 'c1-uuid',
        'content': 'Bonjour, quand commencez-vous ?',
        'attachments': ['doc.pdf'],
        'readAt': null,
        'createdAt': '2026-01-15T10:30:00.000Z',
      };

  Map<String, dynamic> fullNotificationJson() => {
        'id': 'n1-uuid',
        'userId': 'u1-uuid',
        'type': 'action_required',
        'title': 'Nouveau devis a valider',
        'message': 'Le client Martin attend votre retour.',
        'link': '/devis/d1-uuid',
        'readAt': null,
        'createdAt': '2026-01-15T10:30:00.000Z',
      };

  group('Absence', () {
    test('fromJson -> toJson round-trip', () {
      final a = Absence.fromJson(fullAbsenceJson());
      final json = a.toJson();
      final a2 = Absence.fromJson(json);
      expect(a2, a);
    });

    test('fromJson with API JSON snapshot', () {
      final a = Absence.fromJson(fullAbsenceJson());
      expect(a.type, AbsenceType.conge);
      expect(a.validee, true);
    });

    test('fromJson without motif (nullable) -> parse OK', () {
      final json = fullAbsenceJson()..['motif'] = null;
      final a = Absence.fromJson(json);
      expect(a.motif, isNull);
    });
  });

  group('Conversation', () {
    test('fromJson -> toJson round-trip', () {
      final conv = Conversation.fromJson(fullConversationJson());
      final json = conv.toJson();
      final conv2 = Conversation.fromJson(json);
      expect(conv2, conv);
    });

    test('fromJson with API JSON snapshot', () {
      final conv = Conversation.fromJson(fullConversationJson());
      expect(conv.subject, 'Question devis');
      expect(conv.unreadByAdmin, true);
    });
  });

  group('Message', () {
    test('fromJson -> toJson round-trip', () {
      final msg = Message.fromJson(fullMessageJson());
      final json = msg.toJson();
      final msg2 = Message.fromJson(json);
      expect(msg2, msg);
    });

    test('fromJson with API JSON snapshot', () {
      final msg = Message.fromJson(fullMessageJson());
      expect(msg.senderType, SenderType.client);
      expect(msg.content, 'Bonjour, quand commencez-vous ?');
      expect(msg.attachments, ['doc.pdf']);
    });
  });

  group('InAppNotification', () {
    test('fromJson -> toJson round-trip', () {
      final notif = InAppNotification.fromJson(fullNotificationJson());
      final json = notif.toJson();
      final notif2 = InAppNotification.fromJson(json);
      expect(notif2, notif);
    });

    test('fromJson with API JSON snapshot', () {
      final notif = InAppNotification.fromJson(fullNotificationJson());
      expect(notif.type, NotificationType.actionRequired);
      expect(notif.title, 'Nouveau devis a valider');
      expect(notif.link, '/devis/d1-uuid');
    });
  });
}
