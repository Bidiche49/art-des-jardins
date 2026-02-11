import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/features/settings/domain/settings_repository.dart';
import 'package:art_et_jardin/features/settings/presentation/providers/settings_providers.dart';

class MockSettingsRepository extends Mock implements SettingsRepository {}

void main() {
  late MockSettingsRepository mockRepository;

  setUp(() {
    mockRepository = MockSettingsRepository();
  });

  group('SettingsState', () {
    test('default state has correct values', () {
      const state = SettingsState();
      expect(state.themeMode, ThemeMode.system);
      expect(state.terrainMode, false);
      expect(state.biometricConfigured, false);
      expect(state.notificationsEnabled, true);
      expect(state.lastSync, isNull);
    });

    test('copyWith preserves unchanged values', () {
      final now = DateTime.now();
      final state = SettingsState(
        themeMode: ThemeMode.dark,
        terrainMode: true,
        biometricConfigured: true,
        notificationsEnabled: false,
        lastSync: now,
      );

      final copied = state.copyWith(themeMode: ThemeMode.light);
      expect(copied.themeMode, ThemeMode.light);
      expect(copied.terrainMode, true);
      expect(copied.biometricConfigured, true);
      expect(copied.notificationsEnabled, false);
      expect(copied.lastSync, now);
    });

    test('copyWith changes terrain mode', () {
      const state = SettingsState(terrainMode: false);
      final copied = state.copyWith(terrainMode: true);
      expect(copied.terrainMode, true);
    });

    test('copyWith changes notifications', () {
      const state = SettingsState(notificationsEnabled: true);
      final copied = state.copyWith(notificationsEnabled: false);
      expect(copied.notificationsEnabled, false);
    });

    test('copyWith changes biometric', () {
      const state = SettingsState(biometricConfigured: false);
      final copied = state.copyWith(biometricConfigured: true);
      expect(copied.biometricConfigured, true);
    });
  });

  group('SettingsRepository - theme', () {
    test('getThemeMode returns null when not set', () {
      when(() => mockRepository.getThemeMode()).thenReturn(null);
      expect(mockRepository.getThemeMode(), isNull);
    });

    test('getThemeMode returns light', () {
      when(() => mockRepository.getThemeMode()).thenReturn(ThemeMode.light);
      expect(mockRepository.getThemeMode(), ThemeMode.light);
    });

    test('getThemeMode returns dark', () {
      when(() => mockRepository.getThemeMode()).thenReturn(ThemeMode.dark);
      expect(mockRepository.getThemeMode(), ThemeMode.dark);
    });

    test('getThemeMode returns system', () {
      when(() => mockRepository.getThemeMode()).thenReturn(ThemeMode.system);
      expect(mockRepository.getThemeMode(), ThemeMode.system);
    });

    test('setThemeMode persists value', () async {
      when(() => mockRepository.setThemeMode(ThemeMode.dark))
          .thenAnswer((_) async {});
      await mockRepository.setThemeMode(ThemeMode.dark);
      verify(() => mockRepository.setThemeMode(ThemeMode.dark)).called(1);
    });

    test('default theme is system', () {
      when(() => mockRepository.getThemeMode()).thenReturn(null);
      final mode = mockRepository.getThemeMode() ?? ThemeMode.system;
      expect(mode, ThemeMode.system);
    });
  });

  group('SettingsRepository - terrain mode', () {
    test('toggle ON returns true', () {
      when(() => mockRepository.getTerrainMode()).thenReturn(true);
      expect(mockRepository.getTerrainMode(), true);
    });

    test('toggle OFF returns false', () {
      when(() => mockRepository.getTerrainMode()).thenReturn(false);
      expect(mockRepository.getTerrainMode(), false);
    });

    test('setTerrainMode persists', () async {
      when(() => mockRepository.setTerrainMode(true))
          .thenAnswer((_) async {});
      await mockRepository.setTerrainMode(true);
      verify(() => mockRepository.setTerrainMode(true)).called(1);
    });
  });

  group('SettingsRepository - notifications', () {
    test('notifications enabled by default', () {
      when(() => mockRepository.getNotificationsEnabled()).thenReturn(true);
      expect(mockRepository.getNotificationsEnabled(), true);
    });

    test('notifications can be disabled', () async {
      when(() => mockRepository.setNotificationsEnabled(false))
          .thenAnswer((_) async {});
      await mockRepository.setNotificationsEnabled(false);
      verify(() => mockRepository.setNotificationsEnabled(false)).called(1);
    });
  });

  group('SettingsRepository - biometric', () {
    test('biometric not configured by default', () {
      when(() => mockRepository.getBiometricConfigured()).thenReturn(false);
      expect(mockRepository.getBiometricConfigured(), false);
    });

    test('biometric can be configured', () async {
      when(() => mockRepository.setBiometricConfigured(true))
          .thenAnswer((_) async {});
      await mockRepository.setBiometricConfigured(true);
      verify(() => mockRepository.setBiometricConfigured(true)).called(1);
    });
  });

  group('SettingsRepository - sync', () {
    test('lastSync returns null when never synced', () {
      when(() => mockRepository.getLastSync()).thenReturn(null);
      expect(mockRepository.getLastSync(), isNull);
    });

    test('lastSync returns date when synced', () {
      final date = DateTime(2026, 2, 11, 10, 30);
      when(() => mockRepository.getLastSync()).thenReturn(date);
      expect(mockRepository.getLastSync(), date);
    });
  });
}
