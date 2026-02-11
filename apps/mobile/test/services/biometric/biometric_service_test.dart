import 'package:flutter_test/flutter_test.dart';
import 'package:local_auth/local_auth.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/data/local/preferences/app_preferences.dart';
import 'package:art_et_jardin/services/biometric/biometric_service.dart';

class MockLocalAuthentication extends Mock implements LocalAuthentication {}

class MockAppPreferences extends Mock implements AppPreferences {}

void main() {
  late MockLocalAuthentication mockAuth;
  late MockAppPreferences mockPrefs;
  late BiometricService service;

  setUpAll(() {
    registerFallbackValue(const AuthenticationOptions());
  });

  setUp(() {
    mockAuth = MockLocalAuthentication();
    mockPrefs = MockAppPreferences();
    service = BiometricService(auth: mockAuth, preferences: mockPrefs);
  });

  void stubAuthenticate(bool result) {
    when(() => mockAuth.authenticate(
          localizedReason: any(named: 'localizedReason'),
          options: any(named: 'options'),
        )).thenAnswer((_) async => result);
  }

  group('BiometricService', () {
    test('isAvailable returns true when device supports biometrics', () async {
      when(() => mockAuth.canCheckBiometrics).thenAnswer((_) async => true);
      when(() => mockAuth.isDeviceSupported()).thenAnswer((_) async => true);

      expect(await service.isAvailable(), isTrue);
    });

    test('isAvailable returns false when no biometric hardware', () async {
      when(() => mockAuth.canCheckBiometrics).thenAnswer((_) async => false);
      when(() => mockAuth.isDeviceSupported()).thenAnswer((_) async => true);

      expect(await service.isAvailable(), isFalse);
    });

    test('isAvailable returns false when device not supported', () async {
      when(() => mockAuth.canCheckBiometrics).thenAnswer((_) async => true);
      when(() => mockAuth.isDeviceSupported()).thenAnswer((_) async => false);

      expect(await service.isAvailable(), isFalse);
    });

    test('authenticate success returns true', () async {
      stubAuthenticate(true);

      expect(await service.authenticate(), isTrue);
    });

    test('authenticate user cancel returns false', () async {
      stubAuthenticate(false);

      expect(await service.authenticate(), isFalse);
    });

    test('getBiometricType returns face when available', () async {
      when(() => mockAuth.getAvailableBiometrics())
          .thenAnswer((_) async => [BiometricType.face, BiometricType.fingerprint]);

      expect(await service.getBiometricType(), BiometricType.face);
    });

    test('getBiometricType returns fingerprint when face not available',
        () async {
      when(() => mockAuth.getAvailableBiometrics())
          .thenAnswer((_) async => [BiometricType.fingerprint]);

      expect(await service.getBiometricType(), BiometricType.fingerprint);
    });

    test('getBiometricType returns null when no biometrics', () async {
      when(() => mockAuth.getAvailableBiometrics())
          .thenAnswer((_) async => []);

      expect(await service.getBiometricType(), isNull);
    });

    test('isConfigured checks preferences', () {
      when(() => mockPrefs.biometricConfigured).thenReturn(true);
      expect(service.isConfigured, isTrue);

      when(() => mockPrefs.biometricConfigured).thenReturn(false);
      expect(service.isConfigured, isFalse);
    });

    test('setConfigured persists choice', () async {
      when(() => mockPrefs.setBiometricConfigured(any()))
          .thenAnswer((_) async => true);

      await service.setConfigured(true);
      verify(() => mockPrefs.setBiometricConfigured(true)).called(1);

      await service.setConfigured(false);
      verify(() => mockPrefs.setBiometricConfigured(false)).called(1);
    });
  });
}
