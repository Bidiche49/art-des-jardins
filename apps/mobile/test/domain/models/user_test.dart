import 'package:art_et_jardin/domain/enums/user_role.dart';
import 'package:art_et_jardin/domain/models/user.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  final now = DateTime.parse('2026-01-15T10:30:00.000Z');

  Map<String, dynamic> fullUserJson() => {
        'id': '550e8400-e29b-41d4-a716-446655440000',
        'email': 'patron@artjardin.fr',
        'nom': 'Tardy',
        'prenom': 'Nicolas',
        'telephone': '0601020304',
        'role': 'patron',
        'actif': true,
        'avatarUrl': 'https://cdn.example.com/avatar.jpg',
        'derniereConnexion': '2026-01-15T10:30:00.000Z',
        'onboardingCompleted': true,
        'onboardingStep': 3,
        'hourlyRate': 45.0,
        'createdAt': '2026-01-15T10:30:00.000Z',
        'updatedAt': '2026-01-15T10:30:00.000Z',
      };

  User fullUser() => User(
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'patron@artjardin.fr',
        nom: 'Tardy',
        prenom: 'Nicolas',
        telephone: '0601020304',
        role: UserRole.patron,
        actif: true,
        avatarUrl: 'https://cdn.example.com/avatar.jpg',
        derniereConnexion: now,
        onboardingCompleted: true,
        onboardingStep: 3,
        hourlyRate: 45.0,
        createdAt: now,
        updatedAt: now,
      );

  group('User', () {
    test('fromJson -> toJson round-trip', () {
      final user = User.fromJson(fullUserJson());
      final json = user.toJson();
      final user2 = User.fromJson(json);
      expect(user2, user);
    });

    test('fromJson with API JSON snapshot', () {
      final user = User.fromJson(fullUserJson());
      expect(user.id, '550e8400-e29b-41d4-a716-446655440000');
      expect(user.email, 'patron@artjardin.fr');
      expect(user.nom, 'Tardy');
      expect(user.prenom, 'Nicolas');
      expect(user.role, UserRole.patron);
      expect(user.actif, true);
      expect(user.hourlyRate, 45.0);
    });

    test('copyWith changes only specified fields', () {
      final user = fullUser();
      final modified = user.copyWith(nom: 'Dupont');
      expect(modified.nom, 'Dupont');
      expect(modified.prenom, 'Nicolas');
      expect(modified.email, user.email);
    });

    test('equality between identical instances', () {
      final a = fullUser();
      final b = fullUser();
      expect(a, b);
      expect(a.hashCode, b.hashCode);
    });

    test('inequality when a field differs', () {
      final a = fullUser();
      final b = a.copyWith(nom: 'Different');
      expect(a, isNot(b));
    });
  });
}
