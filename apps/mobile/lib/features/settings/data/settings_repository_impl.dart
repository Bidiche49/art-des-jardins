import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/local/preferences/app_preferences.dart';
import '../domain/settings_repository.dart';

final settingsRepositoryProvider = Provider<SettingsRepository>((ref) {
  return SettingsRepositoryImpl(
    preferences: ref.read(appPreferencesProvider),
  );
});

class SettingsRepositoryImpl implements SettingsRepository {
  SettingsRepositoryImpl({required AppPreferences preferences})
      : _preferences = preferences;

  final AppPreferences _preferences;

  @override
  ThemeMode? getThemeMode() {
    final value = _preferences.themeMode;
    if (value == null) return null;
    switch (value) {
      case 'light':
        return ThemeMode.light;
      case 'dark':
        return ThemeMode.dark;
      case 'system':
        return ThemeMode.system;
      default:
        return null;
    }
  }

  @override
  Future<void> setThemeMode(ThemeMode mode) async {
    final value = switch (mode) {
      ThemeMode.light => 'light',
      ThemeMode.dark => 'dark',
      ThemeMode.system => 'system',
    };
    await _preferences.setThemeMode(value);
  }

  @override
  bool getTerrainMode() => _preferences.terrainMode;

  @override
  Future<void> setTerrainMode(bool enabled) async {
    await _preferences.setTerrainMode(enabled);
  }

  @override
  bool getBiometricConfigured() => _preferences.biometricConfigured;

  @override
  Future<void> setBiometricConfigured(bool configured) async {
    await _preferences.setBiometricConfigured(configured);
  }

  @override
  DateTime? getLastSync() => _preferences.lastSync;

  @override
  bool getNotificationsEnabled() => _preferences.notificationsEnabled;

  @override
  Future<void> setNotificationsEnabled(bool enabled) async {
    await _preferences.setNotificationsEnabled(enabled);
  }
}
