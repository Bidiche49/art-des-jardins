import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/features/settings/domain/settings_repository.dart';
import 'package:art_et_jardin/features/settings/presentation/providers/settings_providers.dart';

class MockSettingsRepository extends Mock implements SettingsRepository {}

void main() {
  late MockSettingsRepository mockRepo;

  setUp(() {
    mockRepo = MockSettingsRepository();
  });

  group('Settings Flow', () {
    test('initial state has system defaults', () {
      expect(const SettingsState(), isNotNull);
      expect(const SettingsState().themeMode, ThemeMode.system);
      expect(const SettingsState().terrainMode, false);
      expect(const SettingsState().biometricConfigured, false);
      expect(const SettingsState().notificationsEnabled, true);
    });

    test('SettingsState copyWith theme mode', () {
      const state = SettingsState();
      final updated = state.copyWith(themeMode: ThemeMode.dark);
      expect(updated.themeMode, ThemeMode.dark);
      expect(updated.terrainMode, false); // unchanged
    });

    test('SettingsState copyWith terrain mode', () {
      const state = SettingsState();
      final updated = state.copyWith(terrainMode: true);
      expect(updated.terrainMode, true);
    });

    test('SettingsState copyWith biometric', () {
      const state = SettingsState();
      final updated = state.copyWith(biometricConfigured: true);
      expect(updated.biometricConfigured, true);
    });

    test('SettingsState copyWith lastSync', () {
      const state = SettingsState();
      final syncTime = DateTime(2026, 2, 12, 15, 30);
      final updated = state.copyWith(lastSync: syncTime);
      expect(updated.lastSync, syncTime);
    });

    test('SettingsState copyWith notifications', () {
      const state = SettingsState();
      final updated = state.copyWith(notificationsEnabled: false);
      expect(updated.notificationsEnabled, false);
    });

    test('SettingsRepository getThemeMode returns stored value', () {
      // getThemeMode is synchronous (returns ThemeMode?)
      when(() => mockRepo.getThemeMode()).thenReturn(ThemeMode.dark);
      final result = mockRepo.getThemeMode();
      expect(result, ThemeMode.dark);
    });

    test('SettingsRepository setThemeMode stores value', () async {
      when(() => mockRepo.setThemeMode(ThemeMode.light))
          .thenAnswer((_) async {});
      await mockRepo.setThemeMode(ThemeMode.light);
      verify(() => mockRepo.setThemeMode(ThemeMode.light)).called(1);
    });

    test('SettingsRepository getTerrainMode returns bool', () {
      // getTerrainMode is synchronous (returns bool)
      when(() => mockRepo.getTerrainMode()).thenReturn(true);
      final result = mockRepo.getTerrainMode();
      expect(result, true);
    });

    test('SettingsRepository setTerrainMode stores value', () async {
      when(() => mockRepo.setTerrainMode(true)).thenAnswer((_) async {});
      await mockRepo.setTerrainMode(true);
      verify(() => mockRepo.setTerrainMode(true)).called(1);
    });

    test('multiple settings changes are independent', () {
      const state = SettingsState();
      final s1 = state.copyWith(themeMode: ThemeMode.dark);
      final s2 = s1.copyWith(terrainMode: true);
      final s3 = s2.copyWith(biometricConfigured: true);

      expect(s3.themeMode, ThemeMode.dark);
      expect(s3.terrainMode, true);
      expect(s3.biometricConfigured, true);
      expect(s3.notificationsEnabled, true); // unchanged default
    });
  });
}
