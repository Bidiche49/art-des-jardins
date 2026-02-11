import 'package:art_et_jardin/domain/enums/chantier_statut.dart';
import 'package:art_et_jardin/domain/enums/type_prestation.dart';
import 'package:art_et_jardin/domain/models/chantier.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  final now = DateTime.parse('2026-01-15T10:30:00.000Z');

  Map<String, dynamic> fullChantierJson() => {
        'id': 'ch1-uuid',
        'clientId': 'c1-uuid',
        'adresse': '5 avenue de la Gare',
        'codePostal': '49000',
        'ville': 'Angers',
        'latitude': 47.4784,
        'longitude': -0.5632,
        'typePrestation': ['paysagisme', 'entretien'],
        'description': 'Amenagement jardin complet',
        'surface': 150.5,
        'statut': 'en_cours',
        'dateVisite': '2026-01-10T09:00:00.000Z',
        'dateDebut': '2026-01-20T08:00:00.000Z',
        'dateFin': null,
        'responsableId': 'u1-uuid',
        'notes': 'Acces par le portail',
        'photos': ['photo1.jpg', 'photo2.jpg'],
        'deletedAt': null,
        'createdAt': '2026-01-15T10:30:00.000Z',
        'updatedAt': '2026-01-15T10:30:00.000Z',
      };

  group('Chantier', () {
    test('fromJson -> toJson round-trip', () {
      final ch = Chantier.fromJson(fullChantierJson());
      final json = ch.toJson();
      final ch2 = Chantier.fromJson(json);
      expect(ch2, ch);
    });

    test('fromJson with API JSON snapshot', () {
      final ch = Chantier.fromJson(fullChantierJson());
      expect(ch.typePrestation,
          [TypePrestation.paysagisme, TypePrestation.entretien]);
      expect(ch.statut, ChantierStatut.enCours);
      expect(ch.surface, 150.5);
      expect(ch.latitude, 47.4784);
    });

    test('fromJson without dateFin (nullable) -> parse OK', () {
      final json = fullChantierJson();
      json['dateFin'] = null;
      final ch = Chantier.fromJson(json);
      expect(ch.dateFin, isNull);
    });

    test('default empty photos list', () {
      final json = fullChantierJson()..remove('photos');
      final ch = Chantier.fromJson(json);
      expect(ch.photos, isEmpty);
    });

    test('default statut is lead', () {
      final ch = Chantier(
        id: 'x',
        clientId: 'c',
        adresse: 'a',
        codePostal: '49000',
        ville: 'Angers',
        description: 'd',
        createdAt: now,
        updatedAt: now,
      );
      expect(ch.statut, ChantierStatut.lead);
    });
  });
}
