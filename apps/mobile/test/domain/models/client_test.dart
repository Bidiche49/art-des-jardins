import 'package:art_et_jardin/domain/enums/client_type.dart';
import 'package:art_et_jardin/domain/models/client.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  final now = DateTime.parse('2026-01-15T10:30:00.000Z');

  Map<String, dynamic> fullClientJson() => {
        'id': 'c1-uuid',
        'type': 'particulier',
        'nom': 'Martin',
        'prenom': 'Jean',
        'raisonSociale': null,
        'email': 'jean@example.com',
        'telephone': '0601020304',
        'telephoneSecondaire': '0701020304',
        'adresse': '12 rue des Fleurs',
        'codePostal': '49000',
        'ville': 'Angers',
        'notes': 'Client fidele',
        'tags': ['vip', 'jardin'],
        'deletedAt': null,
        'createdAt': '2026-01-15T10:30:00.000Z',
        'updatedAt': '2026-01-15T10:30:00.000Z',
      };

  Client fullClient() => Client(
        id: 'c1-uuid',
        type: ClientType.particulier,
        nom: 'Martin',
        prenom: 'Jean',
        email: 'jean@example.com',
        telephone: '0601020304',
        telephoneSecondaire: '0701020304',
        adresse: '12 rue des Fleurs',
        codePostal: '49000',
        ville: 'Angers',
        notes: 'Client fidele',
        tags: ['vip', 'jardin'],
        createdAt: now,
        updatedAt: now,
      );

  group('Client', () {
    test('fromJson -> toJson round-trip', () {
      final client = Client.fromJson(fullClientJson());
      final json = client.toJson();
      final client2 = Client.fromJson(json);
      expect(client2, client);
    });

    test('fromJson with API JSON snapshot', () {
      final client = Client.fromJson(fullClientJson());
      expect(client.nom, 'Martin');
      expect(client.type, ClientType.particulier);
      expect(client.tags, ['vip', 'jardin']);
      expect(client.ville, 'Angers');
    });

    test('fromJson without email (nullable) -> parse OK', () {
      final json = fullClientJson()..remove('raisonSociale');
      final client = Client.fromJson(json);
      expect(client.raisonSociale, isNull);
    });

    test('fromJson without raisonSociale (nullable) -> parse OK', () {
      final json = fullClientJson();
      json['raisonSociale'] = null;
      final client = Client.fromJson(json);
      expect(client.raisonSociale, isNull);
    });

    test('fromJson with extra fields ignores them', () {
      final json = fullClientJson()..['extraField'] = 'ignored';
      final client = Client.fromJson(json);
      expect(client.nom, 'Martin');
    });

    test('copyWith changes only specified fields', () {
      final client = fullClient();
      final modified = client.copyWith(nom: 'Nouveau');
      expect(modified.nom, 'Nouveau');
      expect(modified.prenom, 'Jean');
      expect(modified.email, client.email);
    });

    test('equality between identical instances', () {
      final a = fullClient();
      final b = fullClient();
      expect(a, b);
      expect(a.hashCode, b.hashCode);
    });

    test('inequality when a field differs', () {
      final a = fullClient();
      final b = a.copyWith(ville: 'Paris');
      expect(a, isNot(b));
    });

    test('copyWith null on nullable field', () {
      final client = fullClient();
      final modified = client.copyWith(notes: null);
      expect(modified.notes, isNull);
    });

    test('default empty tags list', () {
      final json = fullClientJson()..remove('tags');
      final client = Client.fromJson(json);
      expect(client.tags, isEmpty);
    });
  });
}
