import 'package:art_et_jardin/domain/enums/photo_type.dart';
import 'package:art_et_jardin/domain/models/intervention.dart';
import 'package:art_et_jardin/domain/models/photo.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  Map<String, dynamic> fullInterventionJson() => {
        'id': 'i1-uuid',
        'chantierId': 'ch1-uuid',
        'employeId': 'u1-uuid',
        'date': '2026-01-20T00:00:00.000Z',
        'heureDebut': '2026-01-20T08:00:00.000Z',
        'heureFin': '2026-01-20T12:00:00.000Z',
        'dureeMinutes': 240,
        'description': 'Tonte et debroussaillage',
        'photos': ['photo1.jpg'],
        'notes': 'Terrain humide',
        'valide': true,
        'externalCalendarEventId': null,
        'deletedAt': null,
        'createdAt': '2026-01-15T10:30:00.000Z',
        'updatedAt': '2026-01-15T10:30:00.000Z',
      };

  Map<String, dynamic> fullPhotoJson() => {
        'id': 'p1-uuid',
        'interventionId': 'i1-uuid',
        'type': 'BEFORE',
        'filename': 'avant_jardin.jpg',
        's3Key': 'photos/2026/01/avant_jardin.jpg',
        'mimeType': 'image/jpeg',
        'size': 2048000,
        'width': 1920,
        'height': 1080,
        'latitude': 47.4784,
        'longitude': -0.5632,
        'takenAt': '2026-01-20T08:05:00.000Z',
        'uploadedAt': '2026-01-20T08:10:00.000Z',
        'uploadedBy': 'u1-uuid',
      };

  group('Intervention', () {
    test('fromJson -> toJson round-trip', () {
      final i = Intervention.fromJson(fullInterventionJson());
      final json = i.toJson();
      final i2 = Intervention.fromJson(json);
      expect(i2, i);
    });

    test('fromJson with API JSON snapshot', () {
      final i = Intervention.fromJson(fullInterventionJson());
      expect(i.employeId, 'u1-uuid');
      expect(i.dureeMinutes, 240);
      expect(i.valide, true);
    });

    test('fromJson without photos (empty list) -> parse OK', () {
      final json = fullInterventionJson()..remove('photos');
      final i = Intervention.fromJson(json);
      expect(i.photos, isEmpty);
    });

    test('fromJson without heureFin (nullable)', () {
      final json = fullInterventionJson()..['heureFin'] = null;
      final i = Intervention.fromJson(json);
      expect(i.heureFin, isNull);
    });
  });

  group('Photo', () {
    test('fromJson -> toJson round-trip', () {
      final photo = Photo.fromJson(fullPhotoJson());
      final json = photo.toJson();
      final photo2 = Photo.fromJson(json);
      expect(photo2, photo);
    });

    test('fromJson with API JSON snapshot', () {
      final photo = Photo.fromJson(fullPhotoJson());
      expect(photo.type, PhotoType.before);
      expect(photo.filename, 'avant_jardin.jpg');
      expect(photo.size, 2048000);
      expect(photo.latitude, 47.4784);
    });

    test('fromJson without lat/long (nullable)', () {
      final json = fullPhotoJson()
        ..['latitude'] = null
        ..['longitude'] = null;
      final photo = Photo.fromJson(json);
      expect(photo.latitude, isNull);
      expect(photo.longitude, isNull);
    });
  });
}
